"use client";

import { useState } from "react";
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
    Film
} from "lucide-react";

// 示例动画数据（实际应从 API 获取）
const animationsData: Record<string, {
    id: string;
    title: string;
    description: string;
    svgCode: string;
    likes: number;
    views: number;
    author: string;
    createdAt: string;
    category: string;
}> = {
    "1": {
        id: "1",
        title: "太阳系行星运动动画 - 展示八大行星围绕太阳公转",
        description: "这个动画展示了太阳系中各行星围绕太阳公转的过程，包括水星、金星、地球和火星的轨道运动。",
        svgCode: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="#0d1117"/>
  <circle cx="200" cy="200" r="40" fill="#FDB813">
    <animate attributeName="r" values="38;42;38" dur="2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="200" cy="200" r="70" fill="none" stroke="#2d3748" stroke-width="1"/>
  <circle r="6" fill="#A0AEC0">
    <animateMotion dur="2s" repeatCount="indefinite">
      <mpath href="#orbit1"/>
    </animateMotion>
  </circle>
  <path id="orbit1" d="M 130 200 A 70 70 0 1 1 130 200.001" fill="none"/>
  <circle cx="200" cy="200" r="100" fill="none" stroke="#2d3748" stroke-width="1"/>
  <circle r="10" fill="#ECC94B">
    <animateMotion dur="3s" repeatCount="indefinite">
      <mpath href="#orbit2"/>
    </animateMotion>
  </circle>
  <path id="orbit2" d="M 100 200 A 100 100 0 1 1 100 200.001" fill="none"/>
  <circle cx="200" cy="200" r="140" fill="none" stroke="#2d3748" stroke-width="1"/>
  <circle r="12" fill="#3182CE">
    <animateMotion dur="4s" repeatCount="indefinite">
      <mpath href="#orbit3"/>
    </animateMotion>
  </circle>
  <path id="orbit3" d="M 60 200 A 140 140 0 1 1 60 200.001" fill="none"/>
</svg>`,
        likes: 256,
        views: 1420,
        author: "AI Generator",
        createdAt: "2025-12-20",
        category: "自然科学"
    },
    "2": {
        id: "2",
        title: "DNA双螺旋结构旋转动画",
        description: "展示DNA分子的双螺旋结构，包括碱基对的连接和整体旋转效果。",
        svgCode: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#0d1117"/>
  <g transform="translate(100,100)">
    <g>
      <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite"/>
      <line x1="-30" y1="-60" x2="30" y2="-60" stroke="#E53E3E" stroke-width="3"/>
      <line x1="-30" y1="-30" x2="30" y2="-30" stroke="#3182CE" stroke-width="3"/>
      <line x1="-30" y1="0" x2="30" y2="0" stroke="#48BB78" stroke-width="3"/>
      <line x1="-30" y1="30" x2="30" y2="30" stroke="#ED8936" stroke-width="3"/>
      <line x1="-30" y1="60" x2="30" y2="60" stroke="#9F7AEA" stroke-width="3"/>
      <circle cx="-30" cy="-60" r="6" fill="#E53E3E"/>
      <circle cx="30" cy="-60" r="6" fill="#3182CE"/>
      <circle cx="-30" cy="-30" r="6" fill="#3182CE"/>
      <circle cx="30" cy="-30" r="6" fill="#48BB78"/>
    </g>
  </g>
</svg>`,
        likes: 189,
        views: 982,
        author: "AI Generator",
        createdAt: "2025-12-19",
        category: "生物医学"
    },
    "3": {
        id: "3",
        title: "心脏跳动循环系统血液流动动画",
        description: "展示心脏跳动的动画效果，模拟心脏收缩和舒张的过程。",
        svgCode: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#0d1117"/>
  <path d="M100 160 C60 120 20 100 20 60 C20 20 60 20 100 60 C140 20 180 20 180 60 C180 100 140 120 100 160" fill="#E53E3E">
    <animate attributeName="transform" type="scale" values="1;1.1;1" dur="0.8s" repeatCount="indefinite" additive="sum"/>
    <animateTransform attributeName="transform" type="translate" values="0,0;0,-5;0,0" dur="0.8s" repeatCount="indefinite"/>
  </path>
</svg>`,
        likes: 342,
        views: 2103,
        author: "AI Generator",
        createdAt: "2025-12-18",
        category: "生物医学"
    },
    "4": {
        id: "4",
        title: "齿轮联动机械传动原理动画",
        description: "展示两个齿轮相互咬合转动的机械传动原理。",
        svgCode: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#0d1117"/>
  <g transform="translate(70,100)">
    <g>
      <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="3s" repeatCount="indefinite"/>
      <circle cx="0" cy="0" r="25" fill="none" stroke="#A0AEC0" stroke-width="8"/>
      <circle cx="0" cy="0" r="8" fill="#4A5568"/>
    </g>
  </g>
  <g transform="translate(130,100)">
    <g>
      <animateTransform attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="3s" repeatCount="indefinite"/>
      <circle cx="0" cy="0" r="35" fill="none" stroke="#718096" stroke-width="8"/>
      <circle cx="0" cy="0" r="10" fill="#4A5568"/>
    </g>
  </g>
</svg>`,
        likes: 178,
        views: 856,
        author: "AI Generator",
        createdAt: "2025-12-17",
        category: "工程机械"
    },
    "5": {
        id: "5",
        title: "水分子H2O结构振动动画",
        description: "展示水分子的结构和振动模式，包括氧原子和氢原子的相对运动。",
        svgCode: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#0d1117"/>
  <circle cx="100" cy="90" r="20" fill="#E53E3E">
    <animate attributeName="cy" values="90;85;90" dur="1s" repeatCount="indefinite"/>
  </circle>
  <circle cx="65" cy="130" r="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2">
    <animate attributeName="cx" values="65;60;65" dur="1s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="130;135;130" dur="1s" repeatCount="indefinite"/>
  </circle>
  <circle cx="135" cy="130" r="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2">
    <animate attributeName="cx" values="135;140;135" dur="1s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="130;135;130" dur="1s" repeatCount="indefinite"/>
  </circle>
  <line x1="85" y1="105" x2="72" y2="120" stroke="#718096" stroke-width="3"/>
  <line x1="115" y1="105" x2="128" y2="120" stroke="#718096" stroke-width="3"/>
</svg>`,
        likes: 231,
        views: 1287,
        author: "AI Generator",
        createdAt: "2025-12-16",
        category: "自然科学"
    },
    "6": {
        id: "6",
        title: "地球自转与四季变化动画",
        description: "展示地球围绕太阳公转以及自转的动画效果。",
        svgCode: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#0d1117"/>
  <defs>
    <linearGradient id="earthGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#3182CE"/>
      <stop offset="50%" style="stop-color:#48BB78"/>
      <stop offset="100%" style="stop-color:#3182CE"/>
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="50" fill="url(#earthGrad)">
    <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="5s" repeatCount="indefinite"/>
  </circle>
  <ellipse cx="100" cy="100" rx="65" ry="15" fill="none" stroke="#A0AEC0" stroke-width="1" stroke-dasharray="5,5"/>
</svg>`,
        likes: 298,
        views: 1654,
        author: "AI Generator",
        createdAt: "2025-12-15",
        category: "自然科学"
    }
};

