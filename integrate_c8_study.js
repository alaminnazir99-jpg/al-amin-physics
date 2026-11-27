const fs = require('fs');

let studyHtml = fs.readFileSync('study.html', 'utf8');

// 1. Add script tags for class8 exam data and class8-mcq-master-course.js
const targetScript = '<script src="data/exams/ssc_ch1.js"></script>';
const newScripts = `<script src="data/exams/class8_ch1.js"></script>
    <script src="data/exams/class8_ch2.js"></script>
    <script src="js/class8-mcq-master-course.js"></script>
    <script src="data/exams/ssc_ch1.js"></script>`;

if (!studyHtml.includes('class8-mcq-master-course.js')) {
    studyHtml = studyHtml.replace(targetScript, newScripts);
    console.log('Script tags added to study.html');
}

// 2. Add Class 8 MCQ Master Course Banner under the SSC banner
const targetBannerEnd = `                    </div>
                </div>
            </div>
        </div>


        <!-- Section 1: Choose Class / Level (Minimalist 3-Card Grid) -->`;

const class8BannerHtml = `                    </div>
                </div>
            </div>
        </div>

        <!-- ====================================================
             FEATURED OFFICIAL COURSE 2: CLASS 8 SCIENCE MCQ MASTER COURSE
        ==================================================== -->
        <div class="bg-gradient-to-r from-teal-950 via-slate-900 to-teal-950 rounded-3xl p-5 sm:p-7 border-2 border-teal-500/40 shadow-xl text-white relative overflow-hidden">
            <div class="absolute -right-12 -bottom-12 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
                <div class="space-y-2 max-w-2xl">
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-teal-400 to-teal-500 text-slate-950 uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                            <i class="fa-solid fa-microscope"></i> ৮ম শ্রেণি স্পেশাল
                        </span>
                        <span class="px-2.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold">
                            NCTB ২০২৬ বিজ্ঞান
                        </span>
                        <span class="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                            সেট ০১ ফ্রি ট্রায়াল উন্মুক্ত
                        </span>
                    </div>
                    <h2 class="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                        অষ্টম শ্রেণি বিজ্ঞান MCQ Master Course
                    </h2>
                    <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        অধ্যায় ১ (প্রাণিজগতের শ্রেণিবিন্যাস) ও অধ্যায় ২ (জীবের বৃদ্ধি ও বংশগতি)-এর মোট ২১০টি প্রিমিয়াম MCQ। ৫টি লেভেলভিত্তিক ওএমআর পরীক্ষা, র্যান্ডম প্রশ্ন এবং ইনস্ট্যান্ট ব্যাখ্যা।
                    </p>
                </div>

                <div class="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm min-w-[260px]">
                    <div>
                        <span class="text-[11px] text-slate-400 block font-semibold">এককালীন কোর্স ফি:</span>
                        <div class="flex items-baseline gap-2 mt-0.5">
                            <span class="text-3xl font-black text-teal-400">৳ ১৪৯</span>
                            <span class="text-sm line-through text-slate-400">৳ ৩৫০</span>
                            <span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">৫৮% ছাড়</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 w-full">
                        <button onclick="startClass8MasterCourseExam('c8_mcq_ch1_set1')" class="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap">
                            <i class="fa-solid fa-play"></i> ১ সেট ট্রায়াল দিন
                        </button>
                        <button onclick="openClass8EnrollModal()" class="flex-1 py-2.5 px-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-xs transition shadow-md whitespace-nowrap flex items-center justify-center gap-1">
                            <i class="fa-solid fa-bolt"></i> এনরোল (৳১৪৯)
                        </button>
                    </div>
                </div>
            </div>
        </div>


        <!-- Section 1: Choose Class / Level (Minimalist 3-Card Grid) -->`;

if (!studyHtml.includes('অষ্টম শ্রেণি বিজ্ঞান MCQ Master Course')) {
    studyHtml = studyHtml.replace(targetBannerEnd, class8BannerHtml);
    console.log('Class 8 Banner added to study.html');
}

// 3. Add Class 8 Enrollment Modal
const modalTarget = '</body>';
const class8ModalHtml = `
    <!-- ====================================================
         CLASS 8 MCQ MASTER COURSE ENROLLMENT MODAL
    ==================================================== -->
    <div id="class8-enroll-modal" class="hidden fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-slate-900 border border-teal-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl relative">
            <button onclick="closeClass8EnrollModal()" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <div class="space-y-2 mb-6">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    অষ্টম শ্রেণি বিজ্ঞান কোর্স
                </span>
                <h3 class="text-xl sm:text-2xl font-black text-white">Class 8 Science MCQ Master Course</h3>
                <p class="text-xs text-slate-300 leading-relaxed">
                    ১ম ও ২য় অধ্যায়ের ২১০টি স্পেশাল প্রশ্ন, ১২টি ওএমআর পরীক্ষা ও আনলিমিটেড ট্রায়াল আনলক করুন মাত্র ৳ ১৪৯ টাকায়।
                </p>
            </div>

            <!-- Payment instructions -->
            <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 mb-6 text-xs">
                <div class="flex items-center justify-between font-bold">
                    <span class="text-slate-300">মার্চেন্ট বিকাশ / নগদ নম্বর:</span>
                    <span class="font-mono text-teal-400 text-sm font-black">01896464903</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-slate-400">পেমেন্ট টাইপ:</span>
                    <span class="text-slate-200 font-semibold">Make Payment / Send Money</span>
                </div>
                <div class="flex items-center justify-between border-t border-slate-700/60 pt-2">
                    <span class="text-slate-400">কোর্স ফি:</span>
                    <span class="text-teal-400 font-black text-sm">৳ ১৪৯ (এককালীন)</span>
                </div>
            </div>

            <form id="c8-mcq-enroll-form" onsubmit="handleClass8EnrollSubmit(event)" class="space-y-4 text-xs">
                <div>
                    <label class="block text-slate-300 font-bold mb-1">আপনার প্রেরক মোবাইল নম্বর (bKash/Nagad):</label>
                    <input type="tel" id="c8-enroll-phone" required placeholder="01XXXXXXXXX" class="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono outline-none focus:border-teal-500">
                </div>

                <div>
                    <label class="block text-slate-300 font-bold mb-1">ট্রানজেকশন আইডি (TrxID):</label>
                    <input type="text" id="c8-enroll-trx" required placeholder="যেমন: BL9X8Z1Q" class="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono uppercase outline-none focus:border-teal-500">
                </div>

                <div class="pt-2 flex items-center justify-end gap-3">
                    <button type="button" onclick="closeClass8EnrollModal()" class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition">
                        বাতিল
                    </button>
                    <button type="submit" class="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-slate-950 rounded-xl font-black shadow-lg shadow-teal-500/20 transition flex items-center gap-1.5">
                        <i class="fa-solid fa-check"></i> জমা দিন
                    </button>
                </div>
            </form>
        </div>
    </div>
</body>`;

if (!studyHtml.includes('id="class8-enroll-modal"')) {
    studyHtml = studyHtml.replace(modalTarget, class8ModalHtml);
    console.log('Class 8 Enrollment modal added to study.html');
}

fs.writeFileSync('study.html', studyHtml);
fs.writeFileSync('www/study.html', studyHtml);
console.log('study.html and www/study.html synced successfully!');
