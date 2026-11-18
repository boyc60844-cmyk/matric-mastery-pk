export type VerificationBadgeKind =
  | "CONFIRMED"
  | "OFFICIAL BOARD UPDATE"
  | "REPORTED"
  | "AWAITING OFFICIAL CONFIRMATION";

export interface ESheetProcessStep {
  step: number;
  title: string;
  actor: string;
  summary: string;
  studentImpact: string;
}

export interface ExamModeComparison {
  mode: string;
  tag: string;
  howStudentWrites: string;
  extraSheetsAllowed: string;
  howEvaluated: string;
  punjabFbiseStatus: string;
}

export interface PunjabRolloutStage {
  id: string;
  timelineTag: string;
  stageLabel: string;
  statusBadge: VerificationBadgeKind;
  timeframe: string;
  authorityBasis: string;
  scopeSummary: string;
  verifiedBoardsAndSubjects: string[];
  whatIsConfirmed: string;
  whatAwaitsConfirmation: string;
}

export interface SubjectCoverageRow {
  subjectOrGroup: string;
  level: string;
  status: VerificationBadgeKind;
  currentEvidence: string;
  studentAction: string;
}

export interface StudentGuideStep {
  stepNumber: number;
  title: string;
  officialRuleSummary: string;
  doThis: string[];
  avoidThis: string[];
  sourceRef: string;
}

export interface StationeryRuleItem {
  category: "recommended" | "conditional" | "prohibited";
  item: string;
  statusLabel: string;
  punjabEvidence: string;
  fbiseEvidence: string;
  practicalAdvice: string;
}

export interface MarkLossPitfall {
  id: string;
  number: number;
  mistake: string;
  severity: "Critical" | "High" | "Medium";
  whyItMattersTechnically: string;
  verifiedConsequenceBasis: string;
  howToPrevent: string;
}

export interface FBISEAssetSample {
  title: string;
  level: string;
  pages: string;
  sessionNote: string;
  url: string;
}

export interface PunjabVsFBISEComparisonRow {
  dimension: string;
  punjabBoards: string;
  fbise: string;
}

export interface ESheetFAQItem {
  id: string;
  question: string;
  answer: string;
  boardScope: "Punjab Boards" | "FBISE" | "Both (Rules Separate)";
}

export interface ESheetOfficialSource {
  authority: string;
  title: string;
  scope: string;
  url: string;
  verifiedDate: string;
}

// ---------------------------------------------------------------------------
// 7-STEP E-SHEET & ON-SCREEN MARKING WORKFLOW
// ---------------------------------------------------------------------------
export const ESHEET_WORKFLOW_STEPS: ESheetProcessStep[] = [
  {
    step: 1,
    title: "Question Paper Distribution",
    actor: "Exam Centre Staff",
    summary:
      "At the scheduled start time inside the examination hall, the sealed question paper envelope is opened and distributed alongside the pre-printed digital answer copy (E-Sheet).",
    studentImpact:
      "Check paper version/code and match the question booklet with your roll number slip details.",
  },
  {
    step: 2,
    title: "Student Writes on Structured E-Sheet",
    actor: "Candidate",
    summary:
      "Students write physically with pen on a stapled, barcode/QR-coded booklet featuring OMR identification bubbles and clearly bounded boxes or designated pages for each question.",
    studentImpact:
      "It is NOT a computer/typing exam. Stay strictly inside printed margins and question-specific boxes.",
  },
  {
    step: 3,
    title: "Answer Copy Collection & AMS Verification",
    actor: "Centre Superintendent",
    summary:
      "Invigilators collect every booklet at the end of the paper without folding, unstapling, or puncturing it, and reconcile attendance and booklet QR codes via the board's AMS system.",
    studentImpact:
      "Hand over your booklet even if blank—never detach pages or write near the barcode/QR code.",
  },
  {
    step: 4,
    title: "High-Speed Scanning & Cropping",
    actor: "Board Scanning Hub",
    summary:
      "Collected booklets are fed into high-speed industrial scanners. Barcodes/QR codes index the script anonymously, while software crops each question zone into digital image segments.",
    studentImpact:
      "Anything written outside printed margins, on top/bottom edges, or under the wrong question header may be cut off.",
  },
  {
    step: 5,
    title: "Encrypted Digital Allocation",
    actor: "OSM Software Server",
    summary:
      "Instead of transporting physical bundles across districts, digital scripts or specific question batches are assigned online to authenticated, authorized subject examiners.",
    studentImpact:
      "Reduces physical transit risks, anonymizes candidate identity, and records handling audit trails.",
  },
  {
    step: 6,
    title: "On-Screen Examiner Marking",
    actor: "Authorized Subject Examiner",
    summary:
      "Human subject specialists evaluate your scanned responses on secure computer monitors using on-screen marking rubrics, time tracking, and supervisor monitoring.",
    studentImpact:
      "Examiners read scanned images on a screen—neat handwriting without ink bleed-through makes every word readable.",
  },
  {
    step: 7,
    title: "Automated Totaling & Result Compilation",
    actor: "Controller of Examinations",
    summary:
      "Per-question scores entered on screen and OMR MCQ bubble scores are totalled electronically by software, eliminating manual page-to-page addition errors.",
    studentImpact:
      "Eliminates unchecked pages and arithmetic totaling mistakes common in manual paper bundles.",
  },
];

// ---------------------------------------------------------------------------
// SYSTEM COMPARISON: TRADITIONAL VS E-SHEET VS OSM VS ONLINE EXAM
// ---------------------------------------------------------------------------
export const EXAM_MODES_COMPARISON: ExamModeComparison[] = [
  {
    mode: "Traditional Answer Copy",
    tag: "Legacy Paper Format",
    howStudentWrites:
      "Handwritten on blank ruled sheets; students number answers freely anywhere in the booklet.",
    extraSheetsAllowed: "Yes—loose continuation sheets ('B-sheets') stapled or tied by thread.",
    howEvaluated:
      "Physical bundles transported to marking centres; checked with red pen and tallied manually on cover sheet.",
    punjabFbiseStatus:
      "Still used in Punjab subjects not yet transitioned to OSM/E-Sheets.",
  },
  {
    mode: "E-Sheet (Digital Answer Booklet)",
    tag: "Physical Structured Booklet",
    howStudentWrites:
      "Handwritten with pen inside pre-allocated, question-numbered spaces/boxes, margins, and OMR bubble grids.",
    extraSheetsAllowed:
      "No extra/continuation sheets allowed (unless board specifies exceptional rules)—must fit allocated space.",
    howEvaluated:
      "Built specifically to feed optical scanners cleanly and isolate each question by barcode/QR coordinates.",
    punjabFbiseStatus:
      "Active in FBISE (SSC/HSSC & PBA) and deployed by Punjab boards for OSM subjects.",
  },
  {
    mode: "On-Screen Marking (OSM)",
    tag: "Digital Evaluation Workflow",
    howStudentWrites:
      "Exam itself remains pen-and-paper in physical centres; answers are captured on E-Sheets/OSM booklets.",
    extraSheetsAllowed: "None—fixed page allocation per question ensures clean cropping.",
    howEvaluated:
      "Scanned booklets are evaluated on computer screens by verified examiners with digital totaling & audit logs.",
    punjabFbiseStatus:
      "Active in FBISE since 2018; piloted/deployed in Punjab (e.g., CS 2nd Annual 2026); 2027 4-subject expansion reported.",
  },
  {
    mode: "Online / Computer-Based Exam",
    tag: "NOT What Punjab / FBISE E-Sheet Means",
    howStudentWrites:
      "Candidate sits at a computer terminal or tablet and types/clicks answers directly into software.",
    extraSheetsAllowed: "Not applicable (fully paperless testing centre).",
    howEvaluated: "Submitted digitally without paper booklets or scanning hubs.",
    punjabFbiseStatus:
      "Do NOT confuse E-Sheets with online exams. Board Matric/Inter E-Sheet papers are still handwritten in exam halls.",
  },
];