export default function AnimationDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
    const [isPlaying, setIsPlaying] = useState(true);
    const [copied, setCopied] = useState(false);

    const animation = animationsData[id];

    // 如果找不到动画，显示默认数据
    const displayAnimation = animation || {
        id: id,
        title: `动画 #${id}`,
        description: "这是一个 AI 生成的 SVG 动画示例。",
        svgCode: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#0d1117"/>
  <circle cx="100" cy="100" r="40" fill="#F97316">
    <animate attributeName="r" values="35;45;35" dur="2s" repeatCount="indefinite"/>
  </circle>
</svg>`,
        likes: 100,
        views: 500,
        author: "AI Generator",
        createdAt: "2025-12-20",
        category: "其他"
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(displayAnimation.svgCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([displayAnimation.svgCode], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `animation-${id}.svg`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleUseInWorkspace = () => {
        // 将 SVG 代码传递到创作工作区
        const encodedSvg = encodeURIComponent(displayAnimation.svgCode);
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
                                {activeTab === "preview" ? (
                                    <div
                                        className="w-full h-full flex items-center justify-center"
                                        dangerouslySetInnerHTML={{ __html: displayAnimation.svgCode }}
                                    />
                                ) : (
                                    <pre className="w-full h-full overflow-auto text-xs text-stone-300 font-mono p-4 bg-stone-800/50 rounded-lg">
                                        {displayAnimation.svgCode}
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
                                    onClick={handleUseInWorkspace}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:from-orange-400 hover:to-pink-400 transition-all"
                                >
                                    <Film className="w-4 h-4" />
                                    在工作区中使用
                                </button>

                                <button
                                    onClick={handleDownload}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-700 text-white font-medium hover:bg-stone-600 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    下载 SVG
                                </button>

                                <button
                                    onClick={handleCopy}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-700 text-white font-medium hover:bg-stone-600 transition-colors"
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
                                点击「在工作区中使用」可以基于此动画进行二次编辑和导出
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
