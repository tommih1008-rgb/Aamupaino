'use strict';
const C=WeightCore, $=id=>document.getElementById(id);
// Separate each project path even when several apps share a GitHub Pages origin.
const storageKey='aamupaino:v1:'+new URL('./',location.href).pathname;
const number=new Intl.NumberFormat('fi-FI',{minimumFractionDigits:1,maximumFractionDigits:2});
const dateLabel=date=>new Date(date+'T12:00:00').toLocaleDateString('fi-FI');
let entries=[],today=C.localDate(),readable=true;
function status(message,error=false){$('status').textContent=message;$('status').classList.toggle('error',error);}
function read(){
  try{entries=C.validateEntries(JSON.parse(localStorage.getItem(storageKey)||'[]'));readable=true;}
  catch{readable=false;status('Tallennettuja tietoja ei voitu lukea. Vanhoja tietoja ei korvata. Tarkista selaimen tallennusasetukset.',true);}
  $('save').disabled=!readable;
}
function persist(next){
  if(!readable)throw new Error('Tallennus ei ole käytettävissä.');
  try{localStorage.setItem(storageKey,JSON.stringify(next));}
  catch{throw new Error('Tallennus epäonnistui. Tarkista selaimen vapaa tila ja tallennusasetukset.');}
  entries=next;render();
}
function syncDay(){const next=C.localDate();if(next!==today){today=next;$('weight').value='';render();}}
function saveWeight(text){
  syncDay();read();if(!readable)throw new Error('Tietoja ei voitu lukea.');
  const weight=C.parseWeight(text),replaced=entries.some(e=>e.date===today);
  persist(C.upsert(entries,today,weight));
  $('weight').value=number.format(weight);
  status(replaced?'Tämän päivän paino päivitetty.':'Tämän päivän paino tallennettu.');
  return {date:today,weight};
}
$('weight-form').addEventListener('submit',event=>{event.preventDefault();try{saveWeight($('weight').value);}catch(e){status(e.message,true);}});
function chart(){
  const points=C.windowEntries(entries,30,today);
  const host=$('chart');host.replaceChildren();
  if(!points.length){const p=document.createElement('p');p.className='empty';p.textContent='Painokäyrä ilmestyy ensimmäisen mittauksen jälkeen.';host.append(p);return;}
  const ns='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 720 270');svg.setAttribute('role','img');svg.setAttribute('aria-label',`Painokäyrä viimeiseltä 30 päivältä, ${points.length} mittausta. Tarkat arvot mittaushistoriassa.`);
  const el=(name,attrs,text)=>{const e=document.createElementNS(ns,name);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);if(text)e.textContent=text;svg.append(e);return e;};
  const end=C.dayNumber(today),start=Math.min(...points.map(e=>C.dayNumber(e.date)),end-1);
  const weights=points.map(e=>e.weight),pad=Math.max(.3,(Math.max(...weights)-Math.min(...weights))*.15);
  const low=Math.min(...weights)-pad,high=Math.max(...weights)+pad;
  const x=d=>64+(C.dayNumber(d)-start)/(end-start)*620,y=w=>218-(w-low)/(high-low)*190;
  for(let i=0;i<4;i++){const w=low+(high-low)*i/3;el('line',{x1:64,x2:684,y1:y(w),y2:y(w),stroke:'#e0e8f1'});el('text',{x:52,y:y(w)+5,'text-anchor':'end',fill:'#52667a','font-size':16},w.toLocaleString('fi-FI',{maximumFractionDigits:1}));}
  el('polyline',{points:points.map(e=>`${x(e.date)},${y(e.weight)}`).join(' '),fill:'none',stroke:'#2377ba','stroke-width':3,'stroke-linejoin':'round'});
  for(const e of points){const dot=el('circle',{cx:x(e.date),cy:y(e.weight),r:5,fill:'#143e60',stroke:'white','stroke-width':2});const title=document.createElementNS(ns,'title');title.textContent=`${dateLabel(e.date)}: ${number.format(e.weight)} kg`;dot.append(title);}
  el('text',{x:64,y:254,fill:'#52667a','font-size':16},dateLabel(new Date(start*86400000).toISOString().slice(0,10)));
  el('text',{x:684,y:254,'text-anchor':'end',fill:'#52667a','font-size':16},dateLabel(today));host.append(svg);
}
function render(){
  $('today').textContent=new Date(today+'T12:00:00').toLocaleDateString('fi-FI',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const current=entries.find(e=>e.date===today);
  $('save').textContent=current?'Päivitä paino':'Tallenna';
  $('entry-hint').textContent=current?`Tänään tallennettu ${number.format(current.weight)} kg. Uusi tallennus korvaa tämän arvon.`:'Yksi mittaus päivässä. Uusi tallennus korvaa tämän päivän arvon.';
  for(const days of [7,14]){const t=C.trend(entries,days,today);const rounded=t.weekly===null?null:Math.round(t.weekly*100)/100;$('trend-'+days).textContent=rounded===null?'—':new Intl.NumberFormat('fi-FI',{minimumFractionDigits:2,maximumFractionDigits:2,signDisplay:'exceptZero'}).format(Object.is(rounded,-0)?0:rounded);$('count-'+days).textContent=`${t.count} mittausta / ${days} päivää`+(t.weekly===null?' · Tarvitaan vähintään 2.':'');}
  $('history-count').textContent=`${entries.length} merkintää`;$('empty-history').hidden=entries.length>0;$('history').replaceChildren();
  for(const e of [...entries].reverse()){
    const li=document.createElement('li'),time=document.createElement('time'),weight=document.createElement('strong'),button=document.createElement('button');
    time.dateTime=e.date;time.textContent=dateLabel(e.date);weight.textContent=number.format(e.weight)+' kg';button.type='button';button.textContent='Poista';button.disabled=!readable;button.setAttribute('aria-label',`Poista mittaus ${dateLabel(e.date)}`);
    button.addEventListener('click',()=>{if(!confirm(`Poistetaanko ${dateLabel(e.date)} mitattu ${number.format(e.weight)} kg?`))return;try{read();persist(entries.filter(item=>item.date!==e.date));status('Mittaus poistettu.');$('weight').focus();}catch(error){status(error.message,true);}});
    li.append(time,weight,button);$('history').append(li);
  }
  chart();
}
read();render();
document.addEventListener('visibilitychange',()=>{if(!document.hidden){syncDay();read();render();}});
window.addEventListener('focus',syncDay);
window.addEventListener('storage',event=>{if(event.key===storageKey||event.key===null){read();render();}});
setInterval(syncDay,30000);
if('serviceWorker' in navigator && window.isSecureContext){
  navigator.serviceWorker.register('./sw.js').then(()=>navigator.serviceWorker.ready).then(()=>{$('offline-status').textContent='Sovellus on valmis offline-käyttöön tällä laitteella.';}).catch(()=>{$('offline-status').textContent='Offline-käyttöä ei voitu valmistella. Avaa sivu uudelleen verkkoyhteydellä.';});
}else{$('offline-status').textContent='Asennus ja offline-käyttö edellyttävät HTTPS-osoitetta tai localhostia. Katso projektin käyttöohje.';}
if(document.modelContext?.registerTool){
  try{Promise.resolve(document.modelContext.registerTool({name:'save_today_weight',title:'Tallenna tämän päivän paino',description:'Tallentaa annetun painon tälle paikalliselle kalenteripäivälle. Korvaa saman päivän aiemman arvon.',inputSchema:{type:'object',properties:{weight:{type:'number',exclusiveMinimum:0,maximum:500}},required:['weight'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){if(!input||typeof input.weight!=='number')throw new Error('Anna numeerinen paino.');return saveWeight(String(input.weight));}})).catch(()=>{});}catch{}
}
