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

        // Check Question header: **1.1. প্রজনন বা জনন কাকে বলে?**
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
            let qId = `c8_ch${chapNum}_s${currentSetIdx + 1}_q${qMatch[2]}`;
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

// 1. Parse Chapter 4
const ch4Data = parseMarkdownQuestionsAccurate(path.join(baseDir, 'c8_ch4_raw.md'), 4, 'উদ্ভিদের বংশ বৃদ্ধি');
console.log('--- Chapter 4 Sets ---');
let total = 0;
ch4Data.sets.forEach(s => {
    console.log(`Set ${s.setNum}: ${s.questions.length} Qs`);
    total += s.questions.length;
});
console.log('Total Chapter 4 Questions:', total);

if (total !== 105) {
    console.error('ERROR: Total questions is not 105!');
    process.exit(1);
}

// 2. Generate class8_ch4.js and write to data/exams/ and www/data/exams/
const fileHeader = `// Class 8 Science Chapter 04 Board Standard Exam Bank (5 Sets, 105 MCQs)
window.CLASS8_EXAM_BANK = window.CLASS8_EXAM_BANK || {};
window.CLASS8_EXAM_BANK[4] = ${JSON.stringify(ch4Data, null, 2)};
`;

fs.writeFileSync(path.join(baseDir, 'data/exams/class8_ch4.js'), fileHeader, 'utf8');
fs.writeFileSync(path.join(baseDir, 'www/data/exams/class8_ch4.js'), fileHeader, 'utf8');
console.log('Written data/exams/class8_ch4.js and www/data/exams/class8_ch4.js!');

// 3. Update js/class8-mcq-master-course.js & www/js/class8-mcq-master-course.js
let c8MasterJs = fs.readFileSync(path.join(baseDir, 'js/class8-mcq-master-course.js'), 'utf8');
// Update config
c8MasterJs = c8MasterJs.replace('totalExams: 17,', 'totalExams: 22,');
c8MasterJs = c8MasterJs.replace('totalQuestionsPool: 315,', 'totalQuestionsPool: 420,');

// Update chapters array
if (!c8MasterJs.includes("id: 'c8_c4'")) {
    c8MasterJs = c8MasterJs.replace(
        "{ num: 3, id: 'c8_c3', name: 'ব্যাপন, অভিস্রবণ ও প্রস্বেদন', qCount: 105 }",
        "{ num: 3, id: 'c8_c3', name: 'ব্যাপন, অভিস্রবণ ও প্রস্বেদন', qCount: 105 },\n            { num: 4, id: 'c8_c4', name: 'উদ্ভিদের বংশ বৃদ্ধি', qCount: 105 }"
    );
}

// Update chaps in getAllExamDefinitions
if (!c8MasterJs.includes('num: 4, name: "উদ্ভিদের বংশ বৃদ্ধি"')) {
    c8MasterJs = c8MasterJs.replace(
        '{ num: 3, name: "ব্যাপন, অভিস্রবণ ও প্রস্বেদন" }',
        '{ num: 3, name: "ব্যাপন, অভিস্রবণ ও প্রস্বেদন" },\n            { num: 4, name: "উদ্ভিদের বংশ বৃদ্ধি" }'
    );
}

// Update combined test
c8MasterJs = c8MasterJs.replace(
    "title: 'অধ্যায় ১, ২ ও ৩ সমন্বিত টেস্ট (শ্রেণিবিন্যাস + কোষ বিভাজন + ব্যাপন ও অভিস্রবণ)',\n            desc: 'তিনটি অধ্যায় থেকে নির্বাচিত ৩০টি গুরুত্বপূর্ণ বোর্ড স্ট্যান্ডার্ড প্রশ্নের সমন্বিত পরীক্ষা।',\n            qCount: 30,\n            timeMinutes: 30,\n            fullMarks: 30,\n            difficulty: 'medium',\n            difficultyLabel: 'সমন্বিত মডেল টেস্ট',\n            category: 'সমন্বিত টেস্ট',\n            chapters: [1, 2, 3],",
    "title: 'অধ্যায় ১ থেকে ৪ সমন্বিত রিভিশন টেস্ট',\n            desc: 'প্রথম চারটি অধ্যায় থেকে নির্বাচিত ৩৫টি গুরুত্বপূর্ণ বোর্ড স্ট্যান্ডার্ড প্রশ্নের সমন্বিত পরীক্ষা।',\n            qCount: 35,\n            timeMinutes: 35,\n            fullMarks: 35,\n            difficulty: 'medium',\n            difficultyLabel: 'সমন্বিত মডেল টেস্ট',\n            category: 'সমন্বিত টেস্ট',\n            chapters: [1, 2, 3, 4],"
);

