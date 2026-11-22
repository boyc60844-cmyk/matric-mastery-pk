/**
 * MATRIC MASTERY — MOCK TEST PLATFORM & EXAM ENGINE CORE TYPES
 *
 * Strictly typed contracts for:
 * - Separate Punjab Boards (PECTAA) and FBISE examination systems (Classes 9–12)
 * - Granular syllabus/topic/subtopic/exercise eligibility & deleted content exclusion
 * - 12 structured question types with explicit validation & rubric contracts
 * - Deterministic blueprint & constrained paper snapshot generation
 * - Reliable exam attempt state machine, deadline timer & scoring engine
 * - Local persistence, real performance analytics & mistake notebook
 */

export type ExamSystem = "punjab" | "fbise";
export type GradeLevel = 9 | 10 | 11 | 12;
export type ClassLabel = "Class 9" | "Class 10" | "Class 11" | "Class 12";

export type SubjectGroup =
  | "compulsory"
  | "science"
  | "ics"
  | "pre-engineering"
  | "pre-medical"
  | "general";

export type CurriculumVerificationStatus =
  | "verified"
  | "provisional"
  | "unavailable";

export type CurriculumScopeStatus = "verified" | "pending_verification";

export type SyllabusPolicyType =
  | "reduced_alp_active"
  | "full_syllabus_no_alp"
  | "slo_national_curriculum";

export type BlueprintReadinessStatus = "verified" | "unavailable";

export type QuestionBankReadinessStatus =
  | "empty"
  | "partial"
  | "simulation_ready";

export type AssessmentTrack = "theory" | "practical" | "combined";

export type DifficultyLevel = "Easy" | "Moderate" | "Challenging";
export type CognitiveLevel = "Recall" | "Understand" | "Apply" | "Analyze";

export type QuestionValidationStatus =
  | "Verified"
  | "Provisional"
  | "Needs Review"
  | "Excluded"
  | "Outdated";

export type QuestionOrigin = "Original authored" | "Adapted with permitted use";
export type QuestionEligibilityState =
  | "eligible"
  | "excluded_by_alp"
  | "provisional";

export type QuestionType =
  | "single_mcq"
  | "multi_select"
  | "true_false"
  | "fill_blank"
  | "matching"
  | "classification"
  | "short_answer"
  | "structured_multi_part"
  | "numerical"
  | "proof_derivation"
  | "diagram_labeling"
  | "extended_response";

export type TestMode =
  | "board_simulation"
  | "chapter_test"
  | "quick_test"
  | "weak_areas"
  | "custom_test"
  | "slo_practice";

export type AttemptStatus =
  | "ready"
  | "started"
  | "in_progress"
  | "paused"
  | "submitted"
  | "time_expired"
  | "scoring"
  | "completed";

// ---------------------------------------------------------------------------
// 1. CURRICULUM & SYLLABUS ARCHITECTURE
// ---------------------------------------------------------------------------

export interface SLODefinition {
  id: string;
  code: string;
  statement: string;
  cognitiveLevel: CognitiveLevel;
  chapterId: string;
  topicId: string;
}

export interface SubtopicDefinition {
  id: string;
  title: string;
  isExcluded: boolean;
  exclusionReason?: string;
  exclusionReference?: string;
  /** Optional exercise/question exclusion references (e.g. "Ex 1.3 Q4–Q7") */
  excludedExercises?: string[];
}

export interface TopicDefinition {
  id: string;
  title: string;
  isExcluded: boolean;
  exclusionReason?: string;
  exclusionReference?: string;
  subtopics?: SubtopicDefinition[];
  sloCodes?: string[];
}

export interface ChapterDefinition {
  id: string;
  number: number;
  title: string;
  /** Chapter status derives cleanly from its topics unless entire chapter is excluded */
  isFullyExcluded: boolean;
  exclusionReason?: string;
  topics: TopicDefinition[];
}

export interface OfficialNotificationRef {
  code: string;
  date: string;
  title: string;
  url: string;
}

export interface FbiseBilingualPolicy {
  applies: boolean;
  notificationCode?: string;
  notificationDate?: string;
  effectiveExam?: string;
  note: string;
}

export interface FbiseSchemeMetadata {
  schemeName: string;
  totalSchemeMarks: number;
  phasedRolloutLabel: string;
  legacyExcludedScheme: string;
  assessmentFrameworkType: string;
  bilingualPolicy: FbiseBilingualPolicy;
}

