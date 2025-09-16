
"use client";

import { useState } from 'react';
import { BeneficiaryListItem } from '@/components/dashboard/beneficiary-list-item';
import { beneficiaries as initialBeneficiaries } from '@/lib/data';
import type { Beneficiary } from '@/lib/types';
import { AppHeader } from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/sidebar';

export default function BeneficiariesPage() {
    const [beneficiaries] = useState<Beneficiary[]>(initialBeneficiaries);

    const approvedBeneficiaries = beneficiaries.filter(b => b.status === 'APPROVED');

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <AppSidebar />
            <div className="flex flex-col">
                <AppHeader />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
                    <div className="flex items-center">
                        <h1 className="text-lg font-semibold md:text-2xl">Beneficiaries</h1>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {approvedBeneficiaries.length > 0 ? approvedBeneficiaries.map(beneficiary => (
                            <BeneficiaryListItem
                                key={beneficiary.id}
                                beneficiary={beneficiary}
                            />
                        )) : (
                            <div className="col-span-full text-center py-8">
                                <p className="text-muted-foreground">There are no beneficiaries currently seeking funding. Please check back later.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
