const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/HP/.gemini/antigravity/scratch/al-amin-physics';

function parseMarkdownQuestionsAccurate(filePath, chapNum, chapName) {
    const mdText = fs.readFileSync(filePath, 'utf8');
    const lines = mdText.split(/\r?\n/);

    const sets = [
        { id: "set1", setNum: 1, title: "সেট ০১: সহজ (জ্ঞান ও মৌলিক ধারণা • ফ্রি ট্রায়াল)", difficulty: "সহজ", difficultyLevel: "easy", badgeColor: "emerald", qCount: 15, timeMinutes: 15, fullMarks: 15, isFree: true, desc: "এসিড ও ক্ষারকের সংজ্ঞা, স্বাদ, প্রাকৃতিক উৎস ও লিটমাসের রঙের পরিবর্তন।", questions: [] },
        { id: "set2", setNum: 2, title: "সেট ০২: সহজ-মাঝারি (সংকেত, আয়ন ও ক্ষার-ক্ষারক সম্পর্ক)", difficulty: "সহজ-মাঝারি", difficultyLevel: "easy-medium", badgeColor: "blue", qCount: 15, timeMinutes: 15, fullMarks: 15, isFree: false, desc: "রাসায়নিক সংকেত, H⁺ ও OH⁻ আয়ন এবং সকল ক্ষার ক্ষারক কিন্তু সকল ক্ষারক ক্ষার নয়।", questions: [] },
        { id: "set3", setNum: 3, title: "সেট ০৩: বোর্ড স্ট্যান্ডার্ড (ব্যবহার, ঔষধ ও শিল্প প্রয়োগ)", difficulty: "মাঝারি", difficultyLevel: "medium", badgeColor: "indigo", qCount: 25, timeMinutes: 25, fullMarks: 25, isFree: false, desc: "লাইম ওয়াটার, এন্টাসিড, মিল্ক অফ ম্যাগনেসিয়া, জৈব ও খনিজ এসিডের ব্যবহার।", questions: [] },
        { id: "set4", setNum: 4, title: "সেট ০৪: কঠিন (উদ্দীপকভিত্তিক ও শিল্পোন্নত এসিড ব্যবহার)", difficulty: "কঠিন", difficultyLevel: "hard", badgeColor: "purple", qCount: 25, timeMinutes: 25, fullMarks: 25, isFree: false, desc: "উদ্দীপকভিত্তিক এসিডিটি, হোয়াইট ওয়াশ ও শিল্প কারখানায় এসিডের ব্যবহার।", questions: [] },
        { id: "set5", setNum: 5, title: "সেট ০৫: চ্যালেঞ্জ (বিক্রিয়া, গ্যাস শনাক্তকরণ ও লবণ)", difficulty: "চ্যালেঞ্জ", difficultyLevel: "challenge", badgeColor: "amber", qCount: 25, timeMinutes: 25, fullMarks: 25, isFree: false, desc: "কার্বনেট, ধাতু ও ক্ষারকের সাথে এসিডের বিক্রিয়া, CO₂ ও H₂ গ্যাস এবং নিরপেক্ষ লবণ।", questions: [] }
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
            let qId = `C8-CH10-S${currentSetIdx + 1}-${qMatch[2].padStart(2, '0')}`;
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
        description: `অষ্টম শ্রেণি বিজ্ঞান অধ্যায় ১০: ${chapName} — ১০৫টি MCQ সম্পূর্ণ ব্যাংক।`,
        sets: sets
    };
}

// 1. Parse Chapter 10
const ch10Data = parseMarkdownQuestionsAccurate(path.join(baseDir, 'c8_ch10_raw.md'), 10, 'অম্ল, ক্ষারক ও লবণ');
console.log('--- Chapter 10 Sets ---');
let total = 0;
ch10Data.sets.forEach(s => {
    console.log(`Set ${s.setNum}: ${s.questions.length} Qs`);
    total += s.questions.length;
});
console.log('Total Chapter 10 Questions:', total);

if (total !== 105) {
    console.error('ERROR: Total questions is not 105! Found:', total);
    process.exit(1);
}

// 2. Generate class8_ch10.js and write to data/exams/ and www/data/exams/
const fileHeader = `// Class 8 Science Chapter 10 Board Standard Exam Bank (5 Sets, 105 MCQs)
window.CLASS8_EXAM_BANK = window.CLASS8_EXAM_BANK || {};
window.CLASS8_EXAM_BANK[10] = ${JSON.stringify(ch10Data, null, 2)};
`;

