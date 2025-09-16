
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { villageAdmins } from '@/lib/village-admins';


export default function VillageAdminLoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [step, setStep] = useState('enter_phone'); // 'enter_phone' | 'enter_otp'
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const adminPhoneNumbers = villageAdmins.map(admin => admin.phone);

    const handlePhoneSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call to check phone number and send OTP
        setTimeout(() => {
            if (adminPhoneNumbers.includes(phoneNumber)) {
                toast({
                    title: "OTP Sent",
                    description: "An OTP has been sent to your mobile number.",
                });
                setStep('enter_otp');
            } else {
                toast({
                    variant: "destructive",
                    title: "Access Denied",
                    description: "You are not authorized for Village Admin access.",
                });
            }
            setIsLoading(false);
        }, 1000);
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate OTP verification
        setTimeout(() => {
            // In a real app, you'd verify the OTP against a backend service.
            // Here, we'll accept any 6-digit OTP for demonstration.
            if (otp.length === 6 && /^\d{6}$/.test(otp)) {
                 toast({
                    title: "Login Successful",
                    description: "Redirecting to the village admin dashboard...",
                });
                // On successful login, you would typically set a session cookie or token.
                // For this simulation, we'll just redirect.
                router.push('/village-admin/dashboard');
            } else {
                toast({
                    variant: "destructive",
                    title: "Invalid OTP",
                    description: "Please enter a valid 6-digit OTP.",
                });
            }
            setIsLoading(false);
        }, 1000);
    }


  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
        {step === 'enter_phone' && (
            <Card className="w-full max-w-sm">
                <form onSubmit={handlePhoneSubmit}>
                    <CardHeader>
                        <CardTitle className="text-2xl">Village Admin Login</CardTitle>
                        <CardDescription>
                            Enter your mobile number to receive a one-time password (OTP).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Mobile Number</Label>
                            <Input 
                                id="phone" 
                                type="tel" 
                                placeholder="9876543210" 
                                required 
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                pattern="[0-9]{10}"
                                title="Please enter a 10-digit mobile number"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" type="submit" disabled={isLoading}>
                             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send OTP
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        )}

        {step === 'enter_otp' && (
             <Card className="w-full max-w-sm">
                <form onSubmit={handleOtpSubmit}>
                    <CardHeader>
                        <CardTitle className="text-2xl">Enter OTP</CardTitle>
                        <CardDescription>
                            An OTP has been sent to +91 {phoneNumber}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="otp">One-Time Password</Label>
                            <Input 
                                id="otp" 
                                type="text"
                                required 
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full" type="submit" disabled={isLoading}>
                           {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Verify OTP & Login
                        </Button>
                        <Button variant="link" size="sm" onClick={() => setStep('enter_phone')}>
                            Use a different number
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        )}
    </div>
  )
}