// ---------------------------------------------------------------------------
// PUNJAB BOARDS CHRONOLOGICAL DEVELOPMENTS (NO INVENTED NUMBERED PHASES)
// ---------------------------------------------------------------------------
export const PUNJAB_ROLLOUT_TIMELINE: PunjabRolloutStage[] = [
  {
    id: "punjab-selected-2nd-annual-2026",
    timelineTag: "Oct–Nov 2026 · Selected Pilots",
    stageLabel: "Selected 2026 Second Annual Implementations",
    statusBadge: "CONFIRMED",
    timeframe: "October – November 2026 (2nd Annual Cycle)",
    authorityBasis:
      "Punjab Education Minister directive (4 Oct 2026) & official portals of BISE D.G. Khan, BISE Lahore, and BISE Gujranwala",
    scopeSummary:
      "Selected Punjab BISEs introduced On-Screen Marking (OSM) digital answer books and candidate SOPs during 2026 Second Annual / supplementary examinations for Computer Science.",
    verifiedBoardsAndSubjects: [
      "BISE D.G. Khan (Board-Specific): Issued 16-point Candidate SOPs PDF, Centre Superintendent AMS SOPs, and OSM guide for 2nd Annual Exam 2026 Computer Science Part 1 & 2.",
      "BISE Lahore (Board-Specific): Official announcements list 'Complete Answer Book and Bubble Sheet Pattern for Computer Science (OSM)' (34-page PDF) and the 'BISE Lahore On-Screen Marking System' student and teacher video tutorial on biselahore.com.",
      "BISE Gujranwala (Board-Specific): Hosted Computer Science E-Sheet / OMR specimen templates and OSM monitoring portals.",
    ],
    whatIsConfirmed:
      "Selected-board Computer Science OSM booklets, BISE Lahore's student & teacher OSM video tutorial, and BISE D.G. Khan's 16-point SOP PDF are published on those individual board websites (not universal across every Punjab board).",
    whatAwaitsConfirmation:
      "Province-wide consolidation and uniform 2027 circulars covering all nine boards.",
  },
  {
    id: "bise-multan-hssc-cs-2nd-annual-2026",
    timelineTag: "Nov 2026 · BISE Multan Specific",
    stageLabel: "BISE Multan HSSC Second Annual 2026 Computer Science Requirement",
    statusBadge: "CONFIRMED",
    timeframe: "HSSC Second Annual 2026 (BISE Multan Only)",
    authorityBasis:
      "BISE Multan Official Events Gallery Announcement & Specimen Portal (web.bisemultan.edu.pk)",
    scopeSummary:
      "BISE Multan specifically notified that ALL Computer Science Part-I (11th) and Part-II (12th) candidates in HSSC Second Annual 2026 must solve their papers on E-Sheets, evaluated through the On-Screen Marking (OSM) system.",
    verifiedBoardsAndSubjects: [
      "Scope strictly limited to BISE Multan — HSSC Second Annual 2026 Computer Science Part-I and Part-II (do NOT generalize to other boards, subjects, or exam sessions).",
      "Official Specimen Page published at web.bisemultan.edu.pk/specimen-of-answer-sheet-for-computer-science-2nd-annual-2026/.",
      "BISE Multan instructional video reel linked on BISE Multan's Events Gallery (facebook.com/reel/2381170735983275/) explaining step-by-step how to solve the E-Sheet.",
      "BISE Multan also arranged trained technical staff at relevant Computer Science examination centres to assist candidates.",
    ],
    whatIsConfirmed:
      "Mandatory E-Sheet writing and OSM evaluation for BISE Multan HSSC 2nd Annual 2026 Computer Science Part-I & Part-II, supported by Multan's specimen, instructional video, and centre technical staff.",
    whatAwaitsConfirmation:
      "Whether similar mandates apply to additional BISE Multan subjects in Annual 2027 (pending 2027 board circulars).",
  },
  {
    id: "punjab-11-nov-2026-chairpersons-meeting",
    timelineTag: "11 Nov 2026 · 9-Board Meeting",
    stageLabel: "11 November 2026 Nine-Board Meeting & Reported 2027 Expansion",
    statusBadge: "REPORTED",
    timeframe: "11 November 2026 (Decision Reported for Annual 2027)",
    authorityBasis:
      "Lahore meeting of Chairpersons of 9 Punjab BISEs chaired by Prof. Badrul Salam (attended by Deputy Secretary Higher Education & Lahore Secretary Rizwan Nazir)",
    scopeSummary:
      "Credible education reports on 11 November 2026 (EduVision, ProPakistani) state all nine Punjab BISE chairpersons agreed to conduct exams for four science subjects on E-Sheets and implement OSM in 2027 Matric and Intermediate examinations, forming specialized oversight teams.",
    verifiedBoardsAndSubjects: [
      "All 9 Punjab BISE chairpersons participated in the Lahore harmonization meeting.",
      "EduVision (11 Nov 2026) explicitly noted further details on the selected science subjects and arrangements would be shared by the concerned boards.",
    ],
    whatIsConfirmed:
      "Media reporting confirms consensus among the nine board chairpersons to expand E-Sheets/OSM to four science subjects in 2027.",
    whatAwaitsConfirmation:
      "Signed PBCC/BISE circulars naming the exact four science subjects separately for SSC (9th–10th) vs HSSC (11th–12th). Secondary blogs guessing subject lists remain unconfirmed officially.",
  },
  {
    id: "punjab-17-nov-2026-pakistan-post-visit",
    timelineTag: "17 Nov 2026 · Infrastructure Visit",
    stageLabel: "17 November 2026 All-Board Infrastructure & Scanning-Facility Visit",
    statusBadge: "OFFICIAL BOARD UPDATE",
    timeframe: "17 November 2026 (Official Implementation Preparation)",
    authorityBasis:
      "Official BISE Multan Events Gallery Update (17 Nov 2026): Chairmen & IT Teams Visit Pakistan Post Foundation, Islamabad",
    scopeSummary:
      "Chairmen and IT teams of all Punjab BISEs visited the Pakistan Post Foundation, Islamabad to inspect printing presses, answer-sheet printing processes, and scanning mechanisms, and received an operational briefing on OSM to prepare for systematic, uniform 2027 implementation.",
    verifiedBoardsAndSubjects: [
      "Reviewed printing press infrastructure, E-Sheet/answer-booklet printing processes, and high-speed scanning mechanisms at Pakistan Post Foundation, Islamabad.",
      "Conducted operational briefing on On-Screen Marking workflows ahead of Annual Examinations 2027.",
      "Important boundary: Demonstrates multi-board operational preparation for 2027—NOT proof that every subject or every class will use E-Sheets in 2027.",
    ],
    whatIsConfirmed:
      "Official cross-board chairmen and IT inspection of Pakistan Post Foundation printing, scanning, and OSM operations on 17 November 2026.",
    whatAwaitsConfirmation:
      "Formal printing schedules, board-wise E-Sheet allocations, and subject notifications confirming which papers move onto OSM in Annual 2027.",
  },
  {
    id: "punjab-future-implementation-awaiting",
    timelineTag: "2027 & Beyond · Pending",
    stageLabel: "Future Implementation Details Awaiting Official Confirmation",
    statusBadge: "AWAITING OFFICIAL CONFIRMATION",
    timeframe: "Subject to Official 2027 Board Circulars",
    authorityBasis:
      "PBCC, Punjab Higher Education Department & Individual BISE Notifications",
    scopeSummary:
      "Finalized 2027 Matric and Intermediate subject rosters, board-by-board E-Sheet specimen booklets beyond Computer Science, and any long-term expansion into compulsory or humanities papers.",
    verifiedBoardsAndSubjects: [
      "Procurement/printing preparations (e.g., BISE Sahiwal OSM tender and the 17 Nov Pakistan Post Foundation visit) are underway.",
    ],
    whatIsConfirmed:
      "No official provincial circular has yet placed compulsory languages, Pak Studies, Islamiat, or all science papers universally on E-Sheets for 2027.",
    whatAwaitsConfirmation:
      "Exact four-subject list per class (9th, 10th, 11th, 12th), 2027 specimen releases across all 9 BISEs, and post-2027 roadmap.",
  },
];

