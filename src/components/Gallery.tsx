import AnimationCard, { AnimationData } from "./AnimationCard";

// 示例动画数据
const sampleAnimations: AnimationData[] = [
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
      <circle cx="100" cy="100" r="60" fill="none" stroke="#4a5568" stroke-width="0.5"/>
      <circle r="8" fill="#3182CE">
        <animateMotion dur="6s" repeatCount="indefinite">
          <mpath href="#orbit2"/>
        </animateMotion>
      </circle>
      <path id="orbit2" d="M 40 100 A 60 60 0 1 1 40 100.001" fill="none"/>
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
    },
    {
        id: "3",
        title: "心脏跳动循环系统血液流动动画",
        svgPreview: `<svg viewBox="0 0 200 200" class="w-full h-full">
      <path d="M100 160 C60 120 20 100 20 60 C20 20 60 20 100 60 C140 20 180 20 180 60 C180 100 140 120 100 160" fill="#E53E3E">
        <animate attributeName="transform" type="scale" values="1;1.1;1" dur="0.8s" repeatCount="indefinite" additive="sum"/>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-5;0,0" dur="0.8s" repeatCount="indefinite"/>
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
    },
    {
        id: "6",
        title: "地球自转与四季变化动画",
        svgPreview: `<svg viewBox="0 0 200 200" class="w-full h-full">
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
    },
];

interface GalleryProps {
    title?: string;
    showAll?: boolean;
}

export default function Gallery({ title = "精选案例", showAll = false }: GalleryProps) {
    const displayAnimations = showAll ? sampleAnimations : sampleAnimations.slice(0, 6);

    return (
        <section className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* 标题 */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                    {!showAll && (
                        <a
                            href="/gallery"
                            className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                        >
                            查看全部 →
                        </a>
                    )}
                </div>

                {/* 动画网格 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayAnimations.map((animation) => (
                        <AnimationCard key={animation.id} animation={animation} />
                    ))}
                </div>
            </div>
        </section>
    );
}
