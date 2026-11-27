const fs = require('fs');
const { parseMarkdownQuestions } = require('./parse_c8_helper');

// Read the prompt text or transcript containing the two chapters
// We can extract ch1 and ch2 directly from conversation transcript or write a dedicated parser
const transcriptPath = 'C:/Users/HP/.gemini/antigravity/brain/1a540e72-be27-419b-b550-caf675249bca/.system_generated/logs/transcript.jsonl';
const transcript = fs.readFileSync(transcriptPath, 'utf8');

// Find the last user message containing the questions
const lines = transcript.split('\n');
let userMsg = '';
for (let i = lines.length - 1; i >= 0; i--) {
    if (!lines[i].trim()) continue;
    try {
        const entry = JSON.parse(lines[i]);
        const text = JSON.stringify(entry);
        if (text.includes('প্রাণিজগতের শ্রেণিবিন্যাস') && text.includes('জীবের বৃদ্ধি ও বংশগতি')) {
            userMsg = text;
            break;
        }
    } catch(e) {}
}

console.log('Found user message in transcript? length:', userMsg.length);

// Extract chapter 1 and chapter 2 text
// In prompt:
// First came Chapter 2: # অষ্টম শ্রেণি বিজ্ঞান — অধ্যায় ২: জীবের বৃদ্ধি ও বংশগতি — ১০৫টি MCQ
// Then came Chapter 1: # অষ্টম শ্রেণি বিজ্ঞান — অধ্যায় ১: প্রাণিজগতের শ্রেণিবিন্যাস — ১০৫টি MCQ

const unescaped = JSON.parse(userMsg);
let fullText = '';
if (typeof unescaped === 'object') {
    // search in fields
    function searchStr(o) {
        if (typeof o === 'string' && o.includes('প্রাণিজগতের শ্রেণিবিন্যাস')) return o;
        if (typeof o === 'object' && o !== null) {
            for (let k in o) {
                const res = searchStr(o[k]);
                if (res) return res;
            }
        }
        return '';
    }
    fullText = searchStr(unescaped);
}

console.log('FullText length:', fullText.length);

const ch2Header = '# অষ্টম শ্রেণি বিজ্ঞান — অধ্যায় ২: জীবের বৃদ্ধি ও বংশগতি';
const ch1Header = '# অষ্টম শ্রেণি বিজ্ঞান — অধ্যায় ১: প্রাণিজগতের শ্রেণিবিন্যাস';

const idx2 = fullText.indexOf(ch2Header);
const idx1 = fullText.indexOf(ch1Header);

console.log('idx2:', idx2, 'idx1:', idx1);

let ch2Text = '';
let ch1Text = '';

if (idx2 < idx1) {
    ch2Text = fullText.substring(idx2, idx1);
    ch1Text = fullText.substring(idx1);
} else {
    ch1Text = fullText.substring(idx1, idx2);
    ch2Text = fullText.substring(idx2);
}

console.log('ch1Text length:', ch1Text.length, 'ch2Text length:', ch2Text.length);

const ch1Data = parseMarkdownQuestions(ch1Text, 1, 'প্রাণিজগতের শ্রেণিবিন্যাস');
const ch2Data = parseMarkdownQuestions(ch2Text, 2, 'জীবের বৃদ্ধি ও বংশগতি');

console.log('CH1 Sets:');
ch1Data.sets.forEach(s => console.log('Set', s.setNum, ':', s.questions.length, 'questions'));
console.log('CH2 Sets:');
ch2Data.sets.forEach(s => console.log('Set', s.setNum, ':', s.questions.length, 'questions'));

// Write data/exams/class8_ch1.js and class8_ch2.js
const file1Content = `// Class 8 Science Chapter 01 Board Standard Exam Bank (5 Sets, 105 MCQs)
window.CLASS8_EXAM_BANK = window.CLASS8_EXAM_BANK || {};
window.CLASS8_EXAM_BANK[1] = ${JSON.stringify(ch1Data, null, 2)};
`;

const file2Content = `// Class 8 Science Chapter 02 Board Standard Exam Bank (5 Sets, 105 MCQs)
window.CLASS8_EXAM_BANK = window.CLASS8_EXAM_BANK || {};
window.CLASS8_EXAM_BANK[2] = ${JSON.stringify(ch2Data, null, 2)};
`;

fs.writeFileSync('data/exams/class8_ch1.js', file1Content);
fs.writeFileSync('data/exams/class8_ch2.js', file2Content);
fs.writeFileSync('www/data/exams/class8_ch1.js', file1Content);
fs.writeFileSync('www/data/exams/class8_ch2.js', file2Content);

console.log('Both class8 exam files written successfully!');
