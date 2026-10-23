import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {CSS2DRenderer,CSS2DObject} from 'three/addons/renderers/CSS2DRenderer.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {DEPTS,ACT} from './config.js';
const ROOT=document.getElementById('agent-office');const BASE=new URL('../',import.meta.url).href;const SZ=()=>[ROOT.clientWidth||1,ROOT.clientHeight||1];const STANDALONE=ROOT.hasAttribute('data-standalone');

const BOT=['#f08a5d','#3fb39a','#8f6fd1','#e8607a','#f2b632','#4f8fd6','#6bbf59'];

const scene=new THREE.Scene();scene.background=(()=>{const c=document.createElement('canvas');c.width=4;c.height=256;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,'#f7efe6');g.addColorStop(1,'#e9dccd');x.fillStyle=g;x.fillRect(0,0,4,256);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;})();
const camera=new THREE.PerspectiveCamera(35,SZ()[0]/SZ()[1],.1,300);camera.position.set(27,24,27);
const renderer=new THREE.WebGLRenderer({antialias:!/noaa/.test(location.search),powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));renderer.setSize(...SZ());
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
ROOT.appendChild(renderer.domElement);
scene.environment=new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(),.04).texture;
const lr=new CSS2DRenderer();lr.setSize(...SZ());Object.assign(lr.domElement.style,{position:'absolute',top:0,left:0,pointerEvents:'none'});ROOT.appendChild(lr.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.1;controls.minPolarAngle=.25;controls.maxPolarAngle=1.3;controls.minDistance=7;controls.maxDistance=55;controls.screenSpacePanning=false;controls.panSpeed=.6;controls.rotateSpeed=.6;controls.zoomSpeed=.8;controls.autoRotate=false;controls.minAzimuthAngle=-.12;controls.maxAzimuthAngle=Math.PI/2+.12;controls.maxDistance=60;let SWAY=true;

scene.add(new THREE.HemisphereLight('#fff3e4','#d9c2ae',.9));
const sun=new THREE.DirectionalLight('#ffe8cc',2.2);sun.position.set(20,35,12);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
Object.assign(sun.shadow.camera,{left:-22,right:22,top:20,bottom:-20,near:5,far:80});sun.shadow.radius=6;sun.shadow.bias=-.0005;scene.add(sun);

const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(SZ()[0]/2,SZ()[1]/2),.3,.5,1.6));composer.addPass(new OutputPass());

const mat=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.75,metalness:0,envMapIntensity:.35,...o});
const rb=(w,h,d,r=.08)=>new RoundedBoxGeometry(w,h,d,3,Math.min(r,w/2,h/2,d/2));
function signMesh(text,col){const c=document.createElement('canvas');c.width=640;c.height=128;const x=c.getContext('2d');
 x.fillStyle=col;x.beginPath();x.roundRect(4,4,632,120,40);x.fill();x.fillStyle='#fff';x.font='700 54px Inter, system-ui, sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(text,320,68);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;
 const g=new THREE.Group();const p=new THREE.Mesh(new THREE.PlaneGeometry(2.6,.52),new THREE.MeshBasicMaterial({map:t,transparent:true,toneMapped:false}));p.position.y=.0;g.add(p);
 const back=new THREE.Mesh(new THREE.PlaneGeometry(2.6,.52),new THREE.MeshBasicMaterial({map:t,transparent:true,toneMapped:false}));back.rotation.y=Math.PI;back.position.z=-.01;g.add(back);
 const post=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,1.9),mat('#cbb9a4'));post.position.y=-1.05;g.add(post);return g;}
