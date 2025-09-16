"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Beneficiary, BeneficiaryStatus } from '@/lib/types';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
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

interface PendingApprovalsProps {
    beneficiaries: Beneficiary[];
    setBeneficiaries: React.Dispatch<React.SetStateAction<Beneficiary[]>>;
}

export function PendingApprovals({ beneficiaries, setBeneficiaries }: PendingApprovalsProps) {
    const { toast } = useToast();

    const handleDecision = (beneficiaryId: number | string, newStatus: BeneficiaryStatus) => {
        setBeneficiaries(prev => 
            prev.map(b => 
                b.id === beneficiaryId ? { ...b, status: newStatus } : b
            )
        );

        const beneficiary = beneficiaries.find(b => b.id === beneficiaryId);

        toast({
            title: `Case ${newStatus}`,
            description: `${beneficiary?.name}'s case has been marked as ${newStatus}.`,
        });
        
        console.log(`Notification to Village Admin ${beneficiary?.villageAdminId}: Case for ${beneficiary?.name} has been ${newStatus}.`);
    }

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
        return null; // or a loading skeleton
    }

    const pendingList = beneficiaries.filter(b => b.status === 'PENDING');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pending Beneficiary Approvals</CardTitle>
                <CardDescription>
                    Review cases submitted by village admins. Approve, reject, or delete submissions.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {pendingList.length > 0 ? (
                    pendingList.map(beneficiary => (
                        <div key={beneficiary.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
                           <div className="flex-1">
                                <p className="font-semibold">{beneficiary.name} <span className="text-xs font-normal text-muted-foreground ml-2 bg-secondary px-2 py-1 rounded-full">{beneficiary.category}{beneficiary.category === 'Other' && `: ${beneficiary.otherCategory}`}</span></p>
                                <p className="text-sm text-muted-foreground line-clamp-2">{beneficiary.summary || beneficiary.story}</p>
                                {beneficiary.villageAdminName && (
                                    <p className="text-xs text-muted-foreground mt-1">Submitted by: <span className='font-medium'>{beneficiary.villageAdminName}</span></p>
                                )}
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
                               <Button size="sm" variant="outline" onClick={() => handleDecision(beneficiary.id, 'REJECTED')}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject
                               </Button>
                               <Button size="sm" onClick={() => handleDecision(beneficiary.id, 'APPROVED')}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve
                               </Button>
                           </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">There are no pending cases to review.</p>
                )}
            </CardContent>
        </Card>
    )
}
