import { ExamSystem, GradeLevel, SubjectCurriculum } from "@/lib/mock-tests/types";
import { PUNJAB_CURRICULA_2026_27 } from "@/lib/mock-tests/curriculum/punjab/session-2026-27";
import { FBISE_CURRICULA_2024 } from "@/lib/mock-tests/curriculum/fbise/scheme-2024";

export const ALL_CURRICULA: SubjectCurriculum[] = [
  ...PUNJAB_CURRICULA_2026_27,
  ...FBISE_CURRICULA_2024,
];

export function getCurriculaForSystemAndGrade(
  system: ExamSystem,
  grade: GradeLevel
): SubjectCurriculum[] {
  return ALL_CURRICULA.filter((c) => c.system === system && c.grade === grade);
}

export function getCurriculumByKey(
  system: ExamSystem,
  grade: GradeLevel,
  subjectId: string,
  curriculumVersion?: string
): SubjectCurriculum | undefined {
  return ALL_CURRICULA.find(
    (c) =>
      c.system === system &&
      c.grade === grade &&
      c.subjectId === subjectId &&
      (!curriculumVersion || c.curriculumVersion === curriculumVersion)
  );
}

export function getCurriculumById(id: string): SubjectCurriculum | undefined {
  return ALL_CURRICULA.find((c) => c.id === id);
}
