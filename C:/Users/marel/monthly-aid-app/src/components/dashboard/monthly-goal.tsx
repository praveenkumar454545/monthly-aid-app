"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function MonthlyGoal() {
  const amountRaised = 125430;
  const goal = 200000;
  const progress = (amountRaised / goal) * 100;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>This Month's Goal</CardTitle>
        <CardDescription>
          Help us reach our target to fund more families.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl font-bold">₹{amountRaised.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">/ ₹{goal.toLocaleString()}</span>
        </div>
        <Progress value={progress} className="mt-4" />
      </CardContent>
      <CardFooter>
        <Button className="w-full">Open Donation Window</Button>
      </CardFooter>
    </Card>
  )
}
