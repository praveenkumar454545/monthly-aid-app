"use client";

import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Progress } from "../ui/progress";

export function DataImporter() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [collectionName, setCollectionName] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file || !collectionName) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a file and a target collection.",
      });
      return;
    }
    setIsImporting(true);
    toast({
        variant: "destructive",
        title: "Action Not Available",
        description: "Database imports are a server-side operation and not available in a static export.",
      });
    setTimeout(() => setIsImporting(false), 1000);
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
       <div>
          <h3 className="font-semibold">Import Data from CSV</h3>
          <p className="text-sm text-muted-foreground">Upload a CSV file to bulk-add data to a Firestore collection. Ensure the CSV headers match your data structure.</p>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="file-upload">CSV File</Label>
          <Input
            id="file-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            ref={fileInputRef}
            disabled={isImporting}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="collection-name">Target Collection</Label>
          <Select
            onValueChange={setCollectionName}
            value={collectionName}
            disabled={isImporting}
          >
            <SelectTrigger id="collection-name">
              <SelectValue placeholder="Select collection..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="users">Users</SelectItem>
              <SelectItem value="beneficiaries">Beneficiaries</SelectItem>
              <SelectItem value="villages">Villages</SelectItem>
              <SelectItem value="apdata">AP Data</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
       {isImporting && (
        <div className="space-y-2">
          <Label>Importing...</Label>
          <Progress value={progress} />
          <p className="text-xs text-muted-foreground text-center">{Math.round(progress)}%</p>
        </div>
      )}
      <Button
        onClick={handleImport}
        disabled={isImporting || !file || !collectionName}
        className="w-full sm:w-auto"
      >
        {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Import Data
      </Button>
    </div>
  );
}
