import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, onValue, set, get, child } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

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

// ===== Search Palette (Cmd+K) =====
let paletteActiveIndex = -1;
let paletteMatches = [];

function normalize(str){
  return (str || '').trim().toLocaleLowerCase().replace(/\s+/g, ' ');
}

// Card data collected from existing onclick attributes, no HTML change needed
function getSearchIndex(){
  const cards = document.querySelectorAll('.grid .card[onclick]');
  const index = [];
  cards.forEach(card => {
    const onclickStr = card.getAttribute('onclick') || '';
    const m = onclickStr.match(/open_modal\('([^']*)','([^']*)','([^']*)','([^']*)'\)/);
    if(m){
      index.push({ name: m[1], code: m[2], key: m[3], icon: m[4] });
    }
  });
  return index;
}

window.openSearchPalette = function(){
  document.getElementById('searchOverlay').classList.add('on');
  document.body.style.overflow = 'hidden';
  const input = document.getElementById('paletteInput');
  input.value = '';
  paletteSearch('');
  setTimeout(() => input.focus(), 50);
}

window.closeSearchPalette = function(){
  document.getElementById('searchOverlay').classList.remove('on');
  document.body.style.overflow = '';
}

window.closeSearchOutside = function(e){
  if(e.target.id === 'searchOverlay') closeSearchPalette();
}

window.paletteSearch = function(query){
  const q = normalize(query);
  const emptyState = document.getElementById('paletteEmptyState');
  const resultsBox = document.getElementById('paletteResults');
  const noResult = document.getElementById('paletteNoResult');

  if(!q){
    emptyState.style.display = 'block';
    resultsBox.style.display = 'none';
    resultsBox.innerHTML = '';
    noResult.style.display = 'none';
    paletteMatches = [];
    paletteActiveIndex = -1;
    return;
  }

  const all = getSearchIndex();
  paletteMatches = all.filter(item =>
    normalize(item.name).includes(q) || normalize(item.code).includes(q)
  ).slice(0, 8);

  emptyState.style.display = 'none';

  if(paletteMatches.length === 0){
    resultsBox.style.display = 'none';
    resultsBox.innerHTML = '';
    noResult.style.display = 'flex';
    paletteActiveIndex = -1;
    return;
  }

  noResult.style.display = 'none';
  resultsBox.style.display = 'flex';
  paletteActiveIndex = 0;

  resultsBox.innerHTML = paletteMatches.map((item, i) => `
    <div class="palette-row ${i === 0 ? 'active' : ''}" data-index="${i}"
         onmouseenter="setPaletteActive(${i})"
         onclick="chooseMatch(${i})">
      <div class="fi"><i class="fa-solid ${item.icon}"></i></div>
      <div class="palette-row-text">
        <div class="palette-row-name">${item.name}</div>
        <div class="palette-row-code">${item.code}</div>
      </div>
      <i class="fa-solid fa-arrow-right palette-row-arrow"></i>
    </div>
  `).join('');
}

window.setPaletteActive = function(i){
  paletteActiveIndex = i;
  document.querySelectorAll('.palette-row').forEach(r => r.classList.remove('active'));
  const row = document.querySelector(`.palette-row[data-index="${i}"]`);
  if(row) row.classList.add('active');
}

window.chooseMatch = function(i){
  const item = paletteMatches[i];
  if(!item) return;
  closeSearchPalette();
  window.open_modal(item.name, item.code, item.key, item.icon);
}

// Keyboard: Cmd/Ctrl+K to open, Esc to close, Arrow keys + Enter inside palette
document.addEventListener('keydown', function(e){
  const isOpen = document.getElementById('searchOverlay').classList.contains('on');

  if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){
    e.preventDefault();
    isOpen ? closeSearchPalette() : window.openSearchPalette();
    return;
  }

  if(!isOpen) return;

  if(e.key === 'Escape'){
    closeSearchPalette();
  } else if(e.key === 'ArrowDown'){
    e.preventDefault();
    if(paletteMatches.length){
      paletteActiveIndex = (paletteActiveIndex + 1) % paletteMatches.length;
      setPaletteActive(paletteActiveIndex);
    }
  } else if(e.key === 'ArrowUp'){
    e.preventDefault();
    if(paletteMatches.length){
      paletteActiveIndex = (paletteActiveIndex - 1 + paletteMatches.length) % paletteMatches.length;
      setPaletteActive(paletteActiveIndex);
    }
  } else if(e.key === 'Enter'){
    e.preventDefault();
    if(paletteActiveIndex >= 0) chooseMatch(paletteActiveIndex);
  }
});

// ============================================================
// NOTE VAULT — personal notes accessed by a private code
// Separate Firebase project (RTDB only) + Cloudinary for files.
// No login/email involved: the code IS the key.
// ============================================================

