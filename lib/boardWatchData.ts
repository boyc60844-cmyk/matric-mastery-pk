export type BoardWatchTopic =
  | "matric-2027"
  | "inter-2027"
  | "historical-2026"
  | "paper-patterns"
  | "smart-syllabus"
  | "passing-grading"
  | "admissions"
  | "practical-exams"
  | "policies-reforms"
  | "e-sheets"
  | "fbise";

export type BoardWatchStatusLabel =
  | "CONFIRMED"
  | "REPORTED"
  | "AWAITING OFFICIAL CONFIRMATION"
  | "PLANNED / APPROVED INITIATIVE"
  | "HISTORICAL"
  | "UNVERIFIED";

export type BoardWatchCategory =
  | "confirmed"
  | "reported"
  | "awaiting"
  | "planned"
  | "historical"
  | "rumor";

export type ExamClass = "9th" | "10th" | "11th" | "12th";

export type BoardId =
  | "all"
  | "lahore"
  | "gujranwala"
  | "faisalabad"
  | "rawalpindi"
  | "multan"
  | "sargodha"
  | "bahawalpur"
  | "dgkhan"
  | "sahiwal"
  | "fbise";

export type VerificationStatus =
  | "officially-confirmed"
  | "credibly-reported"
  | "awaiting-confirmation"
  | "planned-initiative"
  | "historical-record"
  | "unverified-rumor";

export interface BoardInfo {
  id: Exclude<BoardId, "all" | "fbise">;
  name: string;
  shortName: string;
  urduName: string;
  website: string;
  notificationsUrl: string;
  admissionPortalUrl: string;
  portalObservation?: string;
  headquarters: string;
  districts: string[];
  helpline: string;
  code: string;
  jurisdictionSummary: string;
}

export interface BoardWatchSourceLink {
  label: string;
  url: string;
  sourceKind: "official" | "news" | "reproduced-copy";
}

export interface BoardWatchGradeDetail {
  grade: string;
  notification: string;
  date: string;
  notes: string;
}

export interface BoardWatchEntry {
  id: string;
  headline: string;
  summary: string;
  category: BoardWatchCategory;
  status: VerificationStatus;
  statusDisplayLabel: BoardWatchStatusLabel;
  topics: BoardWatchTopic[];
  isHistorical?: boolean;
  affectedClasses: ExamClass[];
  affectedBoards: BoardId[];
  affectedBoardNames: string[];
  session: string;
  subject?: string;
  issuingAuthority: string;
  originalDate?: string;
  lastVerifiedDate: string;
  sourceUrl: string;
  sourceName: string;
  sources: BoardWatchSourceLink[];
  sourceType: "official_board" | "pbcc_government" | "ibcc_federal" | "news_outlet" | "historical_archive";
  whatItMeans: string;
  keyFacts?: string[];
  gradeBreakdown?: BoardWatchGradeDetail[];
  limitationNote?: string;
  evidenceNotes: string;
  actionRequired?: string;
  isDeadline?: boolean;
  deadlineDate?: string;
  tags: string[];
  rumorDebunk?: {
    circulatingClaim: string;
    missingEvidence: string;
    verifiedFact: string;
    officialAdvice: string;
  };
}

export interface ExpectedTimelineStage {
  id: string;
  phase: string;
  targetGroup: string;
  expectedWindow: string;
  baselineYears: string;
  description: string;
  status: "active" | "upcoming" | "planning-estimate" | "concluded";
  studentAction: string;
  officialSourceToCheck: string;
}

export interface SubjectPattern {
  id: string;
  grade: ExamClass;
  subject: string;
  notificationRef: string;
  totalTheoryMarks: number;
  objectiveMarks: number;
  mcqCount: string;
  subjectiveMarks: number;
  practicalMarks: string;
  passingRequirement: string;
  totalDuration: string;
  objectiveDuration: string;
  subjectiveDuration: string;
  questionDistribution: string[];
  attemptRules: string;
  internalChoices: string;
  pairingScheme: string[];
  modelPaperAvailable: string;
  deletedContent: string;
  paperSetterInstructions: string;
  officialModelPaperUrl: string;
}

export const BOARD_WATCH_TOPIC_FILTERS: { id: BoardWatchTopic | "all"; label: string }[] = [
  { id: "all", label: "Latest Updates" },
  { id: "matric-2027", label: "Matric 2027" },
  { id: "inter-2027", label: "Intermediate 2027" },
  { id: "historical-2026", label: "2026 Exam Updates (Historical)" },
  { id: "paper-patterns", label: "Paper Patterns & Pairing Schemes" },
  { id: "smart-syllabus", label: "Smart Syllabus / ALP" },
  { id: "passing-grading", label: "Passing Marks & Grading" },
  { id: "admissions", label: "Admissions & Registration" },
  { id: "practical-exams", label: "Practical Exams" },
  { id: "e-sheets", label: "E-Sheets & On-Screen Marking" },
  { id: "policies-reforms", label: "Board Policies & Reforms" },
  { id: "fbise", label: "FBISE Updates" },
];

// ---------------------------------------------------------------------------
// 9 PUNJAB BOARDS DIRECTORY + PBCC + FBISE REFERENCE
// ---------------------------------------------------------------------------
export const PUNJAB_BOARDS: BoardInfo[] = [
  {
    id: "lahore",
    name: "Board of Intermediate & Secondary Education, Lahore",
    shortName: "BISE Lahore",
    urduName: "بورڈ آف انٹرمیڈیٹ اینڈ سیکنڈری ایجوکیشن، لاہور",
    website: "https://www.biselahore.com",
    notificationsUrl: "https://www.biselahore.com/notifications",
    admissionPortalUrl: "https://www.biselahore.com/notifications",
    portalObservation:
      "Verified 18 Nov 2026: Official portal hosts Computer Science (OSM) Answer Book PDF, Student & Teacher On-Screen Marking video tutorial (via biselahore.com/#osm / YouTube @Lahore-Board-Official), and 9th Private Registration Schedule 1st Annual 2027.",
    headquarters: "86-Mozang Road, Lahore",
    districts: ["Lahore", "Kasur", "Sheikhupura", "Nankana Sahib"],
    helpline: "+92 42 99200192-97",
    code: "LHR",
    jurisdictionSummary: "Lahore Division (Lahore, Kasur, Sheikhupura, Nankana Sahib)",
  },
  {
    id: "rawalpindi",
    name: "Board of Intermediate & Secondary Education, Rawalpindi",
    shortName: "BISE Rawalpindi",
    urduName: "بورڈ آف انٹرمیڈیٹ اینڈ سیکنڈری ایجوکیشن، راولپنڈی",
    website: "https://biserawalpindi.edu.pk",
    notificationsUrl: "https://biserawalpindi.edu.pk",
    admissionPortalUrl: "https://eservices.biserawalpindi.edu.pk",
    headquarters: "Morgah, Near Attock Oil Refinery, Rawalpindi",
    districts: ["Rawalpindi", "Attock", "Chakwal", "Jhelum", "Murree", "Talagang"],
    helpline: "+92 51 5450915",
    code: "RWP",
    jurisdictionSummary: "Rawalpindi Division (Rawalpindi, Attock, Chakwal, Jhelum, Murree, Talagang)",
  },
  {
    id: "multan",
    name: "Board of Intermediate & Secondary Education, Multan",
    shortName: "BISE Multan",
    urduName: "بورڈ آف انٹرمیڈیٹ اینڈ سیکنڈری ایجوکیشن، ملتان",
    website: "https://web.bisemultan.edu.pk",
    notificationsUrl: "https://web.bisemultan.edu.pk/admission-matric/",
    admissionPortalUrl: "https://student.bisemultan.edu.pk/",
    portalObservation:
      'Verified 18 Nov 2026: Events Gallery confirms 17 Nov 2026 all-board Pakistan Post Foundation OSM visit & HSSC 2nd Annual 2026 CS E-Sheet mandate (with specimen & instructional video). Private admission portal earlier displayed "No Active Schedule Available !" on 15 Nov 2026.',
    headquarters: "Gol Bagh, Gulgasht Colony, Multan",
    districts: ["Multan", "Khanewal", "Vehari", "Lodhran"],
    helpline: "+92 61 9210125",
    code: "MTN",
    jurisdictionSummary: "Multan Division (Multan, Khanewal, Vehari, Lodhran)",
  },
  {
    id: "faisalabad",
    name: "Board of Intermediate & Secondary Education, Faisalabad",
    shortName: "BISE Faisalabad",
    urduName: "بورڈ آف انٹرمیڈیٹ اینڈ سیکنڈری ایجوکیشن، فیصل آباد",
    website: "https://www.bisefsd.edu.pk",
    notificationsUrl: "https://www.bisefsd.edu.pk",
    admissionPortalUrl: "https://www.bisefsd.edu.pk",
    headquarters: "Jhang Road, Faisalabad",
    districts: ["Faisalabad", "Jhang", "Toba Tek Singh", "Chiniot"],
    helpline: "+92 41 9330366",
    code: "FSD",
    jurisdictionSummary: "Faisalabad Division (Faisalabad, Jhang, Toba Tek Singh, Chiniot)",
  },
  {
    id: "gujranwala",
    name: "Board of Intermediate & Secondary Education, Gujranwala",
    shortName: "BISE Gujranwala",
    urduName: "بورڈ آف انٹرمیڈیٹ اینڈ سیکنڈری ایجوکیشن، گوجرانوالہ",
    website: "https://www.bisegrw.edu.pk",
    notificationsUrl: "https://www.bisegrw.edu.pk",
    admissionPortalUrl: "https://www.bisegrw.edu.pk",
    headquarters: "Faisal Town, Gujranwala",
    districts: ["Gujranwala", "Gujrat", "Mandi Bahauddin", "Hafizabad", "Narowal", "Sialkot"],
    helpline: "+92 55 9200752",
    code: "GRW",
    jurisdictionSummary: "Gujranwala & Gujrat Divisions (Gujranwala, Sialkot, Gujrat, Hafizabad, Narowal, Mandi Bahauddin)",
  },
  {
    id: "sargodha",
    name: "Board of Intermediate & Secondary Education, Sargodha",
    shortName: "BISE Sargodha",
    urduName: "بورڈ آف انٹرمیڈیٹ اینڈ سیکنڈری ایجوکیشن، سرگودھا",
    website: "https://www.bisesargodha.edu.pk",
    notificationsUrl: "https://www.bisesargodha.edu.pk",
    admissionPortalUrl: "https://www.bisesargodha.edu.pk",
    headquarters: "Near 49-Tail, Defence View, Sargodha",
    districts: ["Sargodha", "Khushab", "Mianwali", "Bhakkar"],
    helpline: "+92 48 3250041",
    code: "SGD",
    jurisdictionSummary: "Sargodha Division (Sargodha, Khushab, Mianwali, Bhakkar)",
  },
  {
    id: "bahawalpur",
    name: "Board of Intermediate & Secondary Education, Bahawalpur",
    shortName: "BISE Bahawalpur",
    urduName: "بورڈ آف انٹرمیڈیٹ اینڈ سیکنڈری ایجوکیشن، بہاولپور",
    website: "https://www.bisebwp.edu.pk",
    notificationsUrl: "https://www.bisebwp.edu.pk",
    admissionPortalUrl: "https://www.bisebwp.edu.pk",
    headquarters: "Cheema Town, Bahawalpur",
    districts: ["Bahawalpur", "Bahawalnagar", "Rahim Yar Khan"],
    helpline: "+92 62 9255280",
    code: "BWP",
    jurisdictionSummary: "Bahawalpur Division (Bahawalpur, Bahawalnagar, Rahim Yar Khan)",
  },
  {
    id: "dgkhan",
    name: "Board of Intermediate & Secondary Education, Dera Ghazi Khan",
    shortName: "BISE D.G. Khan",
    urduName: "بورڈ آف انٹرمیڈیٹ اینڈ سیکنڈری ایجوکیشن، ڈیرہ غازی خان",
    website: "https://www.bisedgkhan.edu.pk",
    notificationsUrl: "https://www.bisedgkhan.edu.pk",
    admissionPortalUrl: "https://www.bisedgkhan.edu.pk",
    portalObservation:
      "Verified 18 Nov 2026: Hosts official 16-point Student SOPs PDF, Centre Superintendent AMS SOPs, and OSM video/brochure for 2nd Annual 2026 Computer Science.",
    headquarters: "Board Complex, Airport Road, D.G. Khan",
    districts: ["Dera Ghazi Khan", "Muzaffargarh", "Layyah", "Rajanpur", "Kot Addu", "Taunsa"],
    helpline: "+92 64 2460114",
    code: "DGK",
    jurisdictionSummary: "D.G. Khan Division (D.G. Khan, Muzaffargarh, Layyah, Rajanpur, Kot Addu, Taunsa)",
  },
  {
    id: "sahiwal",
    name: "Board of Intermediate & Secondary Education, Sahiwal",
    shortName: "BISE Sahiwal",
    urduName: "بورڈ آف انٹرمیڈیٹ اینڈ سیکنڈری ایجوکیشن، ساہیوال",
    website: "https://bisesahiwal.edu.pk",
    notificationsUrl: "https://bisesahiwal.edu.pk",
    admissionPortalUrl: "https://bisesahiwal.edu.pk",
    headquarters: "Farid Town, Sahiwal",
    districts: ["Sahiwal", "Okara", "Pakpattan"],
    helpline: "+92 40 9200100",
    code: "SWL",
    jurisdictionSummary: "Sahiwal Division (Sahiwal, Okara, Pakpattan)",
  },
];

export const PBCC_INFO = {
  name: "Punjab Boards Committee of Chairpersons (PBCC)",
  urduName: "پنجاب بورڈز کمیٹی آف چیئرمین",
  website: "https://pbcc.edu.pk",
  role: "Coordinating body for all nine Boards of Intermediate & Secondary Education in Punjab. Standardizes academic calendars, datesheets, admission schedules, grading frameworks, and exam rules across Punjab.",
  office: "Hosted at BISE Lahore, 86-Mozang Road, Lahore",
};

export const FBISE_PORTAL_INFO = {
  name: "Federal Board of Intermediate & Secondary Education (FBISE)",
  website: "https://www.fbise.edu.pk/",
  modelPapersUrl: "https://www.fbise.edu.pk/curriculum_model_paper.php",
  allPapersUrl: "https://www.fbise.edu.pk/allpaper.php",
  eSheetsUrl: "https://www.fbise.edu.pk/screen_marking.php",
  scopeNote:
    "Separate federal examination authority. FBISE policies, SLO papers, and E-Sheet templates apply to FBISE-affiliated institutions only—not Punjab provincial BISE boards unless separately adopted.",
};

// ---------------------------------------------------------------------------
// 2027 EXAMINATION TIMELINE (CONFIRMED MATRIC CLASS 10 DATES + AWAITING STAGES)
// ---------------------------------------------------------------------------
export const EXPECTED_TIMELINE_2027: ExpectedTimelineStage[] = [
  {
    id: "stage-1-admissions",
    phase: "Matric 2027 Admission & Registration Windows (Confirmed Schedule)",
    targetGroup: "SSC Part-II (Class 10) • Punjab BISEs",
    expectedWindow: "10 Nov 2026 – 11 Jan 2027",
    baselineYears: "PBCC Notification dated 10 November 2026",
    description:
      "PBCC fee schedule for Matric Annual 2027: Single fee (10 November – 11 December 2026), Double fee (12 – 28 December 2026), Triple fee (29 December 2026 – 11 January 2027). Portal activation varies by board (e.g., BISE Multan private portal showed 'No Active Schedule Available !' on 15 Nov 2026).",
    status: "active",
    studentAction:
      "Regular students submit via schools; private students check their district BISE portal directly and complete single-fee forms before 11 December 2026.",
    officialSourceToCheck: "Respective Punjab BISE Online Admission Portal",
  },
  {
    id: "stage-2-datesheets",
    phase: "Subject-Wise 2027 Date Sheets (Awaiting Release)",
    targetGroup: "Matric (Class 9 & 10) & Inter (Class 11 & 12)",
    expectedWindow: "Awaiting Official Board Release",
    baselineYears: "PBCC / BISE Official Date Sheet Gazettes",
    description:
      "Subject-by-subject theory and practical date sheets are published separately by PBCC and the nine Punjab BISEs closer to exam commencement.",
    status: "planning-estimate",
    studentAction:
      "Wait for the signed PDF on your own board domain. Ignore viral date sheets on social media.",
    officialSourceToCheck: "PBCC & Individual Punjab BISE Notification Pages",
  },
  {
    id: "stage-3-matric-class10-exam",
    phase: "SSC Part-II (Class 10) First Annual Exam 2027 (Reported / Indicated Start)",
    targetGroup: "Class 10 (SSC Part-II) across 9 Punjab BISEs",
    expectedWindow: "Reported: 16 March 2027 (Final Date Sheet Awaited)",
    baselineYears:
      "Indicated in Dunya News & ProPakistani (14 Nov 2026) reports citing 10 Nov 2026 PBCC meeting",
    description:
      "National news coverage (Dunya News & ProPakistani) reports 16 March 2027 as the indicated commencement date for Class 10 First Annual Examination 2027 across Punjab's nine boards under PECTAA ALP No. 1257 and IBCC's 40% passing framework. A finalized subject-wise date sheet and direct signed PBCC circular remain awaited.",
    status: "upcoming",
    studentAction:
      "Align preparation with PECTAA Grade 10 ALP (No. 1257) targeting at least 40% marks per subject, and wait for your BISE's finalized signed date sheet before locking paper-by-paper dates.",
    officialSourceToCheck: "PBCC & Your Own BISE Official Date Sheet Portal + PECTAA ALP No. 1257",
  },
  {
    id: "stage-4-matric-class9-exam",
    phase: "SSC Part-I (Class 9) First Annual Exam 2027 (Awaiting Date)",
    targetGroup: "Class 9 (SSC Part-I)",
    expectedWindow: "Awaiting Official Confirmation",
    baselineYears: "Not established in Class 10 schedule coverage or signed BISE circulars",
    description:
      "No verified Class 9 (SSC Part-I) 2027 commencement date has been published yet. Students must NOT assume Class 9 starts on 16 March 2027.",
    status: "planning-estimate",
    studentAction:
      "Follow PECTAA Grade 9 ALP notifications (No. 1238 & No. 1255) and watch your board's official notifications for SSC Part-I dates.",
    officialSourceToCheck: "PBCC & Respective BISE Official Notifications",
  },
  {
    id: "stage-5-inter-2027",
    phase: "Intermediate (Class 11 & 12) Annual 2027 Exams & Admissions (Awaiting)",
    targetGroup: "Class 11 & Class 12 (HSSC Parts I & II)",
    expectedWindow: "Awaiting Official 2027 HSSC Schedule",
    baselineYears: "PECTAA 2026–27 ALP No. 1239 / No. 1258 issued; exam dates pending",
    description:
      "PECTAA has issued the 2026–27 paper patterns and ALP documents for Grades 11 and 12, but official 2027 HSSC exam start dates and admission form fee windows await PBCC announcement.",
    status: "planning-estimate",
    studentAction:
      "Do NOT assume the historical 20 May 2026 date applies to 2027. Prepare using Grade 11 (No. 1239) & Grade 12 (No. 1258) ALPs.",
    officialSourceToCheck: "PBCC, PECTAA & Respective Punjab BISE Portals",
  },
  {
    id: "stage-6-matric-result-2027",
    phase: "Class 10 Annual Exam 2027 Result Declaration (Reported Date)",
    targetGroup: "SSC Part-II (Class 10)",
    expectedWindow: "Reported: 20 July 2027",
    baselineYears: "Indicated in 14 Nov 2026 Dunya News & ProPakistani coverage",
    description:
      "News reports citing the November 2026 PBCC schedule indicate 20 July 2027 as the expected result declaration date for SSC Part-II (Class 10) First Annual Examination 2027; verify on official BISE result portals after exams.",
    status: "upcoming",
    studentAction:
      "Check your board's official result notification and result portal closer to July 2027 using your roll number.",
    officialSourceToCheck: "Official Punjab BISE Result Portals",
  },
];

