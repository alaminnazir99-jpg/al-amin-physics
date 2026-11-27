const fs = require('fs');

function parseMarkdownQuestions(mdText, chapNum, chapName) {
    const sets = [
        { id: "set1", setNum: 1, title: "সেট ০১: সহজ (জ্ঞান ও মৌলিক ধারণা)", difficulty: "সহজ", difficultyLevel: "easy", badgeColor: "emerald", qCount: 15, timeMinutes: 15, fullMarks: 15, desc: "মৌলিক সংজ্ঞা, বৈশিষ্ট্য ও ধারণা সম্পর্কিত বহুনির্বাচনী প্রশ্ন।", questions: [] },
        { id: "set2", setNum: 2, title: "সেট ০২: সহজ-মাঝারি (প্রয়োগ ও মূলনীতি)", difficulty: "সহজ-মাঝারি", difficultyLevel: "easy-medium", badgeColor: "blue", qCount: 15, timeMinutes: 15, fullMarks: 15, desc: "মূলনীতি, উদাহরণ ও বাস্তব প্রয়োগভিত্তিক প্রশ্ন।", questions: [] },
        { id: "set3", setNum: 3, title: "সেট ০৩: বোর্ড স্ট্যান্ডার্ড (সমন্বিত মডেল টেস্ট - ক)", difficulty: "মাঝারি", difficultyLevel: "medium", badgeColor: "indigo", qCount: 25, timeMinutes: 25, fullMarks: 25, desc: "বোর্ড স্ট্যান্ডার্ড পূর্ণাঙ্গ সমন্বিত মডেল টেস্ট।", questions: [] },
        { id: "set4", setNum: 4, title: "সেট ০৪: কঠিন (গাণিতিক ও উচ্চতর দক্ষতা)", difficulty: "কঠিন", difficultyLevel: "hard", badgeColor: "purple", qCount: 25, timeMinutes: 25, fullMarks: 25, desc: "উদ্দীপকভিত্তিক, বহুপদী সমাপ্তিসূচক ও বিশ্লেষণধর্মী প্রশ্ন।", questions: [] },
        { id: "set5", setNum: 5, title: "সেট ০৫: চ্যালেঞ্জ (মাস্টার বোর্ড মক টেস্ট - খ)", difficulty: "চ্যালেঞ্জ", difficultyLevel: "challenge", badgeColor: "amber", qCount: 25, timeMinutes: 25, fullMarks: 25, desc: "টপ গ্রেড ও নিখুঁত প্রস্তুতির জন্য চূড়ান্ত চ্যালেঞ্জিং প্রশ্নাবলি।", questions: [] }
    ];

    const lines = mdText.split('\n');
    let currentSetIdx = -1;
    let currentQ = null;
    let state = 'NONE'; // 'OPTIONS', 'EXP'

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Check set header
        const setMatch = line.match(/^##\s*সেট\s*([১-৫1-5])/);
        if (setMatch) {
            const sNum = parseInt(setMatch[1].replace(/[১-৫]/, m => ({ '১':1, '২':2, '৩':3, '৪':4, '৫':5 }[m])));
            currentSetIdx = sNum - 1;
            continue;
        }

        // Check Question header: **1.1. জীবদেহে ...** (ID: `...`, বই পৃ. ...)
        const qMatch = line.match(/^\*\*(\d+)\.(\d+)\.\s*(.+?)\*\*\s*(?:\(ID:\s*`([^`]+)`.*?\))?/);
        if (qMatch && currentSetIdx >= 0) {
            if (currentQ) {
                sets[currentSetIdx].questions.push(currentQ);
            }
            const setPart = parseInt(qMatch[1]);
            const qPart = parseInt(qMatch[2]);
            const qTitle = qMatch[3].trim();
            const qId = qMatch[4] || `c8_ch${chapNum}_s${currentSetIdx + 1}_q${qPart}`;

            currentQ = {
                id: qId,
                num: sets[currentSetIdx].questions.length + 1,
                q: qTitle,
                options: [],
                correct: 0,
                ans_letter: "ক",
                ans_text: "",
                exp: "",
                reference: ""
            };
            state = 'OPTIONS';
            continue;
        }

        if (!currentQ) continue;

        // Options: - ক) ... or - ক) ... ✓
        const optMatch = line.match(/^-\s*([ক-ঘa-dA-D])\)\s*(.+)$/);
        if (optMatch && state === 'OPTIONS') {
            const letter = optMatch[1];
            let optText = optMatch[2].trim();
            const isMarkedCorrect = optText.includes('✓');
            optText = optText.replace('✓', '').trim();
            const optIndex = { 'ক': 0, 'খ': 1, 'গ': 2, 'ঘ': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'A': 0, 'B': 1, 'C': 2, 'D': 3 }[letter] ?? currentQ.options.length;

            currentQ.options.push(optText);
            if (isMarkedCorrect) {
                currentQ.correct = optIndex;
                currentQ.ans_letter = letter;
                currentQ.ans_text = optText;
            }
            continue;
        }

        // Correct Answer line: - **সঠিক উত্তর: গ) তিন ধরনের**
        const ansMatch = line.match(/^\*\*সঠিক উত্তর:\s*([ক-ঘ])\)\s*(.+?)\*\*/);
        if (ansMatch) {
            const l = ansMatch[1];
            const t = ansMatch[2].trim();
            currentQ.ans_letter = l;
            currentQ.ans_text = t;
            currentQ.correct = { 'ক': 0, 'খ': 1, 'গ': 2, 'ঘ': 3 }[l] ?? 0;
            state = 'AFTER_ANS';
            continue;
        }

        // Explanation line: - **ব্যাখ্যা:** ...
        const expMatch = line.match(/^\*\*ব্যাখ্যা:\*\*\s*(.+)$/);
        if (expMatch) {
            currentQ.exp = expMatch[1].trim();
            continue;
        }

        // Reference line: - **রেফারেন্স:** ...
        const refMatch = line.match(/^\*\*রেফারেন্স:\*\*\s*(.+)$/);
        if (refMatch) {
            currentQ.reference = refMatch[1].trim();
            continue;
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

module.exports = { parseMarkdownQuestions };
