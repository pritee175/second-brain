'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { usePersist } from '../lib/storage';

/* ═══ UID ═══ */
let _uid = Date.now();
const uid = () => `u${++_uid}`;
const today = () => new Date().toISOString().split('T')[0];

/* ═══ TOKENS ═══ */
const C = {
  bg:'#F5F3EF',sf:'#FFFFFF',sfA:'#FAFAF8',
  tx:'#1C1917',tx2:'#57534E',tx3:'#A8A29E',
  bd:'#E7E5E4',
  rust:'#C2410C',rustBg:'#FFF7ED',
  teal:'#0D9488',tealBg:'#F0FDFA',
  indigo:'#4338CA',indigoBg:'#EEF2FF',
  amber:'#B45309',amberBg:'#FFFBEB',
  rose:'#BE123C',roseBg:'#FFF1F2',
  slate:'#475569',slateBg:'#F8FAFC',
};

/* ═══ ICONS ═══ */
const sv = (d, s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{d}</svg>;
const IC = {
  check:(s)=>sv(<path d="M5 13l4 4L19 7"/>,s),
  plus:()=>sv(<path d="M12 5v14M5 12h14"/>),
  trash:()=>sv(<path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/>,14),
  cal:()=>sv(<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>),
  clock:()=>sv(<><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>),
  link:()=>sv(<><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></>),
  brief:()=>sv(<><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></>),
  signal:()=>sv(<path d="M12 20h.01M8.5 16.5a5 5 0 017 0M5 13a9 9 0 0114 0"/>),
  chat:()=>sv(<path d="M21 11.5a8.4 8.4 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.4 8.4 0 013.8-.9h.5a8.5 8.5 0 018 8v.5z"/>),
  code:()=>sv(<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>),
  book:()=>sv(<><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></>),
  chart:()=>sv(<path d="M18 20V10M12 20V4M6 20v-6"/>),
  search:()=>sv(<><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.4-4.4"/></>),
  menu:()=>sv(<path d="M3 12h18M3 6h18M3 18h18"/>,20),
  ext:()=>sv(<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>,12),
  pen:()=>sv(<path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>,14),
  back:()=>sv(<path d="M19 12H5M12 19l-7-7 7-7"/>),
};

/* ═══ SHARED ═══ */
const inp=(x)=>({padding:'9px 12px',background:C.sfA,border:`1.5px solid ${C.bd}`,borderRadius:8,color:C.tx,fontSize:13,outline:'none',fontFamily:'inherit',...x});
const btnP=(bg=C.rust,x)=>({padding:'9px 16px',background:bg,border:'none',borderRadius:8,color:'#fff',cursor:'pointer',fontWeight:600,fontSize:12,display:'inline-flex',alignItems:'center',gap:6,fontFamily:'inherit',letterSpacing:'0.2px',...x});
const crd=(x)=>({background:C.sf,borderRadius:10,border:`1px solid ${C.bd}`,boxShadow:'0 1px 3px rgba(0,0,0,0.03)',...x});
const tg=(c,bg)=>({fontSize:10,padding:'2px 8px',borderRadius:4,background:bg,color:c,fontWeight:700,letterSpacing:'0.5px',textTransform:'uppercase',lineHeight:'18px',display:'inline-block'});

/* ═══ CHARTS ═══ */
const Ring=({val,max,color=C.teal,size=70,label})=>{
  const p=max>0?val/max*100:0;const r=(size-10)/2,ci=2*Math.PI*r,off=ci-p/100*ci;
  return(<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
    <div style={{position:'relative',width:size,height:size}}>
      <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.bd} strokeWidth="5"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={ci} strokeDashoffset={off} style={{transition:'stroke-dashoffset .5s ease'}}/>
      </svg>
      <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:800,color:C.tx}}>{Math.round(p)}%</div>
    </div>
    {label&&<div style={{fontSize:9,color:C.tx3,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px'}}>{label}</div>}
  </div>);
};

const Bars=({data,color=C.rust,h=100,label})=>{
  const mx=Math.max(...data.map(d=>d.v),1);
  return(<div>
    {label&&<div style={{fontSize:10,fontWeight:700,color:C.tx2,marginBottom:10,letterSpacing:'0.5px',textTransform:'uppercase'}}>{label}</div>}
    <div style={{display:'flex',alignItems:'flex-end',gap:3,height:h}}>
      {data.map((d,i)=>(<div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
        <div style={{fontSize:8,color:C.tx3,fontWeight:600}}>{d.v||''}</div>
        <div style={{width:'100%',maxWidth:32,borderRadius:'3px 3px 0 0',background:color,height:`${Math.max((d.v/mx)*(h-28),2)}px`,transition:'height .4s',opacity:.8}}/>
        <div style={{fontSize:8,color:C.tx3,fontWeight:500}}>{d.l}</div>
      </div>))}
    </div>
  </div>);
};

/* ═══ QUOTES ═══ */
const QUOTES=[
  "Consistency beats talent when talent doesn't show up.",
  "Your network is your net worth — build it daily.",
  "Stop waiting for the perfect moment. Start now.",
  "Skills pay the bills. Keep learning, keep earning.",
  "The best investment you can make is in yourself.",
  "Comfort zone is beautiful, but nothing grows there.",
  "Your habits today decide your future tomorrow.",
  "Excuses don't build empires. Actions do.",
  "Be so good they can't ignore you.",
  "Fail fast, learn faster. That's the real shortcut.",
  "Dream big, start small — but most importantly, start.",
  "Your 20s are not for comfort. They're for building.",
];

/* ═══ CONFETTI ═══ */
const Confetti=({n})=>{
  const[ps,sPs]=useState([]);
  useEffect(()=>{
    if(!n)return;
    const cols=[C.rust,C.teal,C.indigo,C.amber,C.rose,'#D97706','#0891B2'];
    sPs(Array.from({length:50},(_,i)=>({id:`${n}_${i}`,x:35+Math.random()*30,c:cols[i%cols.length],sz:4+Math.random()*5,dr:(Math.random()-.5)*160,dl:Math.random()*350,du:1600+Math.random()*1200,rt:Math.random()*600,sh:i%3})));
    const t=setTimeout(()=>sPs([]),3200);return()=>clearTimeout(t);
  },[n]);
  if(!ps.length)return null;
  return(<div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:9999,overflow:'hidden'}}>
    {ps.map(p=><div key={p.id} style={{position:'absolute',left:`${p.x}%`,top:'-2%',width:p.sz,height:p.sh===2?p.sz*1.5:p.sz,background:p.sh===0?p.c:'transparent',borderRadius:p.sh===0?'50%':'1px',border:p.sh!==0?`2px solid ${p.c}`:'none',animation:`cFall ${p.du}ms ease-in ${p.dl}ms forwards`,'--dr':`${p.dr}px`,'--rt':`${p.rt}deg`,opacity:0}}/>)}
  </div>);
};