// ---------------------------------------------------------------------------
// PUNJAB SUBJECT COVERAGE TABLE (STRICTLY FACTUAL — NO GUESSING)
// ---------------------------------------------------------------------------
export const PUNJAB_SUBJECT_COVERAGE_ROWS: SubjectCoverageRow[] = [
  {
    subjectOrGroup: "Computer Science (BISE Multan HSSC Part-I & II)",
    level: "HSSC Second Annual 2026 — BISE Multan ONLY",
    status: "CONFIRMED",
    currentEvidence:
      "BISE Multan official notice requires all HSSC 2nd Annual 2026 Computer Science Part-I & Part-II candidates to use E-Sheets marked via OSM, with specimen PDF, video reel, and centre technical staff.",
    studentAction:
      "BISE Multan CS candidates: download the official specimen and watch BISE Multan's instructional video before sitting the exam.",
  },
  {
    subjectOrGroup: "Computer Science (BISE D.G. Khan, Lahore, Gujranwala)",
    level: "2nd Annual 2026 / Selected OSM Implementations (Board-Specific)",
    status: "CONFIRMED",
    currentEvidence:
      "Board-specific official resources: BISE Lahore 'Complete Answer Book & Bubble Sheet Pattern for Computer Science (OSM)' + student/teacher OSM video tutorial; BISE D.G. Khan 16-point Student SOP PDF; BISE Gujranwala templates (each applies to its issuing board—not universal Punjab instructions).",
    studentAction:
      "Check your own district BISE portal for Computer Science OSM specimens, tutorials, and board-specific booklet SOPs.",
  },
  {
    subjectOrGroup: "Four Science Subjects (Annual 2027 Expansion)",
    level: "Matric (SSC) & Intermediate (HSSC) — Punjab-Wide",
    status: "REPORTED",
    currentEvidence:
      "Reported from the 11 Nov 2026 Chairpersons meeting under Prof. Badrul Salam, reinforced by the 17 Nov 2026 Pakistan Post Foundation OSM readiness visit. Signed board circulars naming all four exact SSC vs HSSC subjects are still awaited as of 18 Nov 2026.",
    studentAction:
      "Do NOT treat secondary blog lists (which include Statistics, an Inter subject) as final Matric law. Practice clean box-writing across core sciences and watch your BISE's signed circular.",
  },
  {
    subjectOrGroup: "Physics, Chemistry, Biology, Mathematics & Statistics",
    level: "Classes 9–12 (Core Science & Inter Electives)",
    status: "AWAITING OFFICIAL CONFIRMATION",
    currentEvidence:
      "Media commentary mentions Computer Science, Biology, Chemistry, and Statistics, while Physics/Maths status remains unconfirmed in signed provincial notices.",
    studentAction:
      "Prepare content from PECTAA ALP 2026–27 (No. 1238, 1255, 1257, 1239, 1258) while keeping answers structured to fit fixed E-Sheet boxes if designated.",
  },
  {
    subjectOrGroup: "Compulsory & Humanities / Arts Subjects",
    level: "English, Urdu, Islamiat, Pak Studies, Tarjama-tul-Quran, Arts",
    status: "AWAITING OFFICIAL CONFIRMATION",
    currentEvidence:
      "Not part of reported 4-science-subject 2027 rollout; no Punjab-wide E-Sheet mandate issued for these subjects.",
    studentAction:
      "Prepare under standard BISE / PECTAA paper patterns unless your individual board notifies otherwise.",
  },
];

