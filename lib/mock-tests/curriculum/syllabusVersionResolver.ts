import { ExamSystem, GradeLevel, SubjectCurriculum } from "@/lib/mock-tests/types";
import { PUNJAB_CURRICULUM_VERSION_2026_27 } from "@/lib/mock-tests/curriculum/punjab/session-2026-27";
import {
  FBISE_LEGACY_EXCLUDED_VERSIONS,
  FBISE_SCHEME_VERSION,
} from "@/lib/mock-tests/curriculum/fbise/scheme-2024";
import { getCurriculumByKey } from "@/lib/mock-tests/curriculum/curriculumRegistry";

/**
 * Resolves the active default curriculum version per examination system
 * and validates version compatibility for incoming blueprints or questions.
 * Explicitly separates FBISE Inclusive Scheme 2024 from legacy Scheme 2006.
 */

export const ACTIVE_VERSION_BY_SYSTEM: Record<
  ExamSystem,
  { version: string; sessionLabel: string; authorityLabel: string }
> = {
  punjab: {
    version: PUNJAB_CURRICULUM_VERSION_2026_27,
    sessionLabel: "Academic Session 2026–27 / Annual 2027",
    authorityLabel: "PECTAA (9 Punjab BISEs)",
  },
  fbise: {
    version: FBISE_SCHEME_VERSION,
    sessionLabel: "FBISE Inclusive Scheme 2024 / 2026–27 Cycle",
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
  if (
    params.system === "fbise" &&
    (FBISE_LEGACY_EXCLUDED_VERSIONS as readonly string[]).includes(params.curriculumVersion)
  ) {
    return {
      ok: false,
      reason: `Legacy/superseded FBISE scheme "${params.curriculumVersion}" is excluded; active assessments require "${FBISE_SCHEME_VERSION}" (Inclusive Scheme of Studies 2024).`,
    };
  }

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

  if (curriculum.curriculumStatus !== "verified" || curriculum.verificationStatus === "unavailable") {
    return {
      ok: false,
      curriculum,
      reason: `Curriculum for ${curriculum.subjectName} (Class ${curriculum.grade}) is pending verification: ${curriculum.verificationNote}`,
    };
  }

  return { ok: true, curriculum };
}
