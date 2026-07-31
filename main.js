import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
  import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

  // ==========================================
  // REPLACE THIS WITH YOUR FIREBASE CONFIG (Must match admin.html)
  // ==========================================
  const firebaseConfig = {
  apiKey: "AIzaSyD0WsZH_YyuPADXO525pOkCjaXwDCGCxpc",
  authDomain: "cse-57-portal.firebaseapp.com",
  databaseURL: "https://cse-57-portal-default-rtdb.firebaseio.com",
  projectId: "cse-57-portal",
  storageBucket: "cse-57-portal.firebasestorage.app",
  messagingSenderId: "316724142018",
  appId: "1:316724142018:web:384027899f55a50f88805b",
  measurementId: "G-MY3ZVBD1SZ"
};
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const defaultData = {
    DSA2:['DSA2/DSA2_1.pdf','DSA2/DSA2_2.pdf','DSA2/DSA2_3.pdf','DSA2/DSA2_4.pdf'],
    SE:['SE/SE1.pdf','SE/SE2.pdf','SE/SE3.pdf','SE/SE4.pdf'],
    MATH:['MATH/MATH1.pdf','MATH/MATH2.pdf','MATH/MATH3.pdf','MATH/MATH4.pdf'],
    NUM:['NUM/NUM1.pdf','NUM/NUM2.pdf','NUM/NUM3.pdf','NUM/NUM4.pdf'],
    DCOM:['DCOM/DCOM1.pdf','DCOM/DCOM2.pdf','DCOM/DCOM3.pdf','DCOM/DCOM4.pdf'],
    IPLAB:['IPLAB/IPLAB1.pdf','IPLAB/IPLAB2.pdf','IPLAB/IPLAB3.pdf','IPLAB/IPLAB4.pdf'],
    SUG:[], NOTES:[], ROUTINE:['rr.png'], PQS:[],
    LINKS:[{file:'https://ouits-res.netlify.app/', label:'CENTRAL PORTAL UITS STUDENT'}],
    COURSES:['course.png'], BOOKS:[],
    FACULTY:[{name:'CSE Faculty Member', file:'Faculty.pdf', label:'CSE Faculty Member'}],
    CLASSROOM:[], CLSROUTINE:[], HACKATHON:[], CP:[]
  };

  window.data = defaultData; // initial data

  // Fetch Live Data from Firebase!
  const dataRef = ref(db, 'portalData');
  onValue(dataRef, (snapshot) => {
    const liveData = snapshot.val();
    if (liveData) {
      window.data = liveData;
      console.log("Portal Data Synced Live!");
    }
  });

  // UI Functions
  window.isDark=true;
  window.toggle_theme = function(){
    window.isDark=!window.isDark;
    document.body.classList.toggle('dark',window.isDark);
    document.body.classList.toggle('light',!window.isDark);
    document.getElementById('theme-btn').textContent=window.isDark?'â˜€':'ðŸŒ™';
  }
   
  const labels={DSA2:'DSA 2',SE:'Software Engg',MATH:'Complex Variables',NUM:'Numerical Methods',DCOM:'Data Communication',IPLAB:'Internet Prog. Lab',SUG:'Suggestions',NOTES:'Notes',ROUTINE:'Exam Routine',PQS:'PQ Solution',LINKS:'Reference Links',COURSES:'Upcoming Courses',BOOKS:'Books',FACULTY:'Faculty List',CLASSROOM:'Classroom Code',CLSROUTINE:'Class Routine',HACKATHON:'Upcoming Hackathon',CP:'Upcoming CP'};
   
  window.open_modal = function(name,code,key,icon){
    document.getElementById('m-title').textContent=name;
    document.getElementById('m-code').textContent=code;
    const mi=document.getElementById('m-icon');
    mi.className='fa-solid '+(icon||'fa-file');
    const list=document.getElementById('m-pdfs');
    list.innerHTML='';
    const files=window.data[key]||[];
    
    if(!files.length){
      list.innerHTML='<div class="empty-state"><i class="fa-regular fa-folder-open"></i>Not available yet.<br>Shighroi add hobe!</div>';
    } else if(key==='ROUTINE'||key==='COURSES'||key==='CLSROUTINE'){
      files.forEach((f,i)=>{
        const isImg=/\.(jpg|jpeg|png|gif|webp)$/i.test(f);
        if(isImg){
          const wrap=document.createElement('div');
          wrap.className='routine-img-wrap';
          const img=document.createElement('img');
          img.src=f;img.alt=labels[key];
          img.onerror=()=>{wrap.innerHTML='<div class="empty-state" style="padding:16px"><i class="fa-solid fa-image"></i>"'+f+'" â€” same folder e rakho.</div>';};
          wrap.appendChild(img);
          list.appendChild(wrap);
          const dl=document.createElement('a');
          dl.href=f;dl.target='_blank';dl.className='pdf-item img-type';
          dl.innerHTML='<div class="fi"><i class="fa-solid fa-expand"></i></div><span class="pdf-label">Open Full Screen</span><span class="pdf-num">0'+(i+1)+'</span><i class="fa-solid fa-arrow-right pdf-arrow"></i>';
          list.appendChild(dl);
        } else {
          const a=document.createElement('a');
          a.href=f;a.target='_blank';a.className='pdf-item pdf-type';
          a.innerHTML='<div class="fi"><i class="fa-solid fa-file-pdf"></i></div><span class="pdf-label">'+(labels[key])+' â€” File</span><span class="pdf-num">0'+(i+1)+'</span><i class="fa-solid fa-arrow-right pdf-arrow"></i>';
          list.appendChild(a);
        }
      });
    } else if(key==='NOTES'||key==='PQS'||key==='SUG'||key==='BOOKS'){
      files.forEach((item,i)=>{
        const a=document.createElement('a');
        a.href=item.file;a.target='_blank';a.className='pdf-item pdf-type';
        a.innerHTML='<div class="fi"><i class="fa-solid fa-file-pdf"></i></div><span class="pdf-label">'+item.label+'</span><span class="pdf-num">0'+(i+1)+'</span><i class="fa-solid fa-arrow-right pdf-arrow"></i>';
        list.appendChild(a);
      });
    } else if(key==='LINKS'){
      files.forEach((item,i)=>{
        const a=document.createElement('a');
        a.href=item.file;a.target='_blank';a.className='pdf-item link-type';
        a.innerHTML='<div class="fi"><i class="fa-solid fa-link"></i></div><span class="pdf-label">'+item.label+'</span><span class="pdf-num">0'+(i+1)+'</span><i class="fa-solid fa-arrow-right pdf-arrow"></i>';
        list.appendChild(a);
      });
    } else if(key==='FACULTY'){
      files.forEach((item,i)=>{
        const hasFile=!!item.file;
        const el=document.createElement(hasFile?'a':'div');
        el.className='pdf-item faculty-type';
        if(hasFile){el.href=item.file;el.target='_blank';}
        el.innerHTML='<div class="fi"><i class="fa-solid fa-user-tie"></i></div><span class="pdf-label">'+(item.label||item.name)+'<small>'+(item.designation||'')+(item.subject?' â€¢ '+item.subject:'')+'</small></span><span class="pdf-num">0'+(i+1)+'</span>'+(hasFile?'<i class="fa-solid fa-arrow-right pdf-arrow"></i>':'');
        list.appendChild(el);
      });
    } else if(key==='CLASSROOM'){
      files.forEach((item,i)=>{
        const div=document.createElement('div');
        div.className='pdf-item code-type';
        div.innerHTML='<div class="fi"><i class="fa-solid fa-hashtag"></i></div><span class="pdf-label">'+item.subject+'</span><span class="code-chip" title="Tap to copy" onclick="copy_code(this,\''+item.code+'\')">'+item.code+'</span>';
        list.appendChild(div);
      });
    } else if(key==='HACKATHON'||key==='CP'){
      const typeClass=key==='HACKATHON'?'hack-type':'cp-type';
      const typeIcon=key==='HACKATHON'?'fa-laptop-code':'fa-trophy';
      files.forEach((item,i)=>{
        const hasLink=!!item.link;
        const el=document.createElement(hasLink?'a':'div');
        el.className='pdf-item '+typeClass;
        if(hasLink){el.href=item.link;el.target='_blank';}
        el.innerHTML='<div class="fi"><i class="fa-solid '+typeIcon+'"></i></div><span class="pdf-label">'+item.title+(item.date?'<small>'+item.date+'</small>':'')+'</span><span class="pdf-num">0'+(i+1)+'</span>'+(hasLink?'<i class="fa-solid fa-arrow-right pdf-arrow"></i>':'');
        list.appendChild(el);
      });
    } else {
      files.forEach((pdf,i)=>{
        const a=document.createElement('a');
        a.href=pdf;a.target='_blank';a.className='pdf-item pdf-type';
        a.innerHTML='<div class="fi"><i class="fa-solid fa-file-pdf"></i></div><span class="pdf-label">'+(labels[key]||name)+' â€” Previous Question</span><span class="pdf-num">0'+(i+1)+'</span><i class="fa-solid fa-arrow-right pdf-arrow"></i>';
        list.appendChild(a);
      });
    }
    document.getElementById('overlay').classList.add('on');
    document.body.style.overflow='hidden';
  }
   
  window.copy_code = function(el,code){
    navigator.clipboard.writeText(code).then(()=>{
      const old=el.textContent;
      el.textContent='Copied!';
      setTimeout(()=>{el.textContent=old;},1200);
    });
  }
   
  window.close_modal = function(){
    document.getElementById('overlay').classList.remove('on');
    document.body.style.overflow='';
  }
  window.close_outside = function(e){if(e.target.id==='overlay') window.close_modal();}
  document.addEventListener('keydown',e=>{if(e.key==='Escape') window.close_modal();});
   
  const ticker_items=[
    {ic:'fa-solid fa-graduation-cap',text:'Upcoming Courses: A new Upcoming Courses card is here â€” course list coming soon!'},
    {ic:'fa-solid fa-laptop-code',text:'Upcoming Hackathon: A new Upcoming Hackathon card is here â€” event info coming soon!'},
    {ic:'fa-solid fa-trophy',text:'Upcoming CP: A new Upcoming CP card is here â€” contest info coming soon!'},
    {ic:'fa-solid fa-cloud-arrow-up',text:'Upload: Submit your PDFs and photos via the Update Files card.'},
    {ic:'fa-solid fa-link',text:'Reference Links: A curated set of external resources â€” coming soon!'},
    {ic:'fa-solid fa-book',text:'Books: A new Books card is here â€” reading materials coming soon!'},
    {ic:'fa-solid fa-chalkboard-user',text:'Faculty List: A new Faculty List card is here â€” teacher info coming soon!'},
    {ic:'fa-solid fa-hashtag',text:'Classroom Code: A new Classroom Code card is here â€” Google Classroom codes coming soon!'},
    {ic:'fa-solid fa-table-list',text:'Class Routine: A new Class Routine card is here â€” weekly schedule coming soon!'}
  ];
  function build_ticker(){
    const track=document.getElementById('ticker-track');
    const doubled=[...ticker_items,...ticker_items];
    track.innerHTML=doubled.map(t=>'<span class="ticker-item"><i class="'+t.ic+'"></i>'+t.text+'</span><span style="color:var(--gold);opacity:0.35;padding:0 4px">&#9670;</span>').join('');
  }
  build_ticker();
