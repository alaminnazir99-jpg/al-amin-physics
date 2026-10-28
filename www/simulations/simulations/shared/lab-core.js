/**
 * AL AMIN PHYSICS — INTERACTIVE SIMULATION LAB SYSTEM
 * Core Toolkit, Physics Utilities, Bangla Numbering, Audio & UI Manager
 * Version 2.0 / 3.0
 */

(function (window) {
  'use strict';

  const LabCore = {};

  // -------------------------------------------------------------
  // 1. BANGLA NUMBER & UNIT UTILITIES
  // -------------------------------------------------------------
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const enDigits = { '০': 0, '১': 1, '২': 2, '৩': 3, '৪': 4, '৫': 5, '৬': 6, '৭': 7, '৮': 8, '৯': 9 };

  LabCore.toBn = function (val, precision = null) {
    if (val === null || val === undefined || isNaN(val)) return '—';
    let numStr = precision !== null ? Number(val).toFixed(precision) : String(val);
    return numStr.replace(/\d/g, (d) => bnDigits[Number(d)]);
  };

  LabCore.toEn = function (str) {
    if (!str) return 0;
    let s = String(str);
    let enStr = s.replace(/[০-৯]/g, (d) => enDigits[d]);
    return parseFloat(enStr) || 0;
  };

  // -------------------------------------------------------------
  // 2. PROCEDURAL SYNTHESIZED AUDIO (Web Audio API - Zero Assets)
  // -------------------------------------------------------------
  class LabAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = localStorage.getItem('alamin_lab_muted') === 'true';
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      localStorage.setItem('alamin_lab_muted', String(this.isMuted));
      return this.isMuted;
    }

    playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.15) {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    }

    playClick() {
      this.playTone(850, 'triangle', 0.04, 0.1);
    }

    playSnap() {
      this.playTone(1200, 'square', 0.03, 0.08);
    }

    playLaser() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
      } catch (e) {}
    }

    playSuccess() {
      if (this.isMuted) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        setTimeout(() => this.playTone(freq, 'sine', 0.15, 0.2), i * 90);
      });
    }

    playError() {
      if (this.isMuted) return;
      this.playTone(200, 'sawtooth', 0.2, 0.2);
    }
  }

  LabCore.Audio = new LabAudioEngine();

  // -------------------------------------------------------------
  // 3. CANVAS DEVICE-PIXEL-RATIO HIGH-DPI SCALER
  // -------------------------------------------------------------
  LabCore.setupCanvas = function (canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { ctx, width: rect.width, height: rect.height, dpr };
  };

  // -------------------------------------------------------------
  // 4. KATEX FORMULA HELPER
  // -------------------------------------------------------------
  LabCore.renderMath = function (elem, latexStr) {
    if (typeof katex !== 'undefined' && elem) {
      try {
        katex.render(latexStr, elem, { throwOnError: false, displayMode: true });
      } catch (e) {
        elem.textContent = latexStr;
      }
    }
  };

  LabCore.renderFormulaCard = function (containerId, info) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = `
      <div class="lab-formula-card">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">${info.title || 'সূত্র ও হিসাব'}</span>
          <span class="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">${info.code || ''}</span>
        </div>
        <div class="my-2 py-1 bg-slate-900/60 rounded-lg text-center" id="${containerId}-math"></div>
        <div class="text-xs text-slate-300 flex items-center justify-between border-t border-slate-700/60 pt-1.5 mt-1.5">
          <span>${info.explanation || ''}</span>
          <span class="font-bold text-cyan-400 font-mono">${info.liveResult || ''}</span>
        </div>
      </div>
    `;
    const mathEl = document.getElementById(`${containerId}-math`);
    if (mathEl && info.latex) {
      LabCore.renderMath(mathEl, info.latex);
    }
  };

  // -------------------------------------------------------------
  // 5. FLOATING MEASUREMENT TOOLS (Protractor & Ruler)
  // -------------------------------------------------------------
  class ProtractorTool {
    constructor(container) {
      this.container = container;
      this.el = null;
      this.angle = 0;
      this.isDragging = false;
      this.startX = 0;
      this.startY = 0;
      this.currentX = 50;
      this.currentY = 50;
      this.init();
    }

    init() {
      this.el = document.createElement('div');
      this.el.className = 'lab-floating-tool hidden';
      this.el.innerHTML = `
        <div class="lab-protractor" id="lab-protractor-body">
          <div class="absolute top-2 left-0 right-0 text-center text-[10px] font-bold text-sky-900">
            পাঠ: <span id="lab-protractor-readout">০°</span>
          </div>
          <!-- Angle ticks -->
          <svg class="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 280 140">
            <path d="M 10 140 A 130 130 0 0 1 270 140" fill="none" stroke="#0284c7" stroke-width="2"/>
            <line x1="140" y1="140" x2="140" y2="10" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="3,3"/>
          </svg>
          <div class="lab-protractor-origin" title="মূলবিন্দু"></div>
        </div>
        <div class="flex items-center justify-center gap-1 mt-1 bg-slate-900/80 px-2 py-1 rounded-full text-xs text-white border border-slate-700">
          <button type="button" class="px-1.5 hover:text-sky-400" id="lab-prot-rot-l" title="ঘূর্ণন বামে"><i class="fa-solid fa-rotate-left"></i></button>
          <span class="text-[10px] font-mono" id="lab-prot-angle-badge">০°</span>
          <button type="button" class="px-1.5 hover:text-sky-400" id="lab-prot-rot-r" title="ঘূর্ণন ডানে"><i class="fa-solid fa-rotate-right"></i></button>
        </div>
      `;

      this.container.appendChild(this.el);
      this.bindEvents();
    }

    bindEvents() {
      const handle = this.el.querySelector('#lab-protractor-body');
      handle.addEventListener('pointerdown', (e) => {
        this.isDragging = true;
        this.startX = e.clientX - this.currentX;
        this.startY = e.clientY - this.currentY;
        handle.setPointerCapture(e.pointerId);
        LabCore.Audio.playClick();
      });

      handle.addEventListener('pointermove', (e) => {
        if (!this.isDragging) return;
        this.currentX = e.clientX - this.startX;
        this.currentY = e.clientY - this.startY;
        this.el.style.left = `${this.currentX}px`;
        this.el.style.top = `${this.currentY}px`;
      });

      handle.addEventListener('pointerup', (e) => {
        this.isDragging = false;
        try { handle.releasePointerCapture(e.pointerId); } catch(err){}
      });

      this.el.querySelector('#lab-prot-rot-l').addEventListener('click', () => this.rotate(-5));
      this.el.querySelector('#lab-prot-rot-r').addEventListener('click', () => this.rotate(5));
    }

    rotate(delta) {
      this.angle = (this.angle + delta) % 360;
      if (this.angle < 0) this.angle += 360;
      const body = this.el.querySelector('#lab-protractor-body');
      body.style.transform = `rotate(${this.angle}deg)`;
      this.el.querySelector('#lab-protractor-readout').textContent = LabCore.toBn(this.angle) + '°';
      this.el.querySelector('#lab-prot-angle-badge').textContent = LabCore.toBn(this.angle) + '°';
      LabCore.Audio.playTick();
    }

    toggle() {
      const isHidden = this.el.classList.toggle('hidden');
      if (!isHidden) LabCore.Audio.playSnap();
      return !isHidden;
    }
  }

  // Ruler Tool
  class RulerTool {
    constructor(container) {
      this.container = container;
      this.el = null;
      this.isDragging = false;
      this.startX = 0;
      this.startY = 0;
      this.currentX = 60;
      this.currentY = 180;
      this.init();
    }

    init() {
      this.el = document.createElement('div');
      this.el.className = 'lab-floating-tool hidden';
      this.el.innerHTML = `
        <div class="lab-ruler" id="lab-ruler-body">
          <div class="flex justify-between w-full relative h-full">
            <!-- 0 to 15 cm ticks -->
            ${Array.from({ length: 16 }).map((_, i) => `
              <div class="relative flex flex-col items-center">
                <span class="absolute -top-4 text-[9px] font-bold">${i}</span>
                <div class="w-[1.5px] h-3 bg-amber-900"></div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      this.container.appendChild(this.el);
      this.bindEvents();
    }

    bindEvents() {
      const body = this.el.querySelector('#lab-ruler-body');
      body.addEventListener('pointerdown', (e) => {
        this.isDragging = true;
        this.startX = e.clientX - this.currentX;
        this.startY = e.clientY - this.currentY;
        body.setPointerCapture(e.pointerId);
        LabCore.Audio.playClick();
      });

      body.addEventListener('pointermove', (e) => {
        if (!this.isDragging) return;
        this.currentX = e.clientX - this.startX;
        this.currentY = e.clientY - this.startY;
        this.el.style.left = `${this.currentX}px`;
        this.el.style.top = `${this.currentY}px`;
      });

      body.addEventListener('pointerup', (e) => {
        this.isDragging = false;
        try { body.releasePointerCapture(e.pointerId); } catch(err){}
      });
    }

    toggle() {
      const isHidden = this.el.classList.toggle('hidden');
      if (!isHidden) LabCore.Audio.playSnap();
      return !isHidden;
    }
  }

  LabCore.initTools = function (container) {
    return {
      protractor: new ProtractorTool(container),
      ruler: new RulerTool(container)
    };
  };

  // -------------------------------------------------------------
  // 6. EXPERIMENTAL DATA TABLE & REPORT RECORDER
  // -------------------------------------------------------------
  class LabDataTable {
    constructor(tableBodyId, statSummaryId = null) {
      this.tbody = document.getElementById(tableBodyId);
      this.statSummary = statSummaryId ? document.getElementById(statSummaryId) : null;
      this.trials = [];
    }

    recordTrial(rowObj) {
      this.trials.push(rowObj);
      this.render();
      LabCore.Audio.playSnap();
    }

    clear() {
      this.trials = [];
      this.render();
      LabCore.Audio.playClick();
    }

    render() {
      if (!this.tbody) return;
      if (this.trials.length === 0) {
        this.tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-slate-500 text-xs">কোনো পরীক্ষার মান এখনও যোগ করা হয়নি। পরীক্ষা চালিয়ে [+ মান যোগ করো] বোতাম চাপুন।</td></tr>`;
        if (this.statSummary) this.statSummary.innerHTML = '';
        return;
      }

      this.tbody.innerHTML = this.trials.map((t, idx) => `
        <tr class="border-b border-slate-700/50 hover:bg-slate-800/40 text-xs">
          <td class="py-2 px-3 text-cyan-400 font-bold">${LabCore.toBn(idx + 1)}</td>
          <td class="py-2 px-3">${t.input1 || '—'}</td>
          <td class="py-2 px-3">${t.input2 || '—'}</td>
          <td class="py-2 px-3 font-semibold text-emerald-400">${t.output || '—'}</td>
          <td class="py-2 px-3 text-slate-400">${t.calculated || '—'}</td>
          <td class="py-2 px-3 text-amber-400">${t.error ? t.error + '%' : '০%'}</td>
        </tr>
      `).join('');
    }

    exportCSV(filename = 'lab-experiment-data.csv') {
      if (this.trials.length === 0) return;
      const headers = Object.keys(this.trials[0]).join(',');
      const rows = this.trials.map(t => Object.values(t).join(',')).join('\n');
      const csv = `${headers}\n${rows}`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  LabCore.DataTable = LabDataTable;

  // -------------------------------------------------------------
  // 7. CHALLENGE & CELEBRATION ENGINE
  // -------------------------------------------------------------
  LabCore.triggerCelebration = function (title, message) {
    LabCore.Audio.playSuccess();
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    const overlay = document.createElement('div');
    overlay.className = 'lab-challenge-overlay';
    overlay.innerHTML = `
      <div class="bg-slate-900 border border-emerald-500/40 p-6 rounded-3xl max-w-sm w-full shadow-2xl">
        <div class="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl border border-emerald-500/30">
          <i class="fa-solid fa-trophy"></i>
        </div>
        <h4 class="text-xl font-bold text-white mb-1">${title || 'অসাধারণ! চ্যালেঞ্জ সম্পন্ন!'}</h4>
        <p class="text-xs text-slate-300 mb-4">${message || 'তুমি পদার্থবিজ্ঞানের সূত্রটি সফলভাবে প্রয়োগ করে সঠিক মানে পৌঁছাতে পেরেছো।'}</p>
        <button type="button" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition" id="lab-challenge-close-btn">
          পরবর্তী পরীক্ষা <i class="fa-solid fa-arrow-right ml-1"></i>
        </button>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('#lab-challenge-close-btn').addEventListener('click', () => {
      overlay.remove();
    });
  };

  // -------------------------------------------------------------
  // 8. DEEP LINK ROUTER (Handles ?id=S12, S14, etc.)
  // -------------------------------------------------------------
  LabCore.getUrlParam = function (name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  };

  // Expose globally
  window.LabCore = LabCore;

})(window);
