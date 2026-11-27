const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/HP/.gemini/antigravity/scratch/al-amin-physics';

function parseMarkdownQuestionsAccurate(filePath, chapNum, chapName) {
    const mdText = fs.readFileSync(filePath, 'utf8');
    const lines = mdText.split(/\r?\n/);

    const sets = [
        { id: "set1", setNum: 1, title: "সেট ০১: সহজ (জ্ঞান ও মৌলিক ধারণা • ফ্রি ট্রায়াল)", difficulty: "সহজ", difficultyLevel: "easy", badgeColor: "emerald", qCount: 15, timeMinutes: 15, fullMarks: 15, isFree: true, desc: "তড়িৎ প্রবাহ, আধান, পরিবাহী, অপরিবাহী ও প্রাথমিক ধারণার প্রশ্ন।", questions: [] },
        { id: "set2", setNum: 2, title: "সেট ০২: সহজ-মাঝারি (বিভব পার্থক্য ও ও'মের সূত্র)", difficulty: "সহজ-মাঝারি", difficultyLevel: "easy-medium", badgeColor: "blue", qCount: 15, timeMinutes: 15, fullMarks: 15, isFree: false, desc: "তড়িৎ বিভব পার্থক্য, রোধ ও ও'মের সূত্রভিত্তিক প্রশ্ন।", questions: [] },
        { id: "set3", setNum: 3, title: "সেট ০৩: বোর্ড স্ট্যান্ডার্ড (শ্রেণি ও সমান্তরাল সংযোগ)", difficulty: "মাঝারি", difficultyLevel: "medium", badgeColor: "indigo", qCount: 25, timeMinutes: 25, fullMarks: 25, isFree: false, desc: "সিরিজ ও সমান্তরাল বর্তনী, অ্যামিটার ও ভোল্টমিটার ব্যবহারের প্রশ্ন।", questions: [] },
        { id: "set4", setNum: 4, title: "সেট ০৪: কঠিন (ফিউজ ও নিরাপত্তা কৌশল)", difficulty: "কঠিন", difficultyLevel: "hard", badgeColor: "purple", qCount: 25, timeMinutes: 25, fullMarks: 25, isFree: false, desc: "উদ্দীপকভিত্তিক, বিভিন্ন ক্ষমতার ফিউজ তার ও বৈদ্যুতিক নিরাপত্তা বিশ্লেষণ।", questions: [] },
        { id: "set5", setNum: 5, title: "সেট ০৫: চ্যালেঞ্জ (গাণিতিক প্রয়োগ ও বিদ্যুৎ সাশ্রয়)", difficulty: "চ্যালেঞ্জ", difficultyLevel: "challenge", badgeColor: "amber", qCount: 25, timeMinutes: 25, fullMarks: 25, isFree: false, desc: "ও'মের সূত্রের গাণিতিক সমাধান, বহুপদী প্রশ্ন ও কার্যকর বিদ্যুৎ সাশ্রয়।", questions: [] }
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
            let qId = `C8-CH09-S${currentSetIdx + 1}-${qMatch[2].padStart(2, '0')}`;
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
        description: `অষ্টম শ্রেণি বিজ্ঞান অধ্যায় ০৯: ${chapName} — ১০৫টি MCQ সম্পূর্ণ ব্যাংক।`,
        sets: sets
    };
}

// 1. Parse Chapter 9
const ch9Data = parseMarkdownQuestionsAccurate(path.join(baseDir, 'c8_ch9_raw.md'), 9, 'বর্তনী ও চলবিদ্যুৎ');
console.log('--- Chapter 9 Sets ---');
let total = 0;
ch9Data.sets.forEach(s => {
    console.log(`Set ${s.setNum}: ${s.questions.length} Qs`);
    total += s.questions.length;
});
console.log('Total Chapter 9 Questions:', total);

if (total !== 105) {
    console.error('ERROR: Total questions is not 105! Found:', total);
    process.exit(1);
}

// 2. Generate class8_ch9.js and write to data/exams/ and www/data/exams/
const fileHeader = `// Class 8 Science Chapter 09 Board Standard Exam Bank (5 Sets, 105 MCQs)
window.CLASS8_EXAM_BANK = window.CLASS8_EXAM_BANK || {};
window.CLASS8_EXAM_BANK[9] = ${JSON.stringify(ch9Data, null, 2)};
`;