// ---------------------------------------------------------------------------
// STEP-BY-STEP STUDENT GUIDE (STEPS 1–8)
// ---------------------------------------------------------------------------
export const STUDENT_STEP_BY_STEP_GUIDE: StudentGuideStep[] = [
  {
    stepNumber: 1,
    title: "Before Writing — Inspect Pages, Barcode & QR Code",
    officialRuleSummary:
      "Check before touching your pen that every page is present, in sequence, cleanly printed, not torn, and that barcodes and QR codes on every page are sharp and readable.",
    doThis: [
      "Flip through the full booklet calmly before writing a single digit.",
      "Verify that no page is blank-misprinted, torn, or missing a QR/barcode.",
      "Immediately request a replacement booklet from the invigilator if any defect appears.",
    ],
    avoidThis: [
      "Never write first and report a torn/missing page later.",
      "Do not unstaple, tear, fold, crease, or roll any page.",
    ],
    sourceRef: "Officially Confirmed Candidate SOP (BISE D.G. Khan SOP PDF #1 & #5 — Board-Specific)",
  },
  {
    stepNumber: 2,
    title: "Title Page Only — Roll Number, Paper Code & Bubbles",
    officialRuleSummary:
      "Keep your Roll Number Slip beside you. Enter Roll No., paper code/version, and required particulars strictly inside the cover-page boxes and shade the matching bubbles underneath.",
    doThis: [
      "Write one digit per box on the title page exactly as shown on your Roll Number Slip.",
      "Match each column's bubble directly below the digit before darkening.",
      "Double-check Paper Code / Version bubble matching your MCQ paper.",
    ],
    avoidThis: [
      "Never write your name, roll number, phone number, or any identifying mark anywhere inside the answer pages.",
      "Do not scratch, stick tape, or apply correction fluid over cover barcodes or QR codes.",
    ],
    sourceRef: "Officially Confirmed (BISE D.G. Khan SOP PDF #2–#3 & FBISE OMR Cover Instructions — Board-Specific)",
  },
  {
    stepNumber: 3,
    title: "MCQ Bubble Filling Rules (Zero-Tolerance OMR Scanning)",
    officialRuleSummary:
      "Optical scanners read darkened ink intensity inside a single circle. Partial marks, ticks, or multiple bubbles trigger zero marks for that MCQ.",
    doThis: [
      "Fill ONE bubble per question completely and darkly so the printed letter inside disappears.",
      "Confirm Question Number alignment (especially in multi-column MCQ grids) before shading.",
    ],
    avoidThis: [
      "Never tick (✓), cross (✗), circle around, dot, or half-fill a bubble.",
      "Never use whitener/correction fluid or overwrite—cutting or filling >1 bubble scores 0 for that MCQ.",
    ],
    sourceRef: "Officially Confirmed (BISE D.G. Khan SOP PDF #7 & FBISE OMR Rules — Verify Your Own Board Sheet)",
  },
  {
    stepNumber: 4,
    title: "Understand Designated Boxes & Page Mapping",
    officialRuleSummary:
      "Every short question and long question is mapped to dedicated printed spaces/pages. Scanners crop each answer box and route it digitally to the examiner.",
    doThis: [
      "Read the printed Question Number label (e.g., Q. No. 2 (i) or Long Q. No. 5 Page 1–2) before writing.",
      "Match your question selection carefully—only attempt inside the boxes of questions you choose.",
      "If you skip an optional part, leave that box completely empty.",
    ],
    avoidThis: [
      "Never write Q3's answer inside Q2's box even if you draw an arrow or re-label the number.",
      "Do not merge two short answers into one shared box.",
    ],
    sourceRef: "Officially Confirmed (BISE D.G. Khan SOP PDF #9 & FBISE 2027 Sample E-Sheet Explicit Space Rule)",
  },
  {
    stepNumber: 5,
    title: "Respect Printed Margins & Top/Bottom Edges",
    officialRuleSummary:
      "Scanning software crops strictly along inner margin boundaries. Anything outside the margin lines or near the top/bottom page edge is invisible on the examiner's screen.",
    doThis: [
      "Keep all text, equations, diagrams, and labels comfortably inside the printed margin frame.",
      "Start a slightly smaller, neat script if an answer nears the bottom line of its box.",
    ],
    avoidThis: [
      "Do not write notes vertically in side margins, above the header line, or below the footer border.",
      "Do not trace diagrams onto barcode strips or corner registration markers.",
    ],
    sourceRef: "Officially Confirmed (BISE D.G. Khan SOP PDF #4 — Board-Specific) + General Scanning Guidance",
  },
  {
    stepNumber: 6,
    title: "Plan Answer Length — Zero Extra Continuation Sheets",
    officialRuleSummary:
      "Traditional extra loose sheets ('B-sheets') are NOT issued or attached to E-Sheets/OSM booklets. Pre-allocated page space is calibrated to the expected answer length.",
    doThis: [
      "Practice past-paper answers inside fixed page limits during mock revision.",
      "Lead with clear definitions, balanced equations/formulas, and direct points rather than long filler intros.",
    ],
    avoidThis: [
      "Do not waste the first half of a long-question page on oversized decorative headings.",
      "Never ask for or staple extra loose sheets into the booklet.",
    ],
    sourceRef: "Officially Confirmed (BISE D.G. Khan SOP PDF #10 & FBISE Policy) + General Practical Guidance",
  },
  {
    stepNumber: 7,
    title: "Make Clean Corrections & Use Designated Rough Work Only",
    officialRuleSummary:
      "Whitener/correction fluid is prohibited because it flakes, smudges scanner rollers, or obscures scanned areas. Cancel mistakes cleanly and keep rough calculations strictly in designated rough space.",
    doThis: [
      "Strike out an unwanted line or word using a single neat straight horizontal line.",
      "Perform calculations or outlines solely on the printed Rough Work page(s) at the back.",
    ],
    avoidThis: [
      "Never apply white fluid, eraser ink, correction tape, or heavy scribble blocks.",
      "Never do rough arithmetic inside an unused question box.",
    ],
    sourceRef: "Officially Confirmed (BISE D.G. Khan SOP PDF #8 & #11 — Board-Specific)",
  },
  {
    stepNumber: 8,
    title: "Final 3-Minute Check & Safe Handover",
    officialRuleSummary:
      "Protect the physical sheet from moisture or creases until the invigilator collects it directly.",
    doThis: [
      "Verify title-page roll number boxes & OMR bubbles match your slip one final time.",
      "Confirm every attempted answer sits inside its matching question label and inside margins.",
      "Keep booklet flat, clean, and dry until collected by the invigilator.",
    ],
    avoidThis: [
      "Never write messages, prayers/requests to the examiner, or phone numbers.",
      "Never take any page out of the exam hall—hand in the booklet even if pages remain unused.",
    ],
    sourceRef: "Officially Confirmed (BISE D.G. Khan SOP PDF #13, #15 & #16) + General Practical Guidance",
  },
];

// ---------------------------------------------------------------------------
// STATIONERY GUIDE (ATTRIBUTED TO SOURCE BOARDS — NO FABRICATED UNIVERSAL RULE)
// ---------------------------------------------------------------------------
export const STATIONERY_GUIDE_ITEMS: StationeryRuleItem[] = [
  {
    category: "recommended",
    item: "Blue or Black Ballpoint / Ink Pen (Non-Smudging)",
    statusLabel: "BOARD-SPECIFIC SOP / RECOMMENDED",
    punjabEvidence:
      "BISE D.G. Khan SOP PDF (#6 — applicable to BISE D.G. Khan OSM booklets) states: 'Use only a blue or black ink pen.' Separately, BISE Lahore and BISE Multan candidates must follow the pen rules printed on their own board's specimen/booklet cover.",
    fbiseEvidence:
      "FBISE OMR/E-Sheet instructions accept blue or black ballpoint/ink pen for high-contrast scanning and bubble darkening.",
    practicalAdvice:
      "General Practical Guidance: Carry two tested, smooth-flowing blue ballpoints (or non-smudging ink pens) that do not blot or soak through the back of the paper.",
  },
  {
    category: "conditional",
    item: "Black Ballpoint / Marker Usage (Check Own Board Booklet)",
    statusLabel: "BOARD-SPECIFIC / CONDITIONAL",
    punjabEvidence:
      "BISE D.G. Khan SOP PDF (#6) allows blue or black ink pen while explicitly prohibiting markers for its SOP ('Do not use red or green ink, highlighters, markers or gel pens that smudge'). Other Punjab boards' booklet cover instructions may vary.",
    fbiseEvidence:
      "FBISE accepts black or blue ballpoint for OMR bubbles and text; avoid heavy broad-tip markers that bleed through paper onto the reverse page.",
    practicalAdvice:
      "General Practical Guidance: Never assume headings require broad markers on an E-Sheet. Check your own board's specimen booklet cover first.",
  },
  {
    category: "conditional",
    item: "Lead Pencil & Geometry Set (Diagrams / Graphs Only)",
    statusLabel: "BOARD-SPECIFIC / DIAGRAMS ONLY",
    punjabEvidence:
      "Allowed only where subject instructions permit neat scientific diagrams, geometry constructions, or graphs—draw dark enough to scan clearly without tearing paper.",
    fbiseEvidence:
      "FBISE OMR sheets explicitly print: 'Do not use lead pencil' for OMR bubbles/written answers. FBISE E-sheets instruct: 'Draw the diagram within question if required.'",
    practicalAdvice:
      "General Practical Guidance: Never write descriptive answers or shade OMR roll-number/MCQ bubbles with a lead pencil.",
  },
  {
    category: "prohibited",
    item: "Gel Pens, Glitter Pens & Smudging Rollerballs",
    statusLabel: "PROHIBITED IN BISE D.G. KHAN SOP",
    punjabEvidence:
      "Explicitly barred in BISE D.G. Khan SOP PDF (#6: 'gel pens that smudge') because wet ink smears across scanner rollers and bleeds through to reverse pages.",
    fbiseEvidence:
      "General Risk / Unsafe Practice on scanned booklets due to bleed-through and slow drying (check FBISE cover notes for ballpoint/ink requirement).",
    practicalAdvice: "General Practical Guidance: Leave gel, glitter, and slow-drying wet-ink pens at home.",
  },
  {
    category: "prohibited",
    item: "Correction Fluid (Whitener), Erasable Ink & Tape",
    statusLabel: "PROHIBITED BY CONFIRMED SOPs",
    punjabEvidence:
      "Explicitly banned in BISE D.G. Khan SOP PDF (#3 & #8: 'Do not use correction fluid (whitener) or erasable ink') and zero-tolerance OMR rules.",
    fbiseEvidence:
      "FBISE OMR cover sheet explicitly warns: 'Deleting/overwriting is not allowed.'",
    practicalAdvice:
      "General Practical Guidance: If you make a written error in the subjective section, cross it out neatly with a single straight horizontal line—never apply whitener.",
  },
  {
    category: "prohibited",
    item: "Highlighters, Red/Green Ink & Markers (Per BISE D.G. Khan SOP)",
    statusLabel: "PROHIBITED IN BISE D.G. KHAN SOP",
    punjabEvidence:
      "BISE D.G. Khan SOP PDF (#6 — board-specific) explicitly prohibits 'red or green ink, highlighters, markers'. Check your own issuing board's E-Sheet cover for any board-specific exceptions.",
    fbiseEvidence:
      "Red/green ink and highlighters are strictly reserved for examiners/supervisory processing on FBISE scripts—avoid entirely.",
    practicalAdvice:
      "General Practical Guidance: Use clean spacing, numbered sub-points, and single underlines made with your blue/black pen instead of highlighters.",
  },
];

