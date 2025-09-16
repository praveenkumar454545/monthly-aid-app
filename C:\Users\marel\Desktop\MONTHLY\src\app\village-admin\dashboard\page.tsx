"use client";

import { useState } from "react";
import { SubmitBeneficiary } from "@/components/dashboard/submit-beneficiary";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { villages } from "@/lib/data";
import { beneficiaries as initialBeneficiaries } from '@/lib/data';
import type { Beneficiary } from '@/lib/types';


export default function VillageAdminDashboard() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(initialBeneficiaries);
  const activeVillages = villages.filter(v => v.status === 'active');
  const queuedVillages = villages.filter(v => v.status === 'queued');

  return (
    <div className="grid gap-8 p-4 md:p-6">
        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Active Villages for Case Submission</CardTitle>
                    <CardDescription>You can currently submit beneficiary cases for these villages.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {activeVillages.map(village => (
                            <li key={village.id} className="p-2 bg-secondary rounded-md">{village.name}, {village.mandal}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Villages</CardTitle>
                    <CardDescription>These villages are next in the queue for case submission.</CardDescription>
                </CardHeader>
                 <CardContent>
                    <ul className="space-y-2">
                        {queuedVillages.map(village => (
                            <li key={village.id} className="p-2 bg-muted/50 rounded-md">{village.name}, {village.mandal}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
        <div>
            <SubmitBeneficiary beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} />
        </div>
    </div>
  );
}