fs.writeFileSync(path.join(baseDir, 'data/exams/class8_ch9.js'), fileHeader, 'utf8');
fs.writeFileSync(path.join(baseDir, 'www/data/exams/class8_ch9.js'), fileHeader, 'utf8');
console.log('Written data/exams/class8_ch9.js and www/data/exams/class8_ch9.js!');

// 3. Update js/class8-mcq-master-course.js & www/js/class8-mcq-master-course.js
['js/class8-mcq-master-course.js', 'www/js/class8-mcq-master-course.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    let c8MasterJs = fs.readFileSync(fullPath, 'utf8');
    
    // Update config
    c8MasterJs = c8MasterJs.replace('totalExams: 42,', 'totalExams: 47,');
    c8MasterJs = c8MasterJs.replace('totalQuestionsPool: 840,', 'totalQuestionsPool: 945,');

    // Update chapters array
    if (!c8MasterJs.includes("id: 'c8_c9'")) {
        c8MasterJs = c8MasterJs.replace(
            "{ num: 8, id: 'c8_c8', name: 'রাসায়নিক বিক্রিয়া', qCount: 105 }",
            "{ num: 8, id: 'c8_c8', name: 'রাসায়নিক বিক্রিয়া', qCount: 105 },\n            { num: 9, id: 'c8_c9', name: 'বর্তনী ও চলবিদ্যুৎ', qCount: 105 }"
        );
    }

    // Update chaps in getAllExamDefinitions
    if (!c8MasterJs.includes('num: 9, name: "বর্তনী ও চলবিদ্যুৎ"')) {
        c8MasterJs = c8MasterJs.replace(
            '{ num: 8, name: "রাসায়নিক বিক্রিয়া" }',
            '{ num: 8, name: "রাসায়নিক বিক্রিয়া" },\n            { num: 9, name: "বর্তনী ও চলবিদ্যুৎ" }'
        );
    }

    // Update combined test
    c8MasterJs = c8MasterJs.replace(
        "title: 'অধ্যায় ১ থেকে ৮ সমন্বিত প্র্যাকটিস টেস্ট',\n            desc: 'প্রথম আটটি অধ্যায় থেকে নির্বাচিত ৫৫টি গুরুত্বপূর্ণ বোর্ড স্ট্যান্ডার্ড প্রশ্নের সমন্বিত পরীক্ষা।',\n            qCount: 55,\n            timeMinutes: 55,\n            fullMarks: 55,\n            difficulty: 'medium',\n            difficultyLabel: 'সমন্বিত মডেল টেস্ট',\n            category: 'সমন্বিত টেস্ট',\n            chapters: [1, 2, 3, 4, 5, 6, 7, 8],",
        "title: 'অধ্যায় ১ থেকে ৯ সমন্বিত প্র্যাকটিস টেস্ট',\n            desc: 'প্রথম নয়টি অধ্যায় থেকে নির্বাচিত ৬০টি গুরুত্বপূর্ণ বোর্ড স্ট্যান্ডার্ড প্রশ্নের সমন্বিত পরীক্ষা।',\n            qCount: 60,\n            timeMinutes: 60,\n            fullMarks: 60,\n            difficulty: 'medium',\n            difficultyLabel: 'সমন্বিত মডেল টেস্ট',\n            category: 'সমন্বিত টেস্ট',\n            chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9],"
    );

    // Update final mock
    c8MasterJs = c8MasterJs.replace(
        "desc: '৮৪০টি প্রশ্নের সম্পূর্ণ পুল থেকে নির্বাচিত ৫০টি প্রশ্নের চূড়ান্ত মডেল টেস্ট।',\n            qCount: 50,\n            timeMinutes: 50,\n            fullMarks: 50,\n            difficulty: 'challenge',\n            difficultyLabel: 'গ্র্যান্ড ফাইনাল মক',\n            category: 'ফাইনাল মক',\n            chapters: [1, 2, 3, 4, 5, 6, 7, 8],",
        "desc: '৯৪৫টি প্রশ্নের সম্পূর্ণ পুল থেকে নির্বাচিত ৫০টি প্রশ্নের চূড়ান্ত মডেল টেস্ট।',\n            qCount: 50,\n            timeMinutes: 50,\n            fullMarks: 50,\n            difficulty: 'challenge',\n            difficultyLabel: 'গ্র্যান্ড ফাইনাল মক',\n            category: 'ফাইনাল মক',\n            chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9],"
    );

    fs.writeFileSync(fullPath, c8MasterJs, 'utf8');
    console.log('Updated', file);
});

