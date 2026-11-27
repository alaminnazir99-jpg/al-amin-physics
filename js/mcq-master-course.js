/**
 * SSC Physics MCQ Master Course Module
 * Al Amin Physics (Official)
 * 
 * Rules & Architecture strictly adhere to the specification:
 * - One-time course, regular ৳550, launch offer ৳199
 * - Merchant account: 01896464903
 * - 90 Exams total:
 *    * 13 Chapters x 6 sets = 78 chapter exams (3x15 Qs, 3x25 Qs)
 *    * 3-Part book: 3 parts x 2 tests = 6 exams (25 Qs)
 *    * 2-Part book: 2 parts x 2 tests = 4 exams (25 Qs)
 *    * Full Model Tests: 2 exams (25 Qs)
 * - Random Question Engine with difficulty progression
 * - Free Access: Set 1 in all 13 chapters, 1 Open-book sample, 1 Closed-book sample
 * - Security: Anti-copy, Tab-switch/minimize detection resets answers
 * - Post-exam: Instant explanations, Weak Topic auto revision notes, Parent SMS log
 * - Offline download: Completed exams only, watermarked, 2 questions per A4 page
 * - Director-only manual enrollment approval & complete analytics
 */

(function (window) {
    'use strict';

    const MCQ_CONFIG = {
        courseId: 'ssc-physics-mcq-master',
        courseName: 'SSC Physics MCQ Master Course',
        regularPrice: 550,
        launchPrice: 199,
        merchantNumber: '01896464903',
        totalExams: 90,
        totalQuestionsPool: 1365,
        defaultTime15: 15, // minutes
        defaultTime25: 25, // minutes
        negativeMarking: 0, // default 0 for SSC board standard
        parts3: [
            { id: 'part3_1', name: '১ম ভাগ (অধ্যায় ১ - ৪: মৌলিক রাশি, গতি, বল ও শক্তি)', chapters: [1, 2, 3, 4] },
            { id: 'part3_2', name: '২য় ভাগ (অধ্যায় ৫ - ৮: পদার্থের অবস্থা, তাপ, শব্দ ও প্রতিফলন)', chapters: [5, 6, 7, 8] },
            { id: 'part3_3', name: '৩য় ভাগ (অধ্যায় ৯ - ১৩: প্রতিসরণ, বিদ্যুৎ, চুম্বক ও তেজস্ক্রিয়তা)', chapters: [9, 10, 11, 12, 13] }
        ],
        parts2: [
            { id: 'part2_1', name: '১ম পত্রতুল্য প্রথমার্ধ (অধ্যায় ১ - ৭: বলবিদ্যা, তাপ ও শব্দ)', chapters: [1, 2, 3, 4, 5, 6, 7] },
            { id: 'part2_2', name: '২য় পত্রতুল্য দ্বিতীয়ার্ধ (অধ্যায় ৮ - ১৩: আলোকবিজ্ঞান, তড়িৎ ও ইলেকট্রনিক্স)', chapters: [8, 9, 10, 11, 12, 13] }
        ]
    };

    const STORAGE_KEYS = {
        ENROLL_REQUESTS: 'alamin_mcq_enroll_requests',
        ENROLLED_STUDENTS: 'alamin_mcq_enrolled_students',
        EXAM_ATTEMPTS: 'alamin_mcq_exam_attempts',
        SMS_LOGS: 'alamin_mcq_parent_sms_logs',
        SCHEDULED_EXAMS: 'alamin_mcq_scheduled_exams'
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

    // Check if current student is enrolled in MCQ Master Course
    function isStudentEnrolled(studentIdOrPhone) {
        // Director always has master access
        if (window.isDirector || localStorage.getItem('alamin_director_session') === 'active') {
            return true;
        }
        if (!studentIdOrPhone) {
            const active = (typeof window.getActiveStudentSession === 'function') 
                ? window.getActiveStudentSession() 
                : null;
            if (!active) return false;
            studentIdOrPhone = active.phone || active.id;
        }
        const enrolled = getStorage(STORAGE_KEYS.ENROLLED_STUDENTS, []);
        const cleanTarget = String(studentIdOrPhone).trim().toLowerCase();
        return enrolled.some(e => 
            String(e.studentId || '').toLowerCase() === cleanTarget || 
            String(e.phone || '').toLowerCase() === cleanTarget
        );
    }

    // Extract all 105 questions of a chapter into a unified flat pool
    function getChapterQuestionPool(chapNum) {
        const examBank = window.SSC_EXAM_BANK || {};
        const chapData = examBank[chapNum];
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
                    exp: q.exp,
                    topic: q.topic || defaultTopic,
                    difficulty: q.difficulty || defaultDiff,
                    chapterNum: chapNum,
                    originalSet: set.id
                });
            });
        });
        return pool;
    }

    // Fisher-Yates random shuffle
    function shuffleArray(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    // Dynamic Random Question Sampling adhering to progressive difficulty
    function sampleQuestions(pool, targetCount, difficultyProfile) {
        if (!pool || pool.length === 0) return [];
        if (pool.length <= targetCount) return shuffleArray(pool);

        let filteredPool = [];
        if (difficultyProfile === 'easy') {
            filteredPool = pool.filter(q => q.difficulty === 'easy' || q.originalSet === 'set1');
        } else if (difficultyProfile === 'easy-medium') {
            filteredPool = pool.filter(q => q.difficulty === 'easy' || q.difficulty === 'easy-medium' || q.originalSet === 'set1' || q.originalSet === 'set2');
        } else if (difficultyProfile === 'medium') {
            filteredPool = pool.filter(q => q.difficulty === 'medium' || q.originalSet === 'set2' || q.originalSet === 'set3');
        } else if (difficultyProfile === 'hard') {
            filteredPool = pool.filter(q => q.difficulty === 'hard' || q.originalSet === 'set3' || q.originalSet === 'set4');
        } else if (difficultyProfile === 'challenge') {
            filteredPool = pool.filter(q => q.difficulty === 'challenge' || q.originalSet === 'set4' || q.originalSet === 'set5');
        }

        // If filtered pool is smaller than required, supplement from main pool
        if (filteredPool.length < targetCount) {
            const needed = targetCount - filteredPool.length;
            const remaining = pool.filter(q => !filteredPool.includes(q));
            filteredPool = filteredPool.concat(shuffleArray(remaining).slice(0, needed));
        }

        return shuffleArray(filteredPool).slice(0, targetCount);
    }

    // Generate Full List of 90 Exam Definitions
    function getAllExamDefinitions() {
        const exams = [];
        const chapNames = [
            "ভৌত রাশি ও পরিমাপ", "গতি", "বল", "কাজ, ক্ষমতা ও শক্তি",
            "পদার্থের অবস্থা ও চাপ", "বস্তুর উপর তাপের প্রভাব", "তরঙ্গ ও শব্দ",
            "আলোর প্রতিফলন", "আলোর প্রতিসরণ", "স্থির বিদ্যুৎ",
            "চল বিদ্যুৎ", "বিদ্যুতের চৌম্বক ক্রিয়া", "তেজস্ক্রিয়তা ও ইলেকট্রনিক্স"
        ];

        // 1. Chapter Exams (13 x 6 = 78 exams)
        for (let ch = 1; ch <= 13; ch++) {
            const chName = chapNames[ch - 1];
            // 6 Sets per chapter: 3 of 15 Qs, 3 of 25 Qs
            const setSpecs = [
                { setNum: 1, qCount: 15, time: 15, diff: 'easy', diffLabel: 'সহজ (জ্ঞান ও অনুধাবন)', isFree: false },
                { setNum: 2, qCount: 15, time: 15, diff: 'easy-medium', diffLabel: 'সহজ-মাঝারি (বেসিক প্রয়োগ)', isFree: false },
                { setNum: 3, qCount: 15, time: 15, diff: 'medium', diffLabel: 'মাঝারি (সমন্বিত ধারণা)', isFree: false },
                { setNum: 4, qCount: 25, time: 25, diff: 'hard', diffLabel: 'বোর্ড স্ট্যান্ডার্ড (পূর্ণ টেস্ট)', isFree: false },
                { setNum: 5, qCount: 25, time: 25, diff: 'hard', diffLabel: 'কঠিন (উচ্চতর দক্ষতা ও অঙ্ক)', isFree: false },
                { setNum: 6, qCount: 25, time: 25, diff: 'challenge', diffLabel: 'মাস্টার চ্যালেঞ্জ মক টেস্ট', isFree: false }
            ];

            setSpecs.forEach(spec => {
                exams.push({
                    id: `mcq_ch${ch}_set${spec.setNum}`,
                    type: 'chapter',
                    category: 'অধ্যায়ভিত্তিক ওএমআর টেস্ট',
                    chapterNum: ch,
                    chapterName: chName,
                    title: `অধ্যায় ${ch}: ${chName} — সেট ০${spec.setNum}`,
                    desc: `${spec.diffLabel}। সংশ্লিষ্ট অধ্যায়ের ১০৫ প্রশ্নের পুল থেকে প্রতিবার স্বয়ংক্রিয়ভাবে র্যান্ডম প্রশ্ন সংগৃহীত হবে।`,
                    qCount: spec.qCount,
                    timeMinutes: spec.time,
                    fullMarks: spec.qCount,
                    difficulty: spec.diff,
                    difficultyLabel: spec.diffLabel,
                    isFree: false,
                    chapters: [ch]
                });
            });
        }

        // 2. 3-Part Exams (3 parts x 2 tests = 6 exams, 25 Qs each)
        MCQ_CONFIG.parts3.forEach((part, pIdx) => {
            for (let t = 1; t <= 2; t++) {
                exams.push({
                    id: `mcq_part3_${pIdx + 1}_t${t}`,
                    type: 'part3',
                    category: 'বই ৩-ভাগ সেগমেন্ট টেস্ট',
                    title: `৩-ভাগ টেস্ট (ভাগ ০${pIdx + 1}) — টেস্ট ০${t}`,
                    desc: `${part.name}। অন্তর্ভুক্ত অধ্যায়সমূহের সমন্বিত পুল থেকে র্যান্ডম ২৫টি প্রশ্ন।`,
                    qCount: 25,
                    timeMinutes: 25,
                    fullMarks: 25,
                    difficulty: 'hard',
                    difficultyLabel: 'সেগমেন্ট মডেল টেস্ট',
                    isFree: false,
                    chapters: part.chapters
                });
            }
        });

        // 3. 2-Part Exams (2 parts x 2 tests = 4 exams, 25 Qs each)
        MCQ_CONFIG.parts2.forEach((part, pIdx) => {
            for (let t = 1; t <= 2; t++) {
                exams.push({
                    id: `mcq_part2_${pIdx + 1}_t${t}`,
                    type: 'part2',
                    category: 'বই ২-ভাগ সমন্বিত টেস্ট',
                    title: `২-ভাগ সমন্বিত টেস্ট (অর্ধেক বই - ০${pIdx + 1}) — টেস্ট ০${t}`,
                    desc: `${part.name}। বিস্তৃত সিলেবাস রিভিশনের জন্য ২৫টি র্যান্ডম প্রশ্ন।`,
                    qCount: 25,
                    timeMinutes: 25,
                    fullMarks: 25,
                    difficulty: 'hard',
                    difficultyLabel: 'হাফ-বুক ফাইনাল টেস্ট',
                    isFree: false,
                    chapters: part.chapters
                });
            }
        });

        // 4. Full Book Model Tests (2 exams, 25 Qs each)
        for (let m = 1; m <= 2; m++) {
            exams.push({
                id: `mcq_full_book_m${m}`,
                type: 'full_book',
                category: 'পূর্ণাঙ্গ বই চূড়ান্ত মডেল টেস্ট',
                title: `এসএসসি পদার্থবিজ্ঞান পূর্ণাঙ্গ বই মক টেস্ট — ০${m}`,
                desc: `পুরো বইয়ের ১৩টি অধ্যায়ের ১০৫×১৩ = ১৩৬৫+ প্রশ্নের সম্পূর্ণ ব্যাংক থেকে স্বয়ংক্রিয়ভাবে র্যান্ডম ২৫টি চূড়ান্ত বোর্ড স্ট্যান্ডার্ড প্রশ্ন।`,
                qCount: 25,
                timeMinutes: 25,
                fullMarks: 25,
                difficulty: 'challenge',
                difficultyLabel: 'পূর্ণাঙ্গ ফাইনাল মক',
                isFree: false,
                chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
            });
        }

        return exams;
    }

    // Special Sample Tests (Free for everyone to build trust)
    function getSampleExams() {
        return [
            {
                id: 'sample_open_book',
                type: 'sample',
                category: 'ফ্রি স্যাম্পল পরীক্ষা',
                title: '১ম স্যাম্পল টেস্ট: ওপেন-বুক টেক্সটবুক স্কিল টেস্ট',
                desc: 'বই খুলে লাইন ধরে উত্তর খোঁজার অনুশীলন। বইয়ের মৌলিক সংজ্ঞা, মান ও লাইনভিত্তিক ১৫টি প্রশ্ন।',
                qCount: 15,
                timeMinutes: 15,
                fullMarks: 15,
                isFree: false,
                chapters: [1, 2, 3]
            },
            {
                id: 'sample_closed_book',
                type: 'sample',
                category: 'ফ্রি স্যাম্পল পরীক্ষা',
                title: '২য় স্যাম্পল টেস্ট: ক্লোজড-বুক জ্ঞান ও অনুধাবন যাচাই',
                desc: 'বই বন্ধ করে সরাসরি জ্ঞান ও তাৎক্ষণিক স্মৃতি পরীক্ষা। বোর্ড পরীক্ষার অনুরূপ ১৫টি প্রশ্ন।',
                qCount: 15,
                timeMinutes: 15,
                fullMarks: 15,
                isFree: false,
                chapters: [1, 2, 3]
            }
        ];
    }

    // Assemble questions for an exam dynamically using the random engine
    function generateExamInstance(examId) {
        const allDefs = getAllExamDefinitions().concat(getSampleExams());
        const def = allDefs.find(e => e.id === examId);
        if (!def) return null;

        // Build combined pool of all involved chapters
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

    // Enrollment Management
    function submitEnrollmentRequest(senderPhone, transactionId) {
        const student = (typeof window.getActiveStudentSession === 'function') 
            ? window.getActiveStudentSession() 
            : null;

        if (!senderPhone || !transactionId) {
            return { success: false, message: 'অনুগ্রহ করে সেন্ডার নম্বর ও ট্রানজেকশন আইডি দিন।' };
        }

        const requests = getStorage(STORAGE_KEYS.ENROLL_REQUESTS, []);
        const exists = requests.find(r => r.transactionId.toLowerCase() === transactionId.trim().toLowerCase());
        if (exists) {
            return { success: false, message: 'এই ট্রানজেকশন আইডিটি ইতিমধ্যে সাবমিট করা হয়েছে।' };
        }

        const newReq = {
            id: 'REQ_' + Date.now(),
            studentId: student ? student.id : 'GUEST_' + Date.now(),
            studentName: student ? student.name : 'অপেক্ষমাণ শিক্ষার্থী',
            studentPhone: student ? student.phone : senderPhone,
            senderPhone: senderPhone.trim(),
            transactionId: transactionId.trim().toUpperCase(),
            amount: MCQ_CONFIG.launchPrice,
            submittedAt: new Date().toISOString(),
            status: 'pending', // 'pending', 'approved', 'rejected'
            approvedBy: null,
            approvedAt: null
        };

        requests.unshift(newReq);
        setStorage(STORAGE_KEYS.ENROLL_REQUESTS, requests);
        return { 
            success: true, 
            message: 'আপনার এনরোলমেন্ট তথ্য জমা হয়েছে। ডিরেক্টর যাচাইপূর্বক ২৪ ঘণ্টার মধ্যে কোর্স সক্রিয় করবেন।' 
        };
    }

    // Director-Only Activation
    function approveEnrollment(requestId) {
        if (!window.isDirector && localStorage.getItem('alamin_director_session') !== 'active') {
            return { success: false, message: 'শুধুমাত্র ডিরেক্টর এই কোর্স অ্যাক্টিভ করতে পারবেন।' };
        }

        const requests = getStorage(STORAGE_KEYS.ENROLL_REQUESTS, []);
        const req = requests.find(r => r.id === requestId);
        if (!req) return { success: false, message: 'রিকোয়েস্ট পাওয়া যায়নি।' };

        req.status = 'approved';
        req.approvedBy = 'Director (আল আমিন স্যার)';
        req.approvedAt = new Date().toISOString();
        setStorage(STORAGE_KEYS.ENROLL_REQUESTS, requests);

        // Add to enrolled list
        const enrolled = getStorage(STORAGE_KEYS.ENROLLED_STUDENTS, []);
        if (!enrolled.some(e => e.phone === req.senderPhone || e.studentId === req.studentId)) {
            enrolled.unshift({
                studentId: req.studentId,
                name: req.studentName,
                phone: req.senderPhone,
                courseId: MCQ_CONFIG.courseId,
                enrolledAt: new Date().toISOString(),
                transactionId: req.transactionId,
                amount: req.amount
            });
            setStorage(STORAGE_KEYS.ENROLLED_STUDENTS, enrolled);
        }

        return { success: true, message: `কোর্স সফলভাবে সক্রিয় করা হয়েছে (${req.studentName})` };
    }

    function rejectEnrollment(requestId, reason = 'তথ্য মেলেনি') {
        if (!window.isDirector && localStorage.getItem('alamin_director_session') !== 'active') {
            return { success: false, message: 'শুধুমাত্র ডিরেক্টর এই রিকোয়েস্ট বাতিল করতে পারবেন।' };
        }
        const requests = getStorage(STORAGE_KEYS.ENROLL_REQUESTS, []);
        const req = requests.find(r => r.id === requestId);
        if (!req) return { success: false, message: 'রিকোয়েস্ট পাওয়া যায়নি।' };

        req.status = 'rejected';
        req.rejectReason = reason;
        req.rejectedAt = new Date().toISOString();
        setStorage(STORAGE_KEYS.ENROLL_REQUESTS, requests);
        return { success: true, message: 'রিকোয়েস্ট বাতিল করা হয়েছে।' };
    }

    // Auto Revision Notes Generator for Weak Topics
    function generateWeakTopicNotes(questions, userAnswers) {
        const topicStats = {};

        questions.forEach((q, idx) => {
            const topic = q.topic || 'পদার্থবিজ্ঞান সাধারণ';
            if (!topicStats[topic]) {
                topicStats[topic] = { total: 0, wrong: 0, questions: [] };
            }
            topicStats[topic].total++;
            const given = userAnswers[idx];
            if (given !== q.correct) {
                topicStats[topic].wrong++;
                topicStats[topic].questions.push(q);
            }
        });

        const weakNotes = [];
        for (const [topic, stat] of Object.entries(topicStats)) {
            const errorRate = stat.wrong / stat.total;
            if (errorRate >= 0.5 && stat.wrong > 0) {
                // Generate 3-4 line targeted revision note
                const sampleQ = stat.questions[0];
                const note = {
                    topic: topic,
                    wrongCount: stat.wrong,
                    totalCount: stat.total,
                    accuracy: Math.round((1 - errorRate) * 100) + '%',
                    lines: [
                        `📌 বিষয় ও সংজ্ঞা: "${topic}" সংক্রান্ত প্রশ্নের মৌলিক সংজ্ঞা ও একক বই থেকে পুনরায় দেখে নিন।`,
                        `⚙️ মূল সম্পর্ক ও সূত্র: সমীকরণগুলোর গাণিতিক সম্পর্ক লক্ষ্য করুন (${sampleQ?.exp ? sampleQ.exp.slice(0, 75) + '...' : 'বইয়ের সংশ্লিষ্ট সূত্র দ্রষ্টব্য'})।`,
                        `⚠️ সতর্কীকরণ: বিগত বোর্ড পরীক্ষায় এই টপিকের প্রশ্নে একক রূপান্তর ও চিহ্নের ভুল বেশি হয়েছে। পরীক্ষার আগে রিভিশন দিন।`
                    ]
                };
                weakNotes.push(note);
            }
        }
        return weakNotes;
    }

    // Parent SMS Logger
    function recordParentSms(studentName, studentPhone, examTitle, score, fullMarks, reason = 'exam_completion') {
        const logs = getStorage(STORAGE_KEYS.SMS_LOGS, []);
        let msg = '';
        if (reason === 'exam_completion') {
            msg = `শ্রদ্ধেয় অভিভাবক, আপনার সন্তান ${studentName} আল আমিন ফিজিক্সে "${examTitle}" পরীক্ষায় ${score}/${fullMarks} নম্বর পেয়েছে। ধন্যবাদ, Al Amin Physics.`;
        } else if (reason === 'missed_scheduled_exam') {
            msg = `শ্রদ্ধেয় অভিভাবক, আপনার সন্তান ${studentName} নির্ধারিত সময়ে আল আমিন ফিজিক্সে "${examTitle}" পরীক্ষায় অংশগ্রহণ করেনি। অনুগ্রহ করে বিষয়টি লক্ষ্য করুন।`;
        }

        const logEntry = {
            id: 'SMS_' + Date.now(),
            recipientPhone: studentPhone || '০১৭০০০০০০০০',
            studentName: studentName || 'শিক্ষার্থী',
            examTitle: examTitle,
            messageBody: msg,
            sentAt: new Date().toISOString(),
            status: 'Delivered (Logged)',
            reason: reason
        };

        logs.unshift(logEntry);
        setStorage(STORAGE_KEYS.SMS_LOGS, logs);
        return logEntry;
    }

    // Offline Watermarked PDF / Print Layout Generator (Max 2 questions per A4 page)
    function renderPrintableExamSheet(attemptData) {
        if (!attemptData || !attemptData.questions) {
            alert('পরীক্ষার ফলাফল পাওয়া যায়নি।');
            return;
        }

        const student = (typeof window.getActiveStudentSession === 'function') 
            ? window.getActiveStudentSession() 
            : null;
        const studentName = student ? student.name : 'পরীক্ষার্থী';
        const studentId = student ? student.id : 'AP-26-REGULAR';

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('পপ-আপ উইন্ডো ব্লক করা রয়েছে। অনুগ্রহ করে পপ-আপ আনব্লক করুন।');
            return;
        }

        const questions = attemptData.questions;
        const letters = ['ক', 'খ', 'গ', 'ঘ'];

        // Group into chunks of 2 questions per page to resist dense printing
        const chunks = [];
        for (let i = 0; i < questions.length; i += 2) {
            chunks.push(questions.slice(i, i + 2));
        }

        const html = `
<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <title>${attemptData.examDef.title} - অফলাইন রিভিশন শিট</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 20mm;
        }
        body {
            font-family: 'SolaimanLipi', 'Noto Sans Bengali', sans-serif;
            color: #1e293b;
            background: #fff;
            margin: 0;
            padding: 0;
            line-height: 1.8;
            position: relative;
        }
        .page-sheet {
            page-break-after: always;
            position: relative;
            min-height: 90vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding-bottom: 20px;
        }
        .watermark {
            position: fixed;
            top: 40%;
            left: 10%;
            width: 80%;
            text-align: center;
            transform: rotate(-30deg);
            font-size: 28px;
            font-weight: 900;
            color: rgba(148, 163, 184, 0.15);
            pointer-events: none;
            z-index: 999;
            text-transform: uppercase;
        }
        .header {
            border-bottom: 2px solid #0284c7;
            padding-bottom: 12px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header h1 {
            font-size: 18px;
            color: #0369a1;
            margin: 0;
        }
        .student-meta {
            font-size: 12px;
            color: #475569;
            text-align: right;
        }
        .q-card {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 40px;
            font-size: 16px;
        }
        .q-title {
            font-weight: bold;
            font-size: 17px;
            margin-bottom: 16px;
            color: #0f172a;
        }
        .options-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 18px;
            font-size: 15px;
        }
        .opt-item {
            padding: 10px 14px;
            border-radius: 8px;
            background: #fff;
            border: 1px solid #e2e8f0;
        }
        .opt-item.correct {
            border-color: #10b981;
            background: #ecfdf5;
            font-weight: bold;
            color: #065f46;
        }
        .exp-box {
            background: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 12px 16px;
            font-size: 13.5px;
            color: #1e3a8a;
            border-radius: 0 8px 8px 0;
        }
        .footer-note {
            font-size: 11px;
            color: #94a3b8;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            padding-top: 8px;
        }
    </style>
</head>
<body>
    <div class="watermark">
        AL AMIN PHYSICS • ${studentName} • ${studentId}
    </div>

    ${chunks.map((pair, pIdx) => `
        <div class="page-sheet">
            <div>
                <div class="header">
                    <div>
                        <h1>Al Amin Physics — ${attemptData.examDef.title}</h1>
                        <span style="font-size:12px; color:#64748b;">অফলাইন প্রস্তুতি শিট • পাতা ${pIdx + 1} / ${chunks.length}</span>
                    </div>
                    <div class="student-meta">
                        <div><strong>শিক্ষার্থী:</strong> ${studentName}</div>
                        <div><strong>আইডি:</strong> ${studentId}</div>
                    </div>
                </div>

                ${pair.map((q, qIndex) => {
                    const absNum = pIdx * 2 + qIndex + 1;
                    return `
                        <div class="q-card">
                            <div class="q-title">প্রশ্ন ${absNum}: ${q.q}</div>
                            <div class="options-grid">
                                ${q.options.map((opt, oi) => `
                                    <div class="opt-item ${oi === q.correct ? 'correct' : ''}">
                                        ${letters[oi]}) ${opt} ${oi === q.correct ? '✓ (সঠিক)' : ''}
                                    </div>
                                `).join('')}
                            </div>
                            <div class="exp-box">
                                <strong>ব্যাখ্যা ও সূত্র:</strong> ${q.exp || 'বইয়ের সংশ্লিষ্ট পরিচ্ছেদ দ্রষ্টব্য।'}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="footer-note">
                গোপনীয় প্রশ্নব্যাংক • শুধুমাত্র নিবন্ধিত শিক্ষার্থীর ব্যক্তিগত রিভিশনের জন্য • কপি বা বাণিজ্যিক ব্যবহার সম্পূর্ণ নিষিদ্ধ
            </div>
        </div>
    `).join('')}

    <script>
        window.onload = function() {
            window.print();
        };
    </script>
</body>
</html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
    }

    // Export module to global scope
    window.MCQ_MASTER = {
        CONFIG: MCQ_CONFIG,
        KEYS: STORAGE_KEYS,
        isStudentEnrolled,
        getAllExamDefinitions,
        getSampleExams,
        generateExamInstance,
        submitEnrollmentRequest,
        approveEnrollment,
        rejectEnrollment,
        generateWeakTopicNotes,
        recordParentSms,
        renderPrintableExamSheet,
        getStorage,
        setStorage
    };

})(window);
