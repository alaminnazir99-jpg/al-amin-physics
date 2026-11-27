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

        // Check Question header: **1.1. পরমাণু কেমন কণা?**
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
            let qId = `C8-CH06-S${currentSetIdx + 1}-${qMatch[2].padStart(2, '0')}`;
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

// 1. Parse Chapter 6
const ch6Data = parseMarkdownQuestionsAccurate(path.join(baseDir, 'c8_ch6_raw.md'), 6, 'পরমাণুর গঠন');
console.log('--- Chapter 6 Sets ---');
let total = 0;
ch6Data.sets.forEach(s => {
    console.log(`Set ${s.setNum}: ${s.questions.length} Qs`);
    total += s.questions.length;
});
console.log('Total Chapter 6 Questions:', total);

if (total !== 105) {
    console.error('ERROR: Total questions is not 105!');
    process.exit(1);
}

// 2. Generate class8_ch6.js and write to data/exams/ and www/data/exams/
const fileHeader = `// Class 8 Science Chapter 06 Board Standard Exam Bank (5 Sets, 105 MCQs)
window.CLASS8_EXAM_BANK = window.CLASS8_EXAM_BANK || {};
window.CLASS8_EXAM_BANK[6] = ${JSON.stringify(ch6Data, null, 2)};
`;

fs.writeFileSync(path.join(baseDir, 'data/exams/class8_ch6.js'), fileHeader, 'utf8');
fs.writeFileSync(path.join(baseDir, 'www/data/exams/class8_ch6.js'), fileHeader, 'utf8');
console.log('Written data/exams/class8_ch6.js and www/data/exams/class8_ch6.js!');

// 3. Update js/class8-mcq-master-course.js & www/js/class8-mcq-master-course.js
let c8MasterJs = fs.readFileSync(path.join(baseDir, 'js/class8-mcq-master-course.js'), 'utf8');
// Update config
c8MasterJs = c8MasterJs.replace('totalExams: 27,', 'totalExams: 32,');
c8MasterJs = c8MasterJs.replace('totalQuestionsPool: 525,', 'totalQuestionsPool: 630,');

// Update chapters array
if (!c8MasterJs.includes("id: 'c8_c6'")) {
    c8MasterJs = c8MasterJs.replace(
        "{ num: 5, id: 'c8_c5', name: 'সমন্বয় ও নিঃসরণ', qCount: 105 }",
        "{ num: 5, id: 'c8_c5', name: 'সমন্বয় ও নিঃসরণ', qCount: 105 },\n            { num: 6, id: 'c8_c6', name: 'পরমাণুর গঠন', qCount: 105 }"
    );
}

// Update chaps in getAllExamDefinitions
if (!c8MasterJs.includes('num: 6, name: "পরমাণুর গঠন"')) {
    c8MasterJs = c8MasterJs.replace(
        '{ num: 5, name: "সমন্বয় ও নিঃসরণ" }',
        '{ num: 5, name: "সমন্বয় ও নিঃসরণ" },\n            { num: 6, name: "পরমাণুর গঠন" }'
    );
}

// Update combined test
c8MasterJs = c8MasterJs.replace(
    "title: 'অধ্যায় ১ থেকে ৫ সমন্বিত রিভিশন টেস্ট',\n            desc: 'প্রথম পাঁচটি অধ্যায় থেকে নির্বাচিত ৪০টি গুরুত্বপূর্ণ বোর্ড স্ট্যান্ডার্ড প্রশ্নের সমন্বিত পরীক্ষা।',\n            qCount: 40,\n            timeMinutes: 40,\n            fullMarks: 40,\n            difficulty: 'medium',\n            difficultyLabel: 'সমন্বিত মডেল টেস্ট',\n            category: 'সমন্বিত টেস্ট',\n            chapters: [1, 2, 3, 4, 5],",
    "title: 'অধ্যায় ১ থেকে ৬ সমন্বিত রিভিশন টেস্ট',\n            desc: 'প্রথম ছয়টি অধ্যায় থেকে নির্বাচিত ৪৫টি গুরুত্বপূর্ণ বোর্ড স্ট্যান্ডার্ড প্রশ্নের সমন্বিত পরীক্ষা।',\n            qCount: 45,\n            timeMinutes: 45,\n            fullMarks: 45,\n            difficulty: 'medium',\n            difficultyLabel: 'সমন্বিত মডেল টেস্ট',\n            category: 'সমন্বিত টেস্ট',\n            chapters: [1, 2, 3, 4, 5, 6],"
);

// Update final mock
c8MasterJs = c8MasterJs.replace(
    "desc: '৫২৫টি প্রশ্নের সম্পূর্ণ পুল থেকে নির্বাচিত ৫০টি প্রশ্নের চূড়ান্ত মডেল টেস্ট।',\n            qCount: 50,\n            timeMinutes: 50,\n            fullMarks: 50,\n            difficulty: 'challenge',\n            difficultyLabel: 'গ্র্যান্ড ফাইনাল মক',\n            category: 'ফাইনাল মক',\n            chapters: [1, 2, 3, 4, 5],",
    "desc: '৬৩০টি প্রশ্নের সম্পূর্ণ পুল থেকে নির্বাচিত ৫০টি প্রশ্নের চূড়ান্ত মডেল টেস্ট।',\n            qCount: 50,\n            timeMinutes: 50,\n            fullMarks: 50,\n            difficulty: 'challenge',\n            difficultyLabel: 'গ্র্যান্ড ফাইনাল মক',\n            category: 'ফাইনাল মক',\n            chapters: [1, 2, 3, 4, 5, 6],"
);

