import { Heart, Eye } from "lucide-react";
import Link from "next/link";

// SVG 动画示例数据
export interface AnimationData {
    id: string;
    title: string;
    svgPreview: string;
    likes: number;
    views: number;
}

interface AnimationCardProps {
    animation: AnimationData;
}

export default function AnimationCard({ animation }: AnimationCardProps) {
    return (
        <Link href={`/animation/${animation.id}`}>
            <div className="glass-card rounded-xl overflow-hidden card-hover group cursor-pointer">
                {/* SVG 预览区域 */}
                <div className="aspect-video bg-stone-900/50 flex items-center justify-center p-4 relative overflow-hidden">
                    {/* 示例 SVG 动画 */}
                    <div
                        className="w-full h-full flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: animation.svgPreview }}
                    />

                    {/* 悬停遮罩 */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">查看详情</span>
                    </div>
                </div>

                {/* 信息区域 */}
                <div className="p-4 bg-stone-900/70">
                    <h3 className="text-white text-sm font-medium line-clamp-2 mb-3">
                        {animation.title}
                    </h3>

                    <div className="flex items-center gap-4 text-stone-400 text-xs">
                        <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5" />
                            {animation.likes}
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {animation.views}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