fs.writeFileSync(path.join(baseDir, 'data/exams/class8_ch10.js'), fileHeader, 'utf8');
fs.writeFileSync(path.join(baseDir, 'www/data/exams/class8_ch10.js'), fileHeader, 'utf8');
console.log('Written data/exams/class8_ch10.js and www/data/exams/class8_ch10.js!');

// 3. Update js/class8-mcq-master-course.js & www/js/class8-mcq-master-course.js
['js/class8-mcq-master-course.js', 'www/js/class8-mcq-master-course.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    let c8MasterJs = fs.readFileSync(fullPath, 'utf8');
    
    // Update config
    c8MasterJs = c8MasterJs.replace('totalExams: 47,', 'totalExams: 52,');
    c8MasterJs = c8MasterJs.replace('totalQuestionsPool: 945,', 'totalQuestionsPool: 1050,');

    // Update chapters array
    if (!c8MasterJs.includes("id: 'c8_c10'")) {
        c8MasterJs = c8MasterJs.replace(
            "{ num: 9, id: 'c8_c9', name: 'বর্তনী ও চলবিদ্যুৎ', qCount: 105 }",
            "{ num: 9, id: 'c8_c9', name: 'বর্তনী ও চলবিদ্যুৎ', qCount: 105 },\n            { num: 10, id: 'c8_c10', name: 'অম্ল, ক্ষারক ও লবণ', qCount: 105 }"
        );
    }

    // Update chaps in getAllExamDefinitions
    if (!c8MasterJs.includes('num: 10, name: "অম্ল, ক্ষারক ও লবণ"')) {
        c8MasterJs = c8MasterJs.replace(
            '{ num: 9, name: "বর্তনী ও চলবিদ্যুৎ" }',
            '{ num: 9, name: "বর্তনী ও চলবিদ্যুৎ" },\n            { num: 10, name: "অম্ল, ক্ষারক ও লবণ" }'
        );
    }

    // Update combined test
    c8MasterJs = c8MasterJs.replace(
        "title: 'অধ্যায় ১ থেকে ৯ সমন্বিত প্র্যাকটিস টেস্ট',\n            desc: 'প্রথম নয়টি অধ্যায় থেকে নির্বাচিত ৬০টি গুরুত্বপূর্ণ বোর্ড স্ট্যান্ডার্ড প্রশ্নের সমন্বিত পরীক্ষা।',\n            qCount: 60,\n            timeMinutes: 60,\n            fullMarks: 60,\n            difficulty: 'medium',\n            difficultyLabel: 'সমন্বিত মডেল টেস্ট',\n            category: 'সমন্বিত টেস্ট',\n            chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9],",
        "title: 'অধ্যায় ১ থেকে ১০ সমন্বিত প্র্যাকটিস টেস্ট',\n            desc: 'প্রথম দশটি অধ্যায় থেকে নির্বাচিত ৬৫টি গুরুত্বপূর্ণ বোর্ড স্ট্যান্ডার্ড প্রশ্নের সমন্বিত পরীক্ষা।',\n            qCount: 65,\n            timeMinutes: 65,\n            fullMarks: 65,\n            difficulty: 'medium',\n            difficultyLabel: 'সমন্বিত মডেল টেস্ট',\n            category: 'সমন্বিত টেস্ট',\n            chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],"
    );

    // Update final mock
    c8MasterJs = c8MasterJs.replace(
        "desc: '৯৪৫টি প্রশ্নের সম্পূর্ণ পুল থেকে নির্বাচিত ৫০টি প্রশ্নের চূড়ান্ত মডেল টেস্ট।',\n            qCount: 50,\n            timeMinutes: 50,\n            fullMarks: 50,\n            difficulty: 'challenge',\n            difficultyLabel: 'গ্র্যান্ড ফাইনাল মক',\n            category: 'ফাইনাল মক',\n            chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9],",
        "desc: '১০৫০টি প্রশ্নের সম্পূর্ণ পুল থেকে নির্বাচিত ৫০টি প্রশ্নের চূড়ান্ত মডেল টেস্ট।',\n            qCount: 50,\n            timeMinutes: 50,\n            fullMarks: 50,\n            difficulty: 'challenge',\n            difficultyLabel: 'গ্র্যান্ড ফাইনাল মক',\n            category: 'ফাইনাল মক',\n            chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],"
    );

    fs.writeFileSync(fullPath, c8MasterJs, 'utf8');
    console.log('Updated', file);
});

