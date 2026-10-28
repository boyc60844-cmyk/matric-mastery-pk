export type BoardWatchCategory =
  | "confirmed"
  | "reported"
  | "expected"
  | "rumor"
  | "pattern"
  | "deadline";

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
  | "sahiwal";

export type VerificationStatus =
  | "officially-confirmed"
  | "credibly-reported"
  | "historically-expected"
  | "unverified-rumor"
  | "superseded"
  | "archived";

export interface BoardInfo {
  id: BoardId;
  name: string;
  shortName: string;
  urduName: string;
  website: string;
  notificationsUrl: string;
  dateSheetUrl: string;
  modelPapersUrl: string;
  onlineServicesUrl: string;
  headquarters: string;
  districts: string[];
  helpline: string;
  code: string;
  jurisdictionSummary: string;
}

export interface BoardWatchEntry {
  id: string;
  headline: string;
  summary: string;
  category: BoardWatchCategory;
  status: VerificationStatus;
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
  sourceType: "official_board" | "pbcc_government" | "news_outlet" | "historical_archive";
  whatItMeans: string;
  evidenceNotes: string;
  actionRequired?: string;
  isDeadline?: boolean;
  deadlineDate?: string;
  isExpired?: boolean;
  supersededBy?: string;
  supersedes?: string;
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
  subject: string;
  classes: ("9th" | "10th" | "11th" | "12th")[];
  theoryMarks: number;
  practicalMarks: number;
  totalMarks: number;
  objectiveMcqsMarks: number;
  subjectiveMarks: number;
  passingMarks: number;
  timeAllowed: string;
  sloBreakdown: {
    knowledge: string;
    understanding: string;
    application: string;
  };
  keyComponents: string[];
  pairingSchemeStatus: "structural-blueprint" | "officially-modeled";
  pairingNote: string;
  officialModelPaperUrl: string;
}

// ---------------------------------------------------------------------------
// 9 PUNJAB BOARDS DIRECTORY + PBCC
// ---------------------------------------------------------------------------
export const PUNJAB_BOARDS: BoardInfo[] = [
  {
    id: "lahore",
    name: "Board of Intermediate & Secondary Education, Lahore",
    shortName: "BISE Lahore",
    urduName: "بورڈ آف انٹرمیڈیٹ اینڈ سیکنڈری ایجوکیشن، لاہور",
    website: "https://www.biselahore.com",
    notificationsUrl: "https://www.biselahore.com",
    dateSheetUrl: "https://www.biselahore.com",
    modelPapersUrl: "https://www.biselahore.com",
    onlineServicesUrl: "https://www.biselahore.com",
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
    dateSheetUrl: "https://biserawalpindi.edu.pk",
    modelPapersUrl: "https://biserawalpindi.edu.pk",
    onlineServicesUrl: "https://eservices.biserawalpindi.edu.pk",
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
    notificationsUrl: "https://web.bisemultan.edu.pk",
    dateSheetUrl: "https://web.bisemultan.edu.pk",
    modelPapersUrl: "https://web.bisemultan.edu.pk",
    onlineServicesUrl: "https://web.bisemultan.edu.pk",
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
    dateSheetUrl: "https://www.bisefsd.edu.pk",
    modelPapersUrl: "https://www.bisefsd.edu.pk",
    onlineServicesUrl: "https://www.bisefsd.edu.pk",
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
    dateSheetUrl: "https://www.bisegrw.edu.pk",
    modelPapersUrl: "https://www.bisegrw.edu.pk",
    onlineServicesUrl: "https://www.bisegrw.edu.pk",
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
    dateSheetUrl: "https://www.bisesargodha.edu.pk",
    modelPapersUrl: "https://www.bisesargodha.edu.pk",
    onlineServicesUrl: "https://www.bisesargodha.edu.pk",
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
    dateSheetUrl: "https://www.bisebwp.edu.pk",
    modelPapersUrl: "https://www.bisebwp.edu.pk",
    onlineServicesUrl: "https://www.bisebwp.edu.pk",
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
    dateSheetUrl: "https://www.bisedgkhan.edu.pk",
    modelPapersUrl: "https://www.bisedgkhan.edu.pk",
    onlineServicesUrl: "https://www.bisedgkhan.edu.pk",
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
    website: "https://www.bisesahiwal.edu.pk",
    notificationsUrl: "https://www.bisesahiwal.edu.pk",
    dateSheetUrl: "https://www.bisesahiwal.edu.pk",
    modelPapersUrl: "https://www.bisesahiwal.edu.pk",
    onlineServicesUrl: "https://www.bisesahiwal.edu.pk",
    headquarters: "Farid Town, Sahiwal",
    districts: ["Sahiwal", "Okara", "Pakpattan"],
    helpline: "+92 40 9200100",
    code: "SWL",
    jurisdictionSummary: "Sahiwal Division (Sahiwal, Okara, Pakpattan)",
  },
];

// PBCC Overview Information
export const PBCC_INFO = {
  name: "Punjab Boards Committee of Chairmen (PBCC)",
  urduName: "پنجاب بورڈز کمیٹی آف چیئرمین",
  website: "https://pbcc.edu.pk",
  role: "Statutory coordinating body for all nine Boards of Intermediate & Secondary Education in Punjab. Standardizes academic calendars, datesheets, admission schedules, grading frameworks, and exam rules across Punjab.",
  office: "Hosted at BISE Lahore, 86-Mozang Road, Lahore",
};

