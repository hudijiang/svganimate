/**
 * 视频导出工具库 V6 (DOM 快照合成方案)
 * 
 * 核心逻辑：
 * 1. 挂载：将 SVG 挂载到不可见 DOM 中。
 * 2. 步进：使用 svg.setCurrentTime(t) 精确控制动画时间。
 * 3. 快照：在每个时间点，深度克隆 SVG 树。
 *    - 烘焙 Computed Styles (transform, opacity, fill, stroke...)
 *    - 烘焙 SVG animVal (cx, cy, r, x, y...)
 *    - 移除动画标签 (使快照静态化)
 * 4. 渲染：序列化快照 -> Image -> Canvas -> FFmpeg。
 * 
 * 优点：所见即所得，理论上支持浏览器能渲染的任何 SVG 动画 (CSS/SMIL)。
 */

type ProgressCallback = (progress: number, message: string) => void;

interface ExportOptions {
    width?: number;
    height?: number;
    fps?: number;
    duration?: number;
    quality?: 'high' | 'medium' | 'low';
}

const DEFAULT_OPTIONS: Required<ExportOptions> = {
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 5,
    quality: 'high',
};

// ==========================================
// FFmpeg (保持不变)
// ==========================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ffmpegInstance: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ffmpegLoadingPromise: Promise<any> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadFFmpeg(onProgress?: ProgressCallback): Promise<any> {
    if (ffmpegInstance) return ffmpegInstance;
    if (ffmpegLoadingPromise) return ffmpegLoadingPromise;

    ffmpegLoadingPromise = (async () => {
        try {
            onProgress?.(10, '加载动效引擎...');
            const { FFmpeg } = await import('@ffmpeg/ffmpeg');
            const { toBlobURL } = await import('@ffmpeg/util');

            const ffmpeg = new FFmpeg();
            // 启用日志以便调试
            ffmpeg.on('log', ({ message }: { message: string }) => console.log('[FFmpeg]', message));

            // 添加进度监听器
            ffmpeg.on('progress', ({ progress }: { progress: number }) => {
                // 将 FFmpeg 进度 (0-1) 映射到 80-92% 范围
                const mappedProgress = 80 + (progress * 12);
                // 使用存储的进度回调
                if (typeof window !== 'undefined' && (window as unknown as { __ffmpegProgressCallback?: ProgressCallback }).__ffmpegProgressCallback) {
                    (window as unknown as { __ffmpegProgressCallback?: ProgressCallback }).__ffmpegProgressCallback?.(
                        Math.min(92, mappedProgress),
                        `编码中... ${Math.round(progress * 100)}%`
                    );
                }
            });

            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
            const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript');
            const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm');

            await ffmpeg.load({ coreURL, wasmURL });
            ffmpegInstance = ffmpeg;
            return ffmpeg;
        } catch (error) {
            console.error('FFmpeg load failed', error);
            ffmpegLoadingPromise = null;
            throw error;
        }
    })();
    return ffmpegLoadingPromise;
}

// ==========================================
// DOM 快照核心 (V6 Secret Sauce)
// ==========================================

// 需要烘焙的 CSS 属性
const COMPUTED_STYLES_TO_BAKE = [
    'transform', 'transform-origin',
    'opacity', 'visibility', 'display',
    'fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-dashoffset',
    'font-size', 'font-family', 'font-weight', 'text-anchor'
];

// 需要烘焙的 SVG 属性 (检查 animVal)
const SVG_ANIM_ATTRS = [
    'x', 'y', 'cx', 'cy', 'r', 'rx', 'ry', 'width', 'height', 'd', 'fill', 'stroke', 'transform' // transform 既可以是 attr 也可以是 style
];

/**
 * 深度克隆节点，并“烘焙”当前的动画状态到静态属性/样式中
 */
