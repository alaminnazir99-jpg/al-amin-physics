const fs = require('fs');
const path = require('path');
const baseDir = 'C:/Users/HP/.gemini/antigravity/scratch/al-amin-physics';

['app.js', 'www/app.js'].forEach(f => {
  const p = path.join(baseDir, f);
  let c = fs.readFileSync(p, 'utf8');
  if (!c.includes('c8_c13')) {
    const target = 'id: "c8_c12"';
    const idx = c.indexOf(target);
    if (idx !== -1) {
      const closeBraceIdx = c.indexOf('}', idx);
      const before = c.substring(0, closeBraceIdx + 1);
      const after = c.substring(closeBraceIdx + 1);
      const itemToAdd = ',\n            {\n                id: "c8_c13", num: 13,\n                title: "অধ্যায় ১৩: খাদ্য ও পুষ্টি",\n                desc:  "খাদ্যের উপাদান, ভিটামিন ও খনিজের অভাবজনিত রোগ, সুষম খাদ্য তালিকা এবং ক্যালরি হিসাব।"\n            }';
      c = before + itemToAdd + after;
      fs.writeFileSync(p, c, 'utf8');
      console.log('Successfully updated', f);
    }
  } else {
    console.log('Already contains c8_c13 in', f);
  }
});
