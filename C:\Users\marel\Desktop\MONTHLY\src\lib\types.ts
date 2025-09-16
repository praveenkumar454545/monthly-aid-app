export type BeneficiaryStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'FUNDED';

export interface Donation {
    id: number;
    amount: number;
    beneficiaryId: number;
    createdAt: string;
}
  
export interface Beneficiary {
  id: number | string;
  name: string;
  category: string;
  otherCategory?: string;
  story: string;
  summary?: string;
  status: BeneficiaryStatus;
  isFeatured: boolean;
  proofs: string[];
  youtubeUrl?: string;
  villageId: number;
  villageAdminId?: number;
  villageAdminName?: string;
  rejectionReason?: string;
  createdAt: string | Date;
  donations: Omit<Donation, 'beneficiaryId'>[];
}

export interface User {
    id: string; // Firestore document ID
    name:string;
    phone: string;
    avatarUrl?: string;
    createdAt: string | Date;
    totalDonated: number; // Total amount donated by the user
}
export interface Donor extends Omit<User, 'id'> {
  id: string | number; // Allow number for mock data
  isFeatured: boolean;
  donations: Omit<Donation, 'beneficiaryId'>[];
}


export interface DonationWindow {
    id: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
}

export interface MonthlyDonation {
    name: string;
    total: number;
}

export interface VillageAdmin {
    id: number;
    name: string;
    phone: string;
    villageId: number;
}

export type VillageStatus = 'active' | 'queued' | 'inactive' | 'completed';

export interface Village {
    id: any;
    name: string;
    mandal: string;
    district: string;
    status: VillageStatus;
}

export interface TeamMember {
  id: string | number;
  name: string;
  role: string;
  avatarUrl?: string;
}