const vaultFirebaseConfig = {
  apiKey: "AIzaSyDtECNnScV_uie6qvmb-HAxQ6dKDglxOfA",
  authDomain: "c-uits.firebaseapp.com",
  databaseURL: "https://c-uits-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "c-uits",
  storageBucket: "c-uits.firebasestorage.app",
  messagingSenderId: "1048855243261",
  appId: "1:1048855243261:web:57835bd57476d65c181194"
};

const CLOUDINARY_CLOUD_NAME = "dwvomd7wd";
const CLOUDINARY_UPLOAD_PRESET = "CSE57C";

// Give this app instance its own name so it doesn't clash with the main portal app
const vaultApp = initializeApp(vaultFirebaseConfig, "vaultApp");
const vaultDb = getDatabase(vaultApp);

let vaultContentType = 'text'; // text | code | image | pdf
let vaultChosenFile = null;

function sanitizeVaultCode(raw){
  // Keep codes URL/DB-key safe: letters, numbers, dash, underscore only
  return (raw || '').trim().replace(/[.#$\[\]\/\s]/g, '-').slice(0, 60);
}

window.openVaultModal = function(){
  document.getElementById('vaultOverlay').classList.add('on');
  document.body.style.overflow = 'hidden';
  switchVaultTab('access');
}

window.closeVaultModal = function(){
  document.getElementById('vaultOverlay').classList.remove('on');
  document.body.style.overflow = '';
}

window.closeVaultOutside = function(e){
  if(e.target.id === 'vaultOverlay') window.closeVaultModal();
}

document.addEventListener('keydown', e => {
  if(e.key === 'Escape'){
    const v = document.getElementById('vaultOverlay');
    if(v && v.classList.contains('on')) window.closeVaultModal();
  }
});

window.switchVaultTab = function(tab){
  const accessBtn = document.getElementById('vaultTabAccessBtn');
  const createBtn = document.getElementById('vaultTabCreateBtn');
  const accessPane = document.getElementById('vaultAccessPane');
  const createPane = document.getElementById('vaultCreatePane');

  if(tab === 'access'){
    accessBtn.classList.add('active'); createBtn.classList.remove('active');
    accessPane.style.display = 'flex'; createPane.style.display = 'none';
  } else {
    createBtn.classList.add('active'); accessBtn.classList.remove('active');
    createPane.style.display = 'flex'; accessPane.style.display = 'none';
  }
}

window.generateVaultCode = function(){
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for(let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  document.getElementById('vaultCreateCode').value = code;
}

window.setVaultContentType = function(type){
  vaultContentType = type;
  vaultChosenFile = null;

  document.querySelectorAll('#vaultTypeToggle .vault-type-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === type);
  });

  const textWrap = document.getElementById('vaultTextWrap');
  const fileWrap = document.getElementById('vaultFileWrap');
  const textarea = document.getElementById('vaultTextInput');
  const dropText = document.getElementById('vaultFileDropText');
  const fileInput = document.getElementById('vaultFileInput');

  if(type === 'text' || type === 'code'){
    textWrap.style.display = 'block';
    fileWrap.style.display = 'none';
    textarea.classList.toggle('as-code', type === 'code');
    textarea.placeholder = type === 'code'
      ? 'Paste or write your code here...'
      : 'Write your note here...';
  } else {
    textWrap.style.display = 'none';
    fileWrap.style.display = 'block';
    fileInput.accept = type === 'image' ? 'image/*' : 'application/pdf';
    dropText.textContent = type === 'image' ? 'Click to choose an image' : 'Click to choose a PDF';
  }
}

window.onVaultFileChosen = function(input){
  const f = input.files && input.files[0];
  vaultChosenFile = f || null;
  const dropText = document.getElementById('vaultFileDropText');
  dropText.textContent = f ? f.name : 'Click to choose a file';
}

function vaultShowMsg(containerId, kind, html){
  document.getElementById(containerId).innerHTML =
    `<div class="vault-msg ${kind}"><i class="fa-solid ${kind === 'ok' ? 'fa-circle-check' : kind === 'err' ? 'fa-circle-exclamation' : 'fa-spinner fa-spin'}"></i><div>${html}</div></div>`;
}

async function uploadToCloudinary(file){
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(url, { method: 'POST', body: formData });
  if(!res.ok) throw new Error('Upload failed (' + res.status + ')');
  const result = await res.json();
  if(!result.secure_url) throw new Error('No URL returned from upload');
  return result.secure_url;
}

window.saveVaultNote = async function(){
  const rawCode = document.getElementById('vaultCreateCode').value;
  const code = sanitizeVaultCode(rawCode);
  const saveBtn = document.getElementById('vaultSaveBtn');

  if(!code){
    vaultShowMsg('vaultCreateResult', 'err', 'Please set a code before saving.');
    return;
  }

  let payload = null;

  if(vaultContentType === 'text' || vaultContentType === 'code'){
    const text = document.getElementById('vaultTextInput').value;
    if(!text.trim()){
      vaultShowMsg('vaultCreateResult', 'err', 'Note is empty — write something first.');
      return;
    }
    payload = { mode: vaultContentType, content: text, createdAt: Date.now() };
  } else {
    if(!vaultChosenFile){
      vaultShowMsg('vaultCreateResult', 'err', 'Please choose a file first.');
      return;
    }
  }

  saveBtn.disabled = true;
  vaultShowMsg('vaultCreateResult', 'loading', 'Checking code availability...');

  try {
    // Don't silently overwrite an existing note
    const existing = await get(child(ref(vaultDb), 'notes/' + code));
    if(existing.exists()){
      vaultShowMsg('vaultCreateResult', 'err', 'This code is already taken. Please choose another one.');
      saveBtn.disabled = false;
      return;
    }

    if(vaultContentType === 'image' || vaultContentType === 'pdf'){
      vaultShowMsg('vaultCreateResult', 'loading', 'Uploading file...');
      const url = await uploadToCloudinary(vaultChosenFile);
      payload = { mode: vaultContentType, content: url, createdAt: Date.now() };
    }

    vaultShowMsg('vaultCreateResult', 'loading', 'Saving your note...');
    await set(ref(vaultDb, 'notes/' + code), payload);

    vaultShowMsg('vaultCreateResult', 'ok',
      `Saved! Your code is <strong>${code}</strong> — write it down, this is the only way back in.`);

    // reset form
    document.getElementById('vaultCreateCode').value = '';
    document.getElementById('vaultTextInput').value = '';
    vaultChosenFile = null;
    document.getElementById('vaultFileInput').value = '';
    const dropText = document.getElementById('vaultFileDropText');
    if(dropText) dropText.textContent = 'Click to choose a file';

  } catch(err){
    console.error(err);
    vaultShowMsg('vaultCreateResult', 'err', 'Something went wrong saving your note. Please try again.');
  } finally {
    saveBtn.disabled = false;
  }
}

window.fetchVaultNote = async function(){
  const rawCode = document.getElementById('vaultAccessCode').value;
  const code = sanitizeVaultCode(rawCode);

  if(!code){
    vaultShowMsg('vaultAccessResult', 'err', 'Please enter a code.');
    return;
  }

  vaultShowMsg('vaultAccessResult', 'loading', 'Looking up your note...');

  try {
    const snap = await get(child(ref(vaultDb), 'notes/' + code));
    if(!snap.exists()){
      vaultShowMsg('vaultAccessResult', 'err', 'No note found for this code. Double-check and try again.');
      return;
    }

    const note = snap.val();
    renderVaultNote(note);

  } catch(err){
    console.error(err);
    vaultShowMsg('vaultAccessResult', 'err', 'Something went wrong fetching your note. Please try again.');
  }
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderVaultNote(note){
  const box = document.getElementById('vaultAccessResult');
  const badgeLabel = { text: 'TEXT NOTE', code: 'CODE SNIPPET', image: 'IMAGE', pdf: 'PDF' }[note.mode] || 'NOTE';
  let bodyHtml = '';

  if(note.mode === 'text'){
    bodyHtml = `<div class="vault-note-text">${escapeHtml(note.content)}</div>`;
  } else if(note.mode === 'code'){
    bodyHtml = `<pre class="vault-note-code"><code>${escapeHtml(note.content)}</code></pre>`;
  } else if(note.mode === 'image'){
    bodyHtml = `<div class="vault-note-image"><img src="${note.content}" alt="Saved note image"></div>`;
  } else if(note.mode === 'pdf'){
    bodyHtml = `<a class="vault-note-pdf-link" href="${note.content}" target="_blank"><i class="fa-solid fa-file-pdf"></i> Open PDF <i class="fa-solid fa-arrow-up-right-from-square" style="margin-left:auto"></i></a>`;
  }

  box.innerHTML = `
    <div class="vault-note-view">
      <div class="vault-note-meta">
        <span class="vault-note-badge">${badgeLabel}</span>
        ${(note.mode === 'text' || note.mode === 'code') ? `<button class="vault-copy-btn" id="vaultCopyBtn"><i class="fa-solid fa-copy"></i> Copy</button>` : ''}
      </div>
      ${bodyHtml}
    </div>
  `;

  if(note.mode === 'text' || note.mode === 'code'){
    document.getElementById('vaultCopyBtn').addEventListener('click', () => {
      navigator.clipboard.writeText(note.content).then(() => {
        const btn = document.getElementById('vaultCopyBtn');
        const old = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
        setTimeout(() => { btn.innerHTML = old; }, 1200);
      });
    });
  }
}