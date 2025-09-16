"use client"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { monthlyDonations as initialMonthlyDonations, beneficiaries } from "@/lib/data";
import { useMemo } from "react";

export function DonationStats() {
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const monthlyDonations = useMemo(() => {
    return monthNames.map((monthName, index) => {
      const total = beneficiaries.reduce((acc, ben) => {
        if (!ben.createdAt) return acc;
        const benDate = new Date(String(ben.createdAt));
        const benMonth = benDate.getUTCMonth();
  
        if (benMonth === index && ben.status === 'FUNDED') {
          return acc + (ben.donations ?? []).reduce((dAcc, d) => dAcc + (d.amount || 0), 0);
        }
        return acc;
      }, 0);
      
      const initialMonthString = `${monthName} 2024`;
      const initialData = initialMonthlyDonations.find(m => m.name.startsWith(monthName))?.total || 0;
  
      return { name: monthName, total: total > 0 ? total : initialData };
    });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Donations</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyDonations}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
