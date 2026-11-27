/**
 * Class 8 Science MCQ Master Course Module
 * Al Amin Physics (Official)
 * 
 * Includes Chapters 1, 2 & 3 (105 questions each, 315 questions total)
 * Features:
 * - 17 Total Exams (5 Chapter Sets x 3 + 1 Combined Part Exam + 1 Final Mock)
 * - Free Access: Set 1 of Chapter 1, Chapter 2 & Chapter 3 are completely free trial tests
 * - Random Question Sampling engine
 * - Full Explanations, Timer, Score tracking, and Weak Topic Notes
 */

(function (window) {
    'use strict';

    const C8_MCQ_CONFIG = {
        courseId: 'class8-science-mcq-master',
        courseName: 'অষ্টম শ্রেণি বিজ্ঞান MCQ Master Course',
        regularPrice: 350,
        launchPrice: 149,
        merchantNumber: '01896464903',
        totalExams: 42,
        totalQuestionsPool: 840,
        chapters: [
            { num: 1, id: 'c8_c1', name: 'প্রাণিজগতের শ্রেণিবিন্যাস', qCount: 105 },
            { num: 2, id: 'c8_c2', name: 'জীবের বৃদ্ধি ও বংশগতি', qCount: 105 },
            { num: 3, id: 'c8_c3', name: 'ব্যাপন, অভিস্রবণ ও প্রস্বেদন', qCount: 105 },
            { num: 4, id: 'c8_c4', name: 'উদ্ভিদের বংশ বৃদ্ধি', qCount: 105 },
            { num: 5, id: 'c8_c5', name: 'সমন্বয় ও নিঃসরণ', qCount: 105 },
            { num: 6, id: 'c8_c6', name: 'পরমাণুর গঠন', qCount: 105 },
            { num: 7, id: 'c8_c7', name: 'পৃথিবী ও মহাকর্ষ', qCount: 105 },
            { num: 8, id: 'c8_c8', name: 'রাসায়নিক বিক্রিয়া', qCount: 105 }
        ]
    };

    const C8_STORAGE_KEYS = {
        ENROLL_REQUESTS: 'alamin_c8_mcq_enroll_requests',
        ENROLLED_STUDENTS: 'alamin_c8_mcq_enrolled_students',
        EXAM_ATTEMPTS: 'alamin_c8_mcq_exam_attempts'
    };

    function getStorage(key, fallback = []) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : fallback;
        } catch (e) {
            return fallback;
        }
    }

    function setStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {}
    }

    function isStudentEnrolled(studentIdOrPhone) {
        if (window.isDirector || 
            localStorage.getItem('is_director_logged_in') === 'true' || 
            sessionStorage.getItem('is_director_logged_in') === 'true' || 
            localStorage.getItem('alamin_director_session') !== null) {
            return true;
        }
        if (!studentIdOrPhone) {
            const active = (typeof window.getActiveStudentSession === 'function') 
                ? window.getActiveStudentSession() 
                : null;
            if (active && (active.phone || active.id)) {
                studentIdOrPhone = active.phone || active.id;
            }
        }
        if (!studentIdOrPhone) return false;

        const enrolled = getStorage(C8_STORAGE_KEYS.ENROLLED_STUDENTS, []);
        return enrolled.some(s => s.phone === studentIdOrPhone || s.studentId === studentIdOrPhone || s.id === studentIdOrPhone);
    }

    function getChapterQuestionPool(chapNum) {
        const bank = window.CLASS8_EXAM_BANK || {};
        const chapData = bank[chapNum];
        if (!chapData || !chapData.sets) return [];

        const pool = [];
        chapData.sets.forEach((set, sIdx) => {
            const defaultDiff = (sIdx === 0) ? 'easy' : (sIdx === 1 ? 'easy-medium' : (sIdx === 2 ? 'medium' : (sIdx === 3 ? 'hard' : 'challenge')));
            const defaultTopic = chapData.chapterName || `অধ্যায় ${chapNum}`;

            (set.questions || []).forEach(q => {
                pool.push({
                    id: q.id,
                    num: q.num,
                    q: q.q,
                    options: q.options,
                    correct: q.correct,
                    ans_letter: q.ans_letter,
                    ans_text: q.ans_text,
                    exp: q.exp || '',
                    reference: q.reference || '',
                    chapterNum: chapNum,
                    chapterName: chapData.chapterName,
                    difficulty: q.difficulty || defaultDiff,
                    topic: q.topic || defaultTopic
                });
            });
        });
        return pool;
    }

    function shuffleArray(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    function sampleQuestions(pool, count, targetDifficulty) {
        if (!pool || pool.length === 0) return [];
        if (pool.length <= count) return shuffleArray(pool);

        let matches = pool.filter(q => q.difficulty === targetDifficulty);
        let others = pool.filter(q => q.difficulty !== targetDifficulty);

        let selected = [];
        if (matches.length >= count) {
            selected = shuffleArray(matches).slice(0, count);
        } else {
            selected = matches.concat(shuffleArray(others).slice(0, count - matches.length));
        }

        return shuffleArray(selected).map((q, idx) => {
            return Object.assign({}, q, { displayNum: idx + 1 });
        });
    }

    function getAllExamDefinitions() {
        const exams = [];
        const chaps = [
            { num: 1, name: "প্রাণিজগতের শ্রেণিবিন্যাস" },
            { num: 2, name: "জীবের বৃদ্ধি ও বংশগতি" },
            { num: 3, name: "ব্যাপন, অভিস্রবণ ও প্রস্বেদন" },
            { num: 4, name: "উদ্ভিদের বংশ বৃদ্ধি" },
            { num: 5, name: "সমন্বয় ও নিঃসরণ" },
            { num: 6, name: "পরমাণুর গঠন" },
            { num: 7, name: "পৃথিবী ও মহাকর্ষ" },
            { num: 8, name: "রাসায়নিক বিক্রিয়া" }
        ];

        // 5 Sets for Chapter 1, 5 Sets for Chapter 2 & 5 Sets for Chapter 3 = 15 exams
        chaps.forEach(ch => {
            const setSpecs = [
                { setNum: 1, qCount: 15, time: 15, diff: 'easy', diffLabel: 'সহজ (জ্ঞান ও মৌলিক ধারণা • ফ্রি ট্রায়াল)', isFree: true },
                { setNum: 2, qCount: 15, time: 15, diff: 'easy-medium', diffLabel: 'সহজ-মাঝারি (প্রয়োগ ও মূলনীতি)', isFree: false },
                { setNum: 3, qCount: 25, time: 25, diff: 'medium', diffLabel: 'বোর্ড স্ট্যান্ডার্ড (সমন্বিত মডেল টেস্ট - ক)', isFree: false },
                { setNum: 4, qCount: 25, time: 25, diff: 'hard', diffLabel: 'কঠিন (গাণিতিক ও উচ্চতর দক্ষতা)', isFree: false },
                { setNum: 5, qCount: 25, time: 25, diff: 'challenge', diffLabel: 'চ্যালেঞ্জ (মাস্টার বোর্ড মক টেস্ট - খ)', isFree: false }
            ];

            setSpecs.forEach(spec => {
                exams.push({
                    id: `c8_mcq_ch${ch.num}_set${spec.setNum}`,
                    type: 'chapter',
                    grade: 'class8',
                    chapterNum: ch.num,
                    chapterName: ch.name,
                    setNum: spec.setNum,
                    title: `অধ্যায় ০${ch.num}: সেট ০${spec.setNum} — ${ch.name}`,
                    desc: `${spec.diffLabel} — ${spec.qCount}টি বহুনির্বাচনী প্রশ্ন, সময় ${spec.time} মিনিট।`,
                    qCount: spec.qCount,
                    timeMinutes: spec.time,
                    fullMarks: spec.qCount,
                    difficulty: spec.diff,
                    difficultyLabel: spec.diffLabel,
                    category: `অধ্যায় ০${ch.num}`,
                    chapters: [ch.num],
                    isFree: (spec.setNum === 1)
                });
            });
        });

        // Combined Exam 1: চ্যাপ্টার ১, ২ ও ৩ সমন্বিত রিভিশন টেস্ট (৩০ প্রশ্ন)
        exams.push({
            id: 'c8_mcq_combined_ch1_to_ch3',
            type: 'part',
            grade: 'class8',
            title: 'অধ্যায় ১ থেকে ৮ সমন্বিত প্র্যাকটিস টেস্ট',
            desc: 'প্রথম আটটি অধ্যায় থেকে নির্বাচিত ৫৫টি গুরুত্বপূর্ণ বোর্ড স্ট্যান্ডার্ড প্রশ্নের সমন্বিত পরীক্ষা।',
            qCount: 55,
            timeMinutes: 55,
            fullMarks: 55,
            difficulty: 'medium',
            difficultyLabel: 'সমন্বিত মডেল টেস্ট',
            category: 'সমন্বিত টেস্ট',
            chapters: [1, 2, 3, 4, 5, 6, 7, 8],
            isFree: false
        });

        // Combined Exam 2: অষ্টম শ্রেণি বিজ্ঞান গ্র্যান্ড ফাইনাল মক টেস্ট (৫০ প্রশ্ন)
        exams.push({
            id: 'c8_mcq_grand_final_mock',
            type: 'full_book',
            grade: 'class8',
            title: 'অষ্টম শ্রেণি বিজ্ঞান গ্র্যান্ড ফাইনাল মক টেস্ট',
            desc: '৮৪০টি প্রশ্নের সম্পূর্ণ পুল থেকে নির্বাচিত ৫০টি প্রশ্নের চূড়ান্ত মডেল টেস্ট।',
            qCount: 50,
            timeMinutes: 50,
            fullMarks: 50,
            difficulty: 'challenge',
            difficultyLabel: 'গ্র্যান্ড ফাইনাল মক',
            category: 'ফাইনাল মক',
            chapters: [1, 2, 3, 4, 5, 6, 7, 8],
            isFree: false
        });

        return exams;
    }

    function generateExamInstance(examId) {
        const allDefs = getAllExamDefinitions();
        const def = allDefs.find(e => e.id === examId);
        if (!def) return null;

        let combinedPool = [];
        (def.chapters || [1]).forEach(chNum => {
            const chapPool = getChapterQuestionPool(chNum);
            combinedPool = combinedPool.concat(chapPool);
        });

        if (combinedPool.length === 0) return null;

        const sampledQuestions = sampleQuestions(combinedPool, def.qCount, def.difficulty || 'medium');
        return {
            examDef: def,
            questions: sampledQuestions,
            generatedAt: new Date().toISOString()
        };
    }

    function submitEnrollmentRequest(senderPhone, transactionId) {
        const student = (typeof window.getActiveStudentSession === 'function') 
            ? window.getActiveStudentSession() 
            : null;

        if (!senderPhone || !transactionId) {
            return { success: false, message: 'অনুগ্রহ করে সেন্ডার নম্বর ও ট্রানজেকশন আইডি দিন।' };
        }

        const requests = getStorage(C8_STORAGE_KEYS.ENROLL_REQUESTS, []);
        const exists = requests.find(r => r.transactionId.toLowerCase() === transactionId.toLowerCase().trim());
        if (exists) {
            return { success: false, message: 'এই ট্রানজেকশন আইডিটি ইতোমধ্যে জমা দেওয়া হয়েছে।' };
        }

        const newReq = {
            id: 'c8_req_' + Date.now(),
            studentId: student ? student.id : 'C8-GUEST-' + Math.floor(1000 + Math.random()*9000),
            studentName: student ? student.name : 'অষ্টম শ্রেণির শিক্ষার্থী',
            studentPhone: student ? (student.phone || senderPhone) : senderPhone,
            senderPhone: senderPhone.trim(),
            transactionId: transactionId.trim().toUpperCase(),
            amount: C8_MCQ_CONFIG.launchPrice,
            courseId: C8_MCQ_CONFIG.courseId,
            courseName: C8_MCQ_CONFIG.courseName,
            status: 'pending',
            submittedAt: new Date().toLocaleString('bn-BD'),
            timestamp: Date.now()
        };

        requests.unshift(newReq);
        setStorage(C8_STORAGE_KEYS.ENROLL_REQUESTS, requests);

        return {
            success: true,
            message: 'আপনার রিকোয়েস্ট সফলভাবে জমা হয়েছে! ডিরেক্টর প্যানেল যাচাই করে কোর্সটি সক্রিয় করবে।',
            request: newReq
        };
    }

    function approveEnrollment(requestId) {
        const requests = getStorage(C8_STORAGE_KEYS.ENROLL_REQUESTS, []);
        const enrolled = getStorage(C8_STORAGE_KEYS.ENROLLED_STUDENTS, []);
        const reqIdx = requests.findIndex(r => r.id === requestId);
        if (reqIdx === -1) return { success: false, message: 'রিকোয়েস্ট পাওয়া যায়নি।' };

        const req = requests[reqIdx];
        req.status = 'approved';
        req.approvedAt = new Date().toLocaleString('bn-BD');

        if (!enrolled.some(s => s.phone === req.senderPhone)) {
            enrolled.unshift({
                id: req.id,
                studentId: req.studentId,
                name: req.studentName,
                phone: req.senderPhone,
                trxId: req.transactionId,
                courseId: C8_MCQ_CONFIG.courseId,
                approvedAt: req.approvedAt
            });
            setStorage(C8_STORAGE_KEYS.ENROLLED_STUDENTS, enrolled);
        }

        setStorage(C8_STORAGE_KEYS.ENROLL_REQUESTS, requests);
        return { success: true, message: 'এনরোলমেন্ট সফলভাবে অনুমোদিত হয়েছে।' };
    }

    window.C8_MCQ_MASTER = {
        CONFIG: C8_MCQ_CONFIG,
        KEYS: C8_STORAGE_KEYS,
        isStudentEnrolled,
        getChapterQuestionPool,
        getAllExamDefinitions,
        generateExamInstance,
        submitEnrollmentRequest,
        approveEnrollment,
        getStorage,
        setStorage
    };

})(window);
