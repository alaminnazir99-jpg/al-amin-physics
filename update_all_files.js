const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/HP/.gemini/antigravity/scratch/al-amin-physics';

// 1. Update curriculum_data.js & www/curriculum_data.js
const c8_c3_obj = {
    "num": 3,
    "title": "অধ্যায় ৩: ব্যাপন, অভিস্রবণ ও প্রস্বেদন",
    "tag": "Class 8 Science Chapter 3",
    "desc": "ব্যাপন, অভিস্রবণ, অভিস্রবণীয় চাপ, প্লাজমোলাইসিস, উদ্ভিদে পানি ও খনিজ লবণ শোষণ, প্রস্বেদনের প্রকারভেদ এবং উদ্ভিদের জীবনে প্রস্বেদনের তাৎপর্য।",
    "summary": "উদ্ভিদ ও প্রাণীর বিভিন্ন শারীরবৃত্তীয় কার্যাবলী যেমন পুষ্টি, শ্বসন ও রেচন সুষ্ঠুভাবে পরিচালনার জন্য ব্যাপন, অভিস্রবণ ও প্রস্বেদন অত্যন্ত গুরুত্বপূর্ণ প্রক্রিয়া। ব্যাপন প্রক্রিয়ায় অণুগুলো বেশি ঘনত্বের এলাকা থেকে কম ঘনত্বের এলাকায় ছড়িয়ে পড়ে। অভিস্রবণ হলো অর্ধভেদ্য পর্দার মধ্য দিয়ে দ্রাবকের কম ঘনত্বের দ্রবণ থেকে বেশি ঘনত্বের দ্রবণে গমন। উদ্ভিদের মূলরোমের মাধ্যমে পানি ও খনিজ লবণ পরিশোষণ অভিস্রবণ ও ব্যাপন প্রক্রিয়ায় ঘটে। উদ্ভিদ তার দেহাভ্যন্তর থেকে অতিরিক্ত পানি বাষ্পাকারে বায়ুমণ্ডলে বের করে দেওয়ার প্রক্রিয়া হলো প্রস্বেদন। প্রস্বেদনকে উদ্ভিদের 'Necessary evil' বলা হয়।",
    "highlights": [
        "ব্যাপনকারী পদার্থের অণু-পরমাণুর গতিশক্তির কারণে সৃষ্ট চাপকে ব্যাপন চাপ বলে।",
        "অভিস্রবণের জন্য দুটি ভিন্ন ঘনত্বের দ্রবণ এবং একটি অর্ধভেদ্য পর্দার উপস্থিতি আবশ্যক।",
        "মূলরোম দ্বারা মাটি থেকে পানি পরিশোষণ অন্তঃঅভিস্রবণ প্রক্রিয়ায় সম্পন্ন হয়।",
        "প্রস্বেদন প্রধানত পত্ররন্ধ্রের মাধ্যমে ঘটে (প্রায় ৯০-৯৫%), যা পত্ররন্ধ্রীয় প্রস্বেদন নামে পরিচিত।",
        "বিজ্ঞানী কার্টিস প্রস্বেদনকে 'Necessary evil' বা অত্যাবশ্যকীয় ক্ষতি হিসেবে অভিহিত করেছেন।"
    ],
    "definitions": [
        { "term": "ব্যাপন (Diffusion)", "desc": "যে ভৌত প্রক্রিয়ায় পদার্থের অণুগুলো স্বতঃস্ফূর্তভাবে তাদের উচ্চ ঘনত্বের স্থান থেকে নিম্ন ঘনত্বের স্থানে ছড়িয়ে পড়ে এবং সর্বত্র সমঘনত্ব লাভ করে।" },
        { "term": "অভিস্রবণ (Osmosis)", "desc": "একটি বৈষম্যভেদ্য (অর্ধভেদ্য) পর্দা দিয়ে পৃথক দুটি ভিন্ন ঘনত্বের দ্রবণের মধ্যে দ্রাবক অণুর কম ঘনত্বের দ্রবণ থেকে অধিক ঘনত্বের দ্রবণের দিকে গমন।" },
        { "term": "ইমবাইবিশন (Imbibition)", "desc": "কলয়েডধর্মী শুষ্ক বা আধা-শুষ্ক পদার্থ কর্তৃক তরল পদার্থ শোষণের বিশেষ প্রক্রিয়া।" },
        { "term": "প্রস্বেদন বা বাষ্পমোচন (Transpiration)", "desc": "উদ্ভিদের দেহাভ্যন্তর থেকে পাতার পত্ররন্ধ্র, কিউটিকল বা লেন্টিসেলের মাধ্যমে বাষ্পাকারে পানি বের করে দেওয়ার শারীরবৃত্তীয় প্রক্রিয়া।" },
        { "term": "প্লাজমোলাইসিস (Plasmolysis)", "desc": "বহিঃঅভিস্রবণের কারণে উদ্ভিদকোষ থেকে পানি বের হয়ে গিয়ে প্রোটোপ্লাজম সংকুচিত হওয়ার ঘটনা।" }
    ],
    "formulas": [
        { "tag": "প্রস্বেদনের প্রকারভেদ", "expr": "\\text{পত্ররন্ধ্রীয় প্রস্বেদন (৯০-৯৫\\%)} + \\text{ত্বকীয় প্রস্বেদন} + \\text{লেন্টিকুলার প্রস্বেদন}", "note": "উদ্ভিদের অঙ্গভেদে প্রস্বেদন ৩ প্রকার।" }
    ]
};