// ---------------------------------------------------------------------------
// EXPECTED 2027 EXAMINATION TIMELINE (HISTORICAL BASELINE: PBCC 2023-2026)
// ---------------------------------------------------------------------------
export const EXPECTED_TIMELINE_2027: ExpectedTimelineStage[] = [
  {
    id: "stage-1-admissions",
    phase: "Admission & Registration Window",
    targetGroup: "Class 9, 10, 11 & 12 (Regular & Private)",
    expectedWindow: "November 2026 – January 2027",
    baselineYears: "2023, 2024, 2025, 2026 Annual PBCC Notification Schedules",
    description: "Online registration and admission forms submission. Conducted in three fee tiers: Single Fee (first 4 weeks), Double Fee (following 2 weeks), and Triple Fee (final window). Private candidates submit online via board portal bank challans.",
    status: "upcoming",
    studentAction: "Ensure B-Form / NADRA Smart Card details match school enrollment records exactly. Prepare passport-sized photographs on blue/white background.",
    officialSourceToCheck: "Respective BISE Online Admission Portal (e.g., biselahore.com / biserawalpindi.edu.pk)",
  },
  {
    id: "stage-2-datesheets",
    phase: "Tentative & Final Date Sheet Publication",
    targetGroup: "Matric (Class 9 & 10) followed by Inter (Class 11 & 12)",
    expectedWindow: "Late January – Mid February 2027",
    baselineYears: "PBCC Unified Date Sheet Gazettes (2022–2026)",
    description: "PBCC issues unified master date sheet for all 9 boards. Individual boards publish identical dates on their gazettes. Morning shift starts 8:30 AM; Evening shift starts 1:30 PM (Friday evening shift 2:30 PM).",
    status: "planning-estimate",
    studentAction: "Download official PDF only from verified board websites. Beware of forged social media date sheets.",
    officialSourceToCheck: "PBCC Official Gazette and individual BISE notification pages",
  },
  {
    id: "stage-3-rollslips",
    phase: "Roll Number Slips & Center Allocation",
    targetGroup: "All Matric & Intermediate Candidates",
    expectedWindow: "Mid to Late February 2027 (10-14 days before paper 1)",
    baselineYears: "Annual Roll Number Slip distribution protocol",
    description: "Regular students receive stamped slips from school/college principals. Private candidates download watermarked PDF slips directly using B-Form / Token Number from their board's portal.",
    status: "planning-estimate",
    studentAction: "Inspect center address, photo, subject codes, and shift timing immediately. Report spelling or subject clashes to board one-window cell within 72 hours.",
    officialSourceToCheck: "BISE Portal Online Roll Number Slip Generator",
  },
  {
    id: "stage-4-matric-exams",
    phase: "Matric Theory Examinations (Class 10 then Class 9)",
    targetGroup: "SSC Part II (10th) followed by SSC Part I (9th)",
    expectedWindow: "March 2027 (10th early March; 9th late March)",
    baselineYears: "PBCC Annual Examinations Calendar 2022–2026",
    description: "Class 10 examinations commence first (typically first Tuesday of March). Class 9 theory papers commence immediately upon conclusion of 10th class papers. OMR bubble sheets used for 20-minute objective papers.",
    status: "planning-estimate",
    studentAction: "Adhere to strict 8:15 AM gate closure for morning shift. Carry black/blue ballpoint pens and transparent ruler.",
    officialSourceToCheck: "Official PBCC Examination Gazette",
  },
  {
    id: "stage-5-practicals-matric",
    phase: "Matric Science Practical Examinations",
    targetGroup: "Class 10 Science Students (Physics, Chemistry, Biology, Computer)",
    expectedWindow: "Mid April – Early May 2027",
    baselineYears: "Post-theory laboratory evaluation cycles",
    description: "Conducted in designated science laboratories across secondary schools. Practical batches scheduled in 3 shifts daily. Separate practical roll number slips issued.",
    status: "planning-estimate",
    studentAction: "Keep signed practical notebook and laboratory instrument kit prepared.",
    officialSourceToCheck: "Respective board practical schedule gazette",
  },
  {
    id: "stage-6-inter-exams",
    phase: "Intermediate Theory Examinations (Class 12 then Class 11)",
    targetGroup: "HSSC Part II (12th) followed by HSSC Part I (11th)",
    expectedWindow: "Late April – June 2027",
    baselineYears: "PBCC HSSC Annual schedule 2022–2026",
    description: "Class 12 papers commence late April / early May. Class 11 papers follow in late May / early June. 3-hour papers with non-programmable scientific calculator permissions in Physics/Math/Stats.",
    status: "planning-estimate",
    studentAction: "Focus on conceptual questions and numerical practice under timed conditions.",
    officialSourceToCheck: "PBCC Unified Intermediate Gazette",
  },
  {
    id: "stage-7-results",
    phase: "Annual Results Declaration & Gazette",
    targetGroup: "Class 10 (July/Aug), Class 12 (Sept), Class 9 (Aug/Sept), Class 11 (Oct)",
    expectedWindow: "July – October 2027",
    baselineYears: "PBCC standard 90-day post-exam marking cycle",
    description: "Online result search via board web portal, SMS short-codes, and downloadable CD gazette. Marks sheets display subject-wise marks and updated 40% passing benchmark.",
    status: "planning-estimate",
    studentAction: "Download digital e-result card immediately; original result card dispatched to school/postal address within 3 weeks.",
    officialSourceToCheck: "Official BISE Result Portals",
  },
  {
    id: "stage-8-second-annual",
    phase: "Second Annual Examinations (Supplementary)",
    targetGroup: "Improvement & Re-appearing candidates",
    expectedWindow: "October – November 2027",
    baselineYears: "PBCC 2nd Annual Examination Statutory Policy",
    description: "Replaces the older 'Supplementary' exam nomenclature. Open to students looking to improve marks or clear failed subjects within the same academic year.",
    status: "planning-estimate",
    studentAction: "Submit admission within 20 days of 1st annual result declaration.",
    officialSourceToCheck: "BISE 2nd Annual Notification Notice",
  },
];

