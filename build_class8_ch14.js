const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/HP/.gemini/antigravity/scratch/al-amin-physics';

function parseMarkdownQuestionsAccurate(filePath, chapNum, chapName) {
    const mdText = fs.readFileSync(filePath, 'utf8');
    const lines = mdText.split(/\r?\n/);

    const sets = [
        { id: "set1", setNum: 1, title: "সেট ০১: সহজ (বাস্তুতন্ত্রের উপাদান ও উৎপাদক • ফ্রি ট্রায়াল)", difficulty: "সহজ", difficultyLevel: "easy", badgeColor: "emerald", qCount: 15, timeMinutes: 15, fullMarks: 15, isFree: true, desc: "বাস্তুতন্ত্রের সংজ্ঞা, অজীব ও জীব উপাদান, উৎপাদক ও খাদক শ্রেণিবিভাগের মৌলিক ধারণা।", questions: [] },
        { id: "set2", setNum: 2, title: "সেট ০২: সহজ-মাঝারি (খাদক স্তর, বিয়োজক ও ম্যানগ্রোভ বন)", difficulty: "সহজ-মাঝারি", difficultyLevel: "easy-medium", badgeColor: "blue", qCount: 15, timeMinutes: 15, fullMarks: 15, isFree: false, desc: "তৃণভোজী, মাংসাশী ও সর্বভুক খাদক, বিয়োজক এবং সুন্দরবনের ম্যানগ্রোভ বৈশিষ্ট্য ও শ্বাসমূল।", questions: [] },
        { id: "set3", setNum: 3, title: "সেট ০৩: বোর্ড স্ট্যান্ডার্ড (জলজ বাস্তুতন্ত্র, খাদ্যশৃঙ্খল ও খাদ্যজাল)", difficulty: "মাঝারি", difficultyLevel: "medium", badgeColor: "indigo", qCount: 25, timeMinutes: 25, fullMarks: 25, isFree: false, desc: "পুকুরের স্বয়ংসম্পূর্ণ বাস্তুসংস্থান, ফাইটোপ্ল্যাংকটন, জু-প্ল্যাংকটন, খাদ্যশৃঙ্খল ও খাদ্যজাল।", questions: [] },
        { id: "set4", setNum: 4, title: "সেট ০৪: কঠিন (উদ্দীপকভিত্তিক বাস্তুতন্ত্র, ট্রফিক লেভেল ও ভারসাম্য)", difficulty: "কঠিন", difficultyLevel: "hard", badgeColor: "purple", qCount: 25, timeMinutes: 25, fullMarks: 25, isFree: false, desc: "সুন্দরবন ও পুকুরের উদ্দীপকভিত্তিক প্রশ্ন, শক্তির একমুখী প্রবাহ এবং জীবসংখ্যার প্রাকৃতিক ভারসাম্য।", questions: [] },
        { id: "set5", setNum: 5, title: "সেট ০৫: চ্যালেঞ্জ (শক্তি ও পুষ্টিপ্রবাহ, চক্রাকার আবর্তন ও সৃজনশীল)", difficulty: "চ্যালেঞ্জ", difficultyLevel: "challenge", badgeColor: "amber", qCount: 25, timeMinutes: 25, fullMarks: 25, isFree: false, desc: "সৌরশক্তির রাসায়নিক রূপান্তর, তাপহ্রাস, পুষ্টির চক্রাকার আবর্তন এবং জটিল বোর্ড বহুপদী প্রশ্ন।", questions: [] }
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
            let qId = `C8-CH14-S${currentSetIdx + 1}-${qMatch[2].padStart(2, '0')}`;
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

    const padChap = String(chapNum).padStart(2, '0');
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

// 1. Parse Chapter 14
const ch14Data = parseMarkdownQuestionsAccurate(path.join(baseDir, 'c8_ch14_raw.md'), 14, 'পরিবেশ এবং বাস্তুতন্ত্র');
console.log('--- Chapter 14 Sets ---');
let total14 = 0;
ch14Data.sets.forEach(s => {
    console.log(`Set ${s.setNum}: ${s.questions.length} Qs`);
    total14 += s.questions.length;
});
console.log('Total Chapter 14 Questions:', total14);

if (total14 !== 105) {
    console.error('ERROR: Chapter 14 Total questions is not 105! Found:', total14);
    process.exit(1);
}

// 2. Generate class8_ch14.js
const ch14Js = `// Class 8 Science Chapter 14 Board Standard Exam Bank (5 Sets, 105 MCQs)
window.CLASS8_EXAM_BANK = window.CLASS8_EXAM_BANK || {};
window.CLASS8_EXAM_BANK[14] = ${JSON.stringify(ch14Data, null, 2)};
`;
fs.writeFileSync(path.join(baseDir, 'data/exams/class8_ch14.js'), ch14Js, 'utf8');
fs.writeFileSync(path.join(baseDir, 'www/data/exams/class8_ch14.js'), ch14Js, 'utf8');
console.log('Written class8_ch14.js to data/exams/ and www/data/exams/');

// 3. Update js/class8-mcq-master-course.js & www/js/class8-mcq-master-course.js
['js/class8-mcq-master-course.js', 'www/js/class8-mcq-master-course.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    let c8MasterJs = fs.readFileSync(fullPath, 'utf8');
    
    // Update config
    c8MasterJs = c8MasterJs.replace('totalExams: 67,', 'totalExams: 72,');
    c8MasterJs = c8MasterJs.replace('totalQuestionsPool: 1365,', 'totalQuestionsPool: 1470,');

    // Update chapters array
    if (!c8MasterJs.includes("id: 'c8_c14'")) {
        c8MasterJs = c8MasterJs.replace(
            "{ num: 13, id: 'c8_c13', name: 'খাদ্য ও পুষ্টি', qCount: 105 }",
            "{ num: 13, id: 'c8_c13', name: 'খাদ্য ও পুষ্টি', qCount: 105 },\n            { num: 14, id: 'c8_c14', name: 'পরিবেশ এবং বাস্তুতন্ত্র', qCount: 105 }"
        );
    }

    // Update chaps in getAllExamDefinitions
    if (!c8MasterJs.includes('num: 14, name: "পরিবেশ এবং বাস্তুতন্ত্র"')) {
        c8MasterJs = c8MasterJs.replace(
            '{ num: 13, name: "খাদ্য ও পুষ্টি" }',
            '{ num: 13, name: "খাদ্য ও পুষ্টি" },\n            { num: 14, name: "পরিবেশ এবং বাস্তুতন্ত্র" }'
        );
    }

    // Update combined test
    c8MasterJs = c8MasterJs.replace(
        "title: 'অধ্যায় ১ থেকে ১৩ সমন্বিত রিভিশন টেস্ট',\n            desc: 'প্রথম তেরোটি অধ্যায় থেকে নির্বাচিত ৮০টি গুরুত্বপূর্ণ বোর্ড স্ট্যান্ডার্ড প্রশ্নের সমন্বিত পরীক্ষা।',\n            qCount: 80,\n            timeMinutes: 80,\n            fullMarks: 80,\n            difficulty: 'medium',\n            difficultyLabel: 'সমন্বিত মডেল টেস্ট',\n            category: 'সমন্বিত টেস্ট',\n            chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],",
        "title: 'অধ্যায় ১ থেকে ১৪ সম্পূর্ণ সিলেবাস সমন্বিত টেস্ট',\n            desc: 'ক্লাস ৮ বিজ্ঞানের সম্পূর্ণ ১৪টি অধ্যায় থেকে নির্বাচিত ৮৫টি গুরুত্বপূর্ণ বোর্ড স্ট্যান্ডার্ড প্রশ্নের পূর্ণাঙ্গ পরীক্ষা।',\n            qCount: 85,\n            timeMinutes: 85,\n            fullMarks: 85,\n            difficulty: 'medium',\n            difficultyLabel: 'সমন্বিত মডেল টেস্ট',\n            category: 'সমন্বিত টেস্ট',\n            chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],"
    );

    // Update final mock
    c8MasterJs = c8MasterJs.replace(
        "desc: '১৩৬৫টি প্রশ্নের সম্পূর্ণ পুল থেকে নির্বাচিত ৫০টি প্রশ্নের চূড়ান্ত মডেল টেস্ট।',\n            qCount: 50,\n            timeMinutes: 50,\n            fullMarks: 50,\n            difficulty: 'challenge',\n            difficultyLabel: 'গ্র্যান্ড ফাইনাল মক',\n            category: 'ফাইনাল মক',\n            chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],",
        "desc: '১৪৭০টি প্রশ্নের সম্পূর্ণ পুল থেকে নির্বাচিত ৫০টি প্রশ্নের চূড়ান্ত মডেল টেস্ট।',\n            qCount: 50,\n            timeMinutes: 50,\n            fullMarks: 50,\n            difficulty: 'challenge',\n            difficultyLabel: 'গ্র্যান্ড ফাইনাল মক',\n            category: 'ফাইনাল মক',\n            chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],"
    );

    fs.writeFileSync(fullPath, c8MasterJs, 'utf8');
    console.log('Updated', file);
});

// 4. Update curriculum_data.js & www/curriculum_data.js
const c8_c14_obj = {
    "num": 14,
    "title": "অধ্যায় ১৪: পরিবেশ এবং বাস্তুতন্ত্র",
    "tag": "Class 8 Science Chapter 14",
    "desc": "বাস্তুতন্ত্রের মৌলিক ধারণা, অজীব (অজৈব ও জৈব) ও জীব উপাদান (উৎপাদক, প্রথম/দ্বিতীয়/তৃতীয় স্তরের খাদক ও বিয়োজক); স্থলজ বাস্তুতন্ত্র ও ম্যানগ্রোভ বনের বৈশিষ্ট্য; জলজ বাস্তুতন্ত্র (পুকুরের স্বয়ংসম্পূর্ণ বাস্তুসংস্থান); খাদ্যশৃঙ্খল ও খাদ্যজাল; পুষ্টিপ্রবাহ ও শক্তিপ্রবাহের মূলনীতি এবং বাস্তুতন্ত্রের প্রাকৃতিক ভারসাম্য।",
    "summary": "কোনো একটি পরিবেশের অজীব এবং জীব উপাদানসমূহের মধ্যে পারস্পরিক ক্রিয়া, আদান-প্রদান ইত্যাদির মাধ্যমে যে কার্যপ্রণালী গড়ে ওঠে তাকে বাস্তুতন্ত্র বা বাস্তুসংস্থান (Ecosystem) বলে। বাস্তুতন্ত্রের প্রধান দুটি উপাদান হলো অজীব এবং জীব উপাদান। অজীব উপাদান অজৈব (মাটি, পানি, আলো, বাতাস, আর্দ্রতা ইত্যাদি) ও জৈব উপাদান (মৃত ও গলিত দেহাবশেষ) নিয়ে গঠিত। জীব উপাদানকে ৩ ভাগে ভাগ করা হয়: উৎপাদক (সবুজ উদ্ভিদ, যা সৌরশক্তি কাজে লাগিয়ে সালোকসংশ্লেষণের মাধ্যমে খাদ্য তৈরি করে), খাদক (প্রথম স্তরের বা তৃণভোজী, দ্বিতীয় স্তরের, তৃতীয় স্তরের ও সর্বভুক) এবং বিয়োজক বা পচনকারী (ব্যাকটেরিয়া ও ছত্রাক, যা মৃতদেহ পচিয়ে অজৈব পুষ্টি পরিবেশে ফিরিয়ে দেয়)। সুন্দরবনের ম্যানগ্রোভ উদ্ভিদে লবণাক্ত মাটিতে শ্বসনের জন্য খাড়া শ্বাসমূল (Pneumatophores) থাকে। খাদ্যশৃঙ্খলে পুষ্টির প্রবাহ চক্রাকারে ঘটে কিন্তু শক্তির প্রবাহ সর্বদা একমুখী; প্রতিটি ট্রফিক স্তরে শ্বসনের ফলে তাপশক্তি অপচয় হয় এবং খাদ্যশৃঙ্খলের উচ্চ স্তরে মোট প্রাপ্য শক্তি হ্রাস পায়।",
    "highlights": [
        "বাস্তুতন্ত্রের প্রধান দুটি উপাদান: অজীব (প্রাণহীন ভৌত ও জৈব পদার্থ) এবং জীব উপাদান।",
        "সবুজ উদ্ভিদ সালোকসংশ্লেষণের মাধ্যমে সৌরশক্তিকে রাসায়নিক শক্তিতে রূপান্তরকারী একমাত্র উৎপাদক।",
        "উৎপাদক সূর্যের আলোর মাত্র শতকরা ২ ভাগ কাজে লাগিয়ে খাদ্য উৎপাদন করে।",
        "খাদকদের মধ্যে তৃণভোজী (১ম স্তর), মাংসাশী (২য় ও ৩য় স্তর) এবং সর্বভুক (যেমন মানুষ ও শূকর) বিদ্যমান।",
        "বিয়োজক (ব্যাকটেরিয়া ও ছত্রাক) মৃতদেহ বিয়োজিত করে পুষ্টি উপাদান মাটি ও বায়ুতে ফিরিয়ে দিয়ে চক্র সচল রাখে।",
        "সুন্দরবনের কর্দমাক্ত লবণাক্ত মাটিতে শ্বাসগ্রহণের জন্য উদ্ভিদের মূলে সূক্ষ্ম ছিদ্রযুক্ত শ্বাসমূল গঠিত হয়।",
        "পুকুরের বাস্তুতন্ত্র একটি স্বয়ংসম্পূর্ণ জলজ বাস্তুসংস্থানের উৎকৃষ্ট উদাহরণ (ফাইটোপ্ল্যাংকটন উৎপাদক, জু-প্ল্যাংকটন ১ম স্তরের খাদক)।",
        "বাস্তুতন্ত্রে শক্তির প্রবাহ সর্বদা একমুখী এবং পুষ্টিদ্রব্যের প্রবাহ চক্রাকার।"
    ],
    "definitions": [
        { "term": "বাস্তুতন্ত্র (Ecosystem)", "desc": "যেকোনো পরিবেশের জীব ও অজীব উপাদানসমূহের মধ্যে পারস্পরিক মিথস্ক্রিয়া ও আদান-প্রদানের মাধ্যমে গড়ে ওঠা সমন্বিত জীবতান্ত্রিক একক।" },
        { "term": "উৎপাদক (Producers)", "desc": "সূর্যের আলোর উপস্থিতিতে সালোকসংশ্লেষণ প্রক্রিয়ায় নিজের খাদ্য নিজে তৈরি করতে সক্ষম সবুজ উদ্ভিদ বা ফাইটোপ্ল্যাংকটন।" },
        { "term": "খাদ্যশৃঙ্খল (Food Chain)", "desc": "উদ্ভিদ উৎস থেকে শুরু করে ধারাবাহিক খাদ্য-খাদক সম্পর্কের মাধ্যমে জীবের মধ্যে শক্তির একমুখী স্থানান্তরের শৃঙ্খল।" },
        { "term": "খাদ্যজাল (Food Web)", "desc": "একটি বাস্তুতন্ত্রে একাধিক খাদ্যশৃঙ্খল পরস্পর সংযুক্ত হয়ে যে জটিল জালিকাকার কাঠামো তৈরি করে।" },
        { "term": "শ্বাসমূল (Pneumatophores)", "desc": "ম্যানগ্রোভ উদ্ভিদের কর্দমাক্ত ও জলাবদ্ধ মাটি ভেদ করে খাড়াভাবে উপরে উঠে আসা বিশেষ মূল, যার ছিদ্র দিয়ে উদ্ভিদ সরাসরি বাতাস থেকে অক্সিজেন গ্রহণ করে।" }
    ],
    "formulas": [
        { "tag": "সালোকসংশ্লেষণে সৌরশক্তি রূপান্তর", "expr": "\\text{সূর্যের আলো (২\\%)} + 6\\text{CO}_2 + 12\\text{H}_2\\text{O} \\xrightarrow{\\text{ক্লোরোফিল}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 + 6\\text{H}_2\\text{O}", "note": "সৌরশক্তি রাসায়নিক স্থিতিশক্তিতে রূপান্তরিত হয়।" },
        { "tag": "শক্তিপ্রবাহ নীতি", "expr": "E_{\\text{প্রবাহ}} \\text{ (একমুখী)}, \\quad \\text{পুষ্টি}_{\\text{প্রবাহ}} \\text{ (চক্রাকার)}", "note": "প্রতিটি ট্রফিক ধাপে শক্তি তাপ হিসেবে ক্ষয়প্রাপ্ত হয়।" }
    ]
};

['curriculum_data.js', 'www/curriculum_data.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    
    if (!content.includes('"c8_c14"')) {
        const insertion14 = '    "c8_c14": ' + JSON.stringify(c8_c14_obj, null, 8).replace(/^/gm, '    ').trim() + ',\n';
        content = content.replace('"hsc2_c1":', insertion14 + '    "hsc2_c1":');
    }
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Updated', file);
});

