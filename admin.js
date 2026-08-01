﻿import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
  import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
  import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

  // ==========================================
  // REPLACE THIS WITH YOUR FIREBASE CONFIG
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

  let dbData = {};

  const auth = getAuth(app);

  // Authentication State Observer
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, show dashboard
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('adminScreen').style.display = 'block';
      
      // Load Database Data
      const dataRef = ref(db, 'portalData');
      onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          dbData = data;
        } else {
          dbData = defaultData;
          set(dataRef, defaultData);
        }
        window.renderItems();
      }, (error) => {
        alert("Database connection error: " + error.message);
      });
    } else {
      // User is signed out, show login
      document.getElementById('loginScreen').style.display = 'block';
      document.getElementById('adminScreen').style.display = 'none';
      document.getElementById('loading').style.display = 'none';
    }
  });

  // Attach functions to window object so HTML buttons can use them
  window.login = function() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    
    if (!email || !pass) {
      alert("Please enter both email and password.");
      return;
    }
    
    document.getElementById('loading').style.display = 'block';
    
    signInWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        // Signed in successfully, onAuthStateChanged will trigger
      })
      .catch((error) => {
        document.getElementById('loading').style.display = 'none';
        alert("Login Failed: " + error.message);
      });
  };

  window.logout = function() {
    signOut(auth).then(() => {
      alert("Logged out successfully.");
      document.getElementById('email').value = '';
      document.getElementById('password').value = '';
    }).catch((error) => {
      alert("Logout error: " + error.message);
    });
  };

  window.renderItems = function() {
    const category = document.getElementById('categorySelect').value;
    const items = dbData[category] || [];
    const listEl = document.getElementById('itemList');
    
    listEl.innerHTML = '';
    
    if (items.length === 0) {
      listEl.innerHTML = '<div style="color:#888; text-align:center;">No items found in this category.</div>';
      return;
    }
    
    items.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'item';
      
      let displayHtml = '';
      if (typeof item === 'object' && item !== null) {
        if (item.title && item.type) {
           // Ticker / Notice format
           displayHtml = `<strong>${item.title} <span style="background: rgba(88, 166, 255, 0.15); color: #58a6ff; padding: 3px 8px; border-radius: 12px; font-size: 11px; margin-left: 10px; font-weight: 600; letter-spacing: 0.5px;">${item.type}</span></strong> <br> <small style="margin-top: 8px;">${item.content}</small>`;
        } else if (item.label && item.file) {
           // Link format
           displayHtml = `<strong>${item.label}</strong> <br> <small style="margin-top: 8px;"><i class="fa-solid fa-link" style="color: #58a6ff; margin-right: 6px;"></i> <a href="${item.file}" target="_blank" style="color: #58a6ff; text-decoration: none;">${item.file}</a></small>`;
        } else if (item.name && item.file) {
           // Faculty format
           displayHtml = `<strong>${item.name}</strong> <br> <small style="margin-top: 8px;"><i class="fa-solid fa-user-tie" style="color: #58a6ff; margin-right: 6px;"></i> <a href="${item.file}" target="_blank" style="color: #58a6ff; text-decoration: none;">${item.label || item.file}</a></small>`;
        } else {
           // Fallback for other objects
           let props = Object.keys(item).map(k => `<span style="color: #8b949e;">${k}:</span> ${item[k]}`).join(' <span style="color:#30363d">|</span> ');
           displayHtml = `<strong>Data Object</strong> <br> <small style="margin-top: 8px;">${props}</small>`;
        }
      } else {
        if (typeof item === 'string' && (item.startsWith('http') || item.includes('.pdf') || item.includes('.png') || item.includes('.jpg'))) {
           // Generic file link
           displayHtml = `<strong>Resource Link</strong> <br> <small style="margin-top: 8px;"><i class="fa-solid fa-paperclip" style="color: #58a6ff; margin-right: 6px;"></i> <a href="${item}" target="_blank" style="color: #58a6ff; text-decoration: none;">${item}</a></small>`;
        } else {
           // Plain text
           displayHtml = `<strong>Text Item</strong> <br> <small style="margin-top: 8px;">${item}</small>`;
        }
      }
      
      div.innerHTML = `
        <div class="item-content">${displayHtml}</div>
        <button class="btn btn-danger" onclick="deleteItem('${category}', ${index})"><i class="fa-solid fa-trash"></i> Delete</button>
      `;
      listEl.appendChild(div);
    });
  };

  window.addItem = function() {
    const category = document.getElementById('categorySelect').value;
    let rawVal = document.getElementById('newItemData').value.trim();
    
    if (!rawVal) return alert('Please enter some data!');
    
    let valToSave = rawVal;
    
    if (rawVal.startsWith('{') && rawVal.endsWith('}')) {
      try { valToSave = JSON.parse(rawVal); } 
      catch (e) { return alert('Invalid JSON format! Please check your syntax.'); }
    }
    
    if (!dbData[category]) dbData[category] = [];
    dbData[category].push(valToSave);
    
    // Save directly to Firebase!
    set(ref(db, 'portalData'), dbData).then(() => {
      document.getElementById('newItemData').value = '';
      alert('Item added and saved live!');
    });
  };

  window.deleteItem = function(category, index) {
    if (confirm('Are you sure you want to delete this item?')) {
      dbData[category].splice(index, 1);
      
      // Save directly to Firebase!
      set(ref(db, 'portalData'), dbData).then(() => {
        // UI will update automatically because of onValue listener
      });
    }
  };
