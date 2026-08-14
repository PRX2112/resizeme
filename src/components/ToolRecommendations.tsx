'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface Tool {
    name: string;
    href: string;
    description?: string;
}

interface ToolRecommendationsProps {
    currentTool: string;
    onToolClick?: () => void;
}

const allTools: Record<string, Tool[]> = {
    resize: [
        { name: 'Compress Image', href: '/tools/compress' },
        { name: 'Crop Image', href: '/tools/crop' },
        { name: 'Convert Format', href: '/tools/convert' },
        { name: 'Bulk Resize (ZIP)', href: '/tools/resize/bulk' },
        { name: 'Remove Background', href: '/tools/background-remover' },
    ],
    compress: [
        { name: 'Resize Image', href: '/tools/resize' },
        { name: 'Convert Format', href: '/tools/convert' },
        { name: 'Crop Image', href: '/tools/crop' },
        { name: 'Bulk Resize', href: '/tools/resize/bulk' },
    ],
    crop: [
        { name: 'Resize Image', href: '/tools/resize' },
        { name: 'Rotate Image', href: '/tools/rotate' },
        { name: 'Flip Image', href: '/tools/flip' },
        { name: 'Compress Image', href: '/tools/compress' },
    ],
    convert: [
        { name: 'Compress Image', href: '/tools/compress' },
        { name: 'Resize Image', href: '/tools/resize' },
        { name: 'Crop Image', href: '/tools/crop' },
    ],
    rotate: [
        { name: 'Flip Image', href: '/tools/flip' },
        { name: 'Crop Image', href: '/tools/crop' },
        { name: 'Resize Image', href: '/tools/resize' },
    ],
    flip: [
        { name: 'Rotate Image', href: '/tools/rotate' },
        { name: 'Crop Image', href: '/tools/crop' },
        { name: 'Resize Image', href: '/tools/resize' },
    ],
    enlarge: [
        { name: 'Compress Image', href: '/tools/compress' },
        { name: 'Convert Format', href: '/tools/convert' },
        { name: 'Resize Image', href: '/tools/resize' },
    ],
    'meme-generator': [
        { name: 'Color Picker', href: '/tools/color-picker' },
        { name: 'Crop Image', href: '/tools/crop' },
        { name: 'Resize Image', href: '/tools/resize' },
    ],
    'color-picker': [
        { name: 'Meme Generator', href: '/tools/meme-generator' },
        { name: 'Crop Image', href: '/tools/crop' },
        { name: 'Resize Image', href: '/tools/resize' },
    ],
};

export default function ToolRecommendations({ currentTool, onToolClick }: ToolRecommendationsProps) {
    const [recommendations, setRecommendations] = useState<Tool[]>([]);

    useEffect(() => {
        const toolKey = currentTool.toLowerCase().replace(/\s+/g, '-');
        const recs = allTools[toolKey] || allTools.resize;
        setRecommendations(recs);
    }, [currentTool]);

    if (recommendations.length === 0) {
        return null;
    }

    return (
        <div className="py-4 border-t border-b border-gray-200/60 dark:border-gray-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-gray-500 dark:text-gray-400">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Related Utilities:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {recommendations.map((tool) => (
                    <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={onToolClick}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors"
                    >
                        <span>{tool.name}</span>
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
