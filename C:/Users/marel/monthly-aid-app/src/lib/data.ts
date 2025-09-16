import type { Beneficiary, Donor, DonationWindow, MonthlyDonation, Village, TeamMember } from './types';
import { placeholderImages } from './placeholder-images.json';

// Mock Data
export const donationWindow: DonationWindow = {
  id: 1,
  startTime: '2024-08-01T00:00:00Z',
  endTime: '2024-08-02T23:59:59Z',
  isActive: true, // Set to true to see active state
};

export const donors: Donor[] = [
  { id: "1", name: 'Suresh Kumar', phone: '9876543210', createdAt: '2024-07-01T10:00:00Z', donations: [
    { id: 1, amount: 500, beneficiaryId: 1, createdAt: '2024-07-10T11:00:00Z' },
    { id: 2, amount: 100, beneficiaryId: 2, createdAt: '2024-07-11T12:00:00Z' }
  ], isFeatured: true},
  { id: "2", name: 'Priya Sharma', phone: '9123456780', createdAt: '2024-07-02T09:00:00Z', donations: [
    { id: 3, amount: 1000, beneficiaryId: 1, createdAt: '2024-07-12T14:00:00Z' }
  ], isFeatured: true},
  { id: "3", name: 'Amit Patel', phone: '9988776655', createdAt: '2024-07-03T11:30:00Z', donations: [
    { id: 4, amount: 250, beneficiaryId: 3, createdAt: '2024-05-15T18:00:00Z' }
  ], isFeatured: false},
  { id: "4", name: 'Sunita Devi', phone: '9765432109', createdAt: '2024-07-04T16:20:00Z', donations: [
    { id: 5, amount: 750, beneficiaryId: 2, createdAt: '2024-06-25T10:00:00Z' }
  ], isFeatured: true},
  { id: "5", name: 'Rajesh Singh', phone: '9654321098', createdAt: '2024-07-05T13:00:00Z', donations: [
    { id: 6, amount: 1500, beneficiaryId: 4, createdAt: '2024-05-08T08:00:00Z' }
  ], isFeatured: false},
];

export const villages: Village[] = [
    { id: 1, name: "Rampur", mandal: "Tirupati Urban", district: "Tirupati", status: 'active'},
    { id: 2, name: "Srikalahasti", mandal: "Srikalahasti", district: "Tirupati", status: 'active'},
    { id: 3, name: "Puttur", mandal: "Puttur", district: "Tirupati", status: 'queued' },
    { id: 4, name: "Nagari", mandal: "Nagari", district: "Tirupati", status: 'completed' },
    { id: 5, name: "Satyavedu", mandal: "Satyavedu", district: "Tirupati", status: 'inactive' },
];

