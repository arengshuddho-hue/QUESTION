import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
  import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

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

  // Attach functions to window object so HTML buttons can use them
  window.login = function() {
    const pass = document.getElementById('password').value;
    
    // CHANGE THIS PASSWORD TO YOUR OWN SECURE PASSWORD
    if (pass === "admin123") { 
      document.getElementById('loading').style.display = 'block';
      
      const dataRef = ref(db, 'portalData');
      
      onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          dbData = data;
        } else {
          // If database is completely empty, set it to default data
          dbData = defaultData;
          set(dataRef, defaultData);
        }
        
        // Show admin screen
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminScreen').style.display = 'block';
        
        window.renderItems();
      }, (error) => {
        alert("Error connecting to Firebase! Did you configure the API keys properly? Error: " + error.message);
        document.getElementById('loading').style.display = 'none';
      });
    } else {
      alert("Wrong Password!");
    }
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
      const displayStr = typeof item === 'object' ? JSON.stringify(item) : item;
      
      div.innerHTML = `
        <div class="item-content">${displayStr}</div>
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