function box(w,h,d,m,x,y,z,r){const o=new THREE.Mesh(rb(w,h,d,r),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;return o;}
const label=(html,cls,y,parent)=>{const e=document.createElement('div');e.className=cls;e.innerHTML=html;const o=new CSS2DObject(e);o.position.y=y;parent.add(o);return e;};

// ===== building shell: floor slab, parquet, back walls with windows, front stubs, corridor =====
const FX=15.5,FZ=11.5,WH=5.2,WT=.5;
function parquet(){const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');
 const cols=['#d9b48a','#d2ab80','#ddb991','#cfa67a','#d6b086'];
 for(let r=0;r<16;r++)for(let i=-1;i<5;i++){const off=(r%2)*64;x.fillStyle=cols[(r*7+i*3)%5];x.fillRect(i*128+off,r*32,128,32);x.strokeStyle='rgba(120,80,40,.25)';x.lineWidth=2;x.strokeRect(i*128+off,r*32,128,32);}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(FX/2.2,FZ/2.2);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t;}
scene.add(box(FX*2+WT*2,.6,FZ*2+WT*2,mat('#cdbba6'),0,-.3,0,.05));           // slab (cut edge)
const fl=new THREE.Mesh(new THREE.PlaneGeometry(FX*2,FZ*2),new THREE.MeshStandardMaterial({map:parquet(),roughness:.6,envMapIntensity:.4}));fl.rotation.x=-Math.PI/2;fl.position.y=.005;fl.receiveShadow=true;scene.add(fl);
const wallM=mat('#f4ece2'),trimM=mat('#e2d3c1'),mullM=mat('#cbb9a4',{roughness:.5});
function skyTex(){const c=document.createElement('canvas');c.width=256;c.height=256;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,0,256);
 g.addColorStop(0,'#bcd9f2');g.addColorStop(.65,'#f6e6d6');g.addColorStop(1,'#f2d3b8');x.fillStyle=g;x.fillRect(0,0,256,256);
 x.fillStyle='rgba(150,165,190,.55)';for(let i=0;i<14;i++){const w=10+((i*37)%22),h=40+((i*53)%90);x.fillRect(i*19,256-h,w,h);}
 x.fillStyle='rgba(255,255,255,.7)';x.beginPath();x.ellipse(70,60,40,10,0,0,7);x.ellipse(190,40,30,8,0,0,7);x.fill();
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
const skyM=new THREE.MeshBasicMaterial({map:skyTex(),toneMapped:false});
// wall along an axis: len, center, rotation; windows between
function backWall(len,cx,cz,ry){const g=new THREE.Group();g.position.set(cx,0,cz);g.rotation.y=ry;scene.add(g);
 g.add(box(len,1.1,WT,wallM,0,.55,0,.04));g.add(box(len,.9,WT,wallM,0,WH-.45,0,.04));        // sill band + header band
 const n=Math.round(len/3.2);const step=len/n;
 for(let i=0;i<=n;i++)g.add(box(.35,WH,WT+.04,mullM,-len/2+i*step,WH/2,0,.05));                 // columns
 for(let i=0;i<n;i++){const cx2=-len/2+(i+.5)*step;const p=new THREE.Mesh(new THREE.PlaneGeometry(step-.35,WH-2),skyM);p.position.set(cx2,1.1+(WH-2)/2,-WT/2+.02);g.add(p);
  g.add(box(.08,WH-2,.1,mullM,cx2,1.1+(WH-2)/2,.05,.02));g.add(box(step-.35,.08,.1,mullM,cx2,2.6,.05,.02));}
 g.add(box(len,.14,.12,trimM,0,.07,WT/2+.06,.03));                                               // baseboard
 g.add(box(len,.18,WT+.2,trimM,0,WH+.09,0,.05));return g;}
backWall(FX*2+WT*2,0,-FZ-WT/2,0);                     // back wall (-z)
backWall(FZ*2,-FX-WT/2,0,Math.PI/2);                  // left wall (-x)
// front cut stubs (low)
scene.add(box(FX*2+WT*2,.7,WT,wallM,0,.35,FZ+WT/2,.06));scene.add(box(WT,.7,FZ*2,wallM,FX+WT/2,.35,0,.06));
[[FX+WT/2,FZ+WT/2]].forEach(([x,z])=>scene.add(box(WT+.05,.75,WT+.05,trimM,x,.37,z,.06)));
// corridor (light-grey carpet runner) + glowing strip
const corM=mat('#e9e1d6');const stripM=new THREE.MeshStandardMaterial({color:'#ffd9a0',emissive:'#ffb860',emissiveIntensity:2.2});
scene.add(box(FX*2,.03,1.6,corM,0,.02,0,.01));const strip=new THREE.Mesh(new THREE.BoxGeometry(FX*2-1,.03,.06),stripM);strip.position.set(0,.05,0);scene.add(strip);
const pend={visible:true};
// ---- reception / entrance (front-right, open area) ----
function logoTex(){const c=document.createElement('canvas');c.width=1024;c.height=320;const x=c.getContext('2d');x.fillStyle='#3a3330';x.fillRect(0,0,1024,320);
 x.textBaseline='alphabetic';x.fillStyle='rgba(246,230,210,.75)';x.font='500 46px Inter, system-ui, sans-serif';x.fillText('Welcome to',80,92);
 const a="Daniel's ",b2='AI Agents',c2=' Office';let fs=84;x.font=`700 ${fs}px Inter, system-ui, sans-serif`;const tw=x.measureText(a+b2+c2).width;if(tw>860){fs=Math.floor(fs*860/tw);x.font=`700 ${fs}px Inter, system-ui, sans-serif`;}let X=80;x.fillStyle='#f6e6d2';x.fillText(a,X,192);X+=x.measureText(a).width;
 x.fillStyle='#e9a86b';x.fillText(b2,X,192);X+=x.measureText(b2).width;x.fillStyle='#f6e6d2';x.fillText(c2,X,192);
 x.fillStyle='rgba(246,230,210,.6)';x.font='500 32px Inter, system-ui, sans-serif';x.fillText('daniel.ai  ·  SEO / GROWTH / MEDIA',82,262);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t;}
const rec=new THREE.Group();rec.position.set(11.6,0,6);scene.add(rec);
rec.add(box(6.2,3,.35,mat('#3a3330'),0,1.5,-3.2,.08));
const logo=new THREE.Mesh(new THREE.PlaneGeometry(5.4,1.69),new THREE.MeshStandardMaterial({map:logoTex(),emissive:'#ffffff',emissiveMap:null,emissiveIntensity:0,roughness:.5}));logo.position.set(0,1.9,-3.01);rec.add(logo);
rec.add(box(6.2,.06,.4,stripM,0,.12,-2.98,.02));
rec.add(box(3.4,1.05,.9,mat('#f4ece2'),0,.53,-.8,.12));rec.add(box(3.6,.08,1.05,mat('#d9b48a'),0,1.08,-.8,.03));rec.add(box(3.3,.12,.05,stripM,0,.2,-.33,.02));
const RECEPTION_PUT=()=>{put('laptop',.5,rec,.6,1.12,-.95,Math.PI);put('plantSmall2',.3,rec,-1.3,1.12,-.9);put('pottedPlant',.8,rec,2.6,0,-2.4);put('pottedPlant',.8,rec,-2.6,0,-2.4);
 put('loungeChair',1,rec,-1.8,0,2.8,Math.PI*.85);put('loungeChair',1,rec,0,0,2.8,Math.PI*1.1);put('tableCoffee',.9,rec,-.9,0,3.1);put('rugRound',2.6,rec,-.9,.01,3,0,'#e9a86b',true);};
// coffee corner + water cooler (front-left of reception)
const cof=new THREE.Group();cof.position.set(14.55,0,1.05);scene.add(cof);
cof.add(box(1.2,1,1.9,mat('#e9dccb'),0,.5,.6,.06));cof.add(box(1.3,.06,2,mat('#d9b48a'),0,1.03,.6,.02));
cof.add(box(.45,.55,.4,mat('#2f2b2a',{roughness:.35}),0,1.33,0,.06));const cup=new THREE.Mesh(new THREE.CylinderGeometry(.06,.05,.12,12),mat('#fff'));cup.position.set(0,1.12,.25);cof.add(cup);
const wc=new THREE.Group();wc.position.set(0,1.06,1.2);cof.add(wc);wc.add(box(.36,.5,.36,mat('#f4f4f4'),0,.25,0,.05));const bt=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.42,16),new THREE.MeshPhysicalMaterial({color:'#9fd0f5',transmission:.6,roughness:.1,transparent:true,opacity:.7}));bt.position.y=.72;wc.add(bt);
const clickables=[],rooms={},bots=[],mixers=[];
const loader=new GLTFLoader(),A={};
const NAMES=['plantSmall2','desk','chairDesk','computerScreen','computerKeyboard','computerMouse','pottedPlant','plantSmall1','loungeDesignSofa','bookcaseOpen','bookcaseClosedDoors','speaker','rugRectangle','rugRound','tableCoffee','laptop','books','loungeChair','televisionModern'];
await Promise.all(NAMES.map(n=>loader.loadAsync(BASE+'assets/'+n+'.glb').then(g=>A[n]=g.scene)));
const CN=['male-a','female-a','male-b','female-b','male-c','female-c','male-d','female-d','male-e','female-e','male-f','female-f'];
const charParam=new URLSearchParams(location.search).get('chars');
const charMode=charParam==='robot'?'robot':'human';
const [charsLoaded,glassesLoaded,sunLoaded,robotLoaded]=await Promise.all([
  Promise.all(CN.map(n=>loader.loadAsync(BASE+'assets/chars/character-'+n+'.glb'))),
  loader.loadAsync(BASE+'assets/chars/aid-glasses.glb'),
  loader.loadAsync(BASE+'assets/chars/aid-sunglasses.glb'),
  loader.loadAsync(BASE+'assets/chars/RobotExpressive.glb')
]);
A.chars=charsLoaded;
A.glasses=glassesLoaded.scene;
A.sun=sunLoaded.scene;
A.robot=robotLoaded;
const robotMap={};
let AG=0;

