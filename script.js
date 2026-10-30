const CATS=[
 {n:'Logical Reasoning',i:'🧠',c:'#6366f1',tip:'Practise number series, pattern puzzles and basic probability daily.'},
 {n:'Programming Basics',i:'💻',c:'#06b6d4',tip:'Revisit variables, loops, functions and data structures; solve small coding problems.'},
 {n:'Networking & Web',i:'🌐',c:'#f59e0b',tip:'Study the OSI model, IP addressing, HTTP methods and how HTML/CSS/JS work together.'},
 {n:'Computer Fundamentals',i:'🖥️',c:'#10b981',tip:'Review hardware, memory types, operating systems and file systems.'}];
const ALL=[
 [0,'What comes next in the series: 2, 6, 12, 20, 30, ?',['38','40','42','44'],2],
 [0,'If all coders are thinkers and some thinkers are artists, which is certainly true?',['All coders are artists','Some coders are artists','All coders are thinkers','No artist is a coder'],2],
 [0,'A train travels 120 km in 2 hours. How long for 300 km at the same speed?',['4 hours','5 hours','6 hours','7 hours'],1],
 [0,'Which is the odd one out: Python, Java, Linux, C++?',['Python','Java','Linux','C++'],2],
 [0,'What is 25% of 480?',['100','110','120','130'],2],
 [1,'Which data structure works on the LIFO principle?',['Queue','Stack','Array','Tree'],1],
 [1,'What does the "break" statement do inside a loop?',['Skips one iteration','Restarts the loop','Exits the loop','Pauses the loop'],2],
 [1,'Which symbol is used for single-line comments in JavaScript?',['#','//','<!-- -->','**'],1],
 [1,'What is the time complexity of binary search?',['O(n)','O(n²)','O(log n)','O(1)'],2],
 [1,'Which keyword declares a block-scoped variable in JavaScript?',['var','let','int','define'],1],
 [2,'What does HTTP stand for?',['HyperText Transfer Protocol','High Transfer Text Process','HyperLink Transmission Page','Host Text Transport Protocol'],0],
 [2,'Which layer of the OSI model handles routing and IP addresses?',['Data Link','Transport','Network','Session'],2],
 [2,'Which CSS property changes the text colour?',['font-color','color','text-style','foreground'],1],
 [2,'Which HTTP method is normally used to submit new data to a server?',['GET','POST','HEAD','TRACE'],1],
 [2,'Which of these is a valid IPv4 address?',['256.10.1.5','192.168.1.1','12.34.56','192.168.1.1.9'],1],
 [3,'Which memory is volatile?',['ROM','SSD','RAM','Hard disk'],2],
 [3,'What is the brain of the computer called?',['GPU','CPU','PSU','BIOS'],1],
 [3,'Which of these is an operating system?',['Chrome','Oracle','Ubuntu','Photoshop'],2],
 [3,'1 Kilobyte is approximately equal to:',['1000 bytes','8 bits','1 million bytes','100 bytes'],0],
 [3,'Which file extension is used for a compressed archive?',['.exe','.zip','.html','.mp3'],1]
].map(x=>({c:x[0],q:x[1],o:x[2],a:x[3]}));
const $=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let Q=ALL,name='',cur=0,ans=[],tm=[],el=0,LIM=0,iv=null,qStart=0,running=false,done=false,last=null,rc=[],hc=null,armed=0,modeLbl='',dark=matchMedia('(prefers-color-scheme: dark)').matches;

