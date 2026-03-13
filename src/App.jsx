import React, { useState, useEffect, useRef } from "react";


import * as XLSXLib from "xlsx";
const loadXLSX = () => Promise.resolve(XLSXLib);

const QUESTION_BANK = [
  { id:1, question:"Why is a software defect called a 'bug'?",
    options:["Because it is a playful metaphor with no historical basis","Because the first software company was named BugSoft","Because programmers always call defects 'bugs'","Because early software defects were caused by insects trapped in hardware"],
    answer:3, fact:"A moth was found in Harvard Mark II in 1947 — the first actual 'bug'!" },

  { id:2, question:"Why is a quick system check called 'Smoke Testing'?",
    options:["Because in hardware, initial power-on tests looked for actual smoke from circuits","Because it checks the system for bugs","Because it runs every test case quickly","Because it smokes out software errors"],
    answer:0, fact:"Engineers powered on circuits and literally watched for smoke — now it means a quick sanity check." },

  { id:3, question:"Which famous space mission failed due to a software error?",
    options:["Mars Climate Orbiter","Hubble Space Telescope","Voyager 2","Apollo 13"],
    answer:0, fact:"NASA lost the Mars Climate Orbiter in 1999 due to a units mismatch (pounds vs newtons)." },

  { id:4, question:"What is the 'Pesticide Paradox' in software testing?",
    options:["Bugs in software multiply like pests","Testers can become immune to errors over time","Running the same tests repeatedly eventually stops finding new defects","Using test automation decreases bugs"],
    answer:2, fact:"Just like pests become resistant to pesticides, repeated test cases stop catching new defects." },

  { id:5, question:"Which company accidentally deleted their production database live in 2017?",
    options:["Amazon","GitLab","Microsoft","Google"],
    answer:1, fact:"GitLab live-streamed their recovery attempt — a now-legendary lesson in backups." },

  { id:6, question:"Which airline had a bug that caused $0 ticket prices?",
    options:["Lufthansa","Delta Airlines","Air India","United Airlines"],
    answer:3, fact:"In 2013, United Airlines' pricing bug let customers book free flights!" },

  { id:7, question:"What is the main purpose of ISTQB certification?",
    options:["Guarantee a job","Standardize testing knowledge worldwide","Replace practical experience","Eliminate the need for training"],
    answer:1, fact:"ISTQB is globally recognized and standardizes QA terminology and principles." },

  { id:8, question:"What is the primary principle behind 'Early Testing'?",
    options:["Finding defects early is cheaper and faster than finding them later","Testers should write the code themselves","Testing should only begin after development is complete","Early testing replaces the need for unit tests"],
    answer:0, fact:"The cost of fixing a bug grows exponentially the later it is found in the SDLC." },

  { id:9, question:"Which of these was the most expensive software bug collectively?",
    options:["Mars Climate Orbiter only","Knight Capital trading bug only","Ariane 5 Flight 501 only","All of the above caused massive financial losses"],
    answer:3, fact:"Ariane 5 ($370M), Knight Capital ($440M), and Mars Orbiter — all catastrophic bugs." },

  { id:10, question:"In software testing, what does 'Regression Testing' mean?",
    options:["A statistical method to find performance issues","Testing done to verify that recent changes didn't break existing functionality","Testing done only by end users","Testing brand-new features for the first time"],
    answer:1, fact:"Regression testing ensures old features still work after new code is introduced." },

  { id:11, question:"In ISTQB, what is the correct order of the fundamental test process?",
    options:["Analysis → Planning → Design → Execution → Closure","Design → Planning → Analysis → Execution → Closure","Planning → Analysis → Design → Implementation → Execution → Closure","Planning → Execution → Analysis → Design → Closure"],
    answer:2, fact:"ISTQB process: Test Planning → Monitoring & Control → Analysis → Design → Implementation → Execution → Completion." },

  { id:12, question:"What is the difference between 'Re-testing' and 'Regression Testing'?",
    options:["They are the same thing with different names","Re-testing is done in staging; regression testing in production","Re-testing confirms a specific defect is fixed; regression testing checks nothing else broke","Re-testing is automated; regression testing is manual"],
    answer:2, fact:"Re-test the fix first, then regress surrounding functionality to ensure nothing else broke." },

  { id:13, question:"A tester logs a defect. The developer says 'It\'s working as designed.' What should happen next?",
    options:["The defect is escalated to a joint review involving business/product owner to decide","The tester closes the defect immediately","The developer automatically wins the dispute","The QA manager overrides and reopens it"],
    answer:0, fact:"Neither tester nor developer has sole authority. A product owner review decides whether the requirement was correct." },

  { id:14, question:"What is 'Negative Testing'?",
    options:["Writing test cases that are expected to fail","Testing the system with invalid, unexpected, or out-of-range inputs to verify it handles them gracefully","Testing that produces negative results","Testing to find what the system cannot do"],
    answer:1, fact:"Negative Testing validates that the system handles invalid inputs gracefully — e.g. entering letters in a numeric field." },

  { id:15, question:"What is the PRIMARY difference between 'Alpha Testing' and 'Beta Testing'?",
    options:["Alpha is done before coding; Beta is done after release","Alpha is functional testing; Beta is performance testing","Alpha is automated; Beta is manual","Alpha is performed by developers in-house; Beta is performed by real end-users in their environment"],
    answer:3, fact:"Alpha is internal in a controlled setting. Beta is by real end-users in their own environment. Alpha always precedes Beta." },

  { id:16, question:"What is 'Usability Testing'?",
    options:["Testing that users have valid licenses to use the software","Testing whether the software can be installed without errors","Testing whether the software is easy to use, intuitive, and user-friendly","Testing the software under heavy user load"],
    answer:2, fact:"Usability Testing evaluates ease-of-use from a real user's perspective — navigation, task completion, error messages." },

  { id:17, question:"Which of the following is an example of 'Non-Functional Testing'?",
    options:["Testing that the website loads within 2 seconds under normal traffic","Testing that a user can successfully place an order","Testing that the logout button redirects to the home page","Testing that the payment gateway correctly calculates totals"],
    answer:0, fact:"Non-Functional Testing checks HOW WELL the system performs — performance, security, scalability, usability." },

  { id:18, question:"Which of the following BEST describes 'Static Testing'?",
    options:["Testing done on a static/staging server before production deployment","Reviewing documents, requirements, and code WITHOUT executing the software","Testing applications that don't have any animations or moving elements","Testing that the software works correctly when no user is actively using it"],
    answer:1, fact:"Static Testing reviews work products without running the software — code reviews, walkthroughs, inspections." },

  { id:19, question:"What is a 'Blocker' defect?",
    options:["A low-priority defect that is blocking the defect backlog","A defect that blocks a developer from writing new code","A defect so severe it prevents the entire build from being tested or the system from functioning","A defect that is blocked from being fixed due to technical complexity"],
    answer:2, fact:"A Blocker completely prevents testing — e.g. app won't launch or login is broken. Must be fixed before testing can continue." },

  { id:20, question:"What is the MOST important skill for a beginner software tester to develop first?",
    options:["Mastering JIRA, Zephyr, and TestRail immediately","Memorizing every ISTQB glossary term and definition word-for-word","Developing attention to detail and critical thinking to notice unexpected behavior systematically","Learning Selenium WebDriver and writing automation scripts from day one"],
    answer:2, fact:"Attention to detail and critical thinking are the foundation of great testing — tools and certifications come after." },
];

