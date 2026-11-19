/**
 * Al amin Physics - BulkSMSBD SMS Gateway & ID Generation Engine
 * Author: আল আমিন স্যার (Al amin Sir), Joleshworitola, Bogura
 * Strict 1-SMS Limit Policy (Max 160 GSM 7-bit characters for English SMS)
 */

const SMS_STORAGE_KEYS = {
    STUDENTS: 'alamin_registered_students',
    ADMINS: 'alamin_admin_users',
    COUNTERS: 'alamin_student_id_counters',
    SMS_CONFIG: 'alamin_bulksmsbd_config',
    SMS_LOGS: 'alamin_sms_delivery_logs',
    CURRENT_STUDENT: 'alamin_active_student_session',
    CURRENT_ADMIN: 'alamin_active_admin_session',
    DIRECTOR_PASS: 'alamin_director_master_password'
};

/* ── Default BulkSMSBD Configuration ── */
const DEFAULT_BULKSMSBD_CONFIG = {
    apiKey: '', // Director can set in /director settings panel
    senderId: '8809617621111', // or approved alphanumeric sender
    apiUrl: 'https://bulksmsbd.net/api/smsapi',
    providerName: 'BulkSMSBD'
};

function getBulkSmsConfig() {
    try {
        const stored = localStorage.getItem(SMS_STORAGE_KEYS.SMS_CONFIG);
        return stored ? JSON.parse(stored) : DEFAULT_BULKSMSBD_CONFIG;
    } catch {
        return DEFAULT_BULKSMSBD_CONFIG;
    }
}

function saveBulkSmsConfig(config) {
    try {
        localStorage.setItem(SMS_STORAGE_KEYS.SMS_CONFIG, JSON.stringify(config));
    } catch (e) {
        console.error('Failed to save BulkSMSBD config:', e);
    }
}

/* ── Normalize Bangladeshi Phone Number ── */
function cleanBanglaPhone(rawPhone) {
    if (!rawPhone) return '';
    let p = String(rawPhone).trim().replace(/[^0-9]/g, '');
    if (p.startsWith('880')) {
        p = p.substring(2);
    }
    if (p.length === 10 && p.startsWith('1')) {
        p = '0' + p;
    }
    return p;
}

/* ── Student ID Generation as per Exact Specification ──
 * Class 8  -> AP-26-8001, 8002...
 * Class 9  -> AP-26-9001, 9002...
 * Class 10 -> AP-26-10001, 10002...
 * Class 11 -> AP-26-1101, 1102...
 * Class 12 -> AP-26-1201, 1202...
 */
function getNextStudentId(classKey) {
    let counters = {};
    try {
        const saved = localStorage.getItem(SMS_STORAGE_KEYS.COUNTERS);
        if (saved) counters = JSON.parse(saved);
    } catch {}

    const classPrefixMap = {
        '8':  { base: 8001,  key: 'c8' },
        '9':  { base: 9001,  key: 'c9' },
        '10': { base: 10001, key: 'c10' },
        '11': { base: 1101,  key: 'c11' },
        '12': { base: 1201,  key: 'c12' }
    };

    const target = classPrefixMap[String(classKey)] || classPrefixMap['9'];
    const currentNum = counters[target.key] || target.base;
    const assignedId = `AP-26-${currentNum}`;

    // Increment and save counter for next student
    counters[target.key] = currentNum + 1;
    try {
        localStorage.setItem(SMS_STORAGE_KEYS.COUNTERS, JSON.stringify(counters));
    } catch {}

    return assignedId;
}

/* ── Generate English Single-SMS Templates (Strictly <= 160 Chars) ── */
function makeStudentSmsMessage(name, studentId) {
    // Truncate first name only if very long to strictly preserve single SMS length
    const cleanName = (name || 'Student').trim().split(' ')[0].substring(0, 16);
    const msg = `Al amin Physics: Welcome ${cleanName}! Your Student ID is ${studentId}. Keep it safe to login at al-amin-physics.vercel.app`;
    return msg.substring(0, 160);
}

function makeAdminSmsMessage(name, adminId, password) {
    const cleanName = (name || 'Admin').trim().split(' ')[0].substring(0, 14);
    const msg = `Al amin Physics: Congrats ${cleanName}! Appointed as Admin. ID: ${adminId}, Pass: ${password}. Login: al-amin-physics.vercel.app/admin`;
    return msg.substring(0, 160);
}