// ---------------------------------------------------------------------------
// BOARD WATCH ENTRIES (MEGA REFRESH AS OF 15 NOVEMBER 2026)
// Ordered cleanly by current relevance & publication recency.
// ---------------------------------------------------------------------------
export const INITIAL_BOARD_WATCH_ENTRIES: BoardWatchEntry[] = [
  // =========================================================================
  // FEATURED REFORM — E-SHEETS & ON-SCREEN MARKING (VERIFIED 18 NOV 2026)
  // =========================================================================
  {
    id: "punjab-boards-pakistan-post-foundation-osm-visit-2026",
    headline:
      "Punjab Boards Chairmen & IT Teams Visit Pakistan Post Foundation Islamabad for 2027 OSM Readiness",
    summary:
      "Published by BISE Multan on 17 November 2026: Chairpersons and IT teams from all Punjab BISEs visited the Pakistan Post Foundation in Islamabad to inspect printing presses, answer-sheet printing workflows, scanning mechanisms, and On-Screen Marking (OSM) operations ahead of Annual Examinations 2027.",
    category: "confirmed",
    status: "officially-confirmed",
    statusDisplayLabel: "CONFIRMED",
    topics: ["e-sheets", "policies-reforms", "matric-2027", "inter-2027"],
    isHistorical: false,
    affectedClasses: ["9th", "10th", "11th", "12th"],
    affectedBoards: ["all", "multan"],
    affectedBoardNames: [
      "All 9 Punjab BISEs (Official Board Update — Implementation Preparation)",
    ],
    session: "Implementation Preparation for Annual 2027",
    issuingAuthority: "BISE Multan Official Events Gallery (Reporting All-Punjab BISEs Visit)",
    originalDate: "17 November 2026",
    lastVerifiedDate: "18 November 2026",
    sourceUrl: "https://web.bisemultan.edu.pk/events-gallery/",
    sourceName: "BISE Multan Official Portal — Events Gallery (17 Nov 2026)",
    sources: [
      {
        label: "Official Update: BISE Multan Events Gallery (17 Nov 2026)",
        url: "https://web.bisemultan.edu.pk/events-gallery/",
        sourceKind: "official",
      },
    ],
    sourceType: "official_board",
    keyFacts: [
      "Official Board Update / Implementation Preparation published 17 November 2026 on web.bisemultan.edu.pk/events-gallery/.",
      "Participants included Chairmen and IT teams representing all Punjab Boards of Intermediate and Secondary Education (BISEs).",
      "Inspected Pakistan Post Foundation, Islamabad printing press facilities, answer-sheet printing processes, and scanning mechanisms.",
      "Received a detailed operational briefing from Pakistan Post Foundation on answer-sheet marking and On-Screen Marking (OSM) execution.",
      "Stated goal: Preparing for effective, systematic, and uniform OSM implementation across Punjab boards for Annual Examinations 2027.",
    ],
    limitationNote:
      "Important boundary: This operational visit confirms multi-board technical and printing preparation for 2027—it does NOT confirm that every class or every subject in 2027 will use E-Sheets. Wait for official board circulars naming specific 2027 subjects.",
    whatItMeans:
      "All nine Punjab boards are actively aligning printing and scanning logistics for 2027 On-Screen Marking. Science and Computer Science students should practice writing cleanly inside boxed E-Sheet templates while awaiting formal subject circulars.",
    evidenceNotes:
      "Direct extraction of verbatim 17 November 2026 announcement from https://web.bisemultan.edu.pk/events-gallery/ on 18 November 2026.",
    actionRequired:
      "Open the 'E-Sheet Guide (Punjab & FBISE)' tab to inspect the full chronological timeline and SOPs.",
    tags: [
      "Pakistan Post Foundation",
      "17 Nov 2026",
      "Implementation Preparation",
      "E-Sheet",
      "On-Screen Marking",
      "BISE Multan",
      "Annual 2027",
    ],
  },
  {
    id: "bise-multan-hssc-2nd-annual-2026-cs-esheet-osm",
    headline:
      "BISE Multan Requires E-Sheets & OSM for HSSC Second Annual 2026 Computer Science (Part I & II)",
    summary:
      "BISE Multan-specific requirement: Official notices on BISE Multan's portal direct all HSSC Second Annual 2026 Computer Science Part-I and Part-II candidates to solve their papers on E-Sheets checked through On-Screen Marking (OSM), supported by an official specimen sheet, instructional video, and centre technical staff.",
    category: "confirmed",
    status: "officially-confirmed",
    statusDisplayLabel: "CONFIRMED",
    topics: ["e-sheets", "policies-reforms"],
    isHistorical: false,
    affectedClasses: ["11th", "12th"],
    affectedBoards: ["multan"],
    affectedBoardNames: ["BISE Multan ONLY (Board-Specific Implementation)"],
    session: "HSSC Second Annual 2026",
    subject: "Computer Science (Part-I & Part-II)",
    issuingAuthority: "Board of Intermediate & Secondary Education (BISE), Multan",
    originalDate: "November 2026 (HSSC 2nd Annual 2026)",
    lastVerifiedDate: "18 November 2026",
    sourceUrl:
      "https://web.bisemultan.edu.pk/specimen-of-answer-sheet-for-computer-science-2nd-annual-2026/",
    sourceName: "BISE Multan Official Website & Events Gallery",
    sources: [
      {
        label: "BISE Multan Official Portal: Computer Science Answer Sheet Specimen Page (HSSC 2nd Annual 2026)",
        url: "https://web.bisemultan.edu.pk/specimen-of-answer-sheet-for-computer-science-2nd-annual-2026/",
        sourceKind: "official",
      },
      {
        label: "BISE Multan Official Events Gallery: HSSC 2nd Annual 2026 CS E-Sheet & Technical Staff Notice",
        url: "https://web.bisemultan.edu.pk/events-gallery/",
        sourceKind: "official",
      },
      {
        label: "BISE Multan Video Reel (Social Media / Embedded on Events Gallery): How to Solve CS E-Sheet (HSSC 2nd Annual 2026)",
        url: "https://www.facebook.com/reel/2381170735983275/",
        sourceKind: "reproduced-copy",
      },
      {
        label: "BISE Multan Specimen File (Direct Google Drive Link on Official Specimen Page): CS E-Sheet Specimen (2nd Annual 2026)",
        url: "https://drive.google.com/file/d/1q3w9roZ5nm2JqqIuKpNSYtfVw3JBAHWr/view?usp=sharing",
        sourceKind: "reproduced-copy",
      },
    ],
    sourceType: "official_board",
    keyFacts: [
      "Board & Exam Scope: BISE Multan ONLY — HSSC Second Annual Examination 2026.",
      "Classes & Subject: Intermediate Part-I (11th) & Part-II (12th) Computer Science candidates.",
      "Requirement: All candidates solve their papers on printed E-Sheets evaluated via the On-Screen Marking (OSM) system.",
      "Candidate Support: Official answer sheet specimen uploaded on BISE Multan website, paired with BISE Multan's instructional Facebook reel (embedded on its Events Gallery) and trained technical staff stationed at Computer Science exam centres.",
    ],
    limitationNote:
      "Board-specific notice: This applies specifically to BISE Multan HSSC Second Annual 2026 Computer Science—do NOT generalize this requirement to other boards, subjects, or examination sessions.",
    whatItMeans:
      "BISE Multan Intermediate Computer Science (2nd Annual 2026) candidates must review the Multan specimen booklet and instructional video before entering the hall so answers fit designated scanned spaces.",
    evidenceNotes:
      "Verified verbatim from https://web.bisemultan.edu.pk/events-gallery/ and https://web.bisemultan.edu.pk/specimen-of-answer-sheet-for-computer-science-2nd-annual-2026/ on 18 November 2026.",
    tags: [
      "BISE Multan Only",
      "Computer Science",
      "HSSC 2nd Annual 2026",
      "Part-I & Part-II",
      "E-Sheet",
      "OSM",
    ],
  },
  {
    id: "punjab-boards-esheet-onscreen-marking-2027",
    headline: "Punjab Boards Move Towards E-Sheet Examinations and On-Screen Marking",
    summary:
      "At a Lahore meeting chaired by BISE Lahore Chairman Prof. Badrul Salam (reported 11 Nov 2026), chairpersons of Punjab's nine boards agreed in principle to introduce E-Sheets and On-Screen Marking (OSM) for four science subjects in 2027 Matric and Intermediate exams (official subject circulars awaited). Separately, BISE Lahore, D.G. Khan, Multan, and Gujranwala have published board-specific Computer Science OSM resources for 2026.",
    category: "reported",
    status: "credibly-reported",
    statusDisplayLabel: "REPORTED",
    topics: ["e-sheets", "policies-reforms", "matric-2027", "inter-2027"],
    isHistorical: false,
    affectedClasses: ["9th", "10th", "11th", "12th"],
    affectedBoards: ["all", "lahore", "dgkhan", "multan", "gujranwala"],
    affectedBoardNames: [
      "All 9 Punjab BISEs (2027 4-Subject Plan Reported; CS 2026 Resources Board-Specific)",
    ],
    session: "2nd Annual 2026 Pilots & Reported 2027 Expansion",
    issuingAuthority:
      "Chairpersons Committee of 9 Punjab BISEs (Lahore Meeting Reported 11 Nov 2026) & Individual BISE Portals",
    originalDate: "4 Oct – 11 Nov 2026 (Audited 18 Nov 2026)",
    lastVerifiedDate: "18 November 2026",
    sourceUrl: "https://bisedgkhan.edu.pk/Pdf/6aeeb863dc094_BISEPunjab-InstructionsforStudentsDGKhan1.pdf",
    sourceName: "BISE D.G. Khan, BISE Lahore & BISE Multan Portals + EduVision, ProPakistani & Tribune",
    sources: [
      {
        label: "BISE D.G. Khan Official PDF: 16 Candidate SOPs for Digital Answer Copy (OSM, Board-Specific)",
        url: "https://bisedgkhan.edu.pk/Pdf/6aeeb863dc094_BISEPunjab-InstructionsforStudentsDGKhan1.pdf",
        sourceKind: "official",
      },
      {
        label: "BISE Lahore Official Website: Announcements, Complete CS Answer Book PDF & OSM Section (BISE Lahore Only)",
        url: "https://www.biselahore.com/",
        sourceKind: "official",
      },
      {
        label: "BISE Lahore Official PDF: Complete Answer Book & Bubble Sheet Pattern for Computer Science (OSM, BISE Lahore Only)",
        url: "https://data.biselahore.com/dt/downloads/notifications/misc/AnswerBook_CSc.pdf",
        sourceKind: "official",
      },
      {
        label: "BISE Lahore YouTube Tutorial (@Lahore-Board-Official, Embedded on biselahore.com): On-Screen Marking Student & Teacher Guide",
        url: "https://www.youtube.com/watch?v=Eea8ivG9_Tg",
        sourceKind: "reproduced-copy",
      },
      {
        label: "BISE Multan Official Portal: Computer Science Answer Sheet Specimen (HSSC 2nd Annual 2026, BISE Multan Only)",
        url: "https://web.bisemultan.edu.pk/specimen-of-answer-sheet-for-computer-science-2nd-annual-2026/",
        sourceKind: "official",
      },
      {
        label: "EduVision (News Report, 11 Nov 2026): Punjab Boards On-Screen Marking for Matric & Inter",
        url: "https://www.eduvision.edu.pk/edu_news/punjab-boards-to-introduce-on-screen-marking-for-matric-and-intermediate-exams-news-4586",
        sourceKind: "news",
      },
      {
        label: "ProPakistani (News Report, 11 Nov 2026): Punjab to Conduct Exams for 4 Subjects on E-Sheets",
        url: "https://propakistani.pk/2026/11/11/punjab-to-conduct-exams-for-4-subjects-on-e-sheets/",
        sourceKind: "news",
      },
      {
        label: "The Express Tribune (News Report, 4 Oct 2026): Punjab Boards to Take Paper Checking Online",
        url: "https://tribune.com.pk/story/2632845/punjab-boards-to-take-paper-checking-online",
        sourceKind: "news",
      },
    ],
    sourceType: "pbcc_government",
    keyFacts: [
      "BOARD-SPECIFIC RESOURCES (2nd Annual 2026): BISE D.G. Khan issued a 16-point Candidate SOP PDF; BISE Lahore published 'Complete Answer Book and Bubble Sheet Pattern for Computer Science (OSM)' plus an On-Screen Marking System student & teacher video tutorial on biselahore.com; BISE Multan mandated E-Sheets/OSM for HSSC 2nd Annual 2026 Computer Science Part-I & II; BISE Gujranwala hosted CS specimen templates.",
      "BISE D.G. KHAN SOP PDF RULES (Attributable to BISE D.G. Khan PDF): Pen-and-paper hall exams; use only blue or black ink pen (no red/green ink, highlighters, markers, or smudging gel pens); write strictly inside margins & designated question boxes; zero extra continuation sheets; no whitener/erasable ink; protect sheet barcodes & QR codes.",
      "REPORTED (11 Nov 2026 Chairpersons Meeting): Media reports state all 9 Punjab BISE chairpersons under Prof. Badrul Salam agreed to introduce E-Sheets and OSM for four science subjects in 2027 Matric and Intermediate exams.",
      "AWAITING OFFICIAL CONFIRMATION: Signed provincial circulars naming the exact four SSC (Classes 9–10) and HSSC (Classes 11–12) subjects have NOT been issued across all 9 BISEs as of 18 November 2026.",
    ],
    limitationNote:
      "Do NOT treat secondary blog guesses naming the four 2027 science subjects as confirmed rules, and do NOT treat BISE Lahore's, D.G. Khan's, or Multan's board-specific Computer Science instructions as universal rules for every board or every subject. Keep FBISE rules strictly separate.",
    whatItMeans:
      "E-Sheet exams are NOT computer-based typing tests—you still write by hand with a pen, but every answer must stay cleanly inside its designated box and margins without extra B-sheets. Open the dedicated 'E-Sheet Guide (Punjab & FBISE)' tab above for the full visual walkthrough.",
    evidenceNotes:
      "Primary PDFs downloaded & verified from bisedgkhan.edu.pk, biselahore.com, and web.bisemultan.edu.pk alongside 11 Nov & 4 Oct 2026 national reporting (audited 18 November 2026).",
    actionRequired:
      "Switch to the E-Sheet Guide tab for Step-by-Step Instructions, Stationery Rules & Mark-Loss Prevention.",
    tags: [
      "E-Sheet",
      "On-Screen Marking",
      "OSM",
      "4 Science Subjects",
      "BISE Lahore",
      "BISE D.G. Khan",
      "BISE Multan",
      "Candidate SOPs",
      "2027 Reforms",
    ],
  },

  // =========================================================================
  // PART 1 — 2027 MATRIC EXAMINATION SCHEDULE
  // =========================================================================
  {
    id: "punjab-matric-annual-2027-schedule",
    headline: "Punjab Matric Annual Examination 2027 — Reported Start Date (16 March 2027 Indicated)",
    summary:
      "National news coverage (Dunya News & ProPakistani, 14 Nov 2026) citing a 10 November 2026 PBCC schedule indicates Class 10 (SSC Part-II) First Annual exams are expected to start on 16 March 2027, with results indicated for 20 July 2027 and registration from 10 November 2026 to 11 January 2027. A finalized subject-wise date sheet / official PBCC circular PDF is still awaited.",
    category: "reported",
    status: "credibly-reported",
    statusDisplayLabel: "REPORTED",
    topics: ["matric-2027", "admissions"],
    isHistorical: false,
    affectedClasses: ["10th"],
    affectedBoards: ["all"],
    affectedBoardNames: ["All 9 Punjab BISE Boards (Reported Timeline; Final Date Sheet Awaited)"],
    session: "Annual 2027",
    issuingAuthority: "Reported via National Media (Citing PBCC 10 Nov 2026 Schedule)",
    originalDate: "Reported 14 Nov 2026 (Citing 10 Nov 2026 PBCC Meeting)",
    lastVerifiedDate: "18 November 2026",
    sourceUrl: "https://dunyanews.tv/en/Pakistan/982883-punjab-announces-schedule-for-2027-matric-annual-examinations",
    sourceName: "Dunya News & ProPakistani (News Reports Citing PBCC 10 Nov 2026)",
    sources: [
      {
        label: "Dunya News (News Report, 14 Nov 2026): Indicated Schedule for 2027 Matric Annual Examinations",
        url: "https://dunyanews.tv/en/Pakistan/982883-punjab-announces-schedule-for-2027-matric-annual-examinations",
        sourceKind: "news",
      },
      {
        label: "ProPakistani (News Report, 14 Nov 2026): Reported Matric Exams 2027 Registration Schedule",
        url: "https://propakistani.pk/2026/11/14/punjab-announces-matric-exams-2027-registration-schedule/",
        sourceKind: "news",
      },
      {
        label: "ProPakistani (News Report, 14 Nov 2026): Reported Matric Exams 2027 Result Date",
        url: "https://propakistani.pk/2026/11/14/punjab-announces-matric-exams-2027-result-date/",
        sourceKind: "news",
      },
    ],
    sourceType: "news_outlet",
    keyFacts: [
      "Cited PBCC meeting / schedule date in press reports: 10 November 2026.",
      "Reported / indicated Class 10 (SSC Part-II) First Annual exam start: 16 March 2027 (not yet a finalized subject-wise date sheet).",
      "Reported / indicated Class 10 result declaration date: 20 July 2027.",
      "Reported admission fee windows (also supported by board-level notices like BISE Lahore's 9th private schedule): Single 10 Nov – 11 Dec 2026, Double 12 – 28 Dec 2026, Triple 29 Dec 2026 – 11 Jan 2027.",
      "Scope covers all 9 Punjab BISE boards once formally gazetted on each BISE website.",
    ],
    limitationNote:
      "Date verification boundary: 16 March 2027 is retained here strictly as a REPORTED / INDICATED start date based on news coverage (Dunya News & ProPakistani)—NOT as a finalized date sheet or verified PBCC PDF circular. Also do NOT apply 16 March 2027 to Class 9.",
    whatItMeans:
      "Class 10 students can use 16 March 2027 as an indicative planning target for Matric 2027 revision while verifying finalized subject dates directly on their own official BISE date sheet portal when published.",
    evidenceNotes:
      "Sourced from Dunya News and ProPakistani 14 Nov 2026 reports citing PBCC; direct signed PBCC gazette/PDF establishing 16 March 2027 is not yet posted across PBCC/BISE portals as of 18 Nov 2026.",
    actionRequired: "Verify final paper-by-paper dates on your district BISE portal once official 2027 date sheets are released.",
    isDeadline: true,
    deadlineDate: "Single Fee Ends 11 Dec 2026",
    tags: ["Matric 2027", "Class 10", "16 March 2027 (Reported)", "20 July 2027", "Admissions"],
  },
  {
    id: "class-9-matric-exam-2027-awaited",
    headline: "Class 9 Matric Exam Date 2027 — Awaiting Official Schedule",
    summary:
      "PBCC's 10 November 2026 announcement specifies 16 March 2027 for SSC Part-II (Class 10). As of 15 November 2026, no province-wide official start date for Class 9 (SSC Part-I) Annual Exam 2027 has been confirmed.",
    category: "awaiting",
    status: "awaiting-confirmation",
    statusDisplayLabel: "AWAITING OFFICIAL CONFIRMATION",
    topics: ["matric-2027"],
    isHistorical: false,
    affectedClasses: ["9th"],
    affectedBoards: ["all"],
    affectedBoardNames: ["All 9 Punjab BISE Boards"],
    session: "Annual 2027",
    issuingAuthority: "PBCC / Punjab BISEs (Class 9 Date Pending)",
    originalDate: "Checked 15 Nov 2026",
    lastVerifiedDate: "15 November 2026",
    sourceUrl: "https://pbcc.edu.pk",
    sourceName: "PBCC & BISE Lahore / ProPakistani 14 Nov 2026 Coverage",
    sources: [
      {
        label: "ProPakistani: Matric 2027 Schedule (Class 10 Identified; Class 9 Date Pending)",
        url: "https://propakistani.pk/2026/11/14/punjab-announces-matric-exams-2027-registration-schedule/",
        sourceKind: "news",
      },
      {
        label: "Official Portal: PBCC",
        url: "https://pbcc.edu.pk",
        sourceKind: "official",
      },
    ],
    sourceType: "pbcc_government",
    limitationNote:
      "Do NOT treat 16 March 2027 as the Class 9 exam date. Separate board-level registration notices (such as BISE Lahore's 9th private registration schedule) do not set a province-wide Class 9 theory start date.",
    whatItMeans:
      "Class 9 students should prepare strictly according to the Grade 9 PECTAA Smart Syllabus / ALP (No. 1238 & No. 1255) and wait for an official SSC Part-I date announcement from PBCC or their district board.",
    evidenceNotes:
      "Audit of PBCC-cited Matric 2027 reports up to 15 November 2026 establishes Class 10 commencement (16 March 2027) without establishing a separate Class 9 commencement date.",
    actionRequired: "Monitor your district BISE portal for SSC Part-I (Class 9) date sheet release.",
    tags: ["Class 9", "SSC Part-I", "Matric 2027", "Awaiting Confirmation"],
  },

  // =========================================================================
  // PART 2 — 2027 INTERMEDIATE EXAMINATIONS
  // =========================================================================
  {
    id: "punjab-inter-2027-schedule-awaited",
    headline: "Punjab Intermediate Annual Examination 2027 — Schedule Awaited",
    summary:
      "Official commencement and result dates for Punjab Intermediate (Class 11 & Class 12 / HSSC) First Annual Examination 2027 have not yet been announced as of 15 November 2026.",
    category: "awaiting",
    status: "awaiting-confirmation",
    statusDisplayLabel: "AWAITING OFFICIAL CONFIRMATION",
    topics: ["inter-2027"],
    isHistorical: false,
    affectedClasses: ["11th", "12th"],
    affectedBoards: ["all"],
    affectedBoardNames: ["All 9 Punjab BISE Boards"],
    session: "Annual 2027",
    issuingAuthority: "PBCC / Punjab BISEs (2027 HSSC Schedule Pending)",
    originalDate: "Checked 15 Nov 2026",
    lastVerifiedDate: "15 November 2026",
    sourceUrl: "https://pbcc.edu.pk",
    sourceName: "PBCC & BISE Official Portals Audit",
    sources: [
      {
        label: "Official Portal: PBCC",
        url: "https://pbcc.edu.pk",
        sourceKind: "official",
      },
      {
        label: "Official Notifications: BISE Lahore",
        url: "https://www.biselahore.com/notifications",
        sourceKind: "official",
      },
    ],
    sourceType: "pbcc_government",
    limitationNote:
      "Do NOT copy the 2026 HSSC date (20 May 2026) into 2027. No official 2027 Intermediate exam commencement date exists yet.",
    whatItMeans:
      "Class 11 and 12 students have their official 2026–27 PECTAA paper patterns and ALPs available now, while waiting for PBCC to notify exact 2027 HSSC examination dates.",
    evidenceNotes:
      "Checked PBCC and major Punjab BISE notification portals on 15 November 2026; only 2026 HSSC schedules and 2027 Matric Class 10 dates were published.",
    actionRequired: "Prepare using Grade 11 (No. 1239) and Grade 12 (No. 1258) ALPs while awaiting PBCC notice.",
    tags: ["Intermediate 2027", "Class 11", "Class 12", "HSSC", "Awaiting Confirmation"],
  },
  {
    id: "punjab-inter-2027-admissions-awaited",
    headline: "Punjab Intermediate 2027 Admission Schedule — Awaiting Notification",
    summary:
      "Official HSSC Annual 2027 admission form opening, single/double/triple fee deadlines, and fee structure notifications have not yet been issued for Punjab boards as of 15 November 2026.",
    category: "awaiting",
    status: "awaiting-confirmation",
    statusDisplayLabel: "AWAITING OFFICIAL CONFIRMATION",
    topics: ["inter-2027", "admissions"],
    isHistorical: false,
    affectedClasses: ["11th", "12th"],
    affectedBoards: ["all"],
    affectedBoardNames: ["All 9 Punjab BISE Boards"],
    session: "Annual 2027",
    issuingAuthority: "PBCC / Punjab BISEs (2027 HSSC Admissions Pending)",
    originalDate: "Checked 15 Nov 2026",
    lastVerifiedDate: "15 November 2026",
    sourceUrl: "https://web.bisemultan.edu.pk/admission-inter/",
    sourceName: "Punjab BISE Admission Portals (BISE Multan & BISE Lahore Verified)",
    sources: [
      {
        label: "Official Portal: BISE Multan Inter Admissions",
        url: "https://web.bisemultan.edu.pk/admission-inter/",
        sourceKind: "official",
      },
      {
        label: "Official Portal: BISE Multan Student Portal",
        url: "https://student.bisemultan.edu.pk/",
        sourceKind: "official",
      },
    ],
    sourceType: "official_board",
    keyFacts: [
      "As of 15 Nov 2026, Matric 2027 fee dates are notified, but HSSC Annual 2027 exam admission form dates remain pending.",
      "Do not confuse earlier 2026–28 Class 11 college registration/enrollment returns with Annual 2027 board examination admission schedules.",
      "Verified 15 Nov 2026: BISE Multan admission portal displayed 'No Active Schedule Available !' for 11th Fresh and 12th / Combined.",
    ],
    whatItMeans:
      "Wait for an official board circular specifying opening dates and fee tiers for HSSC Annual 2027 exam admissions.",
    evidenceNotes:
      "Direct inspection of BISE Multan admission portal and BISE Lahore notifications on 15 November 2026.",
    actionRequired: "Watch your district BISE admissions section for the 2027 HSSC admission notification.",
    tags: ["Intermediate 2027", "Admissions", "Fee Schedule", "Awaiting Confirmation"],
  },

  // =========================================================================
  // PART 3 — COMPLETE 2027 PAPER PATTERN & PAIRING SCHEME STORIES (GRADES 9-12)
  // =========================================================================
  {
    id: "pectaa-grade-9-pattern-alp-2027",
    headline: "PECTAA Releases Grade 9 Paper Pattern and Pairing Schemes for 2027",
    summary:
      "PECTAA issued main Grade 9 notification No. 1238 (6 Nov 2026) and further notice No. 1255 (14 Nov 2026) covering 2026–27 deleted topics, pairing schemes, and model papers—including Computer Science & Entrepreneurship, General Science, and Masihi Taleem.",
    category: "confirmed",
    status: "officially-confirmed",
    statusDisplayLabel: "CONFIRMED",
    topics: ["paper-patterns", "smart-syllabus", "matric-2027", "practical-exams"],
    isHistorical: false,
    affectedClasses: ["9th"],
    affectedBoards: ["all"],
    affectedBoardNames: ["All 9 Punjab BISE Boards (PECTAA Curriculum)"],
    session: "Academic Session 2026–27 / BISE Annual 2027",
    issuingAuthority: "Punjab Education, Curriculum, Training and Assessment Authority (PECTAA)",
    originalDate: "6 Nov 2026 (No. 1238) & 14 Nov 2026 (No. 1255)",
    lastVerifiedDate: "15 November 2026",
    sourceUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-9-Notification-06.11.2026-F_Redacted.pdf",
    sourceName: "PECTAA Official PDFs (No. 1238 & No. 1255)",
    sources: [
      {
        label: "Official PDF (PECTAA): Grade 9 Main ALP Notification No. 1238 (6 Nov 2026)",
        url: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-9-Notification-06.11.2026-F_Redacted.pdf",
        sourceKind: "official",
      },
      {
        label: "Official PDF (PECTAA): Grade 9 Further ALP Notification No. 1255 (14 Nov 2026)",
        url: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-Notification-14.11.2026-1255-1.pdf",
        sourceKind: "official",
      },
      {
        label: "Official PDF (PECTAA): Grade 9 Electives (Agri, Health, Fashion, ICT)",
        url: "https://pectaa.edu.pk/wp-content/uploads/2026/01/Pairing-Scheme-List-of-Practicals-and-Model-Papers-of-Agriculture-Sciences-Health-Sciences-Fashion-Designing-ICT-Grade-9-2.pdf",
        sourceKind: "official",
      },
      {
        label: "Third-Party Informational Copy (786Times): Searchable Grade 9 ALP Summary",
        url: "https://786times.com/2026/11/pectaa-grade-9-alp-2026-27-smart-syllabus-pairing-schemes-model-papers/",
        sourceKind: "reproduced-copy",
      },
    ],
    sourceType: "pbcc_government",
    keyFacts: [
      "No. PECTAA/C&C Unit/2026/1238 (6 Nov 2026): Approved at the 13th Academics Committee meeting on 5 Nov 2026; covers core compulsory & science subjects (English, Urdu, Islamiat, Mathematics, Physics, Chemistry, Biology).",
      "No. PECTAA/C&C Unit/2026/1255 (14 Nov 2026): Adds Computer Science & Entrepreneurship (50 theory marks, 2h), General Science (50 marks, 2h), and Masihi Taleem (100 marks, 3h).",
      "Important Policy Note: PECTAA has NOT developed or notified any Smart Syllabus / ALP for Tarjama-tul-Quran and Ethics (Grades 9–12) because no topics or exercises were deleted—prepare the full syllabus.",
      "Subject marks vary widely: e.g., English/Urdu/Math = 75 marks; Physics/Chem/Bio = 60 theory; Islamiat/Masihi Taleem = 100 marks; CS/Gen Sci = 50 theory.",
    ],
    whatItMeans:
      "Inspect the exact Grade 9 subject blueprint in our 'Paper Pattern & Syllabus Watch' tab—never apply one subject's marks or excluded chapters to another.",
    evidenceNotes:
      "Verified directly against both official PECTAA PDFs (ALP-9-Notification-06.11.2026-F_Redacted.pdf and ALP-Notification-14.11.2026-1255-1.pdf).",
    tags: ["Grade 9", "PECTAA", "No. 1238", "No. 1255", "Pairing Scheme", "ALP 2026-27"],
  },
  {
    id: "pectaa-grade-10-pattern-alp-2027",
    headline: "PECTAA Releases Grade 10 Paper Pattern and Pairing Schemes for 2027",
    summary:
      "PECTAA Notification No. 1257 dated 14 November 2026 publishes complete Class 10 deleted topics, question-wise pairing schemes, combined Grade 9–10 practical schemes, and official 2027 model papers.",
    category: "confirmed",
    status: "officially-confirmed",
    statusDisplayLabel: "CONFIRMED",
    topics: ["paper-patterns", "smart-syllabus", "matric-2027", "practical-exams"],
    isHistorical: false,
    affectedClasses: ["10th"],
    affectedBoards: ["all"],
    affectedBoardNames: ["All 9 Punjab BISE Boards (PECTAA Curriculum)"],
    session: "Academic Session 2026–27 / BISE Annual 2027",
    issuingAuthority: "Punjab Education, Curriculum, Training and Assessment Authority (PECTAA)",
    originalDate: "14 November 2026 (No. 1257)",
    lastVerifiedDate: "15 November 2026",
    sourceUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1257.pdf",
    sourceName: "PECTAA Official PDF (No. 1257)",
    sources: [
      {
        label: "Official PDF (PECTAA): Grade 10 ALP, Pairing Schemes & Model Papers No. 1257",
        url: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1257.pdf",
        sourceKind: "official",
      },
    ],
    sourceType: "pbcc_government",
    keyFacts: [
      "Covers English (75), Urdu (75), Pakistan Studies (100 marks / 3 hrs), Mathematics (75), Physics (60 theory + 30 practical), Chemistry (60 theory + 30 practical), Biology (60 theory + 30 practical), CS & Entrepreneurship (50 theory + 50 practical), and General Science (50 marks / 2 hrs).",
      "Includes combined Grade 9–10 Practical Pairing Schemes and Lists of Excluded Practicals for Physics, Chemistry, Biology (30 marks, 2 hrs) and Computer Science (50 marks, 2 hrs).",
      "Math-10 & Math-9 Long Questions: Part-II attempt 2/3 (8m each) and Part-III attempt 1/2 (8m) — check PDF blueprint rather than assuming legacy Q9 compulsory theorem.",
      "Tarjama-tul-Quran & Ethics (Grades 9–12): Explicitly confirmed NO Smart Syllabus / ALP exists.",
    ],
    whatItMeans:
      "With Class 10 exams reported to begin around 16 March 2027, students should use No. 1257 subject-by-subject to verify deleted chapters, practical exclusions, and exact question distributions.",
    evidenceNotes:
      "76-page official PDF ALPs-Notification-14.11.2026-1257.pdf downloaded and extracted line-by-line.",
    tags: ["Grade 10", "PECTAA", "No. 1257", "Pairing Scheme", "Practicals", "Model Papers"],
  },
  {
    id: "pectaa-grade-11-pattern-alp-2027",
    headline: "PECTAA Releases Grade 11 Paper Pattern and Pairing Schemes for 2027",
    summary:
      "PECTAA issued main Grade 11 ALP Notification No. 1239 (6 Nov 2026) covering core Class 11 subjects, alongside separate notice No. 1256 (14 Nov 2026) exclusively for Masihi Taleem-11.",
    category: "confirmed",
    status: "officially-confirmed",
    statusDisplayLabel: "CONFIRMED",
    topics: ["paper-patterns", "smart-syllabus", "inter-2027"],
    isHistorical: false,
    affectedClasses: ["11th"],
    affectedBoards: ["all"],
    affectedBoardNames: ["All 9 Punjab BISE Boards (PECTAA Curriculum)"],
    session: "Academic Session 2026–27 / BISE Annual 2027",
    issuingAuthority: "Punjab Education, Curriculum, Training and Assessment Authority (PECTAA)",
    originalDate: "6 Nov 2026 (No. 1239) & 14 Nov 2026 (No. 1256)",
    lastVerifiedDate: "15 November 2026",
    sourceUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-Notification-Grade-11_Redacted_Redacted.pdf",
    sourceName: "PECTAA Official PDFs (No. 1239 & No. 1256)",
    sources: [
      {
        label: "Official PDF (PECTAA): Grade 11 Main ALP Notification No. 1239 (6 Nov 2026)",
        url: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-Notification-Grade-11_Redacted_Redacted.pdf",
        sourceKind: "official",
      },
      {
        label: "Official PDF (PECTAA): Grade 11 Masihi Taleem Only No. 1256 (14 Nov 2026)",
        url: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-Notification-14.11.2026-1256.pdf",
        sourceKind: "official",
      },
    ],
    sourceType: "pbcc_government",
    keyFacts: [
      "No. PECTAA/C&C Unit/2026/1239 (6 Nov 2026): Approved at the 13th Academics Committee meeting on 5 Nov 2026; covers English (100), Urdu (100), Islamiat Compulsory (50 marks / 2h), Mathematics (100), Physics (85), Chemistry (85), Biology (85), and CS & Entrepreneurship (75).",
      "No. PECTAA/C&C Unit/2026/1256 (14 Nov 2026): Concerns Masihi Taleem Grade 11 ONLY (50 marks, 2h) and does NOT supersede or replace main notification No. 1239.",
      "Physics-11, Chemistry-11, and Biology-11 theory papers are 85 marks (3h: Obj 17 MCQs in 20m + Subj 68 marks in 2h 40m).",
    ],
    whatItMeans:
      "First Year (Class 11) students must consult No. 1239 for all compulsory/elective science subjects and avoid confusing 14 Nov notice No. 1256 (Masihi Taleem only) with the main syllabus circular.",
    evidenceNotes:
      "Verified directly from official PECTAA PDFs ALP-Notification-Grade-11_Redacted_Redacted.pdf (71 pages) and ALP-Notification-14.11.2026-1256.pdf (8 pages).",
    tags: ["Grade 11", "PECTAA", "No. 1239", "No. 1256", "Intermediate 2027"],
  },
  {
    id: "pectaa-grade-12-pattern-alp-2027",
    headline: "PECTAA Releases Grade 12 Paper Pattern and Pairing Schemes for 2027",
    summary:
      "PECTAA Notification No. 1258 dated 14 November 2026 issues the 2026–27 Smart Syllabus / ALP, chapter pairing schemes, excluded Grade 11–12 practicals, and model papers for Class 12 (HSSC Part-II).",
    category: "confirmed",
    status: "officially-confirmed",
    statusDisplayLabel: "CONFIRMED",
    topics: ["paper-patterns", "smart-syllabus", "inter-2027", "practical-exams"],
    isHistorical: false,
    affectedClasses: ["12th"],
    affectedBoards: ["all"],
    affectedBoardNames: ["All 9 Punjab BISE Boards (PECTAA Curriculum)"],
    session: "Academic Session 2026–27 / BISE Annual 2027",
    issuingAuthority: "Punjab Education, Curriculum, Training and Assessment Authority (PECTAA)",
    originalDate: "14 November 2026 (No. 1258)",
    lastVerifiedDate: "15 November 2026",
    sourceUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1258-2.pdf",
    sourceName: "PECTAA Official PDF (No. 1258)",
    sources: [
      {
        label: "Official PDF (PECTAA): Grade 12 ALP, Pairing Schemes & Model Papers No. 1258",
        url: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1258-2.pdf",
        sourceKind: "official",
      },
    ],
    sourceType: "pbcc_government",
    keyFacts: [
      "Covers English-12 (100 marks / 3h), Urdu-12 (100 marks / 3h), Pakistan Studies-12 (50 marks / 2h), Mathematics-12 (100 marks / 3h), Physics-12 (85 theory / 3h), Chemistry-12 (85 theory / 3h), Biology-12 (85 theory / 3h), and CS & Entrepreneurship-12 (75 theory / 2h 30m).",
      "Includes Lists of Excluded Practicals (Grades 11 & 12) for Physics, Chemistry, Biology, and Computer Science.",
      "Practical marks distribution for Grades 11–12 is not detailed inside No. 1258—consult board practical notifications separately.",
      "Explicit note confirmed: PECTAA has not developed any Smart Syllabus / ALP for Tarjama-tul-Quran or Ethics (Grades 9–12).",
    ],
    whatItMeans:
      "Second Year (Class 12) candidates preparing for Annual 2027 enter IBCC Phase 2 (40% subject passing mark) alongside updated unit exclusions and pairing tables in No. 1258.",
    evidenceNotes:
      "65-page official PDF ALPs-Notification-14.11.2026-1258-2.pdf extracted and verified.",
    tags: ["Grade 12", "PECTAA", "No. 1258", "Pairing Scheme", "Practicals", "Intermediate 2027"],
  },
  {
    id: "punjab-model-papers-2027",
    headline: "New Subject-Wise Model Papers Available for Punjab Board 2027 Examinations",
    summary:
      "Official subject-wise model question papers for 2027 Punjab Board exams are published inside PECTAA's November 2026 ALP notifications (Grades 9–12), alongside the PECTAA Downloads Archive and BISE Lahore subject resources.",
    category: "confirmed",
    status: "officially-confirmed",
    statusDisplayLabel: "CONFIRMED",
    topics: ["paper-patterns", "smart-syllabus", "matric-2027", "inter-2027"],
    isHistorical: false,
    affectedClasses: ["9th", "10th", "11th", "12th"],
    affectedBoards: ["all", "lahore"],
    affectedBoardNames: ["All 9 Punjab BISE Boards (PECTAA) & BISE Lahore"],
    session: "Academic Session 2026–27 / BISE Annual 2027",
    issuingAuthority: "PECTAA & BISE Lahore",
    originalDate: "6 Nov – 14 Nov 2026",
    lastVerifiedDate: "15 November 2026",
    sourceUrl: "https://pectaa.edu.pk/downloads-2-2/",
    sourceName: "PECTAA Downloads Portal & Official ALP PDFs",
    sources: [
      {
        label: "Official Portal: PECTAA Downloads (All Grade ALP & Model Papers PDFs)",
        url: "https://pectaa.edu.pk/downloads-2-2/",
        sourceKind: "official",
      },
      {
        label: "Official Portal: PECTAA Model Papers",
        url: "https://pectaa.edu.pk/model-papers/",
        sourceKind: "official",
      },
      {
        label: "Official PDF (BISE Lahore): Class 10 Syllabus for Hearing Impaired Children (2026–27)",
        url: "https://data.biselahore.com/dt/downloads/Model%20Papers/Matric/Syllabus10th_HIS.pdf",
        sourceKind: "official",
      },
    ],
    sourceType: "pbcc_government",
    keyFacts: [
      "Full sample model papers are appended inside PECTAA notifications No. 1238 & 1255 (Grade 9), No. 1257 (Grade 10), No. 1239 & 1256 (Grade 11), and No. 1258 (Grade 12).",
      "Grade 9 electives (Agriculture Sciences, Health Sciences, Fashion Designing, ICT) have a separate PECTAA pairing scheme, practical list, and model papers PDF.",
      "BISE Lahore additionally hosts Syllabus10th_HIS.pdf for Hearing Impaired Children (2026–27) and the Computer Science (OSM) Answer Book & Bubble Sheet.",
    ],
    whatItMeans:
      "Always practice with official PECTAA model papers matching your exact grade notification rather than commercial guess papers.",
    evidenceNotes:
      "Confirmed model paper sections inside official PECTAA PDFs and verified downloads directory on pectaa.edu.pk.",
    tags: ["Model Papers", "PECTAA", "BISE Lahore", "Annual 2027"],
  },

  // =========================================================================
  // PART 4 — PASSING PERCENTAGE & NEW GRADING SYSTEM
  // =========================================================================
  {
    id: "ibcc-40-percent-passing-10-point-grading",
    headline: "IBCC Introduces 40% Passing Requirement Under Revised Grading Policy",
    summary:
      "IBCC raised the minimum subject passing percentage from 33% to 40% alongside a 10-point grading scale (A++ to U), rolling out across Pakistan's boards in phases: Grades 9 & 11 (2026), Grades 10 & 12 (2027), and full adoption planned by 2028.",
    category: "confirmed",
    status: "officially-confirmed",
    statusDisplayLabel: "CONFIRMED",
    topics: ["passing-grading", "policies-reforms", "matric-2027", "inter-2027", "fbise"],
    isHistorical: false,
    affectedClasses: ["9th", "10th", "11th", "12th"],
    affectedBoards: ["all", "fbise"],
    affectedBoardNames: ["All Pakistani BISEs (Including All 9 Punjab Boards & FBISE)"],
    session: "Phased Implementation: 2026 → 2027 → 2028",
    issuingAuthority: "Inter Boards Coordination Commission (IBCC)",
    originalDate: "Phased from 1st Annual 2026 (IBCC FAQ & Sep 2026 Review)",
    lastVerifiedDate: "15 November 2026",
    sourceUrl: "https://ibcc.edu.pk/faqs/new-grading-system-of-ssc-hssc-faqs/",
    sourceName: "IBCC Official Grading FAQs, Dawn & The Express Tribune",
    sources: [
      {
        label: "Official Website (IBCC): New Grading System of SSC & HSSC FAQs",
        url: "https://ibcc.edu.pk/faqs/new-grading-system-of-ssc-hssc-faqs/",
        sourceKind: "official",
      },
      {
        label: "The Express Tribune: Matric, Inter Students Will Now Need 40% Marks to Pass",
        url: "https://tribune.com.pk/story/2571144/matric-intermediate-students-will-now-need-40-marks-to-pass-exams",
        sourceKind: "news",
      },
      {
        label: "The Express Tribune (Sep 2026): New Policy Sets 40% Minimum Passing Marks",
        url: "https://tribune.com.pk/story/2627671/new-policy-sets-40-minimum-passing-marks",
        sourceKind: "news",
      },
      {
        label: "Dawn: IBCC 40% Pass & Grading Reform Coverage",
        url: "https://www.dawn.com/news/1947346",
        sourceKind: "news",
      },
    ],
    sourceType: "ibcc_federal",
    keyFacts: [
      "Subject pass mark increased from 33% to 40% in each subject (e.g., 30/75, 24/60, 40/100, 34/85, 20/50).",
      "10-point alphabetical grade scale: A++, A+, A, B++, B+, B, C+, C, D, and U (replacing old 7-point A-1 to F).",
      "Phase 1 (Annual 2026): SSC-I (Class 9) and HSSC-I (Class 11) — raw scores reported alongside grades while GPA calculation was initially deferred.",
      "Phase 2 (Annual 2027): Expands to SSC-II (Class 10) and HSSC-II (Class 12).",
      "Full nationwide adoption planned across all boards by 2028; universities may refer to grades or raw scores during 2026–27 transition.",
    ],
    whatItMeans:
      "Do NOT rely on old 33% passing rules for 2027 Matric or Intermediate exams. Every student appearing in Class 9, 10, 11, or 12 in Annual 2027 must achieve at least 40% per subject.",
    evidenceNotes:
      "Directly verified from official IBCC SSC/HSSC Grading System FAQs and corroborated by Dawn and Express Tribune reporting including the September 2026 184th IBCC Forum update.",
    tags: ["40% Passing Marks", "10-Point Grading", "IBCC", "Grades 9-12", "Annual 2027"],
  },

  // =========================================================================
  // PART 5 — IBCC 184th FORUM REFORMS (SEPTEMBER 2026, MURREE) — STORIES A TO G
  // =========================================================================
  {
    id: "ibcc-184-conceptual-assessment",
    headline: "IBCC Pushes Examination System Towards Conceptual Assessment",
    summary:
      "At its 184th Forum in Murree (September 2026), IBCC resolved to move board examinations away from rote memorization toward conceptual and analytical questions testing Student Learning Outcomes (SLOs).",
    category: "planned",
    status: "planned-initiative",
    statusDisplayLabel: "PLANNED / APPROVED INITIATIVE",
    topics: ["policies-reforms", "paper-patterns"],
    isHistorical: false,
    affectedClasses: ["9th", "10th", "11th", "12th"],
    affectedBoards: ["all", "fbise"],
    affectedBoardNames: ["All Pakistani Examination Boards (IBCC Forum)"],
    session: "Ongoing Reform Direction (2026–2028)",
    issuingAuthority: "Inter Boards Coordination Commission (IBCC — 184th Forum, Murree)",
    originalDate: "September 2026",
    lastVerifiedDate: "15 November 2026",
    sourceUrl: "https://tribune.com.pk/story/2627671/new-policy-sets-40-minimum-passing-marks",
    sourceName: "The Express Tribune & Dawn E-Paper (Sep 2026)",
    sources: [
      {
        label: "The Express Tribune: 184th IBCC Forum Conceptual & Grading Reforms",
        url: "https://tribune.com.pk/story/2627671/new-policy-sets-40-minimum-passing-marks",
        sourceKind: "news",
      },
      {
        label: "Dawn E-Paper (6 Sep 2026): IBCC Forum Proceedings",
        url: "https://epaper.dawn.com/DetailImage.php?StoryImage=06_09_2026_151_008",
        sourceKind: "news",
      },
    ],
    sourceType: "ibcc_federal",
    keyFacts: [
      "Approved policy direction at the 184th IBCC Forum in Murree (September 2026).",
      "Emphasizes conceptual understanding and critical thinking over purely rote textbook recall.",
      "Implementation pace varies by board—follow your grade's official PECTAA or FBISE model papers for exact 2027 question style.",
    ],
    whatItMeans:
      "Expect unseen phrasing of conceptual short questions and reasoning prompts even within PECTAA's notified 2027 syllabus.",
    evidenceNotes:
      "Reported from the 184th IBCC Forum (Murree) in Express Tribune and Dawn E-Paper (September 2026).",
    tags: ["IBCC 184th Forum", "Conceptual Assessment", "SLO", "Policy Reform"],
  },
  {
    id: "ibcc-184-bform-cnic-certificates",
    headline: "IBCC Approves B-Form and CNIC Identification on Matric and Inter Certificates",
    summary:
      "The 184th IBCC Forum approved adding candidates' NADRA Child Registration Certificate (CRC / B-Form) or CNIC numbers onto SSC and HSSC certificates to eliminate identity errors and strengthen verification.",
    category: "confirmed",
    status: "officially-confirmed",
    statusDisplayLabel: "CONFIRMED",
    topics: ["policies-reforms", "admissions"],
    isHistorical: false,
    affectedClasses: ["9th", "10th", "11th", "12th"],
    affectedBoards: ["all", "fbise"],
    affectedBoardNames: ["All Pakistani Examination Boards (IBCC Member Boards)"],
    session: "2026–2027 Registration & Certificates",
    issuingAuthority: "Inter Boards Coordination Commission (IBCC — 184th Forum, Murree)",
    originalDate: "September 2026",
    lastVerifiedDate: "15 November 2026",
    sourceUrl: "https://tribune.com.pk/story/2627671/new-policy-sets-40-minimum-passing-marks",
    sourceName: "The Express Tribune & Dawn E-Paper (Sep 2026)",
    sources: [
      {
        label: "The Express Tribune: IBCC Approves B-Form / CNIC on Certificates",
        url: "https://tribune.com.pk/story/2627671/new-policy-sets-40-minimum-passing-marks",
        sourceKind: "news",
      },
      {
        label: "Dawn E-Paper (6 Sep 2026): IBCC Forum Decisions",
        url: "https://epaper.dawn.com/DetailImage.php?StoryImage=06_09_2026_151_008",
        sourceKind: "news",
      },
    ],
    sourceType: "ibcc_federal",
    keyFacts: [
      "Matric and Intermediate certificates will carry the student's NADRA B-Form (CRC) or CNIC number.",
      "Reduces name-mismatch errors during IBCC attestation and university admissions.",
    ],
    whatItMeans:
      "Verify your NADRA B-Form number and spelling carefully when submitting Class 9/10/11/12 admission forms—corrections later require board verification.",
    evidenceNotes:
      "Directly reported from the 184th IBCC Forum decisions in Express Tribune and Dawn E-Paper (Sep 2026).",
    actionRequired: "Cross-check your NADRA B-Form/CNIC digits before locking admission forms.",
    tags: ["B-Form", "CNIC", "Certificates", "IBCC 184th Forum"],
  },
  {
    id: "ibcc-184-uniform-exam-calendar",
    headline: "IBCC Moves Towards a Uniform Theory and Practical Exam Calendar",
    summary:
      "Member boards at the 184th IBCC Forum moved to align annual, supplementary/2nd annual, and practical examination schedules nationally so uneven provincial result dates do not delay university admissions.",
    category: "planned",
    status: "planned-initiative",
    statusDisplayLabel: "PLANNED / APPROVED INITIATIVE",
    topics: ["policies-reforms", "practical-exams"],
    isHistorical: false,
    affectedClasses: ["9th", "10th", "11th", "12th"],
    affectedBoards: ["all", "fbise"],
    affectedBoardNames: ["All Pakistani Examination Boards (IBCC Forum)"],
    session: "Policy Coordination (2026–2027)",
    issuingAuthority: "Inter Boards Coordination Commission (IBCC — 184th Forum)",
    originalDate: "September 2026",
    lastVerifiedDate: "15 November 2026",
    sourceUrl: "https://tribune.com.pk/story/2627671/new-policy-sets-40-minimum-passing-marks",
    sourceName: "The Express Tribune & Dawn E-Paper (Sep 2026)",
    sources: [
      {
        label: "The Express Tribune: IBCC 184th Forum Uniform Calendar Move",
        url: "https://tribune.com.pk/story/2627671/new-policy-sets-40-minimum-passing-marks",
        sourceKind: "news",
      },
      {
        label: "Dawn E-Paper (6 Sep 2026): IBCC Forum Proceedings",
        url: "https://epaper.dawn.com/DetailImage.php?StoryImage=06_09_2026_151_008",
        sourceKind: "news",
      },
    ],
    sourceType: "ibcc_federal",
    limitationNote:
      "This is a national policy harmonization initiative—still wait for your own PBCC/BISE calendar notification for binding local exam dates.",
    whatItMeans:
      "Aims to prevent situations where students from one province miss university intake deadlines due to late practical or result declarations in another board.",
    evidenceNotes:
      "Verified via September 2026 reporting of the 184th IBCC Forum proceedings in Murree.",
    tags: ["Uniform Calendar", "Practical Exams", "IBCC 184th Forum"],
  },
  {
    id: "ibcc-184-common-practical-procedures",
    headline: "IBCC Seeks Common Practical Examination Procedures",
    summary:
      "The 184th IBCC Forum endorsed standardizing practical examination conduct and evaluation protocols across member boards so lab assessments carry consistent fairness nationwide.",
    category: "planned",
    status: "planned-initiative",
    statusDisplayLabel: "PLANNED / APPROVED INITIATIVE",
    topics: ["policies-reforms", "practical-exams"],
    isHistorical: false,
    affectedClasses: ["9th", "10th", "11th", "12th"],
    affectedBoards: ["all", "fbise"],
    affectedBoardNames: ["All Pakistani Examination Boards (IBCC Forum)"],
    session: "Policy Coordination (2026–2027)",
    issuingAuthority: "Inter Boards Coordination Commission (IBCC — 184th Forum)",
    originalDate: "September 2026",
    lastVerifiedDate: "15 November 2026",
    sourceUrl: "https://tribune.com.pk/story/2627671/new-policy-sets-40-minimum-passing-marks",
    sourceName: "The Express Tribune & Dawn E-Paper (Sep 2026)",
    sources: [
      {
        label: "The Express Tribune: IBCC 184th Forum Practical Assessment Standards",
        url: "https://tribune.com.pk/story/2627671/new-policy-sets-40-minimum-passing-marks",
        sourceKind: "news",
      },
      {
        label: "Dawn E-Paper (6 Sep 2026)",
        url: "https://epaper.dawn.com/DetailImage.php?StoryImage=06_09_2026_151_008",
        sourceKind: "news",
      },
    ],
    sourceType: "ibcc_federal",
    limitationNote:
      "Until your board issues new practical rubrics, Punjab students must follow PECTAA's published 2026–27 practical pairing schemes (Grades 9–10) and board practical instructions.",
    whatItMeans:
      "Boards are working toward common lab assessment rules, reducing wide discrepancies between different examination centers and boards.",
    evidenceNotes:
      "Backed by 184th IBCC Forum coverage in Express Tribune and Dawn E-Paper (September 2026).",
    tags: ["Practical Exams", "Standardization", "IBCC 184th Forum"],
  },
  {
    id: "ibcc-184-position-holders-support",
    headline: "IBCC Announces Support Initiatives for Board Position Holders",
    summary:
      "At the 184th Forum, IBCC announced merit support initiatives for board position holders including scholarships, overseas educational exposure visits, and academic winter/summer camps.",
    category: "planned",
    status: "planned-initiative",
    statusDisplayLabel: "PLANNED / APPROVED INITIATIVE",
    topics: ["policies-reforms"],
    isHistorical: false,
    affectedClasses: ["9th", "10th", "11th", "12th"],
    affectedBoards: ["all", "fbise"],
    affectedBoardNames: ["All Pakistani Examination Boards (IBCC Forum)"],
    session: "Announced September 2026 (Details Pending)",
    issuingAuthority: "Inter Boards Coordination Commission (IBCC — 184th Forum)",
    originalDate: "September 2026",
    lastVerifiedDate: "15 November 2026",
    sourceUrl: "https://tribune.com.pk/story/2627671/new-policy-sets-40-minimum-passing-marks",
    sourceName: "The Express Tribune & Dawn E-Paper (Sep 2026)",
    sources: [
      {
        label: "The Express Tribune: IBCC Topper Support Initiatives",
        url: "https://tribune.com.pk/story/2627671/new-policy-sets-40-minimum-passing-marks",
        sourceKind: "news",
      },
      {
        label: "Dawn E-Paper (6 Sep 2026)",
        url: "https://epaper.dawn.com/DetailImage.php?StoryImage=06_09_2026_151_008",
        sourceKind: "news",
      },
    ],
    sourceType: "ibcc_federal",
    limitationNote:
      "Unconfirmed details: Specific scholarship rupee amounts, application portals, seat quotas, and camp dates have NOT yet been announced.",
    whatItMeans:
      "Top achievers across Pakistani boards have planned recognition programs announced by IBCC, though students should wait for official IBCC/BISE circular eligibility rules.",
    evidenceNotes:
      "Reported in September 2026 Express Tribune and Dawn E-Paper accounts of the 184th IBCC Forum.",
    tags: ["Position Holders", "Scholarships", "Academic Camps", "IBCC 184th Forum"],
  },
  {
    id: "ibcc-184-foreign-science-equivalence",
    headline: "IBCC Approves More Flexible Science Group Equivalence for Foreign Board Students",
    summary:
      "For students transferring from foreign qualification systems, the 184th IBCC Forum approved granting Science Group equivalence if a candidate has passed at least two science subjects alongside compulsory subjects.",
    category: "confirmed",
    status: "officially-confirmed",
    statusDisplayLabel: "CONFIRMED",
    topics: ["policies-reforms"],
    isHistorical: false,
    affectedClasses: ["9th", "10th", "11th", "12th"],
    affectedBoards: ["all", "fbise"],
    affectedBoardNames: ["IBCC Equivalence Jurisdiction (Foreign Qualifications)"],
    session: "Approved September 2026",
    issuingAuthority: "Inter Boards Coordination Commission (IBCC — 184th Forum)",
    originalDate: "September 2026",
    lastVerifiedDate: "15 November 2026",
    sourceUrl: "https://tribune.com.pk/story/2627671/new-policy-sets-40-minimum-passing-marks",
    sourceName: "The Express Tribune & Dawn E-Paper (Sep 2026)",
    sources: [
      {
        label: "The Express Tribune: IBCC Foreign Qualification Science Equivalence Decision",
        url: "https://tribune.com.pk/story/2627671/new-policy-sets-40-minimum-passing-marks",
        sourceKind: "news",
      },
      {
        label: "Official Website: IBCC Foreign Qualifications Portal",
        url: "https://ibcc.edu.pk/",
        sourceKind: "official",
      },
    ],
    sourceType: "ibcc_federal",
    limitationNote:
      "Applies ONLY to IBCC equivalence for foreign-board students—regular Pakistani BISE Matric/Inter subject combinations remain governed by Pakistani BISE scheme of studies.",
    whatItMeans:
      "Students returning from O-Levels/IGCSE or foreign schooling who cleared two core science subjects can qualify more easily for Pakistani Science Group equivalence under IBCC guidelines.",
    evidenceNotes:
      "Verified from September 2026 Express Tribune coverage of the 184th IBCC Forum resolution.",
    tags: ["IBCC Equivalence", "Foreign Boards", "Science Group", "IBCC 184th Forum"],
  },
  {
    id: "ibcc-184-emarking-developments",
    headline: "IBCC Emphasizes E-Marking Expansion Across Examination Boards",
    summary:
      "The 184th IBCC Forum highlighted digital e-marking and automated paper checking—commending Sindh boards' recent e-marking progress—while encouraging wider adoption across member boards without claiming universal 2027 Punjab BISE coverage.",
    category: "reported",
    status: "credibly-reported",
    statusDisplayLabel: "REPORTED",
    topics: ["e-sheets", "policies-reforms", "fbise"],
    isHistorical: false,
    affectedClasses: ["9th", "10th", "11th", "12th"],
    affectedBoards: ["all", "lahore", "fbise"],
    affectedBoardNames: ["IBCC Forum (Sindh Commended; BISE Lahore CS & FBISE Active Separately)"],
    session: "Reported September 2026",
    issuingAuthority: "IBCC 184th Forum (with board-specific implementations at BISE Lahore & FBISE)",
    originalDate: "September 2026",
    lastVerifiedDate: "15 November 2026",
    sourceUrl: "https://tribune.com.pk/story/2627671/new-policy-sets-40-minimum-passing-marks",
    sourceName: "The Express Tribune & Dawn E-Paper (Sep 2026)",
    sources: [
      {
        label: "The Express Tribune: 184th IBCC Forum E-Marking Review",
        url: "https://tribune.com.pk/story/2627671/new-policy-sets-40-minimum-passing-marks",
        sourceKind: "news",
      },
      {
        label: "Official PDF (BISE Lahore): Computer Science OSM Answer Book & Bubble Sheet",
        url: "https://data.biselahore.com/dt/downloads/notifications/misc/AnswerBook_CSc.pdf",
        sourceKind: "official",
      },
      {
        label: "Official Portal (FBISE): E-Sheets & OMR Screen Marking",
        url: "https://www.fbise.edu.pk/screen_marking.php",
        sourceKind: "official",
      },
    ],
    sourceType: "ibcc_federal",
    limitationNote:
      "Clarification: Appreciating e-marking at the IBCC Forum does NOT mean all subjects in all 9 Punjab BISEs will use on-screen marking in 2027. Check your own board's subject-level OSM notices (e.g., BISE Lahore Computer Science).",
    whatItMeans:
      "Digital screen marking is growing step by step: write neatly inside designated answer zones/boxes when sitting E-Sheet or OSM-enabled subjects.",
    evidenceNotes:
      "184th IBCC Forum press coverage cross-checked against live BISE Lahore OSM Answer Book PDF and FBISE E-Sheet portal.",
    tags: ["E-Marking", "OSM", "E-Sheets", "IBCC 184th Forum"],
  },

  // =========================================================================
  // PART 6 — ADMISSIONS, REGISTRATION & LIVE PORTAL STATUS
  // =========================================================================
  {
    id: "punjab-matric-2027-admission-portals",
    headline: "Punjab Matric 2027 Admissions — Official Online Application Information",
    summary:
      "Matric Annual 2027 registration runs 10 Nov–11 Dec 2026 (single fee), 12–28 Dec (double), and 29 Dec–11 Jan 2027 (triple). Regular students apply through their schools while private candidates use their district BISE portal—though individual portal activation varies.",
    category: "confirmed",
    status: "officially-confirmed",
    statusDisplayLabel: "CONFIRMED",
    topics: ["admissions", "matric-2027"],
    isHistorical: false,
    affectedClasses: ["9th", "10th"],
    affectedBoards: ["all", "lahore", "multan"],
    affectedBoardNames: ["All 9 Punjab BISE Boards (Individual Portal Activation Varies)"],
    session: "Annual 2027",
    issuingAuthority: "PBCC & Individual Punjab BISE Admission Portals",
    originalDate: "10 Nov 2026 (Portals Audited 15 Nov 2026)",
    lastVerifiedDate: "15 November 2026",
    sourceUrl: "https://web.bisemultan.edu.pk/admission-matric/",
    sourceName: "PBCC Schedule & Live Verification of BISE Lahore / BISE Multan Portals",
    sources: [
      {
        label: "Official Portal: BISE Multan Matric Admissions",
        url: "https://web.bisemultan.edu.pk/admission-matric/",
        sourceKind: "official",
      },
      {
        label: "Official Portal: BISE Multan Student Portal",
        url: "https://student.bisemultan.edu.pk/",
        sourceKind: "official",
      },
      {
        label: "Official PDF (BISE Lahore): 9th Private Registration Schedule 1st Annual 2027",
        url: "https://data.biselahore.com/dt/downloads/notifications/admissions/Pvt_RegSch(1stA27).pdf",
        sourceKind: "official",
      },
      {
        label: "Official Portal: BISE Rawalpindi eServices",
        url: "https://eservices.biserawalpindi.edu.pk",
        sourceKind: "official",
      },
    ],
    sourceType: "official_board",
    keyFacts: [
      "Single Fee: 10 November – 11 December 2026 | Double Fee: 12 – 28 December 2026 | Triple Fee: 29 December 2026 – 11 January 2027.",
      "Regular candidates apply through their affiliated school's BISE institution login.",
      "Private candidates submit forms directly on their home district BISE admission portal.",
      "Live Portal Audit (15 Nov 2026): BISE Multan's private portal (student.bisemultan.edu.pk) displayed 'No Active Schedule Available !' despite PBCC's published dates, while BISE Lahore already posted Pvt_RegSch(1stA27).pdf.",
    ],
    whatItMeans:
      "If your district BISE portal temporarily shows no active online form button despite the PBCC window having opened, wait 24–48 hours for board-level portal rollout or verify directly with your board's admission branch.",
    evidenceNotes:
      "Direct HTTP inspection of student.bisemultan.edu.pk, web.bisemultan.edu.pk/admission-matric/, and biselahore.com/notifications on 15 November 2026.",
    actionRequired: "Open the '9 Punjab Boards Directory' tab to reach your exact district BISE portal.",
    isDeadline: true,
    deadlineDate: "Single Fee Ends 11 Dec 2026",
    tags: ["Admissions", "Online Portal", "Matric 2027", "BISE Multan", "BISE Lahore"],
  },

  // =========================================================================
  // PART 7 — HISTORICAL / 2026 CONTEXT (CLEARLY MARKED HISTORICAL)
  // =========================================================================
  {
    id: "punjab-inter-1st-annual-2026-historical",
    headline: "Punjab Intermediate First Annual Exams 2026 Began on 20 May",
    summary:
      "Historical 2026 cycle: Under PBCC's notification dated 11 February 2026, HSSC Part-II First Annual Examinations commenced on 20 May 2026, with tentative result dates originally listed as 23 September 2026 (Part-I) and 22 October 2026 (Part-II).",
    category: "historical",
    status: "historical-record",
    statusDisplayLabel: "HISTORICAL",
    topics: ["historical-2026"],
    isHistorical: true,
    affectedClasses: ["11th", "12th"],
    affectedBoards: ["all"],
    affectedBoardNames: ["All 9 Punjab BISE Boards"],
    session: "1st Annual 2026 (Historical)",
    issuingAuthority: "PBCC — Notification dated 11 February 2026",
    originalDate: "11 Feb 2026 (Exams began 20 May 2026)",
    lastVerifiedDate: "15 November 2026",
    sourceUrl: "https://data.biselahore.com/dt/downloads/Datesheets/Inter/DS_Inter_1stA26.pdf",
    sourceName: "BISE Lahore Official Date Sheet PDF & Dawn",
    sources: [
      {
        label: "Official PDF (BISE Lahore): Intermediate 1st Annual 2026 Date Sheet",
        url: "https://data.biselahore.com/dt/downloads/Datesheets/Inter/DS_Inter_1stA26.pdf",
        sourceKind: "official",
      },
      {
        label: "Dawn: Schedule for Board Exams Announced (11 Feb 2026 Notice)",
        url: "https://www.dawn.com/news/1967535/schedule-for-board-exams-announced",
        sourceKind: "news",
      },
    ],
    sourceType: "historical_archive",
    keyFacts: [
      "PBCC notification date: 11 February 2026.",
      "HSSC 1st Annual Exam 2026 commencement: 20 May 2026.",
      "Tentative result dates in Feb 2026 notice: 23 September 2026 (Part-I) and 22 October 2026 (Part-II).",
      "Strictly historical as of 15 November 2026—do NOT copy 20 May into 2027 schedules.",
    ],
    whatItMeans:
      "Preserved only as completed 2026 calendar reference so students do not confuse the past 2026 First Annual cycle with the upcoming 2027 cycle.",
    evidenceNotes:
      "Confirmed via official BISE Lahore DS_Inter_1stA26.pdf and Dawn 2026 schedule coverage.",
    tags: ["Historical 2026", "Intermediate", "1st Annual 2026", "20 May 2026"],
  },
  {
    id: "punjab-inter-2nd-annual-2026-historical",
    headline: "Punjab Intermediate Second Annual Exams 2026 Began on 3 November",
    summary:
      "Historical 2026 cycle: Punjab's Intermediate (HSSC) Second Annual / supplementary Examinations 2026 commenced on 3 November 2026—separate from the May 2026 First Annual Examination and NOT an upcoming 2027 date.",
    category: "historical",
    status: "historical-record",
    statusDisplayLabel: "HISTORICAL",
    topics: ["historical-2026"],
    isHistorical: true,
    affectedClasses: ["11th", "12th"],
    affectedBoards: ["all"],
    affectedBoardNames: ["All 9 Punjab BISE Boards"],
    session: "2nd Annual 2026 (Historical)",
    issuingAuthority: "Punjab Boards (HSSC Second Annual Examination 2026)",
    originalDate: "25 Sep 2026 (Exams began 3 Nov 2026)",
    lastVerifiedDate: "15 November 2026",
    sourceUrl: "https://data.biselahore.com/dt/downloads/Datesheets/Inter/DS_Inter_2ndA26.pdf",
    sourceName: "BISE Lahore Official Date Sheet PDF & ProPakistani",
    sources: [
      {
        label: "Official PDF (BISE Lahore): Intermediate 2nd Annual 2026 Date Sheet",
        url: "https://data.biselahore.com/dt/downloads/Datesheets/Inter/DS_Inter_2ndA26.pdf",
        sourceKind: "official",
      },
      {
        label: "ProPakistani (25 Sep 2026): Inter Second Annual Exam 2026 Schedule",
        url: "https://propakistani.pk/2026/09/25/punjab-boards-announce-inter-second-annual-exam-2026-schedule/",
        sourceKind: "news",
      },
    ],
    sourceType: "historical_archive",
    keyFacts: [
      "Commenced 3 November 2026 across Punjab BISEs.",
      "This was the HSSC Second Annual 2026 session (already underway/concluding as of 15 Nov 2026), distinct from First Annual 2026.",
    ],
    whatItMeans:
      "Archived strictly for historical clarity so students distinguish between the 2026 First Annual (May) and Second Annual (November) cycles.",
    evidenceNotes:
      "Verified against official BISE Lahore DS_Inter_2ndA26.pdf and ProPakistani 25 September 2026 coverage.",
    tags: ["Historical 2026", "Intermediate", "2nd Annual 2026", "3 November 2026"],
  },

  // =========================================================================
  // PART 8 — BOARD-SPECIFIC PUNJAB DEVELOPMENTS & FBISE UPDATES
  // =========================================================================
  {
    id: "bise-lahore-osm-cs-and-9th-private-2027",
    headline: "BISE Lahore Publishes Computer Science (OSM) Answer Book, Video Tutorial & 9th Private 2027 Schedule",
    summary:
      "BISE Lahore-specific resources (NOT universal Punjab instructions): BISE Lahore's official website and notifications list the 'Complete Answer Book and Bubble Sheet Pattern for Computer Science (OSM)' PDF, the 'BISE Lahore On-Screen Marking System' student and teacher video tutorial, the 9th Private Registration Schedule (1st Annual 2027), and SSC practical instructions.",
    category: "confirmed",
    status: "officially-confirmed",
    statusDisplayLabel: "CONFIRMED",
    topics: ["e-sheets", "policies-reforms", "admissions", "practical-exams", "matric-2027"],
    isHistorical: false,
    affectedClasses: ["9th", "10th", "11th", "12th"],
    affectedBoards: ["lahore"],
    affectedBoardNames: ["BISE Lahore ONLY (Board-Specific Resources)"],
    session: "2026–27 / 1st Annual 2027",
    issuingAuthority: "Board of Intermediate & Secondary Education (BISE), Lahore",
    originalDate: "Checked 18 Nov 2026",
    lastVerifiedDate: "18 November 2026",
    sourceUrl: "https://www.biselahore.com/",
    sourceName: "BISE Lahore Official Website & Notifications Portal",
    sources: [
      {
        label: "BISE Lahore Official Portal: Home Announcements & OSM Guidance (#osm, BISE Lahore Only)",
        url: "https://www.biselahore.com/",
        sourceKind: "official",
      },
      {
        label: "BISE Lahore Official PDF: Complete Answer Book & Bubble Sheet Pattern for Computer Science (OSM, BISE Lahore Only)",
        url: "https://data.biselahore.com/dt/downloads/notifications/misc/AnswerBook_CSc.pdf",
        sourceKind: "official",
      },
      {
        label: "BISE Lahore Video Tutorial (YouTube @Lahore-Board-Official, Embedded on biselahore.com): On-Screen Marking System Student & Teacher Guide",
        url: "https://www.youtube.com/watch?v=Eea8ivG9_Tg",
        sourceKind: "reproduced-copy",
      },
      {
        label: "BISE Lahore Official PDF: 9th Class Private Registration Schedule (1st Annual 2027)",
        url: "https://data.biselahore.com/dt/downloads/notifications/admissions/Pvt_RegSch(1stA27).pdf",
        sourceKind: "official",
      },
      {
        label: "BISE Lahore Official PDF: Instructions for SSC Part-II Practical Exams",
        url: "https://data.biselahore.com/dt/downloads/notifications/examination/Instr_Pr.Exam.pdf",
        sourceKind: "official",
      },
      {
        label: "BISE Lahore Official Notifications Directory",
        url: "https://www.biselahore.com/notifications",
        sourceKind: "official",
      },
    ],
    sourceType: "official_board",
    keyFacts: [
      "BISE Lahore OSM Specimen PDF: 'Complete Answer Book and Bubble Sheet Pattern for the Subject Computer Science (OSM)' (34-page PDF hosted on data.biselahore.com).",
      "BISE Lahore Student & Teacher Tutorial: 'BISE Lahore On-Screen Marking System - Complete Answer & Bubble Sheet Guide for Students & Teachers' embedded directly on biselahore.com/#osm via BISE Lahore's official YouTube channel.",
      "9th Class Private Registration (1st Annual 2027): Official schedule published in Pvt_RegSch(1stA27).pdf.",
    ],
    limitationNote:
      "BISE Lahore ONLY: These materials are published specifically as BISE Lahore resources—do NOT treat BISE Lahore's booklet pattern or tutorial as universal instructions for all nine Punjab boards.",
    whatItMeans:
      "BISE Lahore Computer Science students should inspect AnswerBook_CSc.pdf and watch BISE Lahore's student & teacher OSM video tutorial on biselahore.com, while private Class 9 applicants under Lahore division should follow Pvt_RegSch(1stA27).pdf.",
    evidenceNotes:
      "Verified directly on https://www.biselahore.com/, https://www.biselahore.com/notifications, and embedded YouTube tutorial Eea8ivG9_Tg on 18 November 2026.",
    tags: ["BISE Lahore Only", "OSM Answer Book", "OSM Video Tutorial", "Computer Science", "9th Private 2027"],
  },
  {
    id: "fbise-2027-grading-esheets-model-papers",
    headline: "FBISE Only: 40% Pass Policy, 10-Point Grading, SLO Papers & 2027 Sample E-Sheets",
    summary:
      "Applicable to Federal Board (FBISE) candidates ONLY—not Punjab provincial BISEs: FBISE's 2027 sample E-Sheets (SSC-I & HSSC-I) explicitly instruct candidates to answer each question or part in the specified space; otherwise marks for that answer will not be awarded.",
    category: "confirmed",
    status: "officially-confirmed",
    statusDisplayLabel: "CONFIRMED",
    topics: ["e-sheets", "fbise", "passing-grading", "paper-patterns", "policies-reforms"],
    isHistorical: false,
    affectedClasses: ["9th", "10th", "11th", "12th"],
    affectedBoards: ["fbise"],
    affectedBoardNames: ["FBISE ONLY (Federal Board — Separate from Punjab BISEs)"],
    session: "2026–27 / Annual 2027",
    issuingAuthority: "Federal Board of Intermediate & Secondary Education (FBISE)",
    originalDate: "Checked 18 Nov 2026",
    lastVerifiedDate: "18 November 2026",
    sourceUrl: "https://www.fbise.edu.pk/screen_marking.php",
    sourceName: "FBISE Official Portal (screen_marking.php & curriculum_model_paper.php)",
    sources: [
      {
        label: "FBISE Official Portal: E-Sheets & OMR Screen Marking Downloads (FBISE Only)",
        url: "https://www.fbise.edu.pk/screen_marking.php",
        sourceKind: "official",
      },
      {
        label: "FBISE Official PDF (2027 Sample): SSC-I PCBC E-Sheet — Explicit Space Rule (FBISE Only)",
        url: "https://www.fbise.edu.pk/Downloads/E-Sheets-2026/sample_esheet_for_PCBC_SSC1_2027.pdf",
        sourceKind: "official",
      },
      {
        label: "FBISE Official PDF (2027 Sample): HSSC-I Mathematics E-Sheet (FBISE Only)",
        url: "https://www.fbise.edu.pk/Downloads/E-Sheets-2026/sample_esheet_for_maths_HSSC1_2027.pdf",
        sourceKind: "official",
      },
      {
        label: "FBISE Official Portal: SLO Model Question Papers (FBISE Only)",
        url: "https://www.fbise.edu.pk/curriculum_model_paper.php",
        sourceKind: "official",
      },
    ],
    sourceType: "ibcc_federal",
    keyFacts: [
      "Explicit FBISE Sample Rule (sample_esheet_for_PCBC_SSC1_2027.pdf): Candidates must answer each question or part strictly in the specified space; otherwise marks for that answer will not be awarded.",
      "Section-A OMR Rule: FBISE cover sheet explicitly instructs candidates not to use lead pencil and states deleting/overwriting is not allowed.",
      "Passing & Assessment Policy: FBISE enforces the 40% passing threshold, 10-point grading scale, and SLO-based assessment papers.",
    ],
    limitationNote:
      "FBISE ONLY: Federal Board E-Sheet layouts, explicit mark-forfeiture space rules, and SLO curricula apply exclusively to FBISE candidates—keep strictly separate from Punjab BISE rules.",
    whatItMeans:
      "FBISE students sitting Annual 2027 exams should practice directly on FBISE's 2027 sample E-Sheets so every answer sits cleanly inside its designated box and meets the 40% subject threshold.",
    evidenceNotes:
      "Direct verification of fbise.edu.pk/screen_marking.php and sample_esheet_for_PCBC_SSC1_2027.pdf on 18 November 2026.",
    tags: ["FBISE Only", "E-Sheets 2027", "SLO Model Papers", "40% Passing Marks"],
  },
];

