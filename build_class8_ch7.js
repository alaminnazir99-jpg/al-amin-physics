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

        // Check Question header: **1.1. মহাবিশ্বের প্রতিটি বস্তু...**
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
            let qId = `C8-CH07-S${currentSetIdx + 1}-${qMatch[2].padStart(2, '0')}`;
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
        description: `অষ্টম শ্রেণি বিজ্ঞান অধ্যায় ০${chapNum}: ${chapName} — ১০৫টি MCQ সম্পূর্ণ ব্যাংক।`,
        sets: sets
    };
}

// 1. Parse Chapter 7
const ch7Data = parseMarkdownQuestionsAccurate(path.join(baseDir, 'c8_ch7_raw.md'), 7, 'পৃথিবী ও মহাকর্ষ');
console.log('--- Chapter 7 Sets ---');
let total = 0;
ch7Data.sets.forEach(s => {
    console.log(`Set ${s.setNum}: ${s.questions.length} Qs`);
    total += s.questions.length;
});
console.log('Total Chapter 7 Questions:', total);

if (total !== 105) {
    console.error('ERROR: Total questions is not 105!');
    process.exit(1);
}

// 2. Generate class8_ch7.js and write to data/exams/ and www/data/exams/
const fileHeader = `// Class 8 Science Chapter 07 Board Standard Exam Bank (5 Sets, 105 MCQs)
window.CLASS8_EXAM_BANK = window.CLASS8_EXAM_BANK || {};
window.CLASS8_EXAM_BANK[7] = ${JSON.stringify(ch7Data, null, 2)};
`;

fs.writeFileSync(path.join(baseDir, 'data/exams/class8_ch7.js'), fileHeader, 'utf8');
fs.writeFileSync(path.join(baseDir, 'www/data/exams/class8_ch7.js'), fileHeader, 'utf8');
console.log('Written data/exams/class8_ch7.js and www/data/exams/class8_ch7.js!');

// 3. Update js/class8-mcq-master-course.js & www/js/class8-mcq-master-course.js
let c8MasterJs = fs.readFileSync(path.join(baseDir, 'js/class8-mcq-master-course.js'), 'utf8');
// Update config
c8MasterJs = c8MasterJs.replace('totalExams: 32,', 'totalExams: 37,');
c8MasterJs = c8MasterJs.replace('totalQuestionsPool: 630,', 'totalQuestionsPool: 735,');

// Update chapters array
if (!c8MasterJs.includes("id: 'c8_c7'")) {
    c8MasterJs = c8MasterJs.replace(
        "{ num: 6, id: 'c8_c6', name: 'পরমাণুর গঠন', qCount: 105 }",
        "{ num: 6, id: 'c8_c6', name: 'পরমাণুর গঠন', qCount: 105 },\n            { num: 7, id: 'c8_c7', name: 'পৃথিবী ও মহাকর্ষ', qCount: 105 }"
    );
}

// Update chaps in getAllExamDefinitions
if (!c8MasterJs.includes('num: 7, name: "পৃথিবী ও মহাকর্ষ"')) {
    c8MasterJs = c8MasterJs.replace(
        '{ num: 6, name: "পরমাণুর গঠন" }',
        '{ num: 6, name: "পরমাণুর গঠন" },\n            { num: 7, name: "পৃথিবী ও মহাকর্ষ" }'
    );
}

// Update combined test
c8MasterJs = c8MasterJs.replace(
    "title: 'অধ্যায় ১ থেকে ৬ সমন্বিত রিভিশন টেস্ট',\n            desc: 'প্রথম ছয়টি অধ্যায় থেকে নির্বাচিত ৪৫টি গুরুত্বপূর্ণ বোর্ড স্ট্যান্ডার্ড প্রশ্নের সমন্বিত পরীক্ষা।',\n            qCount: 45,\n            timeMinutes: 45,\n            fullMarks: 45,\n            difficulty: 'medium',\n            difficultyLabel: 'সমন্বিত মডেল টেস্ট',\n            category: 'সমন্বিত টেস্ট',\n            chapters: [1, 2, 3, 4, 5, 6],",
    "title: 'অধ্যায় ১ থেকে ৭ সমন্বিত হাফ-বুক টেস্ট',\n            desc: 'প্রথম সাতটি অধ্যায় থেকে নির্বাচিত ৫০টি গুরুত্বপূর্ণ বোর্ড স্ট্যান্ডার্ড প্রশ্নের সমন্বিত পরীক্ষা।',\n            qCount: 50,\n            timeMinutes: 50,\n            fullMarks: 50,\n            difficulty: 'medium',\n            difficultyLabel: 'সমন্বিত মডেল টেস্ট',\n            category: 'সমন্বিত টেস্ট',\n            chapters: [1, 2, 3, 4, 5, 6, 7],"
);

