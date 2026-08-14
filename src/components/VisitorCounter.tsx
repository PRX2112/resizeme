'use client';

import { checkAndIncrementVisitor } from '@/app/actions/visitor';
import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';

const SESSION_STORAGE_KEY = 'resizeme_has_counted_session';

// Module-level in-flight promise cache to prevent race conditions across multiple components/renders
let inFlightFetchPromise: Promise<number> | null = null;
let cachedVisitorCount: number | null = null;

export default function VisitorCounter() {
    const [count, setCount] = useState<number | null>(cachedVisitorCount);
    const [loading, setLoading] = useState(cachedVisitorCount === null);

    useEffect(() => {
        let isMounted = true;

        const fetchCount = async () => {
            // If already resolved in memory for this page session
            if (cachedVisitorCount !== null) {
                if (isMounted) {
                    setCount(cachedVisitorCount);
                    setLoading(false);
                }
                return;
            }

            try {
                // If a fetch is already in flight, reuse it
                if (!inFlightFetchPromise) {
                    // Check if client has already registered a count in this browser session
                    let hasCountedThisSession = false;
                    try {
                        hasCountedThisSession = sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true';
                    } catch (e) {
                        // Storage access might be restricted in some iframes / private modes
                    }

                    inFlightFetchPromise = checkAndIncrementVisitor(!hasCountedThisSession)
                        .then((result) => {
                            if (!hasCountedThisSession && result > 0) {
                                try {
                                    sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
                                } catch (e) {
                                    // Ignore storage quota errors
                                }
                            }
                            cachedVisitorCount = result;
                            return result;
                        })
                        .finally(() => {
                            inFlightFetchPromise = null;
                        });
                }

                const visitorCount = await inFlightFetchPromise;
                if (isMounted) {
                    setCount(visitorCount);
                }
            } catch (error) {
                console.error('Failed to fetch visitor count:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchCount();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm animate-pulse">
                <Users className="w-4 h-4" />
                <span className="w-12 h-4 bg-purple-200 dark:bg-purple-800 rounded"></span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium animate-fade-in transition-all hover:bg-purple-200 dark:hover:bg-purple-900/50 cursor-default">
            <Users className="w-4 h-4" />
            <span>
                {count && count > 0 ? count.toLocaleString() : '1,000+'} Visitors
            </span>
        </div>
    );
}

