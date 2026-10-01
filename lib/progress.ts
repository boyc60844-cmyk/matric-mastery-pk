// lib/progress.ts
// LocalStorage-backed gamification, XP, streak, daily goals, and mock test history.

export interface DailyGoal {
  id: string;
  title: string;
  completed: boolean;
  xpReward: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface MockTestResult {
  id: string;
  studentName?: string;
  className: "Class 9" | "Class 10";
  subject: string;
  chapter: string;
  totalMarks: number;
  score: number;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  accuracy: number;
  timeUsedSeconds: number;
  averageSecondsPerQuestion: number;
  date: string;
  topicBreakdown: { topic: string; correct: number; total: number }[];
  improvementSuggestions: string[];
}

export interface StudentProgress {
  xp: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  strategiesViewed: string[]; // slugs
  strategiesCompleted: string[]; // slugs
  badges: string[]; // badge IDs
  dailyGoalsDate: string; // YYYY-MM-DD
  dailyGoals: DailyGoal[];
  mockTestResults: MockTestResult[];
}

const STORAGE_KEY = "mm_student_progress_v1";

const DEFAULT_BADGES: Badge[] = [
  {
    id: "first-strategy",
    title: "First Step",
    description: "Read your first Matric Mastery strategy playbook",
    icon: "📖",
  },
  {
    id: "consistent",
    title: "Consistent Grinder",
    description: "Maintain a study streak of 3 consecutive days",
    icon: "🔥",
  },
  {
    id: "speed-solver",
    title: "Speed Solver",
    description: "Complete any mock test with greater than 80% accuracy",
    icon: "⚡",
  },
  {
    id: "strategy-explorer",
    title: "Strategy Explorer",
    description: "Explore 5 different subject strategies",
    icon: "🧭",
  },
  {
    id: "mock-master",
    title: "Mock Test Master",
    description: "Complete 3 full mock exam sessions",
    icon: "🏆",
  },
];

const INITIAL_GOALS: Omit<DailyGoal, "completed">[] = [
  { id: "read-strategy", title: "Read 1 Exam Strategy", xpReward: 10 },
  { id: "solve-doubt", title: "Ask 1 Doubt or Revise Formula", xpReward: 15 },
  { id: "practice-test", title: "Attempt a Quick Mock Test or Quiz", xpReward: 25 },
];

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function getInitialProgress(): StudentProgress {
  const today = getTodayString();
  return {
    xp: 0,
    streak: 1,
    lastActiveDate: today,
    strategiesViewed: [],
    strategiesCompleted: [],
    badges: [],
    dailyGoalsDate: today,
    dailyGoals: INITIAL_GOALS.map((g) => ({ ...g, completed: false })),
    mockTestResults: [],
  };
}

export function loadProgress(): StudentProgress {
  if (typeof window === "undefined") {
    return getInitialProgress();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialProgress();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const data = JSON.parse(raw) as StudentProgress;
    const today = getTodayString();

    // Check Streak
    if (data.lastActiveDate !== today) {
      const last = new Date(data.lastActiveDate);
      const curr = new Date(today);
      const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        data.streak = (data.streak || 0) + 1;
      } else if (diffDays > 1) {
        data.streak = 1;
      }
      data.lastActiveDate = today;
    }

    // Reset daily goals if date rolled over
    if (data.dailyGoalsDate !== today) {
      data.dailyGoalsDate = today;
      data.dailyGoals = INITIAL_GOALS.map((g) => ({ ...g, completed: false }));
    }

    saveProgress(data);
    return data;
  } catch {
    return getInitialProgress();
  }
}

export function saveProgress(progress: StudentProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    window.dispatchEvent(new Event("mm_progress_updated"));
  } catch (err) {
    console.error("Failed to save progress", err);
  }
}

export function addXP(amount: number, reason?: string): { newXP: number; added: number } {
  const progress = loadProgress();
  progress.xp = (progress.xp || 0) + amount;
  saveProgress(progress);
  return { newXP: progress.xp, added: amount };
}

// Record wrong question for spaced repetition in local storage
export async function recordMistake(
  question: string,
  correctAnswer: string,
  userAnswer: string,
  chapter: string = "General"
) {
  if (typeof window !== "undefined") {
    try {
      const mistakeId = Date.now().toString();
      const raw = localStorage.getItem("mm_mistakes");
      const mistakes = raw ? JSON.parse(raw) : [];
      mistakes.push({
        id: mistakeId,
        question,
        correctAnswer,
        userAnswer,
        chapter,
        nextReview: Date.now() + 86400000,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("mm_mistakes", JSON.stringify(mistakes));
    } catch (err) {
      console.warn("Error recording mistake in storage:", err);
    }
  }
}

export function recordStrategyView(slug: string): void {
  const progress = loadProgress();
  if (!progress.strategiesViewed.includes(slug)) {
    progress.strategiesViewed.push(slug);
    progress.xp += 10;

    // Daily goal
    const goal = progress.dailyGoals.find((g) => g.id === "read-strategy");
    if (goal && !goal.completed) {
      goal.completed = true;
      progress.xp += goal.xpReward;
    }

    // Check Badges
    if (!progress.badges.includes("first-strategy")) {
      progress.badges.push("first-strategy");
    }
    if (progress.strategiesViewed.length >= 5 && !progress.badges.includes("strategy-explorer")) {
      progress.badges.push("strategy-explorer");
    }

    saveProgress(progress);
  }
}

export function markStrategyCompleted(slug: string): void {
  const progress = loadProgress();
  if (!progress.strategiesCompleted.includes(slug)) {
    progress.strategiesCompleted.push(slug);
    progress.xp += 15;
    saveProgress(progress);
  }
}

export function recordMockTestResult(result: MockTestResult): void {
  const progress = loadProgress();
  progress.mockTestResults.unshift(result);
  progress.xp += 50; // Mock test completed

  // Mark daily test goal
  const goal = progress.dailyGoals.find((g) => g.id === "practice-test");
  if (goal && !goal.completed) {
    goal.completed = true;
    progress.xp += goal.xpReward;
  }

  // Check Badges
  if (result.accuracy >= 80 && !progress.badges.includes("speed-solver")) {
    progress.badges.push("speed-solver");
  }
  if (progress.mockTestResults.length >= 3 && !progress.badges.includes("mock-master")) {
    progress.badges.push("mock-master");
  }
  if (progress.streak >= 3 && !progress.badges.includes("consistent")) {
    progress.badges.push("consistent");
  }

  saveProgress(progress);
}

export function getAvailableBadges(): Badge[] {
  return DEFAULT_BADGES;
}