// Update final mock
c8MasterJs = c8MasterJs.replace(
    "desc: '৩১৫টি প্রশ্নের সম্পূর্ণ পুল থেকে নির্বাচিত ৫০টি প্রশ্নের চূড়ান্ত মডেল টেস্ট।',\n            qCount: 50,\n            timeMinutes: 50,\n            fullMarks: 50,\n            difficulty: 'challenge',\n            difficultyLabel: 'গ্র্যান্ড ফাইনাল মক',\n            category: 'ফাইনাল মক',\n            chapters: [1, 2, 3],",
    "desc: '৪২০টি প্রশ্নের সম্পূর্ণ পুল থেকে নির্বাচিত ৫০টি প্রশ্নের চূড়ান্ত মডেল টেস্ট।',\n            qCount: 50,\n            timeMinutes: 50,\n            fullMarks: 50,\n            difficulty: 'challenge',\n            difficultyLabel: 'গ্র্যান্ড ফাইনাল মক',\n            category: 'ফাইনাল মক',\n            chapters: [1, 2, 3, 4],"
);

fs.writeFileSync(path.join(baseDir, 'js/class8-mcq-master-course.js'), c8MasterJs, 'utf8');
fs.writeFileSync(path.join(baseDir, 'www/js/class8-mcq-master-course.js'), c8MasterJs, 'utf8');
console.log('Updated class8-mcq-master-course.js and www copy!');

// 4. Update curriculum_data.js & www/curriculum_data.js
const c8_c4_obj = {
    "num": 4,
    "title": "অধ্যায় ৪: উদ্ভিদের বংশ বৃদ্ধি",
    "tag": "Class 8 Science Chapter 4",
    "desc": "প্রজননের প্রকারভেদ (অযৌন ও যৌন জনন), স্পোর উৎপাদন ও অঙ্গজ জনন, আদর্শ ফুলের বিভিন্ন স্তবক, পুষ্পমঞ্জরি, পরাগায়ন, নিষিক্তকরণ, ফলের উৎপত্তি ও বীজের অঙ্কুরোদগম।",
    "summary": "জীব যে জটিল প্রক্রিয়ায় তার প্রতিরূপ বা বংশধর সৃষ্টি করে তাকে প্রজনন বলে। এটি প্রধানত দুই প্রকার — অযৌন ও যৌন। অযৌন জনন আবার স্পোর উৎপাদন (Mucor, Penicillium) ও অঙ্গজ জননের মাধ্যমে ঘটে। রূপান্তরিত কাণ্ড (টিউবার, রাইজোম, কন্দ, স্টোলন, অফসেট, বুলবিল) ও পাতার মাধ্যমে প্রাকৃতিক অঙ্গজ জনন হয় এবং কলম ও শাখা কলম হলো কৃত্রিম অঙ্গজ জনন। ফুল উন্নত উদ্ভিদের প্রধান যৌন প্রজনন অঙ্গ; এর পাঁচটি প্রধান অংশ: পুষ্পাক্ষ, বৃতি, দলমণ্ডল, পুংস্তবক ও স্ত্রীস্তবক। পরাগায়ন (স্ব-পরাগায়ন ও পর-পরাগায়ন) মাধ্যমে পরাগরেণু গর্ভমুণ্ডে পতিত হয়ে নিষিক্তকরণ সম্পন্ন করে। নিষিক্তকরণের পর গর্ভাশয় ফলে এবং ডিম্বক বীজে পরিণত হয়। উপযুক্ত পানি, তাপ ও অক্সিজেনের উপস্থিতিতে বীজের ভ্রূণ থেকে শিশু উদ্ভিদ সৃষ্টি প্রক্রিয়াকে অঙ্কুরোদগম (মৃদগত ও মৃদভেদী) বলে।",
    "highlights": [
        "প্রজনন প্রধানত দুই প্রকার: অযৌন ও যৌন জনন।",
        "আলু টিউবার, আদা রাইজোম, পিঁয়াজ কন্দ (বাল্ব), কচু স্টোলন এবং কচুরিপানা অফসেটের উদাহরণ।",
        "একটি আদর্শ ফুলের পাঁচটি অংশ: পুষ্পাক্ষ, বৃতি, দলমণ্ডল, পুংকেশর ও গর্ভকেশর।",
        "বৃতি ও দলমণ্ডল সাহায্যকারী স্তবক এবং পুংস্তবক ও স্ত্রীস্তবক অত্যাবশ্যকীয় স্তবক।",
        "পতঙ্গপরাগী ফুল রঙিন ও সুগন্ধযুক্ত; বায়ুপরাগী ফুল হালকা ও গন্ধহীন; পানিপরাগী ফুল পানিতে ভাসে।",
        "নিষিক্তকরণের পর গর্ভাশয় ফলে এবং ডিম্বক বীজে রূপান্তরিত হয়।",
        "ছোলা ও ধানে মৃদগত অঙ্কুরোদগম এবং কুমড়া ও তেঁতুলে মৃদভেদী অঙ্কুরোদগম ঘটে।"
    ],
    "definitions": [
        { "term": "প্রজনন (Reproduction)", "desc": "যে জটিল প্রক্রিয়ায় জীব তার প্রতিরূপ বা বংশধর সৃষ্টি করে নিজের প্রজাতির অস্তিত্ব টিকিয়ে রাখে।" },
        { "term": "অযৌন জনন", "desc": "দুটি ভিন্নধর্মী জনন কোষের মিলন ছাড়াই স্পোর বা দেহের অঙ্গের মাধ্যমে বংশবিস্তার প্রক্রিয়া।" },
        { "term": "অঙ্গজ জনন", "desc": "কোনো ধরনের অযৌন রেণু বা জনন কোষ সৃষ্টি না করে উদ্ভিদের দেহের কোনো অংশ খণ্ডিত হয়ে বা রূপান্তরিত হয়ে সংঘটিত জনন।" },
        { "term": "পুষ্পমঞ্জরি (Inflorescence)", "desc": "কাণ্ডের শীর্ষমুকুল বা কাক্ষিক মুকুল থেকে উৎপন্ন শাখায় বিশেষ নিয়মে সাজানো ফুলসহ সম্পূর্ণ শাখা।" },
        { "term": "পরাগায়ন (Pollination)", "desc": "ফুলের পরাগধানী হতে পরাগরেণুর একই ফুলের অথবা একই প্রজাতির অন্য ফুলের গর্ভমুণ্ডে স্থানান্তর।" },
        { "term": "নিষিক্তকরণ (Fertilization)", "desc": "একটি পুং গ্যামেট অন্য একটি স্ত্রী গ্যামেটের সঙ্গে পরিপূর্ণভাবে মিলিত হওয়ার প্রক্রিয়া।" },
        { "term": "অঙ্কুরোদগম (Germination)", "desc": "পরিমিত পানি, তাপ ও বাতাসের উপস্থিতিতে বীজ থেকে শিশু উদ্ভিদ উৎপন্ন হওয়ার প্রক্রিয়া।" }
    ],
    "formulas": [
        { "tag": "অঙ্কুরোদগমের দুই রূপ", "expr": "\\text{মৃদগত (Hypogeal)} \\;\\;\\text{বনাম}\\;\\; \\text{মৃদভেদী (Epigeal)}", "note": "বীজপত্র মাটির নিচে থাকলে মৃদগত, উপরে উঠে এলে মৃদভেদী।" }
    ]
};

