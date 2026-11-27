const fs = require('fs');

function parseMarkdownQuestions(filePath, chapNum, chapName) {
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
    let currentQ = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Check Set Header: ## সেট ১ — 15টি প্রশ্ন
        const setMatch = line.match(/^##\s*সেট\s*([১-৫1-5])/);
        if (setMatch) {
            const digitMap = { '১': 0, '২': 1, '৩': 2, '৪': 3, '৫': 4, '1': 0, '2': 1, '3': 2, '4': 3, '5': 4 };
            currentSetIdx = digitMap[setMatch[1]] ?? -1;
            continue;
        }

        // Check Question header: **1.1. জীবদেহে কয় ধরনের কোষ বিভাজন দেখা যায়?** (ID: `C8-CH02-S1-01`, বই পৃ. ১৩)
        // or multiline question
        const qMatch = line.match(/^\*\*(\d+)\.(\d+)\.\s*(.+)/);
        if (qMatch && currentSetIdx >= 0) {
            if (currentQ) {
                sets[currentSetIdx].questions.push(currentQ);
            }
            let qText = qMatch[3].trim();
            // clean up trailing ** and ID
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

        // Check option: - ক) দুই ধরনের
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

        // Check correct answer line: - **সঠিক উত্তর: গ) তিন ধরনের**
        const ansMatch = line.match(/^\*\*সঠিক উত্তর:\s*([ক-ঘ])\)\s*(.+?)\*\*/);
        if (ansMatch) {
            currentQ.ans_letter = ansMatch[1];
            currentQ.ans_text = ansMatch[2].trim();
            currentQ.correct = { 'ক': 0, 'খ': 1, 'গ': 2, 'ঘ': 3 }[ansMatch[1]] ?? 0;
            continue;
        }

        // Check explanation line: - **ব্যাখ্যা:** ...
        const expMatch = line.match(/^[-\*]*\s*\*\*ব্যাখ্যা:\*\*\s*(.+)$/);
        if (expMatch) {
            currentQ.exp = expMatch[1].trim();
            continue;
        }

        // Check reference line: - **রেফারেন্স:** ...
        const refMatch = line.match(/^[-\*]*\s*\*\*রেফারেন্স:\*\*\s*(.+)$/);
        if (refMatch) {
            currentQ.reference = refMatch[1].trim();
            continue;
        }

        // Additional question lines (e.g. Roman numeral stem lines) before options
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

const f1 = 'C:/Users/HP/.gemini/antigravity/brain/1a540e72-be27-419b-b550-caf675249bca/.user_uploaded/media_1795799110484_21e86386.md'; // Ch 1
const f2 = 'C:/Users/HP/.gemini/antigravity/brain/1a540e72-be27-419b-b550-caf675249bca/.user_uploaded/media_1795799110484_74b68bbf.md'; // Ch 2

const ch1Data = parseMarkdownQuestions(f1, 1, 'প্রাণিজগতের শ্রেণিবিন্যাস');
const ch2Data = parseMarkdownQuestions(f2, 2, 'জীবের বৃদ্ধি ও বংশগতি');

console.log('--- Chapter 1 ---');
let total1 = 0;
ch1Data.sets.forEach(s => {
    console.log(`Set ${s.setNum}: ${s.questions.length} Qs`);
    total1 += s.questions.length;
});
console.log('Total Ch 1:', total1);

console.log('--- Chapter 2 ---');
let total2 = 0;
ch2Data.sets.forEach(s => {
    console.log(`Set ${s.setNum}: ${s.questions.length} Qs`);
    total2 += s.questions.length;
});
console.log('Total Ch 2:', total2);

const js1 = `// Class 8 Science Chapter 01 Board Standard Exam Bank (5 Sets, 105 MCQs)
window.CLASS8_EXAM_BANK = window.CLASS8_EXAM_BANK || {};
window.CLASS8_EXAM_BANK[1] = ${JSON.stringify(ch1Data, null, 2)};
`;

const js2 = `// Class 8 Science Chapter 02 Board Standard Exam Bank (5 Sets, 105 MCQs)
window.CLASS8_EXAM_BANK = window.CLASS8_EXAM_BANK || {};
window.CLASS8_EXAM_BANK[2] = ${JSON.stringify(ch2Data, null, 2)};
`;

fs.writeFileSync('data/exams/class8_ch1.js', js1);
fs.writeFileSync('data/exams/class8_ch2.js', js2);
fs.writeFileSync('www/data/exams/class8_ch1.js', js1);
fs.writeFileSync('www/data/exams/class8_ch2.js', js2);

console.log('Generated data/exams/class8_ch1.js and class8_ch2.js successfully!');
