let canSpin = true;
let options = [];
let history = [];
let angle = 0;
let spinning = false;
let winner = null;

const userId = localStorage.getItem('userId') || crypto.randomUUID();
localStorage.setItem('userId', userId);

const defaultOptions = [
  'arroz','arroz','arroz a grega','farofa','farofa',
  'salada de maionese','salada de maionese','salada verde',
  'sobremesa','sobremesa','sobremesa','sobremesa','sobremesa','sobremesa',
  'salpicão','salada de grão de bico'
];

db.ref('options').on('value', s => {
  options = s.val() || [];
  drawWheel();
});

db.ref('history').on('value', s => {
  history = s.val() || [];
  renderHistory();
});

db.ref('options').once('value', s => {
  if (!s.exists()) db.ref('options').set(defaultOptions);
});

db.ref(`usersPlayed/${userId}`).once('value', snap => {
  if (snap.exists()) {
    canSpin = false;
    disableSpin();
  }
});

const wheel=document.getElementById('wheel');
const ctx=wheel.getContext('2d');

function drawWheel(){
  ctx.clearRect(0,0,360,360);
  if(!options.length)return;

  const r=170,c=180;
  const slice=2*Math.PI/options.length;
  const colors=['#c1121f','#0b7a3b'];

  options.forEach((t,i)=>{
    const a=angle+i*slice;
    ctx.beginPath();
    ctx.moveTo(c,c);
    ctx.arc(c,c,r,a,a+slice);
    ctx.fillStyle=colors[i%2];
    ctx.fill();

    ctx.save();
    ctx.translate(c,c);
    ctx.rotate(a+slice/2);
    ctx.fillStyle='#fff';
    ctx.font='bold 14px Arial';
    ctx.textAlign='right';
    ctx.fillText(t, r-10,5);
    ctx.restore();
  });
}

/* 🎡 GIRO */
function spinWheel() {
  if (!canSpin) {
    alert('Você já girou a roleta 🎄');
    return;
  }

  if (!options.length || spinning) return;

  spinning = true;

  let t = 0;
  const total = 3000;

  function anim() {
    t += 30;
    angle += 0.3;
    drawWheel();

    if (t < total) {
      requestAnimationFrame(anim);
    } else {
      finishSpin();
    }
  }

  anim();
}

function finishSpin(){
  const slice = 2 * Math.PI / options.length;
  const idx = Math.floor((2 * Math.PI - angle % (2 * Math.PI)) / slice) % options.length;

  winner = options[idx];

  document.getElementById('winnerText').innerText = winner;
  document.getElementById('resultModal').classList.add('active');
  startConfetti();

  spinning = false;
}

const confettiCanvas=document.getElementById('confetti');
const cctx=confettiCanvas.getContext('2d');
confettiCanvas.width=innerWidth;
confettiCanvas.height=innerHeight;
let confettiRunning=false;
let pieces=[];

function startConfetti(){
  confettiRunning=true;
  pieces=[...Array(120)].map(()=>({
    x:Math.random()*confettiCanvas.width,
    y:Math.random()*confettiCanvas.height,
    r:Math.random()*6+4,
    d:Math.random()*3+2,
    c:Math.random()>0.5?'#c1121f':'#0b7a3b'
  }));
  animateConfetti();
}

function stopConfetti(){
  confettiRunning=false;
  cctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
}

function animateConfetti(){
  if(!confettiRunning)return;
  cctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
  pieces.forEach(p=>{
    cctx.beginPath();
    cctx.fillStyle=p.c;
    cctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    cctx.fill();
    p.y+=p.d;
    if(p.y>confettiCanvas.height)p.y=0;
  });
  requestAnimationFrame(animateConfetti);
}

/* 📜 HISTÓRICO */
function confirmWinner() {
  const name = document.getElementById('winnerName').value.trim();
  const slice = 2 * Math.PI / options.length;
  const idx = Math.floor((2 * Math.PI - angle % (2 * Math.PI)) / slice) % options.length;

  if (!name) return alert('Digite um nome');

  options.splice(idx, 1);
  db.ref('options').set(options);

  history.unshift({ nome: name, item: winner });
  db.ref('history').set(history);

  document.getElementById('winnerName').value = '';
  document.getElementById('resultModal').classList.remove('active');

    // ✅ MARCA QUE O USUÁRIO JÁ JOGOU (AGORA SIM)
  db.ref(`usersPlayed/${userId}`).set(true);
  canSpin = false;
  disableSpin();
    stopConfetti();
}

function renderHistory() {
  const el = document.getElementById('historyList');
  el.innerHTML = '';
  history.forEach(h => {
    el.innerHTML += `<div>${h.nome} → ${h.item}</div>`;
  });
}

function disableSpin() {
  const btn = document.querySelector('.spin');
  btn.disabled = true;
  btn.innerText = '🎁 Você já participou';
  btn.style.opacity = '0.6';
}
