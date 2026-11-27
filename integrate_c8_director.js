const fs = require('fs');

let dirHtml = fs.readFileSync('director.html', 'utf8');

// 1. Add script tag for class8-mcq-master-course.js
if (!dirHtml.includes('class8-mcq-master-course.js')) {
    dirHtml = dirHtml.replace('<script src="js/mcq-master-course.js"></script>', '<script src="js/mcq-master-course.js"></script>\n    <script src="js/class8-mcq-master-course.js"></script>');
    console.log('Script added to director.html');
}

// 2. Add Tab button for Class 8 MCQ Master Course
const sscTabBtn = `<button onclick="switchDirectorTab('mcq-course')" id="dir-tab-mcq-course" class="px-4 py-2.5 rounded-xl font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:text-white flex items-center gap-2 whitespace-nowrap transition">
                    <i class="fa-solid fa-crown text-amber-400"></i> SSC MCQ Master Course
                </button>`;

const c8TabBtn = `<button onclick="switchDirectorTab('c8-mcq-course')" id="dir-tab-c8-mcq-course" class="px-4 py-2.5 rounded-xl font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 hover:text-white flex items-center gap-2 whitespace-nowrap transition">
                    <i class="fa-solid fa-microscope text-teal-400"></i> ৮ম শ্রেণি বিজ্ঞান MCQ Course
                </button>`;

if (!dirHtml.includes('dir-tab-c8-mcq-course')) {
    dirHtml = dirHtml.replace(sscTabBtn, sscTabBtn + '\n                ' + c8TabBtn);
    console.log('Class 8 Tab Button added to director.html');
}

// 3. Add Tab Pane for Class 8 MCQ Course
const sscPaneTarget = '</div>\n\n            <!-- ==============================================\n                 TAB 1: ADMIN MANAGEMENT (Create Admin & SMS)';

