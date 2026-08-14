import { ref, push, set, onValue, remove, get } from "firebase/database";
import { db } from "./firebase";

export interface RSVPResponse {
  id?: string | undefined;
  name: string;
  email?: string | undefined;
  phone?: string | undefined;
  attending: "yes" | "no" | "maybe";
  guestCount: number;
  events: string[];
  message?: string | undefined;
  submittedAt: string;
}

/** Submit a guest RSVP to Firebase RTDB */
export async function submitRSVP(data: Omit<RSVPResponse, "submittedAt">): Promise<string> {
  const rsvpListRef = ref(db, "wedding/rsvp");
  const newRsvpRef = push(rsvpListRef);
  const payload: RSVPResponse = {
    ...data,
    id: newRsvpRef.key || undefined,
    submittedAt: new Date().toISOString(),
  };
  await set(newRsvpRef, payload);
  return newRsvpRef.key || "";
}

/** Fetch all RSVPs (Admin) */
export function subscribeRSVPs(callback: (rsvps: RSVPResponse[]) => void): () => void {
  const rsvpListRef = ref(db, "wedding/rsvp");
  return onValue(rsvpListRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    const val = snapshot.val();
    const list: RSVPResponse[] = Object.keys(val).map((k) => ({
      ...val[k],
      id: k,
    }));
    // Sort newest first
    list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    callback(list);
  });
}

/** Delete RSVP entry (Admin) */
export async function deleteRSVP(id: string): Promise<void> {
  const itemRef = ref(db, `wedding/rsvp/${id}`);
  await remove(itemRef);
}
