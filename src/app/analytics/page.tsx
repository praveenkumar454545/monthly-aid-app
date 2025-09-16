
"use client";

import { AppHeader } from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/sidebar';
import { DonationStats } from '@/components/dashboard/donation-stats';

export default function AnalyticsPage() {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <AppSidebar />
            <div className="flex flex-col">
                <AppHeader />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
                     <div className="flex items-center">
                        <h1 className="text-lg font-semibold md:text-2xl">Analytics</h1>
                    </div>
                    <div className="grid auto-rows-max items-start gap-4 md:gap-8">
                         <div className="grid auto-rows-max items-start gap-4 md:gap-8">
                             <DonationStats />
                         </div>
                    </div>
                </main>
            </div>
        </div>
    );
}


