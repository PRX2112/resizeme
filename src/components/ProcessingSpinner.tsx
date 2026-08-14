'use client';

import { Loader2 } from 'lucide-react';

export default function ProcessingSpinner({ text = 'Processing image...' }: { text?: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-3">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {text}
            </p>
        </div>
    );
}
