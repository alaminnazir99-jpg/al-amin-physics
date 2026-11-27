const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

// 1. Update APP_DATA.class8 chapters to include Chapters 1 & 2
const class8Target = `    class8: {
        levelTitle: "অষ্টম শ্রেণি বিজ্ঞান (Physics Modules)",
        gradeTag: "Class 8 Science - NCTB 2026 (Physics অংশ — ৪টি অধ্যায়)",
        /* ── NCTB ২০২৬ অষ্টম শ্রেণি বিজ্ঞান বইয়ের পদার্থবিজ্ঞান সংশ্লিষ্ট অধ্যায়সমূহ ── */
        chapters: [
            {
                id: "c8_c7",  num: 7,`;

const class8Replacement = `    class8: {
        levelTitle: "অষ্টম শ্রেণি বিজ্ঞান (Science & Physics)",
        gradeTag: "Class 8 Science - NCTB 2026 (পূর্ণাঙ্গ কোর্স)",
        /* ── NCTB ২০২৬ অষ্টম শ্রেণি বিজ্ঞান বইয়ের অধ্যায়সমূহ ── */
        chapters: [
            {
                id: "c8_c1",  num: 1,
                title: "অধ্যায় ১: প্রাণিজগতের শ্রেণিবিন্যাস",
                desc:  "অ্যানিম্যালিয়া জগতের পর্বসমূহ, অমেরুদণ্ডী ও মেরুদণ্ডী প্রাণীর বৈশিষ্ট্য ও দ্বিপদ নামকরণ।"
            },
            {
                id: "c8_c2",  num: 2,
                title: "অধ্যায় ২: জীবের বৃদ্ধি ও বংশগতি",
                desc:  "অ্যামাইটোসিস, মাইটোসিস, মিয়োসিস, ক্রোমোজোম, DNA, জিন ও বংশগতির নীতি।"
            },
            {
                id: "c8_c7",  num: 7,`;

