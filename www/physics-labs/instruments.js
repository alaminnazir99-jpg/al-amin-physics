import {C} from './draw.js';

export function instrument(d, p) {
  const isV = p.instrument === 'vernier';
  const res = isV ? 0.1 : 0.01;
  const raw = Math.round((p.gap + p.zero) / res) * res;

  d.text(isV ? 'VERNIER CALIPER (সিলভার স্লাইড ক্যালিপার্স)' : 'MICROMETER SCREW GAUGE (স্ক্রু গজ)', 450, 42, 16, C.muted, 'center');
  d.tag(p.gap - p.diameter < 0.05 ? 'বস্তুর সঙ্গে সংস্পর্শে আছে' : 'চোয়াল বস্তুর গায়ে স্পর্শ করো', 450, 78);

  const ctx = d.c;

  if (isV) {
    const start = 140, scale = 16, jaw = start + p.gap * scale;

    // 1. Depth Probe Blade extending from right tail
    const tailX = 770;
    ctx.save();
    const bladeGrad = ctx.createLinearGradient(0, 185, 0, 197);
    bladeGrad.addColorStop(0, '#e2e8f0');
    bladeGrad.addColorStop(0.5, '#f8fafc');
    bladeGrad.addColorStop(1, '#94a3b8');
    ctx.fillStyle = bladeGrad;
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.fillRect(tailX, 186, p.gap * scale, 12);
    ctx.strokeRect(tailX, 186, p.gap * scale, 12);
    ctx.restore();

    // 2. Main Beam (Fixed Rule) - Brushed Silver Metallic Steel
    ctx.save();
    const beamGrad = ctx.createLinearGradient(0, 150, 0, 226);
    beamGrad.addColorStop(0, '#f1f5f9');
    beamGrad.addColorStop(0.15, '#cbd5e1');
    beamGrad.addColorStop(0.5, '#e2e8f0');
    beamGrad.addColorStop(0.85, '#94a3b8');
    beamGrad.addColorStop(1, '#64748b');
    d.rect(95, 150, 675, 76, beamGrad, '#475569', 4);

    // Fixed Left Jaw (Base) - Contoured Machinist Jaw
    const jawGrad = ctx.createLinearGradient(70, 0, 140, 0);
    jawGrad.addColorStop(0, '#94a3b8');
    jawGrad.addColorStop(0.4, '#e2e8f0');
    jawGrad.addColorStop(0.9, '#cbd5e1');
    jawGrad.addColorStop(1, '#f1f5f9');

    // Upper fixed internal jaw
    d.path([[140, 150], [130, 95], [115, 95], [115, 150]], jawGrad, 1.5, jawGrad);
    // Lower fixed external jaw
    d.path([[140, 226], [140, 360], [125, 360], [105, 270], [95, 226]], jawGrad, 1.5, jawGrad);
    // Precision ground measuring face highlight
    d.line(140, 226, 140, 360, '#ffffff', 2);
    d.line(140, 95, 140, 150, '#ffffff', 2);

    // Main Scale Laser-etched black millimeter graduations
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#0f172a';
    for (let i = 0; i <= 38; i++) {
      const x = start + i * scale;
      const isCm = i % 10 === 0, isHalf = i % 5 === 0;
      const len = isCm ? 32 : (isHalf ? 22 : 14);
      d.line(x, 150, x, 150 + len, '#0f172a', isCm ? 1.5 : 1.1);
      if (isCm) {
        d.text(i / 10, x, 196, 13, '#0f172a', 'center');
      }
    }
    d.text('cm', 745, 196, 11, '#334155', 'center');
    d.text('STAINLESS STEEL • 1 MSD = 1 mm', 440, 134, 10, '#64748b', 'center');

    // 3. Specimen (Object being measured)
    const objR = p.diameter * scale / 2;
    const objCx = start + objR;
    const objCy = 290;
    const spGrad = ctx.createRadialGradient(objCx - objR * 0.3, objCy - objR * 0.35, 1, objCx, objCy, objR);
    spGrad.addColorStop(0, '#fef3c7');
    spGrad.addColorStop(0.4, '#f59e0b');
    spGrad.addColorStop(0.85, '#d97706');
    spGrad.addColorStop(1, '#78350f');
    ctx.beginPath();
    ctx.arc(objCx, objCy, objR, 0, Math.PI * 2);
    ctx.fillStyle = spGrad;
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 4. Sliding Vernier Assembly - Brushed Silver Slider
    const vGrad = ctx.createLinearGradient(jaw - 20, 0, jaw + 170, 0);
    vGrad.addColorStop(0, '#f8fafc');
    vGrad.addColorStop(0.2, '#cbd5e1');
    vGrad.addColorStop(0.6, '#e2e8f0');
    vGrad.addColorStop(1, '#94a3b8');

    // Upper sliding internal jaw
    d.path([[jaw, 150], [jaw + 10, 95], [jaw + 25, 95], [jaw + 25, 150]], vGrad, 1.5, vGrad);
    // Lower sliding external jaw
    d.path([[jaw, 226], [jaw, 360], [jaw + 15, 360], [jaw + 35, 270], [jaw + 55, 226]], vGrad, 1.5, vGrad);
    // Precision face line
    d.line(jaw, 226, jaw, 360, '#ffffff', 2);
    d.line(jaw, 95, jaw, 150, '#ffffff', 2);

    // Slider body and beveled window
    d.rect(jaw - 10, 140, 175, 96, vGrad, '#475569', 5);
    // Beveled cutout window
    d.rect(jaw + 10, 155, 145, 66, 'rgba(255,255,255,0.88)', '#64748b', 3);

    // Locking screw on top
    d.rect(jaw + 60, 126, 22, 14, '#94a3b8', '#334155', 2);
    d.circle(jaw + 71, 124, 7, '#cbd5e1', '#334155');

    // Knurled thumb wheel on bottom right
    d.rect(jaw + 145, 220, 20, 26, '#64748b', '#334155', 3);
    for (let tw = 0; tw < 5; tw++) {
      d.line(jaw + 148 + tw * 3, 222, jaw + 148 + tw * 3, 244, '#cbd5e1', 1);
    }

    // 5. Vernier Scale Markings (10 divisions = 9 mm)
    const vzero = start + (p.gap + p.zero) * scale;
    const coincidentIdx = Math.round(((p.gap + p.zero) % 1) * 10);

    for (let k = 0; k <= 10; k++) {
      const vx = vzero + k * 0.9 * scale;
      const vlen = k % 5 === 0 ? 24 : 15;
      const isCoincide = k === coincidentIdx;
      d.line(vx, 155, vx, 155 + vlen, isCoincide ? '#0284c7' : '#0f172a', isCoincide ? 2 : 1.2);
      if (k % 5 === 0) {
        d.text(k, vx, 192, 11, isCoincide ? '#0284c7' : '#0f172a', 'center');
      }
    }

    ctx.restore();
    d.text('VERNIER: 10 ভাগ = 9 mm (VC = 0.1 mm)', jaw + 80, 252, 11, '#0284c7', 'center');
  } else {
    d.path([[205, 180], [140, 180], [115, 220], [115, 330], [145, 365], [290, 365], [330, 330], [330, 290]], '#58758a', 30);
    d.path([[205, 180], [140, 180], [115, 220], [115, 330], [145, 365], [290, 365], [330, 330], [330, 290]], '#8eafc2', 3);
    const left = 210, scale = 8, right = left + p.gap * scale;
    d.rect(180, 210, 30, 75, '#9bb6c7', C.white, 3);
    d.rect(right, 232, 440 - right, 28, '#b1c8d3', C.white, 3);
    d.orb(left + p.diameter * 4, 245, p.diameter * 4, C.gold);
    d.rect(440, 205, 170, 85, '#678498', '#bdd2df', 4);
    d.line(445, 245, 610, 245, C.white, 1);
    for (let i = 0; i <= 20; i++) {
      const x = 445 + i * 7.5;
      d.line(x, 245, x, 245 - (i % 5 ? 16 : 27), '#112735', 1.4);
      if (i % 5 === 0) d.text(i, x, 220, 11, C.white, 'center');
    }
    d.rect(610, 185, 130, 125, '#274b64', C.mint, 10);
    const fraction = ((raw * 100) % 50 + 50) % 50;
    for (let j = -4; j <= 4; j++) {
      const number = (Math.round(fraction) + j * 5 + 50) % 50;
      const y = 245 + j * 12;
      d.line(612, y, 632, y, C.mint, 1.5);
      d.text(number, 650, y, 11, C.white);
    }
    for (let i = 0; i < 7; i++) d.line(690 + i * 6, 195, 690 + i * 6, 300, '#739db166', 2);
    d.text('পিচ 0.5 mm · বৃত্তাকার স্কেলে 50 ভাগ', 510, 350, 15, C.muted, 'center');
  }

  const main = isV ? Math.floor(raw) : Math.floor(raw * 2) / 2;
  const extra = raw - main;
  d.rect(140, 395, 620, 82, '#0b1c2c', C.line, 10);
  d.text(`মূল স্কেল: ${main.toFixed(isV ? 0 : 1)} mm`, 170, 421, 15, C.blue);
  d.text(`সহায়ক অংশ: ${extra.toFixed(2)} mm`, 470, 421, 15, C.gold);
  d.text(`মোট পাঠ: ${raw.toFixed(isV ? 1 : 2)} mm`, 450, 453, 21, C.mint, 'center');
}
