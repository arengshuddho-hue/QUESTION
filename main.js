import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

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

window.data = {};

// Fetch Live Data
onValue(ref(db, 'portalData'), (snapshot) => {
  const liveData = snapshot.val();
  if (liveData) {
    window.data = liveData;
    build_ticker();
  }
});

// Build Scrolling Ticker
function build_ticker(){
  const track = document.getElementById('ticker-track');
  let items = window.data['TICKER'] || [];
  
  if(items.length === 0) {
    items = [{ content: 'Welcome to CSE-57 Academic Portal!' }];
  }
  
  const doubled = [...items, ...items, ...items];
  track.innerHTML = doubled.map(t => {
    const text = typeof t === 'string' ? t : (t.text || t.content || '');
    return `<span class="ticker-item"><i class="fa-solid fa-bolt"></i>${text}</span><span style="color:var(--gold);opacity:0.35;padding:0 4px">&#9670;</span>`;
  }).join('');
}

// UI Functions
window.isDark = true;
window.toggle_theme = function(){
  window.isDark = !window.isDark;
  document.body.classList.toggle('dark', window.isDark);
  document.body.classList.toggle('light', !window.isDark);
  document.getElementById('theme-btn').textContent = window.isDark ? '☀' : '🌙';
}

// Modal Logic (Completely Upgraded)
window.open_modal = function(name, code, key, icon){
  document.getElementById('m-title').textContent = name;
  document.getElementById('m-code').textContent = code;
  document.getElementById('m-icon').className = 'fa-solid ' + (icon || 'fa-file');
  
  const list = document.getElementById('m-pdfs');
  list.innerHTML = '';
  const files = window.data[key] || [];
  
  if(!files.length){
    list.innerHTML = '<div class="empty-state"><i class="fa-regular fa-folder-open"></i>Not available yet.</div>';
    document.getElementById('overlay').classList.add('on');
    document.body.style.overflow = 'hidden';
    return;
  }
  
  files.forEach((item, i) => {
    let type = 'link';
    let title = name + ' File ' + (i+1);
    let content = '';
    
    // Fallback for old string data
    if (typeof item === 'string') {
      content = item;
      if (/\.(jpg|jpeg|png|gif|webp)$/i.test(item)) type = 'image';
    } else {
      type = item.type || 'link';
      title = item.title || item.label || item.name || title;
      content = item.content || item.file || item.link || item.code || '';
      
      // Auto-detect old data structures
      if (key === 'CLASSROOM' && item.code) type = 'code';
    }

    if (type === 'image') {
      const wrap = document.createElement('div');
      wrap.className = 'routine-img-wrap';
      wrap.innerHTML = `<img src="${content}" alt="${title}">`;
      list.appendChild(wrap);
      
      const a = document.createElement('a');
      a.href = content; a.target = '_blank'; a.className = 'pdf-item img-type';
      a.innerHTML = `<div class="fi"><i class="fa-solid fa-expand"></i></div><span class="pdf-label">${title} (Full Screen)</span><span class="pdf-num">0${i+1}</span>`;
      list.appendChild(a);
    } 
    else if (type === 'text') {
      const div = document.createElement('div');
      div.className = 'info-box';
      div.innerHTML = `<i class="fa-solid fa-circle-info"></i> <div><strong>${title}</strong><br>${content}</div>`;
      list.appendChild(div);
    }
    else if (type === 'code') {
      const div = document.createElement('div');
      div.className = 'pdf-item code-type';
      div.innerHTML = `<div class="fi"><i class="fa-solid fa-hashtag"></i></div><span class="pdf-label">${title}</span><span class="code-chip" onclick="copy_code(this,'${content}')">${content}</span>`;
      list.appendChild(div);
    }
    else {
      // Default: Link (PDF, YouTube, etc.)
      const a = document.createElement('a');
      a.href = content; a.target = '_blank'; a.className = 'pdf-item pdf-type';
      
      let iconClass = 'fa-file-pdf';
      let iconColorClass = 'pdf-type'; 
      
      if(content.includes('youtube.com') || content.includes('youtu.be')) {
        iconClass = 'fa-youtube fa-brands';
        iconColorClass = 'hack-type'; 
      }
      else if(content.includes('drive.google.com')) {
        iconClass = 'fa-google-drive fa-brands';
        iconColorClass = 'links-type'; 
      }
      else if(content.includes('github.com')) {
        iconClass = 'fa-github fa-brands';
        iconColorClass = 'routine-type';
      }
      
      a.innerHTML = `<div class="fi ${iconColorClass}"><i class="${iconClass.includes('fa-brands') ? '' : 'fa-solid'} ${iconClass}"></i></div><span class="pdf-label">${title}</span><span class="pdf-num">0${i+1}</span><i class="fa-solid fa-arrow-right pdf-arrow"></i>`;
      list.appendChild(a);
    }
  });
  
  document.getElementById('overlay').classList.add('on');
  document.body.style.overflow = 'hidden';
}

window.copy_code = function(el, code){
  navigator.clipboard.writeText(code).then(()=>{
    const old = el.textContent;
    el.textContent = 'Copied!';
    setTimeout(() => { el.textContent = old; }, 1200);
  });
}

window.close_modal = function(){
  document.getElementById('overlay').classList.remove('on');
  document.body.style.overflow = '';
}
window.close_outside = function(e){
  if(e.target.id === 'overlay') window.close_modal();
}
document.addEventListener('keydown', e => {
  if(e.key === 'Escape') window.close_modal();
});
