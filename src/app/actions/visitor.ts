'use server';

import { db } from '@/db/db';
import { siteStats } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { unstable_noStore } from 'next/cache';

/**
 * Fast read-only query to fetch the current visitor count without DB write locking.
 */
export async function getVisitorCount(): Promise<number> {
    unstable_noStore();

    try {
        if (!db) return 0;
        const stats = await db.select({ count: siteStats.visitorCount }).from(siteStats).limit(1);
        return stats[0]?.count ?? 0;
    } catch (error: any) {
        console.warn(`[getVisitorCount] DB read warning: ${error?.message || 'Unknown'}`);
        return 0;
    }
}

/**
 * Checks session status and increments visitor count in Neon Postgres.
 * @param shouldIncrement If false (user already counted this session), skips SQL write and performs a read-only query.
 */
export async function checkAndIncrementVisitor(shouldIncrement: boolean = true): Promise<number> {
    unstable_noStore();

    try {
        if (!db) return 0;

        // If client already registered a visit this session, perform a read-only query (0 write overhead)
        if (!shouldIncrement) {
            return await getVisitorCount();
        }

        // Fetch existing record
        const stats = await db.select().from(siteStats).limit(1);

        if (stats.length === 0) {
            // Create initial record if it doesn't exist
            const [newStat] = await db
                .insert(siteStats)
                .values({
                    id: 'global_stats',
                    visitorCount: 1,
                })
                .returning({ count: siteStats.visitorCount });
            return newStat?.count ?? 1;
        } else {
            // Increment existing record atomically
            const [updatedStat] = await db
                .update(siteStats)
                .set({
                    visitorCount: sql`${siteStats.visitorCount} + 1`,
                    updatedAt: new Date(),
                })
                .where(eq(siteStats.id, stats[0].id))
                .returning({ count: siteStats.visitorCount });
            return updatedStat?.count ?? stats[0].visitorCount + 1;
        }
    } catch (error: any) {
        console.warn(`[checkAndIncrementVisitor] DB write warning: ${error?.message || 'Unknown'}`);
        return 0; // Return 0 gracefully without crashing the UI
    }
}