fs.writeFileSync(path.join(baseDir, 'js/class8-mcq-master-course.js'), c8MasterJs, 'utf8');
fs.writeFileSync(path.join(baseDir, 'www/js/class8-mcq-master-course.js'), c8MasterJs, 'utf8');
console.log('Updated class8-mcq-master-course.js and www copy!');

// 4. Update curriculum_data.js & www/curriculum_data.js
const c8_c6_obj = {
    "num": 6,
    "title": "অধ্যায় ৬: পরমাণুর গঠন",
    "tag": "Class 8 Science Chapter 6",
    "desc": "পরমাণুর ধারণার বিকাশ (ডেমোক্রিটাস, অ্যারিস্টটল, জন ডাল্টন, রাদারফোর্ড ও বোর মডেল), পরমাণুর কণিকা (ইলেকট্রন, প্রোটন, নিউট্রন), পারমাণবিক সংখ্যা ও ভরসংখ্যা, আইসোটোপ ও এর ব্যবহার, ইলেকট্রন বিন্যাস (2n² নিয়ম) এবং ক্যাটায়ন ও অ্যানায়ন গঠন।",
    "summary": "পদার্থের ক্ষুদ্রতম কণা অণু ও পরমাণু। খ্রিস্টপূর্ব ৪০০ অব্দে গ্রিক দার্শনিক ডেমোক্রিটাস সর্বপ্রথম অবিভাজ্য কণা হিসেবে 'এটম' মতবাদ দেন, যার সাথে প্লেটো ও অ্যারিস্টটল দ্বিমত পোষণ করেন। ১৮০৩ সালে জন ডাল্টন পরীক্ষালব্ধ তথ্যের ভিত্তিতে পরমাণু মতবাদ প্রতিষ্ঠা করেন। আধুনিক বিজ্ঞান অনুযায়ী পরমাণু বিভাজ্য — এটি ইলেকট্রন (ঋণাত্মক), প্রোটন (ধনাত্মক) এবং নিউট্রন (আধানহীন) কণা দ্বারা গঠিত। পরমাণুর কেন্দ্রে থাকে নিউক্লিয়াস যাতে প্রোটন ও নিউট্রন পুঞ্জীভূত থাকে এবং এর বাইরে নির্দিষ্ট শক্তিস্তরে (2n² নিয়মে) ইলেকট্রন পরিভ্রমণ করে। কোনো মৌলের প্রোটন সংখ্যাই তার পারমাণবিক সংখ্যা এবং প্রোটন ও নিউট্রনের সমষ্টি ভরসংখ্যা। একই মৌলের ভিন্ন ভরসংখ্যার পরমাণুকে আইসোটোপ বলে; তেজস্ক্রিয় আইসোটোপ চিকিৎসা, কৃষি, খাদ্য সংরক্ষণ ও ভূ-তাত্ত্বিক বয়স নির্ণয়ে বহুল ব্যবহৃত। ইলেকট্রন গ্রহণ বা বর্জনের মাধ্যমে পরমাণু যথাক্রমে অ্যানায়ন বা ক্যাটায়নে পরিণত হয়ে যৌগ গঠন করে।",
    "highlights": [
        "ডেমোক্রিটাস প্রথম অবিভাজ্য কণা 'Atomos' বা এটম ধারণার প্রস্তাব করেন।",
        "১৮০৩ সালে বিজ্ঞানী জন ডাল্টন পরমাণুবাদ উপস্থাপন করেন।",
        "পরমাণু ৩টি মৌলিক কণিকা দিয়ে গঠিত: ইলেকট্রন (ঋণাত্মক), প্রোটন (ধনাত্মক) ও নিউট্রন (নিরপেক্ষ)।",
        "পরমাণুর ভরের প্রায় পুরোটাই নিউক্লিয়াসে বিদ্যমান এবং পরমাণুর বেশিরভাগ অংশই ফাঁকা।",
        "কক্ষপথগুলোতে সর্বোচ্চ ইলেকট্রন ধারণক্ষমতা $2n^2$ সূত্র মেনে চলে (১ম স্তরে ২টি, ২য় স্তরে ৮টি, ৩য় স্তরে ১৮টি)।",
        "আইসোটোপের প্রোটন সংখ্যা সমান কিন্তু ভরসংখ্যা ভিন্ন; ফসফরাস-৩২, কার্বন-১৪ ইত্যাদি গুরুত্বপূর্ণ আইসোটোপ।",
        "ইলেকট্রন বর্জনে ধনাত্মক ক্যাটায়ন ($Na^+$) এবং গ্রহণে ঋণাত্মক অ্যানায়ন ($F^-$) গঠিত হয়।"
    ],
    "definitions": [
        { "term": "পরমাণু (Atom)", "desc": "মৌলিক পদার্থের ক্ষুদ্রতম কণা যা রাসায়নিক বিক্রিয়ায় সরাসরি অংশগ্রহণ করে এবং যার মধ্যে মৌলটির স্বকীয় ধর্ম অক্ষুণ্ণ থাকে।" },
        { "term": "পারমাণবিক সংখ্যা (Atomic Number)", "desc": "কোনো মৌলের পরমাণুর নিউক্লিয়াসে অবস্থিত মোট প্রোটনের সংখ্যাকে সেই মৌলের পারমাণবিক সংখ্যা বলে।" },
        { "term": "ভরসংখ্যা (Mass Number)", "desc": "কোনো পরমাণুর নিউক্লিয়াসে অবস্থিত মোট প্রোটন সংখ্যা এবং নিউট্রন সংখ্যার সমষ্টিকে ভরসংখ্যা বলে।" },
        { "term": "আইসোটোপ (Isotope)", "desc": "একই মৌলের বিভিন্ন পরমাণু যাদের পারমাণবিক সংখ্যা (প্রোটন সংখ্যা) সমান কিন্তু ভরসংখ্যা ভিন্ন, তাদের পরস্পরের আইসোটোপ বলে।" },
        { "term": "তেজস্ক্রিয় আইসোটোপ", "desc": "যেসব অস্থিতিশীল আইসোটোপ স্বতঃস্ফূর্তভাবে বিভিন্ন তেজস্ক্রিয় রশ্মি (যেমন গামা রশ্মি, আলফা/বিটা কণা) বিকিরণ করে।" },
        { "term": "ক্যাটায়ন ও অ্যানায়ন", "desc": "ইলেকট্রন ত্যাগের ফলে সৃষ্ট ধনাত্মক আধানযুক্ত আয়ন হলো ক্যাটায়ন এবং ইলেকট্রন গ্রহণের ফলে সৃষ্ট ঋণাত্মক আধানযুক্ত আয়ন হলো অ্যানায়ন।" }
    ],
    "formulas": [
        { "tag": "ভরসংখ্যা সমীকরণ", "expr": "A = Z + N \\;\\; (\\text{ভরসংখ্যা} = \\text{প্রোটন সংখ্যা} + \\text{নিউট্রন সংখ্যা})", "note": "নিউট্রন সংখ্যা N = A - Z।" },
        { "tag": "শক্তিস্তরে সর্বোচ্চ ইলেকট্রন ধারণক্ষমতা", "expr": "\\text{Max Electrons} = 2n^2 \\;\\; (n = 1, 2, 3 \\dots)", "note": "n = শক্তিস্তর ক্রমিক নম্বর।" }
    ]
};

