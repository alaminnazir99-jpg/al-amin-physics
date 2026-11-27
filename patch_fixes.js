const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

// 1. Update selectLevelAndOpen
const sIdx = appJs.indexOf('function selectLevelAndOpen');
const eIdx = appJs.indexOf('function openClassroomView');
if (sIdx !== -1 && eIdx !== -1) {
    const replacement = `function selectLevelAndOpen(lvl) {
    switchLevel(lvl);
    openClassroomView(false);
    switchTab('basic');
    const subhome = document.getElementById('lms-subhomepage');
    if (subhome) subhome.classList.add('hidden');
    const headerCard = document.getElementById('classroom-chapter-header');
    if (headerCard) headerCard.classList.remove('hidden');
    const contentArea = document.getElementById('content-display-area');
    if (contentArea) contentArea.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

`;
    appJs = appJs.substring(0, sIdx) + replacement + appJs.substring(eIdx);
    console.log('selectLevelAndOpen patched');
}

// 2. Fix startMasterCourseExam to unhide parent containers
const targetActive = "const activeScreen = document.getElementById('exam-active-screen');\n    activeScreen.classList.remove('hidden');";
const replacementActive = `// Guarantee classroom view, content display area and section-exam are unhidden
    openClassroomView(false);
    const subhomeEl = document.getElementById('lms-subhomepage');
    if (subhomeEl) subhomeEl.classList.add('hidden');
    const contentArea = document.getElementById('content-display-area');
    if (contentArea) contentArea.classList.remove('hidden');
    const secExam = document.getElementById('section-exam');
    if (secExam) secExam.classList.remove('hidden');

    const activeScreen = document.getElementById('exam-active-screen');
    activeScreen.classList.remove('hidden');`;

if (appJs.includes(targetActive)) {
    appJs = appJs.replace(targetActive, replacementActive);
    console.log('startMasterCourseExam patched');
}

// 3. Fix handleEnrollBtnClick to unlock direct entry and open mcq-master
const enrollTarget = `function handleEnrollBtnClick() {
    if (isDirectorSessionActive()) {
        alert("স্বাগতম ডিরেক্টর স্যার! আপনার জন্য মাস্টারকোর্সের সকল ফিচার ও পরীক্ষা সরাসরি আনলক করা রয়েছে।");
        switchTab('mcq-master');
        const hub = document.getElementById('section-mcq-master');
        if (hub) {
            hub.classList.remove('hidden');
            hub.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (typeof initMasterCourseHub === 'function') initMasterCourseHub();
        return;
    }`;

const enrollReplacement = `function handleEnrollBtnClick() {
    if (isDirectorSessionActive()) {
        alert("স্বাগতম ডিরেক্টর স্যার! আপনার জন্য মাস্টারকোর্সের সকল ফিচার ও পরীক্ষা সরাসরি আনলক করা রয়েছে।");
        openClassroomView(false);
        const subhome = document.getElementById('lms-subhomepage');
        if (subhome) subhome.classList.add('hidden');
        const contentArea = document.getElementById('content-display-area');
        if (contentArea) contentArea.classList.remove('hidden');
        switchTab('mcq-master');
        const hub = document.getElementById('section-mcq-master');
        if (hub) {
            hub.classList.remove('hidden');
            hub.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (typeof initMasterCourseHub === 'function') initMasterCourseHub();
        return;
    }`;

if (appJs.includes(enrollTarget)) {
    appJs = appJs.replace(enrollTarget, enrollReplacement);
    console.log('handleEnrollBtnClick patched');
}

// 4. Update backToExamSets
const btesTarget = "function backToExamSets() {\n    if (examTimerInterval) {";
const btesReplacement = `function backToExamSets() {
    if (currentMasterExamAttempt) {
        currentMasterExamAttempt = null;
        if (examTimerInterval) {
            clearInterval(examTimerInterval);
            examTimerInterval = null;
        }
        switchTab('mcq-master');
        const hub = document.getElementById('section-mcq-master');
        if (hub) hub.classList.remove('hidden');
        return;
    }
    if (examTimerInterval) {`;

if (appJs.includes(btesTarget)) {
    appJs = appJs.replace(btesTarget, btesReplacement);
    console.log('backToExamSets patched');
}

fs.writeFileSync('app.js', appJs);
fs.writeFileSync('www/app.js', appJs);
console.log('All patches written to app.js and www/app.js');
