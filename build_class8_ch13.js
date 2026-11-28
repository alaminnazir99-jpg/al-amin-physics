const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/HP/.gemini/antigravity/scratch/al-amin-physics';

function parseMarkdownQuestionsAccurate(filePath, chapNum, chapName) {
    const mdText = fs.readFileSync(filePath, 'utf8');
    const lines = mdText.split(/\r?\n/);

    const sets = [
        { id: "set1", setNum: 1, title: "সেট ০১: সহজ (পুষ্টি উপাদান, খাদ্যের কাজ ও শর্করা • ফ্রি ট্রায়াল)", difficulty: "সহজ", difficultyLevel: "easy", badgeColor: "emerald", qCount: 15, timeMinutes: 15, fullMarks: 15, isFree: true, desc: "খাদ্য ও পুষ্টির সংজ্ঞা, খাদ্যের ৩টি প্রধান কাজ এবং শর্করা বা কার্বোহাইড্রেটের উৎস ও গঠন।", questions: [] },
        { id: "set2", setNum: 2, title: "সেট ০২: সহজ-মাঝারি (আমিষ, স্নেহ ও ক্যালরি হিসাব)", difficulty: "সহজ-মাঝারি", difficultyLevel: "easy-medium", badgeColor: "blue", qCount: 15, timeMinutes: 15, fullMarks: 15, isFree: false, desc: "আমিষের অ্যামাইনো এসিড, স্নেহ পদার্থ, তাপশক্তি উৎপাদন ও ক্যালরি-কিলোক্যালরি রূপান্তর।", questions: [] },
        { id: "set3", setNum: 3, title: "সেট ০৩: বোর্ড স্ট্যান্ডার্ড (ভিটামিন, খনিজ লবণ, পানি ও রাফেজ)", difficulty: "মাঝারি", difficultyLevel: "medium", badgeColor: "indigo", qCount: 25, timeMinutes: 25, fullMarks: 25, isFree: false, desc: "ভিটামিন A, B-কমপ্লেক্স, C, D, E, K; খনিজ লবণ (ক্যালসিয়াম, ফসফরাস, লৌহ, আয়োডিন), পানি ও খাদ্য আঁশ (রাফেজ)।", questions: [] },
        { id: "set4", setNum: 4, title: "সেট ০৪: কঠিন (পুষ্টির অভাবজনিত রোগ ও প্রতিকার)", difficulty: "কঠিন", difficultyLevel: "hard", badgeColor: "purple", qCount: 25, timeMinutes: 25, fullMarks: 25, isFree: false, desc: "কোয়াশিয়রকর, মেরাসমাস, স্কার্ভি, রিকেটস, রক্তশূন্যতা, গলগণ্ড ও রাতকানা রোগের লক্ষণ ও প্রতিরোধ।", questions: [] },
        { id: "set5", setNum: 5, title: "সেট ০৫: চ্যালেঞ্জ (সুষম খাদ্য তালিকা, উদ্দীপক ও খাদ্য সংরক্ষণ)", difficulty: "চ্যালেঞ্জ", difficultyLevel: "challenge", badgeColor: "amber", qCount: 25, timeMinutes: 25, fullMarks: 25, isFree: false, desc: "দৈনিক সুষম খাদ্য তালিকা প্রস্তুতকরণ, খাদ্য পিরামিড, রাসায়নিক অপব্যবহার রোধ ও বৈজ্ঞানিক সংরক্ষণ।", questions: [] }
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
            let qId = `C8-CH13-S${currentSetIdx + 1}-${qMatch[2].padStart(2, '0')}`;
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

// 1. Parse Chapter 13
const ch13Data = parseMarkdownQuestionsAccurate(path.join(baseDir, 'c8_ch13_raw.md'), 13, 'খাদ্য ও পুষ্টি');
console.log('--- Chapter 13 Sets ---');
let total13 = 0;
ch13Data.sets.forEach(s => {
    console.log(`Set ${s.setNum}: ${s.questions.length} Qs`);
    total13 += s.questions.length;
});
console.log('Total Chapter 13 Questions:', total13);

if (total13 !== 105) {
    console.error('ERROR: Chapter 13 Total questions is not 105! Found:', total13);
    process.exit(1);
}

// 2. Generate class8_ch13.js
const ch13Js = `// Class 8 Science Chapter 13 Board Standard Exam Bank (5 Sets, 105 MCQs)
window.CLASS8_EXAM_BANK = window.CLASS8_EXAM_BANK || {};
window.CLASS8_EXAM_BANK[13] = ${JSON.stringify(ch13Data, null, 2)};
`;
fs.writeFileSync(path.join(baseDir, 'data/exams/class8_ch13.js'), ch13Js, 'utf8');
fs.writeFileSync(path.join(baseDir, 'www/data/exams/class8_ch13.js'), ch13Js, 'utf8');
console.log('Written class8_ch13.js to data/exams/ and www/data/exams/');

// 3. Update js/class8-mcq-master-course.js & www/js/class8-mcq-master-course.js
['js/class8-mcq-master-course.js', 'www/js/class8-mcq-master-course.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    let c8MasterJs = fs.readFileSync(fullPath, 'utf8');
    
    // Update config
    c8MasterJs = c8MasterJs.replace('totalExams: 62,', 'totalExams: 67,');
    c8MasterJs = c8MasterJs.replace('totalQuestionsPool: 1260,', 'totalQuestionsPool: 1365,');

    // Update chapters array
    if (!c8MasterJs.includes("id: 'c8_c13'")) {
        c8MasterJs = c8MasterJs.replace(
            "{ num: 12, id: 'c8_c12', name: 'মহাকাশ ও উপগ্রহ', qCount: 105 }",
            "{ num: 12, id: 'c8_c12', name: 'মহাকাশ ও উপগ্রহ', qCount: 105 },\n            { num: 13, id: 'c8_c13', name: 'খাদ্য ও পুষ্টি', qCount: 105 }"
        );
    }

    // Update chaps in getAllExamDefinitions
    if (!c8MasterJs.includes('num: 13, name: "খাদ্য ও পুষ্টি"')) {
        c8MasterJs = c8MasterJs.replace(
            '{ num: 12, name: "মহাকাশ ও উপগ্রহ" }',
            '{ num: 12, name: "মহাকাশ ও উপগ্রহ" },\n            { num: 13, name: "খাদ্য ও পুষ্টি" }'
        );
    }

    // Update combined test
    c8MasterJs = c8MasterJs.replace(
        "title: 'অধ্যায় ১ থেকে ১২ সমন্বিত রিভিশন টেস্ট',\n            desc: 'প্রথম বারোটি অধ্যায় থেকে নির্বাচিত ৭৫টি গুরুত্বপূর্ণ বোর্ড স্ট্যান্ডার্ড প্রশ্নের সমন্বিত পরীক্ষা।',\n            qCount: 75,\n            timeMinutes: 75,\n            fullMarks: 75,\n            difficulty: 'medium',\n            difficultyLabel: 'সমন্বিত মডেল টেস্ট',\n            category: 'সমন্বিত টেস্ট',\n            chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],",
        "title: 'অধ্যায় ১ থেকে ১৩ সমন্বিত রিভিশন টেস্ট',\n            desc: 'প্রথম তেরোটি অধ্যায় থেকে নির্বাচিত ৮০টি গুরুত্বপূর্ণ বোর্ড স্ট্যান্ডার্ড প্রশ্নের সমন্বিত পরীক্ষা।',\n            qCount: 80,\n            timeMinutes: 80,\n            fullMarks: 80,\n            difficulty: 'medium',\n            difficultyLabel: 'সমন্বিত মডেল টেস্ট',\n            category: 'সমন্বিত টেস্ট',\n            chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],"
    );

    // Update final mock
    c8MasterJs = c8MasterJs.replace(
        "desc: '১২৬০টি প্রশ্নের সম্পূর্ণ পুল থেকে নির্বাচিত ৫০টি প্রশ্নের চূড়ান্ত মডেল টেস্ট।',\n            qCount: 50,\n            timeMinutes: 50,\n            fullMarks: 50,\n            difficulty: 'challenge',\n            difficultyLabel: 'গ্র্যান্ড ফাইনাল মক',\n            category: 'ফাইনাল মক',\n            chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],",
        "desc: '১৩৬৫টি প্রশ্নের সম্পূর্ণ পুল থেকে নির্বাচিত ৫০টি প্রশ্নের চূড়ান্ত মডেল টেস্ট।',\n            qCount: 50,\n            timeMinutes: 50,\n            fullMarks: 50,\n            difficulty: 'challenge',\n            difficultyLabel: 'গ্র্যান্ড ফাইনাল মক',\n            category: 'ফাইনাল মক',\n            chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],"
    );

    fs.writeFileSync(fullPath, c8MasterJs, 'utf8');
    console.log('Updated', file);
});

// 4. Update curriculum_data.js & www/curriculum_data.js
const c8_c13_obj = {
    "num": 13,
    "title": "অধ্যায় ১৩: খাদ্য ও পুষ্টি",
    "tag": "Class 8 Science Chapter 13",
    "desc": "খাদ্য ও পুষ্টির ধারণা এবং খাদ্যের ৩টি কাজ; প্রধান ৬টি উপাদান (শর্করা, আমিষ, স্নেহ, ভিটামিন, খনিজ লবণ, পানি ও রাফেজ); পুষ্টির অভাবজনিত রোগসমূহ (কোয়াশিয়রকর, মেরাসমাস, রিকেটস, স্কার্ভি, গলগণ্ড, রাতকানা) এবং সুষম খাদ্যের তালিকা প্রণয়ন ও ক্যালরি হিসাব।",
    "summary": "জীবদেহের গঠন, বৃদ্ধি, ক্ষয়পূরণ, শক্তি উৎপাদন ও রোগ প্রতিরোধের জন্য যে সকল জৈব ও অজৈব উপাদান গ্রহণ করা হয় তাকে খাদ্য বলে। খাদ্যের ৬টি মূল উপাদান রয়েছে: শর্করা (তাপ ও শক্তি যোগায়), আমিষ (দেহ গঠন ও ক্ষয়পূরণ করে), স্নেহ (সর্বাধিক তাপশক্তি উৎপাদন করে), ভিটামিন ও খনিজ লবণ (রোগ প্রতিরোধ ও শারীরবৃত্তীয় কাজ নিয়ন্ত্রণ করে) এবং পানি ও রাফেজ বা অপাচ্য আঁশ (কোষ্ঠকাঠিন্য দূর করে)। প্রোটিনের অভাবে শিশুদের কোয়াশিয়রকর ও মেরাসমাস রোগ হয়। ভিটামিন A-এর অভাবে রাতকানা ও জেরোপথ্যালমিয়া, ভিটামিন C-এর অভাবে স্কার্ভি, ভিটামিন D ও ক্যালসিয়ামের অভাবে রিকেটস এবং অস্টিওম্যালাসিয়া, এবং আয়োডিনের অভাবে গলগণ্ড বা ঘ্যাগ রোগ হয়। সুষম খাদ্য হলো এমন খাদ্য যাতে ৬টি উপাদানই দেহের প্রয়োজন অনুযায়ী নির্দিষ্ট পরিমাণে বিদ্যমান থাকে। ১ গ্রাম শর্করা থেকে ৪ কিলোক্যালরি, ১ গ্রাম আমিষ থেকে ৪ কিলোক্যালরি এবং ১ গ্রাম স্নেহ পদার্থ থেকে ৯ কিলোক্যালরি শক্তি পাওয়া যায়।",
    "highlights": [
        "খাদ্য দেহে ৩টি প্রধান কাজ করে: ১) বৃদ্ধি সাধন, ক্ষয়পূরণ ও রক্ষণাবেক্ষণ, ২) তাপশক্তি ও কর্মশক্তি প্রদান, ৩) রোগ প্রতিরোধ ও শারীরিক সুস্থতা রক্ষা।",
        "পুষ্টি হলো একটি জটিল প্রক্রিয়া যাতে জটিল খাদ্য উপাদান ভেঙে দেহে শোষণ উপযোগী হয়।",
        "শর্করা দেহে দ্রুত শক্তি যোগায়; গ্লুকোজ ও শ্বেতসার শর্করার উদাহরণ।",
        "আমিষের ক্ষুদ্রতম গঠন একক অ্যামাইনো এসিড; এর অভাবে কোয়াশিয়রকর ও মেরাসমাস রোগ হয়।",
        "স্নেহ পদার্থ দেহে সঞ্চিত শক্তি হিসেবে কাজ করে এবং সবচেয়ে বেশি তাপ (১ গ্রামে ৯ কিলোক্যালরি) দেয়।",
        "ভিটামিন চর্বিতে দ্রবণীয় (A, D, E, K) এবং পানিতে দ্রবণীয় (B-কমপ্লেক্স, C) দুই শ্রেণিতে বিভক্ত।",
        "আয়োডিনের অভাবে গলগণ্ড বা ঘ্যাগ এবং থাইরয়েড গ্রন্থি ফুলে যায়; লৌহের অভাবে রক্তশূন্যতা বা অ্যানিমিয়া হয়।",
        "রাফেজ বা খাদ্য আঁশ মলাশয় পরিষ্কার রাখে এবং অন্ত্রের ক্যান্সার ও কোষ্ঠকাঠিন্য প্রতিরোধ করে।"
    ],
    "definitions": [
        { "term": "খাদ্য (Food)", "desc": "যে সকল জৈব ও পুষ্টিকর উপাদান জীবদেহ গঠন, বৃদ্ধি, ক্ষয়পূরণ, তাপশক্তি উৎপাদন ও রোগ প্রতিরোধে সহায়তা করে।" },
        { "term": "পুষ্টি (Nutrition)", "desc": "যে প্রক্রিয়ায় খাদ্যবস্তু পরিপাক ও শোষিত হয়ে দেহের বিভিন্ন শারীরবৃত্তীয় কাজের জন্য ব্যবহৃত হয়।" },
        { "term": "সুষম খাদ্য (Balanced Diet)", "desc": "যে খাদ্যে খাদ্যের ৬টি উপাদানই নির্দিষ্ট অনুপাতে ও গুণগত মানে দেহের চাহিদা অনুযায়ী বিদ্যমান থাকে।" },
        { "term": "রাফেজ (Roughage)", "desc": "উদ্ভিজ্জ খাদ্যের অপাচ্য সেলুলোজ বা আঁশ জাতীয় অংশ যা হজম হয় না কিন্তু পরিপাকনালি সুস্থ রাখে ও মলত্যাগে সাহায্য করে।" },
        { "term": "কিলোক্যালরি (Kilocalorie)", "desc": "১ কিলোগ্রাম পানির তাপমাত্রা ১ ডিগ্রি সেলসিয়াস বৃদ্ধি করতে যে পরিমাণ তাপশক্তির প্রয়োজন হয়।" }
    ],
    "formulas": [
        { "tag": "খাদ্যের ক্যালরি মান", "expr": "E = (m_c \\times 4) + (m_p \\times 4) + (m_f \\times 9) \\text{ kcal}", "note": "শর্করা ও আমিষে ৪ kcal/g, স্নেহে ৯ kcal/g শক্তি থাকে।" },
        { "tag": "ক্যালরি রূপান্তর", "expr": "1 \\text{ kcal} = 1000 \\text{ cal} \\approx 4.184 \\text{ kJ}", "note": "কিলোক্যালরি থেকে কিলোঝুলে রূপান্তর।" }
    ]
};

['curriculum_data.js', 'www/curriculum_data.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    
    if (!content.includes('"c8_c13"')) {
        const insertion13 = '    "c8_c13": ' + JSON.stringify(c8_c13_obj, null, 8).replace(/^/gm, '    ').trim() + ',\n';
        content = content.replace('"hsc2_c1":', insertion13 + '    "hsc2_c1":');
    }
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Updated', file);
});