// ---------------------------------------------------------------------------
// INITIAL VERIFIED RESEARCH ENTRIES (SOURCED, FACT-CHECKED & CLASSIFIED)
// ---------------------------------------------------------------------------
export const INITIAL_BOARD_WATCH_ENTRIES: BoardWatchEntry[] = [
  // 1. CONFIRMED: 40% Passing Marks Standard
  {
    id: "pbcc-passing-marks-40-percent",
    headline: "PBCC Unified 40% Minimum Passing Marks Policy Across All 9 Punjab Boards",
    summary:
      "Under IBCC national harmonization directives adopted uniformly by PBCC, minimum passing marks have officially transitioned from 33% to 40% per subject. Candidates scoring below 40% receive an 'Unsatisfactory' (U) category rather than immediate fail, qualifying for the Second Annual exam window.",
    category: "confirmed",
    status: "officially-confirmed",
    affectedClasses: ["9th", "10th", "11th", "12th"],
    affectedBoards: ["all"],
    affectedBoardNames: ["All 9 Punjab BISE Boards"],
    session: "Annual 2026 & Annual 2027",
    issuingAuthority: "Punjab Boards Committee of Chairmen (PBCC) / IBCC",
    originalDate: "August 14, 2024",
    lastVerifiedDate: "October 28, 2026",
    sourceUrl: "https://pbcc.edu.pk",
    sourceName: "PBCC Official Policy Circular & IBCC Unified Assessment Gazette",
    sourceType: "pbcc_government",
    whatItMeans:
      "In a 75-mark paper (e.g. Mathematics or English), you must obtain at least 30 marks to pass (previously 25). In a 60-mark science theory paper (Physics, Chemistry, Biology), you need 24 marks (previously 20). In 50-mark papers (Pak Studies, Islamiat), you need 20 marks.",
    evidenceNotes:
      "Directly verified against PBCC notifications and adopted across BISE Lahore, Gujranwala, Multan, Faisalabad, Rawalpindi, Sargodha, Bahawalpur, DG Khan, and Sahiwal result gazettes.",
    actionRequired:
      "Adjust target passing thresholds in self-assessments. Target at least 50%+ in mock tests to maintain a safe margin above 40%.",
    tags: ["Passing Marks", "PBCC Policy", "Grading System", "All Boards", "Matric & Inter"],
  },

  // 2. CONFIRMED: HSSC & SSC Second Annual 2026 Conduct Windows
  {
    id: "pbcc-second-annual-2026-cycle",
    headline: "Second Annual 2026 Examination Schedule for Matric & Intermediate Sessions",
    summary:
      "PBCC has officially scheduled and initiated the Second Annual 2026 examination cycle. Intermediate 2nd Annual examinations commence in late October / November, followed by practical assessments. This provides students with an immediate opportunity to improve grades without losing an academic year.",
    category: "confirmed",
    status: "officially-confirmed",
    affectedClasses: ["10th", "12th"],
    affectedBoards: ["all"],
    affectedBoardNames: ["All 9 Punjab BISE Boards"],
    session: "2nd Annual 2026",
    issuingAuthority: "PBCC & Respective Divisional BISEs",
    originalDate: "September 2026",
    lastVerifiedDate: "October 28, 2026",
    sourceUrl: "https://www.biselahore.com",
    sourceName: "BISE Lahore / PBCC 2nd Annual Examination Gazette Notification",
    sourceType: "official_board",
    whatItMeans:
      "Second Annual is the official statutory title for supplementary examinations. Results are typically finalized by January, allowing qualifying students to meet spring and fall higher education admission criteria.",
    evidenceNotes:
      "Circulars published on official BISE portals (Lahore, Multan, Rawalpindi) confirming exam commencement dates and center allocations.",
    actionRequired:
      "Registered candidates must download their updated Second Annual Roll Number Slips with verified examination centers.",
    tags: ["2nd Annual 2026", "Supplementary", "Date Sheet", "Inter & Matric"],
  },

  // 3. CONFIRMED: Student Learning Outcomes (SLO) Conceptual Transition
  {
    id: "pctb-pbcc-slo-conceptual-papers",
    headline: "SLO-Based Conceptual Question Framework Formally Enforced in Science & Math Papers",
    summary:
      "Punjab Curriculum and Textbook Board (PCTB) and PBCC have formally incorporated Student Learning Outcomes (SLO) benchmarks into board examination question papers. Analytical, application-oriented, and conceptual questions now constitute an integral percentage of short and long question sections.",
    category: "pattern",
    status: "officially-confirmed",
    affectedClasses: ["9th", "10th", "11th", "12th"],
    affectedBoards: ["all"],
    affectedBoardNames: ["All 9 Punjab BISE Boards"],
    session: "Annual 2026 & Annual 2027",
    subject: "Science & Mathematics Group",
    issuingAuthority: "Punjab Curriculum and Textbook Board (PCTB) & PBCC",
    originalDate: "January 2024 (Updated in 2025/2026 cycles)",
    lastVerifiedDate: "October 28, 2026",
    sourceUrl: "https://pbcc.edu.pk",
    sourceName: "PBCC SLO Implementation Advisory & Model Papers",
    sourceType: "pbcc_government",
    whatItMeans:
      "Examiners no longer rely purely on textbook exercise end-questions. Up to 25% to 30% of question items test underlying principles, graphical interpretations, and numerical application from inside chapter concepts.",
    evidenceNotes:
      "Verified via official model question papers published by BISE Lahore and PBCC for Physics, Chemistry, Biology, and Mathematics.",
    actionRequired:
      "Study concepts thoroughly from chapter text instead of memorizing exercise answers. Practice solving varied numerical problems and conceptual 'Give Reasons' questions.",
    tags: ["SLO", "Paper Pattern", "Conceptual Questions", "PCTB", "Model Papers"],
  },

  // 4. CONFIRMED: QR Code & Digital Watermark on Roll Number Slips
  {
    id: "bise-digital-roll-slip-security",
    headline: "Anti-Impersonation Digital Watermark & QR Verification System Active Across Boards",
    summary:
      "All nine Punjab boards enforce standardized digital security features on online Roll Number Slips, including scannable QR verification codes, embedded candidate photographs, and anti-tamper center codes. Center invigilation teams utilize portable mobile readers to authenticate slips.",
    category: "confirmed",
    status: "officially-confirmed",
    affectedClasses: ["9th", "10th", "11th", "12th"],
    affectedBoards: ["all"],
    affectedBoardNames: ["All 9 Punjab BISE Boards"],
    session: "All Active Sessions",
    issuingAuthority: "Punjab BISE Chairmen Joint Security Committee",
    originalDate: "February 2024",
    lastVerifiedDate: "October 28, 2026",
    sourceUrl: "https://biserawalpindi.edu.pk",
    sourceName: "BISE Rawalpindi / Lahore Candidate Advisory Notice",
    sourceType: "official_board",
    whatItMeans:
      "Slips downloaded from unofficial third-party websites without authentic QR signatures or with blurry barcodes risk rejection at center frisking checkpoints.",
    evidenceNotes:
      "Official candidate notices on BISE portals explicitly direct students to print from primary board sub-portals on white A4 sheets without plastic lamination.",
    actionRequired:
      "Print original slip directly from your own board's official portal. Never laminate the slip as supervisory signatures are required daily.",
    tags: ["Roll Number Slip", "Security", "QR Code", "Exam Rules"],
  },

  // 5. REPORTED: Annual 2027 Online Admission Schedule Anticipation
  {
    id: "reported-2027-annual-admission-schedule",
    headline: "Annual 2027 Matric Online Admission Portal Opening Anticipated for Mid-November 2026",
    summary:
      "Major national dailies and education news desks report that PBCC is finalizing the unified notification for Matric Annual 2027 online registration and admission form submission. Single-fee submissions are reported to open in mid-November 2026 and conclude by mid-December 2026.",
    category: "reported",
    status: "credibly-reported",
    affectedClasses: ["9th", "10th"],
    affectedBoards: ["all"],
    affectedBoardNames: ["All 9 Punjab BISE Boards"],
    session: "Annual 2027",
    issuingAuthority: "Reported via Dawn & The Express Tribune Education Desks",
    originalDate: "October 22, 2026",
    lastVerifiedDate: "October 28, 2026",
    sourceUrl: "https://pbcc.edu.pk",
    sourceName: "Press reporting citing PBCC Secretariat sources",
    sourceType: "news_outlet",
    whatItMeans:
      "The official gazette notification with exact fee challan dates has not yet been uploaded to the public portal, but educational institutions and private candidates should prepare their registration documentation.",
    evidenceNotes:
      "Reported in credible education press. Direct verification will occur as soon as PBCC uploads the signed circular with notification number.",
    actionRequired:
      "Private students should verify that their NADRA B-Form / Smart Card is up to date and does not contain name or parental spelling mismatches.",
    tags: ["Admission 2027", "Registration", "Credibly Reported", "Matric 2027"],
  },

  // 6. REPORTED: Biometric / Electronic Attendance Pilot at Urban Centers
  {
    id: "reported-biometric-attendance-pilot",
    headline: "PBCC Evaluating Expanded Electronic Candidate Verification at Divisional Headquarters",
    summary:
      "Education correspondents report that PBCC is reviewing an expanded pilot for electronic thumb-impression or tablet-based attendance logging at major division center clusters in Lahore, Faisalabad, and Rawalpindi for the 2027 cycle to eradicate impersonation.",
    category: "reported",
    status: "credibly-reported",
    affectedClasses: ["10th", "12th"],
    affectedBoards: ["lahore", "faisalabad", "rawalpindi"],
    affectedBoardNames: ["BISE Lahore", "BISE Faisalabad", "BISE Rawalpindi"],
    session: "Annual 2027",
    issuingAuthority: "Education Press Reports citing PBCC Planning Session",
    originalDate: "October 18, 2026",
    lastVerifiedDate: "October 28, 2026",
    sourceUrl: "https://www.biselahore.com",
    sourceName: "Punjab Education Bureau Reports",
    sourceType: "news_outlet",
    whatItMeans:
      "This remains a reported administrative review. No board has declared that traditional paper roll slips or B-Form verification are replaced.",
    evidenceNotes:
      "Awaiting formal administrative circular from Punjab Higher Education Department / PBCC. Marked as awaiting direct verification.",
    tags: ["Biometric", "Attendance", "Credibly Reported", "Administrative"],
  },

  // 7. EXPECTED: Matric Annual 2027 Theory Exam Commencement Window
  {
    id: "expected-matric-2027-theory-window",
    headline: "Class 10 Annual 2027 Theory Examinations Expected to Commence Early March 2027",
    summary:
      "Based on PBCC statutory calendar precedents across 2022, 2023, 2024, 2025, and 2026, Matriculation (Class 10) Annual Examinations consistently begin on the first Tuesday of March. Class 9 papers follow approximately 15 to 18 days later.",
    category: "expected",
    status: "historically-expected",
    affectedClasses: ["10th", "9th"],
    affectedBoards: ["all"],
    affectedBoardNames: ["All 9 Punjab BISE Boards"],
    session: "Annual 2027",
    issuingAuthority: "Historical PBCC Academic Calendar Baseline",
    originalDate: "Historical Analysis 2022–2026",
    lastVerifiedDate: "October 28, 2026",
    sourceUrl: "https://pbcc.edu.pk",
    sourceName: "Matric Mastery Historical Examination Calendar Archive",
    sourceType: "historical_archive",
    whatItMeans:
      "Planning guidance only — NOT an official date sheet. Students can structure their revision countdown targeting March 1–5, 2027 as the likely commencement window for Class 10 theory papers.",
    evidenceNotes:
      "Analyzed PBCC unified examination gazettes for past 5 annual cycles. Exam start dates consistently adhere to early March barring exceptional gazetted holidays.",
    actionRequired:
      "Plan complete syllabus coverage by mid-January 2027, reserving February for full-length timed mock exams and past paper practice.",
    tags: ["Expected Date", "Planning Guidance", "Matric 2027", "Class 10", "Class 9"],
  },

  // 8. EXPECTED: Intermediate Annual 2027 Theory Exam Commencement Window
  {
    id: "expected-inter-2027-theory-window",
    headline: "Class 12 Annual 2027 Theory Examinations Expected Late April / Early May 2027",
    summary:
      "Historical PBCC schedule analysis establishes that Higher Secondary School Certificate (HSSC Part II - 12th Class) theory papers typically commence in late April or the first week of May, followed by Class 11 papers in late May / early June.",
    category: "expected",
    status: "historically-expected",
    affectedClasses: ["12th", "11th"],
    affectedBoards: ["all"],
    affectedBoardNames: ["All 9 Punjab BISE Boards"],
    session: "Annual 2027",
    issuingAuthority: "Historical PBCC Academic Calendar Baseline",
    originalDate: "Historical Analysis 2022–2026",
    lastVerifiedDate: "October 28, 2026",
    sourceUrl: "https://pbcc.edu.pk",
    sourceName: "Matric Mastery Historical Examination Calendar Archive",
    sourceType: "historical_archive",
    whatItMeans:
      "Expected timeline for student study roadmaps. Official subject-wise date sheets will be published by PBCC approximately 3 to 4 weeks prior to exam start.",
    evidenceNotes:
      "Verified against historical 5-year PBCC unified calendars for HSSC examinations.",
    actionRequired:
      "Intermediate students should complete 1st-term and 2nd-term syllabuses by January 2027 to allow 10 weeks of intensive revision.",
    tags: ["Expected Date", "Planning Guidance", "Intermediate 2027", "Class 12", "Class 11"],
  },

  // 9. RUMOR & DEBUNK: "Pairing Schemes Completely Cancelled & Out-of-Syllabus Papers"
  {
    id: "rumor-pairing-scheme-cancellation",
    headline: "Clarification: Claims of PBCC 'Abolishing All Pairing Schemes' & 100% Unseen Questions",
    summary:
      "Widespread rumors circulating on social media and WhatsApp groups claim that PBCC has cancelled all pairing schemes and that 2027 examination papers will be 100% conceptual and drawn outside prescribed textbooks. This claim is UNVERIFIED and misrepresents official policy.",
    category: "rumor",
    status: "unverified-rumor",
    affectedClasses: ["9th", "10th", "11th", "12th"],
    affectedBoards: ["all"],
    affectedBoardNames: ["All 9 Punjab BISE Boards"],
    session: "Annual 2027",
    issuingAuthority: "Social Media Rumor / Student Clarification Desk",
    originalDate: "Circulating October 2026",
    lastVerifiedDate: "October 28, 2026",
    sourceUrl: "https://pbcc.edu.pk",
    sourceName: "PBCC Official Curriculum Advisory",
    sourceType: "official_board",
    whatItMeans:
      "PBCC has never issued a 'guaranteed contract' pairing scheme, but it strictly enforces an approved assessment blueprint matching PCTB curriculum textbooks. Papers will NOT be out of syllabus; they remain grounded in textbook concepts with moderate SLO-based analytical framing.",
    evidenceNotes:
      "Zero official notifications or gazettes from PBCC or Punjab Education Department support the claim of abandoning curriculum-aligned patterns.",
    rumorDebunk: {
      circulatingClaim:
        "PBCC has abolished all paper pairing schemes, and 2027 exams will have zero textbook questions.",
      missingEvidence:
        "No official circular number, notification date, or PBCC Chairman signature exists. Official PCTB syllabus notifications confirm textbooks remain primary.",
      verifiedFact:
        "The assessment scheme defines section marks and chapter distribution. While academies sell unofficial 'guess papers' falsely claiming 100% certainty, the official board paper is strictly derived from the approved PCTB curriculum.",
      officialAdvice:
        "Do not rely solely on selective chapter pairing guess papers, but do not panic about 'out-of-syllabus' claims either. Study every chapter's core concepts thoroughly from your official textbook.",
    },
    tags: ["Rumor Buster", "Pairing Scheme", "Clarification", "SLO", "Social Media Claim"],
  },

  // 10. RUMOR & DEBUNK: "Class 10 Board Examinations Abolished in Punjab"
  {
    id: "rumor-matric-board-abolition",
    headline: "Clarification: Viral Claims that Class 10 Board Exams Are Cancelled in Favor of School Grades",
    summary:
      "Recurring videos and TikTok clips allege that Punjab has abolished the 10th Class Board Examination and replaced it with internal school marks. This claim is UNVERIFIED and FALSE. Statutory BISE Matric examinations remain fully active, legally mandated, and scheduled as normal.",
    category: "rumor",
    status: "unverified-rumor",
    affectedClasses: ["10th"],
    affectedBoards: ["all"],
    affectedBoardNames: ["All 9 Punjab BISE Boards"],
    session: "Annual 2027",
    issuingAuthority: "Social Media Rumor / Student Clarification Desk",
    originalDate: "Circulating October 2026",
    lastVerifiedDate: "October 28, 2026",
    sourceUrl: "https://schools.punjab.gov.pk",
    sourceName: "Punjab School Education Department Statutory Acts",
    sourceType: "pbcc_government",
    whatItMeans:
      "Every matric student in Punjab must sit the standardized BISE board examinations. Any school or academy claiming board exams have been scrapped is spreading misleading misinformation.",
    evidenceNotes:
      "Punjab Boards of Intermediate and Secondary Education Act 1976 and subsequent legislative amendments confirm the statutory necessity of Matriculation examinations.",
    rumorDebunk: {
      circulatingClaim: "10th class board exams are cancelled in Punjab; only internal school tests will count.",
      missingEvidence: "No notification from Punjab School Education Department, PBCC, or provincial cabinet exists.",
      verifiedFact: "Matriculation (SSC) exams are statutory requirements under Punjab law. Examinations will proceed normally across all nine BISE boards.",
      officialAdvice: "Ignore viral social media reels. Continue your preparation adhering to the official board examination calendar.",
    },
    tags: ["Rumor Buster", "Abolition Claim", "Clarification", "Matric Exams", "Fake News"],
  },

  // 11. DEADLINE / ACTION: Private Candidates B-Form & Enrollment Verification
  {
    id: "deadline-bform-data-verification",
    headline: "Action Alert: Verify NADRA B-Form Records Prior to Annual 2027 Registration Portal Opening",
    summary:
      "Students planning to register for the Annual 2027 examination cycle (both regular through schools and private independently) must verify that their Name, Father's Name, Date of Birth, and B-Form number on NADRA records match their school leaving certificate or 9th registration exactly.",
    category: "deadline",
    status: "officially-confirmed",
    affectedClasses: ["9th", "10th", "11th", "12th"],
    affectedBoards: ["all"],
    affectedBoardNames: ["All 9 Punjab BISE Boards"],
    session: "Annual 2027",
    issuingAuthority: "PBCC Registration Guidelines",
    originalDate: "Continuous Requirement",
    lastVerifiedDate: "October 28, 2026",
    sourceUrl: "https://www.biselahore.com",
    sourceName: "BISE Student Registration Advisory",
    sourceType: "official_board",
    whatItMeans:
      "Board online admission systems cross-verify B-Form details with NADRA databases. Discrepancies block online admission form generation, resulting in late-fee penalties or physical visits to the board headquarters.",
    evidenceNotes:
      "Standard registration prerequisite across all BISE online portals.",
    actionRequired:
      "Check your B-Form / Smart Card now. If errors exist in spelling or Date of Birth, visit a NADRA facilitation center immediately before the November registration window opens.",
    isDeadline: true,
    deadlineDate: "November 15, 2026 (Recommended Prior Action)",
    isExpired: false,
    tags: ["Deadline", "Action Alert", "B-Form", "NADRA", "Registration"],
  },

  // 12. DEADLINE / ACTION: 2nd Annual 2026 Roll Number Slip Download Window
  {
    id: "deadline-second-annual-roll-slips",
    headline: "Active Notice: Second Annual 2026 Roll Number Slips Live on Board Web Portals",
    summary:
      "Roll number slips for the ongoing Second Annual 2026 examination session are active on respective BISE online portals. Private candidates can download by entering their Previous Roll Number, Form Number, or Current Token Number.",
    category: "deadline",
    status: "officially-confirmed",
    affectedClasses: ["10th", "12th"],
    affectedBoards: ["all"],
    affectedBoardNames: ["All 9 Punjab BISE Boards"],
    session: "2nd Annual 2026",
    issuingAuthority: "All 9 Punjab BISE Examination Branches",
    originalDate: "October 2026",
    lastVerifiedDate: "October 28, 2026",
    sourceUrl: "https://web.bisemultan.edu.pk",
    sourceName: "BISE Online Portal Services",
    sourceType: "official_board",
    whatItMeans:
      "Candidates appearing in the 2nd annual session must present their fresh 2nd annual slip; 1st annual slips are strictly invalid for entry.",
    evidenceNotes:
      "Online roll number download services actively operating across all nine board websites.",
    actionRequired:
      "Download, print on A4 sheet, check your center location, and do not laminate.",
    isDeadline: true,
    deadlineDate: "Active Through Exam Duration (Nov 2026)",
    isExpired: false,
    tags: ["Roll Number Slip", "Active Deadline", "2nd Annual 2026"],
  },
];

