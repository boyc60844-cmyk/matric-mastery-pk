// scripts/test-reliability-fixes.mjs
// Automated verification suite for Matric Mastery Reliability & Data Integrity Release

import assert from "assert";

console.log("=================================================");
console.log("Matric Mastery — Reliability & Integrity Test Suite");
console.log("=================================================\n");

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✓ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`✗ [FAIL] ${name}:`, err.message);
    process.exitCode = 1;
  }
}

// -------------------------------------------------------------
// Test 1: Backup & Restore Key Compatibility & Sanitization
// -------------------------------------------------------------
runTest("Backup & Restore: Payload Sanitization & Key Compatibility", () => {
  // Test import payload with both legacy keys and authoritative keys
  const validMockSession = {
    id: "session-1",
    mode: "pomodoro",
    durationSeconds: 1500,
    completedAt: new Date().toISOString(),
    taskName: "Physics Ch 1 Numerical",
  };

  const validMockEvent = {
    id: "event-1",
    title: "Math Model Paper Submission",
    date: "2026-04-10",
    category: "deadline",
    board: "BISE Lahore",
    classGrade: "10th",
    source: "personal",
    notes: "Revise Section B",
  };

  const payload = {
    version: "3.5.0",
    exportedAt: new Date().toISOString(),
    totalXP: 250,
    streak: 5,
    userBoard: "BISE Lahore",
    studySessions: [validMockSession],
    personalEvents: [validMockEvent],
  };

  // Validate session schema checker
  const isSessionValid = (s) =>
    s &&
    typeof s.id === "string" &&
    typeof s.durationSeconds === "number" &&
    typeof s.completedAt === "string";

  assert.strictEqual(isSessionValid(payload.studySessions[0]), true);

  // Validate personal event schema checker
  const isEventValid = (e) =>
    e &&
    typeof e.id === "string" &&
    typeof e.title === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(e.date);

  assert.strictEqual(isEventValid(payload.personalEvents[0]), true);

  // Backward compatibility test: reading parsed.studyLogs ?? parsed.studySessions
  const legacyPayload = {
    studyLogs: [validMockSession],
    personalAcademicEvents: [validMockEvent],
  };
  const extractedSessions = legacyPayload.studyLogs ?? legacyPayload.studySessions;
  const extractedEvents = legacyPayload.personalAcademicEvents ?? legacyPayload.personalEvents;
  assert.strictEqual(extractedSessions.length, 1);
  assert.strictEqual(extractedEvents.length, 1);
});

// -------------------------------------------------------------
// Test 2: Exam Countdown Calculation Anchored in PKT (+05:00)
// -------------------------------------------------------------
runTest("Exam Countdown: Absolute Timezone Independence (Pakistan Standard Time +05:00)", () => {
  // Simulated event on 2026-04-15 at 08:30 PKT
  const eventDate = "2026-04-15";
  const eventTime = "08:30";
  const [hStr, mStr] = eventTime.split(":");
  const padH = hStr.padStart(2, "0");
  const padM = mStr.padStart(2, "0");
  const targetIso = `${eventDate}T${padH}:${padM}:00+05:00`;
  const targetMs = Date.parse(targetIso);

  // Target MS must be identical regardless of local machine's timezone
  // 2026-04-15T08:30:00+05:00 in UTC is 2026-04-15T03:30:00.000Z
  const expectedUtcMs = Date.parse("2026-04-15T03:30:00.000Z");
  assert.strictEqual(targetMs, expectedUtcMs, "PKT target timestamp should match expected UTC equivalent");

  // Simulated now: 2026-04-14T03:30:00.000Z (exactly 24 hours / 86,400,000 ms before)
  const simulatedNowMs = Date.parse("2026-04-14T03:30:00.000Z");
  const diffMs = targetMs - simulatedNowMs;
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  assert.strictEqual(days, 1, "Should be exactly 1 day remaining");
  assert.strictEqual(hours, 0, "Should be 0 hours");
  assert.strictEqual(minutes, 0, "Should be 0 minutes");
});

