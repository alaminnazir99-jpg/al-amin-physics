const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/HP/.gemini/antigravity/scratch/al-amin-physics';

function parseMarkdownQuestionsAccurate(filePath, chapNum, chapName) {
    const mdText = fs.readFileSync(filePath, 'utf8');
    const lines = mdText.split(/\r?\n/);

    const sets = [
        { id: "set1", setNum: 1, title: "সেট ০১: সহজ (জ্ঞান ও মৌলিক ধারণা • ফ্রি ট্রায়াল)", difficulty: "সহজ", difficultyLevel: "easy", badgeColor: "emerald", qCount: 15, timeMinutes: 15, fullMarks: 15, isFree: true, desc: "মৌলিক সংজ্ঞা, প্রতীক, সংকেত ও প্রাথমিক ধারণা সম্পর্কিত বহুনির্বাচনী প্রশ্ন।", questions: [] },
        { id: "set2", setNum: 2, title: "সেট ০২: সহজ-মাঝারি (যোজনী ও রাসায়নিক সমীকরণ)", difficulty: "সহজ-মাঝারি", difficultyLevel: "easy-medium", badgeColor: "blue", qCount: 15, timeMinutes: 15, fullMarks: 15, isFree: false, desc: "যোজনী, যৌগমূলক ও সমীকরণ সমতাকরণ সম্পর্কিত প্রশ্ন।", questions: [] },
        { id: "set3", setNum: 3, title: "সেট ০৩: বোর্ড স্ট্যান্ডার্ড (সমন্বিত মডেল টেস্ট - ক)", difficulty: "মাঝারি", difficultyLevel: "medium", badgeColor: "indigo", qCount: 25, timeMinutes: 25, fullMarks: 25, isFree: false, desc: "বোর্ড স্ট্যান্ডার্ড বিভিন্ন ধরনের রাসায়নিক বিক্রিয়া ও সমন্বিত মডেল টেস্ট।", questions: [] },
        { id: "set4", setNum: 4, title: "সেট ০৪: কঠিন (তড়িৎ বিশ্লেষণ ও শক্তি রূপান্তর)", difficulty: "কঠিন", difficultyLevel: "hard", badgeColor: "purple", qCount: 25, timeMinutes: 25, fullMarks: 25, isFree: false, desc: "উদ্দীপকভিত্তিক, তড়িৎ বিশ্লেষণ, অ্যানোড-ক্যাথোড ও ড্রাইসেল সম্পর্কিত জটিল প্রশ্ন।", questions: [] },
        { id: "set5", setNum: 5, title: "সেট ০৫: চ্যালেঞ্জ (মাস্টার বোর্ড মক টেস্ট - খ)", difficulty: "চ্যালেঞ্জ", difficultyLevel: "challenge", badgeColor: "amber", qCount: 25, timeMinutes: 25, fullMarks: 25, isFree: false, desc: "টপ গ্রেড ও নিখুঁত প্রস্তুতির জন্য চূড়ান্ত চ্যালেঞ্জিং ও বিশ্লেষণধর্মী প্রশ্নাবলি।", questions: [] }
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

        // Check Question header: **1.1. মৌলের পুরো নামের...**
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
            let qId = `C8-CH08-S${currentSetIdx + 1}-${qMatch[2].padStart(2, '0')}`;
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

// 1. Parse Chapter 8
const ch8Data = parseMarkdownQuestionsAccurate(path.join(baseDir, 'c8_ch8_raw.md'), 8, 'রাসায়নিক বিক্রিয়া');
console.log('--- Chapter 8 Sets ---');
let total = 0;
ch8Data.sets.forEach(s => {
    console.log(`Set ${s.setNum}: ${s.questions.length} Qs`);
    total += s.questions.length;
});
console.log('Total Chapter 8 Questions:', total);

if (total !== 105) {
    console.error('ERROR: Total questions is not 105! Found:', total);
    process.exit(1);
}

// 2. Generate class8_ch8.js and write to data/exams/ and www/data/exams/
const fileHeader = `// Class 8 Science Chapter 08 Board Standard Exam Bank (5 Sets, 105 MCQs)
window.CLASS8_EXAM_BANK = window.CLASS8_EXAM_BANK || {};
window.CLASS8_EXAM_BANK[8] = ${JSON.stringify(ch8Data, null, 2)};
`;

fs.writeFileSync(path.join(baseDir, 'data/exams/class8_ch8.js'), fileHeader, 'utf8');
fs.writeFileSync(path.join(baseDir, 'www/data/exams/class8_ch8.js'), fileHeader, 'utf8');
console.log('Written data/exams/class8_ch8.js and www/data/exams/class8_ch8.js!');

// 3. Update js/class8-mcq-master-course.js & www/js/class8-mcq-master-course.js
let c8MasterJs = fs.readFileSync(path.join(baseDir, 'js/class8-mcq-master-course.js'), 'utf8');
// Update config
c8MasterJs = c8MasterJs.replace('totalExams: 37,', 'totalExams: 42,');
c8MasterJs = c8MasterJs.replace('totalQuestionsPool: 735,', 'totalQuestionsPool: 840,');

// Update chapters array
if (!c8MasterJs.includes("id: 'c8_c8'")) {
    c8MasterJs = c8MasterJs.replace(
        "{ num: 7, id: 'c8_c7', name: 'পৃথিবী ও মহাকর্ষ', qCount: 105 }",
        "{ num: 7, id: 'c8_c7', name: 'পৃথিবী ও মহাকর্ষ', qCount: 105 },\n            { num: 8, id: 'c8_c8', name: 'রাসায়নিক বিক্রিয়া', qCount: 105 }"
    );
}

// Update chaps in getAllExamDefinitions
if (!c8MasterJs.includes('num: 8, name: "রাসায়নিক বিক্রিয়া"')) {
    c8MasterJs = c8MasterJs.replace(
        '{ num: 7, name: "পৃথিবী ও মহাকর্ষ" }',
        '{ num: 7, name: "পৃথিবী ও মহাকর্ষ" },\n            { num: 8, name: "রাসায়নিক বিক্রিয়া" }'
    );
}

// Update combined test
c8MasterJs = c8MasterJs.replace(
    "title: 'অধ্যায় ১ থেকে ৭ সমন্বিত হাফ-বুক টেস্ট',\n            desc: 'প্রথম সাতটি অধ্যায় থেকে নির্বাচিত ৫০টি গুরুত্বপূর্ণ বোর্ড স্ট্যান্ডার্ড প্রশ্নের সমন্বিত পরীক্ষা।',\n            qCount: 50,\n            timeMinutes: 50,\n            fullMarks: 50,\n            difficulty: 'medium',\n            difficultyLabel: 'সমন্বিত মডেল টেস্ট',\n            category: 'সমন্বিত টেস্ট',\n            chapters: [1, 2, 3, 4, 5, 6, 7],",
    "title: 'অধ্যায় ১ থেকে ৮ সমন্বিত প্র্যাকটিস টেস্ট',\n            desc: 'প্রথম আটটি অধ্যায় থেকে নির্বাচিত ৫৫টি গুরুত্বপূর্ণ বোর্ড স্ট্যান্ডার্ড প্রশ্নের সমন্বিত পরীক্ষা।',\n            qCount: 55,\n            timeMinutes: 55,\n            fullMarks: 55,\n            difficulty: 'medium',\n            difficultyLabel: 'সমন্বিত মডেল টেস্ট',\n            category: 'সমন্বিত টেস্ট',\n            chapters: [1, 2, 3, 4, 5, 6, 7, 8],"
);

// Update final mock
c8MasterJs = c8MasterJs.replace(
    "desc: '৭৩৫টি প্রশ্নের সম্পূর্ণ পুল থেকে নির্বাচিত ৫০টি প্রশ্নের চূড়ান্ত মডেল টেস্ট।',\n            qCount: 50,\n            timeMinutes: 50,\n            fullMarks: 50,\n            difficulty: 'challenge',\n            difficultyLabel: 'গ্র্যান্ড ফাইনাল মক',\n            category: 'ফাইনাল মক',\n            chapters: [1, 2, 3, 4, 5, 6, 7],",
    "desc: '৮৪০টি প্রশ্নের সম্পূর্ণ পুল থেকে নির্বাচিত ৫০টি প্রশ্নের চূড়ান্ত মডেল টেস্ট।',\n            qCount: 50,\n            timeMinutes: 50,\n            fullMarks: 50,\n            difficulty: 'challenge',\n            difficultyLabel: 'গ্র্যান্ড ফাইনাল মক',\n            category: 'ফাইনাল মক',\n            chapters: [1, 2, 3, 4, 5, 6, 7, 8],"
);

fs.writeFileSync(path.join(baseDir, 'js/class8-mcq-master-course.js'), c8MasterJs, 'utf8');
fs.writeFileSync(path.join(baseDir, 'www/js/class8-mcq-master-course.js'), c8MasterJs, 'utf8');
console.log('Updated class8-mcq-master-course.js and www copy!');

// 4. Update curriculum_data.js & www/curriculum_data.js
const c8_c8_obj = {
    "num": 8,
    "title": "অধ্যায় ৮: রাসায়নিক বিক্রিয়া",
    "tag": "Class 8 Science Chapter 8",
    "desc": "প্রতীক, সংকেত, যোজনী ও যৌগমূলক; রাসায়নিক সমীকরণ ও সমতাকরণ; বিভিন্ন প্রকার রাসায়নিক বিক্রিয়া (সংযোজন, বিয়োজন, প্রতিস্থাপন, প্রশমন, দহন); শুষ্ক কোষ (ড্রাইসেল), তড়িৎ বিশ্লেষণ ও রাসায়নিক বিক্রিয়ায় শক্তির রূপান্তর।",
    "summary": "মৌলের পুরো নামের সংক্ষিপ্তরূপকে প্রতীক এবং যৌগ বা অণুর সংক্ষিপ্তরূপকে সংকেত বলে। একটি মৌলের সাথে অন্য মৌলের যুক্ত হওয়ার সামর্থ্য বা ক্ষমতাকে যোজনী বলে। একাধিক পরমাণু একত্রিত হয়ে পরমাণুগুচ্ছ গঠন করে এবং একটিমাত্র পরমাণুর মতো আচরণ করলে তাকে যৌগমূলক বলে (যেমন: সালফেট, নাইট্রেট, অ্যামোনিয়াম)। রাসায়নিক পরিবর্তনের বিবরণ সংক্ষেপে উপস্থাপন করার পদ্ধতি হলো রাসায়নিক সমীকরণ, যেখানে ভর সংরক্ষণের নীতি অনুসারে তীর চিহ্নের উভয় পাশে পরমাণুর সংখ্যা সমতা রক্ষা করা হয়। বিভিন্ন প্রকার বিক্রিয়ার মধ্যে সংযোজন (একাধিক পদার্থ যুক্ত হয়ে একটি তৈরি হওয়া), বিয়োজন (ভেঙে একাধিক তৈরি হওয়া), প্রতিস্থাপন (অপেক্ষাকৃত সক্রিয় মৌল অন্য মৌলকে সরিয়ে যৌগ গঠন), প্রশমন (অ্যাসিড ও ক্ষারকের বিক্রিয়ায় লবণ ও জল তৈরি) এবং দহন (বাতাসের অক্সিজেনে পুড়ে তাপ ও আলো উৎপন্ন করা) অন্যতম। ড্রাইসেল বা শুষ্ক কোষে রাসায়নিক শক্তি বিদ্যুৎ শক্তিতে রূপান্তরিত হয় এবং তড়িৎ বিশ্লেষণের মাধ্যমে দ্রবণে থাকা আয়নসমূহ অ্যানোড ও ক্যাথোডে চার্জমুক্ত হয়।",
    "highlights": [
        "মৌলের পুরো নামের সংক্ষিপ্ত রূপ প্রতীক (যেমন: Ca, Fe) এবং অণুর সংক্ষিপ্ত রূপ সংকেত (যেমন: $H_2O, H_2SO_4$)।",
        "একটি মৌলের পরমাণুর সাথে অপর কোনো মৌলের পরমাণু যুক্ত হওয়ার সামর্থ্যকে যোজনী বলে।",
        "যৌগমূলক একাধিক পরমাণুর গুচ্ছ হলেও রাসায়নিক বিক্রিয়ায় একক মৌলের পরমাণুর মতো অংশ নেয়।",
        "সংযোজন বিক্রিয়ায় দুই বা ততোধিক পদার্থ যুক্ত হয়ে একটি যৌগ উৎপন্ন করে ($CaO + CO_2 \\rightarrow CaCO_3$)।",
        "বিয়োজন বিক্রিয়ায় একটি যৌগ ভেঙে একাধিক যৌগ বা মৌলে পরিণত হয় ($2KClO_3 \\rightarrow 2KCl + 3O_2$)।",
        "প্রতিস্থাপন বিক্রিয়ায় অধিক সক্রিয় মৌল অপেক্ষাকৃত কম সক্রিয় মৌলকে প্রতিস্থাপিত করে ($Fe + CuSO_4 \\rightarrow FeSO_4 + Cu$)।",
        "অ্যাসিড ও ক্ষারের বিক্রিয়ায় লবণ ও জল উৎপন্ন হওয়াকে প্রশমন বিক্রিয়া বলে ($HCl + NaOH \\rightarrow NaCl + H_2O$)।",
        "শুষ্ক কোষে (Dry Cell) অ্যামোনিয়াম ক্লোরাইড, কয়লার গুঁড়া ও ম্যাঙ্গানিজ ডাই-অক্সাইডের পেস্ট ব্যবহৃত হয় এবং এটি রাসায়নিক শক্তিকে তড়িৎ শক্তিতে রূপান্তরিত করে।"
    ],
    "definitions": [
        { "term": "প্রতীক (Symbol)", "desc": "কোনো মৌলের ইংরেজি বা ল্যাটিন নামের সংক্ষিপ্ত রূপকে প্রতীক বলে।" },
        { "term": "সংকেত (Formula)", "desc": "মৌল বা যৌগের অণুর সংক্ষিপ্ত রূপকে সংকেত বলে।" },
        { "term": "যোজনী (Valency)", "desc": "কোনো মৌলের অন্য কোনো মৌলের সাথে যুক্ত হওয়ার ধারণক্ষমতা বা সামর্থ্যকে যোজনী বলে।" },
        { "term": "যৌগমূলক (Radical)", "desc": "একাধিক মৌলের একাধিক পরমাণু একত্রিত হয়ে যে পরমাণুগুচ্ছ তৈরি হয় এবং যা রাসায়নিক বিক্রিয়ায় একক পরমাণুর ন্যায় আচরণ করে তাকে যৌগমূলক বলে।" },
        { "term": "সংযোজন ও বিয়োজন বিক্রিয়া", "desc": "যে বিক্রিয়ায় দুই বা ততোধিক পদার্থ যুক্ত হয়ে নতুন একটি যৌগ গঠন করে তা সংযোজন; আর যে বিক্রিয়ায় একটি যৌগ ভেঙে একাধিক পদার্থে রূপান্তরিত হয় তা বিয়োজন।" },
        { "term": "প্রতিস্থাপন ও প্রশমন বিক্রিয়া", "desc": "একটি মৌল কোনো যৌগ থেকে অন্য মৌলকে সরিয়ে নিজের স্থান দখল করলে তা প্রতিস্থাপন; এবং অ্যাসিড-ক্ষারের বিক্রিয়ায় নিরপেক্ষ লবণ ও জল উৎপন্ন হলে তা প্রশমন।" },
        { "term": "তড়িৎ বিশ্লেষণ (Electrolysis)", "desc": "গলিত বা দ্রবীভূত অবস্থায় কোনো তড়িৎ বিশ্লেষ্য পদার্থের মধ্য দিয়ে বিদ্যুৎ প্রবাহিত করে রাসায়নিক পরিবর্তন ঘটানোর প্রক্রিয়া।" }
    ],
    "formulas": [
        { "tag": "সংযোজন বিক্রিয়া", "expr": "2Mg + O_2 \\rightarrow 2MgO", "note": "ম্যাগনেসিয়াম ও অক্সিজেনের সংযোজনে ম্যাগনেসিয়াম অক্সাইড তৈরি।" },
        { "tag": "প্রতিস্থাপন বিক্রিয়া", "expr": "Zn + H_2SO_4 \\rightarrow ZnSO_4 + H_2", "note": "জিংক হাইড্রোজেনকে প্রতিস্থাপন করে।" },
        { "tag": "প্রশমন সমীকরণ", "expr": "HCl + NaOH \\rightarrow NaCl + H_2O", "note": "অ্যাসিড + ক্ষার = লবণ + জল।" }
    ]
};

['curriculum_data.js', 'www/curriculum_data.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('"c8_c8"')) {
        const insertion = '    "c8_c8": ' + JSON.stringify(c8_c8_obj, null, 8).replace(/^/gm, '    ').trim() + ',\n';
        content = content.replace('"hsc2_c1":', insertion + '    "hsc2_c1":');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', file);
    }
});