/* ═══ NAV ═══ */
const NAV=[
  {k:'dash',l:'Dashboard',i:IC.chart},
  {k:'todo',l:'Tasks',i:IC.check},
  {k:'journal',l:'Journal',i:IC.book},
  {k:'cal',l:'Calendar',i:IC.cal},
  {k:'sched',l:'Schedule',i:IC.clock},
  {k:'links',l:'Read Later',i:IC.link},
  {k:'apps',l:'Applications',i:IC.brief},
  {k:'live',l:'Openings',i:IC.signal},
  {k:'comm',l:'Communication',i:IC.chat},
  {k:'skills',l:'Skills',i:IC.code},
];

/* ═══ DASHBOARD ═══ */
const Dashboard=({tasks,journal,skills,apps})=>{
  const done=tasks.filter(t=>t.done).length;
  const avg=skills.length?Math.round(skills.reduce((a,s)=>a+s.lv,0)/skills.length):0;
  const jW=journal.filter(j=>{const d=(new Date()-new Date(j.dt))/864e5;return d<7;}).length;
  const aP={applied:apps.filter(a=>a.st==='applied').length,int:apps.filter(a=>a.st==='interviewing').length,offer:apps.filter(a=>a.st==='offer').length};
  const last7=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));const k=d.toISOString().split('T')[0];return{l:['S','M','T','W','T','F','S'][d.getDay()],v:tasks.filter(t=>t.done&&t.doneAt===k).length};});
  const mC={};journal.forEach(j=>{mC[j.mood]=(mC[j.mood]||0)+1;});const mD=Object.entries(mC).map(([l,v])=>({l,v}));
  const q=QUOTES[Math.floor(Date.now()/90000)%QUOTES.length];
  return(<div>
    <div style={{...crd(),padding:'16px 20px',marginBottom:16,borderLeft:`3px solid ${C.rust}`,background:C.rustBg}}>
      <div style={{fontSize:9,fontWeight:700,color:C.rust,letterSpacing:'1px',textTransform:'uppercase',marginBottom:4}}>Raj Shamani</div>
      <div style={{fontSize:13,color:C.tx,fontStyle:'italic',fontWeight:500,lineHeight:1.5}}>"{q}"</div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:10,marginBottom:20}}>
      {[{l:'Tasks Done',v:`${done}/${tasks.length}`,c:C.teal,bg:C.tealBg},{l:'Avg Skill',v:`${avg}%`,c:C.indigo,bg:C.indigoBg},{l:'Journal / Week',v:jW,c:C.amber,bg:C.amberBg},{l:'Applications',v:apps.length,c:C.rose,bg:C.roseBg}].map((s,i)=>(
        <div key={i} style={{...crd(),padding:'14px 16px',borderLeft:`3px solid ${s.c}`,background:s.bg}}>
          <div style={{fontSize:9,fontWeight:700,color:s.c,letterSpacing:'0.5px',textTransform:'uppercase',marginBottom:4}}>{s.l}</div>
          <div style={{fontSize:22,fontWeight:800,color:C.tx}}>{s.v}</div>
        </div>
      ))}
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:14}}>
      <div style={{...crd(),padding:'14px 18px'}}><Bars data={last7} color={C.teal} h={90} label="Tasks / Last 7 days"/></div>
      <div style={{...crd(),padding:'14px 18px'}}>
        <div style={{fontSize:10,fontWeight:700,color:C.tx2,marginBottom:12,letterSpacing:'0.5px',textTransform:'uppercase'}}>Progress</div>
        <div style={{display:'flex',justifyContent:'center',gap:16,flexWrap:'wrap'}}>
          <Ring val={done} max={Math.max(tasks.length,1)} color={C.teal} size={64} label="Tasks"/>
          <Ring val={avg} max={100} color={C.indigo} size={64} label="Skills"/>
          <Ring val={aP.applied+aP.int+aP.offer} max={Math.max(apps.length,1)} color={C.rose} size={64} label="Active"/>
        </div>
      </div>
    </div>
    {mD.length>0&&<div style={{...crd(),padding:'14px 18px',marginTop:14}}><Bars data={mD} color={C.amber} h={70} label="Journal moods"/></div>}
  </div>);
};

/* ═══ TASKS ═══ */
const Tasks=({tasks,set,pop})=>{
  const[iv,sIv]=useState('');const[pri,sPri]=useState('medium');const[fil,sFil]=useState('all');
  const add=()=>{if(!iv.trim())return;set([{id:uid(),tx:iv.trim(),done:false,pri,dt:today()},...tasks]);sIv('');};
  const tog=id=>{set(tasks.map(t=>{if(t.id!==id)return t;if(!t.done)pop();return{...t,done:!t.done,doneAt:!t.done?today():null};}));};
  const pC={high:C.rust,medium:C.amber,low:C.teal};
  const vis=tasks.filter(t=>fil==='all'||(fil==='active'?!t.done:t.done));
  return(<div>
    <div style={{display:'flex',gap:8,marginBottom:18,flexWrap:'wrap'}}>
      <input value={iv} onChange={e=>sIv(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()} placeholder="Add a new task..." style={inp({flex:1,minWidth:180})}/>
      <select value={pri} onChange={e=>sPri(e.target.value)} style={inp({cursor:'pointer',minWidth:100})}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
      <button onClick={add} style={btnP()}>{IC.plus()} Add</button>
    </div>
    <div style={{display:'flex',gap:4,marginBottom:14}}>
      {['all','active','done'].map(f=><button key={f} onClick={()=>sFil(f)} style={{padding:'5px 12px',borderRadius:6,border:'none',background:fil===f?C.rustBg:'transparent',color:fil===f?C.rust:C.tx3,cursor:'pointer',fontSize:10,fontWeight:700,fontFamily:'inherit',textTransform:'uppercase',letterSpacing:'0.5px'}}>{f}</button>)}
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:6}}>
      {vis.map((t,i)=><div key={t.id} style={{...crd(),display:'flex',alignItems:'center',gap:10,padding:'11px 14px',borderLeft:`3px solid ${pC[t.pri]}`,opacity:t.done?.4:1,animation:`fi .2s ease ${i*.02}s both`}}>
        <button onClick={()=>tog(t.id)} style={{width:20,height:20,borderRadius:5,border:t.done?'none':`2px solid ${C.bd}`,background:t.done?C.teal:'transparent',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:'#fff'}}>{t.done&&IC.check(12)}</button>
        <span style={{flex:1,fontSize:13,color:C.tx,textDecoration:t.done?'line-through':'none',fontWeight:450,minWidth:0,overflow:'hidden',textOverflow:'ellipsis'}}>{t.tx}</span>
        <span style={{...tg(pC[t.pri],pC[t.pri]+'14'),flexShrink:0}}>{t.pri}</span>
        <button onClick={()=>set(tasks.filter(x=>x.id!==t.id))} style={{background:'none',border:'none',color:C.tx3,cursor:'pointer',opacity:.4,flexShrink:0}}>{IC.trash()}</button>
      </div>)}
      {!vis.length&&<div style={{textAlign:'center',color:C.tx3,padding:40,fontSize:13}}>No tasks here</div>}
    </div>
  </div>);
};

