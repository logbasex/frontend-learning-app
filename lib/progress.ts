import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ProgressState {
  completedModules: string[];
  bookmarkedModules: string[];
  notes: Record<string, string>; // moduleId → note content
  currentModule: string | null;
  lastAccessedAt: number;

  // Actions
  markModuleComplete: (moduleId: string) => void;
  markModuleIncomplete: (moduleId: string) => void;
  toggleBookmark: (moduleId: string) => void;
  addNote: (moduleId: string, note: string) => void;
  setCurrentModule: (moduleId: string) => void;
  resetProgress: () => void;
}

const initialState = {
  completedModules: [],
  bookmarkedModules: [],
  notes: {},
  currentModule: null,
  lastAccessedAt: Date.now(),
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      ...initialState,

      markModuleComplete: (moduleId) =>
        set((state) => {
          if (state.completedModules.includes(moduleId)) {
            return state; // Already completed
          }
          return {
            completedModules: [...state.completedModules, moduleId],
            lastAccessedAt: Date.now(),
          };
        }),

      markModuleIncomplete: (moduleId) =>
        set((state) => ({
          completedModules: state.completedModules.filter((id) => id !== moduleId),
          lastAccessedAt: Date.now(),
        })),

      toggleBookmark: (moduleId) =>
        set((state) => {
          const isBookmarked = state.bookmarkedModules.includes(moduleId);
          return {
            bookmarkedModules: isBookmarked
              ? state.bookmarkedModules.filter((id) => id !== moduleId)
              : [...state.bookmarkedModules, moduleId],
            lastAccessedAt: Date.now(),
          };
        }),

      addNote: (moduleId, note) =>
        set((state) => ({
          notes: {
            ...state.notes,
            [moduleId]: note,
          },
          lastAccessedAt: Date.now(),
        })),

      setCurrentModule: (moduleId) =>
        set({
          currentModule: moduleId,
          lastAccessedAt: Date.now(),
        }),

      resetProgress: () =>
        set({
          ...initialState,
          lastAccessedAt: Date.now(),
        }),
    }),
    {
      name: 'javafx-learning-progress', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Hook để get progress statistics
export function useProgressStats() {
  const completedModules = useProgress((state) => state.completedModules);

  // Import curriculum to calculate stats
  // (Can move this logic out if optimization is needed)
  const totalModules = 18; // JavaFX Learning App has 18 modules (6 phases)

  const completedCount = completedModules.length;
  const progressPercentage = Math.round((completedCount / totalModules) * 100);

  return {
    completedCount,
    totalModules,
    progressPercentage,
  };
}