const CH_Y=0,CH_Z=.85,SCREEN_Y=window.SY??.62,SCREEN_Z=window.SZ??.1;const TAGS=[],WORKERS=[],BUBBLES=[],SCREENS=[],LEDS=[];
// accessories: attach to head bone; offsets expressed in head-bone local space
function onHead(head,obj,hb,hw,frac,fwd=0){const inv=new THREE.Matrix4().copy(head.matrixWorld).invert();
 const p=new THREE.Vector3(hw.x,hb.min.y+(hb.max.y-hb.min.y)*frac,hw.z+fwd*(hb.max.z-hb.min.z)).applyMatrix4(inv);
 const s=new THREE.Vector3();head.matrixWorld.decompose(new THREE.Vector3(),new THREE.Quaternion(),s);
 obj.position.copy(p);obj.scale.divideScalar(s.x);head.add(obj);}
const hs=hb=>(hb.max.x-hb.min.x)*.55;
const ACC=[
 (h,_,c,hb,hw)=>{const g=new THREE.Mesh(new THREE.ConeGeometry(hs(hb)*.22,hs(hb)*.55,24),mat(c));const t=new THREE.Mesh(new THREE.SphereGeometry(hs(hb)*.08),mat('#fff'));t.position.y=hs(hb)*.3;g.add(t);g.rotation.z=.15;onHead(h,g,hb,hw,1.12);},
 (h,_,c,hb,hw)=>{const g=A.glasses.clone();const b=new THREE.Box3().setFromObject(g);g.scale.setScalar(hs(hb)*1.2/(b.max.x-b.min.x));onHead(h,g,hb,hw,.62,.0);},
 (h,_,c,hb,hw)=>{const g=new THREE.Group();const band=new THREE.Mesh(new THREE.TorusGeometry(hs(hb)*.47,hs(hb)*.045,10,30,Math.PI),mat('#2f2f36'));g.add(band);
   [-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.CylinderGeometry(hs(hb)*.16,hs(hb)*.16,hs(hb)*.1,20),mat(c));e.rotation.z=Math.PI/2;e.position.x=s*hs(hb)*.47;g.add(e);});onHead(h,g,hb,hw,.5);},
 (h,_,c,hb,hw)=>{const g=new THREE.Group();const cap=new THREE.Mesh(rb(hs(hb)*.98,hs(hb)*.24,hs(hb)*.98,hs(hb)*.1),mat(c));g.add(cap);
   const brim=new THREE.Mesh(new THREE.CylinderGeometry(hs(hb)*.3,hs(hb)*.3,hs(hb)*.04,20,1,false,0,Math.PI),mat(c));brim.rotation.y=Math.PI/2;brim.position.set(0,-hs(hb)*.12,hs(hb)*.55);g.add(brim);onHead(h,g,hb,hw,.74);},
 (h,_,c,hb,hw)=>{const g=A.sun.clone();const b=new THREE.Box3().setFromObject(g);g.scale.setScalar(hs(hb)*1.2/(b.max.x-b.min.x));onHead(h,g,hb,hw,.62,.0);},
 (h,_,c,hb,hw)=>{const g=new THREE.Group();const be=new THREE.Mesh(rb(hs(hb)*.96,hs(hb)*.24,hs(hb)*.96,hs(hb)*.1),mat(c));g.add(be);const p=new THREE.Mesh(new THREE.SphereGeometry(hs(hb)*.1,14,10),mat('#fff'));p.position.y=hs(hb)*.16;g.add(p);onHead(h,g,hb,hw,.74);},
 (h,_,c,hb,hw)=>{const g=new THREE.Mesh(new THREE.TorusGeometry(hs(hb)*.18,hs(hb)*.05,8,24),new THREE.MeshStandardMaterial({color:'#ffd36e',emissive:'#ffb040',emissiveIntensity:1.5}));g.rotation.x=Math.PI/2;onHead(h,g,hb,hw,1.25);},
];
function put(name,w,parent,x,y,z,ry=0,tint,flat){const src=A[name].clone(true);const b=new THREE.Box3().setFromObject(src),sz=b.getSize(new THREE.Vector3());
 const s=w<0?-w/sz.y:w/Math.max(sz.x,sz.z);src.scale.setScalar(s);const c=b.getCenter(new THREE.Vector3());src.position.set(-c.x*s,-b.min.y*s,-c.z*s);
 src.traverse(o=>{if(o.isMesh){o.castShadow=!flat;o.receiveShadow=true;o.material=o.material.clone();o.material.roughness=.7;o.material.metalness=0;o.material.envMapIntensity=.35;
  if(tint&&(flat||/metal|dark|black/i.test(o.material.name)||name.startsWith('bookcase')))o.material.color.lerp(new THREE.Color(tint),flat?.8:.85);}});
 const w2=new THREE.Group();w2.add(src);w2.position.set(x,y,z);w2.rotation.y=ry;w2.userData.h=sz.y*s;parent.add(w2);return w2;}