/* ═══ JOURNAL ═══ */
const Journal=({entries,set})=>{
  const[title,sT]=useState('');const[body,sB]=useState('');const[mood,sM]=useState('Good');const[tgs,sTgs]=useState('');
  const[edId,sEd]=useState(null);const[search,sSr]=useState('');const[viewId,sV]=useState(null);
  const moods=['Great','Good','Okay','Low','Rough'];
  const mC={Great:C.teal,Good:C.indigo,Okay:C.amber,Low:C.rose,Rough:C.slate};
  const save=()=>{
    if(!title.trim()||!body.trim())return;
    const t=tgs.split(',').map(t=>t.trim()).filter(Boolean);
    if(edId){set(entries.map(j=>j.id===edId?{...j,title:title.trim(),body:body.trim(),mood,tags:t}:j));sEd(null);}
    else{set([{id:uid(),title:title.trim(),body:body.trim(),mood,tags:t,dt:today(),crAt:new Date().toISOString()},...entries]);}
    sT('');sB('');sM('Good');sTgs('');
  };
  const startEdit=j=>{sEd(j.id);sT(j.title);sB(j.body);sM(j.mood);sTgs(j.tags?.join(', ')||'');sV(null);};
  const cancel=()=>{sEd(null);sT('');sB('');sM('Good');sTgs('');};
  const filtered=entries.filter(j=>{if(!search)return true;const q=search.toLowerCase();return j.title.toLowerCase().includes(q)||j.body.toLowerCase().includes(q)||j.tags?.some(t=>t.toLowerCase().includes(q));});
  const streak=(()=>{let c=0;for(let i=0;i<365;i++){const d=new Date();d.setDate(d.getDate()-i);if(entries.some(j=>j.dt===d.toISOString().split('T')[0]))c++;else break;}return c;})();

  if(viewId){
    const j=entries.find(x=>x.id===viewId);
    if(!j){sV(null);return null;}
    return(<div>
      <button onClick={()=>sV(null)} style={{background:'none',border:'none',color:C.rust,cursor:'pointer',fontWeight:600,fontSize:12,fontFamily:'inherit',padding:0,marginBottom:14,display:'flex',alignItems:'center',gap:4}}>{IC.back()} All entries</button>
      <div style={{...crd(),padding:'24px 28px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14,flexWrap:'wrap',gap:8}}>
          <div style={{minWidth:0}}><h3 style={{margin:'0 0 4px',fontSize:18,fontWeight:700,color:C.tx,wordBreak:'break-word'}}>{j.title}</h3><div style={{fontSize:11,color:C.tx3}}>{j.dt}</div></div>
          <div style={{display:'flex',gap:6,alignItems:'center',flexShrink:0}}>
            <span style={tg(mC[j.mood],mC[j.mood]+'18')}>{j.mood}</span>
            <button onClick={()=>startEdit(j)} style={{background:'none',border:'none',color:C.tx2,cursor:'pointer'}}>{IC.pen()}</button>
            <button onClick={()=>{set(entries.filter(x=>x.id!==j.id));sV(null);}} style={{background:'none',border:'none',color:C.tx3,cursor:'pointer'}}>{IC.trash()}</button>
          </div>
        </div>
        <div style={{fontSize:14,color:C.tx2,lineHeight:1.8,whiteSpace:'pre-wrap',wordBreak:'break-word'}}>{j.body}</div>
        {j.tags?.length>0&&<div style={{display:'flex',gap:4,marginTop:14,flexWrap:'wrap'}}>{j.tags.map((t,i)=><span key={i} style={tg(C.tx2,C.slateBg)}>{t}</span>)}</div>}
      </div>
    </div>);
  }

  return(<div>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18,flexWrap:'wrap',gap:8}}>
      <div style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
        <div style={{...crd(),padding:'6px 14px',borderLeft:`3px solid ${C.amber}`,display:'flex',alignItems:'center',gap:6}}>
          <span style={{fontSize:9,fontWeight:700,color:C.amber,textTransform:'uppercase',letterSpacing:'0.5px'}}>Streak</span>
          <span style={{fontSize:16,fontWeight:800,color:C.tx}}>{streak}d</span>
        </div>
        <span style={{fontSize:11,color:C.tx3}}>{entries.length} entries</span>
      </div>
    </div>
    <div style={{...crd(),padding:'18px 20px',marginBottom:18}}>
      <div style={{fontSize:10,fontWeight:700,color:C.tx2,marginBottom:10,letterSpacing:'0.5px',textTransform:'uppercase'}}>{edId?'Edit entry':'New entry'}</div>
      <input value={title} onChange={e=>sT(e.target.value)} placeholder="Title" style={inp({width:'100%',boxSizing:'border-box',marginBottom:8,fontSize:14,fontWeight:600})}/>
      <textarea value={body} onChange={e=>sB(e.target.value)} placeholder="Reflect on your day, goals, learnings..." rows={5} style={inp({width:'100%',boxSizing:'border-box',resize:'vertical',lineHeight:1.7,marginBottom:8})}/>
      <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
        <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>
          {moods.map(m=><button key={m} onClick={()=>sM(m)} style={{padding:'4px 10px',borderRadius:6,border:mood===m?`2px solid ${mC[m]}`:`1px solid ${C.bd}`,background:mood===m?mC[m]+'14':'transparent',color:mood===m?mC[m]:C.tx3,cursor:'pointer',fontSize:10,fontWeight:600,fontFamily:'inherit'}}>{m}</button>)}
        </div>
        <input value={tgs} onChange={e=>sTgs(e.target.value)} placeholder="Tags (comma sep)" style={inp({flex:1,minWidth:100,fontSize:11})}/>
        <button onClick={save} style={btnP(C.indigo)}>{edId?'Update':'Save'}</button>
        {edId&&<button onClick={cancel} style={{...btnP('transparent'),color:C.tx3,boxShadow:'none'}}>Cancel</button>}
      </div>
    </div>
    <div style={{position:'relative',marginBottom:14}}>
      <span style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:C.tx3}}>{IC.search()}</span>
      <input value={search} onChange={e=>sSr(e.target.value)} placeholder="Search entries..." style={inp({width:'100%',boxSizing:'border-box',paddingLeft:34})}/>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:8}}>
      {filtered.map((j,i)=><div key={j.id} onClick={()=>sV(j.id)} style={{...crd(),padding:'12px 16px',cursor:'pointer',borderLeft:`3px solid ${mC[j.mood]||C.slate}`,animation:`fi .2s ease ${i*.02}s both`}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:3,gap:8}}>
          <h4 style={{margin:0,fontSize:13,fontWeight:700,color:C.tx,minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{j.title}</h4>
          <div style={{display:'flex',gap:6,alignItems:'center',flexShrink:0}}><span style={tg(mC[j.mood],mC[j.mood]+'14')}>{j.mood}</span><span style={{fontSize:10,color:C.tx3}}>{j.dt}</span></div>
        </div>
        <p style={{margin:0,fontSize:11,color:C.tx2,lineHeight:1.4,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{j.body}</p>
      </div>)}
      {!filtered.length&&<div style={{textAlign:'center',color:C.tx3,padding:40,fontSize:13}}>No entries yet</div>}
    </div>
  </div>);
};

/* ═══ CALENDAR ═══ */
const CalPage=({events,set})=>{
  const[cur,sCur]=useState(()=>new Date());
  const[sf,sSf]=useState(false);const[nE,sNE]=useState({title:'',date:'',time:''});const[sel,sSel]=useState(null);
  const y=cur.getFullYear(),m=cur.getMonth();
  const mN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dim=new Date(y,m+1,0).getDate(),fd=new Date(y,m,1).getDay();
  const days=Array.from({length:42},(_,i)=>{const d=i-fd+1;return d>0&&d<=dim?d:null;});
  const td=new Date();const isT=d=>d===td.getDate()&&m===td.getMonth()&&y===td.getFullYear();
  const evF=d=>{const ds=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;return events.filter(e=>e.date===ds);};
  const addE=()=>{if(!nE.title||!nE.date)return;set([...events,{...nE,id:uid()}]);sNE({title:'',date:'',time:''});sSf(false);};
  return(<div>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18,flexWrap:'wrap',gap:8}}>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <button onClick={()=>sCur(new Date(y,m-1,1))} style={inp({padding:'6px 10px',cursor:'pointer',fontSize:12})}>Prev</button>
        <h3 style={{margin:0,fontSize:15,fontWeight:700,color:C.tx}}>{mN[m]} {y}</h3>
        <button onClick={()=>sCur(new Date(y,m+1,1))} style={inp({padding:'6px 10px',cursor:'pointer',fontSize:12})}>Next</button>
      </div>
      <button onClick={()=>sSf(!sf)} style={btnP(C.teal)}>{IC.plus()} Event</button>
    </div>
    {sf&&<div style={{...crd(),padding:14,marginBottom:14,display:'flex',gap:6,flexWrap:'wrap',alignItems:'end'}}>
      <input value={nE.title} onChange={e=>sNE({...nE,title:e.target.value})} placeholder="Event" style={inp({flex:1,minWidth:120})}/>
      <input type="date" value={nE.date} onChange={e=>sNE({...nE,date:e.target.value})} style={inp({minWidth:130})}/>
      <input type="time" value={nE.time} onChange={e=>sNE({...nE,time:e.target.value})} style={inp({minWidth:90})}/>
      <button onClick={addE} style={btnP(C.teal)}>Add</button>
    </div>}
    <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2,marginBottom:14}}>
      {['S','M','T','W','T','F','S'].map((d,i)=><div key={i} style={{textAlign:'center',fontSize:9,color:C.tx3,padding:6,fontWeight:700}}>{d}</div>)}
      {days.map((d,i)=>{const ev=d?evF(d):[];return(<div key={i} onClick={()=>d&&sSel(d)} style={{aspectRatio:'1',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,borderRadius:6,cursor:d?'pointer':'default',background:sel===d?C.rustBg:isT(d)?C.tealBg:C.sf,border:isT(d)?`2px solid ${C.teal}`:`1px solid ${d?C.bd:'transparent'}`,fontSize:11,color:isT(d)?C.teal:C.tx,fontWeight:isT(d)?700:400}}>
        {d&&<span>{d}</span>}
        {ev.length>0&&<div style={{display:'flex',gap:1}}>{ev.slice(0,3).map(e=><div key={e.id} style={{width:3,height:3,borderRadius:'50%',background:C.rust}}/>)}</div>}
      </div>);})}
    </div>
    {sel&&<div style={{...crd(),padding:14,borderLeft:`3px solid ${C.teal}`}}>
      <div style={{fontSize:10,fontWeight:700,color:C.teal,marginBottom:6,textTransform:'uppercase',letterSpacing:'0.5px'}}>{mN[m]} {sel}</div>
      {evF(sel).length?evF(sel).map(e=><div key={e.id} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 0',borderBottom:`1px solid ${C.bd}`}}>
        <div style={{width:5,height:5,borderRadius:'50%',background:C.rust,flexShrink:0}}/><span style={{flex:1,fontSize:12,color:C.tx,fontWeight:500}}>{e.title}</span><span style={{fontSize:10,color:C.tx3,flexShrink:0}}>{e.time}</span>
        <button onClick={()=>set(events.filter(x=>x.id!==e.id))} style={{background:'none',border:'none',color:C.tx3,cursor:'pointer',opacity:.4,flexShrink:0}}>{IC.trash()}</button>
      </div>):<div style={{fontSize:11,color:C.tx3}}>No events</div>}
    </div>}
  </div>);
};

