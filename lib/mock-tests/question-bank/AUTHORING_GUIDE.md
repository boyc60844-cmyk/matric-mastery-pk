# Matric Mastery Question Bank Authoring & Validation Workflow

Internal engineering guide for maintaining and expanding the verified question bank without introducing placeholder items, syllabus mismatches, or broken marks.

## 1. Separation of Content and Engine Logic

- Question files live under `/lib/mock-tests/question-bank/bank/`.
- Curriculum trees (chapters, topics, subtopics, ALP exclusions, SLOs) live under `/lib/mock-tests/curriculum/`.
- Blueprint specifications live under `/lib/mock-tests/blueprint/blueprintRegistry.ts`.
- UI components never hardcode marks, options, or syllabus rules.

## 2. Adding a New Verified Question

1. **Confirm Curriculum Target**:
   Locate the exact `chapterId`, `topicId`, and optional `subtopicId` in `curriculum/punjab/session-2026-27.ts` or `curriculum/fbise/scheme-2024.ts`.
   - For Punjab Boards: verify the topic/subtopic/exercise is **not** marked `isExcluded: true` under PECTAA ALP notifications (No. 1238, 1255, 1257, 1239, 1258).
   - For FBISE: attach the matching `sloId` and `cognitiveLevel` (`Recall` / `Understand` / `Apply` / `Analyze`).

2. **Populate Required Schema Fields**:
   - Assign a unique immutable `id` (e.g., `pb10-phy-num-02`) and `version: "1.0.0"`.
   - Write original practice prompts (never bulk-copy copyrighted textbook chapters verbatim).
   - Provide an explicit `explanation`, accurate `marks`, and structured answer key / `rubric`.
   - Initially author drafts as `validationStatus: "Needs Review"` and `reviewMetadata.checklistPassed: false`.

3. **Validation Gate Checklist**:
   Before flipping `validationStatus` to `"Verified"` and `checklistPassed: true`, verify:
   - Exact chapter/topic/curriculumVersion match
   - Correct answer key / tolerance / units
   - No duplicate options or prompt collisions
   - `rubric.maxMarks === question.marks` (and `subParts` sum matches for `structured_multi_part`)
   - Clear unambiguous student wording

4. **Verify Programmatically**:
   Run the unit validation suite (`npx tsx lib/mock-tests/__tests__/runTests.ts`) to confirm zero validation errors and exact blueprint reconciliation.
