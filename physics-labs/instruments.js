import {C} from './draw.js';
export function instrument(d,p){
const isV=p.instrument==='vernier',res=isV?.1:.01,raw=Math.round((p.gap+p.zero)/res)*res;
d.text(isV?'VERNIER CALIPER':'MICROMETER SCREW GAUGE',450,48,16,C.muted,'center');
d.tag(p.gap-p.diameter<.05?'বস্তুর সঙ্গে সংস্পর্শে':'চোয়াল বস্তুর গায়ে আনো',450,90);
if(isV){
 const start=140,scale=16,jaw=start+p.gap*scale;
 d.rect(105,155,665,74,'#667c8c','#b7cedb',4);
 for(let i=0;i<=38;i++){const x=start+i*scale;d.line(x,155,x,155+(i%5?20:34),'#102737',1.4);if(i%5===0)d.text(i,x,210,13,C.white,'center');}
 d.rect(start-18,225,18,125,'#94b4c6',C.white,2);d.rect(jaw,225,18,125,'#94b4c6',C.white,2);
 d.orb(start+p.diameter*scale/2,290,p.diameter*scale/2,C.gold);
 d.rect(jaw-8,225,175,56,'#284a60',C.mint,5);
 // 10 vernier divisions = 9 main divisions, offset includes the zero error.
 const vzero=start+(p.gap+p.zero)*scale;
 for(let k=0;k<=10;k++){const x=vzero+k*.9*scale;d.line(x,225,x,225+(k%5?18:26),C.mint,1.2);if(k%5===0)d.text(k,x,265,12,C.mint,'center');}
 d.text('MAIN SCALE / mm',210,132,11,C.muted);d.text('VERNIER: 10 divisions = 9 mm',580,330,12,C.mint,'center');
}else{
 d.path([[205,180],[140,180],[115,220],[115,330],[145,365],[290,365],[330,330],[330,290]],'#58758a',30);
 d.path([[205,180],[140,180],[115,220],[115,330],[145,365],[290,365],[330,330],[330,290]],'#8eafc2',3);
 const left=210,scale=8,right=left+p.gap*scale;
 d.rect(180,210,30,75,'#9bb6c7',C.white,3);d.rect(right,232,440-right,28,'#b1c8d3',C.white,3);d.orb(left+p.diameter*4,245,p.diameter*4,C.gold);
 d.rect(440,205,170,85,'#678498','#bdd2df',4);d.line(445,245,610,245,C.white,1);
 for(let i=0;i<=20;i++){const x=445+i*7.5;d.line(x,245,x,245-(i%5?16:27),'#112735',1.4);if(i%5===0)d.text(i,x,220,11,C.white,'center');}
 d.rect(610,185,130,125,'#274b64',C.mint,10);
 const fraction=((raw*100)%50+50)%50;
 for(let j=-4;j<=4;j++){const number=(Math.round(fraction)+j*5+50)%50,y=245+j*12;d.line(612,y,632,y,C.mint,1.5);d.text(number,650,y,11,C.white);}
 for(let i=0;i<7;i++)d.line(690+i*6,195,690+i*6,300,'#739db166',2);
 d.text('পিচ 0.5 mm · বৃত্তাকার স্কেলে 50 ভাগ',510,350,15,C.muted,'center');
}
 const main=isV?Math.floor(raw):Math.floor(raw*2)/2,extra=raw-main;
 d.rect(140,395,620,82,'#0b1c2c',C.line,10);
 d.text(`মূল স্কেল: ${main.toFixed(isV?0:1)} mm`,170,421,15,C.blue);
 d.text(`সহায়ক অংশ: ${extra.toFixed(2)} mm`,470,421,15,C.gold);
 d.text(`মোট পাঠ: ${raw.toFixed(isV?1:2)} mm`,450,453,21,C.mint,'center');
}