// ---------------------------------------------------------------------------
// 14 COMMON MISTAKES THAT CAUSE MARK LOSS (NO INVENTED PENALTY NUMBERS)
// ---------------------------------------------------------------------------
export const AVOID_MARK_LOSS_MISTAKES: MarkLossPitfall[] = [
  {
    id: "m1-outside-margins",
    number: 1,
    mistake: "Writing Outside Margins or on Top/Bottom Edges",
    severity: "Critical",
    whyItMattersTechnically:
      "Automated cropping software clips each page strictly within fixed margin coordinates. Text extending outside the border is cut off from the image shown to the examiner.",
    verifiedConsequenceBasis:
      "BISE D.G. Khan SOP PDF #4 (Board-Specific): Anything written outside margins or on top/bottom edges will not be scanned and will not be marked.",
    howToPrevent:
      "Keep every word, equation sign, and diagram label at least 0.5 cm inside the printed margin lines.",
  },
  {
    id: "m2-wrong-box",
    number: 2,
    mistake: "Writing an Answer in the Wrong Question's Space",
    severity: "Critical",
    whyItMattersTechnically:
      "In On-Screen Marking, questions are sliced and sent to examiners question-by-question (not as a full booklet). An examiner marking Q4 only sees the scanned slice of Q4's box.",
    verifiedConsequenceBasis:
      "FBISE Sample E-Sheet (sample_esheet_for_PCBC_SSC1_2027.pdf) explicitly warns marks will not be awarded outside the specified space; BISE D.G. Khan SOP PDF #9 directs answering strictly in designated areas.",
    howToPrevent:
      "Check the question number label printed at the top of the box before writing every single part.",
  },
  {
    id: "m3-barcode-qr",
    number: 3,
    mistake: "Writing Over, Scratching, or Covering Barcodes / QR Codes",
    severity: "Critical",
    whyItMattersTechnically:
      "Scanners rely on page barcodes and QR codes to bind your identity anonymously and route each page to the right subject folder.",
    verifiedConsequenceBasis:
      "BISE D.G. Khan SOP PDF #3 (Board-Specific): A damaged barcode or QR code can disrupt scanning and directly affect the marking of your answer copy.",
    howToPrevent:
      "Never write, tick, underline, stick tape, or rest wet ink over any printed barcode or QR square.",
  },
  {
    id: "m4-mcq-bubbles",
    number: 4,
    mistake: "Incorrect MCQ Bubble Filling (Tick, Cross, Half-Fill, Multiple)",
    severity: "Critical",
    whyItMattersTechnically:
      "OMR optical readers measure pixel density inside each circle. Ticks or light dots fail optical thresholds; two shaded circles register as an invalid double response.",
    verifiedConsequenceBasis:
      "BISE D.G. Khan SOP PDF #7 (Board-Specific): Cutting, overwriting, whitener, or filling >1 bubble counts as multiple answers and scores zero marks for that MCQ.",
    howToPrevent:
      "Confirm your choice before touching paper, then darken one full circle evenly from centre outward.",
  },
  {
    id: "m5-roll-number-bubble",
    number: 5,
    mistake: "Wrong Roll Number Box Digits or Mismatched OMR Bubbles",
    severity: "Critical",
    whyItMattersTechnically:
      "Automated result compilation matches the OMR-read roll number bubbles—not just your handwritten digits—against the board database.",
    verifiedConsequenceBasis:
      "BISE D.G. Khan SOP PDF #2 & FBISE OMR cover instructions: Mis-shaded Roll Number or Paper Code bubbles risk delayed or misallocated script processing.",
    howToPrevent:
      "Keep your Roll Number Slip open on the desk, write digits first, then verify each column top-to-bottom before shading.",
  },
  {
    id: "m6-whitener",
    number: 6,
    mistake: "Using Correction Fluid (Whitener) or Erasable Ink",
    severity: "High",
    whyItMattersTechnically:
      "Whitener can flake off inside high-speed scanners, obscure surrounding text on scan images, or invalidate an OMR field.",
    verifiedConsequenceBasis:
      "BISE D.G. Khan SOP PDF #8 & #7 explicitly prohibit whitener/erasable ink and treat whitener on an OMR bubble as zero marks for that item.",
    howToPrevent:
      "For written mistakes, draw a single clean straight line across the wrong text and continue neatly.",
  },
  {
    id: "m7-extra-sheets",
    number: 7,
    mistake: "Running Out of Allocated Page Space & Expecting Extra Sheets",
    severity: "High",
    whyItMattersTechnically:
      "Extra loose pages have no page barcode/QR sequence and cannot pass through automated E-Sheet duplex feeders.",
    verifiedConsequenceBasis:
      "BISE D.G. Khan SOP PDF #10 & FBISE E-Sheet rules: No extra or supplementary sheet will be attached to the answer copy.",
    howToPrevent:
      "Check total allocated lines/pages for a question first, then budget compact headings and concise technical phrasing.",
  },
  {
    id: "m8-folding-creasing",
    number: 8,
    mistake: "Folding, Rolling, Creasing, Tearing, or Removing Staples",
    severity: "High",
    whyItMattersTechnically:
      "High-speed sheet-fed scanners jam on folded edges, creased corners, or detached pages, risking torn scans or missed page sides.",
    verifiedConsequenceBasis:
      "BISE D.G. Khan SOP PDF #5 (Board-Specific): Do not fold, crease, roll, tear, cut, unstaple, or detach any page.",
    howToPrevent:
      "Keep the booklet lying flat on your desk throughout the exam—never fold cover pages backward while writing.",
  },
  {
    id: "m9-press-hard-bleed",
    number: 9,
    mistake: "Pressing Too Hard or Using Ink/Markers That Bleed Through",
    severity: "High",
    whyItMattersTechnically:
      "Duplex scanners photograph both sides of thin paper under bright LED arrays; heavy pressure indentations and marker bleed create ghost text on the reverse page.",
    verifiedConsequenceBasis:
      "BISE D.G. Khan SOP PDF #12 (Board-Specific): Ink showing through to the other side makes reverse-side writing hard to read after scanning.",
    howToPrevent:
      "Use moderate hand pressure with a standard non-smudging blue/black ballpoint pen—avoid felt markers or wet gel pens.",
  },
  {
    id: "m10-overwriting-messy",
    number: 10,
    mistake: "Overwriting, Scribbling Heavily, or Unreadable Handwriting",
    severity: "Medium",
    whyItMattersTechnically:
      "Screen resolution flattens subtle strokes; tiny, crowded, or overwritten words become illegible blurs on a monitor without physical paper tilting.",
    verifiedConsequenceBasis:
      "BISE D.G. Khan SOP PDF #14 (Board-Specific): Examiners read answers on a computer screen, so illegible writing may lose marks.",
    howToPrevent:
      "Maintain slightly larger, open lettering, clear spacing between lines, and clean single-line strike-throughs.",
  },
  {
    id: "m11-rough-in-answer-box",
    number: 11,
    mistake: "Doing Rough Calculations Inside Unused Question Boxes",
    severity: "Medium",
    whyItMattersTechnically:
      "Rough scribbles inside an answer box clutter the cropped digital frame or confuse which attempt was intended.",
    verifiedConsequenceBasis:
      "BISE D.G. Khan SOP PDF #11 (Board-Specific): Perform rough work strictly in the designated Rough Work area.",
    howToPrevent:
      "Flip cleanly to the designated Rough Work page at the end of the booklet for formulas, balancing, or outlines.",
  },
  {
    id: "m12-identifying-marks",
    number: 12,
    mistake: "Writing Identifying Marks, Names, Messages, or Phone Numbers",
    severity: "Critical",
    whyItMattersTechnically:
      "Board secrecy and Unfair Means (UFM) rules strictly forbid any personal identifier or plea to examiners inside answer scripts.",
    verifiedConsequenceBasis:
      "BISE D.G. Khan SOP PDF #2 & #15 prohibit names, roll numbers inside text pages, messages, requests, phone numbers, or irrelevant remarks.",
    howToPrevent:
      "Keep every page strictly academic—write your roll number only in the designated title-page grid.",
  },
  {
    id: "m13-moisture-damage",
    number: 13,
    mistake: "Water, Sweat, or Liquid Smudging the Sheet",
    severity: "Medium",
    whyItMattersTechnically:
      "Damp paper warps under scanner feeders and causes ink feathering across lines.",
    verifiedConsequenceBasis:
      "BISE D.G. Khan SOP PDF #13 (Board-Specific): Keep the answer copy clean and dry away from water, sweat, food, and liquids.",
    howToPrevent:
      "Use a clean handkerchief/blotting tissue under your wrist in hot weather and keep water bottles off the desk surface.",
  },
  {
    id: "m14-ignoring-paper-code",
    number: 14,
    mistake: "Ignoring Objective Paper Code / Version Bubbles",
    severity: "Critical",
    whyItMattersTechnically:
      "Different MCQ versions (Paper A/B/C/D or 4-digit codes) have shuffled question orders. Software grades your bubbles against the Version Key you bubbled.",
    verifiedConsequenceBasis:
      "FBISE OMR & individual Punjab board bubble sheet architecture grades Objective answers according to the filled Paper Code / Version field.",
    howToPrevent:
      "Copy and verify the exact Paper Code / Version from your question paper immediately upon receiving it.",
  },
];

