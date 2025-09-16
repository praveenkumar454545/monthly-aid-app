"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Beneficiary } from '@/lib/types';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface BeneficiaryManagementProps {
    beneficiaries: Beneficiary[];
    setBeneficiaries: React.Dispatch<React.SetStateAction<Beneficiary[]>>;
}

export function BeneficiaryManagement({ beneficiaries, setBeneficiaries }: BeneficiaryManagementProps) {
    const { toast } = useToast();
    const [filter, setFilter] = useState<'ALL' | 'APPROVED' | 'REJECTED' | 'FUNDED'>('ALL');

    const handleDelete = (beneficiaryId: number | string) => {
        const beneficiaryName = beneficiaries.find(b => b.id === beneficiaryId)?.name;
        setBeneficiaries(prev => prev.filter(b => b.id !== beneficiaryId));
        toast({
            variant: "destructive",
            title: "Record Deleted",
            description: `${beneficiaryName}'s record has been permanently deleted.`,
        });
    }

    if (!beneficiaries) {
        return null;
    }

    const nonPendingList = beneficiaries.filter(b => b.status !== 'PENDING');
    
    const filteredList = nonPendingList.filter(b => {
        if (filter === 'ALL') return true;
        return b.status === filter;
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>Beneficiary Records</CardTitle>
                <CardDescription>
                    View and manage all approved, rejected, and funded beneficiary cases.
                </CardDescription>
                 <div className="flex space-x-2 pt-2">
                    <Button variant={filter === 'ALL' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('ALL')}>All</Button>
                    <Button variant={filter === 'APPROVED' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('APPROVED')}>Approved</Button>
                    <Button variant={filter === 'REJECTED' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('REJECTED')}>Rejected</Button>
                    <Button variant={filter === 'FUNDED' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('FUNDED')}>Funded</Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {filteredList.length > 0 ? (
                    filteredList.map(beneficiary => (
                        <div key={beneficiary.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
                           <div className="flex-1">
                                <div className="flex items-center gap-2">
                                     <p className="font-semibold">{beneficiary.name}</p>
                                     <Badge variant={
                                         beneficiary.status === 'REJECTED' ? 'destructive' :
                                         beneficiary.status === 'FUNDED' ? 'default' : 'secondary'
                                     }>{beneficiary.status}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-1">{beneficiary.summary || beneficiary.story}</p>
                           </div>
                           <div className="flex items-center gap-2">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="sm" variant="destructive-outline">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the record for <span className="font-bold">{beneficiary.name}</span>.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(beneficiary.id)}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                           </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">There are no records matching the filter.</p>
                )}
            </CardContent>
        </Card>
    )
}
