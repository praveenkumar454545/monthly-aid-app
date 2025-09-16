
export type Admin = {
    id: number;
    name: string;
    phone: string;
}

// Mock data for super admins
// In a real application, this would come from a secure database
export const admins: Admin[] = [
    { id: 101, name: "Super Admin", phone: "9392444282" },
    // You can add more admin phone numbers here
];