// ---------------------------------------------------------------------------
// SUBJECT-BY-SUBJECT OFFICIAL PAPER PATTERNS & PAIRING SCHEMES (PECTAA ALP 2026-27)
// Verified strictly per class & per subject — NEVER generalized across subjects or grades.
// ---------------------------------------------------------------------------
export const SUBJECT_PATTERNS: SubjectPattern[] = [
  // ========================= GRADE 9 (Class 9) =========================
  {
    id: "g9-english",
    grade: "9th",
    subject: "English-9",
    notificationRef: "PECTAA/C&C Unit/2026/1238 (6 Nov 2026)",
    totalTheoryMarks: 75,
    objectiveMarks: 19,
    mcqCount: "19 MCQs (1 mark each)",
    subjectiveMarks: 56,
    practicalMarks: "None",
    passingRequirement: "40% (30 / 75 marks — IBCC Phase 1 active from 2026)",
    totalDuration: "2 Hours 30 Minutes",
    objectiveDuration: "20 Minutes",
    subjectiveDuration: "2 Hours 10 Minutes",
    questionDistribution: [
      "Q1 (Objective): 19 MCQs (verb forms, spellings, meanings, grammar) — 19 marks",
      "Q2: Short Qs Part-A (3/5 textbook Qs = 6m) + Part-B Play Unit 11 (1/2 = 4m) — 10 marks",
      "Q3: Translation into Urdu (2/3 paras) or rewrite — 8 marks",
      "Q4: Poem Summary OR Stanza Explanation — 5 marks",
      "Q5: Words/Idioms sentences (5/8) — 5 marks",
      "Q6: Letter / Story / Dialogue — 8 marks",
      "Q7: Comprehension Passage — 10 marks",
      "Q8: Translate 5 sentences OR 10-sentence para into English — 5 marks",
      "Q9: Change of Voice — 5 marks",
    ],
    attemptRules: "Follow per-question attempt quotas shown above across Q2–Q9.",
    internalChoices: "Q2 (3/5 + 1/2), Q3 (2/3 paras), Q4 (Summary OR Stanza), Q5 (5/8), Q6 (choice among Letter/Story/Dialogue), Q8 (sentences OR para).",
    pairingScheme: [
      "Questions drawn from remaining 8 textbook units plus PCTB English Grammar & Composition.",
      "Zero questions allowed from excluded Units 5, 8, and 10.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 9 Notification No. 1238.",
    deletedContent:
      "Excluded 3 of 11 units: Unit 5 (Women Empowerment through Entrepreneurship), Unit 8 (The Impact of Globalisation on Culture and Economy), Unit 10 (The Silent Predator and the Majestic Prey – Snow Leopard and Markhor).",
    paperSetterInstructions: "Mandatory not to include objective or subjective questions from excluded units.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-9-Notification-06.11.2026-F_Redacted.pdf",
  },
  {
    id: "g9-urdu",
    grade: "9th",
    subject: "Urdu-9",
    notificationRef: "PECTAA/C&C Unit/2026/1238 (6 Nov 2026)",
    totalTheoryMarks: 75,
    objectiveMarks: 15,
    mcqCount: "15 MCQs (10 textbook: 7 prose, 2 nazm, 1 ghazal + 5 grammar)",
    subjectiveMarks: 60,
    practicalMarks: "None",
    passingRequirement: "40% (30 / 75 marks — IBCC Phase 1)",
    totalDuration: "2 Hours 30 Minutes",
    objectiveDuration: "20 Minutes",
    subjectiveDuration: "2 Hours 10 Minutes",
    questionDistribution: [
      "Q1 (Objective): 15 MCQs — 15 marks",
      "Subjective Section: Ash'aar ki Tashreeh (Nazm + Ghazal), Prose Tashreeh, Khulasa, Letter/Application, Story/Dialogue, Comprehension/Grammar — 60 marks",
    ],
    attemptRules: "See official No. 1238 Urdu-9 model paper for exact verse & passage choices.",
    internalChoices: "Internal choices provided within Nazm/Ghazal stanzas, prose passages, and composition items.",
    pairingScheme: [
      "Objective split: 7 prose MCQs, 2 nazm MCQs, 1 ghazal MCQ, 5 grammar MCQs.",
      "No questions from author or poet biographies.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 9 Notification No. 1238.",
    deletedContent: "Excluded Urdu lessons & topics specified in No. 1238 annexures; no author/poet intro questions.",
    paperSetterInstructions: "Zero questions from excluded lessons or author/poet biographical introductions.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-9-Notification-06.11.2026-F_Redacted.pdf",
  },
  {
    id: "g9-islamiat",
    grade: "9th",
    subject: "Islamiat Compulsory-9",
    notificationRef: "PECTAA/C&C Unit/2026/1238 (6 Nov 2026)",
    totalTheoryMarks: 100,
    objectiveMarks: 20,
    mcqCount: "20 MCQs (1 mark each)",
    subjectiveMarks: 80,
    practicalMarks: "None",
    passingRequirement: "40% (40 / 100 marks — IBCC Phase 1)",
    totalDuration: "3 Hours",
    objectiveDuration: "See official No. 1238 model paper",
    subjectiveDuration: "See official No. 1238 model paper",
    questionDistribution: [
      "Part-I (Objective): 20 MCQs — 20 marks",
      "Part-II (Short Qs = 40 marks): Q2 (6/9 from Ch 1–2 = 12m), Q3 (6/9 from Ch 3–4 = 12m), Q4 (8/12 from Ch 5–6 = 16m)",
      "Part-III (Subjective = 40 marks): Q5 Ahadith translation (2/4 = 10m), Q6 Personalities (2/4 = 10m), Q7 Long Qs (2/4 = 20m)",
    ],
    attemptRules: "Attempt 20/30 short Qs (across Q2–Q4) and 2/4 in each of Q5, Q6, and Q7.",
    internalChoices: "Q2 (6/9), Q3 (6/9), Q4 (8/12), Q5 (2/4), Q6 (2/4), Q7 (2/4).",
    pairingScheme: [
      "Q2: Ch 1–2 | Q3: Ch 3–4 | Q4: Ch 5–6.",
      "Q7 Long Questions: None asked from Chapter 6 & Chapter 7.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 9 Notification No. 1238.",
    deletedContent: "Follow exact topic exclusions inside No. 1238. Note: Tarjama-tul-Quran and Ethics have NO deleted-topic ALP.",
    paperSetterInstructions: "Do not include Q7 long questions from Chapters 6 and 7.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-9-Notification-06.11.2026-F_Redacted.pdf",
  },
  {
    id: "g9-math",
    grade: "9th",
    subject: "Mathematics-9",
    notificationRef: "PECTAA/C&C Unit/2026/1238 (6 Nov 2026)",
    totalTheoryMarks: 75,
    objectiveMarks: 15,
    mcqCount: "15 MCQs (1 each Ch 1,2,5,7,9,10,11,12,13 + 2 each Ch 3,4,6)",
    subjectiveMarks: 60,
    practicalMarks: "None",
    passingRequirement: "40% (30 / 75 marks — IBCC Phase 1)",
    totalDuration: "2 Hours 30 Minutes",
    objectiveDuration: "20 Minutes",
    subjectiveDuration: "2 Hours 10 Minutes",
    questionDistribution: [
      "Q1 (Objective): 15 MCQs — 15 marks",
      "Short Qs (36 marks): Q2 (6/9 from Ch 1–5 = 12m), Q3 (6/9 from Ch 6,7,9 = 12m), Q4 (6/9 from Ch 10–13 = 12m)",
      "Long Part-II (16 marks): Attempt 2/3 × 8m (Q5, Q6, Q7)",
      "Long Part-III (8 marks): Attempt 1/2 × 8m (Q8, Q9)",
    ],
    attemptRules: "Attempt 18/27 short questions; 2/3 long in Part-II; 1/2 long in Part-III (no separate mandatory theorem override required).",
    internalChoices: "6/9 per short-Q block; 2/3 in Part-II; 1/2 in Part-III.",
    pairingScheme: [
      "Q5: Ch 1 + Ch 2 | Q6: Ch 3 + Ch 4 | Q7: Ch 5 + Ch 6.",
      "Q8: Ch 7/10 + Ch 9 | Q9: Ch 12 + Ch 11/13.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 9 Notification No. 1238.",
    deletedContent: "Excluded exercises, examples, and questions per unit listed in PECTAA No. 1238.",
    paperSetterInstructions: "All questions strictly from remaining exercises/examples after ALP deletions.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-9-Notification-06.11.2026-F_Redacted.pdf",
  },
  {
    id: "g9-physics",
    grade: "9th",
    subject: "Physics-9",
    notificationRef: "PECTAA No. 1238 (6 Nov) & Practicals in No. 1257",
    totalTheoryMarks: 60,
    objectiveMarks: 12,
    mcqCount: "12 MCQs (2 each Ch 3,4,6; 1 each remaining chapters)",
    subjectiveMarks: 48,
    practicalMarks: "Combined Grades 9–10 Practical: 30 Marks (2 Hours) examined in Class 10",
    passingRequirement: "40% (24 / 60 theory — IBCC Phase 1)",
    totalDuration: "2 Hours",
    objectiveDuration: "15 Minutes",
    subjectiveDuration: "1 Hour 45 Minutes",
    questionDistribution: [
      "Q1 (Objective): 12 MCQs — 12 marks",
      "Short Qs (30 marks): Q2 (5/8 Ch 1–3 = 10m), Q3 (5/8 Ch 4–6 = 10m), Q4 (5/8 Ch 7–9 = 10m)",
      "Long Qs (18 marks): Attempt 2/3 × 9m (Q5, Q6, Q7; a=4m, b=5m from different chapters)",
    ],
    attemptRules: "Attempt 15/24 short questions and 2/3 long questions.",
    internalChoices: "5/8 per short section; 2/3 detailed questions.",
    pairingScheme: [
      "Q5: Ch 1–3 | Q6: Ch 4–6 | Q7: Ch 7–9 (parts a & b from different chapters).",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 9 Notification No. 1238.",
    deletedContent:
      "Excluded theory topics in No. 1238. Excluded 9th Practicals (in No. 1257): g by free fall, limiting friction vs normal reaction, principle of moments weight, measuring cylinder density, helical spring load-extension graph.",
    paperSetterInstructions: "Part (a) and (b) of a long question must not come from the same chapter.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-9-Notification-06.11.2026-F_Redacted.pdf",
  },
  {
    id: "g9-chemistry",
    grade: "9th",
    subject: "Chemistry-9",
    notificationRef: "PECTAA No. 1238 (6 Nov) & Practicals in No. 1257",
    totalTheoryMarks: 60,
    objectiveMarks: 12,
    mcqCount: "12 MCQs",
    subjectiveMarks: 48,
    practicalMarks: "Combined Grades 9–10 Practical: 30 Marks (2 Hours) examined in Class 10",
    passingRequirement: "40% (24 / 60 theory — IBCC Phase 1)",
    totalDuration: "2 Hours",
    objectiveDuration: "15 Minutes",
    subjectiveDuration: "1 Hour 45 Minutes",
    questionDistribution: [
      "Q1 (Objective): 12 MCQs — 12 marks",
      "Short Qs (30 marks): Q2 (5/8 Ch 1–4 = 10m), Q3 (5/8 Ch 5–8 = 10m), Q4 (5/8 Ch 9–11 = 10m)",
      "Long Qs (18 marks): Attempt 2/3 × 9m (a=5m, b=4m)",
    ],
    attemptRules: "Attempt 15/24 short questions and 2/3 detailed questions.",
    internalChoices: "5/8 per short section; 2/3 long questions.",
    pairingScheme: [
      "Q5: Ch 1 + Ch 2 | Q6: Ch 3 + Ch 7 | Q7: Ch 8 + Ch 10.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 9 Notification No. 1238.",
    deletedContent:
      "Excluded topics in No. 1238. Excluded 9th Practicals (in No. 1257): temperature effect on solubility, physical mixture separation, preparing 0.1M NaOH, 0.1M Na2CO3, and 0.1M HCl solutions.",
    paperSetterInstructions: "Zero questions from deleted topics or exercise questions.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-9-Notification-06.11.2026-F_Redacted.pdf",
  },
  {
    id: "g9-biology",
    grade: "9th",
    subject: "Biology-9",
    notificationRef: "PECTAA No. 1238 (6 Nov) & Practicals in No. 1257",
    totalTheoryMarks: 60,
    objectiveMarks: 12,
    mcqCount: "12 MCQs",
    subjectiveMarks: 48,
    practicalMarks: "Combined Grades 9–10 Practical: 30 Marks (2 Hours) examined in Class 10",
    passingRequirement: "40% (24 / 60 theory — IBCC Phase 1)",
    totalDuration: "2 Hours",
    objectiveDuration: "15 Minutes",
    subjectiveDuration: "1 Hour 45 Minutes",
    questionDistribution: [
      "Q1 (Objective): 12 MCQs — 12 marks",
      "Short Qs (30 marks): Q2 (5/8 Ch 1–3 = 10m), Q3 (5/8 Ch 4,5,6,10 = 10m), Q4 (5/8 Ch 7–9 = 10m)",
      "Long Qs (18 marks): Attempt 2/3 × 9m (a=5m, b=4m)",
    ],
    attemptRules: "Attempt 15/24 short questions and 2/3 detailed questions.",
    internalChoices: "5/8 per short block; 2/3 long questions.",
    pairingScheme: [
      "Q5: Ch 2 + Ch 3 | Q6: Ch 6 + Ch 7 | Q7: Ch 9 + Ch 10.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 9 Notification No. 1238.",
    deletedContent:
      "Excluded topics in No. 1238. Excluded 9th Practicals (in No. 1257): bell jar transpiration investigation, wind/light/temperature transpiration rate experiments.",
    paperSetterInstructions: "Side boxes inside deleted topics are also treated as deleted.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-9-Notification-06.11.2026-F_Redacted.pdf",
  },
  {
    id: "g9-cs",
    grade: "9th",
    subject: "Computer Science & Entrepreneurship-9",
    notificationRef: "PECTAA/C&C Unit/2026/1255 (14 Nov 2026)",
    totalTheoryMarks: 50,
    objectiveMarks: 10,
    mcqCount: "10 MCQs (1 mark each)",
    subjectiveMarks: 40,
    practicalMarks: "Combined Grades 9–10 Practical: 50 Marks (2 Hours) examined in Class 10",
    passingRequirement: "40% (20 / 50 theory — IBCC Phase 1)",
    totalDuration: "2 Hours",
    objectiveDuration: "15 Minutes",
    subjectiveDuration: "1 Hour 45 Minutes",
    questionDistribution: [
      "Q1 (Objective): 10 MCQs — 10 marks",
      "Short Qs (24 marks): Q2 (4/6 Ch 1,4 = 8m), Q3 (4/6 Ch 3,5,7 = 8m), Q4 (4/6 Ch 6,8,9 = 8m)",
      "Long Qs (16 marks): Attempt 2/3 × 8m (Q5, Q6, Q7)",
    ],
    attemptRules: "Attempt 12/18 short questions and 2/3 detailed questions.",
    internalChoices: "4/6 per short section; 2/3 detailed questions.",
    pairingScheme: [
      "Q5: Unit 1 | Q6: Unit 3 | Q7: Unit 6 or Unit 9.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 9 Further Notification No. 1255.",
    deletedContent: "Unit 2 (Complete Unit) excluded, plus selected subtopics in Units 1, 4, 5, and 8 listed in No. 1255.",
    paperSetterInstructions: "No question evaluated from excluded topics in any section.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-Notification-14.11.2026-1255-1.pdf",
  },
  {
    id: "g9-genscience",
    grade: "9th",
    subject: "General Science-9",
    notificationRef: "PECTAA/C&C Unit/2026/1255 (14 Nov 2026)",
    totalTheoryMarks: 50,
    objectiveMarks: 12,
    mcqCount: "12 MCQs (2 each from Chapters 1–6)",
    subjectiveMarks: 38,
    practicalMarks: "None",
    passingRequirement: "40% (20 / 50 marks — IBCC Phase 1)",
    totalDuration: "2 Hours",
    objectiveDuration: "20 Minutes",
    subjectiveDuration: "1 Hour 40 Minutes",
    questionDistribution: [
      "Q1 (Objective): 12 MCQs — 12 marks",
      "Short Qs (24 marks; 3 marks each!): Q2 (4/6 Ch 1–3 = 12m), Q3 (4/6 Ch 4–6 = 12m)",
      "Long Qs (14 marks; 7 marks each!): Attempt 2/3 × 7m (a=4m, b=3m)",
    ],
    attemptRules: "Attempt 8/12 short questions (3 marks each) and 2/3 long questions (7 marks each).",
    internalChoices: "4/6 per short section; 2/3 long questions.",
    pairingScheme: [
      "Q4: Ch 1 + Ch 2 | Q5: Ch 3 + Ch 4 | Q6: Ch 5 + Ch 6.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 9 Further Notification No. 1255.",
    deletedContent: "Deleted topics & exercises across Chapters 1–6 tabulated in No. 1255.",
    paperSetterInstructions: "Note 50-mark total and 3-mark short question weighting distinct from 75-mark science subjects.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-Notification-14.11.2026-1255-1.pdf",
  },
  {
    id: "g9-masihi",
    grade: "9th",
    subject: "Masihi Taleem-9",
    notificationRef: "PECTAA/C&C Unit/2026/1255 (14 Nov 2026)",
    totalTheoryMarks: 100,
    objectiveMarks: 20,
    mcqCount: "20 MCQs (1 mark each)",
    subjectiveMarks: 80,
    practicalMarks: "None",
    passingRequirement: "40% (40 / 100 marks — IBCC Phase 1)",
    totalDuration: "3 Hours",
    objectiveDuration: "See official No. 1255 model paper",
    subjectiveDuration: "See official No. 1255 model paper",
    questionDistribution: [
      "Part-I (Objective): 20 MCQs — 20 marks",
      "Part-II (Short Qs = 40 marks): Q2 (6/9 = 12m), Q3 (6/9 = 12m), Q4 (8/12 = 16m)",
      "Part-III (Subjective = 40 marks): Q5 Verses (2/4 = 10m), Q6 Note (1/2 = 10m), Q7 Long Qs (2/4 = 20m)",
    ],
    attemptRules: "Attempt 20/30 short questions, 2/4 verses, 1/2 notes, and 2/4 long questions.",
    internalChoices: "6/9, 6/9, 8/12 in Part-II; 2/4, 1/2, 2/4 in Part-III.",
    pairingScheme: ["Chapters distributed per No. 1255 Masihi Taleem-9 pairing matrix."],
    modelPaperAvailable: "Included in Official PECTAA Grade 9 Further Notification No. 1255.",
    deletedContent: "Selected topic exclusions per No. 1255. (Tarjama-tul-Quran & Ethics have NO deleted-topic ALP.)",
    paperSetterInstructions: "Follow Masihi Taleem-9 instructions inside No. 1255.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-Notification-14.11.2026-1255-1.pdf",
  },

  // ========================= GRADE 10 (Class 10) =========================
  {
    id: "g10-english",
    grade: "10th",
    subject: "English-10",
    notificationRef: "PECTAA/C&C Unit/2026/1257 (14 Nov 2026)",
    totalTheoryMarks: 75,
    objectiveMarks: 19,
    mcqCount: "19 MCQs (1 mark each)",
    subjectiveMarks: 56,
    practicalMarks: "None",
    passingRequirement: "40% (30 / 75 marks — IBCC Phase 2 begins Annual 2027)",
    totalDuration: "2 Hours 30 Minutes",
    objectiveDuration: "20 Minutes",
    subjectiveDuration: "2 Hours 10 Minutes",
    questionDistribution: [
      "Paper-I Objective: 19 MCQs — 19 marks",
      "Paper-II Essay Type (56 marks): Q2 Short Qs (5/8 = 10m), Q3 Urdu Translation / Rewrite (8m), Q4 Poem Summary/Stanza (5m), Q5 Essay OR Para (15m), Q6 Direct/Indirect (5m), Q7 Pair of Words (5m), Q8 Urdu->Eng Paragraph (8m)",
    ],
    attemptRules: "Attempt all objective MCQs; follow per-question subjective choices.",
    internalChoices: "Q2 (5/8), Q4 (Summary OR Stanza), Q5 (1/3 Essays OR 1/3 Paragraphs), Q7 (5/8 pair of words).",
    pairingScheme: [
      "7 remaining textbook units split evenly across short questions & translation (Units 1,2,3,5 + Review-I & Units 6,8,9 + Review-II).",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 10 Notification No. 1257.",
    deletedContent:
      "Excluded 3 of 10 units: Unit 4 (The Earth: Act Now for Tomorrow), Unit 7 (Time Poem), and Unit 10 (The Three Questions), plus related review portions.",
    paperSetterInstructions: "Mandatory that no questions touch excluded Units 4, 7, and 10.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1257.pdf",
  },
  {
    id: "g10-urdu",
    grade: "10th",
    subject: "Urdu-10",
    notificationRef: "PECTAA/C&C Unit/2026/1257 (14 Nov 2026)",
    totalTheoryMarks: 75,
    objectiveMarks: 15,
    mcqCount: "15 MCQs",
    subjectiveMarks: 60,
    practicalMarks: "None",
    passingRequirement: "40% (30 / 75 marks — IBCC Phase 2 starts Annual 2027)",
    totalDuration: "2 Hours 30 Minutes",
    objectiveDuration: "20 Minutes",
    subjectiveDuration: "2 Hours 10 Minutes",
    questionDistribution: [
      "Objective: 15 MCQs — 15 marks",
      "Subjective: Nazm/Ghazal Tashreeh, Prose Tashreeh, Short Qs, Khulasa, Essay, Comprehension — 60 marks",
    ],
    attemptRules: "Follow Urdu-10 model paper question choices in No. 1257.",
    internalChoices: "Internal choices on couplets, passages, summaries, and essays.",
    pairingScheme: ["14 remaining textbook lessons + grammar rules (20 total lessons; 6 excluded)."],
    modelPaperAvailable: "Included in Official PECTAA Grade 10 Notification No. 1257.",
    deletedContent:
      "6 of 20 lessons excluded (حسنِ محلہ، بابل کے کھنڈر، اولڈ ایج ہوم، کچھ ذریعہ تعلیم کے باب میں، وغیرہ، یوں کہنے کو پیرایۂ اظہار بہت ہے); zero author/poet intro questions.",
    paperSetterInstructions: "Do not include biographical questions on authors or poets.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1257.pdf",
  },
  {
    id: "g10-pakstudies",
    grade: "10th",
    subject: "Pakistan Studies-10",
    notificationRef: "PECTAA/C&C Unit/2026/1257 (14 Nov 2026)",
    totalTheoryMarks: 100,
    objectiveMarks: 20,
    mcqCount: "20 MCQs (Ch 1,2,5,6,8: 3 each; Ch 3: 5)",
    subjectiveMarks: 80,
    practicalMarks: "None",
    passingRequirement: "40% (40 / 100 marks — IBCC Phase 2 starts Annual 2027)",
    totalDuration: "3 Hours",
    objectiveDuration: "See official No. 1257 model paper",
    subjectiveDuration: "See official No. 1257 model paper",
    questionDistribution: [
      "Part-I (Objective): 20 MCQs — 20 marks",
      "Part-II (Short Qs = 50 marks): Q2 (8/12 Ch 2+6 = 16m), Q3 (8/12 Ch 5+8 = 16m), Q4 (9/13 Ch 1+3 = 18m)",
      "Part-III (Long Qs = 30 marks): Attempt 3/5 × 10m (from Ch 1, 2, 3, 5, 6/8)",
    ],
    attemptRules: "Attempt 25/37 short questions and 3/5 long questions (10 marks each).",
    internalChoices: "Q2 (8/12), Q3 (8/12), Q4 (9/13), Part-III (3/5).",
    pairingScheme: [
      "MCQs: Ch 1 (3), Ch 2 (3), Ch 3 (5), Ch 5 (3), Ch 6 (3), Ch 8 (3).",
      "Short Qs: Q2 (Ch 2+6), Q3 (Ch 5+8), Q4 (Ch 1+3). Long Qs from remaining 6 chapters.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 10 Notification No. 1257.",
    deletedContent:
      "Excluded 2 of 8 chapters completely: Chapter 4 (پاکستان کا جغرافیہ) and Chapter 7 (آبادی، معاشرہ اور پاکستان میں ثقافتی تنوع).",
    paperSetterInstructions: "Note 100-mark / 3-hour format for Pak Studies-10 (distinct from Grade 12's 50-mark / 2-hour format).",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1257.pdf",
  },
  {
    id: "g10-math",
    grade: "10th",
    subject: "Mathematics-10",
    notificationRef: "PECTAA/C&C Unit/2026/1257 (14 Nov 2026)",
    totalTheoryMarks: 75,
    objectiveMarks: 15,
    mcqCount: "15 MCQs",
    subjectiveMarks: 60,
    practicalMarks: "None",
    passingRequirement: "40% (30 / 75 marks — IBCC Phase 2 starts Annual 2027)",
    totalDuration: "2 Hours 30 Minutes",
    objectiveDuration: "20 Minutes",
    subjectiveDuration: "2 Hours 10 Minutes",
    questionDistribution: [
      "Objective: 15 MCQs — 15 marks",
      "Short Qs (36 marks): Q2 (6/9 Ch 1–4 = 12m), Q3 (6/9 Ch 5–8 = 12m), Q4 (6/9 Ch 9–12 = 12m)",
      "Long Part-II (16 marks): Attempt 2/3 × 8m (Q5, Q6, Q7)",
      "Long Part-III (8 marks): Attempt 1/2 × 8m (Q8, Q9)",
    ],
    attemptRules: "Attempt 18/27 short questions, 2/3 Part-II long questions, and 1/2 Part-III long questions.",
    internalChoices: "6/9 per short section; 2/3 in Part-II; 1/2 in Part-III.",
    pairingScheme: [
      "Q5: Ch 1 + Ch 2 | Q6: Ch 3 + Ch 4 | Q7: Ch 5 + Ch 7.",
      "Q8: Ch 6 + Ch 8/11 | Q9: Ch 10 + Ch 9/12.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 10 Notification No. 1257.",
    deletedContent: "Detailed per-unit skipped examples and exercises across Units 1–12 listed in No. 1257 (e.g., 1.3 Q2–4, 2.5 complete, 2.7 complete).",
    paperSetterInstructions: "Follow the Part-II (2/3) + Part-III (1/2) pairing structure in No. 1257.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1257.pdf",
  },
  {
    id: "g10-physics",
    grade: "10th",
    subject: "Physics-10",
    notificationRef: "PECTAA/C&C Unit/2026/1257 (14 Nov 2026)",
    totalTheoryMarks: 60,
    objectiveMarks: 12,
    mcqCount: "12 MCQs (1 MCQ each from Ch 10 to Ch 21)",
    subjectiveMarks: 48,
    practicalMarks: "30 Marks (2 Hours) — Combined Grades 9–10 Practical (Q1: 9th part 1/2=12m; Q2: 10th part 1/2=12m; Notebook 3m; Viva 3m)",
    passingRequirement: "40% (24 / 60 theory — IBCC Phase 2 starts Annual 2027)",
    totalDuration: "2 Hours",
    objectiveDuration: "15 Minutes",
    subjectiveDuration: "1 Hour 45 Minutes",
    questionDistribution: [
      "Q1 (Objective): 12 MCQs — 12 marks",
      "Short Qs (30 marks): Q2 (5/8 Ch 10–13 = 10m), Q3 (5/8 Ch 14–17 = 10m), Q4 (5/8 Ch 18–21 = 10m)",
      "Long Qs (18 marks): Attempt 2/3 × 9m (a=4m, b=5m from different chapters)",
    ],
    attemptRules: "Attempt 15/24 short questions and 2/3 long questions.",
    internalChoices: "5/8 per short section; 2/3 detailed questions.",
    pairingScheme: [
      "Q5: Ch 10–13 | Q6: Ch 14–17 | Q7: Ch 18–21 (parts a & b from different chapters).",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 10 Notification No. 1257 (both Theory & Practical Model Papers).",
    deletedContent:
      "Deleted theory topics in Ch 10–21 plus 8 excluded Physics-10 practicals (critical angle slab, glass prism deviation, series/parallel resistors, NAND burglar alarm, NOT fire alarm, specific heat mixture, ice-to-water graph).",
    paperSetterInstructions: "Parts (a) and (b) of each long question must be from different chapters.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1257.pdf",
  },
  {
    id: "g10-chemistry",
    grade: "10th",
    subject: "Chemistry-10",
    notificationRef: "PECTAA/C&C Unit/2026/1257 (14 Nov 2026)",
    totalTheoryMarks: 60,
    objectiveMarks: 12,
    mcqCount: "12 MCQs (1 each from Ch 14–26 except Ch 25)",
    subjectiveMarks: 48,
    practicalMarks: "30 Marks (2 Hours) — Combined Grades 9–10 Practical (Q1 9th 12m + Q2 10th 12m + Notebook 3m + Viva 3m)",
    passingRequirement: "40% (24 / 60 theory — IBCC Phase 2 starts Annual 2027)",
    totalDuration: "2 Hours",
    objectiveDuration: "15 Minutes",
    subjectiveDuration: "1 Hour 45 Minutes",
    questionDistribution: [
      "Q1 (Objective): 12 MCQs — 12 marks",
      "Short Qs (30 marks): Q2 (5/8 Ch 14–18 = 10m), Q3 (5/8 Ch 19–22 = 10m), Q4 (5/8 Ch 23–26 = 10m)",
      "Long Qs (18 marks): Attempt 2/3 × 9m (a=5m, b=4m)",
    ],
    attemptRules: "Attempt 15/24 short questions and 2/3 detailed questions.",
    internalChoices: "5/8 per short section; 2/3 long questions.",
    pairingScheme: [
      "Q5: Ch 14 + Ch 15 | Q6: Ch 20 + Ch 22 | Q7: Ch 23 + Ch 25.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 10 Notification No. 1257 (Theory & Practical Model Papers).",
    deletedContent:
      "Deleted topics/exercises in Ch 14–26 (e.g., 14.3, 14.9, 15.6 Limiting Reactant, 15.7 Yield) plus 4 excluded Chemistry-10 practicals (carboxylic acid Na2CO3 test, volumetric NaOH standardization, conductivity demo, sugar thermal decomposition).",
    paperSetterInstructions: "No question evaluated from deleted Quick Check, MCQ, SAQ, CRQ, or DQ items listed.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1257.pdf",
  },
  {
    id: "g10-biology",
    grade: "10th",
    subject: "Biology-10",
    notificationRef: "PECTAA/C&C Unit/2026/1257 (14 Nov 2026)",
    totalTheoryMarks: 60,
    objectiveMarks: 12,
    mcqCount: "12 MCQs",
    subjectiveMarks: 48,
    practicalMarks: "30 Marks (2 Hours) — Combined Grades 9–10 Practical",
    passingRequirement: "40% (24 / 60 theory — IBCC Phase 2 starts Annual 2027)",
    totalDuration: "2 Hours",
    objectiveDuration: "15 Minutes",
    subjectiveDuration: "1 Hour 45 Minutes",
    questionDistribution: [
      "Q1 (Objective): 12 MCQs — 12 marks",
      "Short Qs (30 marks): Q2 (5/8 Ch 1,2,5 = 10m), Q3 (5/8 Ch 3,4,6,7 = 10m), Q4 (5/8 Ch 8–10 = 10m)",
      "Long Qs (18 marks): Attempt 2/3 × 9m (a=5m, b=4m)",
    ],
    attemptRules: "Attempt 15/24 short questions and 2/3 detailed questions.",
    internalChoices: "5/8 per short section; 2/3 long questions.",
    pairingScheme: [
      "Q5: Ch 1 + Ch 3 | Q6: Ch 6 + Ch 5 | Q7: Ch 9 + Ch 8.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 10 Notification No. 1257 (Theory & Practical Model Papers).",
    deletedContent:
      "Deleted topics/side boxes across Chapters 1–10 plus 4 excluded Biology-10 practicals (potato strip osmosis, rest vs exercise breathing rate, tar in cigarette smoke, frog shin muscle 12V DC contraction).",
    paperSetterInstructions: "All side boxes inside deleted topics are automatically excluded.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1257.pdf",
  },
  {
    id: "g10-cs",
    grade: "10th",
    subject: "Computer Science & Entrepreneurship-10",
    notificationRef: "PECTAA/C&C Unit/2026/1257 (14 Nov 2026)",
    totalTheoryMarks: 50,
    objectiveMarks: 10,
    mcqCount: "10 MCQs (1 mark each)",
    subjectiveMarks: 40,
    practicalMarks: "50 Marks (2 Hours) — Combined Grades 9–10 Practical (Q1 9th 20m + Q2 10th 20m + Notebook 5m + Viva 5m)",
    passingRequirement: "40% (20 / 50 theory — IBCC Phase 2 starts Annual 2027)",
    totalDuration: "2 Hours",
    objectiveDuration: "15 Minutes",
    subjectiveDuration: "1 Hour 45 Minutes",
    questionDistribution: [
      "Q1 (Objective): 10 MCQs — 10 marks",
      "Short Qs (24 marks): Q2 (4/6 Ch 1,3 = 8m), Q3 (4/6 Ch 4,5 = 8m), Q4 (4/6 Ch 6–8 = 8m)",
      "Long Qs (16 marks): Attempt 2/3 × 8m (Q5, Q6, Q7)",
    ],
    attemptRules: "Attempt 12/18 short questions and 2/3 detailed questions.",
    internalChoices: "4/6 per short section; 2/3 detailed questions.",
    pairingScheme: [
      "Q5: Unit 1 | Q6: Unit 4 | Q7: Unit 6 or Unit 8.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 10 Notification No. 1257 (Theory & Practical Model Papers).",
    deletedContent: "Unit 2 (System Recovery and Advanced Maintenance) completely excluded, plus excluded topics & practicals listed in No. 1257.",
    paperSetterInstructions: "No question evaluated from Unit 2 or excluded practical numbers.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1257.pdf",
  },
  {
    id: "g10-genscience",
    grade: "10th",
    subject: "General Science-10",
    notificationRef: "PECTAA/C&C Unit/2026/1257 (14 Nov 2026)",
    totalTheoryMarks: 50,
    objectiveMarks: 12,
    mcqCount: "12 MCQs (Chapters 7–11)",
    subjectiveMarks: 38,
    practicalMarks: "None",
    passingRequirement: "40% (20 / 50 marks — IBCC Phase 2 starts Annual 2027)",
    totalDuration: "2 Hours",
    objectiveDuration: "20 Minutes",
    subjectiveDuration: "1 Hour 40 Minutes",
    questionDistribution: [
      "Q1 (Objective): 12 MCQs — 12 marks",
      "Short Qs (24 marks; 3 marks each!): Q2 (4/6 Ch 7–8 = 12m), Q3 (4/6 Ch 9–11 = 12m)",
      "Long Qs (14 marks; 7 marks each!): Attempt 2/3 × 7m (a=4m, b=3m)",
    ],
    attemptRules: "Attempt 8/12 short questions (3 marks each) and 2/3 long questions (7 marks each).",
    internalChoices: "4/6 per short block; 2/3 detailed questions.",
    pairingScheme: [
      "Q4: Ch 7 + Ch 11 | Q5: Ch 8 | Q6: Ch 9 + Ch 10.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 10 Notification No. 1257.",
    deletedContent: "Deleted topics & exercises in Chapters 7–11 listed in No. 1257.",
    paperSetterInstructions: "Note 50-mark structure and 3-mark short questions.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1257.pdf",
  },

  // ========================= GRADE 11 (Class 11) =========================
  {
    id: "g11-english",
    grade: "11th",
    subject: "English-11",
    notificationRef: "PECTAA/C&C Unit/2026/1239 (6 Nov 2026)",
    totalTheoryMarks: 100,
    objectiveMarks: 20,
    mcqCount: "20 MCQs (15 synonyms/unit MCQs + 5 verb form MCQs)",
    subjectiveMarks: 80,
    practicalMarks: "None",
    passingRequirement: "40% (40 / 100 marks — IBCC Phase 1 active from 2026)",
    totalDuration: "3 Hours",
    objectiveDuration: "30 Minutes",
    subjectiveDuration: "2 Hours 30 Minutes",
    questionDistribution: [
      "Q1 (Objective): 20 MCQs — 20 marks",
      "Section I Short Qs: Q2 (7/10 = 14m), Q3 (5/8 = 10m), Q4 (3/5 = 6m)",
      "Section II Composition: Q5 Letter/Application (10m), Q6 Story (10m), Q7(a) Stanza (5m), Q7(b) Punctuation (5m), Q7(c) Pair of Words (5/8 = 5m), Q8 Translation into Urdu OR Essay (15m)",
    ],
    attemptRules: "Follow exact quotas across Q2–Q8.",
    internalChoices: "Q2 (7/10), Q3 (5/8), Q4 (3/5), Q5 (Letter OR Application), Q6 (1/2 Stories), Q7(c) (5/8), Q8 (Translation OR Essay for Eng/Foreign medium).",
    pairingScheme: [
      "10 remaining textbook units (Units 1,2,3,5,6,8,10,11,13,14) mapped directly to MCQs & Q2–Q4.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 11 Notification No. 1239.",
    deletedContent:
      "Excluded 4 of 14 units: Unit 4 (Team Moon), Unit 7 (What You Do is What You are), Unit 9 (Freedom — Poem), and Unit 12 (The Impact of AI on Society).",
    paperSetterInstructions: "Mandatory that no objective or subjective question is taken from excluded Units 4, 7, 9, or 12.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-Notification-Grade-11_Redacted_Redacted.pdf",
  },
  {
    id: "g11-urdu",
    grade: "11th",
    subject: "Urdu-11",
    notificationRef: "PECTAA/C&C Unit/2026/1239 (6 Nov 2026)",
    totalTheoryMarks: 100,
    objectiveMarks: 20,
    mcqCount: "20 MCQs",
    subjectiveMarks: 80,
    practicalMarks: "None",
    passingRequirement: "40% (40 / 100 marks — IBCC Phase 1)",
    totalDuration: "3 Hours",
    objectiveDuration: "20 Minutes",
    subjectiveDuration: "2 Hours 40 Minutes",
    questionDistribution: [
      "Objective: 20 MCQs — 20 marks (20 minutes)",
      "Subjective: Ash'aar Tashreeh (Nazm + Ghazal), Prose Siyāq-o-Sabāq, Sabaq Khulasa, Nazm Khulasa, Dialogue/Application/Summary — 80 marks (2h 40m)",
    ],
    attemptRules: "Follow Urdu-11 model paper quotas in No. 1239.",
    internalChoices: "Choice among passages, stanzas, and composition options.",
    pairingScheme: ["Based on non-excluded Urdu-11 prose, nazm, ghazal, and grammar topics in No. 1239."],
    modelPaperAvailable: "Included in Official PECTAA Grade 11 Notification No. 1239.",
    deletedContent: "Excluded lessons/poems listed in No. 1239; no author/poet intro questions.",
    paperSetterInstructions: "Zero questions from excluded lessons or author/poet biographical introductions.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-Notification-Grade-11_Redacted_Redacted.pdf",
  },
  {
    id: "g11-islamiat",
    grade: "11th",
    subject: "Islamiat Compulsory-11",
    notificationRef: "PECTAA/C&C Unit/2026/1239 (6 Nov 2026)",
    totalTheoryMarks: 50,
    objectiveMarks: 10,
    mcqCount: "10 MCQs (1 mark each)",
    subjectiveMarks: 40,
    practicalMarks: "None",
    passingRequirement: "40% (20 / 50 marks — IBCC Phase 1)",
    totalDuration: "2 Hours",
    objectiveDuration: "See official No. 1239 model paper",
    subjectiveDuration: "See official No. 1239 model paper",
    questionDistribution: [
      "Part-I (Objective): 10 MCQs — 10 marks",
      "Part-II (Short Qs = 20 marks): Q2 (5/8 = 10m), Q3 (5/8 = 10m)",
      "Part-III (Subjective = 20 marks): Q4 Ahadith translation (2/4 × 2m = 4m) + Q5 Long Qs (2/4 × 8m = 16m)",
    ],
    attemptRules: "Attempt 10/16 short Qs, 2/4 Ahadith (4 marks total), and 2/4 long questions (8 marks each = 16 marks).",
    internalChoices: "Q2 (5/8), Q3 (5/8), Q4 (2/4), Q5 (2/4).",
    pairingScheme: ["Chapters mapped per No. 1239 Islamiat-11 pairing table."],
    modelPaperAvailable: "Included in Official PECTAA Grade 11 Notification No. 1239.",
    deletedContent: "Excluded Ahadith 3, 5, 8, 12 and designated subtopics across Ch 4, 5, 6, 7 in No. 1239.",
    paperSetterInstructions: "Note 50-mark / 2-hour structure and 4m Hadith + 16m Long Q split.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-Notification-Grade-11_Redacted_Redacted.pdf",
  },
  {
    id: "g11-math",
    grade: "11th",
    subject: "Mathematics-11",
    notificationRef: "PECTAA/C&C Unit/2026/1239 (6 Nov 2026)",
    totalTheoryMarks: 100,
    objectiveMarks: 20,
    mcqCount: "20 MCQs (1 mark each)",
    subjectiveMarks: 80,
    practicalMarks: "None",
    passingRequirement: "40% (40 / 100 marks — IBCC Phase 1)",
    totalDuration: "3 Hours",
    objectiveDuration: "30 Minutes",
    subjectiveDuration: "2 Hours 30 Minutes",
    questionDistribution: [
      "Q1 (Objective): 20 MCQs — 20 marks",
      "Short Qs (50 marks): Q2 (8/12 Units 1–5 = 16m), Q3 (8/12 Units 6,7,9,10 = 16m), Q4 (9/13 Units 11–14 = 18m)",
      "Long Qs (30 marks): Attempt 3/5 × 10m (a=5m, b=5m)",
    ],
    attemptRules: "Attempt 25/37 short questions and 3/5 detailed questions.",
    internalChoices: "8/12, 8/12, 9/13 short; 3/5 long.",
    pairingScheme: [
      "Q5: Unit 1 + Unit 2/3 | Q6: Unit 4 + Unit 5/9 | Q7: Unit 6 + Unit 7 | Q8: Unit 10 + Unit 12 | Q9: Unit 13 + Unit 14.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 11 Notification No. 1239.",
    deletedContent: "Skipped examples and exercise questions across Units 1–14 specified in No. 1239.",
    paperSetterInstructions: "All problems limited strictly to retained ALP textbook exercises.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-Notification-Grade-11_Redacted_Redacted.pdf",
  },
  {
    id: "g11-physics",
    grade: "11th",
    subject: "Physics-11",
    notificationRef: "PECTAA/C&C Unit/2026/1239 (6 Nov 2026)",
    totalTheoryMarks: 85,
    objectiveMarks: 17,
    mcqCount: "17 MCQs (1 mark each)",
    subjectiveMarks: 68,
    practicalMarks: "See official board practical notification / model paper",
    passingRequirement: "40% (34 / 85 theory — IBCC Phase 1)",
    totalDuration: "3 Hours",
    objectiveDuration: "20 Minutes",
    subjectiveDuration: "2 Hours 40 Minutes",
    questionDistribution: [
      "Q1 (Objective): 17 MCQs — 17 marks",
      "Short Qs (44 marks): Q2 (8/12 Ch 1–4 = 16m), Q3 (8/12 Ch 5–8 = 16m), Q4 (6/9 Ch 9–12 = 12m)",
      "Long Qs (24 marks): Attempt 3/5 × 8m (a=5m, b=3m)",
    ],
    attemptRules: "Attempt 22/33 short questions and 3/5 detailed questions.",
    internalChoices: "8/12, 8/12, 6/9 short; 3/5 long.",
    pairingScheme: [
      "Q5: Ch 1–3 | Q6: Ch 4–6 | Q7: Ch 7–8 | Q8: Ch 9–10 | Q9: Ch 11–12.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 11 Notification No. 1239.",
    deletedContent: "Excluded theory topics & numericals listed in No. 1239; excluded 11th practicals listed in Grade 12 PDF No. 1258.",
    paperSetterInstructions: "Ensure no objective, short, or numerical items stem from deleted topics.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-Notification-Grade-11_Redacted_Redacted.pdf",
  },
  {
    id: "g11-chemistry",
    grade: "11th",
    subject: "Chemistry-11",
    notificationRef: "PECTAA/C&C Unit/2026/1239 (6 Nov 2026)",
    totalTheoryMarks: 85,
    objectiveMarks: 17,
    mcqCount: "17 MCQs (1 mark each)",
    subjectiveMarks: 68,
    practicalMarks: "See official board practical notification / model paper",
    passingRequirement: "40% (34 / 85 theory — IBCC Phase 1)",
    totalDuration: "3 Hours",
    objectiveDuration: "20 Minutes",
    subjectiveDuration: "2 Hours 40 Minutes",
    questionDistribution: [
      "Q1 (Objective): 17 MCQs — 17 marks",
      "Short Qs (44 marks): Q2 (8/12 = 16m), Q3 (8/12 = 16m), Q4 (6/9 = 12m)",
      "Long Qs (24 marks): Attempt 3/5 × 8m (a=4m, b=4m)",
    ],
    attemptRules: "Attempt 22/33 short questions and 3/5 detailed questions.",
    internalChoices: "8/12, 8/12, 6/9 short; 3/5 long.",
    pairingScheme: [
      "Q5: Ch 2 + Ch 5 | Q6: Ch 3 + Ch 7 | Q7: Ch 8 + Ch 9 | Q8: Ch 11 + Ch 14 | Q9: Ch 12 + Ch 13.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 11 Notification No. 1239.",
    deletedContent: "Chapter 16 completely excluded plus chapter-specific deletions in No. 1239; excluded 11th practicals in No. 1258.",
    paperSetterInstructions: "Chapter 16 and listed exercise deletions strictly omitted.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-Notification-Grade-11_Redacted_Redacted.pdf",
  },
  {
    id: "g11-biology",
    grade: "11th",
    subject: "Biology-11",
    notificationRef: "PECTAA/C&C Unit/2026/1239 (6 Nov 2026)",
    totalTheoryMarks: 85,
    objectiveMarks: 17,
    mcqCount: "17 MCQs (1 mark each)",
    subjectiveMarks: 68,
    practicalMarks: "See official board practical notification / model paper",
    passingRequirement: "40% (34 / 85 theory — IBCC Phase 1)",
    totalDuration: "3 Hours",
    objectiveDuration: "20 Minutes",
    subjectiveDuration: "2 Hours 40 Minutes",
    questionDistribution: [
      "Q1 (Objective): 17 MCQs — 17 marks",
      "Short Qs (44 marks): Q2 (8/12 = 16m), Q3 (8/12 = 16m), Q4 (6/9 = 12m)",
      "Long Qs (24 marks): Attempt 3/5 × 8m (a=4m, b=4m)",
    ],
    attemptRules: "Attempt 22/33 short questions and 3/5 detailed questions.",
    internalChoices: "8/12, 8/12, 6/9 short; 3/5 long.",
    pairingScheme: [
      "Q5: Ch 1 + Ch 11 | Q6: Ch 3 + Ch 9 | Q7: Ch 6 + Ch 10 | Q8: Ch 2 + Ch 12 | Q9: Ch 4 + Ch 8.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 11 Notification No. 1239.",
    deletedContent: "Excluded subtopics & side boxes in No. 1239; excluded 11th practicals listed in No. 1258.",
    paperSetterInstructions: "All side boxes inside deleted topics are excluded.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-Notification-Grade-11_Redacted_Redacted.pdf",
  },
  {
    id: "g11-cs",
    grade: "11th",
    subject: "Computer Science & Entrepreneurship-11",
    notificationRef: "PECTAA/C&C Unit/2026/1239 (6 Nov 2026)",
    totalTheoryMarks: 75,
    objectiveMarks: 15,
    mcqCount: "15 MCQs (1 mark each)",
    subjectiveMarks: 60,
    practicalMarks: "See official board practical notification / model paper",
    passingRequirement: "40% (30 / 75 theory — IBCC Phase 1)",
    totalDuration: "2 Hours 30 Minutes",
    objectiveDuration: "20 Minutes",
    subjectiveDuration: "2 Hours 10 Minutes",
    questionDistribution: [
      "Q1 (Objective): 15 MCQs — 15 marks",
      "Short Qs (36 marks): Q2 (6/9 = 12m), Q3 (6/9 = 12m), Q4 (6/9 = 12m)",
      "Long Qs (24 marks): Attempt 3/5 × 8m",
    ],
    attemptRules: "Attempt 18/27 short questions and 3/5 detailed questions.",
    internalChoices: "6/9 per short section; 3/5 long.",
    pairingScheme: [
      "Q5: Ch 2 | Q6: Ch 3 | Q7: Ch 4 | Q8: Ch 5 | Q9: Ch 7.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 11 Notification No. 1239.",
    deletedContent: "Excluded chapters/topics in No. 1239; excluded 11th practicals listed in Grade 12 PDF No. 1258.",
    paperSetterInstructions: "No questions from excluded sections or practicals.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-Notification-Grade-11_Redacted_Redacted.pdf",
  },
  {
    id: "g11-masihi",
    grade: "11th",
    subject: "Masihi Taleem-11",
    notificationRef: "PECTAA/C&C Unit/2026/1256 (14 Nov 2026 — Masihi Taleem Only)",
    totalTheoryMarks: 50,
    objectiveMarks: 10,
    mcqCount: "10 MCQs (1 mark each)",
    subjectiveMarks: 40,
    practicalMarks: "None",
    passingRequirement: "40% (20 / 50 marks — IBCC Phase 1)",
    totalDuration: "2 Hours",
    objectiveDuration: "See official No. 1256 model paper",
    subjectiveDuration: "See official No. 1256 model paper",
    questionDistribution: [
      "Part-I (Objective): 10 MCQs — 10 marks",
      "Part-II (Short Qs = 20 marks): Q2 (5/8 = 10m), Q3 (5/8 = 10m)",
      "Part-III (Subjective = 20 marks): Q4 Verses (2/4 = 4m) + Note/Long Qs (16m)",
    ],
    attemptRules: "Attempt 10/16 short Qs, 2/4 verses, and Part-III note/long options per No. 1256.",
    internalChoices: "5/8, 5/8 short; 2/4 verses + long/note options.",
    pairingScheme: ["Chapters paired per No. 1256 Masihi Taleem-11 scheme."],
    modelPaperAvailable: "Included in Official PECTAA Notification No. 1256 (Masihi Taleem-11 only).",
    deletedContent: "Subject-specific deletions in No. 1256 (notice 1256 does NOT replace Grade 11 main notice No. 1239).",
    paperSetterInstructions: "Follow Masihi Taleem-11 instructions inside No. 1256.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-Notification-14.11.2026-1256.pdf",
  },

  // ========================= GRADE 12 (Class 12) =========================
  {
    id: "g12-english",
    grade: "12th",
    subject: "English-12",
    notificationRef: "PECTAA/C&C Unit/2026/1258 (14 Nov 2026)",
    totalTheoryMarks: 100,
    objectiveMarks: 20,
    mcqCount: "20 MCQs (1 mark each)",
    subjectiveMarks: 80,
    practicalMarks: "None",
    passingRequirement: "40% (40 / 100 marks — IBCC Phase 2 starts Annual 2027)",
    totalDuration: "3 Hours",
    objectiveDuration: "30 Minutes",
    subjectiveDuration: "2 Hours 30 Minutes",
    questionDistribution: [
      "Objective: 20 MCQs — 20 marks",
      "Subjective (80 marks): Q2 Short Qs (5/8 = 10m), Q3 Short Qs (5/8 = 10m), Q4 Unit 13 Novel Short Qs (5/8 = 10m), Q5 Poem Critical Appreciation (10m), Q6 Essay (1/4 = 15m), Q7 Idioms/Phrasal Verbs (5/8 = 10m), Q8 Unseen Urdu->Eng Para OR English Medium alternative (15m)",
    ],
    attemptRules: "Attempt 15/24 short questions across Q2–Q4, plus Q5, Q6 (1/4 essays), Q7 (5/8), and Q8.",
    internalChoices: "Q2–Q4 (5/8 each), Q6 (1/4), Q7 (5/8), Q8 (unseen translation OR para).",
    pairingScheme: ["Based on remaining 8 textbook units (plus Unit 13 Novel for Q4) and Grammar/Composition."],
    modelPaperAvailable: "Included in Official PECTAA Grade 12 Notification No. 1258.",
    deletedContent: "Excluded 5 of 13 units: Units 2, 3, 6, 8, and 12.",
    paperSetterInstructions: "Mandatory zero items from excluded Units 2, 3, 6, 8, and 12.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1258-2.pdf",
  },
  {
    id: "g12-urdu",
    grade: "12th",
    subject: "Urdu-12",
    notificationRef: "PECTAA/C&C Unit/2026/1258 (14 Nov 2026)",
    totalTheoryMarks: 100,
    objectiveMarks: 20,
    mcqCount: "20 MCQs",
    subjectiveMarks: 80,
    practicalMarks: "None",
    passingRequirement: "40% (40 / 100 marks — IBCC Phase 2 starts Annual 2027)",
    totalDuration: "3 Hours",
    objectiveDuration: "20 Minutes",
    subjectiveDuration: "2 Hours 40 Minutes",
    questionDistribution: [
      "Objective: 20 MCQs — 20 marks (20 minutes)",
      "Subjective: Poetry Tashreeh (Nazm + Ghazal), Prose Siyāq-o-Sabāq, Khulasa, Essay (Mazmoon), Letter/Autobiography — 80 marks (2h 40m)",
    ],
    attemptRules: "Follow Urdu-12 model paper choices inside No. 1258.",
    internalChoices: "Choices across couplets, prose excerpts, essays, and composition.",
    pairingScheme: ["Drawn from 16 remaining lessons (6 of 22 lessons excluded) plus grammar."],
    modelPaperAvailable: "Included in Official PECTAA Grade 12 Notification No. 1258.",
    deletedContent: "6 of 22 lessons excluded per No. 1258; no author/poet biographical introduction questions.",
    paperSetterInstructions: "No biographical questions on authors or poets.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1258-2.pdf",
  },
  {
    id: "g12-pakstudies",
    grade: "12th",
    subject: "Pakistan Studies-12",
    notificationRef: "PECTAA/C&C Unit/2026/1258 (14 Nov 2026)",
    totalTheoryMarks: 50,
    objectiveMarks: 10,
    mcqCount: "10 MCQs",
    subjectiveMarks: 40,
    practicalMarks: "None",
    passingRequirement: "40% (20 / 50 marks — IBCC Phase 2 starts Annual 2027)",
    totalDuration: "2 Hours",
    objectiveDuration: "See official No. 1258 model paper",
    subjectiveDuration: "See official No. 1258 model paper",
    questionDistribution: [
      "Part-I (Objective): 10 MCQs — 10 marks",
      "Part-II (Short Qs = 24 marks): Q2 (6/9 = 12m), Q3 (6/9 = 12m)",
      "Part-III (Long Qs = 16 marks): Q4, Q5, Q6 (Attempt 2/3 × 8m)",
    ],
    attemptRules: "Attempt 12/18 short questions and 2/3 detailed questions.",
    internalChoices: "Q2 (6/9), Q3 (6/9), Part-III (2/3).",
    pairingScheme: ["Chapters paired across remaining Pak Studies-12 chapters inside No. 1258."],
    modelPaperAvailable: "Included in Official PECTAA Grade 12 Notification No. 1258.",
    deletedContent: "Excluded Chapter 3 (پاکستان کا انتظامی نظام) and Chapter 4 (پاکستان کے وسائل اور معاشی ترقی).",
    paperSetterInstructions: "Note 50-mark / 2-hour structure (unlike Grade 10's 100-mark / 3-hour Pak Studies paper).",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1258-2.pdf",
  },
  {
    id: "g12-math",
    grade: "12th",
    subject: "Mathematics-12",
    notificationRef: "PECTAA/C&C Unit/2026/1258 (14 Nov 2026)",
    totalTheoryMarks: 100,
    objectiveMarks: 20,
    mcqCount: "20 MCQs",
    subjectiveMarks: 80,
    practicalMarks: "None",
    passingRequirement: "40% (40 / 100 marks — IBCC Phase 2 starts Annual 2027)",
    totalDuration: "3 Hours",
    objectiveDuration: "See official No. 1258 model paper",
    subjectiveDuration: "See official No. 1258 model paper",
    questionDistribution: [
      "Objective: 20 MCQs — 20 marks",
      "Short Qs (50 marks): Q2 (8/12 = 16m), Q3 (8/12 = 16m), Q4 (9/13 = 18m)",
      "Long Qs (30 marks): Attempt 3/5 × 10m (a=5m, b=5m)",
    ],
    attemptRules: "Attempt 25/37 short questions and 3/5 detailed questions.",
    internalChoices: "8/12, 8/12, 9/13 short; 3/5 long.",
    pairingScheme: [
      "5 long questions (Q5–Q9), each split into (a)=5m and (b)=5m. (Official PDF prints a numbering label quirk on the last row showing Q-6 for Units 6 & 8—verify pairing table in No. 1258 directly.)",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 12 Notification No. 1258.",
    deletedContent: "Per-unit excluded exercises & examples tabulated in No. 1258.",
    paperSetterInstructions: "No problems or definitions selected from deleted exercises.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1258-2.pdf",
  },
  {
    id: "g12-physics",
    grade: "12th",
    subject: "Physics-12",
    notificationRef: "PECTAA/C&C Unit/2026/1258 (14 Nov 2026)",
    totalTheoryMarks: 85,
    objectiveMarks: 17,
    mcqCount: "17 MCQs",
    subjectiveMarks: 68,
    practicalMarks: "See official board practical notification / model paper (No. 1258 lists excluded practicals for Grades 11 & 12)",
    passingRequirement: "40% (34 / 85 theory — IBCC Phase 2 starts Annual 2027)",
    totalDuration: "3 Hours",
    objectiveDuration: "20 Minutes",
    subjectiveDuration: "2 Hours 40 Minutes",
    questionDistribution: [
      "Q1 (Objective): 17 MCQs — 17 marks",
      "Short Qs (44 marks): Q2 (8/12 Ch 13–15 = 16m), Q3 (8/12 Ch 16–18 = 16m), Q4 (6/9 Ch 19–21 = 12m)",
      "Long Qs (24 marks): Attempt 3/5 × 8m (a=5m theory, b=3m numerical)",
    ],
    attemptRules: "Attempt 22/33 short questions and 3/5 detailed questions.",
    internalChoices: "8/12, 8/12, 6/9 short; 3/5 long.",
    pairingScheme: [
      "Q5: Ch 13 + Ch 14 | Q6: Ch 15 + Ch 16 | Q7: Ch 17 | Q8: Ch 18 + Ch 19 | Q9: Ch 20 + Ch 21.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 12 Notification No. 1258.",
    deletedContent: "Deleted chapter topics/numericals plus Lists of Excluded Practicals (Grades 11 & 12) in No. 1258.",
    paperSetterInstructions: "Long questions pair a 5-mark theory part (a) with a 3-mark numerical part (b).",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1258-2.pdf",
  },
  {
    id: "g12-chemistry",
    grade: "12th",
    subject: "Chemistry-12",
    notificationRef: "PECTAA/C&C Unit/2026/1258 (14 Nov 2026)",
    totalTheoryMarks: 85,
    objectiveMarks: 17,
    mcqCount: "17 MCQs (1 each from Ch 17–33)",
    subjectiveMarks: 68,
    practicalMarks: "See official board practical notification / model paper (No. 1258 lists excluded practicals for Grades 11 & 12)",
    passingRequirement: "40% (34 / 85 theory — IBCC Phase 2 starts Annual 2027)",
    totalDuration: "3 Hours",
    objectiveDuration: "20 Minutes",
    subjectiveDuration: "2 Hours 40 Minutes",
    questionDistribution: [
      "Q1 (Objective): 17 MCQs — 17 marks",
      "Short Qs (44 marks): Q2 (8/12 = 16m), Q3 (8/12 = 16m), Q4 (6/9 = 12m)",
      "Long Qs (24 marks): Attempt 3/5 × 8m (a=4m, b=4m)",
    ],
    attemptRules: "Attempt 22/33 short questions and 3/5 detailed questions.",
    internalChoices: "8/12, 8/12, 6/9 short; 3/5 long.",
    pairingScheme: [
      "Q5: Ch 17 + Ch 21 | Q6: Ch 18 + Ch 26 | Q7: Ch 20 + Ch 31 | Q8: Ch 22 + Ch 32 | Q9: Ch 23 + Ch 33.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 12 Notification No. 1258.",
    deletedContent: "Deleted topics across Ch 17–33 plus Lists of Excluded Practicals (Grades 11 & 12) in No. 1258.",
    paperSetterInstructions: "Each chapter Ch 17–33 contributes 1 MCQ; avoid deleted reactions and topics.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1258-2.pdf",
  },
  {
    id: "g12-biology",
    grade: "12th",
    subject: "Biology-12",
    notificationRef: "PECTAA/C&C Unit/2026/1258 (14 Nov 2026)",
    totalTheoryMarks: 85,
    objectiveMarks: 17,
    mcqCount: "17 MCQs",
    subjectiveMarks: 68,
    practicalMarks: "See official board practical notification / model paper (No. 1258 lists excluded practicals for Grades 11 & 12)",
    passingRequirement: "40% (34 / 85 theory — IBCC Phase 2 starts Annual 2027)",
    totalDuration: "3 Hours",
    objectiveDuration: "20 Minutes",
    subjectiveDuration: "2 Hours 40 Minutes",
    questionDistribution: [
      "Q1 (Objective): 17 MCQs — 17 marks",
      "Short Qs (44 marks): Q2 (8/12 = 16m), Q3 (8/12 = 16m), Q4 (6/9 = 12m)",
      "Long Qs (24 marks): Attempt 3/5 × 8m (a=4m, b=4m)",
    ],
    attemptRules: "Attempt 22/33 short questions and 3/5 detailed questions.",
    internalChoices: "8/12, 8/12, 6/9 short; 3/5 long.",
    pairingScheme: [
      "Q5: Ch 13 + Ch 25 | Q6: Ch 14 + Ch 24 | Q7: Ch 15 + Ch 21 | Q8: Ch 16 + Ch 20 | Q9: Ch 17 + Ch 19.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 12 Notification No. 1258.",
    deletedContent: "Deleted topics/side boxes across Grade 12 chapters plus Lists of Excluded Practicals (Grades 11 & 12) in No. 1258.",
    paperSetterInstructions: "All side boxes inside excluded topics are excluded.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1258-2.pdf",
  },
  {
    id: "g12-cs",
    grade: "12th",
    subject: "Computer Science & Entrepreneurship-12",
    notificationRef: "PECTAA/C&C Unit/2026/1258 (14 Nov 2026)",
    totalTheoryMarks: 75,
    objectiveMarks: 15,
    mcqCount: "15 MCQs",
    subjectiveMarks: 60,
    practicalMarks: "See official board practical notification / model paper (No. 1258 lists excluded practicals for Grades 11 & 12)",
    passingRequirement: "40% (30 / 75 theory — IBCC Phase 2 starts Annual 2027)",
    totalDuration: "2 Hours 30 Minutes",
    objectiveDuration: "20 Minutes",
    subjectiveDuration: "2 Hours 10 Minutes",
    questionDistribution: [
      "Q1 (Objective): 15 MCQs — 15 marks",
      "Short Qs (36 marks): Q2 (6/9 = 12m), Q3 (6/9 = 12m), Q4 (6/9 = 12m)",
      "Long Qs (24 marks): Attempt 3/5 × 8m",
    ],
    attemptRules: "Attempt 18/27 short questions and 3/5 detailed questions.",
    internalChoices: "6/9 per short section; 3/5 long.",
    pairingScheme: [
      "Q5: Unit 1 | Q6: Unit 3 | Q7: Unit 6 | Q8: Unit 8 | Q9: Unit 9.",
    ],
    modelPaperAvailable: "Included in Official PECTAA Grade 12 Notification No. 1258.",
    deletedContent: "Unit 5 (Code Testing and Debugging) completely excluded, plus excluded topics & Grade 11–12 practicals listed in No. 1258.",
    paperSetterInstructions: "Zero questions from Unit 5 or excluded subtopics/practicals.",
    officialModelPaperUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1258-2.pdf",
  },
];
