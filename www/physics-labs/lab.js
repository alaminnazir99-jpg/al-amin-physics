export const range=(key,label,min,max,value,step=1,unit='')=>({key,label,min,max,value,step,unit,type:'range'});
export const choice=(key,label,options,value)=>({key,label,options,value,type:'select'});
export const toggle=(key,label,value=false)=>({key,label,value,type:'check'});
export const buttons=(items)=>({type:'buttons',items});
export function lab(controls,initial={}){const o={controls,p:Object.fromEntries(controls.filter(c=>c.key).map(c=>[c.key,c.value])),s:{t:0,...initial},drag:null,step(dt){this.s.t+=dt;},draw(){},readings(){return[];},down(){},move(){},up(){this.drag=null;},change(){},action(){}};return o;}
export const near=(x,y,X,Y,r=35)=>Math.hypot(x-X,y-Y)<r;
export const read=(name,value,unit='')=>({name,value,unit});
