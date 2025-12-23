import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink, readFile, rm } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runPuppeteerCapture(options: {
    svgContent: string;
    duration: number;
    fps: number;
    width: number;
    height: number;
}): Promise<Buffer> {
    const { svgContent, duration, fps, width, height } = options;
    const totalFrames = duration * fps;

    // 创建临时目录
    const tempDir = join(process.cwd(), 'tmp');
    if (!existsSync(tempDir)) {
        await mkdir(tempDir, { recursive: true });
    }

    const id = randomUUID();
    const htmlPath = join(tempDir, `${id}.html`);
    const framesDir = join(tempDir, `frames-${id}`);
    const outputPath = join(tempDir, `${id}.mp4`);

    await mkdir(framesDir, { recursive: true });

    try {
        // 创建 HTML 文件 - 使用 CSS animation-play-state 控制动画
        const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: ${width}px;
      height: ${height}px;
      background: #0d1117;
      overflow: hidden;
    }
    body {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    svg {
      max-width: 100%;
      max-height: 100%;
    }
  </style>
</head>
<body>
  ${svgContent}
  <script>
    // 获取 SVG 元素并设置时间控制
    window.setAnimationTime = function(timeMs) {
      const svg = document.querySelector('svg');
      if (svg && svg.setCurrentTime) {
        svg.setCurrentTime(timeMs / 1000);
      }
    };
    
    // 暂停动画
    window.pauseAnimation = function() {
      const svg = document.querySelector('svg');
      if (svg && svg.pauseAnimations) {
        svg.pauseAnimations();
      }
    };
    
    // 继续动画
    window.unpauseAnimation = function() {
      const svg = document.querySelector('svg');
      if (svg && svg.unpauseAnimations) {
        svg.unpauseAnimations();
      }
    };
  </script>
</body>
</html>`;

        await writeFile(htmlPath, htmlContent, 'utf-8');
        console.log('HTML created:', htmlPath);

        // 动态导入 puppeteer
        const puppeteer = (await import('puppeteer')).default;

        // 启动浏览器
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
            ],
        });

        const page = await browser.newPage();
        await page.setViewport({ width, height });
        await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

        // 暂停动画初始状态
        await page.evaluate(() => {
            // @ts-ignore
            if (window.pauseAnimation) window.pauseAnimation();
        });

        console.log(`Capturing ${totalFrames} frames at ${fps} fps...`);

        // 逐帧截图 - 通过设置精确时间点
        for (let i = 0; i < totalFrames; i++) {
            const timeMs = (i / fps) * 1000; // 当前帧对应的时间（毫秒）

            // 设置动画到指定时间点
            await page.evaluate((t) => {
                // @ts-ignore
                if (window.setAnimationTime) window.setAnimationTime(t);
            }, timeMs);

            // 等待一小段时间让渲染完成
            await new Promise(resolve => setTimeout(resolve, 10));

            // 截图
            const framePath = join(framesDir, `frame_${String(i).padStart(5, '0')}.png`);
            await page.screenshot({ path: framePath, type: 'png' });

            if (i % 30 === 0) {
                console.log(`Frame ${i + 1}/${totalFrames} (t=${(timeMs / 1000).toFixed(2)}s)`);
            }
        }

        await browser.close();
        console.log('Browser closed, starting ffmpeg...');

        // 使用 ffmpeg 将帧合成视频
        const ffmpegCmd = `ffmpeg -y -framerate ${fps} -i "${framesDir}/frame_%05d.png" -c:v libx264 -pix_fmt yuv420p -preset ultrafast -crf 23 "${outputPath}"`;

        console.log('FFmpeg command:', ffmpegCmd);

        await execAsync(ffmpegCmd);

        if (!existsSync(outputPath)) {
            throw new Error('FFmpeg failed to create video');
        }

        const videoBuffer = await readFile(outputPath);
        console.log('Video size:', (videoBuffer.length / 1024 / 1024).toFixed(2), 'MB');

        return videoBuffer;
    } finally {
        // 清理临时文件
        try {
            if (existsSync(htmlPath)) await unlink(htmlPath);
            if (existsSync(outputPath)) await unlink(outputPath);
            if (existsSync(framesDir)) await rm(framesDir, { recursive: true });
        } catch (e) {
            console.warn('Cleanup error:', e);
        }
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            svgContent,
            duration = 5,
            fps = 30,
            width = 1920,
            height = 1080
        } = body;

        if (!svgContent) {
            return NextResponse.json(
                { error: '缺少 SVG 内容' },
                { status: 400 }
            );
        }

        console.log(`Export video: ${duration}s @ ${fps}fps, ${width}x${height}`);

        const videoBuffer = await runPuppeteerCapture({
            svgContent,
            duration,
            fps,
            width,
            height,
        });

        return new NextResponse(videoBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'video/mp4',
                'Content-Disposition': 'attachment; filename="animation.mp4"',
                'Content-Length': String(videoBuffer.length),
            },
        });
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Export failed' },
            { status: 500 }
        );
    }
}
