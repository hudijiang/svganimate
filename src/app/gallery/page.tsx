"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import AnimationCard, { AnimationData } from "@/components/AnimationCard";

// 分类
const categories = [
    { id: "featured", label: "精选推荐" },
    { id: "all", label: "全部" },
    { id: "science", label: "自然科学" },
    { id: "tech", label: "计算机科学" },
    { id: "engineering", label: "工程机械" },
    { id: "biology", label: "生物医学" },
    { id: "math", label: "数学" },
    { id: "physics", label: "物理" },
];

// 示例动画数据
const allAnimations: AnimationData[] = [
    {
        id: "1",
        title: "太阳系行星运动动画 - 展示八大行星围绕太阳公转",
        svgPreview: `<svg viewBox="0 0 200 200" class="w-full h-full">
      <circle cx="100" cy="100" r="20" fill="#FDB813">
        <animate attributeName="r" values="18;22;18" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="100" cy="100" r="40" fill="none" stroke="#4a5568" stroke-width="0.5"/>
      <circle r="5" fill="#A0AEC0">
        <animateMotion dur="4s" repeatCount="indefinite">
          <mpath href="#orbit1"/>
        </animateMotion>
      </circle>
      <path id="orbit1" d="M 60 100 A 40 40 0 1 1 60 100.001" fill="none"/>
    </svg>`,
        likes: 256,
        views: 1420,
    },
    {
        id: "2",
        title: "DNA双螺旋结构旋转动画",
        svgPreview: `<svg viewBox="0 0 200 200" class="w-full h-full">
      <g transform="translate(100,100)">
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite"/>
          <line x1="-30" y1="-60" x2="30" y2="-60" stroke="#E53E3E" stroke-width="3"/>
          <line x1="-30" y1="-30" x2="30" y2="-30" stroke="#3182CE" stroke-width="3"/>
          <line x1="-30" y1="0" x2="30" y2="0" stroke="#48BB78" stroke-width="3"/>
          <line x1="-30" y1="30" x2="30" y2="30" stroke="#ED8936" stroke-width="3"/>
          <circle cx="-30" cy="-60" r="6" fill="#E53E3E"/>
          <circle cx="30" cy="-60" r="6" fill="#3182CE"/>
        </g>
      </g>
    </svg>`,
        likes: 189,
        views: 982,
    },
    {
        id: "3",
        title: "心脏跳动循环系统血液流动动画",
        svgPreview: `<svg viewBox="0 0 200 200" class="w-full h-full">
      <path d="M100 160 C60 120 20 100 20 60 C20 20 60 20 100 60 C140 20 180 20 180 60 C180 100 140 120 100 160" fill="#E53E3E">
        <animate attributeName="transform" type="scale" values="1;1.1;1" dur="0.8s" repeatCount="indefinite" additive="sum"/>
      </path>
    </svg>`,
        likes: 342,
        views: 2103,
    },
    {
        id: "4",
        title: "齿轮联动机械传动原理动画",
        svgPreview: `<svg viewBox="0 0 200 200" class="w-full h-full">
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
    },
    {
        id: "5",
        title: "水分子H2O结构振动动画",
        svgPreview: `<svg viewBox="0 0 200 200" class="w-full h-full">
      <circle cx="100" cy="90" r="20" fill="#E53E3E">
        <animate attributeName="cy" values="90;85;90" dur="1s" repeatCount="indefinite"/>
      </circle>
      <circle cx="65" cy="130" r="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2">
        <animate attributeName="cx" values="65;60;65" dur="1s" repeatCount="indefinite"/>
      </circle>
      <circle cx="135" cy="130" r="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2">
        <animate attributeName="cx" values="135;140;135" dur="1s" repeatCount="indefinite"/>
      </circle>
    </svg>`,
        likes: 231,
        views: 1287,
    },
    {
        id: "6",
        title: "地球自转与四季变化动画",
        svgPreview: `<svg viewBox="0 0 200 200" class="w-full h-full">
      <defs>
        <linearGradient id="earthGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#3182CE"/>
          <stop offset="50%" style="stop-color:#48BB78"/>
          <stop offset="100%" style="stop-color:#3182CE"/>
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="50" fill="url(#earthGrad2)">
        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="5s" repeatCount="indefinite"/>
      </circle>
    </svg>`,
        likes: 298,
        views: 1654,
    },
    {
        id: "7",
        title: "电磁波传播动画 - 电场与磁场垂直振动",
        svgPreview: `<svg viewBox="0 0 200 200" class="w-full h-full">
      <path d="M 20 100 Q 50 60 80 100 Q 110 140 140 100 Q 170 60 200 100" fill="none" stroke="#E53E3E" stroke-width="2">
        <animate attributeName="d" values="M 20 100 Q 50 60 80 100 Q 110 140 140 100 Q 170 60 200 100;M 20 100 Q 50 140 80 100 Q 110 60 140 100 Q 170 140 200 100;M 20 100 Q 50 60 80 100 Q 110 140 140 100 Q 170 60 200 100" dur="1s" repeatCount="indefinite"/>
      </path>
      <path d="M 20 100 Q 50 80 80 100 Q 110 120 140 100 Q 170 80 200 100" fill="none" stroke="#3182CE" stroke-width="2">
        <animate attributeName="d" values="M 20 100 Q 50 120 80 100 Q 110 80 140 100 Q 170 120 200 100;M 20 100 Q 50 80 80 100 Q 110 120 140 100 Q 170 80 200 100;M 20 100 Q 50 120 80 100 Q 110 80 140 100 Q 170 120 200 100" dur="1s" repeatCount="indefinite"/>
      </path>
    </svg>`,
        likes: 156,
        views: 743,
    },
    {
        id: "8",
        title: "神经元信号传递动画",
        svgPreview: `<svg viewBox="0 0 200 200" class="w-full h-full">
      <circle cx="50" cy="100" r="15" fill="#9F7AEA"/>
      <line x1="65" y1="100" x2="150" y2="100" stroke="#718096" stroke-width="4"/>
      <circle cx="170" cy="100" r="10" fill="#48BB78"/>
      <circle r="4" fill="#FDB813">
        <animate attributeName="cx" values="65;150" dur="1s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="100;100" dur="1s" repeatCount="indefinite"/>
      </circle>
    </svg>`,
        likes: 203,
        views: 1098,
    },
    {
        id: "9",
        title: "原子结构电子云轨道动画",
        svgPreview: `<svg viewBox="0 0 200 200" class="w-full h-full">
      <circle cx="100" cy="100" r="10" fill="#E53E3E"/>
      <ellipse cx="100" cy="100" rx="40" ry="15" fill="none" stroke="#4a5568" stroke-width="1">
        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="3s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="100" cy="100" rx="40" ry="15" fill="none" stroke="#4a5568" stroke-width="1">
        <animateTransform attributeName="transform" type="rotate" from="60 100 100" to="420 100 100" dur="4s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="100" cy="100" rx="40" ry="15" fill="none" stroke="#4a5568" stroke-width="1">
        <animateTransform attributeName="transform" type="rotate" from="120 100 100" to="480 100 100" dur="5s" repeatCount="indefinite"/>
      </ellipse>
      <circle r="4" fill="#3182CE">
        <animateMotion dur="3s" repeatCount="indefinite">
          <mpath href="#elOrbit"/>
        </animateMotion>
      </circle>
      <ellipse id="elOrbit" cx="100" cy="100" rx="40" ry="15" fill="none"/>
    </svg>`,
        likes: 267,
        views: 1432,
    },
];

export default function GalleryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("featured");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // 筛选动画
    const filteredAnimations = allAnimations.filter((animation) =>
        animation.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 分页
    const totalPages = Math.ceil(filteredAnimations.length / itemsPerPage);
    const paginatedAnimations = filteredAnimations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* 页面标题 */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">SVG 动画案例展示</h1>
                    <p className="text-stone-400">探索精彩的 AI 生成动画作品</p>
                </div>

                {/* 搜索框 */}
                <div className="max-w-xl mx-auto mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="搜索动画..."
                            className="w-full pl-12 pr-4 py-3 rounded-full input-dark"
                        />
                    </div>
                </div>

                {/* 分类标签 */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === category.id
                                    ? "bg-orange-500 text-white"
                                    : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* 动画网格 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {paginatedAnimations.map((animation) => (
                        <AnimationCard key={animation.id} animation={animation} />
                    ))}
                </div>

                {/* 分页器 */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            上一页
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === page
                                        ? "bg-orange-500 text-white"
                                        : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            下一页
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