const TIMER_SECONDS = 35;
const STORAGE_KEY = "nstqb_participants_v3";
const ADMIN_PASSWORD = "Nstqb_2026";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const buf = new Uint32Array(1);
    window.crypto.getRandomValues(buf);
    const j = buf[0] % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick 10 random questions from bank, shuffle each question's options
function buildShuffledQuestions() {
  const picked = shuffle(QUESTION_BANK).slice(0, 10);
  return picked.map(q => {
    const indexed = q.options.map((opt, i) => ({ opt, isCorrect: i === q.answer }));
    const shuffled = shuffle(indexed);
    return { ...q, options: shuffled.map(o => o.opt), answer: shuffled.findIndex(o => o.isCorrect) };
  });
}

async function loadParticipants() {
  try {
    const result = await window.storage.get(STORAGE_KEY, true);
    return result ? JSON.parse(result.value) : [];
  } catch { return []; }
}

async function saveParticipant(data) {
  try {
    const list = await loadParticipants();
    list.push(data);
    await window.storage.set(STORAGE_KEY, JSON.stringify(list), true);
  } catch(e) { console.error("Storage error:", e); }
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
function Confetti() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    c.width = window.innerWidth; c.height = window.innerHeight;
    const pieces = Array.from({length:130}, () => ({
      x:Math.random()*c.width, y:Math.random()*-200,
      w:Math.random()*10+6, h:Math.random()*16+8,
      color:["#FFD700","#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FFEAA7","#DDA0DD"][Math.floor(Math.random()*7)],
      rot:Math.random()*360, vx:(Math.random()-.5)*2, vy:Math.random()*3+2, vr:(Math.random()-.5)*6
    }));
    let fr;
    const go = () => {
      ctx.clearRect(0,0,c.width,c.height);
      pieces.forEach(p => {
        ctx.save(); ctx.translate(p.x+p.w/2,p.y+p.h/2); ctx.rotate(p.rot*Math.PI/180);
        ctx.fillStyle=p.color; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); ctx.restore();
        p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr;
        if(p.y>c.height){p.y=-20;p.x=Math.random()*c.width;}
      });
      fr=requestAnimationFrame(go);
    };
    go(); return ()=>cancelAnimationFrame(fr);
  },[]);
  return <canvas ref={ref} style={{position:"fixed",top:0,left:0,pointerEvents:"none",zIndex:100}} />;
}