// 4. Update curriculum_data.js & www/curriculum_data.js
const c8_c10_obj = {
    "num": 10,
    "title": "অধ্যায় ১০: অম্ল, ক্ষারক ও লবণ",
    "tag": "Class 8 Science Chapter 10",
    "desc": "অম্ল (এসিড) ও ক্ষারকের বৈশিষ্ট্য; লিটমাস কাগজ ও নির্দেশক; পানিতে H⁺ ও OH⁻ আয়নের ভূমিকা; ক্ষার ও ক্ষারকের সম্পর্ক; এন্টাসিড, ব্লিচিং পাউডার ও লাইম ওয়াটার; খনিজ ও জৈব এসিডের ব্যবহার এবং প্রশমন বিক্রিয়ায় লবণ প্রস্তুতি।",
    "summary": "যে সকল রাসায়নিক পদার্থ পানিতে হাইড্রোজেন আয়ন (H⁺) উৎপন্ন করে এবং নীল লিটমাসকে লাল করে তাদেরকে অম্ল বা এসিড বলে (যেমন: HCl, H₂SO₄, CH₃COOH)। ফলমূল ও সবজিতে থাকা এসিডগুলো হলো জৈব এসিড (যেমন: সাইট্রিক, টারটারিক, অক্সালিক ও ম্যালিক এসিড) যা মানবদেহের জন্য উপযোগী। অন্যদিকে খনিজ এসিডগুলো খাওয়ার অনুপযোগী এবং তীব্র ক্ষত সৃষ্টি করতে পারে। অপরপক্ষে যে সকল যৌগ পানিতে হাইড্রক্সিল আয়ন (OH⁻) দেয় এবং লাল লিটমাসকে নীল করে তারা ক্ষারক। যেসব ক্ষারক পানিতে দ্রবীভূত হয় তাদেরকে ক্ষার বলে—তাই সকল ক্ষারই ক্ষারক, কিন্তু সকল ক্ষারক ক্ষার নয় [যেমন Al(OH)₃ পানিতে অদ্রবণীয় ক্ষারক]। পেটের এসিডিটি দূর করতে এন্টাসিড বা ম্যাগনেসিয়াম হাইড্রক্সাইড [Mg(OH)₂] ব্যবহৃত হয়। এসিড ও ক্ষারকের বিক্রিয়ায় উৎপন্ন নিরপেক্ষ পদার্থ হলো লবণ (যেমন NaCl, CaSO₄) যা লিটমাসের রং পরিবর্তন করে না।",
    "highlights": [
        "এসিড নীল লিটমাসকে লাল করে এবং ক্ষারক লাল লিটমাসকে নীল করে।",
        "লেবুতে সাইট্রিক, তেঁতুলে টারটারিক, আমলকিতে এসকরবিক (ভিটামিন সি) এবং আপেল-আনারসে ম্যালিক এসিড থাকে।",
        "পানিতে এসিড হাইড্রোজেন আয়ন ($H^+$) এবং ক্ষারক হাইড্রক্সিল আয়ন ($OH^-$) উৎপন্ন করে।",
        "পানিতে দ্রবণীয় ক্ষারককে ক্ষার বলে; তাই সকল ক্ষার ক্ষারক হলেও সকল ক্ষারক ক্ষার নয় [যেমন $Al(OH)_3$]।",
        "পেটের এসিডিটি নিরাময়ে ব্যবহৃত এন্টাসিড মূলত ম্যাগনেসিয়াম হাইড্রক্সাইড $[Mg(OH)_2]$ এর সাসপেনশন (Milk of Magnesia)।",
        "একটি দেশ কতটা শিল্পোন্নত তা বিচার করা হয় সে দেশ কতটুকু সালফিউরিক এসিড ($H_2SO_4$) ব্যবহার করে।",
        "এসিড ও ক্ষারকের প্রশমন বিক্রিয়ায় নিরপেক্ষ লবণ ও পানি তৈরি হয় ($NaOH + HCl \\rightarrow NaCl + H_2O$)।",
        "খাবার লবণ ($NaCl$) ও বিশুদ্ধ পানি নিরপেক্ষ পদার্থ, ফলে এরা লিটমাস কাগজের রং পরিবর্তন করে না।"
    ],
    "definitions": [
        { "term": "অম্ল বা এসিড (Acid)", "desc": "যে সকল রাসায়নিক পদার্থে এক বা একাধিক হাইড্রোজেন পরমাণু থাকে এবং যারা পানিতে হাইড্রোজেন আয়ন (H⁺) প্রদান করে।" },
        { "term": "ক্ষারক (Base)", "desc": "ধাতব বা ধাতুর মতো ক্রিয়াশীল অক্সাইড ও হাইড্রক্সাইড যা পানিতে হাইড্রক্সিল আয়ন (OH⁻) তৈরি করে এবং এসিডকে প্রশমিত করে।" },
        { "term": "ক্ষার (Alkali)", "desc": "যে সকল ক্ষারক পানিতে সহজে দ্রবীভূত হয় তাদেরকে ক্ষার বলে (যেমন: NaOH, KOH)।" },
        { "term": "নির্দেশক (Indicator)", "desc": "যে সকল পদার্থ নিজেদের রঙের পরিবর্তনের মাধ্যমে কোনো দ্রবণ অম্ল, ক্ষারকীয় না নিরপেক্ষ তা নির্দেশ করে (যেমন: লিটমাস, মিথাইল অরেঞ্জ)।" },
        { "term": "প্রশমন বিক্রিয়া ও লবণ (Neutralization & Salt)", "desc": "এসিড ও ক্ষারকের বিক্রিয়ায় পরস্পরের ধর্ম নষ্ট হয়ে নিরপেক্ষ লবণ ও পানি উৎপন্ন হওয়ার প্রক্রিয়াকে প্রশমন বলে।" }
    ],
    "formulas": [
        { "tag": "এসিডের বিয়োজন", "expr": "HCl \\rightarrow H^+ + Cl^-", "note": "পানিতে হাইড্রোজেন আয়ন প্রদান।" },
        { "tag": "ক্ষারকের বিয়োজন", "expr": "NaOH \\rightarrow Na^+ + OH^-", "note": "পানিতে হাইড্রক্সিল আয়ন প্রদান।" },
        { "tag": "প্রশমন সমীকরণ", "expr": "Ca(OH)_2 + H_2SO_4 \\rightarrow CaSO_4 + 2H_2O", "note": "চুনের পানি + সালফিউরিক এসিড = ক্যালসিয়াম সালফেট লবণ + পানি।" }
    ]
};