export const beneficiaries: Beneficiary[] = [
  {
    id: 1,
    name: 'Lakshmi Devi & Family',
    category: 'Loss of Home (Fire/Disaster)',
    story: 'Lakshmi Devi is a single mother of three children living in a small village. Her husband passed away last year due to a sudden illness, leaving the family with no source of income. She works as a daily wage laborer on a farm, but the income is inconsistent and barely enough to feed her children. The family lives in a dilapidated mud house which is at risk of collapsing during the monsoon season. Funds are required to repair their home and provide educational support for her children.',
    summary: 'A widowed single mother of three needs funds to repair her crumbling home and support her children\'s education after her husband\'s death left them without a stable income.',
    status: 'FUNDED',
    isFeatured: true,
    proofs: [placeholderImages[0].imageUrl],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    villageId: 1,
    createdAt: '2024-06-15T00:00:00Z',
    donations: donors.flatMap(d => d.donations.filter(don => don.beneficiaryId === 1))
  },
  {
    id: 2,
    name: 'Mohan Das',
    category: 'Destitute Elderly',
    story: 'Mohan Das, an elderly farmer, lost his entire crop due to unseasonal floods. He had taken a loan to buy seeds and fertilizers, and now he is in heavy debt with no means to repay it. His family is struggling for daily meals. He needs financial assistance to clear his debts and get back on his feet for the next sowing season.',
    summary: 'An elderly farmer, Mohan Das, is in severe debt after floods destroyed his crops. He needs financial help to repay loans and recover from the loss.',
    status: 'FUNDED',
    isFeatured: true,
    proofs: [placeholderImages[1].imageUrl],
    villageId: 2,
    createdAt: '2024-06-20T00:00:00Z',
    donations: donors.flatMap(d => d.donations.filter(don => don.beneficiaryId === 2))
  },
  {
    id: 3,
    name: 'Rina\'s Education',
    category: 'Talented but Needy Student',
    story: 'Rina is a bright 16-year-old girl who scored top marks in her 10th-grade exams. She dreams of becoming a doctor but her father, a rickshaw puller, cannot afford her further education. The family is struggling to make ends meet and Rina might have to drop out of school. Assistance is needed to fund her college admission and books.',
    summary: 'Rina, a brilliant 16-year-old from a poor family, may have to abandon her dream of becoming a doctor due to financial hardship. She needs support for her college education.',
    status: 'FUNDED',
    isFeatured: true,
    proofs: [placeholderImages[2].imageUrl],
    villageId: 3,
    createdAt: '2024-05-10T00:00:00Z',
    donations: donors.flatMap(d => d.donations.filter(don => don.beneficiaryId === 3))
  },
  {
    id: 4,
    name: 'Community Kitchen',
    category: 'Other',
    otherCategory: 'Food scarcity due to drought',
    story: 'A small village is facing severe food scarcity due to a prolonged drought. Many families, especially children and the elderly, are going hungry. A group of volunteers wants to set up a community kitchen to provide at least one hot meal a day to everyone in need. They require funds to purchase grains, vegetables, and cooking equipment.',
    summary: 'Volunteers in a drought-stricken village are seeking funds to start a community kitchen that will provide daily hot meals to families facing severe food shortages.',
    status: 'FUNDED',
    isFeatured: true,
    proofs: [placeholderImages[3].imageUrl],
    villageId: 1,
    createdAt: '2024-05-05T00:00:00Z',
    donations: donors.flatMap(d => d.donations.filter(don => don.beneficiaryId === 4))
  },
  {
    id: 5,
    name: 'Medical treatment for Gopal',
    category: 'Urgent Medical Need',
    story: 'Gopal is a 10 year old boy suffering from a rare heart condition that requires immediate surgery. His father is a construction worker and the sole earner for the family of five. The cost of the surgery is beyond their means and they have exhausted all their savings. Without this surgery, Gopal\'s life is at risk.',
    summary: '10-year-old Gopal requires urgent, life-saving heart surgery that his family, led by a construction worker father, cannot afford. They have depleted their savings and need immediate financial aid.',
    status: 'APPROVED',
    isFeatured: false,
    proofs: [placeholderImages[4].imageUrl],
    villageId: 4,
    createdAt: '2024-07-20T10:00:00Z',
    donations: []
  },
   {
    id: 6,
    name: 'Help Sita rebuild her life',
    category: 'Loss of Home (Fire/Disaster)',
    story: 'Sita\'s house was destroyed in a fire, and she lost all her belongings. She is currently living in a temporary shelter with her two young children. She needs help to rebuild her home and provide a safe environment for her kids.',
    summary: 'Sita needs help to rebuild her home and provide for her children after a fire destroyed everything she owned.',
    status: 'PENDING',
    isFeatured: false,
    proofs: ["https://picsum.photos/seed/6/600/400"],
    villageId: 2,
    createdAt: '2024-07-22T10:00:00Z',
    donations: [],
    villageAdminId: 1,
    villageAdminName: 'Village Admin 1',
  }
];


export const monthlyDonations: MonthlyDonation[] = [
    { name: "January 2024", total: 32540 },
    { name: "February 2024", total: 41820 },
    { name: "March 2024", total: 28760 },
    { name: "April 2024", total: 52310 },
    { name: "May 2024", total: 48990 },
    { name: "June 2024", total: 125430 },
];

export const teamMembers: TeamMember[] = [
  { id: 1, name: 'Ravi Kumar', role: 'Founder & CEO', avatarUrl: 'https://i.pravatar.cc/150?u=team1' },
  { id: 2, name: 'Anjali Gupta', role: 'Head of Operations', avatarUrl: 'https://i.pravatar.cc/150?u=team2' },
  { id: 3, name: 'Sanjay Reddy', role: 'Lead Developer', avatarUrl: 'https://i.pravatar.cc/150?u=team3' },
  { id: 4, name: 'Priya Singh', role: 'Community Manager', avatarUrl: 'https://i.pravatar.cc/150?u=team4' },
  { id: 5, name: 'Vikram Choudhury', role: 'Marketing Lead', avatarUrl: 'https://i.pravatar.cc/150?u=team5' },
];