const c8PaneHtml = `
            <!-- ==============================================
                 TAB: CLASS 8 SCIENCE MCQ MASTER COURSE
            ============================================== -->
            <div id="dir-pane-c8-mcq-course" class="hidden space-y-6">
                <!-- Stat Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
                        <span class="text-xs text-slate-400 font-bold block">৮ম শ্রেণি অনুমোদিত শিক্ষার্থী</span>
                        <div id="c8-mcq-dir-stat-enrolled" class="text-2xl sm:text-3xl font-black text-teal-400 font-mono">০ জন</div>
                        <p class="text-[10px] text-slate-500">Class 8 Science MCQ Course অ্যাক্টিভ</p>
                    </div>

                    <div class="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
                        <span class="text-xs text-slate-400 font-bold block">অপেক্ষমাণ এনরোলমেন্ট রিকোয়েস্ট</span>
                        <div id="c8-mcq-dir-stat-pending" class="text-2xl sm:text-3xl font-black text-amber-400 font-mono">০টি</div>
                        <p class="text-[10px] text-amber-400/80 font-semibold">ম্যানুয়াল যাচাই প্রয়োজন</p>
                    </div>

                    <div class="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
                        <span class="text-xs text-slate-400 font-bold block">মোট সংগৃহীত কোর্স ফি</span>
                        <div id="c8-mcq-dir-stat-revenue" class="text-2xl sm:text-3xl font-black text-blue-400 font-mono">৳ ০</div>
                        <p class="text-[10px] text-slate-500">১৪৯ টাকা এককালীন ফি ভিত্তিক</p>
                    </div>
                </div>

                <!-- Pending Requests Table -->
                <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                    <div class="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
                        <div>
                            <h4 class="font-bold text-sm text-white flex items-center gap-2">
                                <i class="fa-solid fa-clock-rotate-left text-teal-400"></i> ৮ম শ্রেণি এনরোলমেন্ট অনুমোদন (ম্যানুয়াল ভেরিফিকেশন)
                            </h4>
                            <p class="text-xs text-slate-400 mt-0.5">মার্চেন্ট নম্বরে (01896464903) টাকা আসার পর TrxID মিলিয়ে এক ক্লিকে অ্যাক্টিভ করুন।</p>
                        </div>
                        <button onclick="renderClass8DirectorDashboard()" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                            <i class="fa-solid fa-rotate"></i> রিফ্রেশ
                        </button>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs">
                            <thead class="bg-slate-800/60 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                                <tr>
                                    <th class="p-4">প্রেরক ফোন</th>
                                    <th class="p-4">ট্রানজেকশন আইডি (TrxID)</th>
                                    <th class="p-4">টাকার পরিমাণ</th>
                                    <th class="p-4">সাবমিটের সময়</th>
                                    <th class="p-4">স্ট্যাটাস</th>
                                    <th class="p-4 text-right">ডিরেক্টর অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody id="c8-mcq-pending-requests-tbody" class="divide-y divide-slate-800/60">
                                <tr><td colspan="6" class="p-5 text-center text-slate-500">কোনো অপেক্ষমাণ রিকোয়েস্ট নেই।</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Enrolled Students Table -->
                <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                    <div class="p-4 border-b border-slate-800 flex items-center justify-between">
                        <h4 class="font-bold text-sm text-white flex items-center gap-2">
                            <i class="fa-solid fa-user-check text-teal-400"></i> ৮ম শ্রেণি অনুমোদিত শিক্ষার্থী তালিকা
                        </h4>
                        <span id="c8-mcq-enrolled-count-tag" class="text-xs text-teal-400 font-mono">০ জন শিক্ষার্থী</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs">
                            <thead class="bg-slate-800/60 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                                <tr>
                                    <th class="p-4">নাম ও শিক্ষার্থী আইডি</th>
                                    <th class="p-4">মোবাইল নম্বর</th>
                                    <th class="p-4">ট্রানজেকশন আইডি</th>
                                    <th class="p-4">অনুমোদনের তারিখ</th>
                                    <th class="p-4">কোর্স স্ট্যাটাস</th>
                                </tr>
                            </thead>
                            <tbody id="c8-mcq-enrolled-students-tbody" class="divide-y divide-slate-800/60">
                                <tr><td colspan="5" class="p-5 text-center text-slate-500">এখনো কোনো শিক্ষার্থী এনরোল করেনি।</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
`;

if (!dirHtml.includes('id="dir-pane-c8-mcq-course"')) {
    dirHtml = dirHtml.replace(sscPaneTarget, '</div>\n' + c8PaneHtml + '\n            <!-- ==============================================\n                 TAB 1: ADMIN MANAGEMENT (Create Admin & SMS)');
    console.log('Class 8 Pane added to director.html');
}

// 4. Update switchDirectorTab to recognize 'c8-mcq-course'
dirHtml = dirHtml.replace(
    "const tabs = ['mcq-course', 'admins', 'students', 'finance', 'exams', 'sms', 'settings'];",
    "const tabs = ['mcq-course', 'c8-mcq-course', 'admins', 'students', 'finance', 'exams', 'sms', 'settings'];"
);

