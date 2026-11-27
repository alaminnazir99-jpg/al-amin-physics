const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/HP/.gemini/antigravity/scratch/al-amin-physics';

function parseMarkdownQuestionsAccurate(filePath, chapNum, chapName) {
    const mdText = fs.readFileSync(filePath, 'utf8');
    const lines = mdText.split(/\r?\n/);

    const sets = [
        { id: "set1", setNum: 1, title: "সেট ০১: সহজ (জ্ঞান ও মৌলিক ধারণা • ফ্রি ট্রায়াল)", difficulty: "সহজ", difficultyLevel: "easy", badgeColor: "emerald", qCount: 15, timeMinutes: 15, fullMarks: 15, isFree: true, desc: "মৌলিক সংজ্ঞা, বৈশিষ্ট্য ও ধারণা সম্পর্কিত বহুনির্বাচনী প্রশ্ন।", questions: [] },
        { id: "set2", setNum: 2, title: "সেট ০২: সহজ-মাঝারি (প্রয়োগ ও মূলনীতি)", difficulty: "সহজ-মাঝারি", difficultyLevel: "easy-medium", badgeColor: "blue", qCount: 15, timeMinutes: 15, fullMarks: 15, isFree: false, desc: "মূলনীতি, উদাহরণ ও বাস্তব প্রয়োগভিত্তিক প্রশ্ন।", questions: [] },
        { id: "set3", setNum: 3, title: "সেট ০৩: বোর্ড স্ট্যান্ডার্ড (সমন্বিত মডেল টেস্ট - ক)", difficulty: "মাঝারি", difficultyLevel: "medium", badgeColor: "indigo", qCount: 25, timeMinutes: 25, fullMarks: 25, isFree: false, desc: "বোর্ড স্ট্যান্ডার্ড পূর্ণাঙ্গ সমন্বিত মডেল টেস্ট।", questions: [] },
        { id: "set4", setNum: 4, title: "সেট ০৪: কঠিন (গাণিতিক ও উচ্চতর দক্ষতা)", difficulty: "কঠিন", difficultyLevel: "hard", badgeColor: "purple", qCount: 25, timeMinutes: 25, fullMarks: 25, isFree: false, desc: "উদ্দীপকভিত্তিক, বহুপদী সমাপ্তিসূচক ও বিশ্লেষণধর্মী প্রশ্ন।", questions: [] },
        { id: "set5", setNum: 5, title: "সেট ০৫: চ্যালেঞ্জ (মাস্টার বোর্ড মক টেস্ট - খ)", difficulty: "চ্যালেঞ্জ", difficultyLevel: "challenge", badgeColor: "amber", qCount: 25, timeMinutes: 25, fullMarks: 25, isFree: false, desc: "টপ গ্রেড ও নিখুঁত প্রস্তুতির জন্য চূড়ান্ত চ্যালেঞ্জিং প্রশ্নাবলি।", questions: [] }
    ];

    let currentSetIdx = -1;
    let pendingSetIdx = -1;
    let currentQ = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Check Set Header: ## সেট ১ — 15টি প্রশ্ন
        const setMatch = line.match(/^##\s*সেট\s*([১-৫1-5])/);
        if (setMatch) {
            const digitMap = { '১': 0, '২': 1, '৩': 2, '৪': 3, '৫': 4, '1': 0, '2': 1, '3': 2, '4': 3, '5': 4 };
            pendingSetIdx = digitMap[setMatch[1]] ?? -1;
            continue;
        }

        // Check Question header: **1.1. জীবের সমন্বয় বলতে কী বোঝায়?**
        const qMatch = line.match(/^\*\*(\d+)\.(\d+)\.\s*(.+)/);
        if (qMatch) {
            if (currentQ && currentSetIdx >= 0) {
                sets[currentSetIdx].questions.push(currentQ);
                currentQ = null;
            }

            if (pendingSetIdx >= 0) {
                currentSetIdx = pendingSetIdx;
                pendingSetIdx = -1;
            }

            let qText = qMatch[3].trim();
            let qId = `C8-CH05-S${currentSetIdx + 1}-${qMatch[2].padStart(2, '0')}`;
            const idMatch = qText.match(/\(ID:\s*`([^`]+)`.*?\)/);
            if (idMatch) {
                qId = idMatch[1].replace(/C8-CH0[1-4]-/, 'C8-CH05-');
                qText = qText.replace(/\(ID:\s*`([^`]+)`.*?\)/, '').trim();
            }
            qText = qText.replace(/\*\*$/, '').trim();

            currentQ = {
                id: qId,
                num: sets[currentSetIdx].questions.length + 1,
                q: qText,
                options: [],
                correct: 0,
                ans_letter: "ক",
                ans_text: "",
                exp: "",
                reference: ""
            };
            continue;
        }

        if (!currentQ) continue;

        // Option: - ক) ...
        const optMatch = line.match(/^-\s*([ক-ঘa-dA-D])\)\s*(.+)$/);
        if (optMatch) {
            const letter = optMatch[1];
            let optText = optMatch[2].trim();
            const isMarked = optText.includes('✓');
            optText = optText.replace('✓', '').trim();
            const optIndex = { 'ক': 0, 'খ': 1, 'গ': 2, 'ঘ': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3 }[letter] ?? currentQ.options.length;

            currentQ.options.push(optText);
            if (isMarked) {
                currentQ.correct = optIndex;
                currentQ.ans_letter = letter;
                currentQ.ans_text = optText;
            }
            continue;
        }

        // Correct answer: - **সঠিক উত্তর: খ) ...**
        const ansMatch = line.match(/^\*\*সঠিক উত্তর:\s*([ক-ঘ])\)\s*(.+?)\*\*/);
        if (ansMatch) {
            currentQ.ans_letter = ansMatch[1];
            currentQ.ans_text = ansMatch[2].trim();
            currentQ.correct = { 'ক': 0, 'খ': 1, 'গ': 2, 'ঘ': 3 }[ansMatch[1]] ?? 0;
            continue;
        }

        // Explanation: - **ব্যাখ্যা:** ...
        const expMatch = line.match(/^[-\*]*\s*\*\*ব্যাখ্যা:\*\*\s*(.+)$/);
        if (expMatch) {
            currentQ.exp = expMatch[1].trim();
            continue;
        }

        // Reference: - **রেফারেন্স:** ...
        const refMatch = line.match(/^[-\*]*\s*\*\*রেফারেন্স:\*\*\s*(.+)$/);
        if (refMatch) {
            currentQ.reference = refMatch[1].trim();
            continue;
        }

        // Additional stem lines
        if (currentQ.options.length === 0 && !line.startsWith('- **') && !line.startsWith('**সঠিক')) {
            currentQ.q += '\n' + line.replace(/\*\*$/, '').trim();
        }
    }

    if (currentQ && currentSetIdx >= 0) {
        sets[currentSetIdx].questions.push(currentQ);
    }

    return {
        chapterId: `c8_ch${chapNum}`,
        chapterNum: chapNum,
        chapterName: chapName,
        grade: "class8",
        subject: "বিজ্ঞান",
        description: `অষ্টম শ্রেণি বিজ্ঞান অধ্যায় ০${chapNum}: ${chapName} — ১০৫টি MCQ সম্পূর্ণ ব্যাংক।`,
        sets: sets
    };
}