// Update final mock
c8MasterJs = c8MasterJs.replace(
    "desc: '৬৩০টি প্রশ্নের সম্পূর্ণ পুল থেকে নির্বাচিত ৫০টি প্রশ্নের চূড়ান্ত মডেল টেস্ট।',\n            qCount: 50,\n            timeMinutes: 50,\n            fullMarks: 50,\n            difficulty: 'challenge',\n            difficultyLabel: 'গ্র্যান্ড ফাইনাল মক',\n            category: 'ফাইনাল মক',\n            chapters: [1, 2, 3, 4, 5, 6],",
    "desc: '৭৩৫টি প্রশ্নের সম্পূর্ণ পুল থেকে নির্বাচিত ৫০টি প্রশ্নের চূড়ান্ত মডেল টেস্ট।',\n            qCount: 50,\n            timeMinutes: 50,\n            fullMarks: 50,\n            difficulty: 'challenge',\n            difficultyLabel: 'গ্র্যান্ড ফাইনাল মক',\n            category: 'ফাইনাল মক',\n            chapters: [1, 2, 3, 4, 5, 6, 7],"
);

fs.writeFileSync(path.join(baseDir, 'js/class8-mcq-master-course.js'), c8MasterJs, 'utf8');
fs.writeFileSync(path.join(baseDir, 'www/js/class8-mcq-master-course.js'), c8MasterJs, 'utf8');
console.log('Updated class8-mcq-master-course.js and www copy!');

