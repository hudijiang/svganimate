import Link from "next/link";

const footerLinks = [
    { href: "/privacy", label: "隐私政策" },
    { href: "/terms", label: "服务条款" },
    { href: "/contact", label: "联系我" },
];

export default function Footer() {
    return (
        <footer className="py-8 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                <div className="flex flex-col items-center gap-4">
                    {/* Links */}
                    <div className="flex items-center gap-2 text-sm text-stone-400">
                        {footerLinks.map((link, index) => (
                            <span key={link.href} className="flex items-center">
                                <Link
                                    href={link.href}
                                    className="hover:text-orange-400 transition-colors"
                                >
                                    {link.label}
                                </Link>
                                {index < footerLinks.length - 1 && (
                                    <span className="mx-2 text-stone-600">•</span>
                                )}
                            </span>
                        ))}
                    </div>

                    {/* Copyright */}
                    <p className="text-sm text-stone-500">
                        © 2025 AI SVG Animation Studio. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