DEPTS.forEach((D,di)=>{
 const g=new THREE.Group();g.position.set(D.x,0,D.z);scene.add(g);rooms[D.id]={D,g};
 const fl=box(D.w,.12,D.d,mat(D.floor),0,.06,0,.06);fl.userData.dept=D.id;g.add(fl);clickables.push(fl);
 // glass partitions
 const gm=new THREE.MeshPhysicalMaterial({color:'#ffffff',transmission:.9,roughness:.08,thickness:.2,transparent:true,opacity:.35});
 const fm=mat(D.color,{roughness:.5});const H=D.qa?2.4:1.1;
 const wall=(w,x,z,rot)=>{const p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=rot;
  const gl=new THREE.Mesh(rb(w,H,.06,.03),gm);gl.position.y=H/2+.12;p.add(gl);
  p.add(box(w,.08,.12,fm,0,H+.14,0,.04));p.add(box(w,.12,.14,fm,0,.18,0,.04));g.add(p);};
 const gap=2.2;
 const half=(len,a,b,rot,sideOpen)=>{if(sideOpen){const s=(len-gap)/2;wall(s,rot?a:a-(gap+s)/2,rot?b-(gap+s)/2:b,rot);wall(s,rot?a:a+(gap+s)/2,rot?b+(gap+s)/2:b,rot);}else wall(len,a,b,rot);};
 // door faces center
 const dz=D.z===0?0:-Math.sign(D.z),dx=D.z===0?-Math.sign(D.x):0;
 half(D.w,0,-D.d/2,0,dz===-1);half(D.w,0,D.d/2,0,dz===1);half(D.d,-D.w/2,0,Math.PI/2,dx===-1);half(D.d,D.w/2,0,Math.PI/2,dx===1);
 const rl=new THREE.Object3D();const lx=D.id==='hq'?-2.2:0;rl.position.set(lx,1.8,-D.d/2);g.add(rl);label(`<i style="background:${D.color}"></i>${D.name}`,'room',0,rl).style.setProperty('--c',D.color);
 // desks (Kenney CC0 models) + robot agents (Quaternius-style RobotExpressive CC0)
 const n=D.qa?1:D.agents.length;const cols=n>2?2:n;const rows=Math.ceil(n/cols);
 for(let i=0;i<n;i++){const c=i%cols,r=Math.floor(i/cols);
  const x=(c-(cols-1)/2)*(D.w/cols*.9),z=(r-(rows-1)/2)*3.4+(D.qa?0:.2);
  const dk=new THREE.Group();dk.position.set(x,.12,z);g.add(dk);
  const desk=put('desk',2.2,dk,0,0,0);const top=desk.userData.h;
  const mon=put("computerScreen",.85,dk,0,top,-.25,0,'#3a3536');
  put('computerKeyboard',.55,dk,0,top,.2,0);put('computerMouse',.1,dk,.45,top,.22);
  if(D.studio){put('computerScreen',.6,dk,.95,top,-.3,-.35);put('computerScreen',.6,dk,-.95,top,-.3,.35);}
  if(i%2)put('books',.35,dk,.75,top,-.15); else put('plantSmall1',.28,dk,.8,top,-.15);
  const chair=put('chairDesk',.78,dk,0,0,1.15,Math.PI);
  if(D.qa){put('laptop',.5,dk,.5,top,0);continue;}
  dk.rotation.y=-Math.PI/2;
  const agentHandle=D.agents[i][0];const k=AG++;
  if(charMode==='robot'){
   const ch=SkeletonUtils.clone(A.robot.scene);
   const tint=new THREE.Color(D.color);
   ch.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.material=o.material.clone();o.material.envMapIntensity=.45;o.material.roughness=.55;
    if(/head|torso|body/i.test(o.name))o.material.color.lerp(tint,.5);}});
   const sc=0.55;ch.scale.setScalar(sc);
   ch.position.set(0,.62,1.15);ch.rotation.y=Math.PI;dk.add(ch);ch.userData.dyn=true;
   const mx=new THREE.AnimationMixer(ch);
   const sitClip=A.robot.animations.find(a=>a.name==='Sitting')||A.robot.animations.find(a=>a.name==='Idle');
   const waveClip=A.robot.animations.find(a=>a.name==='Wave')||A.robot.animations.find(a=>a.name==='ThumbsUp');
   const sitAction=mx.clipAction(sitClip);sitAction.play();mixers.push(mx);
   let waveAction=null;
   if(waveClip){waveAction=mx.clipAction(waveClip);waveAction.loop=THREE.LoopOnce;waveAction.clampWhenFinished=true;}
   robotMap[agentHandle]={ch,mx,sitAction,waveAction};
   const head=ch.getObjectByName('Head');
   WORKERS.push({ch,k,role:D.id,isRobot:true,head,ph:k*1.37});
   const lo=new THREE.Object3D();lo.position.set(0,2.25,1.15);dk.add(lo);TAGS.push({el:label(agentHandle,'lbl',0,lo),room:D.id,o:lo});
   const bo=new THREE.Object3D();bo.position.set(0,2.7,1.15);dk.add(bo);BUBBLES.push({el:label('','bubble',0,bo),role:D.id,k,o:bo});
   SCREENS.push({mon,kind:D.studio?2:(D.id==='tech'||D.id==='auth'?1:0)});
  }else{
   const C=A.chars[k%A.chars.length];const ch=SkeletonUtils.clone(C.scene);
   const tint=new THREE.Color('#ffffff').lerp(new THREE.Color(D.color),.3);
   ch.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.material=o.material.clone();o.material.envMapIntensity=.35;o.material.roughness=.8;if(o.name.startsWith('body'))o.material.color.copy(tint);}});
   const bb=new THREE.Box3().setFromObject(ch);const H=bb.max.y-bb.min.y;const sc=(window.CHS??1.5)/H;ch.scale.setScalar(sc);
   ch.position.set(0,0,1.15);ch.rotation.y=Math.PI+(window.SR??0);dk.add(ch);ch.userData.dyn=true;
   scene.updateMatrixWorld(true);const head=ch.getObjectByName('head');const acc=ACC[k%ACC.length];
   const hm=ch.getObjectByName('head-mesh');const hb=new THREE.Box3().setFromObject(hm);ch.updateMatrixWorld(true);
   const hw=head.getWorldPosition(new THREE.Vector3());
   acc(head,(hb.max.y-hw.y)/sc*0+ (hb.max.y-hb.min.y)*0, D.color, hb, hw);
   const mx=new THREE.AnimationMixer(ch);const clip=C.animations.find(a=>a.name==='sit').clone();clip.tracks=clip.tracks.filter(tr=>!tr.name.startsWith('arm'));
   const act=mx.clipAction(clip);act.play();mixers.push(mx);
   scene.updateMatrixWorld(true);const cw=chair.getWorldPosition(new THREE.Vector3());
   const hit=new THREE.Raycaster(new THREE.Vector3(cw.x,cw.y+4,cw.z),new THREE.Vector3(0,-1,0)).intersectObject(chair,true)[0];
   const seatW=hit?hit.point.y:cw.y+.45;const hipL=ch.getObjectByName('leg-left'),hipR=ch.getObjectByName('leg-right');
   const hp=hipL.getWorldPosition(new THREE.Vector3()).add(hipR.getWorldPosition(new THREE.Vector3())).multiplyScalar(.5);
   const dl=dk.worldToLocal(hp.clone()),cl=dk.worldToLocal(cw.clone());
   ch.position.y+=(seatW-hp.y)+.26;ch.position.x+=cl.x-dl.x;ch.position.z+=cl.z-dl.z;
   WORKERS.push({ch,k,role:D.id,isRobot:false,arms:[ch.getObjectByName('arm-left'),ch.getObjectByName('arm-right')],head:ch.getObjectByName('head'),torso:ch.getObjectByName('torso'),ph:k*1.37,drv:new Set(clip.tracks.map(tr=>tr.name.split('.')[0]))});
   const lo=new THREE.Object3D();lo.position.set(0,2.25,1.15);dk.add(lo);TAGS.push({el:label(agentHandle,'lbl',0,lo),room:D.id,o:lo});
   const bo=new THREE.Object3D();bo.position.set(0,2.7,1.15);dk.add(bo);BUBBLES.push({el:label('','bubble',0,bo),role:D.id,k,o:bo});
   SCREENS.push({mon,kind:D.studio?2:(D.id==='tech'||D.id==='auth'?1:0)});
  }
 }
 // extras
 if(!D.qa){put('pottedPlant',.6,g,D.w/2-.6,.12,-D.d/2+.6);put('pottedPlant',.6,g,-D.w/2+.6,.12,D.d/2-.6);
  put('bookcaseOpen',1.1,g,-D.w/2+1.4,.12,-D.d/2+.4);put('rugRectangle',Math.min(D.w-2,7),g,0,.13,.2,0,D.color,true);}
 if(D.rack)for(let k=0;k<3;k++){put('bookcaseClosedDoors',.9,g,D.w/2-3.4+k*.95,.12,-D.d/2+.45,0,'#3d4250');
  for(let j=0;j<5;j++){const led=new THREE.Mesh(new THREE.BoxGeometry(.5,.035,.02),new THREE.MeshStandardMaterial({color:'#7ff',emissive:j%2?'#5fe0b0':'#6cf',emissiveIntensity:3}));LEDS.push(led.material);led.position.set(D.w/2-3.4+k*.95,.5+j*.32,-D.d/2+.86);g.add(led);}}
 if(D.mic){const m=new THREE.Group();m.position.set(D.w/2-1.5,.12,-D.d/2+1.5);g.add(m);
  put('rugRound',1.9,m,0,.01,0,0,'#cdb8e8',true);put('loungeChair',.9,m,0,0,.2,Math.PI);
  m.add(box(.05,1.3,.05,mat('#444'),0,.65,-.4,.02));const mc=new THREE.Mesh(new THREE.CapsuleGeometry(.1,.18,6,14),mat('#2b2b30',{metalness:.7,roughness:.25}));mc.position.set(0,1.38,-.4);mc.rotation.x=.5;m.add(mc);
  put('speaker',.45,m,-.75,0,-.5);put('speaker',.45,m,.75,0,-.5);}
 if(D.studio){  put('televisionModern',1.6,g,0,.12,-D.d/2+.4);}
 if(D.id==='hq'){put('loungeDesignSofa',2.0,g,3.2,.12,1.8,-Math.PI/2);put('tableCoffee',.9,g,2.0,.12,1.8);}
 if(D.qa){put('loungeChair',.9,g,-1.4,.12,1.9,Math.PI*.8);put('pottedPlant',.6,g,2,.12,2.3);}
});

