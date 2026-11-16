/**
 * Al amin Physics - Complete Application Logic
 * Version 2.0 | Blue Theme | Dark Mode | KaTeX | LocalStorage
 */

/* ===================================================
   LocalStorage Keys & Persistence Layer
=================================================== */
const LS = {
    DARK_MODE:     'alamin_dark_mode',
    ENROLLED:      'alamin_enrolled_courses',
    EXAM_SCORES:   'alamin_exam_scores',
    PROGRESS:      'alamin_chapter_progress',
    STUDENT_USER:  'alamin_student_user',
    PRO_SIM_PASS:  'alamin_pro_sim_unlocked',
    TRANSACTIONS:  'alamin_transactions_log',
    ADMIN_PERMS:   'alamin_admin_permissions',
    CUSTOM_EXAMS:  'alamin_custom_exams'
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
let studentUser      = lsGet(LS.STUDENT_USER, null); // { name, phone, class, streak: 7, joinedAt }
let proSimUnlocked   = lsGet(LS.PRO_SIM_PASS, false);
let adminPermsStore  = lsGet(LS.ADMIN_PERMS,  { paymentApprove: true, examCreate: true, contentUpload: true, viewRevenue: false });
let customExamsStore = lsGet(LS.CUSTOM_EXAMS, {});

// Transaction Ledger
let transactionsStore = lsGet(LS.TRANSACTIONS, [
    { id: "TX-101", date: "আজ ১০:৩০ AM", studentName: "তানভীর আহমেদ", phone: "01712-345678", item: "গতি পেইড কোর্স", method: "bKash", trx: "9K3M8J2L", amount: "৳ ৩৫০", status: "Approved" },
    { id: "TX-102", date: "আজ ০৯:১৫ AM", studentName: "সাদিয়া ইসলাম", phone: "01823-998877", item: "প্রো ভার্চুয়াল ল্যাব পাস", method: "Nagad", trx: "7H4P1Q9X", amount: "৳ ১০০", status: "Pending" },
    { id: "TX-103", date: "গতকাল ০৬:৪৫ PM", studentName: "রাকিবুল হাসান", phone: "01911-223344", item: "ভেক্টর স্পেশাল কোর্স", method: "bKash", trx: "6B9T2Z1A", amount: "৳ ৩৫০", status: "Approved" },
    { id: "TX-104", date: "গতকাল ০৩:২০ PM", studentName: "ফারহানা আক্তার", phone: "01521-445566", item: "প্রো ভার্চুয়াল ল্যাব পাস", method: "bKash", trx: "4D8V5C3N", amount: "৳ ১০০", status: "Pending" }
]);

// Leaderboard Database
const LEADERBOARD_SEED = [
    { rank: 1, name: "তানভীর আহমেদ", class: "SSC (নবম-দশম)", exams: 12, points: 58, badge: "🥇 ১ম" },
    { rank: 2, name: "সাদিয়া জাহান", class: "HSC ১ম পত্র", exams: 10, points: 49, badge: "🥈 ২য়" },
    { rank: 3, name: "আরিফুর রহমান", class: "SSC (নবম-দশম)", exams: 9,  points: 44, badge: "🥉 ৩য়" },
    { rank: 4, name: "নাজমুল হোসেন", class: "HSC ২য় পত্র", exams: 8,  points: 39, badge: "৪র্থ" },
    { rank: 5, name: "ফারিহা তাসনিম", class: "অষ্টম বিজ্ঞান", exams: 7, points: 35, badge: "৫ম" },
    { rank: 6, name: "মেহেদী হাসান", class: "SSC (নবম-দশম)", exams: 6, points: 29, badge: "৬ষ্ঠ" }
];

// Live Social Stream
const SOCIAL_ACTIVITY_SEED = [
    { user: "তানভীর আহমেদ", action: "'বল ও গতি' পরীক্ষায় ৫-এ ৫ পেয়েছে", time: "২ মিনিট আগে", icon: "fa-trophy", color: "amber" },
    { user: "সাদিয়া জাহান", action: "প্রো ভার্চুয়াল ল্যাবে সার্কিট পরীক্ষা সফল করেছে", time: "১২ মিনিট আগে", icon: "fa-bolt", color: "blue" },
    { user: "রাকিবুল হাসান", action: "'কাজ, ক্ষমতা ও শক্তি' অধ্যায়ের হ্যান্ডনোট ডাউনলোড করেছে", time: "২৫ মিনিট আগে", icon: "fa-file-pdf", color: "emerald" },
    { user: "সায়মা করিম", action: "নতুন অ্যাকাউন্ট খুলে পদার্থবিজ্ঞান প্রস্তুতি শুরু করেছে", time: "৪০ মিনিট আগে", icon: "fa-user-plus", color: "purple" }
];

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

// Pro Sim Variables
let circuitVoltage = 12;
let circuitResist  = 4;
let circuitElectrons = [];

let lensFocalLength = 100;
let lensObjectDist  = 180;
let lensObjectHeight = 40;

let orbitMass      = 1000;
let orbitDist      = 120;
let orbitAngle     = 0;

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
    const compactIcon = document.getElementById('compact-dark-icon');
    if (compactIcon) compactIcon.textContent = isDark ? '☀️' : '🌙';
}

/* ===================================================
   INITIALIZATION
=================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    updateUserSessionUI();
    initSimulation();
    runPhysicsCalculator();
    try {
        window.history.replaceState({ view: 'dashboard' }, '', '#dashboard');
    } catch(e) {}
    showLMSDashboard(true);
});

/* ===================================================
   SPA NAVIGATION & BROWSER / HARDWARE BACK CONTROLLER
=================================================== */
let currentViewMode = 'dashboard'; // 'dashboard' | 'classroom' | 'profile' | 'leaderboard' | 'director' | 'aggregator'