['curriculum_data.js', 'www/curriculum_data.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('"c8_c3"')) {
        const insertion = '    "c8_c3": ' + JSON.stringify(c8_c3_obj, null, 8).replace(/^/gm, '    ').trim() + ',\n';
        content = content.replace('"hsc2_c1":', insertion + '    "hsc2_c1":');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', file);
    }
});

// 2. Update app.js & www/app.js to add c8_c3 to chapters list
const c8_c3_chapter_entry = `            {
                id: "c8_c3",  num: 3,
                title: "অধ্যায় ৩: ব্যাপন, অভিস্রবণ ও প্রস্বেদন",
                desc:  "ব্যাপন, অভিস্রবণ, প্লাজমোলাইসিস, উদ্ভিদে পানি ও খনিজ লবণ শোষণ এবং প্রস্বেদনের গুরুত্ব।"
            },`;

['app.js', 'www/app.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('"c8_c3"')) {
        content = content.replace('title: "অধ্যায় ২: জীবের বৃদ্ধি ও বংশগতি",\n                desc:  "অ্যামাইটোসিস, মাইটোসিস, মিয়োসিস, ক্রোমোজোম, DNA, জিন ও বংশগতির নীতি।"\n            },',
            'title: "অধ্যায় ২: জীবের বৃদ্ধি ও বংশগতি",\n                desc:  "অ্যামাইটোসিস, মাইটোসিস, মিয়োসিস, ক্রোমোজোম, DNA, জিন ও বংশগতির নীতি।"\n            },\n' + c8_c3_chapter_entry
        );
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', file);
    }
});

// 3. Update study.html & www/study.html to include class8_ch3.js and update modal text
['study.html', 'www/study.html'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // add script
    if (!content.includes('class8_ch3.js')) {
        content = content.replace('<script src="data/exams/class8_ch2.js"></script>',
            '<script src="data/exams/class8_ch2.js"></script>\n    <script src="data/exams/class8_ch3.js"></script>'
        );
    }
    
    // update modal text
    content = content.replace('১ম ও ২য় অধ্যায়ের ২১০টি স্পেশাল প্রশ্ন, ১২টি ওএমআর পরীক্ষা', '১ম, ২য় ও ৩য় অধ্যায়ের ৩১৫টি স্পেশাল প্রশ্ন, ১৭টি ওএমআর পরীক্ষা');
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Updated', file);
});

// 4. Copy updated class8-mcq-master-course.js to www/
fs.copyFileSync(
    path.join(baseDir, 'js/class8-mcq-master-course.js'),
    path.join(baseDir, 'www/js/class8-mcq-master-course.js')
);
console.log('Copied js/class8-mcq-master-course.js to www/');