// 5. Update app.js & www/app.js
['app.js', 'www/app.js'].forEach(f => {
  const p = path.join(baseDir, f);
  let c = fs.readFileSync(p, 'utf8');
  if (!c.includes('c8_c14')) {
    const target = 'id: "c8_c13"';
    const idx = c.indexOf(target);
    if (idx !== -1) {
      const closeBraceIdx = c.indexOf('}', idx);
      const before = c.substring(0, closeBraceIdx + 1);
      const after = c.substring(closeBraceIdx + 1);
      const itemToAdd = ',\n            {\n                id: "c8_c14", num: 14,\n                title: "অধ্যায় ১৪: পরিবেশ এবং বাস্তুতন্ত্র",\n                desc:  "বাস্তুতন্ত্রের উপাদান, সুন্দরবন ও পুকুরের বাস্তুসংস্থান, খাদ্যশৃঙ্খল, খাদ্যজাল ও পুষ্টিপ্রবাহ।"\n            }';
      c = before + itemToAdd + after;
      fs.writeFileSync(p, c, 'utf8');
      console.log('Successfully updated', f);
    }
  }
});

// 6. Update study.html & www/study.html
['study.html', 'www/study.html'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // add scripts
    if (!content.includes('class8_ch14.js')) {
        content = content.replace('<script src="data/exams/class8_ch13.js"></script>',
            '<script src="data/exams/class8_ch13.js"></script>\n    <script src="data/exams/class8_ch14.js"></script>'
        );
    }
    
    // update modal text
    content = content.replace('১ম থেকে ১৩শ অধ্যায়ের ১৩৬৫টি স্পেশাল প্রশ্ন, ৬৭টি ওএমআর পরীক্ষা', '১ম থেকে ১৪শ অধ্যায়ের ১৪৭০টি স্পেশাল প্রশ্ন, ৭২টি ওএমআর পরীক্ষা');
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Updated', file);
});

console.log('All updates complete for Chapter 14!');
