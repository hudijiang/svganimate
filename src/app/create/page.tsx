"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
    Sparkles,
    Download,
    Copy,
    RefreshCw,
    Play,
    Pause,
    Maximize2,
    Code,
    Image as ImageIcon,
    Film,
    Settings,
    X,
    Check
} from "lucide-react";
import {
    exportToMP4,
    downloadBlob,
    RESOLUTION_OPTIONS,
    FPS_OPTIONS,
    DURATION_OPTIONS
} from "@/lib/videoExport";

function CreateContent() {
    const searchParams = useSearchParams();
    const initialPrompt = searchParams.get("prompt") || "";

    const [prompt, setPrompt] = useState(initialPrompt);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

    // MP4 导出状态
    const [showExportModal, setShowExportModal] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [exportMessage, setExportMessage] = useState("");
    const [exportError, setExportError] = useState<string | null>(null);

    // 导出设置
    const [selectedResolution, setSelectedResolution] = useState(RESOLUTION_OPTIONS[0]);
    const [selectedFps, setSelectedFps] = useState(FPS_OPTIONS[1]); // 30 FPS
    const [selectedDuration, setSelectedDuration] = useState(DURATION_OPTIONS[1]); // 5 秒
    const [selectedQuality, setSelectedQuality] = useState<"high" | "medium" | "low">("high");

    // 示例生成的 SVG
    const [generatedSvg, setGeneratedSvg] = useState(`
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <!-- 背景 -->
  <rect width="400" height="400" fill="#0d1117"/>
  
  <!-- 太阳 -->
  <circle cx="200" cy="200" r="40" fill="#FDB813">
    <animate attributeName="r" values="38;42;38" dur="2s" repeatCount="indefinite"/>
  </circle>
  
  <!-- 水星轨道 -->
  <circle cx="200" cy="200" r="70" fill="none" stroke="#2d3748" stroke-width="1"/>
  <circle r="6" fill="#A0AEC0">
    <animateMotion dur="2s" repeatCount="indefinite">
      <mpath href="#mercury-orbit"/>
    </animateMotion>
  </circle>
  <path id="mercury-orbit" d="M 130 200 A 70 70 0 1 1 130 200.001" fill="none"/>
  
  <!-- 金星轨道 -->
  <circle cx="200" cy="200" r="100" fill="none" stroke="#2d3748" stroke-width="1"/>
  <circle r="10" fill="#ECC94B">
    <animateMotion dur="3s" repeatCount="indefinite">
      <mpath href="#venus-orbit"/>
    </animateMotion>
  </circle>
  <path id="venus-orbit" d="M 100 200 A 100 100 0 1 1 100 200.001" fill="none"/>
  
  <!-- 地球轨道 -->
  <circle cx="200" cy="200" r="140" fill="none" stroke="#2d3748" stroke-width="1"/>
  <circle r="12" fill="#3182CE">
    <animateMotion dur="4s" repeatCount="indefinite">
      <mpath href="#earth-orbit"/>
    </animateMotion>
  </circle>
  <path id="earth-orbit" d="M 60 200 A 140 140 0 1 1 60 200.001" fill="none"/>
  
  <!-- 火星轨道 -->
  <circle cx="200" cy="200" r="175" fill="none" stroke="#2d3748" stroke-width="1"/>
  <circle r="8" fill="#E53E3E">
    <animateMotion dur="5.5s" repeatCount="indefinite">
      <mpath href="#mars-orbit"/>
    </animateMotion>
  </circle>
  <path id="mars-orbit" d="M 25 200 A 175 175 0 1 1 25 200.001" fill="none"/>
</svg>
  `);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        // 模拟生成过程
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsGenerating(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedSvg);
    };

    const handleDownloadSvg = () => {
        const blob = new Blob([generatedSvg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "animation.svg";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportMP4 = async () => {
        setIsExporting(true);
        setExportError(null);
        setExportProgress(0);
        setExportMessage("初始化...");

        try {
            const blob = await exportToMP4(
                generatedSvg,
                {
                    width: selectedResolution.width,
                    height: selectedResolution.height,
                    fps: selectedFps.value,
                    duration: selectedDuration.value,
                    quality: selectedQuality,
                },
                (progress, message) => {
                    setExportProgress(progress);
                    setExportMessage(message);
                }
            );

            // 下载文件
            const resolution = selectedResolution.label.split(" ")[0];
            downloadBlob(blob, `animation_${resolution}_${selectedFps.value}fps.mp4`);

            // 短暂显示完成状态
            setExportMessage("导出完成！");
            await new Promise(resolve => setTimeout(resolve, 1500));
            setShowExportModal(false);
        } catch (error) {
            console.error("导出失败:", error);
            setExportError(error instanceof Error ? error.message : "导出过程中发生错误");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="min-h-screen py-4 px-4">
            <div className="max-w-7xl mx-auto">
                {/* 三列布局 */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* 左侧：输入区域 */}
                    <div className="lg:col-span-4">
                        <div className="glass-card rounded-xl p-6 sticky top-24">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-orange-500" />
                                动画描述
                            </h2>

                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={"请描述您想要的动画效果...\n\n示例：\n- 太阳系行星运动动画\n- DNA双螺旋旋转\n- 心脏跳动循环"}
                                className="w-full h-48 p-4 rounded-xl input-dark resize-none text-sm"
                            />

                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !prompt.trim()}
                                className="w-full mt-4 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        生成中...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        生成动画
                                    </>
                                )}
                            </button>

                            {/* 提示历史 */}
                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-stone-400 mb-3">快速示例</h3>
                                <div className="space-y-2">
                                    {[
                                        "太阳系行星运动动画",
                                        "DNA双螺旋结构旋转",
                                        "心脏跳动血液循环",
                                        "齿轮联动机械传动",
                                    ].map((example) => (
                                        <button
                                            key={example}
                                            onClick={() => setPrompt(example)}
                                            className="w-full text-left px-3 py-2 rounded-lg bg-stone-800/50 text-stone-300 text-sm hover:bg-stone-700 transition-colors"
                                        >
                                            {example}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 中间：预览区域 */}
                    <div className="lg:col-span-5">
                        <div className="glass-card rounded-xl overflow-hidden">
                            {/* 标签切换 */}
                            <div className="flex items-center justify-between border-b border-stone-700 px-4">
                                <div className="flex">
                                    <button
                                        onClick={() => setActiveTab("preview")}
                                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "preview"
                                            ? "border-orange-500 text-white"
                                            : "border-transparent text-stone-400 hover:text-white"
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4" />
                                            预览
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("code")}
                                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "code"
                                            ? "border-orange-500 text-white"
                                            : "border-transparent text-stone-400 hover:text-white"
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <Code className="w-4 h-4" />
                                            代码
                                        </span>
                                    </button>
                                </div>

                                {/* 控制按钮 */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="p-2 rounded-lg hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
                                    >
                                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    </button>
                                    <button className="p-2 rounded-lg hover:bg-stone-700 text-stone-400 hover:text-white transition-colors">
                                        <Maximize2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* 内容区域 */}
                            <div className="aspect-square bg-stone-900/50 p-4">
                                {activeTab === "preview" ? (
                                    <div
                                        className="w-full h-full flex items-center justify-center"
                                        dangerouslySetInnerHTML={{ __html: generatedSvg }}
                                    />
                                ) : (
                                    <pre className="w-full h-full overflow-auto text-xs text-stone-300 font-mono">
                                        {generatedSvg}
                                    </pre>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 右侧：操作区域 */}
                    <div className="lg:col-span-3">
                        <div className="glass-card rounded-xl p-6 sticky top-24">
                            <h2 className="text-lg font-semibold text-white mb-4">导出选项</h2>

                            <div className="space-y-3">
                                {/* 下载 SVG */}
                                <button
                                    onClick={handleDownloadSvg}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-700 text-white font-medium hover:bg-stone-600 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    下载 SVG
                                </button>

                                {/* 导出 MP4 */}
                                <button
                                    onClick={() => setShowExportModal(true)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:from-orange-400 hover:to-pink-400 transition-all"
                                >
                                    <Film className="w-4 h-4" />
                                    导出 4K MP4
                                </button>

                                <button
                                    onClick={handleCopy}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-700 text-white font-medium hover:bg-stone-600 transition-colors"
                                >
                                    <Copy className="w-4 h-4" />
                                    复制代码
                                </button>
                            </div>

                            {/* 动画信息 */}
                            <div className="mt-6 pt-6 border-t border-stone-700">
                                <h3 className="text-sm font-medium text-stone-400 mb-3">动画信息</h3>
                                <dl className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-stone-500">格式</dt>
                                        <dd className="text-white">SVG</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-stone-500">尺寸</dt>
                                        <dd className="text-white">400 × 400</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-stone-500">分辨率</dt>
                                        <dd className="text-white">矢量（无限）</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* MP4 导出模态框 */}
            {showExportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
                    <div className="glass-card rounded-2xl w-full max-w-md p-6 relative">
                        {/* 关闭按钮 */}
                        {!isExporting && (
                            <button
                                onClick={() => setShowExportModal(false)}
                                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}

                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Film className="w-6 h-6 text-orange-500" />
                            导出 MP4 视频
                        </h3>

                        {!isExporting ? (
                            <>
                                {/* 设置选项 */}
                                <div className="space-y-4">
                                    {/* 分辨率 */}
                                    <div>
                                        <label className="block text-sm font-medium text-stone-300 mb-2">
                                            分辨率
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {RESOLUTION_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.label}
                                                    onClick={() => setSelectedResolution(opt)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedResolution === opt
                                                        ? "bg-orange-500 text-white"
                                                        : "bg-stone-700 text-stone-300 hover:bg-stone-600"
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 帧率 */}
                                    <div>
                                        <label className="block text-sm font-medium text-stone-300 mb-2">
                                            帧率
                                        </label>
                                        <div className="flex gap-2">
                                            {FPS_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setSelectedFps(opt)}
                                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedFps === opt
                                                        ? "bg-orange-500 text-white"
                                                        : "bg-stone-700 text-stone-300 hover:bg-stone-600"
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 时长 */}
                                    <div>
                                        <label className="block text-sm font-medium text-stone-300 mb-2">
                                            视频时长
                                        </label>
                                        <div className="grid grid-cols-5 gap-2">
                                            {DURATION_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setSelectedDuration(opt)}
                                                    className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${selectedDuration === opt
                                                        ? "bg-orange-500 text-white"
                                                        : "bg-stone-700 text-stone-300 hover:bg-stone-600"
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 质量 */}
                                    <div>
                                        <label className="block text-sm font-medium text-stone-300 mb-2">
                                            视频质量
                                        </label>
                                        <div className="flex gap-2">
                                            {(["high", "medium", "low"] as const).map((q) => (
                                                <button
                                                    key={q}
                                                    onClick={() => setSelectedQuality(q)}
                                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedQuality === q
                                                        ? "bg-orange-500 text-white"
                                                        : "bg-stone-700 text-stone-300 hover:bg-stone-600"
                                                        }`}
                                                >
                                                    {q === "high" ? "高质量" : q === "medium" ? "中等" : "低质量"}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 预估信息 */}
                                <div className="mt-4 p-3 rounded-lg bg-stone-800/50 text-sm text-stone-400">
                                    <div className="flex justify-between">
                                        <span>预估帧数</span>
                                        <span className="text-white">{selectedFps.value * selectedDuration.value} 帧</span>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span>输出尺寸</span>
                                        <span className="text-white">{selectedResolution.width}×{selectedResolution.height}</span>
                                    </div>
                                </div>

                                {/* 错误信息 */}
                                {exportError && (
                                    <div className="mt-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                                        {exportError}
                                    </div>
                                )}

                                {/* 开始导出按钮 */}
                                <button
                                    onClick={handleExportMP4}
                                    className="w-full mt-6 btn-primary flex items-center justify-center gap-2"
                                >
                                    <Film className="w-4 h-4" />
                                    开始导出
                                </button>
                            </>
                        ) : (
                            /* 导出进度 */
                            <div className="py-4">
                                <div className="flex items-center gap-3 mb-4">
                                    {exportProgress < 100 ? (
                                        <RefreshCw className="w-6 h-6 text-orange-500 animate-spin" />
                                    ) : (
                                        <Check className="w-6 h-6 text-green-500" />
                                    )}
                                    <span className="text-white font-medium">{exportMessage}</span>
                                </div>

                                {/* 进度条 */}
                                <div className="w-full h-3 bg-stone-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-300"
                                        style={{ width: `${exportProgress}%` }}
                                    />
                                </div>
                                <div className="text-right text-sm text-stone-400 mt-2">
                                    {Math.round(exportProgress)}%
                                </div>

                                <p className="text-xs text-stone-500 mt-4 text-center">
                                    首次加载 FFmpeg 可能需要较长时间，请耐心等待...
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CreatePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        }>
            <CreateContent />
        </Suspense>
    );
}
