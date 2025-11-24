import { useState, useEffect } from 'react';
import { UserProfile, UserProgress } from '../types';
import { INITIAL_USER_STATE } from '../constants';
import {
  fetchProgress,
  fetchUserProfile,
  upsertUserProfile,
} from '../services/userService';

/**
 * Custom hook to manage user profile and progress data
 */
export const useUserData = (userId: string | null) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>(INITIAL_USER_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingProfile, setPendingProfile] = useState<UserProfile | null>(null);

  // Apply any onboarding profile saved before email verification
  const maybeApplyPendingProfile = async (uid: string) => {
    const raw = localStorage.getItem('pending_profile');
    if (!raw) return;

    try {
      const profile = JSON.parse(raw) as UserProfile;
      const saved = await upsertUserProfile(uid, profile);
      setUserProfile(saved);
      setPendingProfile(null);
      localStorage.removeItem('pending_profile');
    } catch (err) {
      console.error('Failed to apply pending profile after login', err);
      // Do not block boot; keep pending_profile for a later retry.
      try {
        JSON.parse(raw);
      } catch {
        localStorage.removeItem('pending_profile');
      }
    }
  };

  // Load user data when userId changes
  useEffect(() => {
    if (!userId) {
      setUserProfile(null);
      setUserProgress(INITIAL_USER_STATE);
      return;
    }

    const loadUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [profile, progress] = await Promise.all([
          fetchUserProfile(userId),
          fetchProgress(userId),
        ]);
        setUserProfile(profile);
        setUserProgress(progress);
        await maybeApplyPendingProfile(userId);
      } catch (err: unknown) {
        console.error(err);
        setError('Could not load your data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

  return {
    userProfile,
    userProgress,
    loading,
    error,
    setUserProfile,
    setUserProgress,
    setError,
    pendingProfile,
    setPendingProfile,
    maybeApplyPendingProfile,
  };
};