RECEPTION_PUT();{const o=new THREE.Object3D();o.position.set(.5,3.6,-1.0);rec.add(o);label('<i style="background:#3a3330"></i>Reception','room',0,o).style.setProperty('--c','#3a3330');}
// ================= office life =================
// shared animated monitor textures (code / chart / waveform), redrawn ~8 fps
const SCR=[0,1,2].map(()=>{const c=document.createElement('canvas');c.width=192;c.height=120;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return {c,x:c.getContext('2d'),t};});
const scrMats=SCR.map(o=>new THREE.MeshBasicMaterial({map:o.t,toneMapped:false}));
SCREENS.forEach(({mon,kind})=>{const b=new THREE.Box3().setFromObject(mon);const sz=b.getSize(new THREE.Vector3());
 const p=new THREE.Mesh(new THREE.PlaneGeometry(.74,.42),scrMats[kind]);p.position.set(0,mon.userData.h*SCREEN_Y,SCREEN_Z);mon.add(p);});
let codeY=0;const bars=Array.from({length:12},()=>Math.random());
function drawScreens(t){
 {const {x}=SCR[0];x.fillStyle='#1f2330';x.fillRect(0,0,192,120);codeY=(codeY+3)%14;
  for(let i=0;i<10;i++){const y=i*14-codeY+10;const w=30+((i*53+Math.floor(t*2))%110);x.fillStyle=['#7fd1b9','#f2a65a','#9db4ff','#e8e8e8'][(i+Math.floor(t))%4];x.fillRect(10+(i%3)*10,y,w,5);}}
 {const {x}=SCR[1];x.fillStyle='#f7f3ec';x.fillRect(0,0,192,120);for(let i=0;i<12;i++){bars[i]+= (Math.random()-.45)*.08;bars[i]=Math.min(1,Math.max(.1,bars[i]));
  x.fillStyle=i%3?'#7fb3a3':'#e9a86b';const h=bars[i]*80;x.fillRect(12+i*14,104-h,9,h);}x.fillStyle='#3a3330';x.fillRect(10,104,172,2);}
 {const {x}=SCR[2];x.fillStyle='#24202a';x.fillRect(0,0,192,120);x.strokeStyle='#ffd36e';x.lineWidth=2;x.beginPath();
  for(let i=0;i<192;i+=3){const y=60+Math.sin(i*.12+t*6)*18*Math.sin(i*.03+t)+Math.sin(i*.5+t*9)*5;i?x.lineTo(i,y):x.moveTo(i,y);}x.stroke();
  x.fillStyle='#e8607a';x.fillRect(((t*40)%192),8,2,104);for(let i=0;i<6;i++){x.fillStyle=['#8f6fd1','#3fb39a','#f08a5d'][i%3];x.fillRect(i*32+2,100,28,12);}}
 SCR.forEach(o=>o.t.needsUpdate=true);}
