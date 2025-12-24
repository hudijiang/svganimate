"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { Heart, Eye } from "lucide-react";
import { getAllAnimations, AnimationMeta } from "@/data/animations";

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

// 动画卡片组件（带动态加载）
function AnimationCardWithPreview({ animation }: { animation: AnimationMeta }) {
  const [svgContent, setSvgContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSvg() {
      if (!animation.svgFile) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(animation.svgFile);
        const text = await response.text();
        setSvgContent(text);
      } catch (error) {
        console.error("Failed to load SVG:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSvg();
  }, [animation.svgFile]);

  return (
    <Link href={`/animation/${animation.id}`} className="group block">
      <div className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/10">
        {/* 预览区域 */}
        <div className="aspect-video bg-stone-900/50 p-4 flex items-center justify-center">
          {isLoading ? (
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          )}
        </div>

        {/* 信息区域 */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-white line-clamp-2 mb-3 group-hover:text-orange-400 transition-colors">
            {animation.title}
          </h3>

          <div className="flex items-center justify-between text-xs text-stone-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                {animation.likes}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {animation.views}
              </span>
            </div>
            <span className="text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
              查看详情 →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const allAnimations = getAllAnimations();

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
            <AnimationCardWithPreview key={animation.id} animation={animation} />
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