function snapshotNode(node: Node): Node {
    // 浅拷贝当前节点
    const clone = node.cloneNode(false);

    // 如果是元素节点，进行烘焙
    if (node instanceof Element && clone instanceof Element) {
        // 1. 烘焙 Computed Styles
        // 这一步捕获 CSS 动画和 animateTransform 的结果 (在 Chrome 中)
        const computed = window.getComputedStyle(node);

        // 优化：只有当节点可见时才处理复杂样式
        if (computed.display !== 'none') {
            // 我们只复制关键样式，复制所有 style 会导致体积爆炸且可能有副作用
            COMPUTED_STYLES_TO_BAKE.forEach(prop => {
                // ⚠️ 跳过 visibility 和 display！这些属性会从隐藏容器继承，导致渲染失败
                if (prop === 'visibility' || prop === 'display') {
                    return;
                }

                const val = computed.getPropertyValue(prop);
                // 只有当值不是默认值时才设置 (简单的优化)
                if (val && val !== 'none' && val !== 'auto' && val !== '0px') {
                    // 特殊处理 transform
                    // getComputedStyle 返回的是矩阵 matrix(...)
                    // 我们直接将其写入 style 属性
                    (clone as HTMLElement).style.setProperty(prop, val);
                }
            });
        }

        // 2. 烘焙 SVG animVal
        // 这一步捕获 SMIL <animate> 修改的属性 (如 cx, r)
        // 注意：Web 动画 API 或 CSS 动画通常反映在 computedStyles 中，但 SMIL 有时直接修改 animVal

        // TypeScript don't know indiscriminately about SVGElement properties
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const svgNode = node as any;

        SVG_ANIM_ATTRS.forEach(attr => {
            if (svgNode[attr] && 'animVal' in svgNode[attr]) {
                try {
                    const animVal = svgNode[attr].animVal;

                    // 特殊处理 transform 属性 (SVGTransformList)
                    if (attr === 'transform' && animVal && typeof animVal.consolidate === 'function') {
                        // SVGTransformList 需要转换为 CSS transform 字符串
                        if (animVal.numberOfItems > 0) {
                            const consolidated = animVal.consolidate();
                            if (consolidated) {
                                const matrix = consolidated.matrix;
                                // 使用 matrix() 格式
                                const transformStr = `matrix(${matrix.a}, ${matrix.b}, ${matrix.c}, ${matrix.d}, ${matrix.e}, ${matrix.f})`;
                                clone.setAttribute('transform', transformStr);
                            }
                        }
                        return; // 跳过通用处理
                    }

                    // 通用处理：SVGLength, SVGAnimatedLength 等
                    let val = animVal;
                    if (val && typeof val === 'object' && 'value' in val) {
                        val = val.value;
                    }
                    // 写入克隆节点的属性
                    if (val !== undefined && val !== null && typeof val !== 'object') {
                        clone.setAttribute(attr, String(val));
                    }
                } catch (e) {
                    // Ignore access errors
                }
            }
        });

        // 3. 特殊处理 animateMotion：使用 getCTM() 捕获完整变换
        // animateMotion 会在元素上产生一个隐式的变换，这个变换不会反映在 transform 属性中
        // 但会反映在 getCTM() 返回的矩阵中
        if (node instanceof SVGGraphicsElement && node.querySelector('animateMotion')) {
            try {
                // 获取当前的变换矩阵（包含 animateMotion 的效果）
                const ctm = node.getCTM();
                const parentCTM = (node.parentNode as SVGGraphicsElement)?.getCTM?.();

                if (ctm && parentCTM) {
                    // 计算相对于父元素的局部变换
                    const parentInverse = parentCTM.inverse();
                    const localMatrix = parentInverse.multiply(ctm);

                    // 将变换烘焙到元素上
                    const transformStr = `matrix(${localMatrix.a}, ${localMatrix.b}, ${localMatrix.c}, ${localMatrix.d}, ${localMatrix.e}, ${localMatrix.f})`;
                    clone.setAttribute('transform', transformStr);
                }
            } catch (e) {
                console.warn('[Export] 无法获取 animateMotion 变换:', e);
            }
        }

        // 3. 移除动画标签，防止它们在静态 SVG 中再次运行
        if (['animate', 'animateMotion', 'animateTransform', 'set'].includes(clone.tagName)) {
            // 返回空文本节点代替，或者允许它存在但不生效
            // 最好是移除，但我们在递归中不好移除 self。
            // 实际上我们可以在最后序列化时过滤，或者在这里做标记。
            // 简单策略：不处理 children 就行？不，它本身存在可能就有副作用。
            // 标记 remove
            clone.setAttribute('data-remove', 'true');
        }
    }

    // 递归处理子节点
    let child = node.firstChild;
    while (child) {
        const clonedChild = snapshotNode(child);
        // 检查是否应该添加这个克隆节点
        // 1. 如果是文本节点或没有 getAttribute 方法，直接添加
        // 2. 如果是元素节点且没有 data-remove 标记，添加
        const shouldAppend =
            !(clonedChild instanceof Element) ||
            !clonedChild.getAttribute('data-remove');

        if (shouldAppend) {
            clone.appendChild(clonedChild);
        }
        child = child.nextSibling;
    }

    return clone;
}

