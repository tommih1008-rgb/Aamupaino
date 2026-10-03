/* Calendar dates are converted to UTC ordinals, avoiding DST-length days. */
(function (root) {
  'use strict';
  function localDate(now = new Date()) {
    return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  }
  function dayNumber(date) {
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Virheellinen päivämäärä.');
    const stamp = Date.parse(date + 'T00:00:00Z');
    if (!Number.isFinite(stamp) || new Date(stamp).toISOString().slice(0,10) !== date) throw new Error('Virheellinen päivämäärä.');
    return stamp / 86400000;
  }
  function parseWeight(text) {
    const normalized = String(text).trim().replace(',', '.');
    if (!/^\d+(\.\d{1,2})?$/.test(normalized)) throw new Error('Anna paino numerona, esimerkiksi 75,4.');
    const weight = Number(normalized);
    if (!(weight > 0 && weight <= 500)) throw new Error('Anna paino yli 0 ja enintään 500 kg.');
    return weight;
  }
  function validateEntries(data) {
    if (!Array.isArray(data)) throw new Error('Tallennettuja tietoja ei voitu lukea.');
    const seen = new Set();
    for (const e of data) {
      if (!e || typeof e.weight !== 'number' || !Number.isFinite(e.weight) || e.weight <= 0 || e.weight > 500) throw new Error('Tallennetuissa tiedoissa on virhe.');
      dayNumber(e.date);
      if (seen.has(e.date)) throw new Error('Päivämäärä esiintyy kahdesti.');
      seen.add(e.date);
    }
    return data.map(({date,weight})=>({date,weight})).sort((a,b)=>a.date.localeCompare(b.date));
  }
  function upsert(entries,date,weight) {
    return validateEntries([...entries.filter(e=>e.date!==date),{date,weight}]);
  }
  function windowEntries(entries,days,today=localDate()) {
    const end = dayNumber(today);
    return entries.filter(e=>{const d=dayNumber(e.date);return d>=end-days+1 && d<=end;});
  }
  function trend(entries,days,today=localDate()) {
    const points=windowEntries(entries,days,today), n=points.length;
    if(n<2) return {count:n,weekly:null};
    const origin=dayNumber(today);
    const mx=points.reduce((s,e)=>s+dayNumber(e.date)-origin,0)/n;
    const my=points.reduce((s,e)=>s+e.weight,0)/n;
    let numerator=0,denominator=0;
    for(const e of points){const dx=dayNumber(e.date)-origin-mx;numerator+=dx*(e.weight-my);denominator+=dx*dx;}
    return {count:n,weekly:denominator?numerator/denominator*7:null};
  }
  const api={localDate,dayNumber,parseWeight,validateEntries,upsert,windowEntries,trend};
  if(typeof module!=='undefined' && module.exports) module.exports=api;
  else root.WeightCore=api;
})(typeof globalThis!=='undefined'?globalThis:this);