function toast(t){const e=$('toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2800)}
function setTheme(d){dark=d;document.documentElement.dataset.theme=d?'dark':'light';$('theme').textContent=d?'☀️ Light':'🌙 Dark';
 const v=document.querySelector('.view.on');if(v&&v.id==='result'&&last)renderResult();if(v&&v.id==='history')drawHist()}
$('theme').onclick=()=>setTheme(!dark);

$('cats').innerHTML=CATS.map((c,i)=>`<div class="card pick" data-c="${i}"><div class="ic" style="background:${c.c}22">${c.i}</div><h3>${c.n}</h3><p>5 questions · click to practise</p></div>`).join('');
document.querySelectorAll('.pick').forEach(p=>p.onclick=()=>{$('mode').value=p.dataset.c;window.scrollTo({top:0,behavior:'smooth'});$('name').focus({preventScroll:true});toast('Selected: '+CATS[p.dataset.c].n+' practice. Enter your name and press Start.')});

/* navigation */
function nav(id,force){
 if(running&&id!=='quiz'&&!force&&Date.now()-armed>3000){armed=Date.now();toast('Test in progress. Click again to leave and discard it.');return}
 location.hash=id;route(id)}
function route(id){
 id=id||'home';const v=document.getElementById(id);if(!v||!v.classList.contains('view'))id='home';
 if(id==='quiz'&&!running)id='home';if(id==='result'&&!done)id='home';
 if(id!=='quiz'&&running){running=false;clearInterval(iv)}
 document.querySelectorAll('.view').forEach(x=>x.classList.toggle('on',x.id===id));
 document.querySelectorAll('.nb').forEach(b=>b.classList.toggle('on',b.dataset.go===id));
 if(id==='home')renderHist();if(id==='history')drawHist();window.scrollTo(0,0)}
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>nav(b.dataset.go));
addEventListener('hashchange',()=>route(location.hash.slice(1)));

/* history */
function hist(){try{return JSON.parse(localStorage.getItem('sa_hist')||'[]')}catch(e){return[]}}
const rowH=x=>`<div class="hist"><span><b>${esc(x.n)}</b> · ${esc(x.m||'Full test')} · ${esc(x.d)}</span><span><b>${x.s}%</b> · ${x.l}</span></div>`;
function renderHist(){const h=hist();$('histBox').style.display=h.length?'block':'none';$('hist').innerHTML=h.slice(-5).reverse().map(rowH).join('')}
function cfg(){const st=getComputedStyle(document.documentElement);Chart.defaults.color=st.getPropertyValue('--muted').trim();Chart.defaults.font.family="'Plus Jakarta Sans',system-ui,sans-serif";Chart.defaults.font.size=13;return st.getPropertyValue('--line').trim()}
function drawHist(){const h=hist();
 $('hsum').innerHTML=[['Attempts',h.length],['Best Score',h.length?Math.max(...h.map(x=>x.s))+'%':'–'],['Average',h.length?Math.round(h.reduce((a,x)=>a+x.s,0)/h.length)+'%':'–']].map(s=>`<div class="card"><small>${s[0]}</small><b>${s[1]}</b></div>`).join('');
 $('hlist').innerHTML=h.length?h.slice().reverse().map(rowH).join(''):'<p class="mut">No attempts yet. Take your first assessment from the Home page.</p>';
 if(hc){hc.destroy();hc=null}if(!h.length)return;
 const ln=cfg(),t=h.slice(-10);
 hc=new Chart($('c4'),{type:'line',data:{labels:t.map((x,i)=>'#'+(h.length-t.length+i+1)),datasets:[{label:'Score %',data:t.map(x=>x.s),borderColor:'#6366f1',backgroundColor:'rgba(99,102,241,.18)',fill:true,tension:.35,borderWidth:3,pointRadius:5}]},options:{responsive:true,maintainAspectRatio:false,scales:{y:{min:0,max:100,grid:{color:ln}},x:{grid:{display:false}}},plugins:{legend:{display:false}}}})}
$('clr').onclick=()=>{try{localStorage.removeItem('sa_hist')}catch(e){}drawHist();renderHist();toast('History cleared')};

/* test */
function start(){
 name=$('name').value.trim();
 if(!name){$('name').focus();$('name').placeholder='Please enter your name first';toast('Please enter your name to begin');return}
 const m=$('mode').value;modeLbl=$('mode').selectedOptions[0].text;
 Q=m==='all'?ALL.slice():m==='quick'?ALL.slice().sort(()=>Math.random()-.5).slice(0,10):ALL.filter(q=>q.c===+m);
 ans=Q.map(()=>null);tm=Q.map(()=>0);el=0;LIM=+$('tlim').value;cur=0;running=true;done=false;qStart=Date.now();
 clearInterval(iv);iv=setInterval(tick,1000);nav('quiz',true);showTimer();draw()}
$('go').onclick=start;$('retake').onclick=start;
$('name').onkeydown=e=>{if(e.key==='Enter')start()};
function showTimer(){const s=LIM?Math.max(LIM*60-el,0):el;$('timer').textContent=(LIM?'⏱ ':'⏱ +')+String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function tick(){el++;showTimer();if(LIM&&el>=LIM*60)finish()}
function draw(){const q=Q[cur],c=CATS[q.c];
 $('qcat').textContent=c.i+' '+c.n;$('qcount').textContent='Question '+(cur+1)+' of '+Q.length;
 $('bar').style.width=((cur+1)/Q.length*100)+'%';$('qtext').textContent=q.q;
 $('opts').innerHTML=q.o.map((o,i)=>`<button class="opt ${ans[cur]===i?'sel':''}" data-i="${i}"><b>${'ABCD'[i]}</b>${esc(o)}</button>`).join('');
 document.querySelectorAll('.opt').forEach(b=>b.onclick=()=>pick(+b.dataset.i));
 $('dots').innerHTML=Q.map((_,i)=>`<button class="dot ${i===cur?'cur':ans[i]!==null?'done':''}" data-i="${i}">${i+1}</button>`).join('');
 document.querySelectorAll('.dot').forEach(b=>b.onclick=()=>go(+b.dataset.i));
 $('prev').style.visibility=cur?'visible':'hidden';$('next').textContent=cur===Q.length-1?'Submit ✓':'Next →'}
function pick(i){ans[cur]=i;draw()}
function leave(){tm[cur]+=Math.round((Date.now()-qStart)/1000);qStart=Date.now()}
function go(i){leave();cur=i;draw()}
$('prev').onclick=()=>go(cur-1);
$('next').onclick=()=>cur===Q.length-1?finish():go(cur+1);
$('exit').onclick=()=>nav('home');
document.addEventListener('keydown',e=>{if(!running||/INPUT|SELECT/.test(e.target.tagName))return;const k=e.key.toLowerCase(),n='abcd'.indexOf(k)>=0?'abcd'.indexOf(k):'1234'.indexOf(k);
 if(n>=0&&n<Q[cur].o.length)pick(n);else if(k==='arrowright')cur<Q.length-1&&go(cur+1);else if(k==='arrowleft')cur>0&&go(cur-1)});

function finish(){
 if(running)leave();running=false;clearInterval(iv);done=true;
 const ok=Q.map((q,i)=>ans[i]===q.a),right=ok.filter(Boolean).length,skip=ans.filter(a=>a===null).length,wrong=Q.length-right-skip,pct=Math.round(right/Q.length*100);
 const lv=pct>=90?['Expert','#7c3aed']:pct>=70?['Advanced','#16a34a']:pct>=40?['Intermediate','#f59e0b']:['Beginner','#dc2626'];
 const cs=CATS.map((c,ci)=>{const idx=Q.map((q,i)=>q.c===ci?i:-1).filter(i=>i>=0);return idx.length?Math.round(idx.filter(i=>ok[i]).length/idx.length*100):null});
 last={ok,right,skip,wrong,pct,lv,cs,used:el,ans:ans.slice(),tm:tm.slice(),Q};
 try{const h=hist();h.push({n:name,s:pct,l:lv[0],d:new Date().toLocaleDateString(),m:modeLbl});localStorage.setItem('sa_hist',JSON.stringify(h.slice(-30)))}catch(e){}
 nav('result',true);renderResult()}

function renderResult(){const L=last,u=L.used;
 $('rname').textContent='Well done, '+name+'!';$('rlevel').textContent='Skill Level: '+L.lv[0];$('rlevel').style.background=L.lv[1];
 $('sum').innerHTML=[['Overall Score',L.pct+'%'],['Correct Answers',L.right+' / '+L.Q.length],['Time Taken',Math.floor(u/60)+'m '+u%60+'s'],['Unanswered',L.skip]].map(s=>`<div class="card"><small>${s[0]}</small><b>${s[1]}</b></div>`).join('');
 $('catbars').innerHTML=CATS.map((c,i)=>L.cs[i]===null?'':`<div class="cat"><div class="r"><span>${c.i} ${c.n}</span><span>${L.cs[i]}%</span></div><div class="t"><i style="width:${L.cs[i]}%;background:${c.c}"></i></div></div>`).join('');
 const weak=CATS.filter((c,i)=>L.cs[i]!==null&&L.cs[i]<60);
 $('recs').innerHTML=weak.length?weak.map(c=>`<p style="margin:0 0 10px"><b>${c.i} ${c.n}:</b> <span class="mut">${c.tip}</span></p>`).join(''):'<p style="margin:0">🎉 Excellent! You scored 60% or more in every area tested. Try a full test to keep growing.</p>';
 $('review').innerHTML=L.Q.map((q,i)=>`<div class="rev"><b>${i+1}. ${esc(q.q)}</b><br><span class="${L.ok[i]?'ok':'bad'}">${L.ok[i]?'✔ Correct':L.ans[i]===null?'✘ Not answered':'✘ Your answer: '+esc(q.o[L.ans[i]])}</span>${L.ok[i]?'':' · <span class="ok">Correct: '+esc(q.o[q.a])+'</span>'}</div>`).join('');
 const ln=cfg(),base={responsive:true,maintainAspectRatio:false},full=L.cs.every(x=>x!==null);
 rc.forEach(c=>c.destroy());$('c2').closest('.card').style.display=full?'':'none';
 rc=[new Chart($('c1'),{type:'doughnut',data:{labels:['Correct','Wrong','Skipped'],datasets:[{data:[L.right,L.wrong,L.skip],backgroundColor:['#16a34a','#dc2626','#94a3b8'],borderWidth:0}]},options:{...base,cutout:'65%',plugins:{legend:{position:'bottom'}}}}),
 new Chart($('c3'),{type:'bar',data:{labels:L.Q.map((q,i)=>'Q'+(i+1)),datasets:[{data:L.tm,backgroundColor:L.ok.map(o=>o?'#16a34a':'#dc2626'),borderRadius:6}]},options:{...base,scales:{x:{grid:{display:false}},y:{grid:{color:ln}}},plugins:{legend:{display:false}}}})];
 if(full)rc.push(new Chart($('c2'),{type:'radar',data:{labels:CATS.map(c=>c.n),datasets:[{label:'Score %',data:L.cs,backgroundColor:'rgba(99,102,241,.25)',borderColor:'#6366f1',pointBackgroundColor:'#6366f1',borderWidth:3}]},options:{...base,scales:{r:{min:0,max:100,grid:{color:ln},angleLines:{color:ln},ticks:{backdropColor:'transparent'}}},plugins:{legend:{display:false}}}}))}

setTheme(dark);route(location.hash.slice(1));