// ==========================================
// 帧捕捉逻辑
// ==========================================
async function captureFrames(
    svgString: string,
    options: Required<ExportOptions>,
    onProgress?: ProgressCallback
): Promise<Uint8Array[]> { // 返回 JPEG/PNG buffer 数组
    const { width, height, fps, duration } = options;
    const totalFrames = Math.ceil(duration * fps);
    const frames: Uint8Array[] = [];

    // 1. 创建容器和 live SVG
    const container = document.createElement('div');
    container.style.cssText = `position:absolute;top:-9999px;left:-9999px;width:${width}px;height:${height}px;visibility:hidden;overflow:hidden;`;
    container.innerHTML = svgString;
    document.body.appendChild(container);

    const svgEl = container.querySelector('svg');
    if (!svgEl) throw new Error('Invalid SVG');

    // 只设置输出尺寸，保留原始 viewBox 以确保正确缩放
    // 如果原始 SVG 没有 viewBox，则基于其原始 width/height 创建
    if (!svgEl.getAttribute('viewBox')) {
        const origWidth = svgEl.getAttribute('width') || '400';
        const origHeight = svgEl.getAttribute('height') || '400';
        svgEl.setAttribute('viewBox', `0 0 ${origWidth.replace(/[^0-9.]/g, '')} ${origHeight.replace(/[^0-9.]/g, '')}`);
    }
    // 设置输出尺寸（浏览器会自动缩放 viewBox 内容以适应）
    svgEl.setAttribute('width', width.toString());
    svgEl.setAttribute('height', height.toString());

    // 等待 DOM 准备就绪
    await new Promise(r => setTimeout(r, 50));

    // 2. 准备 Canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // 3. 暂停动画 (必须在此操作)
    if (svgEl.pauseAnimations) {
        svgEl.pauseAnimations();
        svgEl.setCurrentTime(0);
    }

    try {
        for (let i = 0; i < totalFrames; i++) {
            const t = i / fps;

            // A. 设置时间
            if (svgEl.setCurrentTime) {
                svgEl.setCurrentTime(t);
            }

            // B. 快照 (The Bake)
            const clonedSvgNode = snapshotNode(svgEl) as Element;

            // 确保克隆体有命名空间
            clonedSvgNode.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

            // 序列化
            const frameSvgString = new XMLSerializer().serializeToString(clonedSvgNode);

            // C. 渲染到 Canvas
            const img = new Image();
            const blob = new Blob([frameSvgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            await new Promise<void>((resolve, reject) => {
                img.onload = () => {
                    ctx?.clearRect(0, 0, width, height);
                    // 绘制背景 (必须填充，因为 JPEG 不支持透明度)
                    // 尝试从 SVG 提取背景色，默认使用深色
                    ctx!.fillStyle = '#0d1117'; // 匹配 SVG 中的背景色
                    ctx!.fillRect(0, 0, width, height);

                    ctx?.drawImage(img, 0, 0, width, height);

                    resolve();
                };
                img.onerror = (e) => {
                    console.error(`[Export] 帧 ${i} 图片加载失败:`, e);
                    reject(new Error(`帧 ${i} 渲染失败`));
                };
                img.src = url;
            });

            URL.revokeObjectURL(url);

            // D. 获取数据
            // 使用 JPEG 质量低一点换速度？不，MP4 需要清晰度。
            // 使用 getImageData 太大。使用 canvas.toBlob? 
            // 实际上为了传给 ffmpeg，我们需要 Uint8Array。
            // 我们可以直接用 canvas.toBlob('image/jpeg', 0.9)

            const frameBlob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/jpeg', 0.9));
            if (frameBlob) {
                frames.push(new Uint8Array(await frameBlob.arrayBuffer()));
            }

            // 进度
            const p = i / totalFrames;
            onProgress?.(10 + Math.round(p * 50), `渲染帧 ${i + 1}/${totalFrames}`);

            // 让出主线程，防止 UI 卡死 (每帧都让步)
            await new Promise(r => setTimeout(r, 0));
        }
    } finally {
        document.body.removeChild(container);
    }

    return frames;
}

// ==========================================
// 主过程
// ==========================================

export async function exportToMP4Client(
    svgString: string,
    options: ExportOptions = {},
    onProgress?: ProgressCallback
): Promise<Blob> {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    try {
        // 1. 加载 FFmpeg
        const ff = await loadFFmpeg(onProgress);

        // 2. 逐帧渲染
        onProgress?.(0, '开始逐帧渲染 (高精度模式)...');
        const frames = await captureFrames(svgString, opts, onProgress);

        // 3. 写入 FFmpeg FS
        onProgress?.(60, '写入帧数据...');
        console.log(`[Export] 准备写入 ${frames.length} 帧`);

        for (let i = 0; i < frames.length; i++) {
            const fname = `frame_${String(i).padStart(3, '0')}.jpg`;
            console.log(`[Export] 帧 ${i}: ${frames[i].length} 字节`);
            if (frames[i].length < 100) {
                console.error(`[Export] 警告: 帧 ${i} 数据异常小!`);
            }
            await ff.writeFile(fname, frames[i]);
        }

        // 4. 合成
        onProgress?.(80, '合成 MP4...');

        // 设置全局进度回调引用，供 FFmpeg progress 事件使用
        if (typeof window !== 'undefined') {
            (window as unknown as { __ffmpegProgressCallback?: ProgressCallback }).__ffmpegProgressCallback = onProgress;
        }

        await ff.exec([
            '-framerate', String(opts.fps),
            '-i', 'frame_%03d.jpg',
            '-c:v', 'libx264',
            '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart', // 将 moov 原子移到文件开头，提高兼容性
            '-y',
            'output.mp4'
        ]);

        // 清理全局回调引用
        if (typeof window !== 'undefined') {
            delete (window as unknown as { __ffmpegProgressCallback?: ProgressCallback }).__ffmpegProgressCallback;
        }

        // 5. 读取
        const data = await ff.readFile('output.mp4');
        console.log(`[Export] MP4 文件大小: ${data.byteLength} 字节`);
        if (data.byteLength < 10000) {
            console.error(`[Export] 警告: MP4 文件异常小! 可能是编码失败。`);
        }
        const blob = new Blob([data], { type: 'video/mp4' });

        // 清理
        onProgress?.(95, '清理临时文件...');
        for (let i = 0; i < frames.length; i++) {
            await ff.deleteFile(`frame_${String(i).padStart(3, '0')}.jpg`);
        }
        await ff.deleteFile('output.mp4');

        onProgress?.(100, '完成！');
        return blob;

    } catch (err) {
        console.error('Snapshot export failed', err);
        throw err;
    }
}

// ==========================================
// 辅助与兼容 (保持不变)
// ==========================================
export async function exportToMP4Server(
    svgString: string,
    options: ExportOptions = {},
    onProgress?: ProgressCallback
): Promise<Blob> {
    const opts: Required<ExportOptions> = { ...DEFAULT_OPTIONS, ...options };

    onProgress?.(0, '发送到服务器...');

    const response = await fetch('/api/export-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            svgContent: svgString,
            duration: opts.duration,
            fps: opts.fps,
            width: opts.width,
            height: opts.height,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '服务器错误');
    }

    onProgress?.(80, '下载视频...');
    const blob = await response.blob();
    onProgress?.(100, '完成！');
    return blob;
}

export async function exportToMP4(
    svgString: string,
    options: ExportOptions = {},
    onProgress?: ProgressCallback,
    mode: 'server' | 'client' = 'server'
): Promise<Blob> {
    if (mode === 'client') {
        return exportToMP4Client(svgString, options, onProgress);
    }
    return exportToMP4Server(svgString, options, onProgress);
}

export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.replace(/\.(mp4|webm)$/, '') + '.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export const RESOLUTION_OPTIONS = [
    { label: '4K (3840×2160)', width: 3840, height: 2160 },
    { label: '2K (2560×1440)', width: 2560, height: 1440 },
    { label: '1080p (1920×1080)', width: 1920, height: 1080 },
    { label: '720p (1280×720)', width: 1280, height: 720 },
];

export const FPS_OPTIONS = [
    { label: '60 FPS', value: 60 },
    { label: '30 FPS', value: 30 },
    { label: '24 FPS', value: 24 },
];

export const DURATION_OPTIONS = [
    { label: '3 秒', value: 3 },
    { label: '5 秒', value: 5 },
    { label: '10 秒', value: 10 },
    { label: '15 秒', value: 15 },
    { label: '30 秒', value: 30 },
];