// ---------------------------------------------------------------------------
// SEPARATE FBISE SECTION (100% VERIFIED FROM FBISE.EDU.PK)
// ---------------------------------------------------------------------------
export const FBISE_MILESTONES = [
  {
    year: "2018",
    title: "HSSC Computer Science Pilot Launch",
    detail:
      "FBISE introduced On-Screen Marking & E-Sheets in Annual Examination 2018 at HSSC level for Computer Science (confirmed on fbise.edu.pk/E-sheet.php).",
  },
  {
    year: "2019",
    title: "Biology Added & Multi-Examiner Screen Marking",
    detail:
      "FBISE expanded E-Sheets in Annual 2019 to include HSSC Biology alongside Computer Science—noting a single script could be marked digitally across 8–10 qualified examiners nationwide to reduce variation and tabulation errors.",
  },
  {
    year: "2024–2026",
    title: "Full Multi-Subject SSC, HSSC & PBA E-Sheets",
    detail:
      "FBISE's screen_marking.php now hosts live E-Sheets across English, Urdu, Islamiat, Pak Studies, Tarjama-e-Quran, Mathematics, Physics, Chemistry, Biology, Computer Science, General Science, Civics, Education, Sociology, Statistics, plus Matric Practical Based Assessment (PBA) E-Sheets.",
  },
  {
    year: "2027 Samples",
    title: "2027 Sample E-Sheets Already Published",
    detail:
      "Official 2027 sample E-Sheets for SSC-I & HSSC-I (50% MCQs & 50% Descriptive scheme) are already live for student download on fbise.edu.pk/screen_marking.php.",
  },
];

export const FBISE_VERIFIED_SAMPLES: FBISEAssetSample[] = [
  {
    title: "SSC-I PCBC (Physics / Chemistry / Biology / Computer Science)",
    level: "Class 9 (2027 Sample — 50% MCQs & 50% Descriptive)",
    pages: "14 Pages",
    sessionNote:
      "FBISE-Specific Rule: Answer each question or part in the specified space; otherwise marks for that answer will not be awarded.",
    url: "https://www.fbise.edu.pk/Downloads/E-Sheets-2026/sample_esheet_for_PCBC_SSC1_2027.pdf",
  },
  {
    title: "SSC-I Mathematics",
    level: "Class 9 (2027 Sample — 50% MCQs & 50% Descriptive)",
    pages: "20 Pages",
    sessionNote: "Pre-allocated question boxes & OMR cover",
    url: "https://www.fbise.edu.pk/Downloads/E-Sheets-2026/sample_esheet_for_MATHS_SSC1_2027.pdf",
  },
  {
    title: "HSSC-I PCBC (Physics / Chemistry / Biology / Computer Science)",
    level: "Class 11 (2027 Sample — 50% MCQs & 50% Descriptive)",
    pages: "16 Pages",
    sessionNote: "Official 2027 HSSC sample E-Sheet",
    url: "https://www.fbise.edu.pk/Downloads/E-Sheets-2026/sample_esheet_for_PCBC_HSSC1_2027.pdf",
  },
  {
    title: "HSSC-I Mathematics",
    level: "Class 11 (2027 Sample — 50% MCQs & 50% Descriptive)",
    pages: "32 Pages",
    sessionNote: "Dedicated calculation & multi-page long answer grids",
    url: "https://www.fbise.edu.pk/Downloads/E-Sheets-2026/sample_esheet_for_maths_HSSC1_2027.pdf",
  },
  {
    title: "Matric Practical Based Assessment (PBA) E-Sheets",
    level: "Physics, Biology/Chemistry & Computer Science",
    pages: "18 Pages each",
    sessionNote: "Written/structured PBA assessment on E-Sheets",
    url: "https://www.fbise.edu.pk/screen_marking.php",
  },
];