// ---------------------------------------------------------------------------
// SUBJECT PATTERNS & SYLLABUS TRACKER DATA
// ---------------------------------------------------------------------------
export const SUBJECT_PATTERNS: SubjectPattern[] = [
  {
    id: "pattern-physics-matric",
    subject: "Physics (Class 9 & 10)",
    classes: ["9th", "10th"],
    theoryMarks: 60,
    practicalMarks: 15, // In 10th
    totalMarks: 75,
    objectiveMcqsMarks: 12,
    subjectiveMarks: 48,
    passingMarks: 24, // 40% of 60 theory
    timeAllowed: "2 Hours 45 Minutes (Objective: 15 min, Subjective: 2 hr 30 min)",
    sloBreakdown: {
      knowledge: "50% (Recall & basic definitions)",
      understanding: "35% (Conceptual explanations & principles)",
      application: "15% (Numerical problems & practical derivations)",
    },
    keyComponents: [
      "Q1: 12 MCQs (1 mark each) - Covers all chapters proportionally",
      "Section I: Short Questions (Attempt 15 out of 24 across Q2, Q3, Q4; 30 marks)",
      "Section II: Long Questions (Attempt 2 out of 3 from Q5, Q6, Q7; 18 marks - each has Part (a) Theory [5m] and Part (b) Numerical [4m])",
      "Practical Assessment (10th only): 15 marks covering experiment performance, lab notebook, and viva",
    ],
    pairingSchemeStatus: "structural-blueprint",
    pairingNote:
      "Official blueprint specifies marks distribution and question quotas. Chapter pairings (e.g. Q5 combining Ch 10 & 12, Q6 combining Ch 11 & 13) represent the standard assessment structure but can vary slightly across morning/evening shifts.",
    officialModelPaperUrl: "https://www.biselahore.com",
  },
  {
    id: "pattern-chemistry-matric",
    subject: "Chemistry (Class 9 & 10)",
    classes: ["9th", "10th"],
    theoryMarks: 60,
    practicalMarks: 15,
    totalMarks: 75,
    objectiveMcqsMarks: 12,
    subjectiveMarks: 48,
    passingMarks: 24,
    timeAllowed: "2 Hours 45 Minutes",
    sloBreakdown: {
      knowledge: "50% (Direct formulas, periodic trends, definitions)",
      understanding: "35% (Reaction mechanisms, bonding reasons)",
      application: "15% (Stoichiometric calculations & molar mass conversions)",
    },
    keyComponents: [
      "Q1: 12 MCQs (1 mark each) from all textbook units",
      "Section I: Short Questions (3 sub-sections, attempt 5 out of 8 in each; total 30 marks)",
      "Section II: Long Questions (Attempt 2 out of 3; 18 marks, distributed 5m + 4m or 5m + 5m)",
      "Chemical equations must be balanced with state symbols for full marks",
    ],
    pairingSchemeStatus: "structural-blueprint",
    pairingNote:
      "Long questions combine physical, inorganic, and organic chemistry chapters. Focus on reaction balancing and electronic configurations.",
    officialModelPaperUrl: "https://www.biselahore.com",
  },
  {
    id: "pattern-biology-matric",
    subject: "Biology (Class 9 & 10)",
    classes: ["9th", "10th"],
    theoryMarks: 60,
    practicalMarks: 15,
    totalMarks: 75,
    objectiveMcqsMarks: 12,
    subjectiveMarks: 48,
    passingMarks: 24,
    timeAllowed: "2 Hours 45 Minutes",
    sloBreakdown: {
      knowledge: "50% (Biological terms, classification, anatomy)",
      understanding: "35% (Physiological processes, genetics, ecological cycles)",
      application: "15% (Data interpretation, experimental reasoning)",
    },
    keyComponents: [
      "Q1: 12 MCQs from all units",
      "Section I: Short Questions (15 to attempt; neat labeled diagrams enhance scores)",
      "Section II: Long Questions (2 out of 3 to attempt; structured 5m + 4m)",
      "Drawings must be done with sharp pencil and labeled in block letters",
    ],
    pairingSchemeStatus: "structural-blueprint",
    pairingNote:
      "Physiology chapters (Respiratory, Circulatory, Nervous systems) form core long-question anchors.",
    officialModelPaperUrl: "https://www.biselahore.com",
  },
  {
    id: "pattern-mathematics-matric",
    subject: "Mathematics (Science Group - Class 9 & 10)",
    classes: ["9th", "10th"],
    theoryMarks: 75,
    practicalMarks: 0,
    totalMarks: 75,
    objectiveMcqsMarks: 15,
    subjectiveMarks: 60,
    passingMarks: 30, // 40% of 75
    timeAllowed: "2 Hours 30 Minutes",
    sloBreakdown: {
      knowledge: "40% (Formulas, theorem statements, standard algorithms)",
      understanding: "40% (Step-by-step algebraic manipulation, geometric proofs)",
      application: "20% (Word problems, practical geometric construction)",
    },
    keyComponents: [
      "Q1: 15 MCQs (15 marks) - 20 minutes allocated",
      "Section I: Short Questions (Attempt 18 out of 27 across Q2, Q3, Q4; 36 marks)",
      "Section II: Long Questions (Attempt 3 out of 5; Q9 is COMPULSORY Theorem; 24 marks)",
      "Compulsory Question 9: 8-mark Geometric Theorem from designated textbook circles/triangles chapters",
    ],
    pairingSchemeStatus: "structural-blueprint",
    pairingNote:
      "Question 9 theorem is legally compulsory across all Punjab boards. Missing Q9 automatically limits maximum obtainable long question marks to 16/24.",
    officialModelPaperUrl: "https://www.biselahore.com",
  },
  {
    id: "pattern-english-matric",
    subject: "English Compulsory (Class 9 & 10)",
    classes: ["9th", "10th"],
    theoryMarks: 75,
    practicalMarks: 0,
    totalMarks: 75,
    objectiveMcqsMarks: 19,
    subjectiveMarks: 56,
    passingMarks: 30,
    timeAllowed: "2 Hours 30 Minutes",
    sloBreakdown: {
      knowledge: "30% (Vocabulary, spelling, correct verb forms)",
      understanding: "40% (Comprehension passage answers, poem paraphrasing)",
      application: "30% (Creative essay/paragraph writing, direct-to-indirect translation)",
    },
    keyComponents: [
      "Objective Paper: 19 MCQs (Correct verb forms, spelling, meanings, grammar parts of speech)",
      "Subjective Section I: Short Questions from textbook prose chapters (10 marks)",
      "Section II: Translation into Urdu or Alternative English paragraph (8 marks)",
      "Section III: Summary of poem or Stanza explanation with reference to context (5 marks)",
      "Section IV: Essay / Paragraph (15 marks), Direct & Indirect speech (5 marks), Pair of words (5 marks), Translation of sentences into English (8 marks)",
    ],
    pairingSchemeStatus: "structural-blueprint",
    pairingNote:
      "Grammar and composition follow the PCTB High School English Grammar and Composition textbook.",
    officialModelPaperUrl: "https://www.biselahore.com",
  },
  {
    id: "pattern-urdu-matric",
    subject: "Urdu Compulsory (Class 9 & 10)",
    classes: ["9th", "10th"],
    theoryMarks: 75,
    practicalMarks: 0,
    totalMarks: 75,
    objectiveMcqsMarks: 15,
    subjectiveMarks: 60,
    passingMarks: 30,
    timeAllowed: "2 Hours 30 Minutes",
    sloBreakdown: {
      knowledge: "35% (Poet & author names, idioms, grammatical terms)",
      understanding: "40% (Poetry tashreeh, prose khulasa, sabaq summary)",
      application: "25% (Essay writing, formal application/letter writing, kahani)",
    },
    keyComponents: [
      "Q1: 15 MCQs (Prose, poetry, grammar, tazfeer-o-tanees, mutashabeh alfaz)",
      "Q2: Ash'aar ki Tashreeh (Ghazal & Nazm - 10 marks)",
      "Q3: Siyāq-o-Sabāq ke saath Nasr Paray ki Tashreeh (10 marks)",
      "Q4: Sabaq ka Khulasa (5 marks)",
      "Q5: Mazmoon Nawaeesi (Essay - 15 marks)",
      "Q6: Khat / Darkhwast (10 marks) & Q7: Jumlon ki Durusti / Takmeel (5 marks)",
    ],
    pairingSchemeStatus: "structural-blueprint",
    pairingNote:
      "Presentation, calligraphy, and proper 605 marker sub-headings significantly influence examiner marking.",
    officialModelPaperUrl: "https://www.biselahore.com",
  },
  {
    id: "pattern-cs-matric",
    subject: "Computer Science (Class 9 & 10)",
    classes: ["9th", "10th"],
    theoryMarks: 50,
    practicalMarks: 25,
    totalMarks: 75,
    objectiveMcqsMarks: 10,
    subjectiveMarks: 40,
    passingMarks: 20, // 40% of 50
    timeAllowed: "2 Hours (Objective: 15 min, Subjective: 1 hr 45 min)",
    sloBreakdown: {
      knowledge: "40% (Syntax, architecture, protocols, numbering systems)",
      understanding: "35% (Algorithm logic, flowcharts, trace tables)",
      application: "25% (C / Python code writing, debugging, loop outputs)",
    },
    keyComponents: [
      "Q1: 10 MCQs (10 marks)",
      "Section I: Short Questions (Attempt 12 out of 18; 24 marks)",
      "Section II: Long Questions (Attempt 2 out of 3; 16 marks, e.g. programming constructs, network topologies)",
      "Practical: 25 marks (Lab execution of code, viva, practical journal)",
    ],
    pairingSchemeStatus: "structural-blueprint",
    pairingNote:
      "C-Language programming logic and conditional statements in 10th form the predominant long question weight.",
    officialModelPaperUrl: "https://www.biselahore.com",
  },
];