// 1. Parse Chapter 5
const ch5Data = parseMarkdownQuestionsAccurate(path.join(baseDir, 'c8_ch5_raw.md'), 5, 'সমন্বয় ও নিঃসরণ');
console.log('--- Chapter 5 Sets ---');
let total = 0;
ch5Data.sets.forEach(s => {
    console.log(`Set ${s.setNum}: ${s.questions.length} Qs`);
    total += s.questions.length;
});
console.log('Total Chapter 5 Questions:', total);

if (total !== 105) {
    console.error('ERROR: Total questions is not 105!');
    process.exit(1);
}

// 2. Generate class8_ch5.js and write to data/exams/ and www/data/exams/
const fileHeader = `// Class 8 Science Chapter 05 Board Standard Exam Bank (5 Sets, 105 MCQs)
window.CLASS8_EXAM_BANK = window.CLASS8_EXAM_BANK || {};
window.CLASS8_EXAM_BANK[5] = ${JSON.stringify(ch5Data, null, 2)};
`;

fs.writeFileSync(path.join(baseDir, 'data/exams/class8_ch5.js'), fileHeader, 'utf8');
fs.writeFileSync(path.join(baseDir, 'www/data/exams/class8_ch5.js'), fileHeader, 'utf8');
console.log('Written data/exams/class8_ch5.js and www/data/exams/class8_ch5.js!');

// 3. Update js/class8-mcq-master-course.js & www/js/class8-mcq-master-course.js
let c8MasterJs = fs.readFileSync(path.join(baseDir, 'js/class8-mcq-master-course.js'), 'utf8');
// Update config
c8MasterJs = c8MasterJs.replace('totalExams: 22,', 'totalExams: 27,');
c8MasterJs = c8MasterJs.replace('totalQuestionsPool: 420,', 'totalQuestionsPool: 525,');