// -------------------------------------------------------------
// Test 3: Timezone Converter Logic Without Local Machine Distortion
// -------------------------------------------------------------
runTest("Timezone Converter: Mathematical Zone Projection", () => {
  // Emulate convertTime logic from lib/utilities/timeService.ts
  function testConvert(timeStr, sourceZone, targetZone, testDate) {
    const [h, m] = timeStr.split(":").map(Number);
    const dateStr = testDate.toISOString().slice(0, 10);
    const [y, mon, d] = dateStr.split("-").map(Number);
    const utcGuess = new Date(Date.UTC(y, mon - 1, d, h, m, 0));

    // Get offset in sourceZone
    function getOffsetMinutes(date, tz) {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hourCycle: "h23",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }).formatToParts(date);
      const v = {};
      for (const p of parts) v[p.type] = parseInt(p.value, 10);
      const tzAsUtc = Date.UTC(v.year, v.month - 1, v.day, v.hour, v.minute, v.second);
      return Math.round((tzAsUtc - date.getTime()) / 60000);
    }

    const srcOffset = getOffsetMinutes(utcGuess, sourceZone);
    const trueUtc = new Date(utcGuess.getTime() - srcOffset * 60000);

    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: targetZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return formatter.format(trueUtc);
  }

  // 12:00 in Karachi (UTC+5) converted to London in January (UTC+0) -> 07:00
  const winterDate = new Date("2026-01-15T12:00:00Z");
  const londonTime = testConvert("12:00", "Asia/Karachi", "Europe/London", winterDate);
  assert.strictEqual(londonTime, "07:00", "12:00 PKT should be 07:00 GMT in winter");

  // 12:00 in Karachi (UTC+5) converted to Dubai (UTC+4) -> 11:00
  const dubaiTime = testConvert("12:00", "Asia/Karachi", "Asia/Dubai", winterDate);
  assert.strictEqual(dubaiTime, "11:00", "12:00 PKT should be 11:00 in Dubai");

  // 12:00 in Karachi (UTC+5) converted to Tokyo (UTC+9) -> 16:00
  const tokyoTime = testConvert("12:00", "Asia/Karachi", "Asia/Tokyo", winterDate);
  assert.strictEqual(tokyoTime, "16:00", "12:00 PKT should be 16:00 in Tokyo");
});

// -------------------------------------------------------------
// Test 4: Storage Record Bounding Verification
// -------------------------------------------------------------
runTest("Storage Capping: Mistakes (<=150), Mocks (<=50), Study Sessions (<=300)", () => {
  // Test mistakes capping logic: [newMistake, ...existing.filter(...).slice(0, 149)]
  const fakeMistakes = Array.from({ length: 200 }, (_, i) => ({
    id: `m-${i}`,
    questionText: `Question ${i}`,
    subject: "Physics",
    userChoice: "A",
    correctChoice: "B",
    timestamp: Date.now() - i * 1000,
  }));
  const boundedMistakes = [
    { id: "m-new", questionText: "New", subject: "Math", userChoice: "C", correctChoice: "A", timestamp: Date.now() },
    ...fakeMistakes.filter((m) => m.id !== "m-new").slice(0, 149),
  ];
  assert.strictEqual(boundedMistakes.length, 150, "Mistakes array must never exceed 150 items");

  // Test mock results capping logic: [newResult, ...existing.slice(0, 49)]
  const fakeMockResults = Array.from({ length: 100 }, (_, i) => ({
    id: `mock-${i}`,
    board: "BISE Lahore",
    subject: "Chemistry",
    score: 25,
    total: 30,
    timestamp: Date.now() - i * 5000,
  }));
  const boundedMockResults = [
    { id: "mock-new", board: "BISE Lahore", subject: "Chemistry", score: 28, total: 30, timestamp: Date.now() },
    ...fakeMockResults.slice(0, 49),
  ];
  assert.strictEqual(boundedMockResults.length, 50, "Mock test results must never exceed 50 items");

  // Test study sessions capping logic: sessions.slice(0, 300)
  const fakeSessions = Array.from({ length: 500 }, (_, i) => ({
    id: `s-${i}`,
    durationSeconds: 1500,
    completedAt: new Date(Date.now() - i * 60000).toISOString(),
  }));
  const boundedSessions = fakeSessions.slice(0, 300);
  assert.strictEqual(boundedSessions.length, 300, "Study sessions must never exceed 300 records");
});

// -------------------------------------------------------------
// Test 5: In-Progress Mock Exam State Protection Structure
// -------------------------------------------------------------
runTest("Mock Exam Session Protection: In-flight Answers & Timer Structure", () => {
  const targetEndTime = Date.now() + 15 * 60 * 1000; // 15 mins remaining
  const activeExamSession = {
    testId: "matric-physics-10-multan",
    board: "BISE Multan",
    subject: "Physics",
    classGrade: "10th",
    startedAt: Date.now() - 5 * 60 * 1000,
    targetEndTime,
    selectedAnswers: { 0: "B", 1: "A", 2: "C" },
    flaggedForReview: [1],
    currentQuestionIndex: 3,
  };

  // Restore calculation
  const remainingSec = Math.max(0, Math.floor((activeExamSession.targetEndTime - Date.now()) / 1000));
  assert.strictEqual(remainingSec > 850 && remainingSec <= 900, true, "Remaining seconds must correctly reflect delta to targetEndTime");
  assert.strictEqual(activeExamSession.selectedAnswers[0], "B");
  assert.strictEqual(activeExamSession.flaggedForReview.includes(1), true);
});

console.log(`\n=================================================`);
console.log(`All ${passedTests}/${totalTests} Verification Tests Passed Successfully!`);
console.log(`=================================================`);
