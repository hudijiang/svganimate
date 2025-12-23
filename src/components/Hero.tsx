"use client";

import { useState } from "react";
import {
    Sparkles,
    Maximize2,
    MonitorPlay,
    Download,
    LayoutGrid,
    ArrowRight,
    Zap
} from "lucide-react";

const features = [
    { icon: Maximize2, label: "无限放大" },
    { icon: MonitorPlay, label: "4K超清" },
    { icon: Download, label: "一键导出" },
    { icon: LayoutGrid, label: "海量案例" },
];

export default function Hero() {
    const [prompt, setPrompt] = useState("");

    const handleGenerate = () => {
        if (prompt.trim()) {
            window.location.href = `/create?prompt=${encodeURIComponent(prompt)}`;
        }
    };

    return (
        <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
            {/* 背景光晕效果 */}
            <div className="glow-orange top-0 left-1/4 -translate-x-1/2" />
            <div className="glow-green top-1/3 right-0" />
            <div className="glow-orange bottom-0 right-1/4" />

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                {/* 标签勋章 */}
                <div className="inline-flex items-center gap-2 pill mb-6">
                    <Zap className="w-4 h-4 text-orange-500" />
                    <span className="text-orange-400">基于 Gemini 3.0 Pro</span>
                </div>

                {/* 主标题 */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                    AI SVG 动画生成器
                </h1>

                {/* 副标题 */}
                <p className="text-xl sm:text-2xl lg:text-3xl font-medium gradient-text mb-6">
                    一句话生成高质量矢量动画
                </p>

                {/* 描述 */}
                <p className="text-stone-400 text-base sm:text-lg max-w-2xl mx-auto mb-8">
                    无需编写代码，无需学习专业软件。输入知识点，AI即刻为您生成高精度的 SVG矢量图动画
                </p>

                {/* 适用人群标签 */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stone-700 bg-stone-900/50 text-stone-300 text-sm mb-10">
                    <span>适合</span>
                    <span className="text-white">YouTuber</span>
                    <span className="text-stone-600">|</span>
                    <span className="text-white">B站UP主</span>
                    <span className="text-stone-600">|</span>
                    <span className="text-white">知识博主与教育创作者</span>
                </div>

                {/* 功能亮点 */}
                <div className="flex flex-wrap justify-center gap-6 mb-10">
                    {features.map((feature) => (
                        <div key={feature.label} className="flex items-center gap-2 text-stone-300">
                            <feature.icon className="w-5 h-5 text-orange-500" />
                            <span className="text-sm">{feature.label}</span>
                        </div>
                    ))}
                </div>

                {/* 输入框区域 */}
                <div className="glass-card rounded-2xl p-4 max-w-2xl mx-auto">
                    <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-orange-500 mt-3" />
                        <div className="flex-1">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="描述你的动画... 例如：'太阳系行星运动动画'"
                                className="w-full bg-transparent border-none outline-none text-white placeholder-stone-500 resize-none min-h-[80px] text-sm sm:text-base"
                                rows={2}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-2">
                        <button
                            onClick={handleGenerate}
                            className="btn-primary flex items-center gap-2"
                        >
                            <span>开始生成</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
