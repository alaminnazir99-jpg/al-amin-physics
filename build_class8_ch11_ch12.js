const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/HP/.gemini/antigravity/scratch/al-amin-physics';

function parseMarkdownQuestionsAccurate(filePath, chapNum, chapName) {
    const mdText = fs.readFileSync(filePath, 'utf8');
    const lines = mdText.split(/\r?\n/);

    const padChap = String(chapNum).padStart(2, '0');
    const sets = [
        { id: "set1", setNum: 1, title: `সেট ০১: সহজ (জ্ঞান ও মৌলিক ধারণা • ফ্রি ট্রায়াল)`, difficulty: "সহজ", difficultyLevel: "easy", badgeColor: "emerald", qCount: 15, timeMinutes: 15, fullMarks: 15, isFree: true, desc: `অধ্যায় ${chapNum}-এর মৌলিক সংজ্ঞা, বৈশিষ্ট্য ও প্রাথমিক ধারণার বহুনির্বাচনী প্রশ্ন।`, questions: [] },
        { id: "set2", setNum: 2, title: `সেট ০২: সহজ-মাঝারি (নিয়ম ও মূলনীতি)`, difficulty: "সহজ-মাঝারি", difficultyLevel: "easy-medium", badgeColor: "blue", qCount: 15, timeMinutes: 15, fullMarks: 15, isFree: false, desc: `অধ্যায় ${chapNum}-এর মূলনীতি, তুলনা ও বৈজ্ঞানিক বৈশিষ্ট্যের প্রশ্ন।`, questions: [] },
        { id: "set3", setNum: 3, title: `সেট ০৩: বোর্ড স্ট্যান্ডার্ড (সমন্বিত মডেল টেস্ট - ক)`, difficulty: "মাঝারি", difficultyLevel: "medium", badgeColor: "indigo", qCount: 25, timeMinutes: 25, fullMarks: 25, isFree: false, desc: `বোর্ড স্ট্যান্ডার্ড সমন্বিত মডেল টেস্ট ও বাস্তব প্রয়োগভিত্তিক প্রশ্ন।`, questions: [] },
        { id: "set4", setNum: 4, title: `সেট ০৪: কঠিন (উদ্দীপকভিত্তিক ও উচ্চতর দক্ষতা)`, difficulty: "কঠিন", difficultyLevel: "hard", badgeColor: "purple", qCount: 25, timeMinutes: 25, fullMarks: 25, isFree: false, desc: `উদ্দীপকভিত্তিক, চিত্র ও বিশ্লেষণধর্মী উচ্চতর চিন্তন দক্ষতার প্রশ্ন।`, questions: [] },
        { id: "set5", setNum: 5, title: `সেট ০৫: চ্যালেঞ্জ (মাস্টার বোর্ড মক টেস্ট - খ)`, difficulty: "চ্যালেঞ্জ", difficultyLevel: "challenge", badgeColor: "amber", qCount: 25, timeMinutes: 25, fullMarks: 25, isFree: false, desc: `টপ গ্রেড ও নিখুঁত প্রস্তুতির জন্য চূড়ান্ত চ্যালেঞ্জিং ও জটিল প্রশ্নাবলি।`, questions: [] }
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

        // Check Question header: **1.1. ...**
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
            let qId = `C8-CH${padChap}-S${currentSetIdx + 1}-${qMatch[2].padStart(2, '0')}`;
            const idMatch = qText.match(/\(ID:\s*`([^`]+)`.*?\)/);
            if (idMatch) {
                qId = idMatch[1];
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
        description: `অষ্টম শ্রেণি বিজ্ঞান অধ্যায় ${padChap}: ${chapName} — ১০৫টি MCQ সম্পূর্ণ ব্যাংক।`,
        sets: sets
    };
}

// 1. Parse Chapter 11
const ch11Data = parseMarkdownQuestionsAccurate(path.join(baseDir, 'c8_ch11_raw.md'), 11, 'আলো');
console.log('--- Chapter 11 Sets ---');
let total11 = 0;
ch11Data.sets.forEach(s => {
    console.log(`Set ${s.setNum}: ${s.questions.length} Qs`);
    total11 += s.questions.length;
});
console.log('Total Chapter 11 Questions:', total11);

if (total11 !== 105) {
    console.error('ERROR: Chapter 11 Total questions is not 105! Found:', total11);
    process.exit(1);
}

// 2. Parse Chapter 12
const ch12Data = parseMarkdownQuestionsAccurate(path.join(baseDir, 'c8_ch12_raw.md'), 12, 'মহাকাশ ও উপগ্রহ');
console.log('--- Chapter 12 Sets ---');
let total12 = 0;
ch12Data.sets.forEach(s => {
    console.log(`Set ${s.setNum}: ${s.questions.length} Qs`);
    total12 += s.questions.length;
});
console.log('Total Chapter 12 Questions:', total12);

if (total12 !== 105) {
    console.error('ERROR: Chapter 12 Total questions is not 105! Found:', total12);
    process.exit(1);
}

// 3. Generate class8_ch11.js & class8_ch12.js
const ch11Js = `// Class 8 Science Chapter 11 Board Standard Exam Bank (5 Sets, 105 MCQs)
window.CLASS8_EXAM_BANK = window.CLASS8_EXAM_BANK || {};
window.CLASS8_EXAM_BANK[11] = ${JSON.stringify(ch11Data, null, 2)};
`;
fs.writeFileSync(path.join(baseDir, 'data/exams/class8_ch11.js'), ch11Js, 'utf8');
fs.writeFileSync(path.join(baseDir, 'www/data/exams/class8_ch11.js'), ch11Js, 'utf8');
console.log('Written class8_ch11.js to data/exams/ and www/data/exams/');

const ch12Js = `// Class 8 Science Chapter 12 Board Standard Exam Bank (5 Sets, 105 MCQs)
window.CLASS8_EXAM_BANK = window.CLASS8_EXAM_BANK || {};
window.CLASS8_EXAM_BANK[12] = ${JSON.stringify(ch12Data, null, 2)};
`;
fs.writeFileSync(path.join(baseDir, 'data/exams/class8_ch12.js'), ch12Js, 'utf8');
fs.writeFileSync(path.join(baseDir, 'www/data/exams/class8_ch12.js'), ch12Js, 'utf8');
console.log('Written class8_ch12.js to data/exams/ and www/data/exams/');

// 4. Update js/class8-mcq-master-course.js & www/js/class8-mcq-master-course.js
['js/class8-mcq-master-course.js', 'www/js/class8-mcq-master-course.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    let c8MasterJs = fs.readFileSync(fullPath, 'utf8');
    
    // Update config
    c8MasterJs = c8MasterJs.replace('totalExams: 52,', 'totalExams: 62,');
    c8MasterJs = c8MasterJs.replace('totalQuestionsPool: 1050,', 'totalQuestionsPool: 1260,');

    // Update chapters array
    if (!c8MasterJs.includes("id: 'c8_c11'")) {
        c8MasterJs = c8MasterJs.replace(
            "{ num: 10, id: 'c8_c10', name: 'অম্ল, ক্ষারক ও লবণ', qCount: 105 }",
            "{ num: 10, id: 'c8_c10', name: 'অম্ল, ক্ষারক ও লবণ', qCount: 105 },\n            { num: 11, id: 'c8_c11', name: 'আলো', qCount: 105 },\n            { num: 12, id: 'c8_c12', name: 'মহাকাশ ও উপগ্রহ', qCount: 105 }"
        );
    }

    // Update chaps in getAllExamDefinitions
    if (!c8MasterJs.includes('num: 11, name: "আলো"')) {
        c8MasterJs = c8MasterJs.replace(
            '{ num: 10, name: "অম্ল, ক্ষারক ও লবণ" }',
            '{ num: 10, name: "অম্ল, ক্ষারক ও লবণ" },\n            { num: 11, name: "আলো" },\n            { num: 12, name: "মহাকাশ ও উপগ্রহ" }'
        );
    }

    // Update combined test
    c8MasterJs = c8MasterJs.replace(
        "title: 'অধ্যায় ১ থেকে ১০ সমন্বিত প্র্যাকটিস টেস্ট',\n            desc: 'প্রথম দশটি অধ্যায় থেকে নির্বাচিত ৬৫টি গুরুত্বপূর্ণ বোর্ড স্ট্যান্ডার্ড প্রশ্নের সমন্বিত পরীক্ষা।',\n            qCount: 65,\n            timeMinutes: 65,\n            fullMarks: 65,\n            difficulty: 'medium',\n            difficultyLabel: 'সমন্বিত মডেল টেস্ট',\n            category: 'সমন্বিত টেস্ট',\n            chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],",
        "title: 'অধ্যায় ১ থেকে ১২ সমন্বিত রিভিশন টেস্ট',\n            desc: 'প্রথম বারোটি অধ্যায় থেকে নির্বাচিত ৭৫টি গুরুত্বপূর্ণ বোর্ড স্ট্যান্ডার্ড প্রশ্নের সমন্বিত পরীক্ষা।',\n            qCount: 75,\n            timeMinutes: 75,\n            fullMarks: 75,\n            difficulty: 'medium',\n            difficultyLabel: 'সমন্বিত মডেল টেস্ট',\n            category: 'সমন্বিত টেস্ট',\n            chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],"
    );

    // Update final mock
    c8MasterJs = c8MasterJs.replace(
        "desc: '১০৫০টি প্রশ্নের সম্পূর্ণ পুল থেকে নির্বাচিত ৫০টি প্রশ্নের চূড়ান্ত মডেল টেস্ট।',\n            qCount: 50,\n            timeMinutes: 50,\n            fullMarks: 50,\n            difficulty: 'challenge',\n            difficultyLabel: 'গ্র্যান্ড ফাইনাল মক',\n            category: 'ফাইনাল মক',\n            chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],",
        "desc: '১২৬০টি প্রশ্নের সম্পূর্ণ পুল থেকে নির্বাচিত ৫০টি প্রশ্নের চূড়ান্ত মডেল টেস্ট।',\n            qCount: 50,\n            timeMinutes: 50,\n            fullMarks: 50,\n            difficulty: 'challenge',\n            difficultyLabel: 'গ্র্যান্ড ফাইনাল মক',\n            category: 'ফাইনাল মক',\n            chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],"
    );

    fs.writeFileSync(fullPath, c8MasterJs, 'utf8');
    console.log('Updated', file);
});

// 5. Update curriculum_data.js & www/curriculum_data.js
const c8_c11_obj = {
    "num": 11,
    "title": "অধ্যায় ১১: আলো",
    "tag": "Class 8 Science Chapter 11",
    "desc": "আলোর প্রতিসরণ ও প্রতিসরণের নিয়ম; সংকট কোণ ও পূর্ণ অভ্যন্তরীণ প্রতিফলন; অপটিক্যাল ফাইবার ও এর প্রয়োগ; বিবর্ধক কাঁচ বা ম্যাগনিফাইং গ্লাস; মানব চোখের গঠন ও ক্রিয়া এবং ক্যামেরার সাথে চোখের তুলনা।",
    "summary": "আলোক রশ্মি এক স্বচ্ছ মাধ্যম থেকে অন্য স্বচ্ছ মাধ্যমে তির্যকভাবে প্রবেশ করলে বিভেদ তলে এর দিক পরিবর্তিত হয়, একে আলোর প্রতিসরণ বলে। আলো হালকা থেকে ঘন মাধ্যমে গেলে অভিলম্বের দিকে বেঁকে যায় (i > r); আর ঘন থেকে হালকা মাধ্যমে গেলে অভিলম্ব থেকে দূরে সরে যায় (i < r)। ঘন মাধ্যম থেকে হালকা মাধ্যমে প্রতিসরণের সময় যে আপতন কোণের জন্য প্রতিসরণ কোণ ৯০° হয় তাকে সংকট কোণ (Critical Angle) বলে। আপতন কোণ সংকট কোণের চেয়ে বড় হলে আলো প্রতিসরিত না হয়ে সম্পূর্ণ বিভেদ তলে প্রতিফলিত হয়ে একই মাধ্যমে ফিরে আসে, একে পূর্ণ অভ্যন্তরীণ প্রতিফলন বলে। অপটিক্যাল ফাইবার হলো অত্যন্ত সূক্ষ্ম কাঁচতন্তু যেখানে আলোর বারবার পূর্ণ অভ্যন্তরীণ প্রতিফলনকে কাজে লাগিয়ে সংকেত ও অভ্যন্তরীণ অঙ্গের ছবি দেখা যায়। মানব চোখ ক্যামেরার মতো কাজ করে; এতে কর্নিয়া, আইরিস, তারারন্ধ্র, উত্তল চক্ষু লেন্স ও রেটিনা থাকে যেখানে বাস্তব, উল্টা ও খাটো প্রতিবিম্ব গঠিত হয়।",
    "highlights": [
        "আলোর প্রতিসরণে আপতিত রশ্মি, প্রতিসরিত রশ্মি ও অভিলম্ব একই সমতলে থাকে।",
        "হালকা থেকে ঘন মাধ্যমে $i > r$; ঘন থেকে হালকা মাধ্যমে $i < r$; অভিলম্ব বরাবর আলো গেলে $i = r = 0$।",
        "সংকট কোণে প্রতিসরিত রশ্মি বিভেদ তল ঘেঁষে চলে যায় ($r = 90^\\circ$)।",
        "পূর্ণ অভ্যন্তরীণ প্রতিফলনের দুটি শর্ত: ১) আলো ঘন থেকে হালকা মাধ্যমে যাবে, ২) আপতন কোণ সংকট কোণের চেয়ে বড় হবে।",
        "অপটিক্যাল ফাইবারে আলোর পূর্ণ অভ্যন্তরীণ প্রতিফলনকে কাজে লাগিয়ে এন্ডোস্কোপি ও দ্রুতগতির ডেটা ট্রান্সমিশন করা হয়।",
        "বিবর্ধক কাঁচ স্বল্প ফোকাস দূরত্বের উত্তল লেন্স যাতে সোজা, বিবর্ধিত ও অবাস্তব প্রতিবিম্ব গঠিত হয়।",
        "চোখের রেটিনায় ও ক্যামেরার আলোকগ্রাহী প্লেটে বাস্তব, উল্টা ও খাটো প্রতিবিম্ব তৈরি হয়।"
    ],
    "definitions": [
        { "term": "আলোর প্রতিসরণ (Refraction of Light)", "desc": "এক স্বচ্ছ মাধ্যম থেকে অন্য স্বচ্ছ মাধ্যমে তির্যকভাবে প্রবেশকালে আলোক রশ্মির দিক পরিবর্তনের ঘটনা।" },
        { "term": "সংকট কোণ (Critical Angle)", "desc": "ঘন মাধ্যমে যে আপতন কোণের জন্য হালকা মাধ্যমে প্রতিসরণ কোণের মান ৯০° হয়।" },
        { "term": "পূর্ণ অভ্যন্তরীণ প্রতিফলন (Total Internal Reflection)", "desc": "ঘন মাধ্যমে আপতন কোণ সংকট কোণের চেয়ে বড় হলে আলো প্রতিসরিত না হয়ে সম্পূর্ণরূপে পূর্বের মাধ্যমে প্রতিফলিত হওয়ার ঘটনা।" },
        { "term": "অপটিক্যাল ফাইবার (Optical Fiber)", "desc": "মানুষের চুলের মতো সূক্ষ্ম ও নমনীয় কাঁচতন্তু যা পূর্ণ অভ্যন্তরীণ প্রতিফলনের নীতিতে আলো ও ডেটা পরিবহন করে।" },
        { "term": "রেটিনা (Retina)", "desc": "অক্ষিগোলকের পিছনে অবস্থিত আলোকগ্রাহী পর্দা যাতে লক্ষ্যবস্তুর বাস্তব ও উল্টা প্রতিবিম্ব গঠিত হয়।" }
    ],
    "formulas": [
        { "tag": "সংকট কোণ শর্ত", "expr": "r = 90^\\circ \\quad \\text{যখন } i = \\theta_c", "note": "প্রতিসরিত রশ্মি বিভেদ তল বরাবর যায়।" },
        { "tag": "পূর্ণ অভ্যন্তরীণ প্রতিফলন শর্ত", "expr": "i > \\theta_c", "note": "ঘন মাধ্যম হতে হালকা মাধ্যমে গমনকালে।" }
    ]
};

const c8_c12_obj = {
    "num": 12,
    "title": "অধ্যায় ১২: মহাকাশ ও উপগ্রহ",
    "tag": "Class 8 Science Chapter 12",
    "desc": "মহাবিশ্ব ও মহাকাশের ধারণা; নক্ষত্র, গ্যালাক্সি ও মিল্কিওয়ে; বিগব্যাং বা মহাবিস্ফোরণ তত্ত্ব; সৌরজগতের গ্রহ ও প্রাকৃতিক উপগ্রহসমূহ; কৃত্রিম উপগ্রহের ইতিহাস, কক্ষপথে ঘূর্ণনের মূলনীতি এবং যোগাযোগ, আবহাওয়া ও গবেষণায় এর ব্যবহার।",
    "summary": "গ্রহ, নক্ষত্র, ছায়াপথ ও গ্যালাক্সির মধ্যবর্তী ফাঁকা স্থানকে মহাকাশ বলে, যা পৃথিবী থেকে প্রায় ১৬০ কিমি উচ্চতা থেকে শুরু হয়। দেখা না দেখা সবকিছু নিয়ে আমাদের মহাবিশ্ব। আলো প্রতি সেকেন্ডে প্রায় ৩ লক্ষ কিমি বেগে চলে; সূর্য থেকে পৃথিবীতে আলো আসতে ৮ মিনিট ২০ সেকেন্ড এবং নিকটবর্তী নক্ষত্র আলফা সেন্টোরিতে পৌঁছাতে ৪ বছরের বেশি সময় লাগে। প্রায় ১৩.৭৫ বিলিয়ন বছর পূর্বে সংঘটিত মহাবিস্ফোরণ বা 'বিগব্যাং' এর মাধ্যমে অত্যন্ত উত্তপ্ত ও ঘন বিন্দু থেকে মহাবিশ্বের সূচনা হয়। সৌরজগতে সূর্যের চারদিকে ৮টি গ্রহ ঘোরে। পৃথিবীর একমাত্র প্রাকৃতিক উপগ্রহ চাঁদ। ১৯৫৭ সালের ৪ঠা অক্টোবর সোভিয়েত ইউনিয়ন প্রথম কৃত্রিম উপগ্রহ 'স্পুটনিক-১' উৎক্ষেপণ করে। কৃত্রিম উপগ্রহকে ভূপৃষ্ঠ থেকে প্রায় ২৫০ কিমি উপরে তুলে অনুভূমিকভাবে প্রতি সেকেন্ডে প্রায় ৮ কিমি বেগ দিলে পৃথিবীর অভিকর্ষ বল কেন্দ্রমুখী বল জুগিয়ে একে কক্ষপথে অবিরাম ঘুরিয়ে রাখে। ২৪ ঘণ্টায় একবার আবর্তনকারী উপগ্রহকে ভূ-স্থির (Geostationary) বলা হয় যা যোগাযোগ উপগ্রহ হিসেবে কার্যকর।",
    "highlights": [
        "পৃথিবী থেকে প্রায় ১৬০ কিলোমিটার উচ্চতায় বায়ুমণ্ডলের সমাপ্তি এবং মহাকাশের সূচনা ধরা হয়।",
        "আলোর দ্রুতি প্রায় ৩ লক্ষ কিলোমিটার/সেকেন্ড; সূর্য ও পৃথিবীর গড় দূরত্ব প্রায় ১৫ কোটি কিলোমিটার।",
        "বিগব্যাং বা মহাবিস্ফোরণ প্রায় ১৩.৭৫ বিলিয়ন (১৩৭৫ কোটি) বছর পূর্বে সংঘটিত হয়েছিল।",
        "বৃহস্পতির ৬৯টি, শনির ৬২টি, ইউরেনাসের ২৭টি, নেপচুনের ১৪টি, মঙ্গলের ২টি এবং পৃথিবীর ১টি প্রাকৃতিক উপগ্রহ রয়েছে।",
        "১৯৫৭ সালের ৪ঠা অক্টোবর স্পুটনিক-১ উৎক্ষেপণের মাধ্যমে মানবজাতির মহাকাশযাত্রার সূচনা হয়।",
        "১৯৬১ সালের ১২ই এপ্রিল প্রথম মানুষ হিসেবে ইউরি গ্যাগারিন ভস্টক-১ মহাকাশযানে চড়ে পৃথিবীকে প্রদক্ষিণ করেন।",
        "কৃত্রিম উপগ্রহকে কক্ষপথে রাখতে প্রয়োজনীয় কেন্দ্রমুখী বল পৃথিবীর অভিকর্ষ বল দ্বারা সরবরাহ করা হয়।",
        "উপগ্রহগুলো যোগাযোগ, আবহাওয়ার পূর্বাভাস, নৌ-পরিবহন (GPS), পৃথিবী পর্যবেক্ষণ ও জ্যোতির্বিদ্যা গবেষণায় ব্যবহৃত হয়।"
    ],
    "definitions": [
        { "term": "মহাকাশ (Outer Space)", "desc": "গ্রহ, নক্ষত্র, গ্যালাক্সি ইত্যাদির মধ্যবর্তী অসীম ফাঁকা জায়গা যেখানে কোনো বাতাস বা পদার্থ নেই।" },
        { "term": "মহাবিশ্ব (Universe)", "desc": "ক্ষুদ্রাতিক্ষুদ্র ধূলিকণা থেকে শুরু করে গ্রহ, নক্ষত্র, গ্যালাক্সি ও মহাশূন্যসহ সামগ্রিক সৃষ্টিজগৎ।" },
        { "term": "বিগব্যাং তত্ত্ব (Big Bang Theory)", "desc": "মহাবিশ্বের সৃষ্টি ও প্রসারণ সংক্রান্ত সর্বাধিক গ্রহণযোগ্য মহাবিস্ফোরণ তত্ত্ব।" },
        { "term": "কৃত্রিম উপগ্রহ (Artificial Satellite)", "desc": "মানুষের তৈরি রকেট বা মহাকাশযান যা পৃথিবীর চারপাশে নির্দিষ্ট কক্ষপথে প্রদক্ষিণ করে প্রয়োজনীয় তথ্য সরবরাহ করে।" },
        { "term": "ভূ-স্থির উপগ্রহ (Geostationary Satellite)", "desc": "যে উপগ্রহের পর্যায়কাল পৃথিবীর আহ্নিক গতির সমান (২৪ ঘণ্টা), ফলে পৃথিবী থেকে একে সর্বদা স্থির মনে হয়।" }
    ],
    "formulas": [
        { "tag": "আলোর অতিক্রান্ত দূরত্ব", "expr": "d = c \\times t", "note": "c \\approx 3 \\times 10^5 \\text{ km/s}." },
        { "tag": "উপগ্রহের অনুভূমিক বেগ", "expr": "v \\approx 8 \\text{ km/s}", "note": "ভূপৃষ্ঠ থেকে প্রায় ২৫০ কিমি উচ্চতায় কক্ষপথীয় বেগ।" }
    ]
};

['curriculum_data.js', 'www/curriculum_data.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    
    if (!content.includes('"c8_c11"')) {
        const insertion11 = '    "c8_c11": ' + JSON.stringify(c8_c11_obj, null, 8).replace(/^/gm, '    ').trim() + ',\n';
        content = content.replace('"hsc2_c1":', insertion11 + '    "hsc2_c1":');
    }
    if (!content.includes('"c8_c12"')) {
        const insertion12 = '    "c8_c12": ' + JSON.stringify(c8_c12_obj, null, 8).replace(/^/gm, '    ').trim() + ',\n';
        content = content.replace('"hsc2_c1":', insertion12 + '    "hsc2_c1":');
    }
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Updated', file);
});

// 6. Update study.html & www/study.html
['study.html', 'www/study.html'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // add scripts
    if (!content.includes('class8_ch11.js')) {
        content = content.replace('<script src="data/exams/class8_ch10.js"></script>',
            '<script src="data/exams/class8_ch10.js"></script>\n    <script src="data/exams/class8_ch11.js"></script>\n    <script src="data/exams/class8_ch12.js"></script>'
        );
    }
    
    // update modal text
    content = content.replace('১ম থেকে ১০ম অধ্যায়ের ১০৫০টি স্পেশাল প্রশ্ন, ৫২টি ওএমআর পরীক্ষা', '১ম থেকে ১২শ অধ্যায়ের ১২৬০টি স্পেশাল প্রশ্ন, ৬২টি ওএমআর পরীক্ষা');
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Updated', file);
});

console.log('All updates complete for Chapter 11 and Chapter 12!');