/* ── Core SMS Dispatcher with BulkSMSBD Integration ── */
async function sendSmsNotification({ to, message, purpose, recipientName }) {
    const phone = cleanBanglaPhone(to);
    if (!phone || phone.length !== 11) {
        console.warn('Invalid Bangladeshi phone number for SMS:', to);
        return { success: false, error: 'Invalid phone number' };
    }

    // Strict 160-character enforcement for Single SMS cost saving
    const trimmedMessage = String(message || '').substring(0, 160);
    const charCount = trimmedMessage.length;
    const smsCount = 1; // Always 1 SMS

    const config = getBulkSmsConfig();
    const hasLiveKey = Boolean(config.apiKey && config.apiKey.trim().length > 5);

    let status = 'Dispatched (Simulated)';
    let gatewayResponse = 'Simulated Delivery (Ready for BulkSMSBD Live API Key)';

    if (hasLiveKey) {
        try {
            // BulkSMSBD Standard GET / POST API
            const formattedNumber = phone.startsWith('880') ? phone : '88' + phone;
            const targetUrl = `${config.apiUrl}?api_key=${encodeURIComponent(config.apiKey.trim())}&type=text&number=${encodeURIComponent(formattedNumber)}&senderid=${encodeURIComponent(config.senderId || '8809617621111')}&message=${encodeURIComponent(trimmedMessage)}`;
            
            const res = await fetch(targetUrl, { method: 'GET' });
            const data = await res.text();
            gatewayResponse = data;
            status = 'Dispatched via BulkSMSBD';
        } catch (err) {
            console.error('BulkSMSBD Network Error:', err);
            status = 'Network Error';
            gatewayResponse = err.message;
        }
    }

    // Save to Delivery Logs
    const logEntry = {
        id: 'sms_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        phone: phone,
        recipientName: recipientName || 'Unknown',
        purpose: purpose || 'System Notification',
        message: trimmedMessage,
        charCount: charCount,
        smsCount: smsCount,
        status: status,
        gatewayResponse: gatewayResponse,
        timestamp: new Date().toISOString()
    };

    try {
        const rawLogs = localStorage.getItem(SMS_STORAGE_KEYS.SMS_LOGS);
        const logs = rawLogs ? JSON.parse(rawLogs) : [];
        logs.unshift(logEntry);
        // keep recent 200 logs
        localStorage.setItem(SMS_STORAGE_KEYS.SMS_LOGS, JSON.stringify(logs.slice(0, 200)));
    } catch {}

    // Show Live On-Screen Toast Notification
    showSmsVisualToast(phone, trimmedMessage, charCount);

    return {
        success: true,
        charCount,
        smsCount,
        status,
        logEntry
    };
}

/* ── Elegant UI Toast Notification for Dispatched SMS ── */
function showSmsVisualToast(phone, message, charCount) {
    const existing = document.getElementById('sms-visual-toast-banner');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'sms-visual-toast-banner';
    toast.className = 'fixed top-5 right-5 z-[9999] max-w-sm w-full bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/40 transform transition-all duration-300 animate-bounce-once flex items-start gap-3';
    toast.innerHTML = `
        <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-lg border border-emerald-500/30">
            <i class="fa-solid fa-comment-sms"></i>
        </div>
        <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <i class="fa-solid fa-circle-check text-[10px]"></i> SMS Sent via BulkSMSBD
                </span>
                <span class="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full font-mono border border-emerald-800">
                    1 SMS (${charCount}/160)
                </span>
            </div>
            <p class="text-xs font-semibold text-slate-200">To: <span class="font-mono text-emerald-300">${phone}</span></p>
            <p class="text-[11px] text-slate-300 bg-slate-800/80 p-2 rounded-lg mt-1.5 font-sans leading-relaxed border border-slate-700">
                "${message}"
            </p>
        </div>
        <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white text-xs p-1">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        if (toast && toast.parentElement) {
            toast.classList.add('opacity-0', 'translate-x-4');
            setTimeout(() => toast.remove(), 400);
        }
    }, 7000);
}

// Export to window
if (typeof window !== 'undefined') {
    window.SMS_STORAGE_KEYS = SMS_STORAGE_KEYS;
    window.cleanBanglaPhone = cleanBanglaPhone;
    window.getNextStudentId = getNextStudentId;
    window.makeStudentSmsMessage = makeStudentSmsMessage;
    window.makeAdminSmsMessage = makeAdminSmsMessage;
    window.sendSmsNotification = sendSmsNotification;
    window.getBulkSmsConfig = getBulkSmsConfig;
    window.saveBulkSmsConfig = saveBulkSmsConfig;
}
