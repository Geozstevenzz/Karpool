// src/helpers/chat.ts
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
  writeBatch,
  deleteDoc
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export async function getOrCreateChat(userA: string, userB: string) {
  const participants = [userA, userB].sort();
  const q = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', participants[0])
  );
  const snap = await getDocs(q);
  for (let d of snap.docs) {
    const data = d.data() as any;
    if (data.participants.includes(participants[1])) {
      return d.id;
    }
  }
  const ref = doc(collection(db, 'chats'));
  await setDoc(ref, {
    participants,
    lastMessage: '',
    lastUpdated: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Deletes a chat and all of its messages.
 */
export async function deleteChat(chatId: string) {
  // 1. Reference the chat doc
  const chatDocRef = doc(db, 'chats', chatId);
  // 2. Reference its messages sub-collection
  const msgsCollRef = collection(chatDocRef, 'messages');
  // 3. Fetch all messages
  const msgsSnap = await getDocs(msgsCollRef);
  // 4. Batch-delete each message
  const batch = writeBatch(db);
  msgsSnap.forEach(msgDoc => batch.delete(msgDoc.ref));
  await batch.commit();
  // 5. Finally delete the chat document itself
  await deleteDoc(chatDocRef);
}
