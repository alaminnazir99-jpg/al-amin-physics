const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

// 1. startMasterCourseExam patch
const searchBlock = `    // Switch to active exam view
    document.getElementById('exam-sets-screen').classList.add('hidden');
    const masterHub = document.getElementById('section-mcq-master');
    if (masterHub) masterHub.classList.add('hidden');

    const activeScreen = document.getElementById('exam-active-screen');
    activeScreen.classList.remove('hidden');`;

const replaceBlock = `    // Switch to active exam view: ensure classroom & section-exam are unhidden
    openClassroomView(false);
    const subhomeEl = document.getElementById('lms-subhomepage');
    if (subhomeEl) subhomeEl.classList.add('hidden');
    const contentArea = document.getElementById('content-display-area');
    if (contentArea) contentArea.classList.remove('hidden');
    const secExam = document.getElementById('section-exam');
    if (secExam) secExam.classList.remove('hidden');

    document.getElementById('exam-sets-screen').classList.add('hidden');
    const masterHub = document.getElementById('section-mcq-master');
    if (masterHub) masterHub.classList.add('hidden');

    const activeScreen = document.getElementById('exam-active-screen');
    activeScreen.classList.remove('hidden');`;

if (appJs.includes(searchBlock)) {
    appJs = appJs.replace(searchBlock, replaceBlock);
    console.log('startMasterCourseExam patched successfully');
} else {
    console.log('searchBlock not found for startMasterCourseExam');
}

// 2. handleEnrollBtnClick patch
const searchEnroll = `function handleEnrollBtnClick() {
    if (isDirectorSessionActive()) {
        alert("স্বাগতম ডিরেক্টর স্যার! আপনার জন্য মাস্টারকোর্সের সকল ফিচার ও পরীক্ষা সরাসরি আনলক করা রয়েছে।");
        switchTab('mcq-master');`;

const replaceEnroll = `function handleEnrollBtnClick() {
    if (isDirectorSessionActive()) {
        alert("স্বাগতম ডিরেক্টর স্যার! আপনার জন্য মাস্টারকোর্সের সকল ফিচার ও পরীক্ষা সরাসরি আনলক করা রয়েছে।");
        openClassroomView(false);
        const subhome = document.getElementById('lms-subhomepage');
        if (subhome) subhome.classList.add('hidden');
        const contentArea = document.getElementById('content-display-area');
        if (contentArea) contentArea.classList.remove('hidden');
        switchTab('mcq-master');`;

if (appJs.includes(searchEnroll)) {
    appJs = appJs.replace(searchEnroll, replaceEnroll);
    console.log('handleEnrollBtnClick patched successfully');
} else {
    console.log('searchEnroll not found');
}

// 3. backToExamSets patch
const searchBtes = `function backToExamSets() {
    if (examTimerInterval) {
        clearInterval(examTimerInterval);
        examTimerInterval = null;
    }
    document.getElementById('exam-sets-screen').classList.remove('hidden');`;

const replaceBtes = `function backToExamSets() {
    if (examTimerInterval) {
        clearInterval(examTimerInterval);
        examTimerInterval = null;
    }
    if (currentMasterExamAttempt) {
        currentMasterExamAttempt = null;
        document.getElementById('exam-active-screen').classList.add('hidden');
        document.getElementById('exam-result-screen').classList.add('hidden');
        switchTab('mcq-master');
        const hub = document.getElementById('section-mcq-master');
        if (hub) hub.classList.remove('hidden');
        return;
    }
    document.getElementById('exam-sets-screen').classList.remove('hidden');`;

if (appJs.includes(searchBtes)) {
    appJs = appJs.replace(searchBtes, replaceBtes);
    console.log('backToExamSets patched successfully');
} else {
    console.log('searchBtes not found');
}

fs.writeFileSync('app.js', appJs);
fs.writeFileSync('www/app.js', appJs);
console.log('Files saved.');
