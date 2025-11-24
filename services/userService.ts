import { supabase } from '../lib/supabase';
import { UserProfile, UserProgress, TrackType } from '../types';
import { INITIAL_USER_STATE } from '../constants';
import { AppError, ValidationError } from '../lib/errors';

// Column lists to keep selects/updates narrow
const PROFILE_COLUMNS =
  'user_id, display_name, learner_type, age_group, goals, experience, learning_style, devices, time_per_day, parent_report, phone_number, address';
const PROGRESS_COLUMNS =
  'user_id, current_track, xp, streak, completed_lessons, badges, last_completed_at';

/**
 * Runtime validation helper for profile data
 */
const validateProfileData = (data: unknown): data is Record<string, unknown> => {
  if (!data || typeof data !== 'object') return false;
  const r = data as Record<string, unknown>;
  return (
    typeof r.user_id === 'string' &&
    typeof r.display_name === 'string' &&
    typeof r.learner_type === 'string' &&
    typeof r.age_group === 'string'
  );
};

/**
 * Runtime validation helper for progress data
 */
const validateProgressData = (data: unknown): data is Record<string, unknown> => {
  if (!data || typeof data !== 'object') return false;
  const r = data as Record<string, unknown>;
  return (
    typeof r.user_id === 'string' &&
    typeof r.current_track === 'string' &&
    typeof r.xp === 'number'
  );
};

const mapProfileRow = (row: unknown): UserProfile => {
  if (!validateProfileData(row)) {
    throw new ValidationError('Invalid profile data structure');
  }

  const r = row as Record<string, unknown>;
  return {
    id: r.user_id as string,
    name: r.display_name as string,
    learnerType: r.learner_type as 'myself' | 'child',
    ageGroup: r.age_group as '7-9' | '10-12' | '13-14',
    goals: (r.goals as string[]) || [],
    experience: r.experience as 'none' | 'scratch' | 'code',
    learningStyle: r.learning_style as 'visual' | 'challenges' | 'step',
    devices: (r.devices as string[]) || [],
    timePerDay: (r.time_per_day as number) || 0,
    parentReport: (r.parent_report as boolean) ?? false,
    phoneNumber: (r.phone_number as string) || '',
    address: (r.address as string) || '',
  };
};

const mapProgressRow = (row: unknown): UserProgress => {
  if (!validateProgressData(row)) {
    throw new ValidationError('Invalid progress data structure');
  }

  const r = row as Record<string, unknown>;
  return {
    xp: (r.xp as number) ?? INITIAL_USER_STATE.xp,
    streak: (r.streak as number) ?? INITIAL_USER_STATE.streak,
    completedLessons: (r.completed_lessons as string[]) || [],
    badges: (r.badges as string[]) || [],
    currentTrack: (r.current_track as TrackType) || INITIAL_USER_STATE.currentTrack,
  };
};

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  if (!userId?.trim()) {
    throw new ValidationError('User ID is required', 'userId');
  }

  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw new AppError(`Failed to fetch user profile: ${error.message}`, 'FETCH_PROFILE_ERROR');
  }
  
  return data ? mapProfileRow(data) : null;
};

export const upsertUserProfile = async (userId: string, profile: UserProfile): Promise<UserProfile> => {
  if (!userId?.trim()) {
    throw new ValidationError('User ID is required', 'userId');
  }

  if (!profile.name?.trim()) {
    throw new ValidationError('Name is required', 'name');
  }

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

  if (error) {
    throw new AppError(`Failed to save user profile: ${error.message}`, 'UPSERT_PROFILE_ERROR');
  }
  
  return mapProfileRow(data);
};

export const fetchProgress = async (userId: string): Promise<UserProgress> => {
  if (!userId?.trim()) {
    throw new ValidationError('User ID is required', 'userId');
  }

  const { data, error } = await supabase
    .from('progress')
    .select(PROGRESS_COLUMNS)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw new AppError(`Failed to fetch progress: ${error.message}`, 'FETCH_PROGRESS_ERROR');
  }
  
  return data ? mapProgressRow(data) : INITIAL_USER_STATE;
};

export const upsertProgress = async (
  userId: string,
  progress: UserProgress
): Promise<UserProgress> => {
  if (!userId?.trim()) {
    throw new ValidationError('User ID is required', 'userId');
  }

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

  if (error) {
    throw new AppError(`Failed to update progress: ${error.message}`, 'UPSERT_PROGRESS_ERROR');
  }
  
  return mapProgressRow(data);
};

export const recordLessonCompletion = async (
  userId: string,
  lessonId: string,
  xpReward: number
): Promise<UserProgress> => {
  if (!userId?.trim() || !lessonId?.trim()) {
    throw new ValidationError('User ID and Lesson ID are required', 'userId,lessonId');
  }

  // Idempotent insert into lesson_completions
  const { error: completionError } = await supabase
    .from('lesson_completions')
    .upsert({ user_id: userId, lesson_id: lessonId }, { onConflict: 'user_id,lesson_id' });

  if (completionError) {
    throw new AppError(`Failed to record lesson completion: ${completionError.message}`, 'LESSON_COMPLETION_ERROR');
  }

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
  if (!userId?.trim()) {
    throw new ValidationError('User ID is required', 'userId');
  }

  const base = currentProgress || (await fetchProgress(userId));
  return upsertProgress(userId, { ...base, currentTrack: track });
};
