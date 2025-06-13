function getUsers(){
  return JSON.parse(localStorage.getItem('users') || '[]');
}
function setUsers(u){
  localStorage.setItem('users', JSON.stringify(u));
}
function getIncidents(){
  return JSON.parse(localStorage.getItem('incidents') || '[]');
}
function setIncidents(i){
  localStorage.setItem('incidents', JSON.stringify(i));
}
function getCurrentUser(){
  return JSON.parse(localStorage.getItem('currentUser') || 'null');
}
function setCurrentUser(u){
  localStorage.setItem('currentUser', JSON.stringify(u));
}
function initRegister(){
  const form=document.getElementById('registerForm');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const data=Object.fromEntries(new FormData(form));
    const users=getUsers();
    if(users.some(u=>u.email===data.email)){
      alert('E-mail j\u00e1 cadastrado');
      return;
    }
    users.push(data);
    setUsers(users);
    setCurrentUser(data);
    location.href='dashboard.html';
  });
}
function initLogin(){
  const form=document.getElementById('loginForm');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const data=Object.fromEntries(new FormData(form));
    const user=getUsers().find(u=>u.email===data.email && u.password===data.password);
    if(!user){
      alert('Credenciais inv\u00e1lidas');
      return;
    }
    setCurrentUser(user);
    location.href='dashboard.html';
  });
}
function requireAuth(){
  if(!getCurrentUser()) location.href='login.html';
}
function initDashboard(){
  requireAuth();
  const map=L.map('map').setView([-15.8,-47.9],4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'\u00a9 OpenStreetMap'}).addTo(map);
  const form=document.getElementById('fireForm');
  const list=document.getElementById('fireList');
  loadIncidents(map,list);
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const data=Object.fromEntries(new FormData(form));
    const latlng=map.getCenter();
    data.lat=latlng.lat;
    data.lng=latlng.lng;
    data.user=getCurrentUser().email;
    const incidents=getIncidents();
    incidents.push(data);
    setIncidents(incidents);
    form.reset();
    loadIncidents(map,list);
  });
}
function loadIncidents(map,list){
  list.innerHTML='';
  getIncidents().forEach(inc=>{
    const text=`${inc.tipo} - ${inc.gravidade} - ${inc.descricao}`;
    const li=document.createElement('li');
    li.textContent=text;
    list.appendChild(li);
    if(map){
      L.marker([inc.lat,inc.lng]).addTo(map).bindPopup(text);
    }
  });
}
function initHome(){
  const map=L.map('map').setView([-15.8,-47.9],4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'\u00a9 OpenStreetMap'}).addTo(map);
  loadIncidents(map,document.createElement('div'));
}
