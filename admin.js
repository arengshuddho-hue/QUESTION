﻿import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

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
const auth = getAuth(app);

let dbData = {};
let firstLoad = true;

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById('loginScreen').style.display = 'none';

    if (firstLoad) {
      firstLoad = false;
      // Show transition screen for 3 seconds
      document.getElementById('transitionScreen').style.display = 'flex';
      document.getElementById('adminScreen').style.display = 'none';

      setTimeout(() => {
        document.getElementById('transitionScreen').style.display = 'none';
        document.getElementById('adminScreen').style.display = 'block';
      }, 3000);
    }

    onValue(ref(db, 'portalData'), (snapshot) => {
      if (snapshot.val()) dbData = snapshot.val();
      window.renderItems();
    });
  } else {
    firstLoad = true;
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('adminScreen').style.display = 'none';
    document.getElementById('transitionScreen').style.display = 'none';
  }
});

window.login = function() {
  const email = document.getElementById('adminEmail').value.trim();
  const pass = document.getElementById('password').value;
  
  if(!email || !pass) return alert("Please enter both Email and Password!");
  
  document.getElementById('loading').style.display = 'block';
  
  signInWithEmailAndPassword(auth, email, pass)
    .then(() => {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('password').value = ''; 
    })
    .catch((error) => {
      document.getElementById('loading').style.display = 'none';
      alert("Login Failed: " + error.message);
    });
};

window.logout = function() {
  signOut(auth).then(() => {
    alert("Logged out successfully!");
  });
};

window.renderItems = function() {
  const category = document.getElementById('categorySelect').value;
  const items = dbData[category] || [];
  const listEl = document.getElementById('itemList');
  
  if(category === 'TICKER') {
    document.getElementById('itemType').disabled = true;
    document.getElementById('itemTitle').placeholder = "(Not needed for Ticker)";
    document.getElementById('itemContent').placeholder = "Enter scrolling text message here...";
  } else {
    document.getElementById('itemType').disabled = false;
    document.getElementById('itemTitle').placeholder = "Enter title to display";
    document.getElementById('itemContent').placeholder = "Paste your link here, or write your text...";
  }
  
  listEl.innerHTML = '';
  if (items.length === 0) {
    listEl.innerHTML = '<div style="color:#888; text-align:center; padding: 20px;">No items found.</div>';
    return;
  }
  
  items.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'item';
    
    let displayStr = '';
    if (typeof item === 'string') {
      displayStr = `<span style="color:#888;">[Legacy Data]</span> ${item}`;
    } else {
      const typeIcon = item.type === 'link' ? '🔗' : item.type === 'text' ? '📝' : item.type === 'image' ? '🖼️' : '🔢';
      displayStr = `<strong>${item.title || '(No Title)'}</strong> <span style="color:#888; font-size:12px;">${typeIcon} ${item.type || 'Ticker'}</span><br><small style="color:#aaa;">${item.content}</small>`;
    }
    
    div.innerHTML = `
      <div class="item-content">${displayStr}</div>
      <button class="btn btn-danger" onclick="deleteItem('${category}', ${index})"><i class="fa-solid fa-trash"></i> Delete</button>
    `;
    listEl.appendChild(div);
  });
};

window.addItem = function() {
  const category = document.getElementById('categorySelect').value;
  const type = document.getElementById('itemType').value;
  const title = document.getElementById('itemTitle').value.trim();
  const content = document.getElementById('itemContent').value.trim();
  
  if (!content) return alert('Please provide Content or Link!');
  if (category !== 'TICKER' && !title) return alert('Please provide a Title!');
  
  let valToSave = { type, title, content };
  if (category === 'TICKER') {
    valToSave = { type: 'ticker', title: 'Notice', content: content };
  }
  
  if (!dbData[category]) dbData[category] = [];
  dbData[category].push(valToSave);
  
  set(ref(db, 'portalData'), dbData).then(() => {
    document.getElementById('itemTitle').value = '';
    document.getElementById('itemContent').value = '';
    alert('Item Added Successfully!');
  });
};

window.deleteItem = function(category, index) {
  if (confirm('Are you sure you want to delete this?')) {
    dbData[category].splice(index, 1);
    set(ref(db, 'portalData'), dbData);
  }
};