if (appJs.includes(class8Target)) {
    appJs = appJs.replace(class8Target, class8Replacement);
    console.log('APP_DATA.class8 chapters updated');
} else {
    console.log('class8Target not matched, searching with regex');
    appJs = appJs.replace(/class8:\s*\{\s*levelTitle:[^,]+,\s*gradeTag:[^,]+,\s*\/\*[\s\S]*?\*\/\s*chapters:\s*\[\s*\{\s*id:\s*"c8_c7"/, `class8: {\n        levelTitle: "অষ্টম শ্রেণি বিজ্ঞান (Science & Physics)",\n        gradeTag: "Class 8 Science - NCTB 2026 (পূর্ণাঙ্গ কোর্স)",\n        chapters: [\n            {\n                id: "c8_c1",  num: 1,\n                title: "অধ্যায় ১: প্রাণিজগতের শ্রেণিবিন্যাস",\n                desc:  "অ্যানিম্যালিয়া জগতের পর্বসমূহ, অমেরুদণ্ডী ও মেরুদণ্ডী প্রাণীর বৈশিষ্ট্য ও দ্বিপদ নামকরণ।"\n            },\n            {\n                id: "c8_c2",  num: 2,\n                title: "অধ্যায় ২: জীবের বৃদ্ধি ও বংশগতি",\n                desc:  "অ্যামাইটোসিস, মাইটোসিস, মিয়োসিস, ক্রোমোজোম, DNA, জিন ও বংশগতির নীতি।"\n            },\n            {\n                id: "c8_c7"`);
    console.log('RegEx replace attempted for class8');
}

// 2. Update renderChapterExamSets to check window.CLASS8_EXAM_BANK if currentLevel === 'class8'
const rcesTarget = "const chapData = (window.SSC_EXAM_BANK && window.SSC_EXAM_BANK[chapNum]) || null;";
const rcesReplacement = `const chapData = (currentLevel === 'class8' && window.CLASS8_EXAM_BANK) 
        ? window.CLASS8_EXAM_BANK[chapNum] 
        : ((window.SSC_EXAM_BANK && window.SSC_EXAM_BANK[chapNum]) || null);`;

if (appJs.includes(rcesTarget)) {
    appJs = appJs.replaceAll(rcesTarget, rcesReplacement);
    console.log('renderChapterExamSets bank lookup updated');
}

// 3. Update startChapterExamSet to check window.CLASS8_EXAM_BANK
const scesTarget = "const chapData = (window.SSC_EXAM_BANK && window.SSC_EXAM_BANK[chapNum]) || null;";
// already covered by replaceAll above if identical, or let's verify:
const scesTarget2 = "const chapData = (window.SSC_EXAM_BANK && window.SSC_EXAM_BANK[chapNum]) || null;";
if (appJs.includes(scesTarget2)) {
    appJs = appJs.replaceAll(scesTarget2, rcesReplacement);
}

// 4. Add startClass8MasterCourseExam and initClass8MasterCourseHub
const c8HubLogic = `
/* ===================================================
   CLASS 8 SCIENCE MCQ MASTER COURSE CONTROLLER
=================================================== */
function startClass8MasterCourseExam(examId) {
    if (!window.C8_MCQ_MASTER) return;

    const student = (typeof getActiveStudentSession === 'function') ? getActiveStudentSession() : null;
    const isEnrolled = window.C8_MCQ_MASTER.isStudentEnrolled(student ? student.id : null);

    const instance = window.C8_MCQ_MASTER.generateExamInstance(examId);
    if (!instance) {
        alert('প্রশ্ন প্রস্তুত হচ্ছে। অনুগ্রহ করে একটু পর আবার চেষ্টা করুন।');
        return;
    }

    const isFreeTrial = Boolean(instance.examDef.isFree) || instance.examDef.id.endsWith('_set1');

    if (!isEnrolled && !isFreeTrial) {
        openClass8EnrollModal();
        return;
    }

    currentMasterExamAttempt = instance;
    currentActiveExamSet = instance.examDef;
    currentActiveExamQuestions = instance.questions;
    examUserAnswers = {};
    examTimeLeft = (instance.examDef.timeMinutes || 15) * 60;
    examActiveStartTime = Date.now();
    antiCheatViolationCount = 0;

    openClassroomView(false);
    const subhomeEl = document.getElementById('lms-subhomepage');
    if (subhomeEl) subhomeEl.classList.add('hidden');
    const contentArea = document.getElementById('content-display-area');
    if (contentArea) contentArea.classList.remove('hidden');
    const secExam = document.getElementById('section-exam');
    if (secExam) secExam.classList.remove('hidden');

    document.getElementById('exam-sets-screen').classList.add('hidden');
    const masterHub = document.getElementById('section-mcq-master');
    if (masterHub) masterHub.classList.add('hidden');

    const activeScreen = document.getElementById('exam-active-screen');
    activeScreen.classList.remove('hidden');
    document.getElementById('exam-result-screen').classList.add('hidden');

    const titleEl = document.getElementById('exam-active-set-title');
    const chapSubEl = document.getElementById('exam-active-chap-subtitle');
    if (titleEl) titleEl.textContent = instance.examDef.title;
    if (chapSubEl) chapSubEl.textContent = instance.examDef.category + ' • অষ্টম শ্রেণি বিজ্ঞান';

    updateExamProgressStat();

    const container = document.getElementById('exam-questions-container');
    if (container) {
        container.style.userSelect = 'none';
        container.style.webkitUserSelect = 'none';
        container.innerHTML = instance.questions.map((q, qIdx) => {
            const letters = ['ক', 'খ', 'গ', 'ঘ'];
            const optHtml = q.options.map((opt, optIdx) => {
                return \`
                    <label id="exam-opt-lbl-\${qIdx}-\${optIdx}" onclick="recordSetExamAnswer(\${qIdx}, \${optIdx})" class="p-3 bg-slate-50 hover:bg-blue-50/60 rounded-xl border border-slate-200 hover:border-blue-400 flex items-center gap-3 cursor-pointer transition select-none">
                        <span class="w-6 h-6 rounded-lg bg-white border border-slate-300 text-xs font-bold flex items-center justify-center text-slate-700 shadow-xs">\${letters[optIdx]}</span>
                        <span class="text-xs font-semibold text-slate-800 leading-snug">\${opt}</span>
                    </label>
                \`;
            }).join('');

            return \`
                <div class="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex items-start gap-2.5">
                            <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">\${q.displayNum || (qIdx + 1)}</span>
                            <div class="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">\${q.q}</div>
                        </div>
                        \${q.reference ? \`<span class="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded flex-shrink-0 whitespace-nowrap">\${q.reference}</span>\` : ''}
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        \${optHtml}
                    </div>
                </div>
            \`;
        }).join('');
    }

    const activeScreenEl = document.getElementById('exam-active-screen');
    if (activeScreenEl) activeScreenEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (examTimerInterval) clearInterval(examTimerInterval);
    updateExamTimerDisplay();
    examTimerInterval = setInterval(() => {
        examTimeLeft--;
        updateExamTimerDisplay();
        if (examTimeLeft <= 0) {
            clearInterval(examTimerInterval);
            examTimerInterval = null;
            alert("সময় শেষ! আপনার পরীক্ষা স্বয়ংক্রিয়ভাবে জমা নেওয়া হচ্ছে।");
            submitExamAnswers();
        }
    }, 1000);
}

function openClass8EnrollModal() {
    if (isDirectorSessionActive()) {
        alert("স্বাগতম ডিরেক্টর স্যার! আপনার জন্য অষ্টম শ্রেণি বিজ্ঞান মাস্টারকোর্সের সকল পরীক্ষা ও রিসোর্স সরাসরি আনলক করা রয়েছে।");
        switchLevel('class8');
        switchTab('exam');
        return;
    }
    const m = document.getElementById('class8-enroll-modal');
    if (m) m.classList.remove('hidden');
}

function closeClass8EnrollModal() {
    const m = document.getElementById('class8-enroll-modal');
    if (m) m.classList.add('hidden');
}

function handleClass8EnrollSubmit(e) {
    e.preventDefault();
    const phone = document.getElementById('c8-enroll-phone')?.value.trim();
    const trx = document.getElementById('c8-enroll-trx')?.value.trim();
    if (!window.C8_MCQ_MASTER) return;

    const res = window.C8_MCQ_MASTER.submitEnrollmentRequest(phone, trx);
    alert(res.message);
    if (res.success) {
        closeClass8EnrollModal();
    }
}
`;

if (!appJs.includes('function startClass8MasterCourseExam')) {
    appJs += '\n' + c8HubLogic;
    console.log('Class 8 MCQ Controller appended to app.js');
}

fs.writeFileSync('app.js', appJs);
fs.writeFileSync('www/app.js', appJs);
console.log('app.js and www/app.js updated successfully!');
