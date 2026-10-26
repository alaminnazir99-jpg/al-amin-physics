/**
 * Al amin Physics - Complete Application Logic
 * Version 2.0 | Blue Theme | Dark Mode | KaTeX | LocalStorage
 */

/* ===================================================
   LocalStorage Keys & Persistence Layer
=================================================== */
const LS = {
    DARK_MODE:    'alamin_dark_mode',
    ENROLLED:     'alamin_enrolled_courses',
    EXAM_SCORES:  'alamin_exam_scores',
    PROGRESS:     'alamin_chapter_progress',
};

function lsGet(key, fallback) {
    try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; }
    catch { return fallback; }
}
function lsSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

/* ===================================================
   CURRICULUM DATABASE
=================================================== */
const APP_DATA = {
    ssc: {
        levelTitle: "নবম-দশম শ্রেণি",
        gradeTag: "SSC Physics (১৩টি অধ্যায়)",
        chapters: [
            { id: "ssc_c1",  num: 1,  title: "অধ্যায় ১: ভৌত রাশি ও পরিমাপ",                    desc: "রাশি, একক, মাত্রা সমীকরণ, স্লাইড ক্যালিপার্স ও ত্রুটি বিশ্লেষণ।" },
            { id: "ssc_c2",  num: 2,  title: "অধ্যায় ২: গতি",                                   desc: "দূরত্ব, সরণ, দ্রুতি, বেগ, সমত্বরণ এবং গতির ৪টি মৌলিক সমীকরণ।" },
            { id: "ssc_c3",  num: 3,  title: "অধ্যায় ৩: বল",                                    desc: "নিউটনের ৩টি সূত্র, জড়তা, ভরবেগ সংরক্ষণশীলতা নীতি ও ঘর্ষণ বল।" },
            { id: "ssc_c4",  num: 4,  title: "অধ্যায় ৪: কাজ, ক্ষমতা ও শক্তি",                   desc: "কাজ, বিভব শক্তি, গতিশক্তি, শক্তির রূপান্তর ও কর্মদক্ষতা।" },
            { id: "ssc_c5",  num: 5,  title: "অধ্যায় ৫: পদার্থের অবস্থা ও চাপ",                 desc: "চাপ, ঘনত্ব, আর্কিমিডিসের সূত্র, প্লবতা এবং প্যাসকেলের নীতি।" },
            { id: "ssc_c6",  num: 6,  title: "অধ্যায় ৬: বস্তুর উপর তাপের প্রভাব",               desc: "তাপমাত্রা স্কেল, তাপীয় প্রসারণ, আপেক্ষিক তাপ ও সুপ্ততাপ।" },
            { id: "ssc_c7",  num: 7,  title: "অধ্যায় ৭: তরঙ্গ ও শব্দ",                          desc: "সরল স্পন্দন, তরঙ্গদৈর্ঘ্য, কম্পাঙ্ক, শব্দের বেগ ও প্রতিধ্বনি।" },
            { id: "ssc_c8",  num: 8,  title: "অধ্যায় ৮: আলোর প্রতিফলন",                        desc: "দর্পণ, আলোর প্রতিফলনের সূত্র, গোলীয় দর্পণ ও বিম্বের অবস্থান।" },
            { id: "ssc_c9",  num: 9,  title: "অধ্যায় ৯: আলোর প্রতিসরণ",                        desc: "স্নেলের সূত্র, প্রতিসরাঙ্ক, সংকট কোণ, প্রিজম ও লেন্স।" },
            { id: "ssc_c10", num: 10, title: "অধ্যায় ১০: স্থির তড়িৎ",                          desc: "চার্জ, কুলম্বের সূত্র, তড়িৎ ক্ষেত্র, প্রাবল্য ও তড়িৎ বিভব।" },
            { id: "ssc_c11", num: 11, title: "অধ্যায় ১১: চল তড়িৎ",                             desc: "ওহমের সূত্র, রোধের সমবায়, তড়িৎ ক্ষমতা ও নিরাপদ ব্যবহার।" },
            { id: "ssc_c12", num: 12, title: "অধ্যায় ১২: বিদ্যুতের চৌম্বক ক্রিয়া",              desc: "চৌম্বক বলরেখা, ফ্যারাডের আবেশ সূত্র, মোটর ও ট্রান্সফরমার।" },
            { id: "ssc_c13", num: 13, title: "অধ্যায় ১৩: আধুনিক পদার্থবিজ্ঞান ও ইলেকট্রনিক্স",  desc: "তেজস্ক্রিয়তা, এক্স-রে, সেমিকন্ডাক্টর, ডায়োড ও ট্রানজিস্টর।" }
        ]
    },
    hsc1: {
        levelTitle: "একাদশ-দ্বাদশ শ্রেণি (১ম পত্র)",
        gradeTag: "HSC Physics 1st Paper (১০টি অধ্যায়)",
        chapters: [
            { id: "hsc1_c1",  num: 1,  title: "অধ্যায় ১: ভৌত জগৎ ও পরিমাপ",          desc: "পদার্থবিজ্ঞানের পরিসর, তাৎপর্যপূর্ণ অঙ্ক ও পরিমাপে ত্রুটি।" },
            { id: "hsc1_c2",  num: 2,  title: "অধ্যায় ২: ভেক্টর",                     desc: "ভেক্টর যোগের সামান্তরিক সূত্র, ডট ও ক্রস গুণন, ক্যালকুলাস ও নদী-নৌকার গতি।" },
            { id: "hsc1_c3",  num: 3,  title: "অধ্যায় ৩: গতিবিদ্যা",                  desc: "একমাত্রিক গতি, দ্বিমাত্রিক গতি, প্রক্ষেপক বা প্রাসের সম্পূর্ণ গতিপ্রকৃতি।" },
            { id: "hsc1_c4",  num: 4,  title: "অধ্যায় ৪: নিউটনিয়ান বলবিদ্যা",         desc: "জড়তার ভ্রামক, চক্রগতির ব্যাসার্ধ, কৌণিক ভরবেগ, টর্ক ও ব্যাংকিং কোণ।" },
            { id: "hsc1_c5",  num: 5,  title: "অধ্যায় ৫: কাজ, শক্তি ও ক্ষমতা",        desc: "পরিবর্তনশীল বল দ্বারা কাজ, স্প্রিং বলের কাজ এবং শক্তির নিত্যতা।" },
            { id: "hsc1_c6",  num: 6,  title: "অধ্যায় ৬: মহাকর্ষ ও অভিকর্ষ",          desc: "কেপলারের সূত্রাবলি, অভিকর্ষজ ত্বরণের পরিবর্তন, মুক্তিবেগ ও স্যাটেলাইট।" },
            { id: "hsc1_c7",  num: 7,  title: "অধ্যায় ৭: পদার্থের গাঠনিক ধর্ম",       desc: "পীড়ন-বিকৃতি, ইয়ংয়ের গুণাঙ্ক, পৃষ্ঠটান, স্পর্শ কোণ ও সান্দ্রতা।" },
            { id: "hsc1_c8",  num: 8,  title: "অধ্যায় ৮: পর্যাবৃত্ত গতি",              desc: "সরল ছন্দিত স্পন্দন (SHM), অন্তরক সমীকরণ, সরল দোলক ও সেকেন্ড দোলক।" },
            { id: "hsc1_c9",  num: 9,  title: "অধ্যায় ৯: তরঙ্গ",                       desc: "অগ্রগামী তরঙ্গ, স্থির তরঙ্গ, শব্দের তীব্রতা লেভেল (ডেসিবেল) এবং বিট।" },
            { id: "hsc1_c10", num: 10, title: "অধ্যায় ১০: আদর্শ গ্যাস ও গ্যাসের গতিতত্ত্ব", desc: "বয়েলের ও চার্লসের সূত্র, RMS বেগ, স্বাধীনতার মাত্রা ও আপেক্ষিক আর্দ্রতা।" }
        ]
    },
    hsc2: {
        levelTitle: "একাদশ-দ্বাদশ শ্রেণি (২য় পত্র)",
        gradeTag: "HSC Physics 2nd Paper (১১টি অধ্যায়)",
        chapters: [
            { id: "hsc2_c1",  num: 1,  title: "অধ্যায় ১: তাপগতিবিদ্যা",                            desc: "তাপগতিবিদ্যার শূন্যতম, ১ম ও ২য় সূত্র, কার্নো ইঞ্জিন ও এন্ট্রপি।" },
            { id: "hsc2_c2",  num: 2,  title: "অধ্যায় ২: স্থির তড়িৎ",                              desc: "কুলম্বের সূত্র, গাউসের সূত্র, তড়িৎ দ্বিমেরু ও ধারকের সমবায়।" },
            { id: "hsc2_c3",  num: 3,  title: "অধ্যায় ৩: চল তড়িৎ",                                 desc: "কার্শফের সূত্রাবলি, হুইটস্টোন ব্রিজ, মিটার ব্রিজ ও পটেনশিওমিটার।" },
            { id: "hsc2_c4",  num: 4,  title: "অধ্যায় ৪: তড়িৎ প্রবাহের চৌম্বক ক্রিয়া ও চুম্বকত্ব",  desc: "বায়োট-স্যাভার্ট সূত্র, অ্যাম্পিয়ারের বর্তনী সূত্র ও লরেন্জ বল।" },
            { id: "hsc2_c5",  num: 5,  title: "অধ্যায় ৫: তাড়িতচৌম্বক আবেশ ও পরিবর্তী প্রবাহ",       desc: "ফ্যারাডের সূত্র, লেঞ্জের সূত্র, স্বকীয় ও পারস্পরিক আবেশ এবং AC বর্তনী।" },
            { id: "hsc2_c6",  num: 6,  title: "অধ্যায় ৬: জ্যামিতিক আলোকবিজ্ঞান",                    desc: "প্রিজমে প্রতিসরণ, লেন্স প্রস্তুতকারকের সূত্র ও আলোকীয় যন্ত্রসমূহ।" },
            { id: "hsc2_c7",  num: 7,  title: "অধ্যায় ৭: ভৌত আলোকবিজ্ঞান",                          desc: "হাইগেনের তরঙ্গ তত্ত্ব, ব্যতিচার, অপবর্তন ও সমবর্তন।" },
            { id: "hsc2_c8",  num: 8,  title: "অধ্যায় ৮: আধুনিক পদার্থবিজ্ঞানের সূচনা",              desc: "আপেক্ষিকতা তত্ত্ব, আলোক তড়িৎ ক্রিয়া ও কমপটন প্রভাব।" },
            { id: "hsc2_c9",  num: 9,  title: "অধ্যায় ৯: পরমাণু মডেল ও নিউক্লিয়ার পদার্থবিজ্ঞান",   desc: "রাদারফোর্ড ও বোর মডেল, তেজস্ক্রিয় ক্ষয় সূত্র, অর্ধায়ু ও বন্ধন শক্তি।" },
            { id: "hsc2_c10", num: 10, title: "অধ্যায় ১০: সেমিকন্ডাক্টর ও ইলেকট্রনিক্স",             desc: "p-n জাংশন ডায়োড, রেকটিফায়ার, ট্রানজিস্টর ও লজিক গেট।" },
            { id: "hsc2_c11", num: 11, title: "অধ্যায় ১১: জ্যোতির্বিজ্ঞান",                          desc: "নক্ষত্রের জীবনচক্র, হাবলের সূত্র ও কৃষ্ণগহ্বর।" }
        ]
    },
    class8: {
        levelTitle: "অষ্টম শ্রেণি বিজ্ঞান (Physics Modules)",
        gradeTag: "Class 8 Science - NCTB 2026 (Physics অংশ — ৪টি অধ্যায়)",
        /* ── NCTB ২০২৬ অষ্টম শ্রেণি বিজ্ঞান বইয়ের পদার্থবিজ্ঞান সংশ্লিষ্ট অধ্যায়সমূহ ── */
        chapters: [
            {
                id: "c8_c7",  num: 7,
                title: "অধ্যায় ৭: পৃথিবী ও মহাকর্ষ",
                desc:  "মহাকর্ষ বল, নিউটনের মহাকর্ষ সূত্র, অভিকর্ষজ ত্বরণ 'g' এর মান এবং ভর ও ওজনের পার্থক্য।"
            },
            {
                id: "c8_c9",  num: 9,
                title: "অধ্যায় ৯: বর্তনী ও চলবিদ্যুৎ",
                desc:  "বৈদ্যুতিক বর্তনী, বিদ্যুৎ প্রবাহ, রোধ, সিরিজ ও সমান্তরাল সংযোগ, অ্যামিটার ও ভোল্টমিটার।"
            },
            {
                id: "c8_c11", num: 11,
                title: "অধ্যায় ১১: আলো",
                desc:  "আলোর প্রতিফলন ও প্রতিসরণ, সংকট কোণ, পূর্ণ অভ্যন্তরীণ প্রতিফলন এবং অপটিক্যাল ফাইবার।"
            },
            {
                id: "c8_c12", num: 12,
                title: "অধ্যায় ১২: মহাকাশ ও উপগ্রহ",
                desc:  "সৌরজগৎ, কৃত্রিম উপগ্রহ, কক্ষপথ, মুক্তিবেগ এবং মহাবিশ্বের গঠন সম্পর্কে প্রাথমিক ধারণা।"
            }
        ]
    }
};

