import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth, initAuth, hasConfig } from "@/lib/firebase";

interface UserProgress {
  guideStep: number;
  guideCompleted: boolean;
  checkedItems: Record<number, boolean[]>;
  chatHistory: { role: string; content: string }[];
  lastVisit: string;
}

const DEFAULT_PROGRESS: UserProgress = {
  guideStep: 0,
  guideCompleted: false,
  checkedItems: {},
  chatHistory: [],
  lastVisit: new Date().toISOString(),
};

export function useUserProgress() {
  const [uid, setUid] = useState<string | null>(null);
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [loading, setLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(false);

  // Initialize auth
  useEffect(() => {
    if (!hasConfig) {
      setLoading(false);
      return;
    }

    initAuth((userId) => {
      setUid(userId);
      setFirebaseReady(!!userId);
      if (!userId) setLoading(false);
    });
  }, []);

  // Load progress from Firestore
  useEffect(() => {
    if (!uid || !db) return;

    const loadProgress = async () => {
      try {
        const docRef = doc(db, "users", uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setProgress({ ...DEFAULT_PROGRESS, ...snap.data() } as UserProgress);
        }
      } catch (err) {
        console.error("Failed to load progress:", err);
      }
      setLoading(false);
    };

    loadProgress();
  }, [uid]);

  // Save progress to Firestore
  const saveProgress = async (updates: Partial<UserProgress>) => {
    const newProgress = { ...progress, ...updates, lastVisit: new Date().toISOString() };
    setProgress(newProgress);

    if (!uid || !db) return;

    try {
      const docRef = doc(db, "users", uid);
      await setDoc(docRef, newProgress, { merge: true });
    } catch (err) {
      console.error("Failed to save progress:", err);
    }
  };

  // Save chat history
  const saveChatHistory = async (messages: { role: string; content: string }[]) => {
    await saveProgress({ chatHistory: messages.slice(-50) }); // Keep last 50 messages
  };

  return {
    progress,
    saveProgress,
    saveChatHistory,
    loading,
    firebaseReady,
    uid,
  };
}