// ─── Timer Ring ───────────────────────────────────────────────────────────────
function TimerRing({ timeLeft, total }) {
  const r = 26, circ = 2 * Math.PI * r;
  const pct = timeLeft / total;
  const color = timeLeft > 15 ? "#4ade80" : timeLeft > 8 ? "#facc15" : "#f87171";
  return (
    <div style={{position:"relative",width:68,height:68,flexShrink:0}}>
      <svg width={68} height={68} style={{transform:"rotate(-90deg)"}}>
        <circle cx={34} cy={34} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={5}/>
        <circle cx={34} cy={34} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={circ} strokeDashoffset={circ*(1-pct)}
          style={{transition:"stroke-dashoffset 1s linear, stroke 0.3s"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
        fontWeight:800,fontSize:"1.1rem",color,fontFamily:"monospace"}}>
        {timeLeft}
      </div>
    </div>
  );
}

// ─── Admin Panel ──────────────────────────────────────────────────────────────
function AdminPanel({ onBack }) {
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  const login = () => {
    if (pass === ADMIN_PASSWORD) {
      setAuthed(true); setLoading(true);
      loadParticipants().then(list => { setParticipants(list); setLoading(false); });
    } else { setError("Incorrect password. Try again."); }
  };

  const downloadExcel = async () => {
    const XLSX = await loadXLSX();
    const rows = participants.map((p,i) => ({
      "#": i+1, "Full Name": p.name, "Email": p.email,
      "Organization": p.organization || "—",
      "Score": `${p.score}/10`,
      "Result": p.score >= 7 ? "PASS" : "FAIL",
      "Submission Date": new Date(p.date).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [{wch:4},{wch:22},{wch:28},{wch:22},{wch:8},{wch:8},{wch:22}];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Participants");
    const total = participants.length;
    const passed = participants.filter(p=>p.score>=7).length;
    const avg = total ? (participants.reduce((a,p)=>a+p.score,0)/total).toFixed(1) : 0;
    const ws2 = XLSX.utils.json_to_sheet([
      {"Metric":"Total Participants","Value":total},
      {"Metric":"Passed (≥7/10)","Value":passed},
      {"Metric":"Failed (<7/10)","Value":total-passed},
      {"Metric":"Pass Rate","Value":total?`${Math.round(passed/total*100)}%`:"0%"},
      {"Metric":"Average Score","Value":avg},
      {"Metric":"Report Generated","Value":new Date().toLocaleString()},
    ]);
    ws2["!cols"]=[{wch:22},{wch:20}];
    XLSX.utils.book_append_sheet(wb, ws2, "Summary");
    XLSX.writeFile(wb, `NSTQB_Quiz_Results_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const deleteRecord = async (recordDate) => {
    if (!window.confirm("Delete this record?")) return;
    const updated = participants.filter(p => p.date !== recordDate);
    setParticipants(updated);
    await window.storage.set(STORAGE_KEY, JSON.stringify(updated), true);
  };

  const clearAll = async () => {
    if (!window.confirm("Delete ALL records? This cannot be undone.")) return;
    setParticipants([]);
    await window.storage.set(STORAGE_KEY, JSON.stringify([]), true);
  };

  const sorted = [...participants].sort((a,b)=>b.score-a.score);

  if (!authed) return (
    <div style={S.bg}>
      <div style={{...S.card, maxWidth:420}}>
        <div style={S.cardHeader}>
          <span style={S.headerIcon}>🔐</span>
          <h2 style={S.cardTitle}>Admin Access</h2>
          <p style={S.cardSub}>Enter admin password to continue</p>
        </div>
        <div style={S.field}>
          <label style={S.label}>Password</label>
          <input type="password" placeholder="Enter admin password" value={pass}
            onChange={e=>{setPass(e.target.value);setError("");}}
            onKeyDown={e=>e.key==="Enter"&&login()}
            style={{...S.input,...(error?S.inputError:{})}} />
          {error && <span style={S.errorMsg}>{error}</span>}
        </div>
        <button style={S.btn} onClick={login}>Unlock →</button>
        <button style={{...S.btnSecondary,marginTop:"0.75rem",width:"100%"}} onClick={onBack}>← Back</button>
      </div>
    </div>
  );

  return (
    <div style={S.bg}>
      <div style={{...S.card, maxWidth:880}}>
        <div style={S.cardHeader}>
          <span style={S.headerIcon}>📊</span>
          <h2 style={S.cardTitle}>Admin Dashboard</h2>
          <p style={S.cardSub}>NSTQB Quiz — Participant Results</p>
        </div>
        <div style={S.statsRow}>
          {[
            {label:"Total",value:participants.length,icon:"👥",color:"#e2e8f0"},
            {label:"Passed",value:participants.filter(p=>p.score>=7).length,icon:"✅",color:"#4ade80"},
            {label:"Failed",value:participants.filter(p=>p.score<7).length,icon:"❌",color:"#f87171"},
            {label:"Avg Score",value:participants.length?(participants.reduce((a,p)=>a+p.score,0)/participants.length).toFixed(1):"—",icon:"📈",color:"#a78bfa"},
          ].map((s,i)=>(
            <div key={i} style={S.statBox}>
              <span style={{fontSize:"1.5rem"}}>{s.icon}</span>
              <span style={{...S.statVal,color:s.color}}>{s.value}</span>
              <span style={S.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:"0.75rem",marginTop:"0.5rem"}}>
          <button style={{...S.downloadBtn,flex:1,marginTop:0}} onClick={downloadExcel} disabled={participants.length===0}>
            ⬇️ Download Excel Report (.xlsx)
          </button>
          <button style={{background:"rgba(248,113,113,0.15)",border:"1px solid rgba(248,113,113,0.3)",borderRadius:"0.75rem",color:"#f87171",cursor:"pointer",fontWeight:700,fontSize:"0.88rem",padding:"0 1.25rem",whiteSpace:"nowrap"}} onClick={clearAll} disabled={participants.length===0}>
            🗑️ Clear All
          </button>
        </div>
        {loading ? (
          <p style={{color:"#94a3b8",textAlign:"center",padding:"2rem"}}>Loading data…</p>
        ) : sorted.length===0 ? (
          <p style={{color:"#94a3b8",textAlign:"center",padding:"2rem"}}>No participants yet.</p>
        ) : (
          <div style={{overflowX:"auto",marginTop:"1.5rem"}}>
            <div style={{...S.tableHeader,gridTemplateColumns:"30px 1fr 1.2fr 1fr 55px 70px 90px 50px"}}>
              <span>#</span><span>Name</span><span>Email</span><span>Org</span><span>Score</span><span>Result</span><span>Date</span><span></span>
            </div>
            {sorted.map((p,i)=>(
              <div key={i} style={{...S.tableRow,background:i%2===0?"rgba(255,255,255,0.03)":"transparent",gridTemplateColumns:"30px 1fr 1.2fr 1fr 55px 70px 90px 50px"}}>
                <span style={{color:"#64748b",fontWeight:700}}>{i+1}</span>
                <span style={{color:"#e2e8f0",fontWeight:600}}>{p.name}</span>
                <span style={{color:"#94a3b8",fontSize:"0.82rem"}}>{p.email}</span>
                <span style={{color:"#94a3b8"}}>{p.organization||"—"}</span>
                <span style={{color:p.score>=7?"#4ade80":"#f87171",fontWeight:700}}>{p.score}/10</span>
                <span style={{fontSize:"0.8rem"}}>{p.score>=7?"✅ PASS":"❌ FAIL"}</span>
                <span style={{color:"#64748b",fontSize:"0.75rem"}}>{new Date(p.date).toLocaleDateString()}</span>
                <button onClick={()=>deleteRecord(p.date)} style={{background:"rgba(248,113,113,0.15)",border:"1px solid rgba(248,113,113,0.3)",borderRadius:"0.4rem",color:"#f87171",cursor:"pointer",fontSize:"0.8rem",padding:"0.25rem 0.5rem"}}>🗑️</button>
              </div>
            ))}
          </div>
        )}
        <button style={{...S.btnSecondary,marginTop:"1.5rem"}} onClick={onBack}>← Back to Quiz</button>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("register");
  const [shuffledQs, setShuffledQs] = useState(() => buildShuffledQuestions());
  const [user, setUser] = useState({name:"",email:"",organization:""});
  const [errors, setErrors] = useState({});
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const timerRef = useRef(null);

  const q = shuffledQs[current];

  // Timer logic
  useEffect(() => {
    if (screen !== "quiz" || revealed) return;
    setTimeLeft(TIMER_SECONDS);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          // Time's up — auto reveal with no answer selected
          setRevealed(true);
          setAnswers(prev => ({ ...prev, [current]: -1 }));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [current, screen, animKey]);

  const validate = () => {
    const e={};
    if (!user.name.trim()) e.name="Name is required";
    if (!user.email.trim()) e.email="Email is required";
    else if (!/\S+@\S+\.\S+/.test(user.email)) e.email="Invalid email";
    return e;
  };

  const handleRegister = () => {
    const e = validate();
    if (Object.keys(e).length){setErrors(e);return;}
    setScreen("quiz");
  };

  const handleSelect = (idx) => {
    if (revealed) return;
    clearInterval(timerRef.current);
    setSelected(idx); setRevealed(true);
    setAnswers(prev=>({...prev,[current]:idx}));
  };

  const handleNext = async () => {
    if (current < shuffledQs.length - 1) {
      setCurrent(c=>c+1); setSelected(null); setRevealed(false); setAnimKey(k=>k+1);
    } else {
      const all = {...answers,[current]: selected === null ? -1 : selected};
      const final = Object.entries(all).reduce((acc,[qi,ai])=>acc+(shuffledQs[Number(qi)].answer===ai?1:0),0);
      setScore(final); setSaving(true);
      await saveParticipant({name:user.name,email:user.email,organization:user.organization,score:final,date:new Date().toISOString()});
      setSaving(false); setScreen("result");
    }
  };

  const handleRetry = () => {
    clearInterval(timerRef.current);
    setShuffledQs(buildShuffledQuestions());
    setCurrent(0);setAnswers({});setSelected(null);setRevealed(false);
    setScore(0);setAnimKey(0);setTimeLeft(TIMER_SECONDS);setScreen("quiz");
  };

  if (screen==="admin") return <AdminPanel onBack={()=>setScreen("register")} />;

  if (screen==="result") {
    const passed = score>=7;
    return (
      <div style={S.bg}>
        {passed && <Confetti />}
        <div style={{...S.card,textAlign:"center"}}>
          <div style={{fontSize:"5rem",marginBottom:"1rem"}}>{passed?"🎉":"📚"}</div>
          <h2 style={{...S.cardTitle,fontSize:"2rem"}}>{passed?"Well Done!":"Keep Practicing!"}</h2>
          <p style={{color:"#94a3b8",margin:"0.5rem 0 2rem"}}>
            {user.name}, you scored <span style={{color:passed?"#4ade80":"#f87171",fontWeight:700,fontSize:"1.4rem"}}>{score}/10</span>
          </p>
          {passed ? (
            <div style={S.rewardBox}>
              <div style={{fontSize:"2.5rem",marginBottom:"0.5rem"}}>🏅</div>
              <h3 style={{color:"#FFD700",margin:0}}>We have something for you!</h3>
              <p style={{color:"#cbd5e1",marginTop:"0.5rem",fontSize:"0.9rem"}}>
                Congratulations! You've demonstrated excellent NSTQB knowledge. Please claim your reward at the event desk. 🎁
              </p>
            </div>
          ) : (
            <div style={S.encourageBox}>
              <p style={{color:"#94a3b8",margin:0}}>You need 7/10 to pass. Review the ISTQB materials and try again — you're almost there!</p>
            </div>
          )}
          {saving && <p style={{color:"#64748b",fontSize:"0.85rem",marginBottom:"1rem"}}>💾 Saving your result…</p>}
          <div style={{display:"flex",gap:"1rem",justifyContent:"center",marginTop:"1rem",flexWrap:"wrap"}}>
            <button style={S.btn} onClick={handleRetry}>Try Again</button>
            <button style={S.btnSecondary} onClick={()=>{setScreen("register");setUser({name:"",email:"",organization:""});}}>Home</button>
          </div>
        </div>
      </div>
    );
  }

  if (screen==="quiz") {
    const progress = (current / shuffledQs.length) * 100;
    const timedOut = timeLeft === 0 && revealed && selected === null;
    return (
      <div style={S.bg}>
        <div style={S.progressWrap}><div style={{...S.progressBar,width:`${progress}%`}} /></div>
        <div style={S.quizMeta}>
          <span style={{color:"#94a3b8"}}>Question {current+1} of {shuffledQs.length}</span>
          <span style={{color:"#64748b"}}>{user.name}</span>
        </div>
        <div key={animKey} style={S.quizCard}>
          {/* Header row: Q badge + timer */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"}}>
            <div style={S.qNumber}>Q{current+1}</div>
            <TimerRing timeLeft={timeLeft} total={TIMER_SECONDS} />
          </div>
          <h2 style={S.question}>{q.question}</h2>
          <div style={S.optionsList}>
            {q.options.map((opt,i)=>{
              let bg="rgba(255,255,255,0.04)",border="1px solid rgba(255,255,255,0.08)",color="#cbd5e1";
              if (revealed){
                if(i===q.answer){bg="rgba(74,222,128,0.12)";border="1px solid #4ade80";color="#4ade80";}
                else if(i===selected&&i!==q.answer){bg="rgba(248,113,113,0.12)";border="1px solid #f87171";color="#f87171";}
              } else if(selected===i){bg="rgba(99,102,241,0.2)";border="1px solid #818cf8";color="#e0e7ff";}
              const isLocked = revealed;
              const isActive = i === q.answer || i === selected;
              return (
                <button key={i}
                  style={{...S.option,background:bg,border,color,
                    cursor: isLocked ? 'default' : 'pointer',
                    pointerEvents: isLocked ? 'none' : 'auto',
                    opacity: isLocked && !isActive ? 0.45 : 1,
                    transform: isLocked && isActive ? 'scale(1.01)' : 'scale(1)',
                  }}
                  onClick={()=>handleSelect(i)}>
                  <span style={S.optLetter}>{String.fromCharCode(65+i)}</span>{opt}
                </button>
              );
            })}
          </div>
          {timedOut && (
            <div style={{...S.factBox,borderColor:"rgba(248,113,113,0.3)",background:"rgba(248,113,113,0.06)"}}>
              <span style={{fontSize:"1.2rem"}}>⏰</span>
              <span style={{color:"#f87171",fontSize:"0.9rem"}}>Time's up! The correct answer is highlighted in green.</span>
            </div>
          )}
          {revealed && !timedOut && (
            <div style={{marginBottom:"0.5rem"}}>
              <div style={{display:"flex",alignItems:"center",gap:"0.4rem",marginBottom:"0.75rem"}}>
                <span style={{fontSize:"0.8rem",color:"#64748b",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"999px",padding:"0.2rem 0.7rem"}}>🔒 Answer locked</span>
              </div>
              <div style={S.factBox}><span style={{fontSize:"1.2rem"}}>💡</span><span style={{color:"#94a3b8",fontSize:"0.9rem"}}>{q.fact}</span></div>
            </div>
          )}
          {revealed && <button style={S.btn} onClick={handleNext}>{current<shuffledQs.length-1?"Next Question →":"See Results"}</button>}
        </div>
      </div>
    );
  }

  // Registration
  return (
    <div style={S.bg}>
      <div style={S.card}>
        <div style={S.cardHeader}>
          <span style={S.headerIcon}>🧠</span>
          <h1 style={S.cardTitle}>NSTQB Quiz</h1>
          <p style={S.cardSub}>Tricky &amp; Trivia Edition — Register to begin</p>
        </div>
        <div style={S.form}>
          {[
            {key:"name",label:"Full Name *",placeholder:"Your full name",type:"text"},
            {key:"email",label:"Email Address *",placeholder:"you@example.com",type:"email"},
            {key:"organization",label:"Organization",placeholder:"Company / Institute (optional)",type:"text"},
          ].map(({key,label,placeholder,type})=>(
            <div key={key} style={S.field}>
              <label style={S.label}>{label}</label>
              <input type={type} placeholder={placeholder} value={user[key]}
                onChange={e=>{setUser({...user,[key]:e.target.value});setErrors({...errors,[key]:null});}}
                style={{...S.input,...(errors[key]?S.inputError:{})}} />
              {errors[key]&&<span style={S.errorMsg}>{errors[key]}</span>}
            </div>
          ))}
          <button style={S.btn} onClick={handleRegister}>Start Quiz →</button>
        </div>
        <div style={S.rules}>
          <span>📋 10 random questions</span><span>⏱ 35s per question</span><span>🏅 7/10 to win</span>
        </div>
        <div style={{textAlign:"center",marginTop:"1.5rem"}}>
          <button style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"0.6rem",color:"#94a3b8",fontSize:"0.82rem",cursor:"pointer",padding:"0.5rem 1.25rem",fontWeight:600}} onClick={()=>setScreen("admin")}>
            ⚙️ Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  bg:{minHeight:"100vh",background:"linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"1.5rem",fontFamily:"'Georgia','Times New Roman',serif",position:"relative"},
  card:{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"1.5rem",padding:"2.5rem",width:"100%",maxWidth:"520px",boxShadow:"0 25px 60px rgba(0,0,0,0.5)"},
  quizCard:{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"1.5rem",padding:"2.5rem",width:"100%",maxWidth:"640px",boxShadow:"0 25px 60px rgba(0,0,0,0.5)"},
  cardHeader:{textAlign:"center",marginBottom:"2rem"},
  headerIcon:{fontSize:"3rem",display:"block",marginBottom:"0.5rem"},
  cardTitle:{color:"#e2e8f0",fontSize:"1.8rem",margin:"0 0 0.25rem",letterSpacing:"-0.5px"},
  cardSub:{color:"#64748b",margin:0,fontSize:"0.9rem"},
  form:{display:"flex",flexDirection:"column"},
  field:{display:"flex",flexDirection:"column",gap:"0.35rem",marginBottom:"1rem"},
  label:{color:"#94a3b8",fontSize:"0.85rem",fontWeight:600,letterSpacing:"0.03em"},
  input:{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"0.75rem",padding:"0.85rem 1rem",color:"#e2e8f0",fontSize:"0.95rem",outline:"none"},
  inputError:{borderColor:"#f87171"},
  errorMsg:{color:"#f87171",fontSize:"0.8rem"},
  btn:{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:"0.75rem",padding:"0.9rem 1.5rem",cursor:"pointer",fontWeight:700,fontSize:"0.95rem",marginTop:"0.5rem"},
  btnSecondary:{background:"rgba(255,255,255,0.06)",color:"#94a3b8",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"0.75rem",padding:"0.75rem 1.5rem",cursor:"pointer",fontWeight:600,fontSize:"0.9rem"},
  downloadBtn:{background:"linear-gradient(135deg,#059669,#10b981)",color:"#fff",border:"none",borderRadius:"0.75rem",padding:"0.9rem 1.5rem",cursor:"pointer",fontWeight:700,fontSize:"0.95rem",width:"100%",marginTop:"0.5rem"},
  rules:{display:"flex",justifyContent:"space-around",marginTop:"2rem",paddingTop:"1.5rem",borderTop:"1px solid rgba(255,255,255,0.06)",color:"#64748b",fontSize:"0.78rem"},
  progressWrap:{position:"fixed",top:0,left:0,right:0,height:"4px",background:"rgba(255,255,255,0.06)",zIndex:50},
  progressBar:{height:"100%",background:"linear-gradient(90deg,#6366f1,#8b5cf6,#a78bfa)",transition:"width 0.4s ease",borderRadius:"0 2px 2px 0"},
  quizMeta:{display:"flex",justifyContent:"space-between",width:"100%",maxWidth:"640px",padding:"0.75rem 0",marginBottom:"0.5rem",fontSize:"0.85rem"},
  qNumber:{display:"inline-block",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",borderRadius:"0.5rem",padding:"0.25rem 0.75rem",fontSize:"0.8rem",fontWeight:700},
  question:{color:"#e2e8f0",fontSize:"1.15rem",lineHeight:1.55,margin:"0 0 1.25rem"},
  optionsList:{display:"flex",flexDirection:"column",gap:"0.7rem",marginBottom:"1.25rem"},
  option:{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.85rem 1.1rem",borderRadius:"0.75rem",cursor:"pointer",textAlign:"left",fontSize:"0.9rem",lineHeight:1.4,transition:"all 0.2s"},
  optLetter:{minWidth:"1.8rem",height:"1.8rem",borderRadius:"50%",background:"rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:"0.8rem",flexShrink:0},
  factBox:{display:"flex",gap:"0.75rem",alignItems:"flex-start",background:"rgba(148,163,184,0.06)",borderRadius:"0.75rem",padding:"1rem",marginBottom:"1.25rem",border:"1px solid rgba(255,255,255,0.06)"},
  rewardBox:{background:"rgba(255,215,0,0.08)",border:"1px solid rgba(255,215,0,0.25)",borderRadius:"1rem",padding:"1.5rem",marginBottom:"1rem"},
  encourageBox:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"1rem",padding:"1.25rem",marginBottom:"1rem"},
  statsRow:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1rem",marginBottom:"1.5rem"},
  statBox:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"1rem",padding:"1rem",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.25rem"},
  statVal:{fontSize:"1.6rem",fontWeight:700,color:"#e2e8f0"},
  statLabel:{fontSize:"0.75rem",color:"#64748b"},
  tableHeader:{display:"grid",padding:"0.6rem 1rem",color:"#64748b",fontWeight:700,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:"0.72rem",letterSpacing:"0.05em",gap:"0.5rem"},
  tableRow:{display:"grid",padding:"0.7rem 1rem",borderBottom:"1px solid rgba(255,255,255,0.04)",borderRadius:"0.4rem",gap:"0.5rem",alignItems:"center",fontSize:"0.85rem"},
};
