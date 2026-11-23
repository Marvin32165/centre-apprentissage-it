// Analyse les textes visibles et leurs fonds CSS pleins, en tenant compte des transparences.
import {chromium} from 'playwright';
import {pathToFileURL} from 'node:url';
import {readdirSync} from 'node:fs';
import path from 'node:path';
function pages(dir='.') {return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?(['.git','.github','node_modules','outils'].includes(e.name)?[]:pages(path.join(dir,e.name))):e.name.endsWith('.html')?[path.join(dir,e.name)]:[])}
const browser=await chromium.launch(), totals=new Map();
for(const theme of ['light','dark']){
 const ctx=await browser.newContext({viewport:{width:1280,height:900}});await ctx.addInitScript(t=>{try{localStorage.setItem('it.theme',t)}catch{}},theme);
 for(const page of pages()){
  const p=await ctx.newPage();await p.goto(pathToFileURL(path.resolve(page)).href);
  const results=await p.evaluate(()=>{
   const rgb=s=>{const a=s.match(/[\d.]+/g);return a?[+a[0],+a[1],+a[2],a[3]===undefined?1:+a[3]]:[0,0,0,0]};
   const mix=(a,b)=>[0,1,2].map(i=>a[i]*a[3]+b[i]*(1-a[3])).concat(1);
   const lum=a=>a.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
   const out=[];for(const e of document.querySelectorAll('body *')){
    if(![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))continue;
    const s=getComputedStyle(e), r=e.getBoundingClientRect();if(!r.width||!r.height||s.visibility!=='visible'||s.display==='none'||+s.opacity===0)continue;
    let bg=[255,255,255,1],chain=[],gradient=false;for(let n=e;n;n=n.parentElement){let c=getComputedStyle(n);if(c.backgroundImage!=='none')gradient=true;chain.push(rgb(c.backgroundColor))} for(const c of chain.reverse())bg=mix(c,bg);
    const fg=mix(rgb(s.color),bg),l1=lum(fg),l2=lum(bg),ratio=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05),size=parseFloat(s.fontSize),large=size>=24||(size>=18.66&&parseInt(s.fontWeight,10)>=700);
    if(ratio<(large?3:4.5))out.push({tag:e.tagName.toLowerCase(),cls:typeof e.className==='string'?e.className:'',txt:e.textContent.trim().slice(0,35),ratio:ratio.toFixed(2),gradient});
   }return out;
  }); for(const v of results){const k=JSON.stringify({theme,...v});totals.set(k,(totals.get(k)||0)+1)} await p.close();
 }
 await ctx.close();
}
await browser.close();console.log('Couples sous le seuil : '+totals.size);for(const [k,n] of totals)console.log(n+' × '+k);if(totals.size)process.exitCode=1;
