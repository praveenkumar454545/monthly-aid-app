
import { collection, addDoc, onSnapshot, doc, updateDoc, writeBatch, getDocs, query, type Unsubscribe, setDoc, runTransaction } from "firebase/firestore";
import { db } from "./firebase";
import { villages as mockVillages } from "./data";
import type { Village, VillageStatus, User } from "./types";
import type { RecordAnonymousDonationInput, RecordAnonymousDonationOutput } from "@/ai/flows/record-anonymous-donation-flow";
import type { LogDonationInput, LogDonationOutput } from '@/ai/flows/log-donation-flow';
import type { RecordDonationInput, RecordDonationOutput } from "@/ai/flows/record-donation-flow";


const VILLAGES_COLLECTION = "villages";
const USERS_COLLECTION = "users";
const TOTALS_COLLECTION = 'monthlyTotals';
const DONATIONS_COLLECTION = 'donations';
const DONORS_COLLECTION = 'donors';


// Seeding function to populate Firestore with initial mock data
export async function seedVillages() {
    const villagesCollection = collection(db, VILLAGES_COLLECTION);
    
    const q = query(villagesCollection);
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        console.log("Villages collection already seeded.");
        return;
    }

    const batch = writeBatch(db);
    
    mockVillages.forEach(village => {
        // Firestore will auto-generate IDs, so we exclude the mock ID.
        // We also need to map the 'name' field from mock data to 'village'
        const { id, name, ...rest } = village;
        const villageData = {
            ...rest,
            village: name
        }
        const docRef = doc(collection(db, VILLAGES_COLLECTION));
        batch.set(docRef, villageData);
    });

    await batch.commit();
    console.log("Villages collection has been seeded.");
}

// Function to batch upload data to a specified collection
export async function batchUpload(collectionName: string, data: any[]) {
    if (!data.length) {
        throw new Error("Data array is empty. Nothing to upload.");
    }

    const batchSize = 500;
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = writeBatch(db);
        const chunk = data.slice(i, i + batchSize);
        
        chunk.forEach(item => {
            const docRef = doc(collection(db, collectionName));
            batch.set(docRef, item);
        });

        await batch.commit();
        console.log(`Uploaded batch ${Math.floor(i / batchSize) + 1} to ${collectionName}`);
    }
}


// Get real-time updates for villages from a dynamic collection
export function getVillagesFromCollection(
    collectionName: string,
    callback: (villages: Village[]) => void,
    onError: (error: Error) => void
): Unsubscribe {
    const villagesCollection = collection(db, collectionName);
    
    const unsubscribe = onSnapshot(villagesCollection, (querySnapshot) => {
        const villages: Village[] = [];
        querySnapshot.forEach((doc) => {
            villages.push({ id: doc.id, ...doc.data() } as Village);
        });
        callback(villages);
    }, (error) => {
        console.error(`Error fetching from ${collectionName}: `, error);
        onError(error);
    });

    return unsubscribe;
}

// Update the status of a village in a dynamic collection
export async function updateVillageStatusInCollection(collectionName: string, villageId: string, status: VillageStatus) {
    const villageDocRef = doc(db, collectionName, villageId);
    await updateDoc(villageDocRef, { status });
}

// Add a new user to the database
export async function addUser(name: string, phone: string, avatarUrl?: string) {
    const newUserRef = doc(collection(db, USERS_COLLECTION));
    
    const newUser: Omit<User, 'id'> = {
        name,
        phone,
        avatarUrl: avatarUrl || '',
        createdAt: new Date(),
        totalDonated: 0,
    };

    await setDoc(newUserRef, newUser);
    return { id: newUserRef.id, ...newUser };
}


export async function recordAnonymousDonationInFirestore(input: RecordAnonymousDonationInput): Promise<RecordAnonymousDonationOutput> {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = (now.getUTCMonth() + 1).toString().padStart(2, '0'); // Pad with leading zero
  const monthId = `${year}-${month}`;

  const monthDocRef = doc(db, TOTALS_COLLECTION, monthId);

  try {
    await runTransaction(db, async (transaction) => {
        const monthDoc = await transaction.get(monthDocRef);

        if (!monthDoc.exists()) {
             // If the document doesn't exist, create it.
             transaction.set(monthDocRef, {
                total: input.amount,
                anonymousDonations: 1
            });
        } else {
             // If the document exists, update it.
             const currentData = monthDoc.data();
             const newTotal = (currentData.total || 0) + input.amount;
             const newDonationCount = (currentData.anonymousDonations || 0) + 1;
             
             transaction.update(monthDocRef, { 
                total: newTotal,
                anonymousDonations: newDonationCount
            });
        }
    });

     return {
      month: monthId,
      message: `Thank you for your generous anonymous donation of ₹${input.amount}. It has been successfully recorded.`,
    };

  } catch (error) {
    console.error('Error recording anonymous donation in Firestore: ', error);
    throw new Error('Failed to record anonymous donation due to a database error.');
  }
}

export async function logDonationInFirestore(input: LogDonationInput): Promise<LogDonationOutput> {
    const donationData = {
        name: input.name,
        phone: input.phone,
        amount: input.amount,
        createdAt: new Date().toISOString(),
        ...(input.beneficiaryId && { beneficiaryId: input.beneficiaryId }),
    };

    try {
        await recordAnonymousDonationInFirestore({ amount: input.amount });
        const docRef = await addDoc(collection(db, DONATIONS_COLLECTION), donationData);
        return {
            donationId: docRef.id,
            message: `Thank you, ${input.name}! Your donation of ₹${input.amount} has been successfully recorded.`,
        };
    } catch (error) {
        console.error('Error logging donation in Firestore: ', error);
        throw new Error('Failed to record donation in Firestore: ', error);
    }
}

export async function recordDonationInFirestore(input: RecordDonationInput): Promise<RecordDonationOutput> {
  const donorDocRef = doc(db, DONORS_COLLECTION, input.userId);
  const now = new Date();

  const donationData = {
    amount: input.amount,
    createdAt: now.toISOString(),
    ...(input.beneficiaryId && {beneficiaryId: input.beneficiaryId}),
  };

  try {
    // First, update the monthly total. This is for all donations.
    await recordAnonymousDonationInFirestore({ amount: input.amount });

    // Then, update the specific donor's record in a transaction.
    await runTransaction(db, async (transaction) => {
      const donorDoc = await transaction.get(donorDocRef);
      
      if (!donorDoc.exists()) {
        // New donor, create a new document
        const newDonorData = {
          name: input.name,
          phone: input.phone,
          createdAt: now.toISOString(),
          totalDonated: input.amount,
          donations: [donationData],
          isFeatured: false,
          userId: input.userId,
        };
        transaction.set(donorDocRef, newDonorData);
      } else {
        // Existing donor, update their document
        const currentData = donorDoc.data();
        const newDonations = [...(currentData.donations || []), donationData];
        const newTotalDonated = (currentData.totalDonated || 0) + input.amount;

        transaction.update(donorDocRef, { 
          donations: newDonations,
          totalDonated: newTotalDonated,
          name: input.name // Always update the name to the latest provided one
        });
      }
    });

    return {
      donorId: input.userId,
      message: `Thank you, ${input.name}! Your donation of ₹${input.amount} has been successfully recorded.`,
    };

  } catch (error) {
    console.error('Error recording donation in Firestore: ', error);
    // In a real app, you might want to throw a more specific error
    throw new Error('Failed to record donation due to a database error.');
  }
}