// activity bubbles per role
BUBBLES.forEach(b=>{b.next=2+b.k*1.3%6;b.on=false;});
function bubbleTick(t){BUBBLES.forEach(b=>{if(t<b.next)return;b.on=!b.on;
 if(b.on){const L=ACT[b.role]||['Working…'];b.el.textContent=L[Math.floor(Math.random()*L.length)];b.el.classList.add('show');b.next=t+3.5+Math.random()*2;}
 else{b.el.classList.remove('show');b.next=t+2+Math.random()*6;}});}
// coffee steam
const steam=[];for(let i=0;i<4;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.05,8,6),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.5,depthWrite:false}));m.userData.ph=i/4;cof.add(m);steam.push(m);}
const WALK=[];function walkTick(){}
let lastScr=0,lastLed=0;
function LIFE(t,dt){
 // procedural typing / head turns / stretch on top of the sit pose
 WORKERS.forEach(W=>{const p=W.ph;
  if(W.isRobot){if(W.head)W.head.rotation.y=Math.sin(t*.6+p)*.14;return;}
  const o=W.o||(W.o={tx:0,hy:0,a0:0,a1:0});
  const n={tx:Math.sin(t*1.6+p)*.012,hy:Math.sin(t*.35+p)*.06,a0:Math.max(0,Math.sin(t*9+p))*.035,a1:Math.max(0,Math.sin(t*9+p+2.1))*.035};
  const ap=(b,ax,k)=>{if(!b)return;b.rotation[ax]+=W.drv.has(b.name)?n[k]:n[k]-o[k];};
  ap(W.torso,'x','tx');ap(W.head,'y','hy');{const Z=window.AZ??.72,v0=(window.AX??-.68)+n.a0,v1=(window.AX??-.68)+n.a1;W.arms[0].rotation.set(v0,0,-Z);W.arms[1].rotation.set(v1,0,Z);}W.o=n;});
 if(t-lastScr>.125){lastScr=t;drawScreens(t);}
 if(t-lastLed>.18){lastLed=t;LEDS.forEach(m=>m.emissiveIntensity=Math.random()<.25?.4:3);}
 steam.forEach(m=>{const u=(t*.35+m.userData.ph)%1;m.position.set(Math.sin(u*9+m.userData.ph*6)*.04,1.22+u*.55,.25);m.material.opacity=.45*(1-u);m.scale.setScalar(.6+u*1.4);});
 bubbleTick(t);walkTick(t,dt);}
