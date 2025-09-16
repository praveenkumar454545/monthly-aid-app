"use client"

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { type Village, type VillageStatus } from '@/lib/types';
import { ListX, ArrowRight, CheckCheck, MapPin, Building, Home, GanttChartSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getVillagesFromCollection, updateVillageStatusInCollection } from '@/lib/firebase-service';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const COLLECTION_NAME = 'apdata';

interface GroupedVillages {
    [district: string]: {
        [mandal: string]: Village[];
    };
}

const VillageStatusBadge = ({ status }: { status: VillageStatus }) => {
    const variant = {
        active: 'default',
        queued: 'secondary',
        completed: 'destructive',
        inactive: 'outline'
    } as const;
     const text = {
        active: 'Active',
        queued: 'Queued',
        completed: 'Completed',
        inactive: 'Inactive'
    };
    return <Badge variant={variant[status]} className="capitalize w-[90px] justify-center">{text[status]}</Badge>
}

export function ManageVillages() {
    const { toast } = useToast();
    const [villages, setVillages] = useState<Village[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = getVillagesFromCollection(
            COLLECTION_NAME,
            (villagesData) => {
                setVillages(villagesData);
                setLoading(false);
            },
            (error) => {
                console.error(`Error fetching villages from ${COLLECTION_NAME}:`, error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not fetch villages data from the database.",
                });
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [toast]);

    const handleStatusChange = async (villageId: string, newStatus: VillageStatus) => {
        try {
            await updateVillageStatusInCollection(COLLECTION_NAME, villageId, newStatus);
            toast({
                title: "Village Status Updated",
                description: `The village has been moved to the '${newStatus}' list.`
            });
        } catch (error) {
            console.error("Error updating village status: ", error);
             toast({
                variant: "destructive",
                title: "Update Failed",
                description: `Could not update village status. Please try again.`
            });
        }
    }

    const groupedVillages = useMemo(() => {
        return villages.reduce((acc: GroupedVillages, village) => {
            const district = village.DISTRICT_NAME;
            const mandal = village.MANDAL_NAME;
            if (!acc[district]) acc[district] = {};
            if (!acc[district][mandal]) acc[district][mandal] = [];
            acc[district][mandal].push(village);
            return acc;
        }, {});
    }, [villages]);

    const districts = Object.keys(groupedVillages).sort();

     if (loading) {
        return (
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>Village Management</CardTitle>
                    <CardDescription>
                        Activate villages for case submissions and manage the queue. Loading data from Firestore...
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>Village Management</CardTitle>
                <CardDescription>
                    Activate villages for case submissions by updating their status. Data is live from the '{COLLECTION_NAME}' collection in Firestore.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Accordion type="multiple" className="w-full space-y-2">
                    {districts.map(district => (
                        <AccordionItem value={district} key={district} className="border rounded-lg bg-card">
                            <AccordionTrigger className="p-4 hover:no-underline">
                                <div className="flex items-center gap-3 w-full">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    <span className="font-semibold text-lg">{district}</span>
                                    <Badge variant="secondary" className="ml-auto mr-4">{Object.keys(groupedVillages[district]).length} Mandals</Badge>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 pt-0">
                                <Accordion type="multiple" className="w-full space-y-2">
                                    {Object.keys(groupedVillages[district]).sort().map(mandal => (
                                         <AccordionItem value={mandal} key={mandal} className="border rounded-lg bg-background">
                                            <AccordionTrigger className="px-4 py-3 hover:no-underline">
                                                 <div className="flex items-center gap-3 w-full">
                                                    <Building className="h-5 w-5 text-primary/80" />
                                                    <span className="font-medium">{mandal}</span>
                                                    <Badge variant="outline" className="ml-auto mr-4">{groupedVillages[district][mandal].length} Villages</Badge>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 pb-3">
                                                 <div className="space-y-2">
                                                    <TooltipProvider>
                                                    {groupedVillages[district][mandal].map(village => (
                                                        <div key={village.id} className="flex items-center justify-between p-2 rounded-md border gap-4">
                                                            <div className='flex items-center gap-3'>
                                                                <Home className='h-4 w-4 text-muted-foreground' />
                                                                <span>{village.VILLAGE_NAME}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                               <VillageStatusBadge status={village.status} />
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(village.id, 'inactive')}><ListX className="h-4 w-4" /></Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent><p>Set to Inactive</p></TooltipContent>
                                                                </Tooltip>
                                                                 <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(village.id, 'queued')}><GanttChartSquare className="h-4 w-4" /></Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent><p>Set to Queued</p></TooltipContent>
                                                                </Tooltip>
                                                                 <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(village.id, 'active')}><ArrowRight className="h-4 w-4" /></Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent><p>Set to Active</p></TooltipContent>
                                                                </Tooltip>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(village.id, 'completed')}><CheckCheck className="h-4 w-4" /></Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent><p>Set to Completed</p></TooltipContent>
                                                                </Tooltip>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    </TooltipProvider>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    )
}