// 5. Update app.js & www/app.js
['app.js', 'www/app.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    
    if (!content.includes('c8_c13')) {
        const target = '                id: "c8_c12", num: 12,\n                title: "অধ্যায় ১২: মহাকাশ ও উপগ্রহ",\n                desc:  "সৌরজগৎ, কৃত্রিম উপগ্রহ, কক্ষপথ, মুক্তিবেগ এবং মহাবিশ্বের গঠন সম্পর্কে প্রাথমিক ধারণা।"\n            }';
        const replacement = target + ',\n            {\n                id: "c8_c13", num: 13,\n                title: "অধ্যায় ১৩: খাদ্য ও পুষ্টি",\n                desc:  "খাদ্যের উপাদান, ভিটামিন ও খনিজের অভাবজনিত রোগ, সুষম খাদ্য তালিকা এবং ক্যালরি হিসাব।"\n            }';
        content = content.replace(target, replacement);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', file);
    }
});

// 6. Update study.html & www/study.html
['study.html', 'www/study.html'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // add scripts
    if (!content.includes('class8_ch13.js')) {
        content = content.replace('<script src="data/exams/class8_ch12.js"></script>',
            '<script src="data/exams/class8_ch12.js"></script>\n    <script src="data/exams/class8_ch13.js"></script>'
        );
    }
    
    // update modal text
    content = content.replace('১ম থেকে ১২শ অধ্যায়ের ১২৬০টি স্পেশাল প্রশ্ন, ৬২টি ওএমআর পরীক্ষা', '১ম থেকে ১৩শ অধ্যায়ের ১৩৬৫টি স্পেশাল প্রশ্ন, ৬৭টি ওএমআর পরীক্ষা');
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Updated', file);
});

console.log('All updates complete for Chapter 13!');