['curriculum_data.js', 'www/curriculum_data.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('"c8_c10"')) {
        const insertion = '    "c8_c10": ' + JSON.stringify(c8_c10_obj, null, 8).replace(/^/gm, '    ').trim() + ',\n';
        content = content.replace('"hsc2_c1":', insertion + '    "hsc2_c1":');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', file);
    }
});

// 5. Update app.js & www/app.js
const appChapterEntry = `            {
                id: "c8_c10", num: 10,
                title: "অধ্যায় ১০: অম্ল, ক্ষারক ও লবণ",
                desc:  "এসিড ও ক্ষারকের বৈশিষ্ট্য, লিটমাস নির্দেশক, এন্টাসিডের ভূমিকা, জৈব ও খনিজ এসিড এবং লবণ প্রস্তুতি।"
            },
`;

['app.js', 'www/app.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('"c8_c10"')) {
        content = content.replace(/([ \t]*{\r?\n[ \t]*id:\s*"c8_c11")/, appChapterEntry + '$1');
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
    if (!content.includes('class8_ch10.js')) {
        content = content.replace('<script src="data/exams/class8_ch9.js"></script>',
            '<script src="data/exams/class8_ch9.js"></script>\n    <script src="data/exams/class8_ch10.js"></script>'
        );
    }
    
    // update modal text
    content = content.replace('১ম থেকে ৯ম অধ্যায়ের ৯৪৫টি স্পেশাল প্রশ্ন, ৪৭টি ওএমআর পরীক্ষা', '১ম থেকে ১০ম অধ্যায়ের ১০৫০টি স্পেশাল প্রশ্ন, ৫২টি ওএমআর পরীক্ষা');
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Updated', file);
});

console.log('All updates complete for Chapter 10!');
