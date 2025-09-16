"use client"

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { villageAdmins } from '@/lib/village-admins';
import { villages } from '@/lib/data';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Beneficiary } from '@/lib/types';
import { summarizeBeneficiaryStory } from '@/ai/flows/summarize-beneficiary-stories';


// Mock the currently logged-in village admin.
// In a real app, this would come from a session or auth context.
const loggedInVillageAdmin = villageAdmins[0]; // Assumes the first admin is logged in.

interface SubmitBeneficiaryProps {
    beneficiaries: Beneficiary[];
    setBeneficiaries: React.Dispatch<React.SetStateAction<Beneficiary[]>>;
}


export function SubmitBeneficiary({ beneficiaries, setBeneficiaries }: SubmitBeneficiaryProps) {
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [village, setVillage] = useState('');
    const [category, setCategory] = useState('');
    const [otherCategory, setOtherCategory] = useState('');
    const [story, setStory] = useState('');
    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const activeVillages = villages.filter(v => v.status === 'active');
    const allOtherVillages = villages.filter(v => v.status !== 'active');


    const handleGenerateSummary = async () => {
        if (!story) {
            toast({
                variant: 'destructive',
                title: 'Story is empty',
                description: 'Please enter a beneficiary story to summarize.',
            });
            return;
        }
        setIsSummarizing(true);
        try {
            const result = await summarizeBeneficiaryStory({ story });
            setSummary(result.summary);
            toast({
                title: 'Summary Generated',
                description: 'The beneficiary story has been successfully summarized.',
            });
        } catch (error) {
            console.error('Error summarizing story:', error);
            toast({
                variant: 'destructive',
                title: 'Summarization Failed',
                description: 'Could not generate a summary. Please try again.',
            });
        } finally {
            setIsSummarizing(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const selectedVillageId = parseInt(village, 10);

        // Validation Check 1: Is the village active?
        const isVillageActive = activeVillages.some(v => v.id === selectedVillageId);
        if (!isVillageActive) {
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: "You cannot submit a case for this village as it is not currently active.",
            });
            setIsSubmitting(false);
            return;
        }

        // Validation Check 2: Does the admin belong to this village?
        if (loggedInVillageAdmin.villageId !== selectedVillageId) {
             toast({
                variant: "destructive",
                title: "Authorization Failed",
                description: "You are not authorized to submit cases for this village.",
            });
            setIsSubmitting(false);
            return;
        }

        // --- All checks passed, proceed with submission ---

        const newBeneficiary: Beneficiary = {
            id: `temp-${Math.random()}`, // Temporary unique ID for client-side state
            name,
            villageId: selectedVillageId,
            category,
            otherCategory: category === 'Other' ? otherCategory : undefined,
            story,
            summary,
            status: 'PENDING',
            isFeatured: false,
            proofs: ['https://picsum.photos/seed/new/600/400'], // Placeholder proof
            createdAt: new Date(),
            donations: [],
            villageAdminId: loggedInVillageAdmin.id,
            villageAdminName: loggedInVillageAdmin.name,
        };
        
        // Simulate API submission by updating state
        setBeneficiaries(prev => [...prev, newBeneficiary]);

        toast({
            title: "Case Submitted",
            description: `${name}'s case for ${activeVillages.find(v => v.id === selectedVillageId)?.name} has been submitted for approval.`
        });

        // Reset form to allow adding another
        setName('');
        setVillage('');
        setCategory('');
        setOtherCategory('');
        setStory('');
        setSummary('');
        setIsSubmitting(false);
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit a New Case</CardTitle>
        <CardDescription>
          Fill out the form to add a new beneficiary. The case will be sent for admin approval. Please prioritize cases based on urgency.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Beneficiary Name</Label>
              <Input 
                id="name"
                placeholder="e.g. Ram Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="village">Village</Label>
               <Select onValueChange={setVillage} value={village} required>
                    <SelectTrigger id="village">
                        <SelectValue placeholder="Select a village" />
                    </SelectTrigger>
                    <SelectContent>
                        {activeVillages.map(v => (
                            <SelectItem key={v.id} value={v.id.toString()}>
                                {v.name}
                            </SelectItem>
                        ))}
                        {allOtherVillages.map(v => (
                             <SelectItem key={v.id} value={v.id.toString()} disabled>
                                {v.name} ({v.status})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="category">Case Category</Label>
                    <Select onValueChange={setCategory} value={category} required>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Select a priority category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Orphaned Children">Orphaned Children</SelectItem>
                            <SelectItem value="Destitute Elderly">Destitute Elderly / Abandoned Parents</SelectItem>
                            <SelectItem value="Urgent Medical Need">Urgent Medical Need</SelectItem>
                            <SelectItem value="Unsupported Girl Child">Unsupported Girl Child</SelectItem>
                            <SelectItem value="Loss of Home (Fire/Disaster)">Loss of Home (Fire/Disaster)</SelectItem>
                            <SelectItem value="Talented but Needy Student">Talented but Needy Student</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {category === 'Other' && (
                    <div className="grid gap-2">
                        <Label htmlFor="other-category">Please Specify Problem</Label>
                        <Input
                            id="other-category"
                            placeholder="Briefly describe the unique situation"
                            value={otherCategory}
                            onChange={(e) => setOtherCategory(e.target.value)}
                            required
                        />
                    </div>
                )}
            </div>
          <div className="grid gap-2">
            <Label htmlFor="story">Beneficiary Story</Label>
            <Textarea
              id="story"
              placeholder="Provide a detailed story about the beneficiary's situation, needs, and how the funds will be used."
              className="min-h-32"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
                <Label htmlFor="summary">AI-Generated Summary</Label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateSummary}
                    disabled={isSummarizing || !story}
                >
                    {isSummarizing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        'Generate Summary'
                    )}
                </Button>
            </div>
            <Textarea
              id="summary"
              placeholder="A concise summary will be generated here."
              className="min-h-24 bg-muted/50"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="picture">Proofs (Photos/Videos)</Label>
            <Input id="picture" type="file" multiple required />
            <p className="text-xs text-muted-foreground">Upload images or videos as proof. Max 5 files.</p>
          </div>
          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit for Approval
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
