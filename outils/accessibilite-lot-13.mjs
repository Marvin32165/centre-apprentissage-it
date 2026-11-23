// Vérifications reproductibles d'accessibilité ; aucun fichier du site n'est chargé par fetch.
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const base = pathToFileURL(process.cwd() + '/').href;
const browser = await chromium.launch();
const errors = [];
async function test(name, fn) { try { await fn(); console.log('OK', name); } catch (e) { errors.push(name + ': ' + e.message); console.log('ÉCHEC', errors.at(-1)); } }
for (const theme of ['light','dark']) {
 const ctx = await browser.newContext({viewport:{width:390,height:844}, reducedMotion:'reduce'});
 await ctx.addInitScript(t=>{try{localStorage.setItem('it.theme',t)}catch{}},theme);
 const p=await ctx.newPage(); await p.goto(base+'stage/j1.html');
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
 await test(theme+' mouvement réduit',async()=>{ assert.equal(await p.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),true); const durations=await p.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>getComputedStyle(e).animationName!=='none').map(e=>getComputedStyle(e).animationDuration)); assert.ok(durations.every(d=>parseFloat(d)<=0.01)); });
 await p.goto(base+'atelier/montage.html?s=bureautique-intel');
 await test(theme+' commandes de l’atelier',async()=>{
  await p.getByRole('button',{name:/Commencer le montage/}).focus(); await p.keyboard.press('Enter'); assert.equal(await p.locator('#cahier-titre').isVisible(),false);
  const tabs=p.locator('[role=tablist][aria-label="Angle de vue"] [role=tab]'); assert.ok(await tabs.count()>1); await tabs.first().focus(); await p.keyboard.press('ArrowRight'); assert.equal(await tabs.nth(1).evaluate(e=>e===document.activeElement),true);
  const cats=p.locator('[role=tablist][aria-label=Catégories] [role=tab]'); await cats.first().focus(); await p.keyboard.press('ArrowRight'); assert.equal(await cats.nth(1).getAttribute('aria-selected'),'true'); assert.equal(await cats.nth(1).evaluate(e=>e===document.activeElement),true);
  assert.ok(await p.locator('.at-bac button').count()>0); assert.ok(await p.locator('.legende button, .legende a').count()>0);
 });
 await ctx.close();
}
await browser.close();
console.log(errors.length+' échec(s)'); if(errors.length) process.exitCode=1;
