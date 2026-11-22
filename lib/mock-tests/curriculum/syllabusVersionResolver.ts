import { ExamSystem, GradeLevel, SubjectCurriculum } from "@/lib/mock-tests/types";
import { PUNJAB_CURRICULUM_VERSION_2026_27 } from "@/lib/mock-tests/curriculum/punjab/session-2026-27";
import { FBISE_SCHEME_VERSION } from "@/lib/mock-tests/curriculum/fbise/scheme-2024";
import { getCurriculumByKey } from "@/lib/mock-tests/curriculum/curriculumRegistry";

/**
 * Resolves the active default curriculum version per examination system
 * and validates version compatibility for incoming blueprints or questions.
 */

export const ACTIVE_VERSION_BY_SYSTEM: Record<ExamSystem, { version: string; sessionLabel: string; authorityLabel: string }> = {
  punjab: {
    version: PUNJAB_CURRICULUM_VERSION_2026_27,
    sessionLabel: "Academic Session 2026–27 / Annual 2027",
    authorityLabel: "PECTAA (9 Punjab BISEs)",
  },
  fbise: {
    version: FBISE_SCHEME_VERSION,
    sessionLabel: "FBISE 2026–27 SLO Cycle",
    authorityLabel: "FBISE Islamabad",
  },
};

export function resolveActiveCurriculumVersion(system: ExamSystem): string {
  return ACTIVE_VERSION_BY_SYSTEM[system].version;
}

export function validateCurriculumCompatibility(params: {
  system: ExamSystem;
  grade: GradeLevel;
  subjectId: string;
  curriculumVersion: string;
}): { ok: boolean; curriculum?: SubjectCurriculum; reason?: string } {
  const expectedVersion = resolveActiveCurriculumVersion(params.system);
  if (params.curriculumVersion !== expectedVersion) {
    return {
      ok: false,
      reason: `Version mismatch: expected active ${params.system.toUpperCase()} version "${expectedVersion}", got "${params.curriculumVersion}".`,
    };
  }

  const curriculum = getCurriculumByKey(
    params.system,
    params.grade,
    params.subjectId,
    params.curriculumVersion
  );

  if (!curriculum) {
    return {
      ok: false,
      reason: `No registered curriculum found for ${params.system.toUpperCase()} Class ${params.grade} (${params.subjectId}).`,
    };
  }

  if (curriculum.verificationStatus === "unavailable") {
    return {
      ok: false,
      curriculum,
      reason: `Curriculum for ${curriculum.subjectName} (Class ${curriculum.grade}) is marked Unavailable: ${curriculum.verificationNote}`,
    };
  }

  return { ok: true, curriculum };
}