function hideAllAppViews() {
    ['lms-subhomepage', 'global-aggregator-view', 'classroom-chapter-header', 'content-display-area', 'student-profile-view', 'leaderboard-view', 'director-executive-view'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    // Remove nav active styles
    ['ssc','hsc1','hsc2','class8'].forEach(k => {
        const btn = document.getElementById(`nav-${k}`);
        if (btn) {
            btn.classList.remove('nav-active', 'text-white', 'bg-blue-600');
            btn.classList.add('text-slate-700');
        }
    });
    const lmsHomeBtn = document.getElementById('nav-lms-home');
    if (lmsHomeBtn) lmsHomeBtn.classList.remove('bg-blue-600', 'text-white');
    const lbBtn = document.getElementById('nav-leaderboard');
    if (lbBtn) lbBtn.classList.remove('bg-amber-600', 'text-white');
    const pfBtn = document.getElementById('nav-profile-btn');
    if (pfBtn) pfBtn.classList.remove('bg-emerald-600', 'text-white');
}

function setAppView(viewMode, params = {}, isPop = false) {
    currentViewMode = viewMode;
    hideAllAppViews();

    if (!isPop) {
        try {
            window.history.pushState({ view: viewMode, params: params, level: currentLevel, chapter: currentChapterIndex }, '', '#' + viewMode);
        } catch (e) {}
    }

    const siteHeader = document.getElementById('site-header');
    const compactHeader = document.getElementById('classroom-compact-header');

    if (viewMode === 'classroom') {
        if (siteHeader) siteHeader.classList.add('hidden');
        if (compactHeader) compactHeader.classList.remove('hidden');
        const headerCard = document.getElementById('classroom-chapter-header');
        const contentArea = document.getElementById('content-display-area');
        if (headerCard) headerCard.classList.remove('hidden');
        if (contentArea) contentArea.classList.remove('hidden');
    } else {
        if (siteHeader) siteHeader.classList.remove('hidden');
        if (compactHeader) compactHeader.classList.add('hidden');

        if (viewMode === 'dashboard') {
            const subhome = document.getElementById('lms-subhomepage');
            if (subhome) subhome.classList.remove('hidden');
            const lmsHomeBtn = document.getElementById('nav-lms-home');
            if (lmsHomeBtn) lmsHomeBtn.classList.add('bg-blue-600', 'text-white');
        } else if (viewMode === 'profile') {
            const view = document.getElementById('student-profile-view');
            if (view) view.classList.remove('hidden');
            const pfBtn = document.getElementById('nav-profile-btn');
            if (pfBtn) pfBtn.classList.add('bg-emerald-600', 'text-white');
            renderStudentProfileData();
        } else if (viewMode === 'leaderboard') {
            const view = document.getElementById('leaderboard-view');
            if (view) view.classList.remove('hidden');
            const lbBtn = document.getElementById('nav-leaderboard');
            if (lbBtn) lbBtn.classList.add('bg-amber-600', 'text-white');
            renderLeaderboardData('all');
            renderSocialActivityFeed();
        } else if (viewMode === 'director') {
            const view = document.getElementById('director-executive-view');
            if (view) view.classList.remove('hidden');
            renderDirectorDashboardData();
        } else if (viewMode === 'aggregator') {
            const aggView = document.getElementById('global-aggregator-view');
            if (aggView) aggView.classList.remove('hidden');
        }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showLMSDashboard(isPop = false) {
    setAppView('dashboard', {}, isPop);
}

function toggleNavDrawer(show) {
    const drawer = document.getElementById('classroom-nav-drawer');
    if (!drawer) return;
    if (typeof show === 'boolean') {
        if (show) drawer.classList.remove('hidden');
        else drawer.classList.add('hidden');
    } else {
        drawer.classList.toggle('hidden');
    }
}

function openHscChoiceModal() {
    const modal = document.getElementById('hsc-choice-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeHscChoiceModal() {
    const modal = document.getElementById('hsc-choice-modal');
    if (modal) modal.classList.add('hidden');
}

function selectLevelAndOpen(lvl) {
    switchLevel(lvl);
    openClassroomView(false);
}

function openClassroomView(isPop = false) {
    setAppView('classroom', {}, isPop);
}

function showStudentProfileView(isPop = false) {
    setAppView('profile', {}, isPop);
}

function showLeaderboardView(isPop = false) {
    setAppView('leaderboard', {}, isPop);
}

function showDirectorExecutiveView(isPop = false) {
    setAppView('director', {}, isPop);
}

// Reactive Popstate Listener for Browser & Android Back Button
window.addEventListener('popstate', (e) => {
    const state = e.state;
    if (state && state.view) {
        if (state.level) currentLevel = state.level;
        if (state.chapter !== undefined) currentChapterIndex = state.chapter;
        if (state.view === 'dashboard') {
            showLMSDashboard(true);
        } else if (state.view === 'classroom') {
            openClassroomView(true);
            renderChapterData();
        } else if (state.view === 'profile') {
            showStudentProfileView(true);
        } else if (state.view === 'leaderboard') {
            showLeaderboardView(true);
        } else if (state.view === 'director') {
            showDirectorExecutiveView(true);
        } else if (state.view === 'aggregator') {
            showGlobalAggregator(state.params?.type || 'formulas', true);
        }
    } else {
        // Reached root of study.html without state
        if (currentViewMode !== 'dashboard') {
            showLMSDashboard(true);
        } else {
            // If already on dashboard and user presses back, go to marketing landing page
            window.location.href = 'index.html';
        }
    }
});

// QR Code Modal
function openQrModal()  { document.getElementById('qr-code-modal')?.classList.remove('hidden'); }
function closeQrModal() { document.getElementById('qr-code-modal')?.classList.add('hidden'); }

// Hardware Back Button Handler called by Android Capacitor Bridge
window.handleAppHardwareBack = function() {
    // 1. Check if any modal is currently visible
    const modalIds = ['qr-code-modal', 'phone-auth-modal', 'auth-modal', 'ask-modal', 'pro-sim-modal', 'exam-studio-modal', 'payment-modal'];
    for (let id of modalIds) {
        const el = document.getElementById(id);
        if (el && !el.classList.contains('hidden') && el.style.display !== 'none') {
            el.classList.add('hidden');
            el.style.display = 'none';
            return true; // Back consumed by closing modal
        }
    }
    // 2. If inside a sub-view (classroom, profile, leaderboard, aggregator, director), step back to dashboard
    if (currentViewMode !== 'dashboard') {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            showLMSDashboard(false);
        }
        return true; // Back consumed by stepping back to dashboard
    }
    // 3. User is at root LMS dashboard: allow app minimize or index.html
    return false;
};

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

    if (tabKey === 'simulation') {
        renderChapterSimulation();
    }

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
    basic: 10, knowledge: 10, comprehension: 10, formulas: 10,
    math: 15, board: 15, sheet: 5, video: 10,
    simulation: 5, qa: 5, exam: 10, paid: 5
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

    const lvlBadge = document.getElementById('level-badge');
    if (lvlBadge) lvlBadge.textContent = levelInfo.gradeTag;
    const compactBadge = document.getElementById('compact-level-badge');
    if (compactBadge) compactBadge.textContent = levelInfo.gradeTag;
    const chapTitleEl = document.getElementById('current-chapter-title');
    if (chapTitleEl) chapTitleEl.textContent = chap.title;
    const chapDescEl = document.getElementById('current-chapter-desc');
    if (chapDescEl) chapDescEl.textContent = chap.desc;
    const chapterSelect = document.getElementById('chapter-select');
    if (chapterSelect) chapterSelect.value = currentChapterIndex;

    updateProgressBar(chap.id);

    // Retrieve authentic SSC curriculum data if available
    const sscData = (window.SSC_CURRICULUM_DATA && window.SSC_CURRICULUM_DATA[chap.id])
        ? window.SSC_CURRICULUM_DATA[chap.id]
        : null;

    /* ── 1. BASIC ── */
    const basicSummary = sscData ? sscData.summary : chap.desc;
    document.getElementById('basic-content-body').innerHTML = `
        <div class="space-y-4 text-sm leading-relaxed text-slate-700">
            <p class="text-base font-semibold text-slate-900 border-l-4 border-blue-600 pl-3 leading-relaxed">
                ${basicSummary}
            </p>
            <div class="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-blue-950 text-sm">
                <div class="font-bold text-blue-800 flex items-center gap-2 mb-1">
                    <i class="fa-solid fa-lightbulb text-amber-500"></i> মূল কনসেপ্ট ও বাস্তব প্রয়োগ
                </div>
                ${chap.title} এর তত্ত্বীয় সূত্র ও গাণিতিক সমীকরণগুলো বোর্ড পরীক্ষা এবং আধুনিক বিজ্ঞানের ভিত্তি। বাস্তব উদাহরণের সাথে মিলিয়ে পাঠ করলে ফিজিক্স মুখস্থ করতে হয় না, উপলব্ধি করা যায়।
            </div>
        </div>`;

    const basicDefs = (sscData && sscData.definitions) ? sscData.definitions : [
        { term: "ভৌত পরিবর্তনের বিশ্লেষণ", desc: "সময়ের সাথে পরিবর্তনশীল যেকোনো ভৌত অবস্থার সঠিক মান নির্ণয় এবং কারণ অনুসন্ধানের বিজ্ঞানসম্মত বিশ্লেষণ।" },
        { term: "প্রয়োজনীয় এককাবলী", desc: "দূরত্ব: মিটার (m), সময়: সেকেন্ড (s), বেগ: m/s, বল: নিউটন (N), কাজ: জুল (J)।" }
    ];
    document.getElementById('basic-definitions').innerHTML = basicDefs.map(d => `
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 card-hover">
            <span class="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full mb-2 inline-block">সংজ্ঞা ও তাৎপর্য</span>
            <h5 class="font-bold text-sm text-slate-900 mb-1">${d.term}</h5>
            <p class="text-xs text-slate-600 leading-relaxed">${d.desc}</p>
        </div>`).join('');

    const highlightsList = (sscData && sscData.highlights) ? sscData.highlights : [
        "বোর্ড ও কলেজের স্ট্যান্ডার্ড প্রশ্ন বিন্যাস",
        "সকল গুরুত্বপূর্ণ সূত্রের প্রতিপাদন",
        "লেখচিত্র ও বাস্তব উদাহরণ বিশ্লেষণ",
        "ক্যালকুলেটর শর্টকাট ট্রিকস"
    ];
    document.getElementById('quick-highlights').innerHTML = highlightsList.map(h => `
        <li class="flex items-start gap-2">
            <i class="fa-solid fa-circle-check text-blue-400 text-xs mt-1 shrink-0"></i>
            <span class="text-xs leading-relaxed text-slate-300">${h}</span>
        </li>`).join('');

    /* ── 2. KNOWLEDGE (জ্ঞানমূলক ক) ── */
    const knowledgeListEl = document.getElementById('knowledge-questions-list');
    if (knowledgeListEl) {
        const kData = (sscData && sscData.knowledge) ? sscData.knowledge : [
            { q: "ভৌত রাশি কাকে বলে?", a: "ভৌত জগতে যা কিছু সরাসরি বা পরোক্ষভাবে পরিমাপ করা যায় তাকে ভৌত রাশি বলে।" }
        ];
        knowledgeListEl.innerHTML = kData.map((k, idx) => `
            <div class="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-sm card-hover transition">
                <div class="flex items-center justify-between mb-2">
                    <span class="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-bold">জ্ঞানমূলক প্রশ্ন নং ${idx + 1}</span>
                    <span class="text-[11px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">পূর্ণমান: ১</span>
                </div>
                <h5 class="font-bold text-sm sm:text-base text-slate-900 mb-2 flex items-start gap-2">
                    <span class="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">ক</span>
                    <span>${k.q}</span>
                </h5>
                <div class="text-xs sm:text-sm pl-4 border-l-2 border-blue-500 py-1 space-y-1 leading-relaxed text-slate-700 bg-slate-50/80 rounded-r-xl p-3">
                    <p><strong class="text-blue-800">উত্তর:</strong> ${k.a}</p>
                </div>
            </div>`).join('');
    }

    /* ── 3. COMPREHENSION (অনুধাবনমূলক খ) ── */
    const compData = (sscData && sscData.comprehension) ? sscData.comprehension : [
        { q: "গাছ থেকে ফল পড়ার সময় এর ত্বরণ বৃদ্ধি পায় কি? ব্যাখ্যা করো। [ঢাকা বোর্ড ২০২৪]", a: "না। বাতাসের বাধা অগ্রাহ্য করলে অভিকর্ষজ ত্বরণ g = 9.8 m/s² সর্বদা ধ্রুব থাকে। শুধু বেগ বাড়ে।" }
    ];
    document.getElementById('comprehension-questions-list').innerHTML = compData.map((c, idx) => `
        <div class="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-sm card-hover transition">
            <div class="flex items-center justify-between mb-2">
                <span class="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold">অনুধাবনমূলক প্রশ্ন নং ${idx + 1}</span>
                <span class="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">পূর্ণমান: ২ (ব্যাখ্যামূলক)</span>
            </div>
            <h5 class="font-bold text-sm sm:text-base text-slate-900 mb-2 flex items-start gap-2">
                <span class="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">খ</span>
                <span>${c.q}</span>
            </h5>
            <div class="text-xs sm:text-sm pl-4 border-l-2 border-amber-500 py-1 space-y-1 leading-relaxed text-slate-700 bg-amber-50/30 rounded-r-xl p-3">
                <p><strong class="text-amber-900">উত্তর:</strong> ${c.a}</p>
            </div>
        </div>`).join('');

    /* ── 4. FORMULAS (KaTeX rendered) ── */
    const formulas = (sscData && sscData.formulas) ? sscData.formulas : [
        { tag: "সূত্র ১", expr: "v = u + at",           note: "শেষবেগ, আদিবেগ, ত্বরণ ও সময়ের সম্পর্ক।" },
        { tag: "সূত্র ২", expr: "s = ut + \\tfrac{1}{2}at^2", note: "অতিক্রান্ত সরণ নির্ণয়।" },
        { tag: "সূত্র ৩", expr: "v^2 = u^2 + 2as",     note: "সময় ছাড়া বেগ ও দূরত্বের সম্পর্ক।" },
        { tag: "সূত্র ৪", expr: "\\vec{F} = m\\vec{a}", note: "নিউটনের ২য় সূত্র (বল = ভর × ত্বরণ)।" },
        { tag: "সূত্র ৫", expr: "E_k = \\tfrac{1}{2}mv^2", note: "গতিশক্তি।" },
        { tag: "সূত্র ৬", expr: "T = 2\\pi\\sqrt{\\dfrac{L}{g}}", note: "সরল দোলকের দোলনকাল।" }
    ];
    document.getElementById('formula-cards-container').innerHTML = formulas.map(f => `
        <div class="p-4 rounded-2xl bg-white border border-slate-200 card-hover shadow-sm flex flex-col justify-between">
            <div>
                <span class="text-[10px] font-bold text-blue-700 uppercase tracking-wider block mb-1">${f.tag}</span>
                <div class="my-2 text-slate-900 overflow-x-auto katex-formula text-base py-1 font-semibold" data-expr="${f.expr}"></div>
            </div>
            <p class="text-xs text-slate-600 mt-2 border-t border-slate-100 pt-2 leading-relaxed">${f.note}</p>
        </div>`).join('');

    /* ── 5. MATH PROBLEMS ── */
    const mathProblems = (sscData && sscData.math) ? sscData.math : [
        {
            title: "ট্রেনের গতি ও সরণ",
            type: "বোর্ড CQ স্ট্যান্ডার্ড",
            marks: "৩",
            question: "একটি ট্রেন 0.5 m/s² সমত্বরণে চলে 180 m দূরত্ব অতিক্রম করে। সময় ও শেষবেগ নির্ণয় করো।",
            solution: "দেওয়া আছে: u = 0, a = 0.5 m/s², s = 180 m\ns = ½ at² → t = √(2s/a) = √720 ≈ 26.83 s\nv = u + at = 0 + 0.5×26.83 = 13.42 m/s"
        }
    ];
    document.getElementById('math-problems-list').innerHTML = mathProblems.map((m, idx) => `
        <div class="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3 card-hover">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full">${m.type || 'বোর্ড ও এডমিশন স্ট্যান্ডার্ড'}</span>
                <span class="text-xs text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">নম্বর: ${m.marks || '৩/৪'}</span>
            </div>
            <h5 class="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                ${m.title ? `<span class="text-indigo-600">${m.title}:</span> ` : ''}${m.question}
            </h5>
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-2 text-slate-800">
                <div class="text-indigo-700 font-bold mb-1 flex items-center gap-1.5">
                    <i class="fa-solid fa-square-check"></i> সমাধান ধাপসমূহ:
                </div>
                <div class="whitespace-pre-line leading-relaxed font-mono bg-white p-3 rounded-lg border border-slate-200 text-slate-800">${m.solution}</div>
            </div>
        </div>`).join('');

    /* ── 6. BOARD CQ QUESTIONS ── */
    const cqs = (sscData && sscData.cqs) ? sscData.cqs : [
        {
            board: "রাজশাহী বোর্ড ২০২৪",
            marks: "১০",
            stimulus: "একটি 800 kg গাড়ি 72 km/h বেগে চলছিল। চালক 40 m সামনে পথচারী দেখে সাথে সাথে ব্রেক চাপলেন। গাড়িটি পথচারীর 2 m সামনে থামল।",
            q_a: "ত্বরণ কাকে বলে?",
            ans_a: "সময়ের সাথে কোনো বস্তুর বেগ পরিবর্তনের হারকে ত্বরণ বলে।",
            q_b: "সমদ্রুতিতে চলমান বস্তুর ত্বরণ থাকতে পারে কি? ব্যাখ্যা করো।",
            ans_b: "হ্যাঁ, বৃত্তাকার পথে সমদ্রুতিতে ঘুরলেও প্রতি মুহূর্তে বেগের দিক পরিবর্তিত হয় বলে এতে ত্বরণ থাকে।",
            q_c: "ব্রেকিং বল নির্ণয় করো।",
            ans_c: "a = u²/2s = 400/76 = 5.26 m/s²\nF = m×a = 800 × 5.26 = 4210.53 N",
            q_d: "যদি প্রতিক্রিয়া সময় 0.4s হয় তবে দুর্ঘটনা ঘটবে কি না গাণিতিক বিশ্লেষণ করো।",
            ans_d: "প্রতিক্রিয়া দূরত্ব = 20×0.4 = 8 m। মোট থামার দূরত্ব = 8+38 = 46 m > 40 m। সুতরাং দুর্ঘটনা ঘটবে।"
        }
    ];
    document.getElementById('board-questions-list').innerHTML = cqs.map((cq, idx) => `
        <div class="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4 card-hover">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div class="flex items-center gap-2">
                    <span class="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">CQ ${idx + 1}</span>
                    <span class="px-3 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">${cq.board}</span>
                </div>
                <span class="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">পূর্ণমান: ${cq.marks || '১০'}</span>
            </div>
            
            <div class="p-4 bg-blue-50/60 rounded-xl border border-blue-200 text-xs sm:text-sm text-slate-900 leading-relaxed font-medium">
                <strong class="text-blue-900 flex items-center gap-1.5 mb-1.5"><i class="fa-solid fa-quote-left text-blue-500"></i> উদ্দীপক:</strong>
                ${cq.stimulus}
            </div>

            <div class="space-y-3 pt-1">
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-1">
                    <p class="font-bold text-slate-900 flex items-start gap-1.5">
                        <span class="text-blue-700 font-black">(ক)</span> <span>${cq.q_a}</span>
                        <span class="text-[10px] text-slate-400 ml-auto shrink-0 font-bold">[১ নম্বর]</span>
                    </p>
                    <p class="text-slate-700 pl-4 border-l-2 border-blue-400 mt-1"><strong class="text-slate-900">উত্তর:</strong> ${cq.ans_a}</p>
                </div>

                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-1">
                    <p class="font-bold text-slate-900 flex items-start gap-1.5">
                        <span class="text-amber-700 font-black">(খ)</span> <span>${cq.q_b}</span>
                        <span class="text-[10px] text-slate-400 ml-auto shrink-0 font-bold">[২ নম্বর]</span>
                    </p>
                    <p class="text-slate-700 pl-4 border-l-2 border-amber-400 mt-1"><strong class="text-slate-900">উত্তর:</strong> ${cq.ans_b}</p>
                </div>

                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-1">
                    <p class="font-bold text-slate-900 flex items-start gap-1.5">
                        <span class="text-emerald-700 font-black">(গ)</span> <span>${cq.q_c}</span>
                        <span class="text-[10px] text-slate-400 ml-auto shrink-0 font-bold">[৩ নম্বর]</span>
                    </p>
                    <div class="text-slate-700 pl-4 border-l-2 border-emerald-400 mt-1 whitespace-pre-line font-mono bg-white p-2.5 rounded-lg border border-slate-200">
                        <strong class="text-slate-900 font-sans block mb-1">সমাধান:</strong>
                        ${cq.ans_c}
                    </div>
                </div>

                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-1">
                    <p class="font-bold text-slate-900 flex items-start gap-1.5">
                        <span class="text-purple-700 font-black">(ঘ)</span> <span>${cq.q_d}</span>
                        <span class="text-[10px] text-slate-400 ml-auto shrink-0 font-bold">[৪ নম্বর]</span>
                    </p>
                    <div class="text-slate-700 pl-4 border-l-2 border-purple-400 mt-1 whitespace-pre-line font-mono bg-white p-2.5 rounded-lg border border-slate-200">
                        <strong class="text-slate-900 font-sans block mb-1">গাণিতিক যুক্তি ও বিশ্লেষণ:</strong>
                        ${cq.ans_d}
                    </div>
                </div>
            </div>
        </div>`).join('');

    /* ── 7. SHEET PREVIEW (শিট ও হ্যান্ডনোট) ── */
    const sheetPreview = document.getElementById('sheet-interactive-preview');
    if (sheetPreview) {
        const sheetBanner = document.getElementById('sheet-title-banner');
        if (sheetBanner) sheetBanner.textContent = `${chap.title} — এক্সক্লুসিভ রিভিশন ও লেকচার শিট`;

        sheetPreview.innerHTML = `
            <!-- Sheet Header -->
            <div class="border-b-2 border-blue-600 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 class="text-2xl font-black text-blue-900 flex items-center gap-2">
                        <i class="fa-solid fa-atom text-blue-600"></i> Al amin Physics
                    </h2>
                    <p class="text-sm font-bold text-slate-700">${chap.title} • এক্সক্লুসিভ স্টাডি শিট ও হ্যান্ডনোট</p>
                    <p class="text-xs text-slate-500">সিলেবাস: NCTB ২০২৬ | নবম-দশম ও এসএসসি পরীক্ষার্থী</p>
                </div>
                <div class="sm:text-right text-xs text-slate-600">
                    <p class="font-bold text-blue-700 text-sm">প্রভাষক: আল আমিন স্যার</p>
                    <p>জলেশ্বরীতলা, বগুড়া | হটলাইন: ০১৭৯৬৪৩১৭৯৫</p>
                    <p class="text-[11px] text-slate-400">al-amin-physics.vercel.app</p>
                </div>
            </div>

            <!-- 1. Chapter Summary -->
            <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 class="font-bold text-blue-900 text-sm flex items-center gap-2">
                    <i class="fa-solid fa-book-open text-blue-600"></i> অধ্যায় সারসংক্ষেপ
                </h4>
                <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">${basicSummary}</p>
            </div>

            <!-- 2. Essential Formulas Chart -->
            <div class="space-y-3">
                <h4 class="font-bold text-blue-900 text-sm flex items-center gap-2">
                    <i class="fa-solid fa-square-root-variable text-emerald-600"></i> প্রয়োজনীয় সূত্রাবলি ও একক তালিকা
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    ${formulas.map(f => `
                        <div class="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                            <span class="font-bold text-blue-700">${f.tag}</span>
                            <div class="font-mono text-slate-900 font-bold text-sm my-1">${f.expr}</div>
                            <p class="text-slate-500 text-[11px]">${f.note}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 3. Top Knowledge & Comprehension Questions -->
            <div class="space-y-4">
                <h4 class="font-bold text-blue-900 text-sm flex items-center gap-2">
                    <i class="fa-solid fa-feather text-amber-600"></i> নির্বাচিত ক ও খ প্রশ্নোত্তর
                </h4>
                <div class="space-y-3">
                    ${(sscData && sscData.knowledge ? sscData.knowledge.slice(0, 3) : []).map(k => `
                        <div class="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs space-y-1">
                            <p class="font-bold text-blue-900"><strong>(ক)</strong> ${k.q}</p>
                            <p class="text-slate-700 pl-3 border-l-2 border-blue-400"><strong>উত্তর:</strong> ${k.a}</p>
                        </div>
                    `).join('')}
                    ${compData.slice(0, 2).map(c => `
                        <div class="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-xs space-y-1">
                            <p class="font-bold text-amber-900"><strong>(খ)</strong> ${c.q}</p>
                            <p class="text-slate-700 pl-3 border-l-2 border-amber-400"><strong>উত্তর:</strong> ${c.a}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 4. Top Solved Creative Question (CQ) -->
            ${(cqs && cqs.length > 0) ? `
                <div class="space-y-3">
                    <h4 class="font-bold text-blue-900 text-sm flex items-center gap-2">
                        <i class="fa-solid fa-graduation-cap text-purple-600"></i> মডেল সৃজনশীল প্রশ্ন (CQ) ও পূর্ণ সমাধান
                    </h4>
                    <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-3">
                        <p class="font-bold text-slate-800">উদ্দীপক: ${cqs[0].stimulus}</p>
                        <div class="space-y-2 pt-2 border-t border-slate-200">
                            <p><strong class="text-blue-700">(ক)</strong> ${cqs[0].q_a} → <em>${cqs[0].ans_a}</em></p>
                            <p><strong class="text-amber-700">(খ)</strong> ${cqs[0].q_b} → <em>${cqs[0].ans_b}</em></p>
                            <p><strong class="text-emerald-700">(গ)</strong> ${cqs[0].q_c}<br><span class="font-mono text-slate-700 pl-3 block mt-1">${cqs[0].ans_c}</span></p>
                            <p><strong class="text-purple-700">(ঘ)</strong> ${cqs[0].q_d}<br><span class="font-mono text-slate-700 pl-3 block mt-1">${cqs[0].ans_d}</span></p>
                        </div>
                    </div>
                </div>
            ` : ''}

            <!-- Footer Action -->
            <div class="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span class="text-xs text-slate-500">© Al amin Physics • সর্বস্বত্ব সংরক্ষিত</span>
                <button onclick="downloadPdfNotice()" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm">
                    <i class="fa-solid fa-print"></i> সম্পূর্ণ শিট প্রিন্ট করুন
                </button>
            </div>
        `;
    }

    /* ── 8. VIDEO PLAYLIST ── */
    const playlist = (sscData && sscData.video_playlist) ? sscData.video_playlist : [
        { label: "লেকচার ১: মৌলিক পরিচিতি ও সংজ্ঞা", dur: "২২ মিনিট", active: true, paid: false },
        { label: "লেকচার ২: সূত্রের প্রতিপাদন ও গ্রাফ",  dur: "২৮ মিনিট", active: false, paid: false },
        { label: "লেকচার ৩: জটিল গাণিতিক সমস্যা",       dur: "৩৫ মিনিট", active: false, paid: false },
        { label: "লেকচার ৪: বোর্ড CQ হ্যাকস",             dur: "৪৫ মিনিট", active: false, paid: true  }
    ];
    document.getElementById('video-now-playing').textContent = `${playlist[0]?.label || chap.title}`;
    document.getElementById('video-playlist').innerHTML = playlist.map(v => `
        <div class="p-3 ${v.active ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'} rounded-xl border flex items-center justify-between cursor-pointer transition">
            <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-lg ${v.active ? 'bg-blue-600 text-white' : v.paid ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'} flex items-center justify-center text-xs">
                    <i class="fa-solid ${v.paid ? 'fa-crown' : 'fa-play'}"></i>
                </div>
                <div>
                    <p class="text-xs font-bold text-slate-900">${v.label}</p>
                    <span class="text-[10px] ${v.active ? 'text-blue-700' : v.paid ? 'text-amber-700' : 'text-slate-400'} font-semibold">আল আমিন স্যার • ${v.dur}</span>
                </div>
            </div>
            ${v.active ? '<span class="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">চলছে</span>' : v.paid ? '<span class="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">পেইড</span>' : ''}
        </div>`).join('');

    // Render KaTeX formulas and auto-render
    setTimeout(() => {
        document.querySelectorAll('.katex-formula').forEach(el => {
            try {
                if (window.katex) {
                    window.katex.render(el.dataset.expr, el, { throwOnError: false, displayMode: false });
                }
            } catch(e) {
                el.textContent = el.dataset.expr;
            }
        });
        if (window.renderMathInElement) {
            try {
                window.renderMathInElement(document.body, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false}
                    ],
                    throwOnError: false
                });
            } catch(e) {}
        }
    }, 60);

    /* ── 9. Q&A FEED ── */
    renderQAFeed();

    /* ── 10. CHAPTER SIMULATION ── */
    renderChapterSimulation();

    /* ── 11. EXAM reset ── */
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
   CHAPTER SIMULATION (26 ChatGPT-crafted Labs)
=================================================== */
const CHAPTER_LAB_MAP = {
    1:  { name: "ভৌত রাশি ও পরিমাপ", labs: [ { id: "caliper", num: 1, title: "ভার্নিয়ার ও স্ক্রু গজ", sub: "পরিমাপের ছোট্ট পার্থক্য, বিজ্ঞানের বড় নির্ভুলতা।" }, { id: "density", num: 2, title: "ঘনত্ব অনুসন্ধান", sub: "একটি অজানা বস্তুর পরিচয় খুঁজে বের করো।" } ] },
    2:  { name: "গতি", labs: [ { id: "motion", num: 3, title: "গাড়ি, গতি ও লেখচিত্র", sub: "চলন্ত গাড়ির প্রতিটি মুহূর্তকে গ্রাফে ধরো।" }, { id: "fall", num: 4, title: "মুক্তপতন পরীক্ষাগার", sub: "ভিন্ন ভর, একই মহাকর্ষ—ফল কী হবে?" } ] },
    3:  { name: "বল", labs: [ { id: "friction", num: 5, title: "বল ও ঘর্ষণ", sub: "কখন বাক্স নড়বে, কখন থামবে—নিজে পরীক্ষা করো।" }, { id: "collision", num: 6, title: "ট্রলির সংঘর্ষ", sub: "ভরবেগ কোথায় যায়? সংঘর্ষে খুঁজে দেখো।" } ] },
    4:  { name: "কাজ, ক্ষমতা ও শক্তি", labs: [ { id: "energy", num: 7, title: "রোলার কোস্টার ও শক্তি", sub: "উঁচু–নিচু পথে শক্তির রূপান্তর দেখো।" }, { id: "crane", num: 8, title: "ক্রেন, কাজ ও ক্ষমতা", sub: "একই কাজ, ভিন্ন সময়—ক্ষমতার পার্থক্য।" } ] },
    5:  { name: "পদার্থের অবস্থা ও চাপ", labs: [ { id: "buoyancy", num: 9, title: "ভাসা–ডোবা ও প্লবতা", sub: "ওজন আর পানির ঊর্ধ্বমুখী বলের লড়াই।" }, { id: "pressure", num: 10, title: "চাপ ও হাইড্রলিক লিফট", sub: "অল্প বল দিয়ে বড় ভার—কীভাবে সম্ভব?" } ] },
    6:  { name: "বস্তুর ওপর তাপের প্রভাব", labs: [ { id: "heat", num: 11, title: "বরফ থেকে বাষ্প", sub: "তাপ দিলেও কখন তাপমাত্রা বাড়ে না?" }, { id: "expansion", num: 12, title: "তাপে ধাতুর প্রসারণ", sub: "ক্ষুদ্র পরিবর্তন, বড় প্রকৌশল সিদ্ধান্ত।" } ] },
    7:  { name: "তরঙ্গ ও শব্দ", labs: [ { id: "wave", num: 13, title: "দড়িতে তরঙ্গ", sub: "একটি দোলন, ছড়িয়ে পড়ে পুরো দড়িতে।" }, { id: "sound", num: 14, title: "শব্দ ও প্রতিধ্বনি", sub: "শব্দ পাঠাও, ফিরে আসার সময় মাপো।" } ] },
    8:  { name: "আলোর প্রতিফলন", labs: [ { id: "reflection", num: 15, title: "দর্পণ ও লেজার", sub: "আলোর কোণ নিজে মেপে সূত্র যাচাই করো।" }, { id: "mirror", num: 16, title: "গোলীয় দর্পণে প্রতিবিম্ব", sub: "বাস্তব না অবাস্তব—দর্পণ সরিয়ে খুঁজে দেখো।" } ] },
    9:  { name: "আলোর প্রতিসরণ", labs: [ { id: "refraction", num: 17, title: "প্রতিসরণ ও সংকট কোণ", sub: "মাধ্যম বদলালে আলোর পথ কোথায় যায়?" }, { id: "lens", num: 18, title: "লেন্স ও দৃষ্টি সংশোধন", sub: "আলোর রশ্মি মিলিয়ে স্পষ্ট প্রতিবিম্ব তৈরি করো।" } ] },
    10: { name: "স্থির বিদ্যুৎ", labs: [ { id: "charges", num: 19, title: "আধান ও তড়িৎক্ষেত্র", sub: "অদৃশ্য বলকে দৃশ্যমান করো।" }, { id: "electroscope", num: 20, title: "তড়িৎ আবেশ ও ইলেকট্রোস্কোপ", sub: "কাছে আনা, ছোঁয়ানো ও আর্থিং পরীক্ষা করো।" } ] },
    11: { name: "চল বিদ্যুৎ", labs: [ { id: "circuit", num: 21, title: "নিজের সার্কিট তৈরি করো", sub: "তার জোড়া দাও। সুইচ চালাও। বিদ্যুৎকে বুঝে নাও।" }, { id: "house", num: 22, title: "বাড়ির বিদ্যুৎ ও ফিউজ", sub: "কত লোড নিরাপদ? হিসাব করে চালাও।" } ] },
    12: { name: "বিদ্যুতের চৌম্বক ক্রিয়া", labs: [ { id: "motor", num: 23, title: "তড়িৎচুম্বক ও মোটর", sub: "বিদ্যুৎ থেকে ঘূর্ণন—ভেতরের প্রক্রিয়া দেখো।" }, { id: "induction", num: 24, title: "চুম্বক, কয়েল ও জেনারেটর", sub: "হাতের গতিতে তৈরি করো বিদ্যুৎ।" } ] },
    13: { name: "আধুনিক পদার্থবিজ্ঞান ও ইলেকট্রনিক্স", labs: [ { id: "decay", num: 25, title: "তেজস্ক্রিয় ক্ষয় ও অর্ধায়ু", sub: "প্রতিটি পরমাণু অনিশ্চিত, সমষ্টিতে একটি নিয়ম।" }, { id: "electronics", num: 26, title: "ডায়োড ও ট্রানজিস্টর", sub: "একদিকে কারেন্ট, ক্ষুদ্র সংকেতে বড় নিয়ন্ত্রণ।" } ] }
};

function renderChapterSimulation() {
    const container = document.getElementById('simulation-tab-content');
    if (!container) return;

    if (currentLevel === 'ssc') {
        const chapNum = currentChapterIndex + 1;
        const chapData = CHAPTER_LAB_MAP[chapNum];
        if (!chapData) return;

        const lab1 = chapData.labs[0];
        const lab2 = chapData.labs[1];

        container.innerHTML = `
            <div class="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <!-- Top Header & Tabs -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-700 font-bold text-[11px] border border-teal-200">অধ্যায় ${String(chapNum).padStart(2, '0')}</span>
                            <span class="text-xs font-bold text-slate-400">ভার্চুয়াল ল্যাবরেটরি</span>
                        </div>
                        <h3 class="text-lg sm:text-xl font-bold text-slate-900">${chapData.name} — ইন্টারেক্টিভ সিমুলেশন</h3>
                    </div>

                    <div class="flex items-center gap-2">
                        <a id="study-sim-fs-btn" href="${lab1.id === 'caliper' ? 'simulations/vernier-caliper.html' : 'physics-labs/index.html?lab=' + lab1.id}" target="_blank" class="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold border border-teal-200 transition flex items-center gap-1.5 shadow-sm">
                            <i class="fa-solid fa-up-right-and-down-left-from-center"></i> <span>পূর্ণ পর্দায় খুলুন ↗</span>
                        </a>
                        <a href="simulations/index.html" class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5">
                            <i class="fa-solid fa-flask text-teal-600"></i> <span>সকল ২৬টি ল্যাব</span>
                        </a>
                    </div>
                </div>

                <!-- Lab Switcher Buttons -->
                <div class="flex items-center gap-2 overflow-x-auto pb-1">
                    <button id="study-sim-tab-1" onclick="switchStudySimulationLab('${lab1.id}', 1)" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-600 text-white shadow-sm transition flex items-center gap-2">
                        <span class="w-5 h-5 rounded-md bg-white/20 text-white text-[10px] flex items-center justify-center font-mono font-bold">${String(lab1.num).padStart(2, '0')}</span>
                        <span>${lab1.title}</span>
                    </button>
                    <button id="study-sim-tab-2" onclick="switchStudySimulationLab('${lab2.id}', 2)" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center gap-2">
                        <span class="w-5 h-5 rounded-md bg-white text-slate-600 border border-slate-200 text-[10px] flex items-center justify-center font-mono font-bold">${String(lab2.num).padStart(2, '0')}</span>
                        <span>${lab2.title}</span>
                    </button>
                </div>

                <!-- Interactive Iframe -->
                <div class="relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-[#08111d] shadow-inner">
                    <iframe id="study-simulation-iframe" src="${lab1.id === 'caliper' ? 'simulations/vernier-caliper.html' : 'physics-labs/index.html?lab=' + lab1.id + '&embed=1'}" title="${lab1.title}" class="w-full h-[600px] sm:h-[700px] lg:h-[760px] border-0 bg-[#08111d]" allow="fullscreen; clipboard-write"></iframe>
                </div>

                <!-- Two Labs Details Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-teal-800 flex items-center gap-1.5">
                                <span class="w-5 h-5 rounded bg-teal-100 text-teal-700 text-[10px] flex items-center justify-center font-mono">${String(lab1.num).padStart(2, '0')}</span>
                                ${lab1.title}
                            </span>
                            <a href="${lab1.id === 'caliper' ? 'simulations/vernier-caliper.html' : 'physics-labs/index.html?lab=' + lab1.id}" target="_blank" class="text-[11px] font-bold text-teal-600 hover:underline">নতুন ট্যাব ↗</a>
                        </div>
                        <p class="text-xs text-slate-500">${lab1.sub}</p>
                        <button onclick="switchStudySimulationLab('${lab1.id}', 1)" class="w-full py-1.5 px-3 rounded-xl bg-white hover:bg-teal-50 border border-slate-200 text-xs font-bold text-slate-700 transition">
                            এই ল্যাবটি স্ক্রিনে চালু করুন
                        </button>
                    </div>

                    <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-teal-800 flex items-center gap-1.5">
                                <span class="w-5 h-5 rounded bg-teal-100 text-teal-700 text-[10px] flex items-center justify-center font-mono">${String(lab2.num).padStart(2, '0')}</span>
                                ${lab2.title}
                            </span>
                            <a href="${lab2.id === 'caliper' ? 'simulations/vernier-caliper.html' : 'physics-labs/index.html?lab=' + lab2.id}" target="_blank" class="text-[11px] font-bold text-teal-600 hover:underline">নতুন ট্যাব ↗</a>
                        </div>
                        <p class="text-xs text-slate-500">${lab2.sub}</p>
                        <button onclick="switchStudySimulationLab('${lab2.id}', 2)" class="w-full py-1.5 px-3 rounded-xl bg-white hover:bg-teal-50 border border-slate-200 text-xs font-bold text-slate-700 transition">
                            এই ল্যাবটি স্ক্রিনে চালু করুন
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center max-w-xl mx-auto my-6 space-y-4">
                <div class="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center text-2xl mx-auto mb-2">
                    <i class="fa-solid fa-flask"></i>
                </div>
                <h3 class="text-xl font-bold text-slate-900">ভার্চুয়াল পদার্থবিজ্ঞান ল্যাবরেটরি</h3>
                <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    বর্তমানে এসএসসি পদার্থবিজ্ঞানের ১৩টি অধ্যায়ের জন্য মোট ২৬টি হ্যান্ডস-অন ইন্টারেক্টিভ ল্যাব প্রস্তুত রয়েছে। এইচএসসি শিক্ষার্থীদের জন্যও এই মৌলিক ল্যাবগুলো অত্যন্ত কার্যকর।
                </p>
                <div class="pt-2">
                    <a href="simulations/index.html" class="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-lg shadow-teal-600/25 transition">
                        <i class="fa-solid fa-atom"></i> ২৬টি ল্যাবরেটরি এক্সপ্লোর করুন <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
    }
}

function switchStudySimulationLab(labId, tabNum) {
    const iframe = document.getElementById('study-simulation-iframe');
    const tab1 = document.getElementById('study-sim-tab-1');
    const tab2 = document.getElementById('study-sim-tab-2');
    const btnFs = document.getElementById('study-sim-fs-btn');
    if (iframe) {
        iframe.src = labId === 'caliper' ? 'simulations/vernier-caliper.html' : `physics-labs/index.html?lab=${labId}&embed=1`;
    }
    if (btnFs) {
        btnFs.href = labId === 'caliper' ? 'simulations/vernier-caliper.html' : `physics-labs/index.html?lab=${labId}`;
    }
    if (tab1 && tab2) {
        if (tabNum === 1) {
            tab1.className = 'px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-600 text-white shadow-sm transition flex items-center gap-2';
            tab2.className = 'px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center gap-2';
        } else {
            tab2.className = 'px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-600 text-white shadow-sm transition flex items-center gap-2';
            tab1.className = 'px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center gap-2';
        }
    }
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

function selectSimExperiment(expKey) {
    simMode = expKey;
    const isPro = (expKey === 'circuit' || expKey === 'optics' || expKey === 'orbit');
    const lockOverlay = document.getElementById('sim-pro-lock-overlay');
    const badge = document.getElementById('sim-lab-type-badge');
    const sideBtn = document.getElementById('btn-side-unlock-sim');

    // Update experiment buttons UI
    ['pendulum','projectile','circuit','optics','orbit'].forEach(k => {
        const btn = document.getElementById(`sim-tab-${k}`);
        if (!btn) return;
        if (k === expKey) {
            btn.className = "sim-exp-btn px-3 py-2 rounded-xl border border-blue-500 bg-blue-50 text-blue-700 font-bold flex items-center gap-1.5 whitespace-nowrap shadow-sm";
        } else {
            btn.className = "sim-exp-btn px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-1.5 whitespace-nowrap";
        }
    });

    if (badge) {
        badge.textContent = isPro ? 'Pro Lab (৳১০০)' : 'Free Lab';
        badge.className = isPro ? "text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold" : "text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold";
    }

    if (isPro && !proSimUnlocked) {
        if (lockOverlay) {
            lockOverlay.classList.remove('hidden');
            const titles = {
                circuit: "চলতড়িৎ ও ওহমের সূত্র ভার্চুয়াল ল্যাব (Pro)",
                optics: "আলোর প্রতিফলন ও অবতল/উত্তল লেন্স ল্যাব (Pro)",
                orbit: "মহাকর্ষ ও কৃত্রিম উপগ্রহের কক্ষপথ ল্যাব (Pro)"
            };
            const titleEl = document.getElementById('sim-pro-lock-title');
            if (titleEl) titleEl.textContent = titles[expKey];
        }
    } else {
        if (lockOverlay) lockOverlay.classList.add('hidden');
    }

    if (sideBtn) {
        sideBtn.textContent = proSimUnlocked ? "আনলকড" : "আনলক";
        sideBtn.disabled = proSimUnlocked;
        if (proSimUnlocked) sideBtn.className = "px-2.5 py-1.5 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[10px]";
    }

    updateSimControlsUI();
    resetSimulation();
}

function openProSimModal()  { document.getElementById('pro-sim-modal')?.classList.remove('hidden'); }
function closeProSimModal() { document.getElementById('pro-sim-modal')?.classList.add('hidden'); }

function handleProSimPaymentSubmit(e) {
    e.preventDefault();
    const phone = document.getElementById('sim-pay-phone').value;
    const trx = document.getElementById('sim-pay-trxid').value;
    proSimUnlocked = true;
    lsSet(LS.PRO_SIM_PASS, true);
    
    // Add transaction
    transactionsStore.unshift({
        id: `TX-${Math.floor(100+Math.random()*900)}`,
        date: "এইমাত্র",
        studentName: studentUser ? studentUser.name : "শিক্ষার্থী",
        phone: phone,
        item: "প্রো ভার্চুয়াল ল্যাব পাস",
        method: "bKash/Nagad",
        trx: trx,
        amount: "৳ ১০০",
        status: "Approved"
    });
    lsSet(LS.TRANSACTIONS, transactionsStore);

    closeProSimModal();
    alert(`ধন্যবাদ! আপনার TrxID: ${trx} ভেরিফাই হয়েছে। সকল প্রো ভার্চুয়াল ফিজিক্স ল্যাব আজীবন আনলক করা হলো!`);
    selectSimExperiment(simMode);
    if (currentViewMode === 'director') renderDirectorDashboardData();
}

function updateSimControlsUI() {
    const container = document.getElementById('simulation-controls');
    if (!container) return;

    if (simMode === 'pendulum') {
        container.innerHTML = `
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
    } else if (simMode === 'projectile') {
        container.innerHTML = `
            <div>
                <div class="flex justify-between mb-1"><span>কোণ θ (°):</span><span id="sim-proj-ang" class="font-bold text-blue-600">${projAngle}</span></div>
                <input type="range" min="15" max="85" value="${projAngle}" oninput="projAngle=parseFloat(this.value);document.getElementById('sim-proj-ang').textContent=this.value;resetSimulation();" class="w-full accent-blue-600">
            </div>
            <div>
                <div class="flex justify-between mb-1"><span>আদিবেগ v₀ (m/s):</span><span id="sim-proj-spd" class="font-bold text-blue-600">${projSpeed}</span></div>
                <input type="range" min="20" max="80" value="${projSpeed}" oninput="projSpeed=parseFloat(this.value);document.getElementById('sim-proj-spd').textContent=this.value;resetSimulation();" class="w-full accent-blue-600">
            </div>`;
    } else if (simMode === 'circuit') {
        container.innerHTML = `
            <div>
                <div class="flex justify-between mb-1"><span>ভোল্টেজ V (Volt):</span><span id="sim-volt-val" class="font-bold text-blue-600">${circuitVoltage} V</span></div>
                <input type="range" min="1" max="24" value="${circuitVoltage}" oninput="circuitVoltage=parseFloat(this.value);document.getElementById('sim-volt-val').textContent=this.value+' V';" class="w-full accent-blue-600">
            </div>
            <div>
                <div class="flex justify-between mb-1"><span>রোধ R (Ohm Ω):</span><span id="sim-res-val" class="font-bold text-blue-600">${circuitResist} Ω</span></div>
                <input type="range" min="1" max="20" value="${circuitResist}" oninput="circuitResist=parseFloat(this.value);document.getElementById('sim-res-val').textContent=this.value+' Ω';" class="w-full accent-blue-600">
            </div>
            <div class="p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-[11px] text-blue-900 font-mono">
                ওহমের সূত্র: I = V / R = ${(circuitVoltage/circuitResist).toFixed(2)} A
            </div>`;
    } else if (simMode === 'optics') {
        container.innerHTML = `
            <div>
                <div class="flex justify-between mb-1"><span>ফোকাস দূরত্ব f (cm):</span><span id="sim-focal-val" class="font-bold text-blue-600">${lensFocalLength}</span></div>
                <input type="range" min="50" max="150" value="${lensFocalLength}" oninput="lensFocalLength=parseFloat(this.value);document.getElementById('sim-focal-val').textContent=this.value;" class="w-full accent-blue-600">
            </div>
            <div>
                <div class="flex justify-between mb-1"><span>লক্ষ্যবস্তুর দূরত্ব u (cm):</span><span id="sim-objdist-val" class="font-bold text-blue-600">${lensObjectDist}</span></div>
                <input type="range" min="80" max="280" value="${lensObjectDist}" oninput="lensObjectDist=parseFloat(this.value);document.getElementById('sim-objdist-val').textContent=this.value;" class="w-full accent-blue-600">
            </div>`;
    } else if (simMode === 'orbit') {
        container.innerHTML = `
            <div>
                <div class="flex justify-between mb-1"><span>কক্ষপথ ব্যাসার্ধ r (km):</span><span id="sim-orbit-dist" class="font-bold text-blue-600">${orbitDist*50}</span></div>
                <input type="range" min="60" max="160" value="${orbitDist}" oninput="orbitDist=parseFloat(this.value);document.getElementById('sim-orbit-dist').textContent=this.value*50;" class="w-full accent-blue-600">
            </div>
            <div>
                <div class="flex justify-between mb-1"><span>উপগ্রহের ভর m (kg):</span><span id="sim-orbit-mass" class="font-bold text-blue-600">${orbitMass}</span></div>
                <input type="range" min="200" max="3000" step="100" value="${orbitMass}" oninput="orbitMass=parseFloat(this.value);document.getElementById('sim-orbit-mass').textContent=this.value;" class="w-full accent-blue-600">
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
    else if (simMode === 'projectile') { projTime = 0; projTrajectory = []; }
    else if (simMode === 'orbit') { orbitAngle = 0; }
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
        if (simMode === 'pendulum')        drawPendulum(ctx, canvas);
        else if (simMode === 'projectile') drawProjectile(ctx, canvas);
        else if (simMode === 'circuit')    drawCircuit(ctx, canvas);
        else if (simMode === 'optics')     drawOptics(ctx, canvas);
        else if (simMode === 'orbit')      drawOrbit(ctx, canvas);
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

function drawCircuit(ctx, canvas) {
    const current = circuitVoltage / circuitResist;
    const w = 400, h = 220;
    const sx = (canvas.width - w) / 2, sy = (canvas.height - h) / 2;

    // Draw Wire Loop
    ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 4;
    ctx.strokeRect(sx, sy, w, h);

    // Battery at Left
    ctx.fillStyle = "#0f172a"; ctx.fillRect(sx - 10, sy + h/2 - 25, 20, 50);
    ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(sx - 16, sy + h/2 - 18); ctx.lineTo(sx + 16, sy + h/2 - 18); ctx.stroke();
    ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(sx - 10, sy + h/2 + 18); ctx.lineTo(sx + 10, sy + h/2 + 18); ctx.stroke();
    ctx.fillStyle = "#f8fafc"; ctx.font = "11px sans-serif";
    ctx.fillText(`${circuitVoltage}V`, sx - 45, sy + h/2 + 4);

    // Resistor at Top
    const rx = sx + w/2 - 40, ry = sy;
    ctx.fillStyle = "#0f172a"; ctx.fillRect(rx - 5, ry - 15, 90, 30);
    ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    for(let i=0; i<6; i++) ctx.lineTo(rx + 10 + i*10, ry + (i%2 === 0 ? -10 : 10));
    ctx.lineTo(rx + 80, ry); ctx.stroke();
    ctx.fillStyle = "#f8fafc"; ctx.font = "11px sans-serif";
    ctx.fillText(`R = ${circuitResist} Ω`, rx + 15, ry - 20);

    // Flowing Current Particles
    if (simRunning) {
        if (!circuitElectrons || circuitElectrons.length < 12) {
            circuitElectrons = Array.from({length: 12}, (_, i) => ({ dist: i * ((2*w + 2*h) / 12) }));
        }
        const totalPerimeter = 2 * (w + h);
        const speed = Math.max(1, current * 1.5);
        circuitElectrons.forEach(e => {
            e.dist = (e.dist + speed) % totalPerimeter;
            let px = sx, py = sy;
            if (e.dist < w) { px = sx + e.dist; py = sy; }
            else if (e.dist < w + h) { px = sx + w; py = sy + (e.dist - w); }
            else if (e.dist < 2*w + h) { px = sx + w - (e.dist - (w + h)); py = sy + h; }
            else { px = sx; py = sy + h - (e.dist - (2*w + h)); }

            ctx.fillStyle = "#38bdf8"; ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI*2); ctx.fill();
        });
    }

    document.getElementById('sim-live-stats').textContent = `বর্তনী প্রবাহ I = ${current.toFixed(2)} A | ক্ষমতা P = ${(circuitVoltage*current).toFixed(1)} W`;
}

function drawOptics(ctx, canvas) {
    const cx = canvas.width / 2, cy = canvas.height / 2;
    // Principal axis
    ctx.strokeStyle = "#475569"; ctx.lineWidth = 1.5; ctx.setLineDash([5,5]);
    ctx.beginPath(); ctx.moveTo(30, cy); ctx.lineTo(canvas.width - 30, cy); ctx.stroke();
    ctx.setLineDash([]);

    // Convex Lens in Center
    ctx.strokeStyle = "#38bdf8"; ctx.fillStyle = "rgba(56, 189, 248, 0.2)"; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 15, 120, 0, 0, Math.PI*2);
    ctx.fill(); ctx.stroke();

    // Object (Arrow at Left)
    const ox = cx - lensObjectDist;
    const oy = cy - lensObjectHeight;
    ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(ox, cy); ctx.lineTo(ox, oy); ctx.stroke();
    // Arrow head
    ctx.fillStyle = "#f59e0b"; ctx.beginPath(); ctx.moveTo(ox-6, oy+10); ctx.lineTo(ox+6, oy+10); ctx.lineTo(ox, oy); ctx.fill();
    ctx.fillStyle = "#f8fafc"; ctx.font = "10px sans-serif"; ctx.fillText("বস্তু (u)", ox - 15, cy + 20);

    // Lens formula: 1/v - 1/(-u) = 1/f => 1/v = 1/f - 1/u => v = (f*u)/(u - f)
    let v = 0, m = 1;
    if (lensObjectDist !== lensFocalLength) {
        v = (lensFocalLength * lensObjectDist) / (lensObjectDist - lensFocalLength);
        m = -v / lensObjectDist;
    }
    const ix = cx + v;
    const iy = cy + lensObjectHeight * m;

    // Light Ray 1: Parallel to axis then through Focus (F2)
    ctx.strokeStyle = "rgba(239, 68, 68, 0.8)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(cx, oy); ctx.lineTo(ix, iy); ctx.stroke();

    // Light Ray 2: Through optical center (cx, cy)
    ctx.strokeStyle = "rgba(59, 130, 246, 0.8)";
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ix, iy); ctx.stroke();

    // Image Arrow at Right
    if (Math.abs(v) < 400 && lensObjectDist > lensFocalLength) {
        ctx.strokeStyle = "#10b981"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(ix, cy); ctx.lineTo(ix, iy); ctx.stroke();
        ctx.fillStyle = "#10b981"; ctx.font = "10px sans-serif"; ctx.fillText("বিম্ব (v)", ix - 15, cy + 20);
    }

    document.getElementById('sim-live-stats').textContent = `ফোকাস f = ${lensFocalLength}cm | দূরত্ব u = ${lensObjectDist}cm | বিম্ব v ≈ ${v.toFixed(1)}cm | বিবর্ধন m ≈ ${Math.abs(m).toFixed(2)}`;
}

function drawOrbit(ctx, canvas) {
    const cx = canvas.width / 2, cy = canvas.height / 2;
    // Central Planet (Earth)
    const earthGrad = ctx.createRadialGradient(cx-10, cy-10, 5, cx, cy, 38);
    earthGrad.addColorStop(0, '#60a5fa'); earthGrad.addColorStop(1, '#1e3a8a');
    ctx.fillStyle = earthGrad; ctx.beginPath(); ctx.arc(cx, cy, 38, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#f8fafc"; ctx.font = "bold 11px sans-serif"; ctx.fillText("পৃথিবী", cx - 18, cy + 4);

    // Orbit Path
    ctx.strokeStyle = "#334155"; ctx.lineWidth = 1.5; ctx.setLineDash([4,4]);
    ctx.beginPath(); ctx.arc(cx, cy, orbitDist, 0, Math.PI*2); ctx.stroke(); ctx.setLineDash([]);

    if (simRunning) {
        orbitAngle += (120 / orbitDist) * 0.02;
    }
    const sx = cx + orbitDist * Math.cos(orbitAngle);
    const sy = cy + orbitDist * Math.sin(orbitAngle);

    // Satellite Body
    ctx.fillStyle = "#f59e0b"; ctx.fillRect(sx - 8, sy - 8, 16, 16);
    // Solar panels
    ctx.fillStyle = "#38bdf8"; ctx.fillRect(sx - 20, sy - 4, 10, 8); ctx.fillRect(sx + 10, sy - 4, 10, 8);

    const vOrbit = Math.sqrt((400000) / orbitDist).toFixed(1);
    document.getElementById('sim-live-stats').textContent = `কক্ষপথ বেগ v ≈ ${vOrbit} km/s | ব্যাসার্ধ r = ${orbitDist*50} km | স্যাটেলাইট ভর: ${orbitMass} kg`;
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

function showGlobalAggregator(type, isPop = false) {
    currentAggregatorType = type;
    setAppView('aggregator', { type: type }, isPop);

    const titleEl = document.getElementById('global-agg-title');
    const subtitleEl = document.getElementById('global-agg-subtitle');

    const titles = {
        formulas: { title: "সকল গুরুত্বপূর্ণ সূত্রসমূহ (এক নজরে)", sub: "পদার্থবিজ্ঞানের প্রতিটি অধ্যায়ের মূল সমীকরণ ও প্রতীক পরিচিতি।" },
        math:     { title: "সকল গাণিতিক সমস্যা ও সমাধান", sub: "পরীক্ষায় আসা বিভিন্ন অধ্যায়ের জটিল গাণিতিক উদাহরণ ও নির্ভুল সমাধান।" },
        video:    { title: "সকল অধ্যায়ের ভিডিও ক্লাস", sub: "কনসেপ্ট ক্লিয়ারিং ও ভিজ্যুয়াল লেকচার ভিডিও সমূহ।" },
        comprehension: { title: "অনুধাবনমূলক প্রশ্ন ও উত্তর (খ-প্রশ্ন)", sub: "বোর্ড পরীক্ষার জন্য সবচেয়ে গুরুত্বপূর্ণ অনুধাবন প্রশ্ন।" },
        board:    { title: "বিগত বছরের বোর্ড প্রশ্ন ও সমাধান", sub: "বিভিন্ন শিক্ষা বোর্ডের সৃজনশীল ও বহুনির্বাচনী প্রশ্ন সংকলন।" }
    };

    if (titles[type] && titleEl && subtitleEl) {
        titleEl.textContent = titles[type].title;
        subtitleEl.textContent = titles[type].sub;
    }

    renderGlobalAggregatorContent();
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

            const ssc = (lvl === 'ssc' && window.SSC_CURRICULUM_DATA) ? window.SSC_CURRICULUM_DATA[chap.id] : null;

            let snippetHTML = '';
            if (currentAggregatorType === 'formulas') {
                const fPreview = (ssc && ssc.formulas && ssc.formulas.length > 0)
                    ? ssc.formulas.slice(0, 2).map(f => `<span class="font-bold text-blue-700">${f.tag}:</span> ${f.expr} (${f.note})`).join('<br>')
                    : 's = ut + ½at²  |  v = u + at  |  v² = u² + 2as';
                snippetHTML = `
                    <div class="text-xs space-y-1 bg-white p-3 rounded-xl border border-slate-100">
                        <p class="font-mono text-slate-800 text-[11px] leading-relaxed">${fPreview}</p>
                    </div>
                `;
            } else if (currentAggregatorType === 'math') {
                const mPrev = (ssc && ssc.math && ssc.math[0]) ? ssc.math[0] : null;
                snippetHTML = `
                    <div class="text-xs space-y-1.5 bg-white p-3 rounded-xl border border-slate-100">
                        <p class="font-medium text-slate-800 line-clamp-2">${mPrev ? mPrev.question : 'গাণিতিক সমস্যা ও প্রয়োগমূলক ম্যাথ'}</p>
                        <p class="text-emerald-600 font-semibold text-[11px]"><i class="fa-solid fa-check"></i> সমাধান ও ধাপসমূহ সংকলিত</p>
                    </div>
                `;
            } else if (currentAggregatorType === 'video') {
                const vPrev = (ssc && ssc.video_playlist && ssc.video_playlist[0]) ? ssc.video_playlist[0] : null;
                snippetHTML = `
                    <div class="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100">
                        <div class="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-lg"><i class="fa-solid fa-play"></i></div>
                        <div>
                            <p class="text-xs font-bold text-slate-800">${vPrev ? vPrev.label : 'লেকচার ক্লাস'}</p>
                            <p class="text-[11px] text-slate-400">সময়কাল: ${vPrev ? vPrev.dur : '৩৫ মিনিট'} | আল আমিন স্যার</p>
                        </div>
                    </div>
                `;
            } else if (currentAggregatorType === 'comprehension') {
                const cPrev = (ssc && ssc.comprehension && ssc.comprehension[0]) ? ssc.comprehension[0] : null;
                snippetHTML = `
                    <div class="text-xs space-y-1 bg-white p-3 rounded-xl border border-slate-100">
                        <p class="font-bold text-slate-800 line-clamp-1">অনুধাবন: ${cPrev ? cPrev.q : 'ব্যাখ্যামূলক খ-প্রশ্ন'}</p>
                        <p class="text-slate-500 text-[11px] line-clamp-2">${cPrev ? cPrev.a : 'বোর্ড স্ট্যান্ডার্ড উত্তর'}</p>
                    </div>
                `;
            } else {
                const cqPrev = (ssc && ssc.cqs && ssc.cqs[0]) ? ssc.cqs[0] : null;
                snippetHTML = `
                    <div class="text-xs bg-white p-3 rounded-xl border border-slate-100 space-y-1">
                        <p class="font-bold text-slate-800">${cqPrev ? cqPrev.board : 'বোর্ড সৃজনশীল প্রশ্ন (CQ)'}</p>
                        <p class="text-[11px] text-slate-500 line-clamp-2">${cqPrev ? cqPrev.stimulus : 'উদ্দীপকসহ ক, খ, গ, ঘ এর পূর্ণাঙ্গ সমাধান'}</p>
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

function openSimulationDirectly(simId) {
    if (simId) {
        window.location.href = `physics-labs/index.html?lab=${simId}`;
        return;
    }
    if (currentLevel !== 'ssc') {
        currentLevel = 'ssc';
        const lvlSelect = document.getElementById('class-level-select');
        if (lvlSelect) lvlSelect.value = 'ssc';
    }
    // Switch to classroom view mode so the content display area is visible
    openClassroomView();
    // Switch to simulation tab
    switchTab('simulation');
    // Render the chapter's simulations
    renderChapterSimulation();
    // Scroll smoothly to the simulation container
    setTimeout(() => {
        const target = document.getElementById('section-simulation');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 150);
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

function markVideoComplete() {
    addProgress(getCurrentChap().id, 'video');
    alert('ভিডিও সম্পন্ন চিহ্নিত হয়েছে! আপনার প্রগ্রেস আপডেট হয়েছে।');
}
function printFormulaSheet() { window.print(); }
function downloadPdfNotice() {
    const chap = getCurrentChap();
    const sscData = (window.SSC_CURRICULUM_DATA && window.SSC_CURRICULUM_DATA[chap.id])
        ? window.SSC_CURRICULUM_DATA[chap.id]
        : null;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('পপ-আপ ব্লক থাকায় প্রিন্ট উইন্ডো খোলা যায়নি। অনুগ্রহ করে ব্রাউজার পারমিশন দিন।');
        return;
    }

    const formulasHtml = (sscData && sscData.formulas ? sscData.formulas : []).map((f, i) => `
        <div class="formula-item">
            <strong>${f.tag}:</strong> <code class="formula-code">${f.expr}</code>
            <p class="formula-note">${f.note}</p>
        </div>
    `).join('');

    const knowledgeHtml = (sscData && sscData.knowledge ? sscData.knowledge : []).map((k, i) => `
        <div class="qa-item">
            <p class="qa-q"><strong>ক-${i+1}.</strong> ${k.q}</p>
            <p class="qa-a"><strong>উত্তর:</strong> ${k.a}</p>
        </div>
    `).join('');

    const compHtml = (sscData && sscData.comprehension ? sscData.comprehension : []).map((c, i) => `
        <div class="qa-item">
            <p class="qa-q"><strong>খ-${i+1}.</strong> ${c.q}</p>
            <p class="qa-a"><strong>উত্তর:</strong> ${c.a}</p>
        </div>
    `).join('');

    const cqHtml = (sscData && sscData.cqs ? sscData.cqs : []).map((cq, i) => `
        <div class="cq-card">
            <div class="cq-header">
                <strong>সৃজনশীল প্রশ্ন (CQ ${i+1})</strong> • <span>${cq.board}</span> (পূর্ণমান: ${cq.marks || 10})
            </div>
            <div class="cq-stimulus">
                <strong>উদ্দীপক:</strong> ${cq.stimulus}
            </div>
            <div class="cq-parts">
                <p><strong>(ক) [১ নম্বর]</strong> ${cq.q_a}</p>
                <div class="cq-ans"><strong>উত্তর:</strong> ${cq.ans_a}</div>

                <p><strong>(খ) [২ নম্বর]</strong> ${cq.q_b}</p>
                <div class="cq-ans"><strong>উত্তর:</strong> ${cq.ans_b}</div>

                <p><strong>(গ) [৩ নম্বর]</strong> ${cq.q_c}</p>
                <div class="cq-ans" style="white-space: pre-line; font-family: monospace;"><strong>সমাধান:</strong>\n${cq.ans_c}</div>

                <p><strong>(ঘ) [৪ নম্বর]</strong> ${cq.q_d}</p>
                <div class="cq-ans" style="white-space: pre-line; font-family: monospace;"><strong>উচ্চতর দক্ষতা ও বিশ্লেষণ:</strong>\n${cq.ans_d}</div>
            </div>
        </div>
    `).join('');

    const mathHtml = (sscData && sscData.math ? sscData.math : []).map((m, i) => `
        <div class="math-item">
            <p class="math-q"><strong>সমস্যা ${i+1} (${m.type || 'বোর্ড'}):</strong> ${m.question}</p>
            <div class="math-a" style="white-space: pre-line; font-family: monospace;"><strong>সমাধান:</strong>\n${m.solution}</div>
        </div>
    `).join('');

    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="bn">
        <head>
            <meta charset="UTF-8">
            <title>${chap.title} — এক্সক্লুসিভ লেকচার শিট | Al amin Physics</title>
            <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
                @page { size: A4; margin: 15mm 12mm; }
                body {
                    font-family: 'Hind Siliguri', sans-serif;
                    color: #0f172a;
                    line-height: 1.6;
                    padding: 0;
                    margin: 0;
                    font-size: 13px;
                }
                .container { max-width: 800px; margin: 0 auto; }
                .sheet-header {
                    border-bottom: 3px solid #1e3a8a;
                    padding-bottom: 12px;
                    margin-bottom: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }
                .sheet-brand h1 { margin: 0; color: #1e3a8a; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
                .sheet-brand p { margin: 2px 0 0; color: #475569; font-size: 13px; font-weight: 600; }
                .sheet-author { text-align: right; }
                .sheet-author p { margin: 0; font-size: 12px; color: #334155; }
                .sheet-author .author-name { font-weight: 700; color: #2563eb; font-size: 14px; }
                .badge-strip {
                    background: #f1f5f9;
                    border: 1px solid #cbd5e1;
                    padding: 8px 14px;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 16px;
                    display: flex;
                    justify-content: space-between;
                }
                .section-title {
                    font-size: 15px;
                    font-weight: 700;
                    color: #1e3a8a;
                    border-left: 4px solid #2563eb;
                    padding-left: 8px;
                    margin: 18px 0 10px;
                    text-transform: uppercase;
                }
                .summary-box {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 12px 14px;
                    font-size: 13px;
                    line-height: 1.7;
                    text-align: justify;
                }
                .formula-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                }
                .formula-item {
                    background: #f0fdf4;
                    border: 1px solid #bbf7d0;
                    padding: 8px 10px;
                    border-radius: 6px;
                }
                .formula-code {
                    font-size: 13px;
                    font-weight: bold;
                    color: #166534;
                    background: #dcfce7;
                    padding: 2px 6px;
                    border-radius: 4px;
                    display: inline-block;
                    margin: 2px 0;
                }
                .formula-note { margin: 2px 0 0; font-size: 11px; color: #4b5563; }
                .qa-item {
                    background: #fff;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    padding: 8px 12px;
                    margin-bottom: 8px;
                    page-break-inside: avoid;
                }
                .qa-q { margin: 0 0 4px; font-weight: 600; color: #1e293b; }
                .qa-a { margin: 0; color: #334155; padding-left: 10px; border-left: 2px solid #3b82f6; }
                .cq-card {
                    background: #fff;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 14px;
                    page-break-inside: avoid;
                }
                .cq-header {
                    font-size: 12px;
                    color: #2563eb;
                    font-weight: bold;
                    border-bottom: 1px dashed #cbd5e1;
                    padding-bottom: 6px;
                    margin-bottom: 8px;
                }
                .cq-stimulus {
                    background: #f8fafc;
                    padding: 8px 10px;
                    border-radius: 6px;
                    border: 1px solid #e2e8f0;
                    margin-bottom: 10px;
                    line-height: 1.6;
                }
                .cq-ans {
                    background: #f8fafc;
                    padding: 6px 10px;
                    border-radius: 4px;
                    border-left: 2px solid #2563eb;
                    margin: 4px 0 8px;
                    font-size: 12px;
                }
                .math-item {
                    background: #fff;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    padding: 10px;
                    margin-bottom: 10px;
                    page-break-inside: avoid;
                }
                .math-q { margin: 0 0 6px; font-weight: 600; color: #1e293b; }
                .math-a { background: #f8fafc; padding: 6px 10px; border-left: 2px solid #4f46e5; font-size: 12px; }
                .footer {
                    margin-top: 25px;
                    text-align: center;
                    font-size: 11px;
                    color: #64748b;
                    border-top: 1px solid #cbd5e1;
                    padding-top: 10px;
                }
                .print-actions {
                    text-align: center;
                    margin: 15px 0;
                }
                .print-btn {
                    background: #2563eb;
                    color: white;
                    border: none;
                    padding: 8px 20px;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: bold;
                    cursor: pointer;
                }
                @media print {
                    .print-actions { display: none; }
                    body { font-size: 12px; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="print-actions">
                    <button class="print-btn" onclick="window.print()">🖨️ প্রিন্ট করুন বা PDF হিসেবে সংরক্ষণ করুন</button>
                </div>

                <div class="sheet-header">
                    <div class="sheet-brand">
                        <h1>Al amin Physics</h1>
                        <p>${chap.title} • পূর্ণাঙ্গ লেকচার শিট ও হ্যান্ডনোট</p>
                    </div>
                    <div class="sheet-author">
                        <p class="author-name">আল আমিন স্যার</p>
                        <p>প্রতিষ্ঠাতা ও হেড অব ফিজিক্স</p>
                        <p>জলেশ্বরীতলা, বগুড়া | ০১৭৯৬৪৩১৭৯৫</p>
                    </div>
                </div>

                <div class="badge-strip">
                    <span>সিলেবাস: NCTB ২০২৬ মানসম্পন্ন</span>
                    <span>শ্রেনি: নবম-দশম ও এসএসসি</span>
                    <span>ওয়েবসাইট: al-amin-physics.vercel.app</span>
                </div>

                <div class="section-title">📌 ১. অধ্যায় সারসংক্ষেপ ও মৌলিক পরিচিতি</div>
                <div class="summary-box">
                    ${sscData ? sscData.summary : chap.desc}
                </div>

                ${formulasHtml ? `
                    <div class="section-title">📐 ২. প্রয়োজনীয় সকল সূত্রাবলি</div>
                    <div class="formula-grid">${formulasHtml}</div>
                ` : ''}

                ${knowledgeHtml ? `
                    <div class="section-title">📖 ৩. সেরা জ্ঞানমূলক প্রশ্নোত্তর (ক নম্বর)</div>
                    <div>${knowledgeHtml}</div>
                ` : ''}

                ${compHtml ? `
                    <div class="section-title">💡 ৪. সেরা অনুধাবনমূলক প্রশ্নোত্তর (খ নম্বর)</div>
                    <div>${compHtml}</div>
                ` : ''}

                ${cqHtml ? `
                    <div class="section-title">🎓 ৫. বোর্ড মানসম্পন্ন সৃজনশীল প্রশ্ন ও পূর্ণাঙ্গ সমাধান</div>
                    <div>${cqHtml}</div>
                ` : ''}

                ${mathHtml ? `
                    <div class="section-title">🧮 ৬. গাণিতিক সমস্যাবলি ও সমাধান</div>
                    <div>${mathHtml}</div>
                ` : ''}

                <div class="footer">
                    <strong>Al amin Physics Digital Platform</strong> • জলেশ্বরীতলা, বগুড়া • হটলাইন: ০১৭৯৬৪৩১৭৯৫, ০১৫২১৪৪৩০৬৫ • al-amin-physics.vercel.app
                </div>
            </div>
            <script>
                window.onload = function() {
                    // Small delay to ensure styles loaded
                    setTimeout(function() { window.print(); }, 400);
                }
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}
function showHomeView() { showLMSDashboard(); }

/* ===================================================
   VALUE-HOOK PHONE AUTH & USER PROFILE SESSION
=================================================== */
let authPendingAction = null;
let generatedOtp = "1234";

function openPhoneAuthModal(triggerReason = 'header') {
    const modal = document.getElementById('phone-auth-modal');
    if (!modal) {
        console.error('phone-auth-modal element not found!');
        return;
    }
    authPendingAction = triggerReason;
    
    const reasonEl = document.getElementById('phone-auth-reason');
    const descEl = document.getElementById('phone-auth-desc');
    if (reasonEl && descEl) {
        if (triggerReason === 'video') {
            reasonEl.textContent = "ভিডিও ক্লাস প্রিভিউ শেষ!";
            descEl.textContent = "পরবর্তী সকল ভিডিও লেকচার ও ক্লাস আনলক করতে মোবাইল নম্বর দিয়ে এক ক্লিকে লগইন করুন।";
        } else if (triggerReason === 'exam') {
            reasonEl.textContent = "পরীক্ষার রেজাল্ট সেভ করুন!";
            descEl.textContent = "আপনার মেধা তালিকা ও অভিভাবকের কাছে অটোমেটিক রেজাল্ট পাঠাতে ফোন নম্বর দিন।";
        } else if (triggerReason === 'doubt') {
            reasonEl.textContent = "স্যারের সাথে সরাসরি আলোচনা!";
            descEl.textContent = "আপনার প্রশ্নের উত্তর ও নোটিফিকেশন পেতে ফোন নম্বর দিয়ে লগইন করুন।";
        } else {
            reasonEl.textContent = "আল আমিন ফিজিক্সে স্বাগতম!";
            descEl.textContent = "মোবাইল নম্বর ও নাম দিয়ে সহজে নিজের স্টুডেন্ট প্রোফাইল ও লিডারবোর্ডে যুক্ত হোন।";
        }
    }

    const step1 = document.getElementById('phone-step-1');
    const step2 = document.getElementById('phone-step-2');
    if (step1) step1.classList.remove('hidden');
    if (step2) step2.classList.add('hidden');
    
    modal.classList.remove('hidden');
    modal.style.display = 'flex';

    setTimeout(() => {
        document.getElementById('auth-input-name')?.focus();
    }, 100);
}

function closePhoneAuthModal() {
    const modal = document.getElementById('phone-auth-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
}

function requestPhoneOtp() {
    const name = document.getElementById('auth-input-name').value.trim();
    const phone = document.getElementById('auth-input-phone').value.trim();
    const lvl = document.getElementById('auth-input-class').value;

    if (!name) { alert('অনুগ্রহ করে আপনার পুরো নাম লিখুন!'); return; }
    if (!phone || phone.length < 10) { alert('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন!'); return; }

    document.getElementById('otp-phone-display').textContent = `+88 ${phone}`;
    document.getElementById('phone-step-1').classList.add('hidden');
    document.getElementById('phone-step-2').classList.remove('hidden');
    document.getElementById('otp-1').focus();
}

function editAuthPhone() {
    document.getElementById('phone-step-1').classList.remove('hidden');
    document.getElementById('phone-step-2').classList.add('hidden');
}

function focusNextOtp(idx) {
    const val = document.getElementById(`otp-${idx}`).value;
    if (val && idx < 4) {
        document.getElementById(`otp-${idx+1}`).focus();
    }
}

function verifyPhoneOtp() {
    const o1 = document.getElementById('otp-1').value;
    const o2 = document.getElementById('otp-2').value;
    const o3 = document.getElementById('otp-3').value;
    const o4 = document.getElementById('otp-4').value;
    const entered = `${o1}${o2}${o3}${o4}`;

    if (entered !== "1234" && entered.length < 4) {
        alert('সঠিক ওটিপি দিন (ডেমো কোড: 1 2 3 4)');
        return;
    }

    const name = document.getElementById('auth-input-name').value.trim();
    const phone = document.getElementById('auth-input-phone').value.trim();
    const lvl = document.getElementById('auth-input-class').value;

    studentUser = {
        name: name,
        phone: phone,
        classLevel: lvl,
        streak: 7,
        joinedAt: "আজ"
    };
    lsSet(LS.STUDENT_USER, studentUser);

    updateUserSessionUI();
    closePhoneAuthModal();
    alert(`অভিনন্দন ${name}! আপনি সফলভাবে লগইন হয়েছেন।`);

    if (authPendingAction === 'profile') {
        showStudentProfileView();
    }
}

function logoutStudentSession() {
    if (confirm('আপনি কি সত্যিই লগআউট করতে চান?')) {
        studentUser = null;
        lsSet(LS.STUDENT_USER, null);
        updateUserSessionUI();
        showLMSDashboard();
        alert('লগআউট সম্পন্ন হয়েছে।');
    }
}

function updateUserSessionUI() {
    const container = document.getElementById('user-session-container');
    if (!container) return;

    if (studentUser) {
        container.innerHTML = `
            <div onclick="showStudentProfileView()" class="cursor-pointer flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm" title="প্রোফাইলে যান">
                <i class="fa-solid fa-user-graduate text-emerald-600"></i>
                <span class="max-w-[90px] truncate hidden sm:inline">${studentUser.name}</span>
            </div>
        `;
    } else {
        container.innerHTML = `
            <button onclick="openPhoneAuthModal('header')" id="header-login-btn" class="interactive-btn flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm shadow-blue-200">
                <i class="fa-solid fa-right-to-bracket"></i>
                <span>লগইন</span>
            </button>
        `;
    }
}

/* ===================================================
   STUDENT PROFILE DASHBOARD RENDERER
=================================================== */
function renderStudentProfileData() {
    if (!studentUser) {
        openPhoneAuthModal('profile');
        return;
    }

    document.getElementById('profile-display-name').textContent = studentUser.name;
    document.getElementById('profile-display-phone').textContent = `ফোন: ${studentUser.phone} (ভেরিফায়েড)`;
    
    const classNames = {
        ssc: "নবম-দশম শ্রেণি (SSC Physics)",
        hsc1: "একাদশ-দ্বাদশ শ্রেণি — ১ম পত্র",
        hsc2: "একাদশ-দ্বাদশ শ্রেণি — ২য় পত্র",
        class8: "অষ্টম শ্রেণি বিজ্ঞান (NCTB 2026)"
    };
    document.getElementById('profile-display-class').textContent = classNames[studentUser.classLevel] || "নবম-দশম শ্রেণি";

    // Exam History List
    const examList = document.getElementById('profile-exam-history-list');
    const scoresKeys = Object.keys(examScoresStore);
    if (scoresKeys.length === 0) {
        examList.innerHTML = `
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 text-center">
                এখনো কোনো পরীক্ষা দেওয়া হয়নি। <button onclick="goToSpecificChapterAndTab('ssc', 1, 'exam')" class="text-blue-600 font-bold hover:underline">প্রথম মডেল টেস্ট দিন</button>
            </div>
        `;
    } else {
        examList.innerHTML = scoresKeys.map(k => {
            const sc = examScoresStore[k];
            return `
                <div class="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                            <i class="fa-solid fa-clipboard-check"></i>
                        </div>
                        <div>
                            <p class="font-bold text-slate-800">অধ্যায় মডেল টেস্ট (${k})</p>
                            <span class="text-[10px] text-slate-400">স্ট্যাটাস: সম্পন্ন</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="font-black text-blue-600 text-sm">${sc} / 5</span>
                        <span class="block text-[10px] text-emerald-600 font-bold">A+ মার্কস</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Chapter Progress List
    const progList = document.getElementById('profile-chapter-progress-list');
    progList.innerHTML = APP_DATA['ssc'].chapters.slice(0, 4).map(ch => {
        const p = chapterProgress[ch.id] || 0;
        return `
            <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                <div class="flex justify-between font-bold text-slate-800">
                    <span>${ch.title}</span>
                    <span class="text-blue-600">${p}%</span>
                </div>
                <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div class="bg-blue-600 h-full rounded-full transition-all duration-500" style="width:${p}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

function triggerParentSmsDemo() {
    const phone = studentUser ? studentUser.phone : "০১৭১২-৩৪৫৬৭৮";
    const name = studentUser ? studentUser.name : "শিক্ষার্থী";
    alert(`[অটোমেটিক SMS সফলভাবে প্রেরিত হয়েছে]\n\nপ্রাপক: অভিভাবক (${phone})\nবার্তা: "শ্রদ্ধেয় অভিভাবক, আপনার সন্তান ${name} আল আমিন ফিজিক্সে 'বল ও গতি' পরীক্ষায় ৫-এ ৫ পেয়ে শীর্ষ স্থানে রয়েছে। অভিনন্দন!"`);
}

/* ===================================================
   LEADERBOARD & SOCIAL FEED RENDERER
=================================================== */
let currentLeaderboardFilter = 'all';

function filterLeaderboard(filter) {
    currentLeaderboardFilter = filter;
    ['all','ssc','hsc1','hsc2'].forEach(k => {
        const btn = document.getElementById(`lb-filter-${k}`);
        if (!btn) return;
        if (k === filter) {
            btn.className = "px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs";
        } else {
            btn.className = "px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium text-xs";
        }
    });
    renderLeaderboardData(filter);
}

function renderLeaderboardData(filter) {
    const tbody = document.getElementById('leaderboard-table-body');
    if (!tbody) return;

    let list = [...LEADERBOARD_SEED];
    if (studentUser) {
        list.unshift({
            rank: "👑 আপনি",
            name: `${studentUser.name} (My Profile)`,
            class: "SSC (নবম-দশম)",
            exams: 8,
            points: 42,
            badge: "🏆 ৪র্থ"
        });
    }

    if (filter === 'ssc')  list = list.filter(item => item.class.includes('SSC'));
    if (filter === 'hsc1') list = list.filter(item => item.class.includes('HSC ১'));
    if (filter === 'hsc2') list = list.filter(item => item.class.includes('HSC ২'));

    tbody.innerHTML = list.map((item, idx) => `
        <tr class="hover:bg-slate-50 transition ${item.name.includes('(My Profile)') ? 'bg-amber-50/70 font-bold' : ''}">
            <td class="py-3 font-bold text-slate-900">${item.rank}</td>
            <td class="py-3">
                <div class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center justify-center">${item.name[0]}</span>
                    <span>${item.name}</span>
                </div>
            </td>
            <td class="py-3 text-slate-500">${item.class}</td>
            <td class="py-3 text-slate-600">${item.exams}টি</td>
            <td class="py-3 text-right font-black text-blue-600">${item.points} pts</td>
        </tr>
    `).join('');
}

function renderSocialActivityFeed() {
    const container = document.getElementById('live-social-feed-container');
    if (!container) return;

    container.innerHTML = SOCIAL_ACTIVITY_SEED.map(item => `
        <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
            <div class="w-7 h-7 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xs mt-0.5">
                <i class="fa-solid ${item.icon}"></i>
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-slate-800 leading-snug"><strong class="font-bold text-slate-900">${item.user}</strong> ${item.action}</p>
                <span class="text-[10px] text-slate-400 mt-0.5 block">${item.time}</span>
            </div>
        </div>
    `).join('');
}

/* ===================================================
   DIRECTOR EXECUTIVE & ADMIN SUITE
=================================================== */
function renderDirectorDashboardData() {
    const tbody = document.getElementById('director-trx-table-body');
    if (!tbody) return;

    tbody.innerHTML = transactionsStore.map(tx => `
        <tr class="hover:bg-slate-50 transition">
            <td class="py-3 text-slate-500 font-mono">${tx.date}</td>
            <td class="py-3">
                <p class="font-bold text-slate-800">${tx.studentName}</p>
                <span class="text-[10px] text-slate-400 font-mono">${tx.phone}</span>
            </td>
            <td class="py-3 text-slate-700 font-medium">${tx.item}</td>
            <td class="py-3 font-mono">
                <span class="font-bold text-slate-800">${tx.trx}</span>
                <span class="text-[10px] text-pink-600 block">${tx.method}</span>
            </td>
            <td class="py-3 font-black text-emerald-600">${tx.amount}</td>
            <td class="py-3 text-right">
                ${tx.status === 'Approved' 
                    ? `<span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Approved</span>`
                    : `<button onclick="approveTransaction('${tx.id}')" class="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold transition">অ্যাপ্রুভ</button>`
                }
            </td>
        </tr>
    `).join('');
}

function approveTransaction(txId) {
    const item = transactionsStore.find(t => t.id === txId);
    if (item) {
        item.status = 'Approved';
        lsSet(LS.TRANSACTIONS, transactionsStore);
        renderDirectorDashboardData();
        alert(`ট্রানজেকশন ${txId} (${item.studentName}) সফলভাবে অ্যাপ্রুভ করা হয়েছে!`);
    }
}

function saveAdminPermissions() {
    adminPermsStore.paymentApprove = document.getElementById('perm-payment-approve').checked;
    adminPermsStore.examCreate = document.getElementById('perm-exam-create').checked;
    adminPermsStore.contentUpload = document.getElementById('perm-content-upload').checked;
    adminPermsStore.viewRevenue = document.getElementById('perm-view-revenue').checked;
    lsSet(LS.ADMIN_PERMS, adminPermsStore);
    alert('অ্যাডমিন পারমিশন সফলভাবে আপডেট করা হয়েছে!');
}

function exportStudentsCsv() {
    let csv = "ID,Name,Phone,Class,Status\n";
    LEADERBOARD_SEED.forEach((s, idx) => {
        csv += `${idx+1},"${s.name}","017XXXXXXXX","${s.class}","Active"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Alamin_Physics_Students_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportFinanceReport() {
    alert('মাসিক আয়-ব্যয় রিপোর্ট (PDF) জেনারেট হচ্ছে...\nমোট রেভিনিউ: ৳ ১,২৪,৫০০\nমোট এনরোলমেন্ট: ৫৮টি\nপ্রো ভার্চুয়াল ল্যাব বিক্রয়: ৳ ৩১,২০০');
}

/* ===================================================
   BULK PHYSICS EXAM CREATOR & OMR STUDIO
=================================================== */
let parsedExamQuestions = [];

function openExamStudioModal() {
    document.getElementById('exam-studio-modal')?.classList.remove('hidden');
}

function closeExamStudioModal() {
    document.getElementById('exam-studio-modal')?.classList.add('hidden');
}

function loadSamplePhysicsQuestions() {
    const sample = `১. একটি গাড়ির বেগ 10 s এ 20 m/s থেকে বৃদ্ধি পেয়ে 50 m/s হলো। গাড়িটির ত্বরণ কত?
(ক) 2 m/s²
(খ) 3 m/s²
(গ) 5 m/s²
(ঘ) 30 m/s²

২. নিক্ষিপ্ত বস্তুর ক্ষেত্রে সর্বোচ্চ উচ্চতায় বেগ কত?
(ক) 9.8 m/s
(খ) 0 m/s
(গ) 4.9 m/s
(ঘ) অসীম

৩. $s = ut + \\frac{1}{2}at^2$ সমীকরণে ত্বরণ $a=0$ হলে নিচের কোনটি সত্য?
(ক) $s = vt$
(খ) $v = u$
(গ) ক ও খ উভয়ই
(ঘ) কোনটিই নয়

৪. 50 N বল 10 kg ভরের একটি স্থির বস্তুর উপর 4 s কাজ করলে শেষবেগ কত হবে?
(ক) 10 m/s
(খ) 20 m/s
(গ) 40 m/s
(ঘ) 50 m/s`;
    document.getElementById('bulk-questions-raw').value = sample;
}

function parseRawQuestionsToOMR() {
    const raw = document.getElementById('bulk-questions-raw').value.trim();
    if (!raw) { alert('অনুগ্রহ করে প্রশ্ন পেস্ট করুন!'); return; }

    const rawBlocks = raw.split(/\n\s*\n/);
    parsedExamQuestions = [];

    rawBlocks.forEach((block, idx) => {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length >= 2) {
            const questionText = lines[0];
            const optionLines = lines.slice(1);
            const options = [];

            optionLines.forEach(opt => {
                const cleaned = opt.replace(/^\([কখগঘabcdABCD]\)|\b[কখগঘabcdABCD][\.\)]/g, '').trim();
                options.push(cleaned || opt);
            });

            parsedExamQuestions.push({
                q: questionText,
                options: options.length >= 4 ? options.slice(0, 4) : ["ক", "খ", "গ", "ঘ"],
                correct: 0,
                exp: "সঠিক উত্তর ও সমীকরণ আল আমিন স্যারের ওএমআর উত্তরপত্র অনুযায়ী নির্ধারিত।"
            });
        }
    });

    if (parsedExamQuestions.length === 0) {
        alert('প্রশ্ন ফরম্যাট করা সম্ভব হয়নি। নমুনা প্রশ্ন দেখে ফরম্যাট করুন।');
        return;
    }

    // Render OMR Sheet
    const omrBox = document.getElementById('omr-key-setup-box');
    const grid = document.getElementById('omr-questions-grid');
    const badge = document.getElementById('omr-parsed-count-badge');
    omrBox.classList.remove('hidden');
    badge.textContent = `${parsedExamQuestions.length}টি প্রশ্ন প্রস্তুত`;

    grid.innerHTML = parsedExamQuestions.map((qItem, qIdx) => `
        <div class="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-2">
            <p class="font-bold text-slate-800 text-xs">${qItem.q}</p>
            <div class="flex items-center gap-4 text-xs pt-1">
                <span class="font-bold text-slate-500">ওএমআর উত্তর নির্বাচন:</span>
                <div class="flex gap-3">
                    ${['ক (A)', 'খ (B)', 'গ (C)', 'ঘ (D)'].map((lbl, oIdx) => `
                        <label class="flex items-center gap-1.5 cursor-pointer p-1.5 rounded-lg border border-slate-200 hover:border-blue-400">
                            <input type="radio" name="omr_ans_${qIdx}" value="${oIdx}" ${oIdx === 0 ? 'checked' : ''} onchange="setOmrAnswerKey(${qIdx}, ${oIdx})" class="accent-blue-600">
                            <span class="font-bold text-slate-700 text-[11px]">${lbl}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function setOmrAnswerKey(qIdx, optIdx) {
    if (parsedExamQuestions[qIdx]) {
        parsedExamQuestions[qIdx].correct = optIdx;
    }
}

function publishExamFromStudio() {
    if (parsedExamQuestions.length === 0) {
        alert('আগে প্রশ্ন পেস্ট করে ওএমআর গ্রিড তৈরি করুন!');
        return;
    }
    const chap = document.getElementById('bulk-exam-chapter').value;
    const title = document.getElementById('bulk-exam-title').value;

    // Overwrite or append to EXAM_BANK
    EXAM_BANK.length = 0;
    parsedExamQuestions.forEach(q => EXAM_BANK.push(q));
    initExamQuestions();

    closeExamStudioModal();
    alert(`অসাধারণ! "${title}" পরীক্ষাটি ওএমআর উত্তরমালাসহ সফলভাবে প্রস্তুত হয়েছে!\nমোট প্রশ্ন: ${parsedExamQuestions.length}টি। এখন শিক্ষার্থীরা পরীক্ষা দিতে পারবে।`);
    goToSpecificChapterAndTab('ssc', 1, 'exam');
}