// Update chapters array
if (!c8MasterJs.includes("id: 'c8_c5'")) {
    c8MasterJs = c8MasterJs.replace(
        "{ num: 4, id: 'c8_c4', name: 'উদ্ভিদের বংশ বৃদ্ধি', qCount: 105 }",
        "{ num: 4, id: 'c8_c4', name: 'উদ্ভিদের বংশ বৃদ্ধি', qCount: 105 },\n            { num: 5, id: 'c8_c5', name: 'সমন্বয় ও নিঃসরণ', qCount: 105 }"
    );
}

// Update chaps in getAllExamDefinitions
if (!c8MasterJs.includes('num: 5, name: "সমন্বয় ও নিঃসরণ"')) {
    c8MasterJs = c8MasterJs.replace(
        '{ num: 4, name: "উদ্ভিদের বংশ বৃদ্ধি" }',
        '{ num: 4, name: "উদ্ভিদের বংশ বৃদ্ধি" },\n            { num: 5, name: "সমন্বয় ও নিঃসরণ" }'
    );
}

// Update combined test
c8MasterJs = c8MasterJs.replace(
    "title: 'অধ্যায় ১ থেকে ৪ সমন্বিত রিভিশন টেস্ট',\n            desc: 'প্রথম চারটি অধ্যায় থেকে নির্বাচিত ৩৫টি গুরুত্বপূর্ণ বোর্ড স্ট্যান্ডার্ড প্রশ্নের সমন্বিত পরীক্ষা।',\n            qCount: 35,\n            timeMinutes: 35,\n            fullMarks: 35,\n            difficulty: 'medium',\n            difficultyLabel: 'সমন্বিত মডেল টেস্ট',\n            category: 'সমন্বিত টেস্ট',\n            chapters: [1, 2, 3, 4],",
    "title: 'অধ্যায় ১ থেকে ৫ সমন্বিত রিভিশন টেস্ট',\n            desc: 'প্রথম পাঁচটি অধ্যায় থেকে নির্বাচিত ৪০টি গুরুত্বপূর্ণ বোর্ড স্ট্যান্ডার্ড প্রশ্নের সমন্বিত পরীক্ষা।',\n            qCount: 40,\n            timeMinutes: 40,\n            fullMarks: 40,\n            difficulty: 'medium',\n            difficultyLabel: 'সমন্বিত মডেল টেস্ট',\n            category: 'সমন্বিত টেস্ট',\n            chapters: [1, 2, 3, 4, 5],"
);

// Update final mock
c8MasterJs = c8MasterJs.replace(
    "desc: '৪২০টি প্রশ্নের সম্পূর্ণ পুল থেকে নির্বাচিত ৫০টি প্রশ্নের চূড়ান্ত মডেল টেস্ট।',\n            qCount: 50,\n            timeMinutes: 50,\n            fullMarks: 50,\n            difficulty: 'challenge',\n            difficultyLabel: 'গ্র্যান্ড ফাইনাল মক',\n            category: 'ফাইনাল মক',\n            chapters: [1, 2, 3, 4],",
    "desc: '৫২৫টি প্রশ্নের সম্পূর্ণ পুল থেকে নির্বাচিত ৫০টি প্রশ্নের চূড়ান্ত মডেল টেস্ট।',\n            qCount: 50,\n            timeMinutes: 50,\n            fullMarks: 50,\n            difficulty: 'challenge',\n            difficultyLabel: 'গ্র্যান্ড ফাইনাল মক',\n            category: 'ফাইনাল মক',\n            chapters: [1, 2, 3, 4, 5],"
);

fs.writeFileSync(path.join(baseDir, 'js/class8-mcq-master-course.js'), c8MasterJs, 'utf8');
fs.writeFileSync(path.join(baseDir, 'www/js/class8-mcq-master-course.js'), c8MasterJs, 'utf8');
console.log('Updated class8-mcq-master-course.js and www copy!');