export interface SubjectCurriculum {
  id: string;
  system: ExamSystem;
  boardScope: string;
  grade: GradeLevel;
  classLabel: ClassLabel;
  session: string;
  curriculumVersion: string;
  subjectId: string;
  subjectName: string;
  variantLabel?: string;
  groups: SubjectGroup[];
  assessmentTrack: AssessmentTrack;
  hasPracticalComponent: boolean;
  practicalMarks?: number;
  theoryMarks?: number;
  /** Legacy combined field kept synced from decoupled status dimensions */
  verificationStatus: CurriculumVerificationStatus;
  /** Independent curriculum authority status */
  curriculumStatus: CurriculumScopeStatus;
  /** Explicit syllabus policy: reduced ALP vs verified full syllabus vs SLO curriculum */
  syllabusPolicy: SyllabusPolicyType;
  /** Textbook / curriculum framework identifier */
  textbookRef: string;
  /** Concise verified exclusion summary (e.g. "Unit 2 excluded" or "None — full syllabus active") */
  alpExclusionsSummary?: string;
  /** Optional FBISE-specific scheme of studies & bilingual policy metadata */
  fbiseSchemeMeta?: FbiseSchemeMetadata;
  verificationNote: string;
  notificationRefs: OfficialNotificationRef[];
  chapters: ChapterDefinition[];
  slos: SLODefinition[];
  /** True only when ALP deletions actually apply; e.g. Tarjama-tul-Quran is full syllabus */
  alpApplied: boolean;
}

export interface SubjectReadinessProfile {
  curriculumId: string;
  system: ExamSystem;
  grade: GradeLevel;
  subjectId: string;
  subjectName: string;
  curriculumStatus: CurriculumScopeStatus;
  syllabusPolicy: SyllabusPolicyType;
  blueprintStatus: BlueprintReadinessStatus;
  bankStatus: QuestionBankReadinessStatus;
  practiceAvailable: boolean;
  boardSimulationReady: boolean;
  totalRawCount: number;
  verifiedEligibleCount: number;
  excludedByAlpCount: number;
  outdatedCount: number;
  provisionalCount: number;
  needsReviewCount: number;
  requiredBlueprintSlots: number;
  summaryBadge: string;
  statusDetail: string;
}

// ---------------------------------------------------------------------------
// 2. QUESTION BANK ARCHITECTURE (12 QUESTION TYPES)
// ---------------------------------------------------------------------------

export interface RubricCriterion {
  id: string;
  label: string;
  marks: number;
  detail: string;
}

export interface QuestionRubric {
  maxMarks: number;
  allowPartialMarks: boolean;
  criteria: RubricCriterion[];
}

export interface QuestionReviewMetadata {
  reviewedBy: string;
  reviewedAt: string;
  checklistPassed: boolean;
  notes?: string;
}

export interface QuestionVersionEntry {
  version: string;
  date: string;
  note: string;
}

export interface QuestionBase {
  id: string;
  version: string;
  system: ExamSystem;
  board: string;
  grade: GradeLevel;
  subjectId: string;
  subjectGroup?: SubjectGroup;
  curriculumVersion: string;
  chapterId: string;
  topicId: string;
  subtopicId?: string;
  sloId?: string;
  type: QuestionType;
  prompt: string;
  /** Supporting table or structured stimulus displayed neatly above options */
  stimulusTable?: {
    headers: string[];
    rows: string[][];
    caption?: string;
  };
  marks: number;
  difficulty: DifficultyLevel;
  cognitiveLevel: CognitiveLevel;
  sourceReference: string;
  origin: QuestionOrigin;
  validationStatus: QuestionValidationStatus;
  reviewMetadata: QuestionReviewMetadata;
  eligibilityStatus: QuestionEligibilityState;
  versionHistory: QuestionVersionEntry[];
  explanation: string;
  rubric?: QuestionRubric;
}

export interface SingleMCQQuestion extends QuestionBase {
  type: "single_mcq";
  options: [string, string, string, string] | string[];
  correctIndex: number;
  preserveOptionOrder?: boolean;
}

export interface MultiSelectQuestion extends QuestionBase {
  type: "multi_select";
  options: string[];
  correctIndices: number[];
  /** Explicit per-item scoring only if rubric enables partial credit; otherwise all-or-nothing */
  allowPartialCredit?: boolean;
}

export interface TrueFalseQuestion extends QuestionBase {
  type: "true_false";
  correctBoolean: boolean;
}

