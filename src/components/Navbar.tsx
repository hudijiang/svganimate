"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Sparkles,
    Menu,
    X
} from "lucide-react";

const navItems = [
    { href: "/", label: "首页" },
    { href: "/gallery", label: "案例" },
    { href: "/learn", label: "学习" },
    { href: "/create", label: "开始创作" },
    { href: "/pricing", label: "会员" },
    { href: "/profile", label: "个人中心" },
];

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [language, setLanguage] = useState<"zh" | "en">("zh");

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-semibold text-white">SVG Animate</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="px-4 py-2 text-sm text-stone-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Language Switcher */}
                        <div className="flex items-center bg-white/5 rounded-full p-1">
                            <button
                                onClick={() => setLanguage("zh")}
                                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${language === "zh"
                                        ? "bg-white/10 text-white"
                                        : "text-stone-400 hover:text-white"
                                    }`}
                            >
                                中
                            </button>
                            <button
                                onClick={() => setLanguage("en")}
                                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${language === "en"
                                        ? "bg-white/10 text-white"
                                        : "text-stone-400 hover:text-white"
                                    }`}
                            >
                                EN
                            </button>
                        </div>

                        {/* Login Button */}
                        <Link
                            href="/login"
                            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-400 rounded-full transition-colors"
                        >
                            登录
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden glass border-t border-white/10">
                    <div className="px-4 py-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block px-4 py-2 text-stone-300 hover:text-white hover:bg-white/5 rounded-lg"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-white/10">
                            <Link
                                href="/login"
                                className="block w-full text-center px-4 py-2 bg-orange-500 text-white rounded-full"
                            >
                                登录
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