// 4. Update curriculum_data.js & www/curriculum_data.js
const c8_c5_obj = {
    "num": 5,
    "title": "অধ্যায় ৫: সমন্বয় ও নিঃসরণ",
    "tag": "Class 8 Science Chapter 5",
    "desc": "উদ্ভিদে সমন্বয় ও ফাইটোহরমোন (অক্সিন, জিব্বেরেলিন, সাইটোকাইনিন, ইথিলিন, ফ্লোরিজেন), ট্রপিক চলন, মানব স্নায়ুতন্ত্র (নিউরন, সিন্যাপস, মস্তিষ্ক ও সুষুম্নাকাণ্ড), প্রতিবর্ত ক্রিয়া এবং মানব রেচনতন্ত্র (বৃক্ক, ফুসফুস ও চর্ম)।",
    "summary": "জীবদেহের বিভিন্ন অঙ্গ ও তন্ত্রের কার্যক্রম সুষ্ঠুভাবে পরিচালনার জন্য সমন্বয় অপরিহার্য। উদ্ভিদে আলাদা স্নায়ুতন্ত্র নেই, তাই ফাইটোহরমোন (বৃদ্ধি সহায়ক: অক্সিন, জিব্বেরেলিন, সাইটোকাইনিন এবং বৃদ্ধি প্রতিবন্ধক: অ্যাবসাইসিক এসিড, ইথিলিন) উদ্ভিদের বৃদ্ধি, পুষ্পায়ন ও ফল পাকা নিয়ন্ত্রণ করে। আলো ও অন্যান্য উদ্দীপকের প্রভাবে উদ্ভিদে ট্রপিক চলন ঘটে। মানবদেহের স্নায়ুতন্ত্রের গাঠনিক ও কার্যকরী একক হলো নিউরন; এটি মানবদেহের দীর্ঘতম কোষ এবং সেন্ট্রিওল না থাকায় এটি বিভাজিত হয় না। মস্তিষ্ক করোটির মধ্যে মেনিনজেস পর্দায় সুরক্ষিত এবং এর প্রধান অংশ তিনটি — গুরুমস্তিষ্ক (সেরিব্রাম), মধ্যমস্তিষ্ক এবং লঘুমস্তিষ্ক। তাৎক্ষণিক আত্মরক্ষার জন্য অনৈচ্ছিক স্নায়বিক তড়িৎপ্রক্রিয়া হলো প্রতিবর্ত ক্রিয়া যার ৫টি অংশ থাকে। রেচন প্রক্রিয়ার মাধ্যমে শতকরা ৮০ ভাগ নাইট্রোজেনঘটিত বর্জ্য বৃক্কের মাধ্যমে মূত্ররূপে নিষ্কাশিত হয়; এছাড়া ফুসফুস কার্বন ডাইঅক্সাইড এবং চর্ম ঘামের মাধ্যমে ক্ষতিকর পদার্থ নিঃসরণ করে।",
    "highlights": [
        "ফাইটোহরমোন দুই প্রকার: বৃদ্ধি সহায়ক (অক্সিন, জিব্বেরেলিন, সাইটোকাইনিন) ও বৃদ্ধি প্রতিবন্ধক (অ্যাবসাইসিক এসিড, ইথিলিন)।",
        "চার্লস ডারউইন উদ্ভিদের ভ্রূণমুকুলাবরণীতে আলোর প্রভাব দেখে প্রথম অক্সিন হরমোন আবিষ্কার করেন।",
        "ইথিলিন একটি গ্যাসীয় ফাইটোহরমোন যা ফল পাকাতে সাহায্য করে।",
        "নিউরন মানবদেহের দীর্ঘতম কোষ; সেন্ট্রিওল না থাকায় এটি বিভাজিত হতে পারে না।",
        "মস্তিষ্কে ধূসর পদার্থ বাইরে এবং শ্বেত পদার্থ ভিতরে থাকে; কিন্তু মেরুরজ্জুতে ধূসর পদার্থ ভিতরে ও শ্বেত পদার্থ বাইরে থাকে।",
        "প্রতিবর্ত চক্রের ৫টি অংশ: গ্রাহক অঙ্গ, অনুভূতিবাহী স্নায়ু, প্রতিবর্ত কেন্দ্র, আজ্ঞাবাহী স্নায়ু এবং সাড়া প্রদানকারী অঙ্গ।",
        "বৃক্ক প্রধান রেচন অঙ্গ যা শতকরা ৮০ ভাগ নাইট্রোজেন ঘটিত ক্ষতিকর বর্জ্য মূত্রের মাধ্যমে শরীর থেকে বের করে দেয়।"
    ],
    "definitions": [
        { "term": "ফাইটোহরমোন (Phytohormone)", "desc": "উদ্ভিদের কোষে উৎপন্ন যে বিশেষ জৈব রাসায়নিক পদার্থ বাহিত হয়ে উদ্ভিদের বৃদ্ধি, পরিস্ফুটন ও শারীরবৃত্তীয় কার্যাবলি নিয়ন্ত্রণ করে।" },
        { "term": "ট্রপিক চলন (Tropic Movement)", "desc": "বহিঃউদ্দীপক (যেমন আলো, অভিকর্ষ বা পানি)-এর উৎসের দিকে বা বিপরীত দিকে উদ্ভিদের অঙ্গের দিকনির্দেশী বৃদ্ধি ও চলন।" },
        { "term": "নিউরন (Neuron)", "desc": "স্নায়ুতন্ত্রের গঠনগত ও কার্যগত একক, যা কোষদেহ ও প্রলম্বিত অংশ (অ্যাক্সন ও ডেনড্রাইট) নিয়ে গঠিত।" },
        { "term": "সিন্যাপস (Synapse)", "desc": "একটি নিউরনের অ্যাক্সন প্রান্তের সাথে পরবর্তী নিউরনের ডেনড্রাইটের সংযোগস্থল যার মধ্য দিয়ে স্নায়ুতাড়না পরিবাহিত হয়।" },
        { "term": "প্রতিবর্ত ক্রিয়া (Reflex Action)", "desc": "উদ্দীপনার জবাবে মস্তিষ্কের নির্দেশ ছাড়াই সুষুম্নাকাণ্ড দ্বারা পরিচালিত তাৎক্ষণিক অনৈচ্ছিক প্রতিক্রিয়া।" },
        { "term": "রেচন (Excretion)", "desc": "বিপাকের ফলে উৎপন্ন ক্ষতিকর, বিষাক্ত ও অপ্রয়োজনীয় নাইট্রোজেনঘটিত বর্জ্য পদার্থ দেহ থেকে বাইরে বের করে দেওয়ার প্রক্রিয়া।" }
    ],
    "formulas": [
        { "tag": "প্রতিবর্ত চক্রের প্রবাহ", "expr": "\\text{গ্রাহক অঙ্গ} \\rightarrow \\text{অনুভূতিবাহী স্নায়ু} \\rightarrow \\text{প্রতিবর্ত কেন্দ্র (মেরুরজ্জু)} \\rightarrow \\text{আজ্ঞাবাহী স্নায়ু} \\rightarrow \\text{সাড়া প্রদানকারী অঙ্গ}", "note": "প্রতিবর্ত চক্রের পাঁচটি অপরিহার্য ধাপের সঠিক অনুক্রম।" }
    ]
};

