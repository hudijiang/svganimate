"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    Heart,
    Eye,
    Download,
    Copy,
    Share2,
    Play,
    Pause,
    Maximize2,
    Code,
    Image as ImageIcon,
    Film,
    Loader2
} from "lucide-react";
import { getAnimationById, AnimationMeta } from "@/data/animations";

export default function AnimationDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
    const [isPlaying, setIsPlaying] = useState(true);
    const [copied, setCopied] = useState(false);
    const [svgCode, setSvgCode] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    const animation = getAnimationById(id);

    // 动态加载 SVG 文件
    useEffect(() => {
        async function loadSvg() {
            if (!animation?.svgFile) {
                setSvgCode(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#0d1117"/>
  <circle cx="100" cy="100" r="40" fill="#F97316">
    <animate attributeName="r" values="35;45;35" dur="2s" repeatCount="indefinite"/>
  </circle>
</svg>`);
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(animation.svgFile);
                const text = await response.text();
                setSvgCode(text);
            } catch (error) {
                console.error("Failed to load SVG:", error);
                setSvgCode(`<svg viewBox="0 0 200 200"><text x="100" y="100" text-anchor="middle" fill="white">加载失败</text></svg>`);
            } finally {
                setIsLoading(false);
            }
        }

        loadSvg();
    }, [animation?.svgFile]);

    // 默认动画数据
    const displayAnimation: AnimationMeta = animation || {
        id: id,
        title: `动画 #${id}`,
        description: "这是一个 AI 生成的 SVG 动画示例。",
        svgFile: "",
        likes: 100,
        views: 500,
        author: "AI Generator",
        createdAt: "2025-12-20",
        category: "其他"
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(svgCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([svgCode], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `animation-${id}.svg`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportMP4 = () => {
        // 将 SVG 代码传递到创作工作区进行 MP4 导出
        const encodedSvg = encodeURIComponent(svgCode);
        window.location.href = `/create?svg=${encodedSvg}`;
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* 返回按钮 */}
                <Link
                    href="/gallery"
                    className="inline-flex items-center gap-2 text-stone-400 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    返回案例列表
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 左侧：预览区域 */}
                    <div className="lg:col-span-2">
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
                            <div className="aspect-video bg-stone-900/50 p-8 flex items-center justify-center">
                                {isLoading ? (
                                    <div className="flex items-center gap-2 text-stone-400">
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span>加载中...</span>
                                    </div>
                                ) : activeTab === "preview" ? (
                                    <div
                                        className="w-full h-full flex items-center justify-center"
                                        dangerouslySetInnerHTML={{ __html: svgCode }}
                                    />
                                ) : (
                                    <pre className="w-full h-full overflow-auto text-xs text-stone-300 font-mono p-4 bg-stone-800/50 rounded-lg">
                                        {svgCode}
                                    </pre>
                                )}
                            </div>
                        </div>

                        {/* 描述区域 */}
                        <div className="glass-card rounded-xl p-6 mt-6">
                            <h1 className="text-xl font-bold text-white mb-3">
                                {displayAnimation.title}
                            </h1>
                            <p className="text-stone-400 text-sm leading-relaxed">
                                {displayAnimation.description}
                            </p>

                            <div className="flex flex-wrap gap-4 mt-4 text-sm text-stone-500">
                                <span>作者: {displayAnimation.author}</span>
                                <span>•</span>
                                <span>分类: {displayAnimation.category}</span>
                                <span>•</span>
                                <span>创建时间: {displayAnimation.createdAt}</span>
                            </div>
                        </div>
                    </div>

                    {/* 右侧：操作区域 */}
                    <div className="lg:col-span-1">
                        <div className="glass-card rounded-xl p-6 sticky top-24">
                            {/* 统计信息 */}
                            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-stone-700">
                                <div className="flex items-center gap-2 text-stone-300">
                                    <Heart className="w-5 h-5 text-red-500" />
                                    <span className="font-medium">{displayAnimation.likes}</span>
                                </div>
                                <div className="flex items-center gap-2 text-stone-300">
                                    <Eye className="w-5 h-5 text-blue-500" />
                                    <span className="font-medium">{displayAnimation.views}</span>
                                </div>
                            </div>

                            {/* 操作按钮 */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleExportMP4}
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:from-orange-400 hover:to-pink-400 transition-all disabled:opacity-50"
                                >
                                    <Film className="w-4 h-4" />
                                    导出 MP4 视频
                                </button>

                                <button
                                    onClick={handleDownload}
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-700 text-white font-medium hover:bg-stone-600 transition-colors disabled:opacity-50"
                                >
                                    <Download className="w-4 h-4" />
                                    下载 SVG
                                </button>

                                <button
                                    onClick={handleCopy}
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-700 text-white font-medium hover:bg-stone-600 transition-colors disabled:opacity-50"
                                >
                                    <Copy className="w-4 h-4" />
                                    {copied ? "已复制！" : "复制代码"}
                                </button>

                                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-700 text-white font-medium hover:bg-stone-600 transition-colors">
                                    <Share2 className="w-4 h-4" />
                                    分享
                                </button>
                            </div>

                            {/* 提示 */}
                            <p className="text-xs text-stone-500 mt-6 text-center">
                                点击「导出 MP4 视频」可将动画导出为高清视频文件
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
