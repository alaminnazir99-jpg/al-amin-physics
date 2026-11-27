const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/HP/.gemini/antigravity/scratch/al-amin-physics';
const entry = `            {
                id: "c8_c8",  num: 8,
                title: "অধ্যায় ৮: রাসায়নিক বিক্রিয়া",
                desc:  "প্রতীক, সংকেত ও যোজনী, রাসায়নিক সমীকরণ সমতাকরণ, বিভিন্ন প্রকার রাসায়নিক বিক্রিয়া, ড্রাইসেল ও তড়িৎ বিশ্লেষণ।"
            },
`;

['app.js', 'www/app.js'].forEach(file => {
    const fullPath = path.join(baseDir, file);
    let s = fs.readFileSync(fullPath, 'utf8');
    if (!s.includes('"c8_c8"')) {
        s = s.replace(/([ \t]*{\r?\n[ \t]*id:\s*"c8_c9")/, entry + '$1');
        fs.writeFileSync(fullPath, s, 'utf8');
        console.log('Successfully updated', file);
    }
});