/* ═══ SCHEDULE ═══ */
const SchedPage=({data,set})=>{
  const[nT,sNT]=useState('');const[nTk,sNTk]=useState('');const[nC,sNC]=useState('personal');
  const[edId,sEdId]=useState(null);const[edTx,sEdTx]=useState('');
  const cc={personal:C.slate,study:C.indigo,college:C.teal,career:C.amber};
  const add=()=>{if(!nT||!nTk)return;set([...data,{id:uid(),time:nT,task:nTk,cat:nC}].sort((a,b)=>a.time.localeCompare(b.time)));sNT('');sNTk('');};
  const saveEd=id=>{set(data.map(s=>s.id===id?{...s,task:edTx}:s));sEdId(null);};
  const now=new Date();const ct=`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  return(<div>
    <div style={{display:'flex',gap:6,marginBottom:18,flexWrap:'wrap'}}>
      <input type="time" value={nT} onChange={e=>sNT(e.target.value)} style={inp({minWidth:90})}/>
      <input value={nTk} onChange={e=>sNTk(e.target.value)} placeholder="Activity" style={inp({flex:1,minWidth:140})}/>
      <select value={nC} onChange={e=>sNC(e.target.value)} style={inp({cursor:'pointer',minWidth:90})}><option value="personal">Personal</option><option value="study">Study</option><option value="college">College</option><option value="career">Career</option></select>
      <button onClick={add} style={btnP(C.teal)}>Add</button>
    </div>
    <div style={{position:'relative',paddingLeft:24}}>
      <div style={{position:'absolute',left:8,top:0,bottom:0,width:2,background:C.bd}}/>
      {data.map((s,i)=>{const past=s.time<ct;const cur=i<data.length-1&&s.time<=ct&&data[i+1].time>ct;const co=cc[s.cat]||C.slate;
        return(<div key={s.id} style={{position:'relative',marginBottom:4,display:'flex',alignItems:'center',gap:10,padding:'10px 12px',...crd(),borderLeft:`3px solid ${co}`,opacity:past&&!cur?.35:1,background:cur?co+'08':C.sf,animation:`fi .15s ease ${i*.02}s both`}}>
          <div style={{position:'absolute',left:-19,width:7,height:7,borderRadius:'50%',background:cur?co:C.bd}}/>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:co,fontWeight:700,minWidth:40,flexShrink:0}}>{s.time}</span>
          <span style={{...tg(co,co+'14'),flexShrink:0}}>{s.cat}</span>
          {edId===s.id?<input value={edTx} onChange={e=>sEdTx(e.target.value)} onBlur={()=>saveEd(s.id)} onKeyDown={e=>e.key==='Enter'&&saveEd(s.id)} autoFocus style={inp({flex:1,padding:'4px 8px',minWidth:0})}/>
            :<span onClick={()=>{sEdId(s.id);sEdTx(s.task);}} style={{flex:1,color:C.tx,fontSize:12,cursor:'pointer',fontWeight:450,minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.task}</span>}
          <button onClick={()=>set(data.filter(x=>x.id!==s.id))} style={{background:'none',border:'none',color:C.tx3,cursor:'pointer',opacity:.3,flexShrink:0}}>{IC.trash()}</button>
        </div>);
      })}
    </div>
  </div>);
};

/* ═══ READ LATER ═══ */
const LinksPage=({data,set})=>{
  const[nU,sU]=useState('');const[nT,snT]=useState('');const[nTg,sTg]=useState('');const[nN,sN]=useState('');
  const[ft,sFt]=useState('all');const[sf,sSf]=useState(false);
  const tags=['all',...new Set(data.map(l=>l.tag))];const vis=ft==='all'?data:data.filter(l=>l.tag===ft);
  const add=()=>{if(!nU)return;set([{id:uid(),url:nU,title:nT||nU,tag:nTg||'General',note:nN,read:false},...data]);sU('');snT('');sTg('');sN('');sSf(false);};
  return(<div>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14,flexWrap:'wrap',gap:6}}>
      <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>{tags.map(t=><button key={t} onClick={()=>sFt(t)} style={{padding:'4px 10px',borderRadius:6,border:'none',background:ft===t?C.indigoBg:'transparent',color:ft===t?C.indigo:C.tx3,cursor:'pointer',fontSize:10,fontWeight:700,fontFamily:'inherit',textTransform:'uppercase',letterSpacing:'0.5px'}}>{t}</button>)}</div>
      <button onClick={()=>sSf(!sf)} style={btnP(C.indigo)}>{IC.plus()} Save</button>
    </div>
    {sf&&<div style={{...crd(),padding:14,marginBottom:14,display:'flex',flexDirection:'column',gap:6}}>
      <input value={nU} onChange={e=>sU(e.target.value)} placeholder="URL" style={inp({width:'100%',boxSizing:'border-box'})}/>
      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}><input value={nT} onChange={e=>snT(e.target.value)} placeholder="Title" style={inp({flex:1,minWidth:120})}/><input value={nTg} onChange={e=>sTg(e.target.value)} placeholder="Tag" style={inp({width:80})}/></div>
      <input value={nN} onChange={e=>sN(e.target.value)} placeholder="Note" style={inp({width:'100%',boxSizing:'border-box'})}/>
      <button onClick={add} style={{...btnP(C.indigo),alignSelf:'flex-end'}}>Save</button>
    </div>}
    <div style={{display:'flex',flexDirection:'column',gap:6}}>
      {vis.map((l,i)=><div key={l.id} style={{...crd(),padding:'10px 14px',display:'flex',flexDirection:'column',gap:3,opacity:l.read?.4:1,animation:`fi .15s ease ${i*.02}s both`}}>
        <div style={{display:'flex',alignItems:'center',gap:6,minWidth:0}}>
          <span style={{...tg(C.indigo,C.indigoBg),flexShrink:0}}>{l.tag}</span>
          <a href={l.url} target="_blank" rel="noopener noreferrer" style={{flex:1,color:C.indigo,fontSize:12,textDecoration:'none',fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{l.title}</a>
          <button onClick={()=>set(data.map(x=>x.id===l.id?{...x,read:!x.read}:x))} style={{background:'none',border:'none',color:l.read?C.teal:C.tx3,cursor:'pointer',flexShrink:0}}>{IC.check(14)}</button>
          <button onClick={()=>set(data.filter(x=>x.id!==l.id))} style={{background:'none',border:'none',color:C.tx3,cursor:'pointer',opacity:.4,flexShrink:0}}>{IC.trash()}</button>
        </div>
        {l.note&&<p style={{margin:0,fontSize:10,color:C.tx2}}>{l.note}</p>}
      </div>)}
    </div>
  </div>);
};

/* ═══ APPLICATIONS ═══ */
const AppsPage=({data,set,pop})=>{
  const[sf,sSf]=useState(false);const[nA,sNA]=useState({co:'',ro:'',st:'wishlist',dt:''});
  const sts=['wishlist','applied','interviewing','offer','rejected'];
  const sC={wishlist:C.slate,applied:C.indigo,interviewing:C.amber,offer:C.teal,rejected:C.rose};
  const add=()=>{if(!nA.co)return;set([{id:uid(),...nA},...data]);sNA({co:'',ro:'',st:'wishlist',dt:''});sSf(false);};
  const uSt=(id,st)=>{if(st==='offer')pop?.();set(data.map(a=>a.id===id?{...a,st}:a));};
  const pipe=sts.map(s=>({s,n:data.filter(a=>a.st===s).length,c:sC[s]}));
  return(<div>
    <div style={{display:'flex',gap:2,marginBottom:18,borderRadius:6,overflow:'hidden',flexWrap:'wrap'}}>
      {pipe.map(p=><div key={p.s} style={{flex:Math.max(p.n,.5),background:p.c+'18',padding:'8px 10px',textAlign:'center',minWidth:50}}>
        <div style={{fontSize:14,fontWeight:800,color:p.c}}>{p.n}</div>
        <div style={{fontSize:8,fontWeight:700,color:p.c,textTransform:'uppercase',letterSpacing:'.5px'}}>{p.s}</div>
      </div>)}
    </div>
    <div style={{display:'flex',justifyContent:'flex-end',marginBottom:14}}>
      <button onClick={()=>sSf(!sf)} style={btnP(C.amber)}>{IC.plus()} Track</button>
    </div>
    {sf&&<div style={{...crd(),padding:14,marginBottom:14,display:'flex',flexDirection:'column',gap:6}}>
      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}><input value={nA.co} onChange={e=>sNA({...nA,co:e.target.value})} placeholder="Company" style={inp({flex:1,minWidth:120})}/><input value={nA.ro} onChange={e=>sNA({...nA,ro:e.target.value})} placeholder="Role" style={inp({flex:1,minWidth:120})}/></div>
      <input type="date" value={nA.dt} onChange={e=>sNA({...nA,dt:e.target.value})} style={inp({})}/>
      <button onClick={add} style={{...btnP(C.amber),alignSelf:'flex-end'}}>Add</button>
    </div>}
    <div style={{display:'flex',flexDirection:'column',gap:6}}>
      {data.map((a,i)=><div key={a.id} style={{...crd(),padding:'11px 14px',borderLeft:`3px solid ${sC[a.st]}`,animation:`fi .15s ease ${i*.02}s both`}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:6}}>
          <div style={{minWidth:0}}><span style={{fontSize:13,color:C.tx,fontWeight:700}}>{a.co}</span><span style={{fontSize:11,color:C.tx2,marginLeft:6}}>{a.ro}</span></div>
          <select value={a.st} onChange={e=>uSt(a.id,e.target.value)} style={{padding:'3px 6px',background:sC[a.st]+'10',border:`1px solid ${sC[a.st]}30`,borderRadius:6,color:sC[a.st],fontSize:9,fontWeight:700,textTransform:'uppercase',cursor:'pointer',fontFamily:'inherit'}}>{sts.map(s=><option key={s} value={s}>{s}</option>)}</select>
        </div>
        {a.dt&&<div style={{fontSize:10,color:C.tx3,marginTop:3}}>{a.dt}</div>}
      </div>)}
    </div>
  </div>);
};

/* ═══ LIVE OPENINGS ═══ */
const LivePage=()=>{
  const[q,sQ]=useState('');
  const ops=[{id:1,co:'Google',ro:'SWE Intern 2026',lo:'Bangalore',ty:'Internship',dl:'Apr 15',h:true},{id:2,co:'Amazon',ro:'SDE Intern',lo:'Hyderabad',ty:'Internship',dl:'Apr 1',h:true},{id:3,co:'Microsoft',ro:'SDE Intern',lo:'Noida',ty:'Internship',dl:'Mar 30',h:false},{id:4,co:'Atlassian',ro:'SWE Intern',lo:'Bangalore',ty:'Internship',dl:'Apr 20',h:false},{id:5,co:'Goldman Sachs',ro:'Engineering Analyst',lo:'Bangalore',ty:'Full-time',dl:'May 1',h:true},{id:6,co:'Flipkart',ro:'SDE-1',lo:'Bangalore',ty:'Full-time',dl:'Rolling',h:false},{id:7,co:'Adobe',ro:'SWE Intern',lo:'Noida',ty:'Internship',dl:'Apr 10',h:false},{id:8,co:'Uber',ro:'SWE Intern',lo:'Hyderabad',ty:'Internship',dl:'Apr 5',h:true}];
  const f=ops.filter(o=>{const s=q.toLowerCase();return!s||o.co.toLowerCase().includes(s)||o.ro.toLowerCase().includes(s)||o.lo.toLowerCase().includes(s);});
  return(<div>
    <div style={{position:'relative',marginBottom:14}}><span style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:C.tx3}}>{IC.search()}</span><input value={q} onChange={e=>sQ(e.target.value)} placeholder="Search openings..." style={inp({width:'100%',boxSizing:'border-box',paddingLeft:32})}/></div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:8}}>
      {f.map((o,i)=><div key={o.id} style={{...crd(),padding:14,borderLeft:o.h?`3px solid ${C.rust}`:`1px solid ${C.bd}`,animation:`fi .15s ease ${i*.02}s both`}}>
        {o.h&&<div style={{...tg(C.rust,C.rustBg),marginBottom:6}}>High demand</div>}
        <h4 style={{margin:'0 0 2px',fontSize:13,fontWeight:700,color:C.tx}}>{o.co}</h4>
        <p style={{margin:'0 0 6px',fontSize:11,color:C.tx2}}>{o.ro}</p>
        <div style={{display:'flex',gap:4,flexWrap:'wrap'}}><span style={tg(C.tx2,C.slateBg)}>{o.lo}</span><span style={tg(o.ty==='Internship'?C.indigo:C.teal,o.ty==='Internship'?C.indigoBg:C.tealBg)}>{o.ty}</span><span style={tg(C.tx2,C.slateBg)}>Due {o.dl}</span></div>
      </div>)}
    </div>
  </div>);
};

/* ═══ COMMUNICATION ═══ */
const CommPage=({notes,setNotes})=>{
  const res=[{c:'Interview Prep',items:['STAR method practice','2-minute self introduction','Behavioral Q&A frameworks','Technical explanation drills'],co:C.rust},{c:'Email Writing',items:['Professional email templates','Interview follow-up format','Cold recruiter outreach','Thank-you note structure'],co:C.indigo},{c:'Presentation',items:['Project demo structure','3-minute hackathon pitch','30-second elevator pitch','Technical talk delivery'],co:C.teal},{c:'Networking',items:['LinkedIn outreach templates','Coffee chat requests','Alumni connection format','Conference approach strategy'],co:C.amber}];
  return(<div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:10,marginBottom:18}}>
      {res.map((r,i)=><div key={i} style={{...crd(),padding:16,borderTop:`3px solid ${r.co}`,animation:`fi .2s ease ${i*.05}s both`}}>
        <div style={{fontSize:10,fontWeight:700,color:r.co,marginBottom:10,textTransform:'uppercase',letterSpacing:'0.5px'}}>{r.c}</div>
        {r.items.map((it,ii)=><div key={ii} style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:C.tx2,marginBottom:5}}><div style={{width:3,height:3,borderRadius:'50%',background:r.co,flexShrink:0}}/>{it}</div>)}
      </div>)}
    </div>
    <div style={{...crd(),padding:16}}>
      <div style={{fontSize:10,fontWeight:700,color:C.tx2,marginBottom:6,textTransform:'uppercase',letterSpacing:'0.5px'}}>Practice Notes</div>
      <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Mock interview feedback, areas to improve..." rows={5} style={inp({width:'100%',boxSizing:'border-box',resize:'vertical',lineHeight:1.6})}/>
    </div>
  </div>);
};

/* ═══ SKILLS ═══ */
const SkillsPage=({data,set,pop})=>{
  const[ns,sNs]=useState('');const[fil,sFil]=useState('all');const[sa,sSa]=useState(false);
  const sC={completed:{c:C.teal,l:'Done'},'in-progress':{c:C.amber,l:'Learning'},'not-started':{c:C.slate,l:'Planned'}};
  const add=()=>{if(!ns.trim())return;set([...data,{id:uid(),nm:ns.trim(),lv:0,st:'not-started'}]);sNs('');sSa(false);};
  const uLv=(id,d)=>{set(data.map(s=>{if(s.id!==id)return s;const nl=Math.max(0,Math.min(100,s.lv+d));if(nl>=80&&s.lv<80)pop?.();return{...s,lv:nl,st:nl>=80?'completed':nl>0?'in-progress':'not-started'};}));};
  const cyc=id=>{const o=['not-started','in-progress','completed'];set(data.map(s=>{if(s.id!==id)return s;const n=o[(o.indexOf(s.st)+1)%3];if(n==='completed')pop?.();return{...s,st:n};}));};
  const vis=fil==='all'?data:data.filter(s=>s.st===fil);
  const avg=Math.round(data.reduce((a,s)=>a+s.lv,0)/(data.length||1));
  const chartD=data.slice(0,8).map(s=>({l:s.nm.substring(0,5),v:s.lv}));
  return(<div>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14,flexWrap:'wrap',gap:8}}>
      <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
        <Ring val={avg} max={100} color={C.rust} size={56} label="Avg"/>
        <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>
          {['all','completed','in-progress','not-started'].map(f=><button key={f} onClick={()=>sFil(f)} style={{padding:'4px 10px',borderRadius:6,border:'none',background:fil===f?C.rustBg:'transparent',color:fil===f?C.rust:C.tx3,cursor:'pointer',fontSize:9,fontWeight:700,fontFamily:'inherit',textTransform:'uppercase',letterSpacing:'.5px'}}>{f==='all'?'All':sC[f]?.l||f}</button>)}
        </div>
      </div>
      <button onClick={()=>sSa(!sa)} style={btnP(C.indigo)}>{IC.plus()} Skill</button>
    </div>
    {sa&&<div style={{display:'flex',gap:6,marginBottom:14,flexWrap:'wrap'}}><input value={ns} onChange={e=>sNs(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()} placeholder="Skill name" style={inp({flex:1,minWidth:140})}/><button onClick={add} style={btnP(C.indigo)}>Add</button></div>}
    {chartD.length>0&&<div style={{...crd(),padding:'10px 14px',marginBottom:14}}><Bars data={chartD} color={C.indigo} h={70} label="Skill levels"/></div>}
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:8}}>
      {vis.map((s,i)=>{const cf=sC[s.st];return(<div key={s.id} style={{...crd(),padding:14,animation:`fi .15s ease ${i*.02}s both`}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <span style={{fontSize:12,color:C.tx,fontWeight:700,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.nm}</span>
          <button onClick={()=>cyc(s.id)} style={{...tg(cf.c,cf.c+'14'),cursor:'pointer',border:'none',fontFamily:'inherit',flexShrink:0}}>{cf.l}</button>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <div style={{flex:1,height:5,borderRadius:3,background:C.bd,overflow:'hidden'}}><div style={{height:'100%',width:`${s.lv}%`,borderRadius:3,background:cf.c,transition:'width .3s'}}/></div>
          <span style={{fontSize:10,color:C.tx2,fontWeight:700,minWidth:26,textAlign:'right'}}>{s.lv}%</span>
        </div>
        <div style={{display:'flex',gap:4,marginTop:8}}>
          <button onClick={()=>uLv(s.id,-10)} style={{padding:'3px 8px',background:C.sfA,border:`1px solid ${C.bd}`,borderRadius:5,color:C.tx2,cursor:'pointer',fontSize:9,fontFamily:'inherit'}}>-10</button>
          <button onClick={()=>uLv(s.id,10)} style={{padding:'3px 8px',background:C.rustBg,border:'none',borderRadius:5,color:C.rust,cursor:'pointer',fontSize:9,fontWeight:600,fontFamily:'inherit'}}>+10</button>
          <button onClick={()=>uLv(s.id,25)} style={{padding:'3px 8px',background:C.tealBg,border:'none',borderRadius:5,color:C.teal,cursor:'pointer',fontSize:9,fontWeight:600,fontFamily:'inherit'}}>+25</button>
          <div style={{flex:1}}/>
          <button onClick={()=>set(data.filter(x=>x.id!==s.id))} style={{background:'none',border:'none',color:C.tx3,cursor:'pointer',opacity:.3}}>{IC.trash()}</button>
        </div>
      </div>);})}
    </div>
  </div>);
};

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  const[pg,sPg]=useState('dash');
  const[sb,sSb]=useState(false);
  const[conf,sConf]=useState(0);
  const[mob,sMob]=useState(false);

  const[tasks,setTasks]=usePersist('sb_tasks',[
    {id:'t1',tx:'Revise DSA — LinkedList problems',done:false,pri:'high',dt:'2026-03-25'},
    {id:'t2',tx:'Submit JPMorgan application docs',done:false,pri:'high',dt:'2026-03-24'},
    {id:'t3',tx:'Practice System Design basics',done:true,pri:'medium',dt:'2026-03-23',doneAt:'2026-03-25'},
    {id:'t4',tx:'Read Obsidian plugin docs',done:false,pri:'low',dt:'2026-03-25'},
  ]);
  const[journal,setJournal]=usePersist('sb_journal',[
    {id:'j1',title:'First day of structured prep',body:'Started with 2 hours of DSA. Solved 3 LeetCode problems on arrays. Feeling confident about the approach but need to work on time complexity analysis.\n\nKey insight: Understanding the problem deeply before coding saves more time than jumping straight in.',mood:'Good',tags:['DSA','career'],dt:'2026-03-25',crAt:new Date().toISOString()},
    {id:'j2',title:'Hackathon ideas brainstorm',body:'Spent the evening brainstorming project ideas. Thinking about building something around accessibility — maybe an AI tool that converts complex text to simpler language.',mood:'Great',tags:['hackathon','projects'],dt:'2026-03-24',crAt:new Date().toISOString()},
  ]);
  const[events,setEvents]=usePersist('sb_events',[
    {id:'e1',title:'DSA Mock Interview',date:'2026-03-26',time:'10:00'},
    {id:'e2',title:'JPMorgan Deadline',date:'2026-03-28',time:'23:59'},
    {id:'e3',title:'College Lab Session',date:'2026-03-27',time:'14:00'},
  ]);
  const[schedule,setSchedule]=usePersist('sb_sched',[
    {id:'s1',time:'06:00',task:'Wake up and morning routine',cat:'personal'},
    {id:'s2',time:'07:00',task:'DSA Practice on LeetCode',cat:'study'},
    {id:'s3',time:'09:00',task:'College lectures',cat:'college'},
    {id:'s4',time:'13:00',task:'Lunch break',cat:'personal'},
    {id:'s5',time:'14:00',task:'Lab and project work',cat:'college'},
    {id:'s6',time:'17:00',task:'Resume and applications',cat:'career'},
    {id:'s7',time:'19:00',task:'Java revision',cat:'study'},
    {id:'s8',time:'21:00',task:'Plan next day',cat:'personal'},
    {id:'s9',time:'22:30',task:'Wind down',cat:'personal'},
  ]);
  const[links,setLinks]=usePersist('sb_links',[
    {id:'l1',url:'https://leetcode.com/problems/group-anagrams/',title:'LeetCode: Group Anagrams',tag:'DSA',note:'HashMap approach',read:false},
    {id:'l2',url:'https://roadmap.sh/java',title:'Java Developer Roadmap',tag:'Career',note:'Next steps overview',read:false},
  ]);
  const[apps,setApps]=usePersist('sb_apps',[
    {id:'a1',co:'JPMorgan Chase',ro:'SWE Program 2027',st:'applied',dt:'2026-03-20'},
    {id:'a2',co:'Google',ro:'SWE Intern 2026',st:'wishlist',dt:''},
    {id:'a3',co:'Microsoft',ro:'SDE Intern',st:'interviewing',dt:'2026-03-10'},
  ]);
  const[skills,setSkills]=usePersist('sb_skills',[
    {id:'sk1',nm:'Java',lv:80,st:'in-progress'},
    {id:'sk2',nm:'Data Structures',lv:65,st:'in-progress'},
    {id:'sk3',nm:'Python',lv:70,st:'completed'},
    {id:'sk4',nm:'React',lv:45,st:'in-progress'},
    {id:'sk5',nm:'SQL',lv:60,st:'in-progress'},
    {id:'sk6',nm:'Git',lv:75,st:'completed'},
    {id:'sk7',nm:'System Design',lv:25,st:'in-progress'},
    {id:'sk8',nm:'ML',lv:40,st:'in-progress'},
  ]);
  const[commNotes,setCommNotes]=usePersist('sb_comm','');

  useEffect(()=>{const c=()=>sMob(window.innerWidth<768);c();window.addEventListener('resize',c);return()=>window.removeEventListener('resize',c);},[]);
  const pop=useCallback(()=>sConf(c=>c+1),[]);

  const PG={
    dash:()=><Dashboard tasks={tasks} journal={journal} skills={skills} apps={apps}/>,
    todo:()=><Tasks tasks={tasks} set={setTasks} pop={pop}/>,
    journal:()=><Journal entries={journal} set={setJournal}/>,
    cal:()=><CalPage events={events} set={setEvents}/>,
    sched:()=><SchedPage data={schedule} set={setSchedule}/>,
    links:()=><LinksPage data={links} set={setLinks}/>,
    apps:()=><AppsPage data={apps} set={setApps} pop={pop}/>,
    live:()=><LivePage/>,
    comm:()=><CommPage notes={commNotes} setNotes={setCommNotes}/>,
    skills:()=><SkillsPage data={skills} set={setSkills} pop={pop}/>,
  };
  const Page=PG[pg];const nav=NAV.find(n=>n.k===pg);

  return(<div style={{fontFamily:"'DM Sans',sans-serif",minHeight:'100vh',background:C.bg,color:C.tx}}>
    <Confetti n={conf}/>
    {sb&&<div onClick={()=>sSb(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.12)',zIndex:40}}/>}
    <aside style={{position:'fixed',left:0,top:0,bottom:0,width:mob?240:210,background:C.sf,borderRight:`1px solid ${C.bd}`,zIndex:50,padding:'14px 0',display:'flex',flexDirection:'column',transform:sb?'translateX(0)':mob?'translateX(-100%)':'translateX(0)',transition:'transform .25s ease',boxShadow:'1px 0 10px rgba(0,0,0,.03)',overflowY:'auto',WebkitOverflowScrolling:'touch'}}>
      <div style={{padding:'0 16px',marginBottom:20}}>
        <h1 style={{margin:0,fontSize:14,fontWeight:800,color:C.tx,letterSpacing:'-.3px'}}>Second Brain</h1>
        <p style={{margin:'2px 0 0',fontSize:9,color:C.tx3,fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase'}}>Pritee&apos;s Workspace</p>
      </div>
      <nav style={{flex:1,padding:'0 6px'}}>
        {NAV.map(n=>{const a=pg===n.k;return(<button key={n.k} onClick={()=>{sPg(n.k);sSb(false);}} style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'8px 10px',marginBottom:1,borderRadius:6,border:'none',background:a?C.rustBg:'transparent',color:a?C.rust:C.tx2,cursor:'pointer',fontSize:12,fontWeight:a?700:500,textAlign:'left',fontFamily:'inherit'}}>{n.i()}{n.l}</button>);})}
      </nav>
      <div style={{padding:'10px 16px',borderTop:`1px solid ${C.bd}`,fontSize:9,color:C.tx3,fontWeight:500}}>Auto-saved</div>
    </aside>
    <main style={{marginLeft:mob?0:210,minHeight:'100vh'}}>
      <header style={{padding:'10px 16px',display:'flex',alignItems:'center',gap:10,borderBottom:`1px solid ${C.bd}`,background:'rgba(245,243,239,.92)',backdropFilter:'blur(8px)',position:'sticky',top:0,zIndex:10}}>
        {mob&&<button onClick={()=>sSb(true)} style={{background:'none',border:'none',color:C.tx2,cursor:'pointer',padding:2}}>{IC.menu()}</button>}
        <h2 style={{margin:0,fontSize:15,fontWeight:700,color:C.tx,letterSpacing:'-.2px'}}>{nav?.l}</h2>
        <div style={{flex:1}}/>
        <div style={{fontSize:9,color:C.tx3,fontWeight:500}}>{new Date().toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})}</div>
      </header>
      <div style={{padding:mob?14:22,maxWidth:900,margin:'0 auto',paddingBottom:50}}><Page/></div>
    </main>
  </div>);
}
