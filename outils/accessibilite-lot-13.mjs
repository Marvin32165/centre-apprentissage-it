// Vérifications reproductibles d'accessibilité ; aucun fichier du site n'est chargé par fetch.
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import {readdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const base = pathToFileURL(process.cwd() + '/').href;
const browser = await chromium.launch();
const errors = [];
async function test(name, fn) { try { await fn(); console.log('OK', name); } catch (e) { errors.push(name + ': ' + e.message); console.log('ÉCHEC', errors.at(-1)); } }
for (const theme of ['light','dark']) {
 const ctx = await browser.newContext({viewport:{width:390,height:844}, reducedMotion:'reduce'});
 await ctx.addInitScript(t=>{try{localStorage.setItem('it.theme',t)}catch{}},theme);
 const p=await ctx.newPage(); await p.goto(base+'stage/j1.html');
 await test(theme+' focus visible et références ARIA',async()=>{
  await p.keyboard.press('Tab'); const focus=await p.evaluate(()=>{const e=document.activeElement,c=getComputedStyle(e);return {visible:e.matches(':focus-visible'),width:parseFloat(c.outlineWidth),style:c.outlineStyle}}); assert.equal(focus.visible,true); assert.ok(focus.width>=2&&focus.style!=='none');
  const broken=await p.evaluate(()=>[...document.querySelectorAll('[aria-controls],[aria-labelledby],[aria-describedby]')].flatMap(e=>['aria-controls','aria-labelledby','aria-describedby'].flatMap(a=>(e.getAttribute(a)||'').split(/\s+/).filter(Boolean).filter(id=>!document.getElementById(id)).map(id=>a+'='+id)))); assert.deepEqual(broken,[]);
 });
 await test(theme+' tiroirs et retour du focus',async()=>{
  for(const selector of ['.sommaire-btn','.fil-btn']){
   const b=p.locator(selector); await b.focus(); await p.keyboard.press('Enter');
   assert.equal(await b.getAttribute('aria-expanded'),'true');
   const panel=p.locator('#'+await b.getAttribute('aria-controls'));
   assert.equal(await panel.getAttribute('aria-modal'),'true');
   for(let i=0;i<20;i++){assert.equal(await panel.evaluate((e)=>e.contains(document.activeElement)),true);await p.keyboard.press('Tab')}
   await p.keyboard.press('Escape'); assert.equal(await b.getAttribute('aria-expanded'),'false'); assert.equal(await b.evaluate(e=>e===document.activeElement),true);
  }
 });
 await test(theme+' recherche au clavier',async()=>{
  await p.locator('.fil-btn').focus(); await p.keyboard.press('/'); const q=p.locator('#rech-q'); await q.waitFor(); assert.equal(await q.evaluate(e=>e===document.activeElement),true);
  await p.locator('.rech-ex').first().waitFor(); await p.keyboard.press('Tab'); assert.equal(await p.locator('.rech-fermer').evaluate(e=>e===document.activeElement),true); await p.keyboard.press('Tab'); assert.equal(await p.locator('.rech-ex').first().evaluate(e=>e===document.activeElement),true); await q.focus(); await p.keyboard.press('Shift+Tab'); assert.equal(await p.locator('.rech-ex').last().evaluate(e=>e===document.activeElement),true); await q.focus();
  await q.fill('dns'); await p.waitForSelector('.rech-item'); const first=await q.getAttribute('aria-activedescendant'); await p.keyboard.press('ArrowDown'); assert.notEqual(await q.getAttribute('aria-activedescendant'),first); await p.keyboard.press('ArrowUp'); assert.equal(await q.getAttribute('aria-activedescendant'),first);
  await p.keyboard.press('Escape'); assert.equal(await p.locator('.fil-btn').evaluate(e=>e===document.activeElement),true);
  await p.keyboard.press('Control+k'); assert.equal(await q.evaluate(e=>e===document.activeElement),true); await p.keyboard.press('Escape');
 });
 await test(theme+' Entrée ouvre le résultat actif',async()=>{
  await p.keyboard.press('/'); const q=p.locator('#rech-q'); await q.fill('dns'); await p.locator('.rech-item').first().waitFor(); const target=await p.locator('.rech-item').first().getAttribute('href'); const expected=new URL(target,p.url()).href; await p.keyboard.press('Enter'); await p.waitForURL(expected); assert.ok(await p.evaluate(()=>!location.hash||!!document.getElementById(decodeURIComponent(location.hash.slice(1)))));
 });
 await p.goto(base+'stage/j1.html');
 await test(theme+' mouvement réduit',async()=>{ await p.locator('.cloture button').click(); assert.equal(await p.locator('.tampon.pose').count(),0); assert.equal(await p.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),true); const durations=await p.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>getComputedStyle(e).animationName!=='none').map(e=>getComputedStyle(e).animationDuration)); assert.ok(durations.every(d=>parseFloat(d)<=0.01)); });
 await p.goto(base+'atelier/montage.html?s=bureautique-intel');
 await test(theme+' commandes de l’atelier',async()=>{
  await p.getByRole('button',{name:/Commencer le montage/}).focus(); await p.keyboard.press('Enter'); assert.equal(await p.locator('#cahier-titre').isVisible(),false);
  const tabs=p.locator('[role=tablist][aria-label="Angle de vue"] [role=tab]'); assert.ok(await tabs.count()>1); await tabs.first().focus(); await p.keyboard.press('ArrowRight'); assert.equal(await tabs.nth(1).evaluate(e=>e===document.activeElement),true);
  const cats=p.locator('[role=tablist][aria-label=Catégories] [role=tab]'); await cats.first().focus(); await p.keyboard.press('ArrowRight'); assert.equal(await cats.nth(1).getAttribute('aria-selected'),'true'); assert.equal(await cats.nth(1).evaluate(e=>e===document.activeElement),true);
  const piece=p.locator('.at-piece').first(); assert.ok(await piece.count()); const id=await piece.getAttribute('data-id'); await piece.focus(); await p.keyboard.press('Enter'); assert.equal(await p.locator('.at-piece[data-id="'+id+'"]' ).evaluate(e=>e===document.activeElement),true); assert.equal(await p.locator('.at-piece[data-id="'+id+'"]' ).getAttribute('aria-pressed'),'true');
  const leg=p.locator('.legende button').first(); assert.ok(await leg.count()); await leg.focus(); await p.keyboard.press('Enter'); assert.equal(await p.locator('.legende button').first().evaluate(e=>e===document.activeElement),true);
  await p.getByRole('button',{name:'Relire le cahier des charges'}).click(); assert.equal(await p.locator('#cahier-titre').evaluate(e=>e===document.activeElement),true); await p.getByRole('button',{name:/Commencer le montage/}).click(); await p.getByRole('button',{name:'Montre-moi'}).click(); assert.equal(await p.locator('.livre-page.tourne').count(),0);
 });
 await test(theme+' mesure de la cible EPS sur la planche',async()=>{
  await p.evaluate(()=>localStorage.removeItem('it.atelier.bureautique-intel'));await p.goto(base+'atelier/montage.html?s=bureautique-intel');await p.getByRole('button',{name:/Commencer le montage/}).click();
  for(let i=0;i<10;i++)await p.getByRole('button',{name:'Montre-moi'}).click();
  await p.getByRole('tab',{name:/Câbles/}).click();await p.locator('.at-piece[data-id="cab-eps"]').click();
  const box=await p.locator('.slot-cible[data-slot="con-eps"] .slot-hit').boundingBox();assert.ok(box);console.log('Cible EPS '+theme+' : '+Math.round(box.width)+' × '+Math.round(box.height)+' px');
 });
 await ctx.close();
}
function htmlPages(dir='.') { return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?(['.git','.github','node_modules','outils'].includes(e.name)?[]:htmlPages(path.join(dir,e.name))):e.name.endsWith('.html')?[path.join(dir,e.name)]:[]) }
await test('références ARIA de toutes les pages',async()=>{
 const ctx=await browser.newContext(); const p=await ctx.newPage(); let broken=[];
 for(const f of htmlPages()){await p.goto(new URL(f,base).href);const refs=await p.evaluate(()=>[...document.querySelectorAll('[aria-controls],[aria-labelledby],[aria-describedby]')].flatMap(e=>['aria-controls','aria-labelledby','aria-describedby'].flatMap(a=>(e.getAttribute(a)||'').split(/\s+/).filter(Boolean).filter(id=>!document.getElementById(id)).map(id=>a+'='+id))));broken.push(...refs.map(x=>f+': '+x));}
 await ctx.close(); assert.deepEqual(broken,[]);
});
await browser.close();
console.log(errors.length+' échec(s)'); if(errors.length) process.exitCode=1;