/* ===================================================
   APPLICATION STATE
=================================================== */
let currentLevel        = 'ssc';
let currentChapterIndex = 1;       // default: অধ্যায় ২: গতি
let currentTab          = 'basic';
let currentUserRole     = 'student';
let tempSelectedRole    = 'student';

// Persisted data (loaded from localStorage)
let enrolledCourses  = lsGet(LS.ENROLLED,    { ssc_c2: true });
let examScoresStore  = lsGet(LS.EXAM_SCORES,  {});
let chapterProgress  = lsGet(LS.PROGRESS,     {});   // { chapId: percent 0-100 }

// Simulation State
let simMode          = 'pendulum';
let simRunning       = true;
let animFrameId      = null;

let pendAngle      = Math.PI / 4;
let pendAngularVel = 0;
let pendLength     = 170;
let pendGravity    = 9.8;
let pendMass       = 40;

let projAngle      = 45;
let projSpeed      = 45;
let projTime       = 0;
let projG          = 9.8;
let projTrajectory = [];

// Exam State
let examTimerInterval = null;
let examTimeLeft      = 300;
let examUserAnswers   = {};

// Q&A Store
let chapterQAStore = {
    default: [
        {
            author: "তানভীর আহমেদ (শিক্ষার্থী)",
            time: "১ ঘণ্টা আগে",
            title: "সমত্বরণে চলমান বস্তুর সরণ বনাম সময়ের গ্রাফ কেন পরাবৃত্তাকার হয়?",
            desc: "আমরা জানি s = ut + ½ at²। এখানে t এর উপর বর্গ থাকায় গ্রাফটি কেমন রূপ নেয়?",
            reply: {
                author: "আল আমিন স্যার (শিক্ষক)",
                text: "যেহেতু সরণ (s) সময়ের বর্গের (t²) সাথে সমানুপাতিক, তাই এটি একটি দ্বিঘাত সমীকরণ। গাণিতিকভাবে দ্বিঘাত সম্পর্কের লেখচিত্র সর্বদা পরাবৃত্ত (Parabola) হয়ে থাকে।"
            }
        }
    ]
};