['curriculum_data.js', 'www/curriculum_data.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('"c8_c5"')) {
        const insertion = '    "c8_c5": ' + JSON.stringify(c8_c5_obj, null, 8).replace(/^/gm, '    ').trim() + ',\n';
        content = content.replace('"hsc2_c1":', insertion + '    "hsc2_c1":');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', file);
    }
});

// 5. Update app.js & www/app.js to add c8_c5 to APP_DATA.class8.chapters
const c8_c5_chapter_entry = `            {
                id: "c8_c5",  num: 5,
                title: "অধ্যায় ৫: সমন্বয় ও নিঃসরণ",
                desc:  "ফাইটোহরমোন, ট্রপিক চলন, নিউরন ও মস্তিষ্ক, প্রতিবর্ত ক্রিয়া এবং বৃক্কের রেচন ব্যবস্থা।"
            },`;

['app.js', 'www/app.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('"c8_c5"')) {
        content = content.replace('title: "অধ্যায় ৪: উদ্ভিদের বংশ বৃদ্ধি",\n                desc:  "প্রজননের প্রকারভেদ, অঙ্গজ জনন, আদর্শ ফুল, পরাগায়ন, নিষিক্তকরণ ও অঙ্কুরোদগম।"\n            },',
            'title: "অধ্যায় ৪: উদ্ভিদের বংশ বৃদ্ধি",\n                desc:  "প্রজননের প্রকারভেদ, অঙ্গজ জনন, আদর্শ ফুল, পরাগায়ন, নিষিক্তকরণ ও অঙ্কুরোদগম।"\n            },\n' + c8_c5_chapter_entry
        );
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', file);
    }
});

// 6. Update study.html & www/study.html
['study.html', 'www/study.html'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // add script
    if (!content.includes('class8_ch5.js')) {
        content = content.replace('<script src="data/exams/class8_ch4.js"></script>',
            '<script src="data/exams/class8_ch4.js"></script>\n    <script src="data/exams/class8_ch5.js"></script>'
        );
    }
    
    // update modal text
    content = content.replace('১ম, ২য়, ৩য় ও ৪র্থ অধ্যায়ের ৪২০টি স্পেশাল প্রশ্ন, ২২টি ওএমআর পরীক্ষা', '১ম থেকে ৫ম অধ্যায়ের ৫২৫টি স্পেশাল প্রশ্ন, ২৭টি ওএমআর পরীক্ষা');
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Updated', file);
});

console.log('All updates complete for Chapter 5!');