['curriculum_data.js', 'www/curriculum_data.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('"c8_c6"')) {
        const insertion = '    "c8_c6": ' + JSON.stringify(c8_c6_obj, null, 8).replace(/^/gm, '    ').trim() + ',\n';
        content = content.replace('"hsc2_c1":', insertion + '    "hsc2_c1":');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', file);
    }
});

// 5. Update app.js & www/app.js to add c8_c6 to APP_DATA.class8.chapters
const c8_c6_chapter_entry = `            {
                id: "c8_c6",  num: 6,
                title: "অধ্যায় ৬: পরমাণুর গঠন",
                desc:  "পরমাণুর মডেল, ইলেকট্রন, প্রোটন ও নিউট্রন, পারমাণবিক সংখ্যা, আইসোটোপ ও ইলেকট্রন বিন্যাস।"
            },`;

['app.js', 'www/app.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('"c8_c6"')) {
        content = content.replace('title: "অধ্যায় ৫: সমন্বয় ও নিঃসরণ",\n                desc:  "ফাইটোহরমোন, ট্রপিক চলন, নিউরন ও মস্তিষ্ক, প্রতিবর্ত ক্রিয়া এবং বৃক্কের রেচন ব্যবস্থা।"\n            },',
            'title: "অধ্যায় ৫: সমন্বয় ও নিঃসরণ",\n                desc:  "ফাইটোহরমোন, ট্রপিক চলন, নিউরন ও মস্তিষ্ক, প্রতিবর্ত ক্রিয়া এবং বৃক্কের রেচন ব্যবস্থা।"\n            },\n' + c8_c6_chapter_entry
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
    if (!content.includes('class8_ch6.js')) {
        content = content.replace('<script src="data/exams/class8_ch5.js"></script>',
            '<script src="data/exams/class8_ch5.js"></script>\n    <script src="data/exams/class8_ch6.js"></script>'
        );
    }
    
    // update modal text
    content = content.replace('১ম থেকে ৫ম অধ্যায়ের ৫২৫টি স্পেশাল প্রশ্ন, ২৭টি ওএমআর পরীক্ষা', '১ম থেকে ৬ষ্ঠ অধ্যায়ের ৬৩০টি স্পেশাল প্রশ্ন, ৩২টি ওএমআর পরীক্ষা');
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Updated', file);
});

console.log('All updates complete for Chapter 6!');