// Exam Bank
const EXAM_BANK = [
    { q: "১. কোনো বস্তুর আদিবেগ 0 m/s এবং ত্বরণ 2.5 m/s² হলে, 6 সেকেন্ড পর এর অতিক্রান্ত দূরত্ব কত?", options: ["১৫ m","৪৫ m","৩০ m","৯০ m"], correct: 1, exp: "s = ut + ½at² = 0 + ½ × 2.5 × 36 = 45 m।" },
    { q: "২. খাড়া উপরে নিক্ষিপ্ত বস্তুর সর্বোচ্চ উচ্চতায় ত্বরণ কত?", options: ["0 m/s²","9.8 m/s² (নিচে)","9.8 m/s² (উপরে)","অসীম"], correct: 1, exp: "সর্বোচ্চ উচ্চতায় বেগ শূন্য হলেও অভিকর্ষ সর্বদা 9.8 m/s² নিচের দিকে কার্যকর।" },
    { q: "৩. 72 km/h থেকে 10 সেকেন্ডে থেমে গেলে মন্দন কত?", options: ["7.2 m/s²","2 m/s²","3.6 m/s²","5 m/s²"], correct: 1, exp: "72 km/h = 20 m/s; a = (20-0)/10 = 2 m/s²।" },
    { q: "৪. দ্রুতি-সময় লেখচিত্রের নিচের ক্ষেত্রফল কী নির্দেশ করে?", options: ["ত্বরণ","অতিক্রান্ত দূরত্ব","বল","ক্ষমতা"], correct: 1, exp: "v-t গ্রাফের ক্ষেত্রফল (∫v dt) বস্তুটির মোট অতিক্রান্ত দূরত্ব।" },
    { q: "৫. পৃথিবীতে একটি সেকেন্ড দোলকের কার্যকর দৈর্ঘ্য প্রায় কত?", options: ["0.5 m","0.993 m","1.5 m","2 m"], correct: 1, exp: "L = gT²/(4π²) = 9.8 × 4/(4 × 9.87) ≈ 0.993 m।" }
];

/* ===================================================
   DARK MODE
=================================================== */
function initDarkMode() {
    const saved = lsGet(LS.DARK_MODE, false);
    if (saved) document.body.classList.add('dark-mode');
    updateDarkToggleUI(saved);
}

function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    lsSet(LS.DARK_MODE, isDark);
    updateDarkToggleUI(isDark);
}

function updateDarkToggleUI(isDark) {
    const icon = document.getElementById('dark-icon');
    if (icon) icon.textContent = isDark ? '☀️' : '🌙';
}

/* ===================================================
   INITIALIZATION
=================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initSimulation();
    runPhysicsCalculator();
    showLMSDashboard();
});

/* ===================================================
   NAVIGATION & SUB-HOMEPAGE LOGIC
=================================================== */
let currentViewMode = 'dashboard'; // 'dashboard' | 'classroom' | 'aggregator'

