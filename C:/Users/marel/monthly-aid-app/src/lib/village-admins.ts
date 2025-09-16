export type VillageAdmin = {
    id: number;
    name: string;
    phone: string;
    villageId: number; // The village they are responsible for
}

// Mock data for village admins
// In a real application, this would come from a database
export const villageAdmins: VillageAdmin[] = [
    { id: 1, name: "Village Admin 1", phone: "1234567890", villageId: 1 },
    { id: 2, name: "Village Admin 2", phone: "0987654321", villageId: 2 },
];