export interface FillBlankQuestion extends QuestionBase {
  type: "fill_blank";
  acceptedAnswers: string[];
  caseSensitive?: boolean;
  hint?: string;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface MatchingQuestion extends QuestionBase {
  type: "matching";
  pairs: MatchingPair[];
  /** Optional extra distractor choices on right side */
  distractorRightOptions?: string[];
  allowPartialCredit?: boolean;
}

export interface ClassificationItem {
  id: string;
  label: string;
  correctCategory: string;
}

export interface ClassificationQuestion extends QuestionBase {
  type: "classification";
  categories: string[];
  items: ClassificationItem[];
  allowPartialCredit?: boolean;
}

export interface ShortAnswerQuestion extends QuestionBase {
  type: "short_answer";
  modelAnswer: string;
  markingPoints: string[];
  /** Deterministic accepted exact answers ONLY if genuinely unambiguous */
  acceptedExactAnswers?: string[];
  rubric: QuestionRubric;
}

export interface StructuredSubPart {
  id: string;
  label: string; // e.g. "(a)", "(b)"
  prompt: string;
  marks: number;
  kind: "numerical" | "fill_blank" | "short_answer";
  numericAnswer?: number;
  tolerance?: number;
  acceptedUnits?: string[];
  acceptedAnswers?: string[];
  modelAnswer?: string;
  markingPoints?: string[];
}

export interface StructuredMultiPartQuestion extends QuestionBase {
  type: "structured_multi_part";
  subParts: StructuredSubPart[];
  rubric: QuestionRubric;
}

export interface NumericalQuestion extends QuestionBase {
  type: "numerical";
  numericAnswer: number;
  tolerance: number;
  requiredUnit?: string;
  acceptedUnits?: string[];
  /** Marks split when unit is verified separately from numeric magnitude */
  valueMarks?: number;
  unitMarks?: number;
  formulaHint?: string;
  stepByStepSolution: string[];
}

export interface ProofDerivationQuestion extends QuestionBase {
  type: "proof_derivation";
  givenStatement?: string;
  toProve?: string;
  modelProofSteps: string[];
  rubric: QuestionRubric;
}

export type DiagramTemplateId =
  | "logic_gate_circuit"
  | "pendulum_shm"
  | "series_parallel_resistors"
  | "concave_mirror_ray"
  | "flowchart_loop"
  | "plant_cell_organelles";

export interface DiagramPin {
  id: string;
  marker: string; // "1", "2", "3", "4"
  x: number; // SVG viewBox 0..400
  y: number; // SVG viewBox 0..240
  correctLabel: string;
}

export interface DiagramLabelingQuestion extends QuestionBase {
  type: "diagram_labeling";
  diagramId: DiagramTemplateId;
  diagramCaption: string;
  pins: DiagramPin[];
  candidateLabels: string[];
  allowPartialCredit?: boolean;
}

export interface ExtendedResponseQuestion extends QuestionBase {
  type: "extended_response";
  modelAnswer: string;
  markingPoints: string[];
  rubric: QuestionRubric;
}

export type BankQuestion =
  | SingleMCQQuestion
  | MultiSelectQuestion
  | TrueFalseQuestion
  | FillBlankQuestion
  | MatchingQuestion
  | ClassificationQuestion
  | ShortAnswerQuestion
  | StructuredMultiPartQuestion
  | NumericalQuestion
  | ProofDerivationQuestion
  | DiagramLabelingQuestion
  | ExtendedResponseQuestion;

// ---------------------------------------------------------------------------
// 3. PAPER BLUEPRINT & GENERATED SNAPSHOT ARCHITECTURE
// ---------------------------------------------------------------------------

export interface ChapterQuotaRule {
  chapterId: string;
  minCount: number;
  maxCount: number;
}

export interface ChoiceGroupRule {
  id: string;
  title: string;
  totalQuestions: number;
  requiredAttemptCount: number;
  marksPerQuestion: number;
  allowedTypes: QuestionType[];
  allowedChapterIds?: string[];
  chapterQuotas?: ChapterQuotaRule[];
  difficultyDistribution?: Partial<Record<DifficultyLevel, number>>;
}

export interface BlueprintSection {
  id: string;
  code: string; // "Section A" | "Section B" | "Section C"
  title: string;
  category: "objective" | "subjective_short" | "subjective_long";
  instructions: string;
  recommendedMinutes?: number;
  choiceGroups: ChoiceGroupRule[];
}

export interface PaperBlueprint {
  id: string;
  system: ExamSystem;
  boardScope: string;
  grade: GradeLevel;
  subjectId: string;
  subjectName: string;
  session: string;
  curriculumVersion: string;
  blueprintVersion: string;
  sourceDocumentRef: string;
  sourceUrl: string;
  durationMinutes: number;
  objectiveTimeMinutes?: number;
  subjectiveTimeMinutes?: number;
  timingBreakdownNote?: string;
  totalMarks: number;
  passingPercentage: number; // e.g. 40 per IBCC 2026-27 reform
  objectiveMarks: number;
  subjectiveMarks: number;
  questionOrderRule: "fixed_sections_with_group_shuffle" | "fixed_order";
  sections: BlueprintSection[];
  verifiedForSimulation: boolean;
  availabilityNote?: string;
}

export interface BlueprintValidationIssue {
  code: string;
  severity: "error" | "warning";
  message: string;
  sectionId?: string;
  choiceGroupId?: string;
}

export interface BlueprintPoolStatus {
  blueprintId: string;
  isValidBlueprint: boolean;
  isSimulationReady: boolean;
  requiredQuestionsCount: number;
  availableVerifiedCount: number;
  missingQuestionsCount: number;
  shortfallDetails: string[];
  issues: BlueprintValidationIssue[];
}

export interface PaperItemSlot {
  slotId: string;
  displayNumber: string; // e.g. "Q1 (i)", "Q2 (iv)", "Q5"
  sectionId: string;
  choiceGroupId: string;
  questionId: string;
  questionVersion: string;
  /** For single_mcq / multi_select: maps frozen display index -> canonical option index */
  optionOrderMap?: number[];
  marks: number;
}

export interface PaperSectionSnapshot {
  id: string;
  code: string;
  title: string;
  category: "objective" | "subjective_short" | "subjective_long";
  instructions: string;
  maxSectionMarks: number;
  choiceGroups: {
    id: string;
    title: string;
    totalQuestions: number;
    requiredAttemptCount: number;
    marksPerQuestion: number;
    maxGroupMarks: number;
    slotIds: string[];
  }[];
}

export interface GeneratedPaperSnapshot {
  paperId: string;
  seed: string;
  mode: TestMode;
  title: string;
  system: ExamSystem;
  boardLabel: string;
  grade: GradeLevel;
  subjectId: string;
  subjectName: string;
  session: string;
  curriculumVersion: string;
  blueprintId?: string;
  blueprintVersion?: string;
  durationMinutes: number;
  isTimed: boolean;
  allowPause: boolean;
  totalMarks: number;
  passingPercentage: number;
  createdAtMs: number;
  sections: PaperSectionSnapshot[];
  slots: PaperItemSlot[];
  /** Frozen deep copy of questions included in the paper so active attempts stay 100% immune to updates */
  questionsById: Record<string, BankQuestion>;
  selectionNotes: string[];
}

// ---------------------------------------------------------------------------
// 4. ATTEMPT STATE, STUDENT RESPONSES & MARKING RESULT
// ---------------------------------------------------------------------------

export type StudentResponseValue =
  | { kind: "single_mcq"; selectedCanonicalIndex: number }
  | { kind: "multi_select"; selectedCanonicalIndices: number[] }
  | { kind: "true_false"; value: boolean }
  | { kind: "fill_blank"; text: string }
  | { kind: "matching"; matches: Record<string, string> }
  | { kind: "classification"; assignments: Record<string, string> }
  | { kind: "numerical"; valueText: string; unitText: string }
  | { kind: "text_response"; text: string }
  | { kind: "structured_multi_part"; parts: Record<string, { text: string; unitText?: string }> }
  | { kind: "diagram_labeling"; labelsByPinId: Record<string, string> };

export type ItemEvaluationStatus =
  | "correct"
  | "partial"
  | "incorrect"
  | "unanswered"
  | "pending_review"
  | "self_reviewed"
  | "not_counted_choice";

export interface SubjectiveSelfReviewEntry {
  checkedCriterionIds: string[];
  awardedMarks: number;
  reviewedAtMs: number;
  note?: string;
}

export interface EvaluatedQuestionResult {
  slotId: string;
  questionId: string;
  questionVersion: string;
  displayNumber: string;
  sectionId: string;
  choiceGroupId: string;
  type: QuestionType;
  chapterId: string;
  topicId: string;
  sloId?: string;
  difficulty: DifficultyLevel;
  cognitiveLevel: CognitiveLevel;
  maxMarks: number;
  awardedMarks: number | null; // null while pending_review
  effectiveMarks: number; // 0 when null or not counted due to choice overflow
  status: ItemEvaluationStatus;
  countedInChoiceGroup: boolean;
  feedback: string;
  studentResponse?: StudentResponseValue;
  selfReview?: SubjectiveSelfReviewEntry;
}

export interface TopicPerformanceMetric {
  topicId: string;
  topicTitle: string;
  chapterId: string;
  chapterTitle: string;
  questionCount: number;
  autoGradedCount: number;
  pendingReviewCount: number;
  incorrectCount: number;
  obtainedMarks: number;
  availableMarks: number;
  /** Null when no auto-graded/reviewed marks exist yet */
  accuracyPercent: number | null;
}

export interface SLOPerformanceMetric {
  sloId: string;
  sloCode: string;
  statement: string;
  cognitiveLevel: CognitiveLevel;
  obtainedMarks: number;
  availableMarks: number;
  questionCount: number;
}

export interface AttemptScoringSummary {
  obtainedMarks: number;
  autoGradedObtainedMarks: number;
  autoGradedMaxMarks: number;
  selfReviewedObtainedMarks: number;
  selfReviewedMaxMarks: number;
  pendingReviewMarks: number;
  pendingReviewCount: number;
  totalMarks: number;
  percentage: number;
  autoGradedAccuracy: number | null;
  /** Strictly separated primary fields */
  autoVerifiedObtainedMarks: number;
  autoVerifiedMaxMarks: number;
  autoVerifiedAccuracy: number | null;
  selfAssessedObtainedMarks: number;
  selfAssessedMaxMarks: number;
  pendingSubjectiveMarks: number;
  indicativeCombinedMarks: number;
  indicativeCombinedPercentage: number;
  hasMixedSelfAssessment: boolean;
  passedByPolicy: boolean;
  passingPercentage: number;
  correctCount: number;
  partialCount: number;
  incorrectCount: number;
  unansweredCount: number;
  notCountedChoiceCount: number;
  timeSpentSeconds: number;
  itemResults: EvaluatedQuestionResult[];
  /** Strictly auto-verified topic breakdown (never inflated by subjective self-review) */
  objectiveTopicBreakdown: TopicPerformanceMetric[];
  /** Separate self-assessed topic breakdown for rubric-checked items */
  selfAssessedTopicBreakdown: TopicPerformanceMetric[];
  /** Combined display breakdown kept compatible for existing result cards */
  topicBreakdown: TopicPerformanceMetric[];
  sloBreakdown: SLOPerformanceMetric[];
}

export interface ExamAttemptRecord {
  attemptId: string;
  status: AttemptStatus;
  paper: GeneratedPaperSnapshot;
  startedAtMs: number;
  /** Epoch ms deadline for timed tests; null for untimed practice */
  deadlineMs: number | null;
  pausedAtMs: number | null;
  remainingMsAtPause: number | null;
  submittedAtMs: number | null;
  currentSlotIndex: number;
  activeSectionId: string;
  responses: Record<string, StudentResponseValue>; // keyed by slotId
  markedForReview: Record<string, boolean>; // keyed by slotId
  selfReviews: Record<string, SubjectiveSelfReviewEntry>; // keyed by slotId
  scoring?: AttemptScoringSummary;
}

// ---------------------------------------------------------------------------
// 5. MISTAKE NOTEBOOK & ANALYTICS TYPES
// ---------------------------------------------------------------------------

export type MistakeReviewStatus = "unreviewed" | "reviewed" | "mastered";

export interface MistakeNotebookEntry {
  id: string;
  questionId: string;
  questionVersion: string;
  system: ExamSystem;
  grade: GradeLevel;
  subjectId: string;
  chapterId: string;
  topicId: string;
  promptSnapshot?: string;
  curriculumVersion?: string;
  sourceReference?: string;
  markingNote?: string;
  studentResponseSummary: string;
  correctResponseSummary: string;
  explanation: string;
  attemptId: string;
  recordedAtMs: number;
  wrongCount: number;
  status: MistakeReviewStatus;
}

export interface PersistedMockTestStoreV3 {
  schemaVersion: 3;
  activeAttempt: ExamAttemptRecord | null;
  attemptHistory: ExamAttemptRecord[];
  mistakeNotebook: MistakeNotebookEntry[];
}

/** Alias preserved for non-breaking imports across UI components */
export type PersistedMockTestStoreV2 = PersistedMockTestStoreV3;