// freeze matrices of static scenery (everything except characters, walkers, steam, dust)
scene.updateMatrixWorld(true);
const DYN=new Set();WORKERS.forEach(W=>DYN.add(W.ch));WALK.forEach(W=>DYN.add(W.w));steam.forEach(m=>DYN.add(m));
scene.traverse(o=>{let p=o,dyn=false;while(p){if(DYN.has(p)||p.isBone||p.isSkinnedMesh){dyn=true;break;}p=p.parent;}if(!dyn&&o!==scene&&!o.isCSS2DObject){o.matrixAutoUpdate=false;}});
// dust
const N=70,pg=new THREE.BufferGeometry(),pp=new Float32Array(N*3);for(let i=0;i<N;i++){pp[i*3]=(Math.random()-.5)*29;pp[i*3+1]=Math.random()*4.5+.5;pp[i*3+2]=(Math.random()-.5)*21;}
pg.setAttribute('position',new THREE.BufferAttribute(pp,3));
const dust=new THREE.Points(pg,new THREE.PointsMaterial({color:'#ffd9a0',size:.12,transparent:true,opacity:.8,depthWrite:false}));scene.add(dust);

// UI
const pills=ROOT.querySelector('#pills'),card=ROOT.querySelector('#card');
DEPTS.forEach(D=>{const b=document.createElement('button');b.className='pill';b.dataset.id=D.id;b.innerHTML=`<i style="background:${D.color}"></i>${D.name.replace("Daniel's ",'')}`;b.onclick=()=>focus(D.id);pills.appendChild(b);});
let tgt=null;
let activeWave=null;
function triggerWave(agentHandle){
 const bot=robotMap[agentHandle];if(!bot||!bot.waveAction)return;
 if(activeWave&&activeWave!==bot.waveAction){activeWave.stop();}
 bot.sitAction.crossFadeTo(bot.waveAction,.2,false);bot.waveAction.reset().play();activeWave=bot.waveAction;
 setTimeout(()=>{if(bot.waveAction&&bot.sitAction){bot.waveAction.crossFadeTo(bot.sitAction,.35,false);activeWave=null;}},2400);
}
window.triggerWave=triggerWave;
function focus(id){const {D}=rooms[id];document.querySelectorAll('#pills .pill').forEach(p=>p.classList.toggle('on',p.dataset.id===id));
 const dist=Math.max(D.w,D.d)*1.05+3.8;tgt={t:new THREE.Vector3(D.x,1.1,D.z),p:new THREE.Vector3(D.x+dist*.62,dist*.92,D.z+dist*.62)};
 SWAY=false;rot.classList.remove('on');
 card.innerHTML=`<h3 style="color:${D.color}">${D.name}</h3><div class="sub">${D.qa?'Human-in-the-loop':D.agents.length+' AI agent'+(D.agents.length>1?'s':'')} · Daniel's Agent Office</div>`+D.agents.map(([n,r])=>`<div class="ag" onclick="window.triggerWave&&window.triggerWave('${n}')" style="cursor:pointer" title="Click to interact"><span class="dot" style="background:${D.color}"></span><div><b>${n}</b><p>${r}</p></div></div>`).join('');
 card.classList.add('show');
 if(charMode==='robot'&&D.agents.length>0)triggerWave(D.agents[0][0]);
}
const mrob=ROOT.querySelector('#mrob'),mhum=ROOT.querySelector('#mhum');
if(mrob&&mhum){
 if(charMode==='robot'){mrob.classList.add('on');mhum.classList.remove('on');}
 else{mhum.classList.add('on');mrob.classList.remove('on');}
 mrob.onclick=()=>{const u=new URL(location.href);u.searchParams.set('chars','robot');location.href=u.toString();};
 mhum.onclick=()=>{const u=new URL(location.href);u.searchParams.set('chars','human');location.href=u.toString();};
}
const rot=ROOT.querySelector('#rot');rot.onclick=()=>{SWAY=!SWAY;rot.classList.toggle('on',SWAY);};
ROOT.querySelector('#home').onclick=()=>{tgt={t:new THREE.Vector3(),p:new THREE.Vector3(27,24,27)};card.classList.remove('show');document.querySelectorAll('#pills .pill').forEach(p=>p.classList.remove('on'));};
const ray=new THREE.Raycaster(),mv=new THREE.Vector2();let down;
renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY,performance.now()];tgt=null;SWAY=false;rot.classList.remove('on');});
renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>=5||performance.now()-down[2]>300){down=null;return;}down=null;
 {const r=renderer.domElement.getBoundingClientRect();mv.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);}ray.setFromCamera(mv,camera);
 const h=ray.intersectObjects(Object.values(rooms).map(r=>r.g),true)[0];
 if(h){let o=h.object;while(o&&!Object.values(rooms).some(r=>r.g===o))o=o.parent;if(o)focus(Object.keys(rooms).find(k=>rooms[k].g===o));}});
