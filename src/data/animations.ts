// 动画数据配置
// SVG 文件存放在 public/animations/ 目录下

export interface AnimationMeta {
    id: string;
    title: string;
    description: string;
    svgFile: string;  // SVG 文件路径（相对于 public）
    previewFile?: string;  // 预览 SVG 文件路径（可选，用于 gallery 缩略图）
    likes: number;
    views: number;
    author: string;
    createdAt: string;
    category: string;
}

export const animationsData: AnimationMeta[] = [
    {
        id: "1",
        title: "太阳系八大行星运动动画 - 完整行星轨道展示",
        description: "这个动画展示了太阳系完整的八大行星围绕太阳公转的过程。内太阳系包括水星、金星、地球、火星（类地行星），外太阳系包括木星、土星、天王星、海王星（类木行星）。公转周期按比例设置，颜色和大小反映各行星特征。",
        svgFile: "/animations/solar-system.svg",
        likes: 256,
        views: 1420,
        author: "AI Generator",
        createdAt: "2025-12-20",
        category: "自然科学"
    },
    {
        id: "2",
        title: "DNA双螺旋结构旋转动画",
        description: "展示DNA分子的双螺旋结构，包括碱基对的连接和整体旋转效果。DNA由两条反向平行的多核苷酸链组成，通过氢键连接碱基对（A-T、G-C）。",
        svgFile: "/animations/dna-helix.svg",
        likes: 189,
        views: 982,
        author: "AI Generator",
        createdAt: "2025-12-19",
        category: "生物医学"
    },
    {
        id: "3",
        title: "心脏跳动循环系统血液流动动画",
        description: "展示心脏跳动的动画效果，模拟心脏收缩和舒张的过程。正常心率约为每分钟60-100次。",
        svgFile: "/animations/heartbeat.svg",
        likes: 342,
        views: 2103,
        author: "AI Generator",
        createdAt: "2025-12-18",
        category: "生物医学"
    },
    {
        id: "4",
        title: "齿轮联动传动比原理动画",
        description: "展示两个齿轮相互咬合转动的机械传动原理。根据传动比定律，大齿轮转速较慢，小齿轮转速较快，两者转速之比等于齿数的反比。",
        svgFile: "/animations/gears.svg",
        likes: 178,
        views: 856,
        author: "AI Generator",
        createdAt: "2025-12-17",
        category: "工程机械"
    },
    {
        id: "5",
        title: "水分子H2O结构振动动画",
        description: "展示水分子的结构和振动模式，包括氧原子和氢原子的相对运动。水分子呈V形结构，键角约104.5°。",
        svgFile: "/animations/water-molecule.svg",
        likes: 231,
        views: 1287,
        author: "AI Generator",
        createdAt: "2025-12-16",
        category: "自然科学"
    },
    {
        id: "6",
        title: "地球自转动画 - 昼夜交替原理",
        description: "展示地球绕地轴自转的动画效果。地球自转一周约需24小时，形成昼夜交替现象。蓝色代表海洋，绿色代表陆地。",
        svgFile: "/animations/earth-rotation.svg",
        likes: 298,
        views: 1654,
        author: "AI Generator",
        createdAt: "2025-12-15",
        category: "自然科学"
    }
];

// 根据 ID 获取动画数据
export function getAnimationById(id: string): AnimationMeta | undefined {
    return animationsData.find(a => a.id === id);
}

// 获取所有动画
export function getAllAnimations(): AnimationMeta[] {
    return animationsData;
}