// 4. Update curriculum_data.js & www/curriculum_data.js
const c8_c7_obj = {
    "num": 7,
    "title": "অধ্যায় ৭: পৃথিবী ও মহাকর্ষ",
    "tag": "Class 8 Science Chapter 7",
    "desc": "মহাকর্ষ বল ও নিউটনের সূত্র, সার্বজনীন মহাকর্ষীয় ধ্রুবক (G), অভিকর্ষ ও অভিকর্ষজ ত্বরণ (g), বিভিন্ন স্থানে g-এর মানের পরিবর্তন, ভর ও ওজন এবং লিফট ও মহাশূন্যযানে ওজনহীনতা।",
    "summary": "মহাবিশ্বের প্রতিটি বস্তু একে অপরকে নিজের দিকে আকর্ষণ করে; যেকোনো দুটি বস্তুর মধ্যকার এই পারস্পরিক আকর্ষণই হলো মহাকর্ষ। বিজ্ঞানী স্যার আইজ্যাক নিউটনের মহাকর্ষ সূত্রানুসারে এ বলের মান বস্তুকণাদ্বয়ের ভরের গুণফলের সমানুপাতিক, এদের মধ্যকার দূরত্বের বর্গের ব্যস্তানুপাতিক এবং বল কণা দুটির সংযোজক সরলরেখা বরাবর ক্রিয়া করে (F = G*m1*m2/d²)। পৃথিবী ও অন্য কোনো বস্তুর আকর্ষণ হলো অভিকর্ষ। অভিকর্ষ বলের প্রভাবে মুক্তভাবে পড়ন্ত বস্তুর বেগ বৃদ্ধির হারকে অভিকর্ষজ ত্বরণ (g = GM/R²) বলে, যার আদর্শ মান ৯.৮ m/s²। পৃথিবী সম্পূর্ণ গোলক না হওয়ায় মেরু অঞ্চলে g সবচেয়ে বেশি (৯.৮৩ m/s²), বিষুবীয় অঞ্চলে সবচেয়ে কম (৯.৭৮ m/s²) এবং পৃথিবীর কেন্দ্রে g ও ওজন শূন্য। ভর (m) হলো পদার্থের পরিমাণ যা মহাবিশ্বের সর্বত্র অপরিবর্তিত থাকে, কিন্তু ওজন (W = mg) স্থানভেদে পরিবর্তিত হয়। মুক্তভাবে পড়ন্ত লিফটে বা প্রদক্ষিণরত মহাশূন্যযানে প্রতিক্রিয়া বল না থাকায় আপাত ওজনহীনতা অনুভূত হয়।",
    "highlights": [
        "নিউটনের মহাকর্ষ সূত্র: $F = G \\frac{m_1 m_2}{d^2}$, যেখানে G হলো সার্বজনীন মহাকর্ষীয় ধ্রুবক।",
        "অভিকর্ষজ ত্বরণ $g = \\frac{GM}{R^2}$; এটি বস্তু নিরপেক্ষ হলেও স্থান নিরপেক্ষ নয়।",
        "ভূপৃষ্ঠে g-এর আদর্শ মান ৯.৮ $m/s^2$ (মেরুতে ৯.৮৩ $m/s^2$ এবং বিষুবীয় অঞ্চলে ৯.৭৮ $m/s^2$)।",
        "পৃথিবীর কেন্দ্রে g-এর মান শূন্য, তাই পৃথিবীর কেন্দ্রে যেকোনো বস্তুর ওজন শূন্য।",
        "চাঁদে অভিকর্ষজ ত্বরণের মান পৃথিবীর প্রায় ১/৬ ভাগ (প্রায় ১.৬৩ $m/s^2$)।",
        "ভর (kg) ধ্রুব রাশি কিন্তু ওজন (N) স্থানভেদে পরিবর্তনশীল ($W = mg$)।",
        "মুক্তভাবে পড়ন্ত লিফটে বা কৃত্রিম উপগ্রহে অভিকর্ষ বল থাকা সত্ত্বেও প্রতিক্রিয়া বলের অভাবে ওজনহীনতা অনুভূত হয়।"
    ],
    "definitions": [
        { "term": "মহাকর্ষ (Gravitation)", "desc": "মহাবিশ্বের যেকোনো দুটি বস্তুর মধ্যে বিদ্যমান পারস্পরিক আকর্ষণ বলকে মহাকর্ষ বলে।" },
        { "term": "অভিকর্ষ (Gravity)", "desc": "পৃথিবী এবং ভূপৃষ্ঠের বা এর চারপাশের অন্য যেকোনো বস্তুর মধ্যকার আকর্ষণ বলকে অভিকর্ষ বলে।" },
        { "term": "মহাকর্ষীয় ধ্রুবক (G)", "desc": "এক কিলোগ্রাম ভরের দুটি বস্তু এক মিটার দূরত্বে অবস্থান করলে এদের মধ্যে যে আকর্ষণ বল কাজ করে তাকে সার্বজনীন মহাকর্ষীয় ধ্রুবক বলে।" },
        { "term": "অভিকর্ষজ ত্বরণ (g)", "desc": "অভিকর্ষ বলের প্রভাবে মুক্তভাবে পড়ন্ত কোনো বস্তুর বেগ বৃদ্ধির হারকে অভিকর্ষজ ত্বরণ বলে।" },
        { "term": "ভর ও ওজন", "desc": "কোনো বস্তুতে পদার্থের মোট পরিমাণ হলো ভর (একক kg); আর বস্তুকে পৃথিবী যে বল দ্বারা কেন্দ্রের দিকে আকর্ষণ করে তা হলো ওজন (একক N, W = mg)।" },
        { "term": "ওজনহীনতা (Weightlessness)", "desc": "মুক্ত পতন বা প্রদক্ষিণশীল অবস্থায় তলের কোনো প্রতিক্রিয়া বল অনুভূত না হওয়ার কারণে আপাত ভারহীনতার অবস্থা।" }
    ],
    "formulas": [
        { "tag": "নিউটনের মহাকর্ষ সূত্র", "expr": "F = G \\frac{m_1 m_2}{d^2}", "note": "G = সার্বজনীন মহাকর্ষীয় ধ্রুবক।" },
        { "tag": "অভিকর্ষজ ত্বরণ", "expr": "g = \\frac{GM}{R^2}", "note": "ভূপৃষ্ঠে আদর্শ মান g = ৯.৮ m/s²।" },
        { "tag": "ওজন সমীকরণ", "expr": "W = mg", "note": "চাঁদে ওজন W_moon = mg/6।" }
    ]
};

['curriculum_data.js', 'www/curriculum_data.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('"c8_c7"')) {
        const insertion = '    "c8_c7": ' + JSON.stringify(c8_c7_obj, null, 8).replace(/^/gm, '    ').trim() + ',\n';
        content = content.replace('"hsc2_c1":', insertion + '    "hsc2_c1":');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', file);
    }
});

// 5. Update study.html & www/study.html
['study.html', 'www/study.html'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // add script
    if (!content.includes('class8_ch7.js')) {
        content = content.replace('<script src="data/exams/class8_ch6.js"></script>',
            '<script src="data/exams/class8_ch6.js"></script>\n    <script src="data/exams/class8_ch7.js"></script>'
        );
    }
    
    // update modal text
    content = content.replace('১ম থেকে ৬ষ্ঠ অধ্যায়ের ৬৩০টি স্পেশাল প্রশ্ন, ৩২টি ওএমআর পরীক্ষা', '১ম থেকে ৭ম অধ্যায়ের ৭৩৫টি স্পেশাল প্রশ্ন, ৩৭টি ওএমআর পরীক্ষা');
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Updated', file);
});

console.log('All updates complete for Chapter 7!');
