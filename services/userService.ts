import { supabase } from '../lib/supabase';
import { UserProfile, UserProgress, TrackType } from '../types';
import { INITIAL_USER_STATE } from '../constants';

// Column lists to keep selects/updates narrow
const PROFILE_COLUMNS =
  'user_id, display_name, learner_type, age_group, goals, experience, learning_style, devices, time_per_day, parent_report, phone_number, address';
const PROGRESS_COLUMNS =
  'user_id, current_track, xp, streak, completed_lessons, badges, last_completed_at';

// Helper function to log and enhance Supabase errors
const handleSupabaseError = (error: any, operation: string): never => {
  const errorMessage = error?.message || 'Unknown error';
  const errorCode = error?.code || 'UNKNOWN';
  const statusCode = error?.status || error?.statusCode;
  
  // Log detailed error information for debugging
  console.error(`[Supabase ${operation}] Error:`, {
    message: errorMessage,
    code: errorCode,
    status: statusCode,
    details: error?.details,
    hint: error?.hint,
  });

  // Provide user-friendly error messages based on status codes
  if (statusCode === 401) {
    throw new Error(
      `Authentication failed during ${operation}. Please check your Supabase credentials and RLS policies.`
    );
  }
  
  if (statusCode === 403) {
    throw new Error(
      `Access denied during ${operation}. Please check RLS policies for the 'anon' role.`
    );
  }

  throw error;
};

const mapProfileRow = (row: any): UserProfile => ({
  id: row.user_id,
  name: row.display_name,
  learnerType: row.learner_type,
  ageGroup: row.age_group,
  goals: row.goals || [],
  experience: row.experience,
  learningStyle: row.learning_style,
  devices: row.devices || [],
  timePerDay: row.time_per_day || 0,
  parentReport: row.parent_report ?? false,
  phoneNumber: row.phone_number || '',
  address: row.address || '',
});

const mapProgressRow = (row: any): UserProgress => ({
  xp: row.xp ?? INITIAL_USER_STATE.xp,
  streak: row.streak ?? INITIAL_USER_STATE.streak,
  completedLessons: row.completed_lessons || [],
  badges: row.badges || [],
  currentTrack: (row.current_track as TrackType) || INITIAL_USER_STATE.currentTrack,
});

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) handleSupabaseError(error, 'fetchUserProfile');
  return data ? mapProfileRow(data) : null;
};

export const upsertUserProfile = async (userId: string, profile: UserProfile): Promise<UserProfile> => {
  const payload = {
    user_id: userId,
    display_name: profile.name,
    learner_type: profile.learnerType,
    age_group: profile.ageGroup,
    goals: profile.goals,
    experience: profile.experience,
    learning_style: profile.learningStyle,
    devices: profile.devices,
    time_per_day: profile.timePerDay,
    parent_report: profile.parentReport,
    phone_number: profile.phoneNumber || null,
    address: profile.address || null,
  };

  const { data, error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'user_id' })
    .select(PROFILE_COLUMNS)
    .single();

  if (error) handleSupabaseError(error, 'upsertUserProfile');
  return mapProfileRow(data);
};

export const fetchProgress = async (userId: string): Promise<UserProgress> => {
  const { data, error } = await supabase
    .from('progress')
    .select(PROGRESS_COLUMNS)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) handleSupabaseError(error, 'fetchProgress');
  return data ? mapProgressRow(data) : INITIAL_USER_STATE;
};

export const upsertProgress = async (
  userId: string,
  progress: UserProgress
): Promise<UserProgress> => {
  const payload = {
    user_id: userId,
    current_track: progress.currentTrack,
    xp: progress.xp,
    streak: progress.streak,
    completed_lessons: progress.completedLessons,
    badges: progress.badges,
    last_completed_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('progress')
    .upsert(payload, { onConflict: 'user_id' })
    .select(PROGRESS_COLUMNS)
    .single();

  if (error) handleSupabaseError(error, 'upsertProgress');
  return mapProgressRow(data);
};

export const recordLessonCompletion = async (
  userId: string,
  lessonId: string,
  xpReward: number
): Promise<UserProgress> => {
  // Idempotent insert into lesson_completions
  await supabase
    .from('lesson_completions')
    .upsert({ user_id: userId, lesson_id: lessonId }, { onConflict: 'user_id,lesson_id' });

  const current = await fetchProgress(userId);

  const alreadyCompleted = current.completedLessons.includes(lessonId);
  const updated: UserProgress = {
    ...current,
    xp: current.xp + (alreadyCompleted ? 0 : xpReward),
    completedLessons: alreadyCompleted
      ? current.completedLessons
      : [...current.completedLessons, lessonId],
  };

  return upsertProgress(userId, updated);
};

export const updateTrack = async (
  userId: string,
  track: TrackType,
  currentProgress?: UserProgress
): Promise<UserProgress> => {
  const base = currentProgress || (await fetchProgress(userId));
  return upsertProgress(userId, { ...base, currentTrack: track });
};