// 5. Update app.js & www/app.js
const appChapterEntry = `            {
                id: "c8_c8",  num: 8,
                title: "অধ্যায় ৮: রাসায়নিক বিক্রিয়া",
                desc:  "প্রতীক, সংকেত ও যোজনী, রাসায়নিক সমীকরণ সমতাকরণ, বিভিন্ন প্রকার রাসায়নিক বিক্রিয়া, ড্রাইসেল ও তড়িৎ বিশ্লেষণ।"
            },
`;

['app.js', 'www/app.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('"c8_c8"')) {
        content = content.replace('            {\n                id: "c8_c9"', appChapterEntry + '            {\n                id: "c8_c9"');
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
    if (!content.includes('class8_ch8.js')) {
        content = content.replace('<script src="data/exams/class8_ch7.js"></script>',
            '<script src="data/exams/class8_ch7.js"></script>\n    <script src="data/exams/class8_ch8.js"></script>'
        );
    }
    
    // update modal text
    content = content.replace('১ম থেকে ৭ম অধ্যায়ের ৭৩৫টি স্পেশাল প্রশ্ন, ৩৭টি ওএমআর পরীক্ষা', '১ম থেকে ৮ম অধ্যায়ের ৮৪০টি স্পেশাল প্রশ্ন, ৪২টি ওএমআর পরীক্ষা');
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Updated', file);
});

console.log('All updates complete for Chapter 8!');
