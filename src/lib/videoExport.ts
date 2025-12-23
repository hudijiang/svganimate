import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

type ProgressCallback = (progress: number, message: string) => void;

interface ExportOptions {
    width?: number;
    height?: number;
    fps?: number;
    duration?: number;
    quality?: 'high' | 'medium' | 'low';
}

// 默认 4K 分辨率
const DEFAULT_OPTIONS: Required<ExportOptions> = {
    width: 3840,
    height: 2160,
    fps: 30,
    duration: 5, // 秒
    quality: 'high',
};

// 质量预设
const QUALITY_PRESETS = {
    high: { crf: 18, preset: 'slow' },
    medium: { crf: 23, preset: 'medium' },
    low: { crf: 28, preset: 'fast' },
};

let ffmpeg: FFmpeg | null = null;
let loaded = false;

/**
 * 加载 FFmpeg
 */
export async function loadFFmpeg(onProgress?: ProgressCallback): Promise<FFmpeg> {
    if (ffmpeg && loaded) {
        return ffmpeg;
    }

    ffmpeg = new FFmpeg();

    ffmpeg.on('log', ({ message }) => {
        console.log('[FFmpeg]', message);
    });

    ffmpeg.on('progress', ({ progress }) => {
        onProgress?.(progress * 100, '编码中...');
    });

    onProgress?.(0, '加载 FFmpeg...');

    // 加载 FFmpeg 核心
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    loaded = true;
    onProgress?.(5, 'FFmpeg 已加载');

    return ffmpeg;
}

/**
 * 将 SVG 字符串渲染到 Canvas 并返回 PNG 数据
 */
async function svgToCanvas(
    svgString: string,
    width: number,
    height: number
): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            reject(new Error('无法创建 Canvas 上下文'));
            return;
        }

        // 创建 SVG Blob
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
            // 清除画布并绘制
            ctx.fillStyle = '#0d1117';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            URL.revokeObjectURL(url);
            resolve(canvas);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('SVG 加载失败'));
        };
        img.src = url;
    });
}

/**
 * 从 Canvas 获取 PNG 数据
 */
function canvasToPng(canvas: HTMLCanvasElement): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            async (blob) => {
                if (!blob) {
                    reject(new Error('无法生成 PNG'));
                    return;
                }
                const arrayBuffer = await blob.arrayBuffer();
                resolve(new Uint8Array(arrayBuffer));
            },
            'image/png',
            1.0
        );
    });
}

/**
 * 捕获 SVG 动画帧
 */
async function captureFrames(
    svgString: string,
    options: Required<ExportOptions>,
    onProgress?: ProgressCallback
): Promise<Uint8Array[]> {
    const { width, height, fps, duration } = options;
    const totalFrames = fps * duration;
    const frames: Uint8Array[] = [];

    onProgress?.(5, `准备捕获 ${totalFrames} 帧...`);

    // 创建一个隐藏的容器来渲染 SVG 动画
    const container = document.createElement('div');
    container.style.cssText = 'position: fixed; top: -9999px; left: -9999px; width: 100px; height: 100px;';
    document.body.appendChild(container);

    try {
        for (let i = 0; i < totalFrames; i++) {
            const canvas = await svgToCanvas(svgString, width, height);
            const pngData = await canvasToPng(canvas);
            frames.push(pngData);

            const progress = 5 + ((i + 1) / totalFrames) * 35;
            onProgress?.(progress, `捕获帧 ${i + 1}/${totalFrames}`);
        }
    } finally {
        document.body.removeChild(container);
    }

    return frames;
}

/**
 * 将 SVG 动画导出为 4K MP4 视频
 */
export async function exportToMP4(
    svgString: string,
    options: ExportOptions = {},
    onProgress?: ProgressCallback
): Promise<Blob> {
    const opts: Required<ExportOptions> = { ...DEFAULT_OPTIONS, ...options };
    const { width, height, fps, quality } = opts;
    const qualitySettings = QUALITY_PRESETS[quality];

    onProgress?.(0, '初始化...');

    // 加载 FFmpeg
    const ff = await loadFFmpeg(onProgress);

    // 捕获帧
    const frames = await captureFrames(svgString, opts, onProgress);

    onProgress?.(40, '写入帧数据...');

    // 将帧写入 FFmpeg 虚拟文件系统
    for (let i = 0; i < frames.length; i++) {
        const fileName = `frame_${String(i).padStart(5, '0')}.png`;
        await ff.writeFile(fileName, frames[i]);

        const progress = 40 + ((i + 1) / frames.length) * 20;
        onProgress?.(progress, `写入帧 ${i + 1}/${frames.length}`);
    }

    onProgress?.(60, '开始编码 MP4...');

    // 运行 FFmpeg 命令: 将 PNG 序列编码为 MP4
    await ff.exec([
        '-framerate', String(fps),
        '-i', 'frame_%05d.png',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-crf', String(qualitySettings.crf),
        '-preset', qualitySettings.preset,
        '-s', `${width}x${height}`,
        '-y',
        'output.mp4'
    ]);

    onProgress?.(95, '读取输出文件...');

    // 读取输出文件
    const data = await ff.readFile('output.mp4');

    // 清理临时文件
    for (let i = 0; i < frames.length; i++) {
        const fileName = `frame_${String(i).padStart(5, '0')}.png`;
        await ff.deleteFile(fileName);
    }
    await ff.deleteFile('output.mp4');

    onProgress?.(100, '导出完成！');

    // 转换为 Blob
    // @ts-expect-error ffmpeg.wasm 返回的 Uint8Array 在运行时是有效的 BlobPart
    return new Blob([data], { type: 'video/mp4' });
}

/**
 * 下载 Blob 为文件
 */
export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * 获取可用的分辨率选项
 */
export const RESOLUTION_OPTIONS = [
    { label: '4K (3840×2160)', width: 3840, height: 2160 },
    { label: '2K (2560×1440)', width: 2560, height: 1440 },
    { label: '1080p (1920×1080)', width: 1920, height: 1080 },
    { label: '720p (1280×720)', width: 1280, height: 720 },
];

/**
 * 获取可用的帧率选项
 */
export const FPS_OPTIONS = [
    { label: '60 FPS', value: 60 },
    { label: '30 FPS', value: 30 },
    { label: '24 FPS', value: 24 },
];

/**
 * 获取可用的时长选项
 */
export const DURATION_OPTIONS = [
    { label: '3 秒', value: 3 },
    { label: '5 秒', value: 5 },
    { label: '10 秒', value: 10 },
    { label: '15 秒', value: 15 },
    { label: '30 秒', value: 30 },
];