['curriculum_data.js', 'www/curriculum_data.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('"c8_c4"')) {
        const insertion = '    "c8_c4": ' + JSON.stringify(c8_c4_obj, null, 8).replace(/^/gm, '    ').trim() + ',\n';
        content = content.replace('"hsc2_c1":', insertion + '    "hsc2_c1":');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', file);
    }
});

// 5. Update app.js & www/app.js to add c8_c4 to APP_DATA.class8.chapters
const c8_c4_chapter_entry = `            {
                id: "c8_c4",  num: 4,
                title: "অধ্যায় ৪: উদ্ভিদের বংশ বৃদ্ধি",
                desc:  "প্রজননের প্রকারভেদ, অঙ্গজ জনন, আদর্শ ফুল, পরাগায়ন, নিষিক্তকরণ ও অঙ্কুরোদগম।"
            },`;

['app.js', 'www/app.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('"c8_c4"')) {
        content = content.replace('title: "অধ্যায় ৩: ব্যাপন, অভিস্রবণ ও প্রস্বেদন",\n                desc:  "ব্যাপন, অভিস্রবণ, প্লাজমোলাইসিস, উদ্ভিদে পানি ও খনিজ লবণ শোষণ এবং প্রস্বেদনের গুরুত্ব।"\n            },',
            'title: "অধ্যায় ৩: ব্যাপন, অভিস্রবণ ও প্রস্বেদন",\n                desc:  "ব্যাপন, অভিস্রবণ, প্লাজমোলাইসিস, উদ্ভিদে পানি ও খনিজ লবণ শোষণ এবং প্রস্বেদনের গুরুত্ব।"\n            },\n' + c8_c4_chapter_entry
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
    if (!content.includes('class8_ch4.js')) {
        content = content.replace('<script src="data/exams/class8_ch3.js"></script>',
            '<script src="data/exams/class8_ch3.js"></script>\n    <script src="data/exams/class8_ch4.js"></script>'
        );
    }
    
    // update modal text
    content = content.replace('১ম, ২য় ও ৩য় অধ্যায়ের ৩১৫টি স্পেশাল প্রশ্ন, ১৭টি ওএমআর পরীক্ষা', '১ম, ২য়, ৩য় ও ৪র্থ অধ্যায়ের ৪২০টি স্পেশাল প্রশ্ন, ২২টি ওএমআর পরীক্ষা');
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Updated', file);
});

console.log('All updates complete!');
