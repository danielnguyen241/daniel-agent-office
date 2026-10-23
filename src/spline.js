// Paste a Spline export URL (…/scene.splinecode) here, or pass ?spline=<url>
export const SPLINE_URL='';
const url=new URLSearchParams(location.search).get('spline')||SPLINE_URL;
const box=document.querySelector('#agent-office').querySelector('#spline'),b3=document.getElementById('m3d'),bs=document.getElementById('msp');let loaded=false;
function set(sp){box.classList.toggle('show',sp);bs.classList.toggle('on',sp);b3.classList.toggle('on',!sp);
 document.querySelector('#agent-office').querySelector('#pills').style.display=sp?'none':'';
 if(sp&&url&&!loaded){loaded=true;const s=document.createElement('script');s.type='module';s.src='https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js';document.head.appendChild(s);
  const v=document.createElement('spline-viewer');v.setAttribute('url',url);box.querySelector('.ph').remove();box.appendChild(v);}}
b3.onclick=()=>set(false);bs.onclick=()=>set(true);
if(new URLSearchParams(location.search).has('spline'))set(true);