function showLMSDashboard() {
    currentViewMode = 'dashboard';
    
    // UI visibility
    const subhome = document.getElementById('lms-subhomepage');
    const aggView = document.getElementById('global-aggregator-view');
    const headerCard = document.getElementById('classroom-chapter-header');
    const contentArea = document.getElementById('content-display-area');
    
    if (subhome) subhome.classList.remove('hidden');
    if (aggView) aggView.classList.add('hidden');
    if (headerCard) headerCard.classList.add('hidden');
    if (contentArea) contentArea.classList.add('hidden');

    // Nav button state
    ['ssc','hsc1','hsc2','class8'].forEach(k => {
        const btn = document.getElementById(`nav-${k}`);
        if (btn) btn.classList.remove('nav-active', 'text-white', 'bg-blue-600');
    });
    const lmsHomeBtn = document.getElementById('nav-lms-home');
    if (lmsHomeBtn) {
        lmsHomeBtn.classList.add('bg-blue-600', 'text-white');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectLevelAndOpen(lvl) {
    switchLevel(lvl);
    openClassroomView();
}

function openClassroomView() {
    currentViewMode = 'classroom';
    const subhome = document.getElementById('lms-subhomepage');
    const aggView = document.getElementById('global-aggregator-view');
    const headerCard = document.getElementById('classroom-chapter-header');
    const contentArea = document.getElementById('content-display-area');

    if (subhome) subhome.classList.add('hidden');
    if (aggView) aggView.classList.add('hidden');
    if (headerCard) headerCard.classList.remove('hidden');
    if (contentArea) contentArea.classList.remove('hidden');

    const lmsHomeBtn = document.getElementById('nav-lms-home');
    if (lmsHomeBtn) {
        lmsHomeBtn.classList.remove('bg-blue-600', 'text-white');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchLevel(lvl) {
    currentLevel        = lvl;
    currentChapterIndex = 0;

    ['ssc','hsc1','hsc2','class8'].forEach(k => {
        const btn = document.getElementById(`nav-${k}`);
        if (!btn) return;
        if (k === lvl) {
            btn.classList.add('nav-active', 'bg-blue-600', 'text-white');
            btn.classList.remove('text-slate-600');
        } else {
            btn.classList.remove('nav-active', 'bg-blue-600', 'text-white');
            btn.classList.add('text-slate-600');
        }
    });

    const select = document.getElementById('chapter-select');
    if (select && APP_DATA[lvl]) {
        select.innerHTML = '';
        APP_DATA[lvl].chapters.forEach((chap, idx) => {
            const opt = document.createElement('option');
            opt.value = idx;
            opt.textContent = chap.title;
            select.appendChild(opt);
        });
        select.value = 0;
    }
    renderChapterData();
    openClassroomView();
}

function changeChapter(idx) {
    currentChapterIndex = parseInt(idx);
    renderChapterData();
}

function switchTab(tabKey) {
    currentTab = tabKey;

    document.querySelectorAll('.subtab-btn').forEach(btn => {
        btn.classList.remove('subtab-active', 'subtab-paid-active');
    });

    const activeBtn = document.getElementById(`tab-${tabKey}`);
    if (activeBtn) {
        activeBtn.classList.add(tabKey === 'paid' ? 'subtab-paid-active' : 'subtab-active');
    }

    document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById(`section-${tabKey}`);
    if (target) target.classList.remove('hidden');

    if (tabKey === 'simulation' && !animFrameId) startSimLoop();

    // Mark progress when opening a section
    addProgress(getCurrentChap().id, tabKey);
}

function getCurrentChap() {
    return APP_DATA[currentLevel].chapters[currentChapterIndex];
}

/* ===================================================
   CHAPTER PROGRESS TRACKING
=================================================== */
const TAB_WEIGHTS = {
    basic: 10, video: 20, formulas: 10, math: 15,
    comprehension: 10, board: 10, simulation: 5,
    qa: 5, exam: 10, paid: 5
};

function addProgress(chapId, tabKey) {
    if (!chapterProgress[chapId]) chapterProgress[chapId] = {};
    chapterProgress[chapId][tabKey] = true;
    lsSet(LS.PROGRESS, chapterProgress);
    updateProgressBar(chapId);
}

function getProgress(chapId) {
    const visited  = chapterProgress[chapId] || {};
    let total = 0, earned = 0;
    Object.entries(TAB_WEIGHTS).forEach(([tab, w]) => {
        total += w;
        if (visited[tab]) earned += w;
    });
    return Math.round((earned / total) * 100);
}

function updateProgressBar(chapId) {
    const pct  = getProgress(chapId);
    const bar  = document.getElementById('chapter-progress-fill');
    const label = document.getElementById('chapter-progress-label');
    if (bar)   bar.style.width = pct + '%';
    if (label) label.textContent = `${pct}% সম্পন্ন`;
}

/* ===================================================
   RENDER CHAPTER MODULES
=================================================== */
function renderChapterData() {
    const chap      = getCurrentChap();
    const levelInfo = APP_DATA[currentLevel];

    document.getElementById('level-badge').textContent          = levelInfo.gradeTag;
    document.getElementById('current-chapter-title').textContent = chap.title;
    document.getElementById('current-chapter-desc').textContent  = chap.desc;

    updateProgressBar(chap.id);

    /* ── 1. BASIC ── */
    document.getElementById('basic-content-body').innerHTML = `
        <div class="space-y-4 text-sm leading-relaxed">
            <p><strong>${chap.title}</strong> অধ্যায়টি পদার্থবিজ্ঞানের একটি মৌলিক স্তম্ভ। প্রাকৃতিক ঘটনার পরিমাপযোগ্য রাশিমালা ও তাদের গাণিতিক সম্পর্ক এই অধ্যায়ের মূল বিষয়।</p>
            <div class="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-blue-950 text-sm">
                <div class="font-bold text-blue-800 flex items-center gap-2 mb-1"><i class="fa-solid fa-lightbulb text-blue-500"></i> মূল কনসেপ্ট</div>
                পদার্থবিজ্ঞানের সূত্রগুলো সঠিকভাবে অনুধাবন করলে বোর্ড পরীক্ষা ও বাস্তব জীবনের সমস্যা সমাধান অত্যন্ত সাবলীল হয়ে ওঠে।
            </div>
        </div>`;

    document.getElementById('basic-definitions').innerHTML = `
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 card-hover">
            <span class="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full mb-2 inline-block">সংজ্ঞা ও তাৎপর্য</span>
            <h5 class="font-bold text-sm mb-1">ভৌত পরিবর্তনের বিশ্লেষণ</h5>
            <p class="text-xs text-slate-600">সময়ের সাথে পরিবর্তনশীল যেকোনো ভৌত অবস্থার সঠিক মান নির্ণয় এবং কারণ অনুসন্ধানের বিজ্ঞানসম্মত বিশ্লেষণ।</p>
        </div>
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 card-hover">
            <span class="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full mb-2 inline-block">SI একক ও মাত্রা</span>
            <h5 class="font-bold text-sm mb-1">প্রয়োজনীয় এককাবলী</h5>
            <p class="text-xs text-slate-600">দূরত্ব: মিটার (m), সময়: সেকেন্ড (s), বেগ: m/s, বল: নিউটন (N), কাজ: জুল (J)।</p>
        </div>`;

    document.getElementById('quick-highlights').innerHTML = `
        <li class="flex items-center gap-2"><i class="fa-solid fa-circle-check text-blue-400 text-xs"></i> <span>বোর্ড ও কলেজের স্ট্যান্ডার্ড প্রশ্ন বিন্যাস</span></li>
        <li class="flex items-center gap-2"><i class="fa-solid fa-circle-check text-blue-400 text-xs"></i> <span>সকল গুরুত্বপূর্ণ সূত্রের প্রতিপাদন</span></li>
        <li class="flex items-center gap-2"><i class="fa-solid fa-circle-check text-blue-400 text-xs"></i> <span>লেখচিত্র ও বাস্তব উদাহরণ বিশ্লেষণ</span></li>
        <li class="flex items-center gap-2"><i class="fa-solid fa-circle-check text-blue-400 text-xs"></i> <span>ক্যালকুলেটর শর্টকাট ট্রিকস</span></li>`;

    /* ── 2. VIDEO PLAYLIST ── */
    document.getElementById('video-now-playing').textContent = `লেকচার ১: ${chap.title} - মৌলিক আলোচনা`;
    document.getElementById('video-playlist').innerHTML = [
        { label: "লেকচার ১: মৌলিক পরিচিতি ও সংজ্ঞা", dur: "২২ মিনিট", active: true, paid: false },
        { label: "লেকচার ২: সূত্রের প্রতিপাদন ও গ্রাফ",  dur: "২৮ মিনিট", active: false, paid: false },
        { label: "লেকচার ৩: জটিল গাণিতিক সমস্যা",       dur: "৩৫ মিনিট", active: false, paid: false },
        { label: "লেকচার ৪: বোর্ড CQ হ্যাকস",             dur: "৪৫ মিনিট", active: false, paid: true  }
    ].map(v => `
        <div class="p-3 ${v.active ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'} rounded-xl border flex items-center justify-between cursor-pointer transition">
            <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-lg ${v.active ? 'bg-blue-600' : v.paid ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'} text-white flex items-center justify-center text-xs">
                    <i class="fa-solid ${v.paid ? 'fa-crown' : 'fa-play'}"></i>
                </div>
                <div>
                    <p class="text-xs font-bold">${v.label}</p>
                    <span class="text-[10px] ${v.active ? 'text-blue-700' : v.paid ? 'text-amber-700' : 'text-slate-400'} font-semibold">আল আমিন স্যার • ${v.dur}</span>
                </div>
            </div>
            ${v.active ? '<span class="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">চলছে</span>' : v.paid ? '<span class="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">পেইড</span>' : ''}
        </div>`).join('');

    /* ── 3. FORMULAS (KaTeX rendered) ── */
    const formulas = [
        { tag: "সূত্র ১", expr: "v = u + at",           note: "শেষবেগ, আদিবেগ, ত্বরণ ও সময়ের সম্পর্ক।" },
        { tag: "সূত্র ২", expr: "s = ut + \\tfrac{1}{2}at^2", note: "অতিক্রান্ত সরণ নির্ণয়।" },
        { tag: "সূত্র ৩", expr: "v^2 = u^2 + 2as",     note: "সময় ছাড়া বেগ ও দূরত্বের সম্পর্ক।" },
        { tag: "সূত্র ৪", expr: "\\vec{F} = m\\vec{a}", note: "নিউটনের ২য় সূত্র (বল = ভর × ত্বরণ)।" },
        { tag: "সূত্র ৫", expr: "E_k = \\tfrac{1}{2}mv^2", note: "গতিশক্তি।" },
        { tag: "সূত্র ৬", expr: "T = 2\\pi\\sqrt{\\dfrac{L}{g}}", note: "সরল দোলকের দোলনকাল।" }
    ];
    document.getElementById('formula-cards-container').innerHTML = formulas.map(f => `
        <div class="p-4 rounded-2xl bg-white border border-slate-200 card-hover shadow-sm">
            <span class="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">${f.tag}</span>
            <div class="my-3 text-slate-900 overflow-x-auto katex-formula" data-expr="${f.expr}"></div>
            <p class="text-xs text-slate-600">${f.note}</p>
        </div>`).join('');

    // Render KaTeX after DOM update
    setTimeout(() => {
        document.querySelectorAll('.katex-formula').forEach(el => {
            try {
                katex.render(el.dataset.expr, el, { throwOnError: false, displayMode: false });
            } catch(e) {
                el.textContent = el.dataset.expr;
            }
        });
    }, 50);

    /* ── 4. MATH PROBLEMS ── */
    document.getElementById('math-problems-list').innerHTML = `
        <div class="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3 card-hover">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full">বোর্ড CQ স্ট্যান্ডার্ড</span>
                <span class="text-xs text-slate-400">নম্বর: ৩</span>
            </div>
            <h5 class="text-sm font-bold">একটি ট্রেন 0.5 m/s² সমত্বরণে চলে 180 m দূরত্ব অতিক্রম করে। সময় ও শেষবেগ নির্ণয় করো।</h5>
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono space-y-1.5 text-slate-700">
                <p class="text-blue-700 font-bold">// দেওয়া আছে: u = 0, a = 0.5 m/s², s = 180 m</p>
                <p>s = ½ at² → t = √(2s/a) = √720 ≈ <strong>26.83 s</strong></p>
                <p>v = u + at = 0 + 0.5×26.83 = <strong>13.42 m/s</strong></p>
            </div>
        </div>
        <div class="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3 card-hover">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full">এডমিশন স্ট্যান্ডার্ড</span>
                <span class="text-xs text-slate-400">নম্বর: ৪</span>
            </div>
            <h5 class="text-sm font-bold">120 m উঁচু টাওয়ার থেকে 20 m/s বেগে খাড়া উপরে নিক্ষেপ করা বলটি কত সময়ে মাটিতে পড়বে? (g = 9.8 m/s²)</h5>
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono space-y-1.5 text-slate-700">
                <p class="text-indigo-700 font-bold">// উপরে ধনাত্মক: u = +20, g = -9.8, h = -120 m</p>
                <p>−120 = 20t − 4.9t² → 4.9t² − 20t − 120 = 0</p>
                <p>t = [20 ± √(400 + 2352)] / 9.8 → <strong>t ≈ 7.49 s</strong></p>
            </div>
        </div>`;

    /* ── 5. COMPREHENSION ── */
    document.getElementById('comprehension-questions-list').innerHTML = `
        <div class="p-4 rounded-xl border border-slate-200 bg-white shadow-sm card-hover">
            <h5 class="font-bold text-sm mb-2 flex items-center gap-2">
                <span class="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">ক</span>
                গাছ থেকে ফল পড়ার সময় এর ত্বরণ বৃদ্ধি পায় কি? ব্যাখ্যা করো। [ঢাকা বোর্ড ২০২৪]
            </h5>
            <div class="text-xs pl-4 border-l-2 border-blue-500 space-y-1 leading-relaxed text-slate-600">
                <p><strong>উত্তর:</strong> না। বাতাসের বাধা অগ্রাহ্য করলে অভিকর্ষজ ত্বরণ g = 9.8 m/s² সর্বদা ধ্রুব থাকে। শুধু বেগ বাড়ে।</p>
            </div>
        </div>
        <div class="p-4 rounded-xl border border-slate-200 bg-white shadow-sm card-hover">
            <h5 class="font-bold text-sm mb-2 flex items-center gap-2">
                <span class="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">খ</span>
                বৈদ্যুতিক পাখার সুইচ বন্ধের পরেও পাখা কেন সাথে সাথে থামে না? [চট্টগ্রাম বোর্ড ২০২৩]
            </h5>
            <div class="text-xs pl-4 border-l-2 border-blue-500 space-y-1 leading-relaxed text-slate-600">
                <p><strong>উত্তর:</strong> নিউটনের ১ম সূত্র অনুযায়ী গতি জড়তার কারণে। বিদ্যুৎ বন্ধ হলেও ঘূর্ণন গতি জড়তাবশত অব্যাহত থাকে; ঘর্ষণে ধীরে থামে।</p>
            </div>
        </div>`;

    /* ── 6. BOARD QUESTIONS ── */
    document.getElementById('board-questions-list').innerHTML = `
        <div class="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3 card-hover">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                <span class="px-3 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">রাজশাহী বোর্ড ২০২৪</span>
                <span class="text-xs text-slate-500">পূর্ণমান: ১০</span>
            </div>
            <p class="text-xs text-slate-800 leading-relaxed font-medium">
                <strong>উদ্দীপক:</strong> একটি 800 kg গাড়ি 72 km/h বেগে চলছিল। চালক 40 m সামনে পথচারী দেখে সাথে সাথে ব্রেক চাপলেন। গাড়িটি পথচারীর 2 m সামনে থামল।
            </p>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-700">
                <p><span class="font-bold text-blue-700">(গ)</span> ব্রেকিং বল: a = u²/2s = 400/76 = 5.26 m/s²; F = 800 × 5.26 = <strong>4210.53 N</strong></p>
                <p><span class="font-bold text-blue-700">(ঘ)</span> 0.4s দেরিতে ব্রেক: প্রতিক্রিয়া দূরত্ব = 20×0.4 = 8 m; মোট = 8+38 = 46 m > 40 m → দুর্ঘটনা ঘটত।</p>
            </div>
        </div>`;

    /* ── 7. Q&A FEED ── */
    renderQAFeed();

    /* ── 8. EXAM reset ── */
    document.getElementById('exam-start-screen').classList.remove('hidden');
    document.getElementById('exam-active-screen').classList.add('hidden');
    document.getElementById('exam-result-screen').classList.add('hidden');
    initExamQuestions();

    // Show previous exam score if exists
    const prevScore = examScoresStore[chap.id];
    if (prevScore !== undefined) {
        const scoreHint = document.getElementById('exam-prev-score');
        if (scoreHint) {
            scoreHint.textContent = `গত পরীক্ষায় আপনি পেয়েছিলেন: ${prevScore}/${EXAM_BANK.length}`;
            scoreHint.classList.remove('hidden');
        }
    }

    /* ── 9. PAID COURSE ── */
    const isEnrolled = enrolledCourses[chap.id];
    document.getElementById('paid-course-title').textContent = `${chap.title} - স্পেশাল প্রিমিয়াম কোর্স`;
    const actionBox = document.getElementById('enrollment-action-container');
    actionBox.innerHTML = isEnrolled
        ? `<div class="px-6 py-3.5 bg-blue-600 text-white font-black rounded-xl flex items-center gap-2 text-sm shadow-xl"><i class="fa-solid fa-circle-check text-lg"></i> কোর্সে এনরোল্ড আছেন (All Unlocked)</div>`
        : `<button onclick="openPaymentModal()" class="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black rounded-xl shadow-lg transition transform hover:scale-[1.02]"><i class="fa-solid fa-lock-open mr-2"></i> এখনই এনরোল করুন (bKash/Nagad)</button>`;
}

/* ===================================================
   SIMULATION
=================================================== */
function initSimulation() {
    updateSimControlsUI();
    startSimLoop();
}

function setSimMode(mode) {
    simMode = mode;
    updateSimControlsUI();
    resetSimulation();
}

function updateSimControlsUI() {
    const container = document.getElementById('simulation-controls');
    if (simMode === 'pendulum') {
        container.innerHTML = `
            <div class="flex gap-2 mb-3">
                <button onclick="setSimMode('pendulum')" class="w-1/2 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">সরল দোলক</button>
                <button onclick="setSimMode('projectile')" class="w-1/2 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold">প্রাসের গতি</button>
            </div>
            <div>
                <div class="flex justify-between mb-1"><span>দোলকের দৈর্ঘ্য L (cm):</span><span id="sim-len-val" class="font-bold text-blue-600">${pendLength}</span></div>
                <input type="range" min="80" max="250" value="${pendLength}" oninput="pendLength=parseFloat(this.value);document.getElementById('sim-len-val').textContent=this.value;" class="w-full accent-blue-600">
            </div>
            <div>
                <div class="flex justify-between mb-1"><span>g (m/s²):</span><span id="sim-g-val" class="font-bold text-blue-600">${pendGravity}</span></div>
                <input type="range" min="1.6" max="25" step="0.2" value="${pendGravity}" oninput="pendGravity=parseFloat(this.value);document.getElementById('sim-g-val').textContent=this.value;" class="w-full accent-blue-600">
            </div>
            <div>
                <div class="flex justify-between mb-1"><span>ভর m (gram):</span><span id="sim-m-val" class="font-bold text-blue-600">${pendMass}</span></div>
                <input type="range" min="10" max="100" value="${pendMass}" oninput="pendMass=parseFloat(this.value);document.getElementById('sim-m-val').textContent=this.value;" class="w-full accent-blue-600">
            </div>`;
    } else {
        container.innerHTML = `
            <div class="flex gap-2 mb-3">
                <button onclick="setSimMode('pendulum')" class="w-1/2 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold">সরল দোলক</button>
                <button onclick="setSimMode('projectile')" class="w-1/2 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">প্রাসের গতি</button>
            </div>
            <div>
                <div class="flex justify-between mb-1"><span>কোণ θ (°):</span><span id="sim-proj-ang" class="font-bold text-blue-600">${projAngle}</span></div>
                <input type="range" min="15" max="85" value="${projAngle}" oninput="projAngle=parseFloat(this.value);document.getElementById('sim-proj-ang').textContent=this.value;resetSimulation();" class="w-full accent-blue-600">
            </div>
            <div>
                <div class="flex justify-between mb-1"><span>আদিবেগ v₀ (m/s):</span><span id="sim-proj-spd" class="font-bold text-blue-600">${projSpeed}</span></div>
                <input type="range" min="20" max="80" value="${projSpeed}" oninput="projSpeed=parseFloat(this.value);document.getElementById('sim-proj-spd').textContent=this.value;resetSimulation();" class="w-full accent-blue-600">
            </div>`;
    }
}

function toggleSimPlay() {
    simRunning = !simRunning;
    document.getElementById('sim-play-icon').className = `fa-solid fa-${simRunning ? 'pause' : 'play'}`;
    document.getElementById('sim-play-text').textContent = simRunning ? 'পজ' : 'প্লে';
}

function resetSimulation() {
    if (simMode === 'pendulum') { pendAngle = Math.PI / 4; pendAngularVel = 0; }
    else { projTime = 0; projTrajectory = []; }
    simRunning = true;
    document.getElementById('sim-play-icon').className = "fa-solid fa-pause";
    document.getElementById('sim-play-text').textContent = "পজ";
}

function startSimLoop() {
    const canvas = document.getElementById('physics-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (simMode === 'pendulum') drawPendulum(ctx, canvas);
        else                       drawProjectile(ctx, canvas);
        animFrameId = requestAnimationFrame(loop);
    }
    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(loop);
}

function drawPendulum(ctx, canvas) {
    if (simRunning) {
        const acc = (-1 * pendGravity * 5 / pendLength) * Math.sin(pendAngle);
        pendAngularVel += acc * 0.16;
        pendAngularVel *= 0.998;
        pendAngle      += pendAngularVel * 0.16;
    }
    const ox = canvas.width / 2, oy = 40;
    const bx = ox + pendLength * Math.sin(pendAngle);
    const by = oy + pendLength * Math.cos(pendAngle);

    ctx.strokeStyle = "#475569"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(ox - 70, oy); ctx.lineTo(ox + 70, oy); ctx.stroke();

    ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(bx, by); ctx.stroke();

    const r = 12 + pendMass / 30;
    const g = ctx.createRadialGradient(bx-4, by-4, 2, bx, by, r);
    g.addColorStop(0, '#60a5fa'); g.addColorStop(1, '#1d4ed8');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI*2); ctx.fill();

    const T = (2 * Math.PI * Math.sqrt(pendLength / (pendGravity * 100))).toFixed(2);
    ctx.fillStyle = "#f1f5f9"; ctx.font = "12px monospace";
    ctx.fillText(`T ≈ ${T}s | θ: ${(pendAngle * 180 / Math.PI).toFixed(1)}°`, 20, canvas.height - 20);
    document.getElementById('sim-live-stats').textContent = `দোলনকাল T ≈ ${T}s | কোণ: ${(pendAngle*180/Math.PI).toFixed(1)}° | g: ${pendGravity} m/s²`;
}

function drawProjectile(ctx, canvas) {
    const rad = projAngle * Math.PI / 180;
    const sx = 50, sy = canvas.height - 50;
    if (simRunning) {
        projTime += 0.08;
        const cx = sx + projSpeed * Math.cos(rad) * projTime * 2.8;
        const cy = sy - (projSpeed * Math.sin(rad) * projTime - 0.5 * projG * projTime * projTime) * 2.8;
        if (cy <= sy) projTrajectory.push({ x: cx, y: cy });
        else simRunning = false;
    }
    ctx.strokeStyle = "#334155"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(canvas.width, sy); ctx.stroke();

    ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 2; ctx.setLineDash([4,4]);
    ctx.beginPath();
    projTrajectory.forEach((p,i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke(); ctx.setLineDash([]);

    const lp = projTrajectory[projTrajectory.length-1] || {x:sx,y:sy};
    ctx.fillStyle = "#f59e0b"; ctx.beginPath(); ctx.arc(lp.x, lp.y, 10, 0, Math.PI*2); ctx.fill();

    const H = (projSpeed*projSpeed*Math.sin(rad)*Math.sin(rad)/(2*projG)).toFixed(1);
    const R = (projSpeed*projSpeed*Math.sin(2*rad)/projG).toFixed(1);
    document.getElementById('sim-live-stats').textContent = `H: ${H}m | R: ${R}m | θ: ${projAngle}°`;
}

/* ===================================================
   PHYSICS CALCULATOR
=================================================== */
function runPhysicsCalculator() {
    const u = parseFloat(document.getElementById('calc-u')?.value) || 0;
    const a = parseFloat(document.getElementById('calc-a')?.value) || 0;
    const t = parseFloat(document.getElementById('calc-t')?.value) || 0;
    const s = u*t + 0.5*a*t*t;
    const v = u + a*t;
    const sEl = document.getElementById('calc-res-s');
    const vEl = document.getElementById('calc-res-v');
    if (sEl) sEl.textContent = `${s.toFixed(2)} m`;
    if (vEl) vEl.textContent = `${v.toFixed(2)} m/s`;
}

/* ===================================================
   EXAM ENGINE
=================================================== */
function initExamQuestions() {
    const container = document.getElementById('exam-questions-container');
    if (!container) return;
    container.innerHTML = '';
    EXAM_BANK.forEach((item, qIdx) => {
        const qBox = document.createElement('div');
        qBox.className = "p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3";
        qBox.innerHTML = `
            <h5 class="font-bold text-sm">${item.q}</h5>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                ${item.options.map((opt, oi) => `
                    <label class="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-400 flex items-center gap-3 cursor-pointer transition">
                        <input type="radio" name="eq_${qIdx}" value="${oi}" onchange="recordExamAnswer(${qIdx},${oi})" class="accent-blue-600">
                        <span class="font-medium">${opt}</span>
                    </label>`).join('')}
            </div>`;
        container.appendChild(qBox);
    });
}

function recordExamAnswer(qIdx, optIdx) { examUserAnswers[qIdx] = optIdx; }

function startExamSession() {
    document.getElementById('exam-start-screen').classList.add('hidden');
    document.getElementById('exam-active-screen').classList.remove('hidden');
    document.getElementById('exam-result-screen').classList.add('hidden');
    examTimeLeft = 300; examUserAnswers = {};
    initExamQuestions();
    if (examTimerInterval) clearInterval(examTimerInterval);
    examTimerInterval = setInterval(() => {
        examTimeLeft--;
        const m = String(Math.floor(examTimeLeft/60)).padStart(2,'0');
        const s = String(examTimeLeft%60).padStart(2,'0');
        document.getElementById('exam-timer-display').textContent = `${m}:${s}`;
        if (examTimeLeft <= 0) { clearInterval(examTimerInterval); submitExamAnswers(); }
    }, 1000);
}

function submitExamAnswers() {
    if (examTimerInterval) clearInterval(examTimerInterval);
    let score = 0;
    EXAM_BANK.forEach((item, idx) => { if (examUserAnswers[idx] === item.correct) score++; });

    // Persist score
    const chapId = getCurrentChap().id;
    examScoresStore[chapId] = score;
    lsSet(LS.EXAM_SCORES, examScoresStore);
    addProgress(chapId, 'exam');

    document.getElementById('exam-active-screen').classList.add('hidden');
    document.getElementById('exam-result-screen').classList.remove('hidden');
    document.getElementById('exam-score-display').textContent = `${score} / ${EXAM_BANK.length}`;
    document.getElementById('exam-percent-display').textContent = `সফলতার হার: ${Math.round(score/EXAM_BANK.length*100)}%`;
}

function restartExamSession() { startExamSession(); }

function reviewExamAnswers() {
    const box = document.getElementById('exam-review-box');
    box.classList.toggle('hidden');
    box.innerHTML = EXAM_BANK.map(item => `
        <div class="p-3 bg-white rounded-xl border border-slate-200 text-xs">
            <p class="font-bold">${item.q}</p>
            <p class="text-blue-700 font-semibold mt-1">সঠিক উত্তর: ${item.options[item.correct]}</p>
            <p class="text-slate-500 mt-0.5">ব্যাখ্যা: ${item.exp}</p>
        </div>`).join('');
}

/* ===================================================
   Q&A FORUM
=================================================== */
function renderQAFeed() {
    const feed = document.getElementById('qa-questions-feed');
    const qs   = chapterQAStore["default"] || [];
    feed.innerHTML = qs.map(item => `
        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">${item.author[0]}</span>
                    <span class="text-xs font-bold">${item.author}</span>
                </div>
                <span class="text-[10px] text-slate-400">${item.time}</span>
            </div>
            <h5 class="text-sm font-semibold">${item.title}</h5>
            <p class="text-xs text-slate-600 leading-relaxed">${item.desc}</p>
            ${item.reply ? `<div class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1">
                <div class="font-bold text-blue-800 flex items-center gap-1.5"><i class="fa-solid fa-check-double"></i>${item.reply.author}:</div>
                <p class="text-blue-950">${item.reply.text}</p>
            </div>` : ''}
        </div>`).join('');
}

function openAskModal()  { document.getElementById('ask-modal').classList.remove('hidden'); }
function closeAskModal() { document.getElementById('ask-modal').classList.add('hidden'); }

function handleQuestionSubmit(e) {
    e.preventDefault();
    const name  = document.getElementById('ask-name').value;
    const title = document.getElementById('ask-title').value;
    const desc  = document.getElementById('ask-desc').value;
    chapterQAStore["default"].unshift({
        author: `${name} (শিক্ষার্থী)`, time: "এইমাত্র",
        title, desc,
        reply: { author: "আল আমিন স্যার (শিক্ষক)", text: "ধন্যবাদ! খুব শীঘ্রই লাইভ ক্লাসে এটি বিস্তারিত আলোচনা করা হবে।" }
    });
    renderQAFeed();
    closeAskModal();
    alert('আপনার প্রশ্নটি সফলভাবে পোস্ট করা হয়েছে!');
}

/* ===================================================
   ROLE MANAGEMENT
=================================================== */
function openAuthModal()  { document.getElementById('auth-modal').classList.remove('hidden'); }
function closeAuthModal() { document.getElementById('auth-modal').classList.add('hidden'); }

function selectUserRole(role) {
    tempSelectedRole = role;
    ['student','teacher','admin','director'].forEach(r => {
        const opt  = document.getElementById(`role-opt-${r}`);
        const icon = opt.querySelector('i:last-child');
        if (r === role) {
            opt.className  = "p-3 rounded-2xl border-2 border-blue-500 bg-blue-50/50 flex items-center justify-between cursor-pointer transition";
            icon.className = "fa-solid fa-circle-check text-blue-600 text-lg";
        } else {
            opt.className  = "p-3 rounded-2xl border-2 border-slate-200 hover:border-slate-300 flex items-center justify-between cursor-pointer transition";
            icon.className = "fa-regular fa-circle text-slate-300 text-lg";
        }
    });
}

function applyUserRole() {
    currentUserRole = tempSelectedRole;
    closeAuthModal();
    const labels = { student:'স্টুডেন্ট মোড', teacher:'টিচার মোড', admin:'এডমিন মোড', director:'ডিরেক্টর মোড' };
    document.getElementById('current-user-role-label').textContent = labels[currentUserRole];

    const banner  = document.getElementById('role-dashboard-banner');
    const actions = document.getElementById('role-dashboard-actions');
    if (currentUserRole === 'director') {
        banner.classList.remove('hidden');
        document.getElementById('role-dashboard-title').textContent    = "ডিরেক্টর অ্যানালিটিক্স প্যানেল";
        document.getElementById('role-dashboard-subtitle').textContent = "প্ল্যাটফর্মের আয়-ব্যয়, এনরোলমেন্ট ও শিক্ষার্থী গ্রোথ";
        actions.innerHTML = `<div class="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 font-bold">মোট আয়: ৳ ৮৫,৪০০</div><div class="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-lg border border-indigo-500/30 font-bold">মোট শিক্ষার্থী: ১,৪৫০ জন</div>`;
    } else if (currentUserRole === 'admin') {
        banner.classList.remove('hidden');
        document.getElementById('role-dashboard-title').textContent    = "এডমিন কন্ট্রোল প্যানেল";
        document.getElementById('role-dashboard-subtitle').textContent = "পেমেন্ট ভেরিফিকেশন, ইউজার পারমিশন ও কোর্স কন্ট্রোল";
        actions.innerHTML = `<button onclick="alert('৫টি পেন্ডিং পেমেন্ট ভেরিফাই হয়েছে!')" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold">পেন্ডিং পেমেন্ট (৫)</button><button onclick="alert('সকল ইউজার অ্যাক্টিভ')" class="px-3 py-1.5 bg-slate-800 text-white rounded-lg font-bold">ইউজার লিস্ট</button>`;
    } else if (currentUserRole === 'teacher') {
        banner.classList.remove('hidden');
        document.getElementById('role-dashboard-title').textContent    = "শিক্ষক ড্যাশবোর্ড";
        document.getElementById('role-dashboard-subtitle').textContent = "নতুন ক্লাস আপলোড, প্রশ্ন তৈরি ও উত্তর দিন";
        actions.innerHTML = `<button onclick="alert('ক্লাস আপলোড উইন্ডো খুলেছে')" class="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold">+ ক্লাস আপলোড</button><button onclick="switchTab('qa')" class="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-bold">জিজ্ঞাসা উত্তর দিন</button>`;
    } else {
        banner.classList.add('hidden');
    }
}

/* ===================================================
   GLOBAL RESOURCE AGGREGATOR (All Formulas, Math, Videos, etc.)
=================================================== */
let currentAggregatorType = 'formulas';

function showGlobalAggregator(type) {
    currentAggregatorType = type;
    currentViewMode = 'aggregator';

    const subhome = document.getElementById('lms-subhomepage');
    const aggView = document.getElementById('global-aggregator-view');
    const headerCard = document.getElementById('classroom-chapter-header');
    const contentArea = document.getElementById('content-display-area');

    if (subhome) subhome.classList.add('hidden');
    if (aggView) aggView.classList.remove('hidden');
    if (headerCard) headerCard.classList.add('hidden');
    if (contentArea) contentArea.classList.add('hidden');

    const titleEl = document.getElementById('global-agg-title');
    const subtitleEl = document.getElementById('global-agg-subtitle');

    const titles = {
        formulas: { title: "সকল গুরুত্বপূর্ণ সূত্রসমূহ (এক নজরে)", sub: "পদার্থবিজ্ঞানের প্রতিটি অধ্যায়ের মূল সমীকরণ ও প্রতীক পরিচিতি।" },
        math:     { title: "সকল গাণিতিক সমস্যা ও সমাধান", sub: "পরীক্ষায় আসা বিভিন্ন অধ্যায়ের জটিল গাণিতিক উদাহরণ ও নির্ভুল সমাধান।" },
        video:    { title: "সকল অধ্যায়ের ভিডিও ক্লাস", sub: "কনসেপ্ট ক্লিয়ারিং ও ভিজ্যুয়াল লেকচার ভিডিও সমূহ।" },
        comprehension: { title: "অনুধাবনমূলক প্রশ্ন ও উত্তর (খ-প্রশ্ন)", sub: "বোর্ড পরীক্ষার জন্য সবচেয়ে গুরুত্বপূর্ণ অনুধাবন প্রশ্ন।" },
        board:    { title: "বিগত বছরের বোর্ড প্রশ্ন ও সমাধান", sub: "বিভিন্ন শিক্ষা বোর্ডের সৃজনশীল ও বহুনির্বাচনী প্রশ্ন সংকলন।" }
    };

    if (titles[type]) {
        titleEl.textContent = titles[type].title;
        subtitleEl.textContent = titles[type].sub;
    }

    renderGlobalAggregatorContent();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderGlobalAggregatorContent() {
    const container = document.getElementById('global-agg-content');
    if (!container) return;

    const levelFilter = document.getElementById('global-agg-level-select')?.value || 'all';
    container.innerHTML = '';

    const levelsToProcess = levelFilter === 'all' 
        ? ['ssc', 'hsc1', 'hsc2', 'class8'] 
        : [levelFilter];

    const levelNames = {
        ssc: 'নবম-দশম শ্রেণি (SSC)',
        hsc1: 'একাদশ-দ্বাদশ শ্রেণি — ১ম পত্র (HSC-1)',
        hsc2: 'একাদশ-দ্বাদশ শ্রেণি — ২য় পত্র (HSC-2)',
        class8: 'অষ্টম শ্রেণি বিজ্ঞান (NCTB 2026)'
    };

    levelsToProcess.forEach(lvl => {
        if (!APP_DATA[lvl]) return;

        const levelBlock = document.createElement('div');
        levelBlock.className = 'space-y-4 pt-2 border-t first:border-t-0 border-slate-100';

        const levelHeader = document.createElement('div');
        levelHeader.className = 'flex items-center gap-2 py-2';
        levelHeader.innerHTML = `
            <span class="w-3 h-3 rounded-full bg-blue-600"></span>
            <h3 class="text-base sm:text-lg font-bold text-slate-900">${levelNames[lvl]}</h3>
            <span class="text-xs text-slate-400">(${APP_DATA[lvl].chapters.length}টি অধ্যায়)</span>
        `;
        levelBlock.appendChild(levelHeader);

        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';

        APP_DATA[lvl].chapters.forEach((chap, idx) => {
            const card = document.createElement('div');
            card.className = 'p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition shadow-sm space-y-2';

            let snippetHTML = '';
            if (currentAggregatorType === 'formulas') {
                snippetHTML = `
                    <div class="text-xs space-y-1 bg-white p-3 rounded-xl border border-slate-100">
                        <p class="font-mono text-blue-700 font-bold">s = ut + ½at²  |  v = u + at  |  v² = u² + 2as</p>
                        <p class="text-slate-500 text-[11px]">F = ma | W = Fs cosθ | P = W/t</p>
                    </div>
                `;
            } else if (currentAggregatorType === 'math') {
                snippetHTML = `
                    <div class="text-xs space-y-1.5 bg-white p-3 rounded-xl border border-slate-100">
                        <p class="font-medium text-slate-800">গাণিতিক সমস্যা: 54 km/h বেগে চলমান গাড়ি 5s এ থেমে গেলে ত্বরণ ও দূরত্ব নির্ণয় করো।</p>
                        <p class="text-emerald-600 font-semibold text-[11px]"><i class="fa-solid fa-check"></i> সমাধান সূত্র: a = (v-u)/t, s = (u+v)/2 × t</p>
                    </div>
                `;
            } else if (currentAggregatorType === 'video') {
                snippetHTML = `
                    <div class="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100">
                        <div class="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-lg"><i class="fa-solid fa-play"></i></div>
                        <div>
                            <p class="text-xs font-bold text-slate-800">লেকচার ক্লাস (রেকর্ডেড ও লাইভ নোট)</p>
                            <p class="text-[11px] text-slate-400">সময়কাল: ৪৫ মিনিট | আল আমিন স্যার</p>
                        </div>
                    </div>
                `;
            } else if (currentAggregatorType === 'comprehension') {
                snippetHTML = `
                    <div class="text-xs space-y-1 bg-white p-3 rounded-xl border border-slate-100">
                        <p class="font-bold text-slate-800">অনুধাবন প্রশ্ন: সমবেগে চলমান বস্তুর ত্বরণ থাকে কি? ব্যাখ্যা করো।</p>
                        <p class="text-slate-500 text-[11px]">উত্তর: না, বেগ পরিবর্তনের হারই ত্বরণ। বেগ অপরিবর্তিত থাকলে ত্বরণ শূন্য।</p>
                    </div>
                `;
            } else {
                snippetHTML = `
                    <div class="text-xs bg-white p-3 rounded-xl border border-slate-100">
                        <p class="font-bold text-slate-800">ঢাকা বোর্ড, রাজশাহী বোর্ড, চট্টগ্রাম বোর্ড সমন্বিত CQ & MCQ</p>
                        <p class="text-[11px] text-slate-400">বিগত ৫ বছরের সমাধানসহ বিশ্লেষণ</p>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-blue-600">${chap.title}</span>
                    <button onclick="goToSpecificChapterAndTab('${lvl}', ${idx}, '${currentAggregatorType}')" class="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1">
                        অধ্যায়ে যান <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
                ${snippetHTML}
            `;
            grid.appendChild(card);
        });

        levelBlock.appendChild(grid);
        container.appendChild(levelBlock);
    });
}

function goToSpecificChapterAndTab(lvl, chapIdx, tabKey) {
    currentLevel = lvl;
    currentChapterIndex = chapIdx;

    const select = document.getElementById('chapter-select');
    if (select && APP_DATA[lvl]) {
        select.innerHTML = '';
        APP_DATA[lvl].chapters.forEach((chap, idx) => {
            const opt = document.createElement('option');
            opt.value = idx;
            opt.textContent = chap.title;
            select.appendChild(opt);
        });
        select.value = chapIdx;
    }

    renderChapterData();
    openClassroomView();
    switchTab(tabKey);
}

function openSimulationDirectly() {
    selectLevelAndOpen('ssc');
    switchTab('simulation');
}

/* ===================================================
   PAYMENT & ENROLLMENT
=================================================== */
function openPaymentModal()  { document.getElementById('payment-modal').classList.remove('hidden'); }
function closePaymentModal() { document.getElementById('payment-modal').classList.add('hidden'); }

function handlePaymentSubmit(e) {
    e.preventDefault();
    const trx  = document.getElementById('pay-trxid').value;
    const chap = getCurrentChap();
    enrolledCourses[chap.id] = true;
    lsSet(LS.ENROLLED, enrolledCourses);
    closePaymentModal();
    alert(`অভিনন্দন! TrxID: ${trx} — আপনি "${chap.title}" কোর্সে সফলভাবে এনরোল্ড হয়েছেন!`);
    renderChapterData();
}

/* ===================================================
   UTILITY
=================================================== */
function markVideoComplete() {
    addProgress(getCurrentChap().id, 'video');
    alert('ভিডিও সম্পন্ন চিহ্নিত হয়েছে! আপনার প্রগ্রেস আপডেট হয়েছে।');
}
function printFormulaSheet() { window.print(); }
function downloadPdfNotice() { alert('লেকচার শিট PDF ডাউনলোড হচ্ছে...'); }
function showHomeView() { showLMSDashboard(); }