export const PUNJAB_VS_FBISE_COMPARISON: PunjabVsFBISEComparisonRow[] = [
  {
    dimension: "Authority & Jurisdiction",
    punjabBoards:
      "Nine provincial Punjab BISEs coordinated by PBCC (Lahore, Rawalpindi, Multan, Faisalabad, Gujranwala, Sargodha, Bahawalpur, D.G. Khan, Sahiwal).",
    fbise:
      "Federal Board of Intermediate & Secondary Education (FBISE), Islamabad—governs federal/cantonment/overseas institutions.",
  },
  {
    dimension: "E-Sheet Rollout Maturity",
    punjabBoards:
      "Board-specific 2026 2nd Annual Computer Science implementations (e.g., BISE Multan HSSC CS Part-I & II mandate; BISE Lahore CS AnswerBook & video tutorial; BISE D.G. Khan SOP PDF; BISE Gujranwala templates); 2027 4-science-subject expansion reported 11 Nov 2026 (circulars awaited).",
    fbise:
      "Established operational system since 2018 (HSSC CS), expanded in 2019 (Biology), now covering broad SSC/HSSC theory & PBA subjects with 2027 samples live.",
  },
  {
    dimension: "Official Specimen Availability",
    punjabBoards:
      "Board-by-board (e.g., BISE Lahore CS OSM PDF & student/teacher tutorial on biselahore.com; BISE D.G. Khan 16-point SOP PDF; BISE Multan HSSC CS Specimen & Facebook video reel; BISE Gujranwala templates).",
    fbise:
      "Centralized library of 25+ subject-specific downloadable SSC, HSSC & PBA PDFs on fbise.edu.pk/screen_marking.php.",
  },
  {
    dimension: "Curriculum & Question Pattern",
    punjabBoards:
      "PECTAA ALP / Smart Syllabus & Pairing Schemes (Notifications No. 1238, 1255, 1257, 1239, 1256, 1258).",
    fbise:
      "FBISE SLO-based Assessment Framework (e.g., 2027 SSC-I/HSSC-I Inclusive Scheme with 50% MCQs & 50% Descriptive where notified).",
  },
  {
    dimension: "Answer Allocation Warning",
    punjabBoards:
      "BISE D.G. Khan SOP PDF #9 & #10 (board-specific): Attempt answers in designated area only; no supplementary extra sheets.",
    fbise:
      "Explicit FBISE-only instruction (printed on 2027 sample_esheet_for_PCBC_SSC1_2027.pdf): Answer each question or part in the specified space; otherwise marks for that answer will not be awarded.",
  },
  {
    dimension: "Cross-Board Applicability",
    punjabBoards:
      "Strictly follow your own Punjab district BISE's instructions & PECTAA syllabus.",
    fbise:
      "Strictly follow fbise.edu.pk E-Sheet specimens & SLO papers—never mix FBISE page counts or SLO layouts into Punjab exams.",
  },
];

// ---------------------------------------------------------------------------
// VERIFIED OFFICIAL SOURCES REGISTRY
// ---------------------------------------------------------------------------
export const ESHEET_OFFICIAL_SOURCES: ESheetOfficialSource[] = [
  {
    authority: "BISE Lahore — Official Website",
    title: "BISE Lahore Official Portal: Announcements, Computer Science OSM Answer Book & OSM Guidance (#osm)",
    scope: "BISE Lahore ONLY — Hosts CS Answer Book link & Student/Teacher OSM Video Modal (2026–27)",
    url: "https://www.biselahore.com/",
    verifiedDate: "18 November 2026",
  },
  {
    authority: "BISE Lahore — Official PDF",
    title: "Complete Answer Book & Bubble Sheet Pattern for Computer Science (OSM) (34-page PDF)",
    scope: "BISE Lahore ONLY — Computer Science OSM specimen (NOT universal Punjab instructions)",
    url: "https://data.biselahore.com/dt/downloads/notifications/misc/AnswerBook_CSc.pdf",
    verifiedDate: "18 November 2026",
  },
  {
    authority: "BISE Lahore — Video Tutorial (YouTube)",
    title: "BISE Lahore On-Screen Marking System: Complete Answer & Bubble Sheet Guide for Students & Teachers",
    scope: "BISE Lahore ONLY — Video tutorial embedded on biselahore.com/#osm via @Lahore-Board-Official",
    url: "https://www.youtube.com/watch?v=Eea8ivG9_Tg",
    verifiedDate: "18 November 2026",
  },
  {
    authority: "BISE Multan — Official Events Gallery",
    title: "17 Nov 2026 All-Punjab Pakistan Post Foundation Visit + HSSC 2nd Annual 2026 Computer Science E-Sheet Notice",
    scope: "BISE Multan HSSC 2nd Annual 2026 CS Part-I & II Mandate + All-Punjab Annual 2027 OSM Readiness Visit",
    url: "https://web.bisemultan.edu.pk/events-gallery/",
    verifiedDate: "18 November 2026",
  },
  {
    authority: "BISE Multan — Official Specimen Page",
    title: "Specimen of Answer Sheet for Computer Science (HSSC 2nd Annual 2026)",
    scope: "BISE Multan ONLY — HSSC Second Annual 2026 Computer Science Part-I & Part-II",
    url: "https://web.bisemultan.edu.pk/specimen-of-answer-sheet-for-computer-science-2nd-annual-2026/",
    verifiedDate: "18 November 2026",
  },
  {
    authority: "BISE Multan — Social Media Video Reel",
    title: "BISE Multan E-Sheet Attempt Video Reel (Linked from BISE Multan Events Gallery)",
    scope: "BISE Multan ONLY — Step-by-step CS E-Sheet attempt guide for HSSC 2nd Annual 2026",
    url: "https://www.facebook.com/reel/2381170735983275/",
    verifiedDate: "18 November 2026",
  },
  {
    authority: "BISE D.G. Khan — Official PDF",
    title: "SOPs for Candidates — How to Attempt the Paper on Digital Answer Copy (16 Points)",
    scope: "BISE D.G. Khan — 2nd Annual Exam 2026 Computer Science (Board-Specific Candidate Rules)",
    url: "https://bisedgkhan.edu.pk/Pdf/6aeeb863dc094_BISEPunjab-InstructionsforStudentsDGKhan1.pdf",
    verifiedDate: "18 November 2026",
  },
  {
    authority: "BISE D.G. Khan — Official Supervisory PDF",
    title: "Instructions for Centre Superintendents — AMS Usage & Digital Answer Copies",
    scope: "BISE D.G. Khan — QR scanning, no folding/stapling/punching, centre return handling (2nd Annual 2026)",
    url: "https://bisedgkhan.edu.pk/Pdf/6aeeb8e84a024_BISEPunjab-InstructionsforCentreSuperintendentsDGKhan.pdf",
    verifiedDate: "18 November 2026",
  },
  {
    authority: "FBISE — Official Portal (Federal Board)",
    title: "FBISE Official E-Sheets & OMR Screen Marking Downloads Portal",
    scope: "FBISE ONLY — Active 2026 E-Sheets, PBA E-Sheets & 2027 sample E-Sheets",
    url: "https://www.fbise.edu.pk/screen_marking.php",
    verifiedDate: "18 November 2026",
  },
  {
    authority: "FBISE — Official Portal (Federal Board)",
    title: "FBISE Screen Marking Background & 2018–2019 Rollout Notice",
    scope: "FBISE ONLY — Explanation of FBISE E-Sheets & multi-examiner screen marking",
    url: "https://www.fbise.edu.pk/E-sheet.php",
    verifiedDate: "18 November 2026",
  },
  {
    authority: "FBISE — Official Sample PDF (Federal Board)",
    title: "FBISE 2027 Sample E-Sheet — SSC-I PCBC (Physics / Chemistry / Biology / Computer Science)",
    scope: "FBISE ONLY — Class 9 Annual 2027 sample with explicit specified-space mark forfeiture warning",
    url: "https://www.fbise.edu.pk/Downloads/E-Sheets-2026/sample_esheet_for_PCBC_SSC1_2027.pdf",
    verifiedDate: "18 November 2026",
  },
  {
    authority: "News Report (EduVision — 11 Nov 2026)",
    title: "EduVision: Punjab Boards to Introduce On-Screen Marking for Matric & Inter Exams",
    scope: "Media Coverage — 9-board Chairpersons meeting & reported 4-science-subject 2027 plan",
    url: "https://www.eduvision.edu.pk/edu_news/punjab-boards-to-introduce-on-screen-marking-for-matric-and-intermediate-exams-news-4586",
    verifiedDate: "18 November 2026",
  },
  {
    authority: "News Report (Express Tribune — 4 Oct 2026)",
    title: "The Express Tribune: Punjab Boards to Take Paper Checking Online",
    scope: "Media Coverage — Punjab Education Minister directive & digital checking background",
    url: "https://tribune.com.pk/story/2632845/punjab-boards-to-take-paper-checking-online",
    verifiedDate: "18 November 2026",
  },
];