controls.addEventListener('start',()=>{tgt=null;SWAY=false;rot.classList.remove('on');});

const onResize=()=>{const [w,h]=SZ();camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);composer.setSize(w,h);lr.setSize(w,h);};
new ResizeObserver(onResize).observe(ROOT);
// wheel zoom only when the section is hovered+clicked (focused) or ctrl/cmd held; standalone page always zooms
let ACTIVE=STANDALONE;ROOT.addEventListener('pointerdown',()=>{ACTIVE=true;ROOT.classList.add('active');});
document.addEventListener('pointerdown',e=>{if(!STANDALONE&&!ROOT.contains(e.target)){ACTIVE=false;ROOT.classList.remove('active');}});
ROOT.addEventListener('pointerleave',()=>{if(!STANDALONE){ACTIVE=false;ROOT.classList.remove('active');}});
ROOT.addEventListener('wheel',e=>{controls.enableZoom=ACTIVE||e.ctrlKey||e.metaKey;},{capture:true,passive:true});
let VISIBLE=true;new IntersectionObserver(es=>{VISIBLE=es[0].isIntersecting;},{threshold:0}).observe(ROOT);
window.__camObj=camera;window.__cam=(a,b,c,d,e,f)=>{tgt=null;SWAY=false;controls.minDistance=1;camera.position.set(a,b,c);controls.target.set(d,e,f);};
const BLOOM=/bloom=1/.test(location.search);let lastVis=-1;
renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
const _v=new THREE.Vector3();
function roomAt(p){for(const k in rooms){const D=rooms[k].D;if(Math.abs(p.x-D.x)<D.w/2+.5&&Math.abs(p.z-D.z)<D.d/2+.5)return k;}return null;}
function visTick(){const dist=camera.position.distanceTo(controls.target);const near=dist<20;const cur=roomAt(controls.target);
 TAGS.forEach(T=>{const show=near&&cur===T.room;T.o.children[0].visible=show;});
 BUBBLES.forEach(B=>{const show=near&&cur===B.role;B.el.style.visibility=show?'':'hidden';});}
const clock=new THREE.Clock();let last=0;
renderer.setAnimationLoop(()=>{if(!VISIBLE||document.hidden){clock.getDelta();return;}const t=clock.getElapsedTime();
 const dt=t-last;last=t;mixers.forEach(m=>m.update(dt));bots.forEach(b=>{const p=b.userData.ph;b.position.y=Math.sin(t*2+p)*.05;b.userData.body.scale.set(1+Math.sin(t*2+p)*.02,1-Math.sin(t*2+p)*.015,1+Math.sin(t*2+p)*.02);b.rotation.y=Math.PI+Math.sin(t*.5+p)*.25;b.userData.ant.position.x=Math.sin(t*3+p)*.04;});
 const a=pg.attributes.position.array;for(let i=0;i<N;i++){a[i*3+1]+=Math.sin(t+i)*.002;a[i*3]+=Math.cos(t*.3+i)*.002;}pg.attributes.position.needsUpdate=true;
 if(tgt){controls.target.lerp(tgt.t,.06);camera.position.lerp(tgt.p,.06);if(camera.position.distanceTo(tgt.p)<.05)tgt=null;}
 if(SWAY&&!tgt){const off=camera.position.clone().sub(controls.target);const sp=new THREE.Spherical().setFromVector3(off);sp.theta=Math.PI/4+Math.sin(t*.12)*.38;camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(sp));}
 controls.target.x=THREE.MathUtils.clamp(controls.target.x,-14,14);controls.target.z=THREE.MathUtils.clamp(controls.target.z,-10,10);controls.target.y=THREE.MathUtils.clamp(controls.target.y,0,3);
 LIFE(t,dt);
 controls.update();if(BLOOM)composer.render();else renderer.render(scene,camera);
 if(t-lastVis>.25){lastVis=t;visTick();}lr.render(scene,camera);});
ROOT.querySelector('#loading').style.opacity=0;
