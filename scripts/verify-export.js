/**
 * 客户端导出验证测试脚本
 * 
 * 用法：在浏览器控制台中运行此脚本
 * 
 * 验证流程：
 * 1. 生成一个简单的测试 SVG
 * 2. 调用客户端渲染导出
 * 3. 将 MP4 转换为帧图片
 * 4. 检查帧内容是否正确
 */

const testSvg = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#1a1a2e"/>
  <circle cx="100" cy="100" r="40" fill="#ff6b6b">
    <animate attributeName="r" values="30;50;30" dur="2s" repeatCount="indefinite"/>
  </circle>
  <rect x="20" y="20" width="30" height="30" fill="#4ecdc4">
    <animateTransform attributeName="transform" type="rotate" 
                      values="0 35 35;360 35 35" dur="3s" repeatCount="indefinite"/>
  </rect>
</svg>
`;

async function runVerificationTest() {
    console.log('=== 客户端导出验证测试 ===');
    console.log('1. 测试 SVG:');
    console.log(testSvg);

    // 动态导入 videoExport 模块
    const { exportToMP4Client, downloadBlob } = await import('/src/lib/videoExport.ts');

    console.log('2. 开始客户端导出...');

    try {
        const blob = await exportToMP4Client(testSvg, {
            width: 400,
            height: 400,
            fps: 10,
            duration: 2,
        }, (progress, message) => {
            console.log(`   进度: ${progress}% - ${message}`);
        });

        console.log('3. 导出完成!');
        console.log('   文件大小:', (blob.size / 1024).toFixed(2), 'KB');
        console.log('   MIME类型:', blob.type);

        // 验证 Blob 内容
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // MP4 文件魔数检查 (ftyp)
        const magic = String.fromCharCode(uint8Array[4], uint8Array[5], uint8Array[6], uint8Array[7]);
        console.log('   文件魔数:', magic);

        if (magic === 'ftyp') {
            console.log('   ✅ 文件格式: 有效的 MP4');
        } else {
            console.log('   ❌ 文件格式: 不是有效的 MP4! 魔数应为 ftyp');
        }

        // 下载文件
        console.log('4. 触发下载...');
        downloadBlob(blob, 'verification_test.mp4');

        console.log('=== 测试完成 ===');
        console.log('请检查下载的文件，并使用 FFmpeg 分割成帧查看:');
        console.log('ffmpeg -i verification_test.mp4 -vf fps=10 frame_%03d.png');

        return blob;
    } catch (error) {
        console.error('❌ 导出失败:', error);
        throw error;
    }
}

// 运行测试
runVerificationTest();