// ---------------------------------------------------------------------------
// STUDENT FAQS (BOARD-SEPARATED & HONEST)
// ---------------------------------------------------------------------------
export const ESHEET_FAQS: ESheetFAQItem[] = [
  {
    id: "faq-online-exam",
    boardScope: "Both (Rules Separate)",
    question: "Are E-Sheet exams conducted online on computers?",
    answer:
      "No. You still go to your physical examination hall and write your exam by hand with a pen on paper. An E-Sheet is simply a pre-structured, barcode/QR-coded paper answer booklet designed so boards can scan your pages and have examiners mark them on computer screens (On-Screen Marking / OSM).",
  },
  {
    id: "faq-4-subjects",
    boardScope: "Punjab Boards",
    question: "Which 4 science subjects are officially confirmed for Punjab 2027 E-Sheets?",
    answer:
      "As of 18 November 2026, news reports (11 Nov 2026) state that Punjab's nine board chairpersons decided to conduct 4 science subjects on E-Sheets in 2027, and Computer Science OSM pilots are already documented in 2026 2nd Annual exams (BISE Lahore, D.G. Khan, Multan, Gujranwala). While secondary blogs mention Biology, Chemistry, Computer Science, and Statistics, no single signed provincial circular on all 9 BISE portals has yet finalized the exact SSC (9th–10th) vs HSSC (11th–12th) subject list. Always verify your own BISE's official notice.",
  },
  {
    id: "faq-extra-sheet",
    boardScope: "Both (Rules Separate)",
    question: "Can I ask for an extra continuation sheet ('B-sheet') on an E-Sheet exam?",
    answer:
      "No. Both BISE Punjab OSM rules (SOP #10) and FBISE E-Sheet rules explicitly prohibit attaching extra continuation sheets because automated duplex scanners and barcode page-indexing expect fixed booklet page counts. Always plan your answer concisely within the designated space.",
  },
  {
    id: "faq-markers-gelpens",
    boardScope: "Punjab Boards",
    question: "Are black markers, highlighters, or gel pens allowed on Punjab E-Sheets?",
    answer:
      "Under BISE D.G. Khan / BISE Punjab's official Candidate SOP #6 ('How to Attempt the Paper on Digital Answer Copy'), candidates are explicitly instructed: 'Use only a blue or black ink pen. Do not use red or green ink, highlighters, markers or gel pens that smudge.' Always check your specific board's booklet cover instructions before entering the hall.",
  },
  {
    id: "faq-wrong-box",
    boardScope: "Both (Rules Separate)",
    question: "What happens if I write Question 4's answer inside Question 3's box?",
    answer:
      "In On-Screen Marking, software crops Question 3's space and sends it specifically to an examiner grading Question 3—not Question 4. FBISE explicitly prints on every question box: 'Otherwise, the marks of concerned answer will not be given,' and BISE Punjab SOP #9 instructs answering strictly inside the designated area.",
  },
  {
    id: "faq-whitener",
    boardScope: "Both (Rules Separate)",
    question: "What if I make a mistake while writing or bubbling? Can I use whitener?",
    answer:
      "Do NOT use correction fluid (whitener), correction tape, or erasable ink. On MCQs/OMR bubbles, cutting, overwriting, or using whitener results in zero marks for that MCQ (Punjab SOP #7; FBISE OMR cover forbids deleting/overwriting). On subjective written answers, draw one clean straight line through the mistaken word/line and rewrite neatly.",
  },
  {
    id: "faq-lead-pencil",
    boardScope: "Both (Rules Separate)",
    question: "Can I fill OMR roll-number/MCQ bubbles or write answers using a lead pencil?",
    answer:
      "No. Lead pencil reflects light inconsistently under high-speed OMR scanners—FBISE OMR covers explicitly state 'Do not use lead pencil,' and Punjab SOP #6–7 mandate blue or black ink/ballpoint pen. Only use a dark lead pencil for neat diagrams/graphs where specifically allowed by subject rules.",
  },
  {
    id: "faq-fbise-vs-punjab",
    boardScope: "Both (Rules Separate)",
    question: "Should a Punjab Board student practice using FBISE sample E-Sheets?",
    answer:
      "They are good only for understanding the general concept of writing inside boxed zones. However, never copy FBISE's SLO question distribution, MCQ weightages (e.g., 50% MCQs in 2027 FBISE SSC-I samples), or exact page counts into Punjab BISE preparation—follow your own Punjab BISE specimen (e.g., BISE Lahore/Multan CS OSM) and PECTAA ALP pairing scheme.",
  },
];