// 5. Add renderClass8DirectorDashboard function
const c8DirFunctions = `
        function renderClass8DirectorDashboard() {
            if (!window.C8_MCQ_MASTER) return;

            const requests = window.C8_MCQ_MASTER.getStorage(window.C8_MCQ_MASTER.KEYS.ENROLL_REQUESTS, []);
            const enrolled = window.C8_MCQ_MASTER.getStorage(window.C8_MCQ_MASTER.KEYS.ENROLLED_STUDENTS, []);

            const pending = requests.filter(r => r.status === 'pending');

            const statEnrolled = document.getElementById('c8-mcq-dir-stat-enrolled');
            const statPending = document.getElementById('c8-mcq-dir-stat-pending');
            const statRevenue = document.getElementById('c8-mcq-dir-stat-revenue');
            const countTag = document.getElementById('c8-mcq-enrolled-count-tag');

            if (statEnrolled) statEnrolled.textContent = \`\${enrolled.length} জন\`;
            if (statPending) statPending.textContent = \`\${pending.length}টি\`;
            if (statRevenue) statRevenue.textContent = \`৳ \${(enrolled.length * 149).toLocaleString('bn-BD')}\`;
            if (countTag) countTag.textContent = \`\${enrolled.length} জন শিক্ষার্থী\`;

            const reqTbody = document.getElementById('c8-mcq-pending-requests-tbody');
            if (reqTbody) {
                if (pending.length === 0) {
                    reqTbody.innerHTML = '<tr><td colspan=\"6\" class=\"p-5 text-center text-slate-500\">কোনো অপেক্ষমাণ রিকোয়েস্ট নেই।</td></tr>';
                } else {
                    reqTbody.innerHTML = pending.map(req => \`
                        <tr class=\"hover:bg-slate-800/40 transition\">
                            <td class=\"p-4 font-mono font-bold text-white\">\${req.senderPhone}</td>
                            <td class=\"p-4 font-mono text-teal-400 font-bold\">\${req.transactionId}</td>
                            <td class=\"p-4 font-bold text-emerald-400\">৳ \${req.amount}</td>
                            <td class=\"p-4 text-slate-400\">\${req.submittedAt}</td>
                            <td class=\"p-4\"><span class=\"px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30\">অপেক্ষমাণ</span></td>
                            <td class=\"p-4 text-right space-x-2\">
                                <button onclick=\"handleApproveC8McqReq('\${req.id}')\" class=\"px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs transition shadow-sm\">
                                    <i class=\"fa-solid fa-check\"></i> অ্যাক্টিভ করুন
                                </button>
                            </td>
                        </tr>
                    \`).join('');
                }
            }

            const enrTbody = document.getElementById('c8-mcq-enrolled-students-tbody');
            if (enrTbody) {
                if (enrolled.length === 0) {
                    enrTbody.innerHTML = '<tr><td colspan=\"5\" class=\"p-5 text-center text-slate-500\">এখনো কোনো শিক্ষার্থী এনরোল করেনি।</td></tr>';
                } else {
                    enrTbody.innerHTML = enrolled.map(st => \`
                        <tr class=\"hover:bg-slate-800/40 transition\">
                            <td class=\"p-4 font-bold text-white\">\${st.name || 'শিক্ষার্থী'} (\${st.studentId})</td>
                            <td class=\"p-4 font-mono text-slate-300\">\${st.phone}</td>
                            <td class=\"p-4 font-mono text-teal-400 font-bold\">\${st.trxId}</td>
                            <td class=\"p-4 text-slate-400\">\${st.approvedAt}</td>
                            <td class=\"p-4\"><span class=\"px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30\">অ্যাক্টিভ</span></td>
                        </tr>
                    \`).join('');
                }
            }
        }

        function handleApproveC8McqReq(id) {
            if (!confirm('আপনি কি নিশ্চিত যে পেমেন্ট যাচাই করে এই শিক্ষার্থীর জন্য অষ্টম শ্রেণি বিজ্ঞান কোর্সটি সক্রিয় করতে চান?')) return;
            const res = window.C8_MCQ_MASTER.approveEnrollment(id);
            alert(res.message);
            renderClass8DirectorDashboard();
        }
`;

if (!dirHtml.includes('function renderClass8DirectorDashboard')) {
    dirHtml = dirHtml.replace(
        "if (tabName === 'mcq-course' && typeof renderMcqDirectorDashboard === 'function') {",
        "if (tabName === 'c8-mcq-course' && typeof renderClass8DirectorDashboard === 'function') { renderClass8DirectorDashboard(); }\n            if (tabName === 'mcq-course' && typeof renderMcqDirectorDashboard === 'function') {"
    );
    dirHtml = dirHtml.replace('function renderMcqDirectorDashboard() {', c8DirFunctions + '\n        function renderMcqDirectorDashboard() {');
    console.log('Class 8 functions added to director.html');
}

fs.writeFileSync('director.html', dirHtml);
fs.writeFileSync('www/director.html', dirHtml);
console.log('director.html updated successfully!');