// 4. Update curriculum_data.js & www/curriculum_data.js
const c8_c9_obj = {
    "num": 9,
    "title": "অধ্যায় ৯: বর্তনী ও চলবিদ্যুৎ",
    "tag": "Class 8 Science Chapter 9",
    "desc": "তড়িৎ প্রবাহ, আধান ও বিভব পার্থক্য; পর্যায়বৃত্ত ও একমুখী প্রবাহ; রোধ ও ও'মের সূত্র; শ্রেণি ও সমান্তরাল সংযোগ বর্তনী; অ্যামিটার, ভোল্টমিটার ও ফিউজ তার; এবং বিদ্যুতের নিরাপদ ও কার্যকর ব্যবহার।",
    "summary": "বিদ্যুৎ প্রবাহ মূলত ইলেকট্রনের প্রবাহ। কোনো পরিবাহীর মধ্য দিয়ে আধান প্রবাহের জন্য এর দুই প্রান্তে তড়িৎ বিভব পার্থক্য থাকতে হয়। যে প্রবাহ সর্বদা একই দিকে চলে তা একমুখী (DC) প্রবাহ, আর সময়ের সাথে দিক পরিবর্তনকারী প্রবাহ হলো পর্যায়বৃত্ত (AC) প্রবাহ। জর্জ সাইমন ও'মের সূত্রানুসারে তাপমাত্রা স্থির থাকলে পরিবাহীর তড়িৎ প্রবাহ বিভব পার্থক্যের সমানুপাতিক এবং নিজস্ব রোধের ব্যস্তানুপাতিক (I = V/R)। একাধিক রোধ বা উপকরণকে পরপর যুক্ত করলে শ্রেণি সংযোগ তৈরি হয় যেখানে প্রবাহ এক থাকে কিন্তু বিভব ভিন্ন হতে পারে। আর সাধারণ দুই বিন্দুর মাঝে সমান্তরালে যুক্ত করলে প্রতিটি শাখায় বিভব সমান থাকে এবং গৃহে বিদ্যুতায়নের জন্য এই সমান্তরাল বর্তনীই সর্বোত্তম। তড়িৎ প্রবাহ মাপতে অ্যামিটারকে শ্রেণিতে এবং বিভব মাপতে ভোল্টমিটারকে সমান্তরালে যুক্ত করা হয়। দুর্ঘটনা এড়াতে টিন ও সীসার সংকর ধাতুর সরু ও কম গলনাঙ্কের ফিউজ তার সিরিজে ব্যবহার করা হয়।",
    "highlights": [
        "প্রচলিত তড়িৎ প্রবাহের দিক উচ্চ বিভব থেকে নিম্ন বিভবে, যা ইলেকট্রন প্রবাহের দিকের ঠিক বিপরীত।",
        "তড়িৎ প্রবাহের একক অ্যাম্পিয়ার (A) এবং রোধের একক ও'ম ($\\Omega$)।",
        "বাংলাদেশে AC কারেন্ট প্রতি সেকেন্ডে ৫০ বার এবং যুক্তরাষ্ট্রে ৬০ বার দিক পরিবর্তন করে।",
        "ও'মের সূত্র: $I = \\frac{V}{R}$, এর V-I লেখচিত্র মূলবিন্দুগামী সরলরেখা।",
        "গৃহের জন্য সমান্তরাল বর্তনী সবচেয়ে নিরাপদ ও সুবিধাজনক; একটি নষ্ট হলেও অন্যগুলো চলে।",
        "অ্যামিটার বর্তনীতে শ্রেণিতে এবং ভোল্টমিটার বর্তনীতে সমান্তরালে যুক্ত থাকে।",
        "ফিউজ তার টিন ও সীসার সংকর ধাতু দ্বারা তৈরি, যার গলনাঙ্ক কম এবং এটি সিরিজে যুক্ত থাকে।",
        "প্রেসার কুকার ব্যবহারে ২৫% বিদ্যুৎ সাশ্রয় হয় এবং অপ্রয়োজনে যন্ত্রপাতি বন্ধ রাখা উচিত।"
    ],
    "definitions": [
        { "term": "তড়িৎ প্রবাহ (Current)", "desc": "কোনো পরিবাহীর যেকোনো প্রস্থচ্ছেদের মধ্য দিয়ে একক সময়ে যে পরিমাণ আধান প্রবাহিত হয় তাকে তড়িৎ প্রবাহ বলে (I = Q/t)।" },
        { "term": "তড়িৎ বিভব ও বিভব পার্থক্য", "desc": "অসীম দূরত্ব থেকে একক ধনাত্মক আধানকে তড়িৎ ক্ষেত্রের কোনো বিন্দুতে আনতে সম্পন্ন কাজ হলো বিভব; দুটি বিন্দুর বিভবের পার্থক্যই বিভব পার্থক্য।" },
        { "term": "রোধ (Resistance)", "desc": "পরিবাহীর যে ধর্মের জন্য এর মধ্য দিয়ে বিদ্যুৎ চলাচল বাধাগ্রস্ত হয় তাকে রোধ বলে।" },
        { "term": "ও'মের সূত্র (Ohm's Law)", "desc": "নির্দিষ্ট তাপমাত্রায় কোনো পরিবাহীর মধ্য দিয়ে প্রবাহিত তড়িৎ প্রবাহ পরিবাহীর দুই প্রান্তের বিভব পার্থক্যের সমানুপাতিক।" },
        { "term": "শ্রেণি ও সমান্তরাল বর্তনী", "desc": "উপকরণগুলো একটির পর একটি যুক্ত থাকলে শ্রেণি; আর সাধারণ দুটি বিন্দুর মাঝে সমান্তরালভাবে যুক্ত থাকলে সমান্তরাল বর্তনী।" },
        { "term": "ফিউজ (Electric Fuse)", "desc": "টিন ও সীসার তৈরি কম গলনাঙ্কের সরু সংকর তার যা অতিরিক্ত তড়িৎ প্রবাহে উত্তপ্ত হয়ে গলে গিয়ে বর্তনী রক্ষা করে।" }
    ],
    "formulas": [
        { "tag": "ও'মের সূত্র", "expr": "I = \\frac{V}{R}", "note": "I = তড়িৎ প্রবাহ (A), V = বিভব পার্থক্য (V), R = রোধ (Ω)।" },
        { "tag": "বিভব পার্থক্য নির্ণয়", "expr": "V = I \\times R", "note": "প্রবাহ ও রোধের গুণফল।" },
        { "tag": "রোধ নির্ণয়", "expr": "R = \\frac{V}{I}", "note": "বিভব ও প্রবাহের অনুপাত।" }
    ]
};

['curriculum_data.js', 'www/curriculum_data.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('"c8_c9"')) {
        const insertion = '    "c8_c9": ' + JSON.stringify(c8_c9_obj, null, 8).replace(/^/gm, '    ').trim() + ',\n';
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
    if (!content.includes('class8_ch9.js')) {
        content = content.replace('<script src="data/exams/class8_ch8.js"></script>',
            '<script src="data/exams/class8_ch8.js"></script>\n    <script src="data/exams/class8_ch9.js"></script>'
        );
    }
    
    // update modal text
    content = content.replace('১ম থেকে ৮ম অধ্যায়ের ৮৪০টি স্পেশাল প্রশ্ন, ৪২টি ওএমআর পরীক্ষা', '১ম থেকে ৯ম অধ্যায়ের ৯৪৫টি স্পেশাল প্রশ্ন, ৪৭টি ওএমআর পরীক্ষা');
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Updated', file);
});

console.log('All updates complete for Chapter 9!');
