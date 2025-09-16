"use client"

import { DonationStats } from '@/components/dashboard/donation-stats';
import { TopDonors } from '@/components/dashboard/top-donors';
import { ManageVillages } from '@/components/admin/manage-villages';
import type { Beneficiary } from '@/lib/types';
import { PendingApprovals } from '@/components/admin/pending-approvals';
import { useState } from 'react';
import { beneficiaries as initialBeneficiaries } from '@/lib/data';
import { Button }from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataImporter } from '@/components/admin/data-importer';
import { BeneficiaryManagement } from '@/components/admin/beneficiary-management';


export default function AdminDashboard() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(initialBeneficiaries);
  const { toast } = useToast();

  const handleSeed = async () => {
    toast({
        variant: "destructive",
        title: "Action Not Available",
        description: "Database seeding is a server-side operation and is not available in this environment.",
      });
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6">
       <PendingApprovals beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} />
       <BeneficiaryManagement beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} />
      <div
        className="grid gap-4 md:gap-8 lg:grid-cols-3"
      >
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <DonationStats />
          <ManageVillages />
           <Card>
            <CardHeader>
              <CardTitle>Database Tools</CardTitle>
              <CardDescription>Use these tools to populate your database with initial or bulk data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Seed Initial Villages (Mock Data)</h3>
                    <p className="text-sm text-muted-foreground">One-time action to add a small set of villages to the 'villages' collection for testing.</p>
                  </div>
                  <Button onClick={handleSeed} className="ml-auto">Seed Villages</Button>
                </div>
                <DataImporter />
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 md:gap-8">
          <TopDonors />
        </div>
      </div>
    </div>
  )
}
