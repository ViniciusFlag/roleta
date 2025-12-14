const ADMIN_PASSWORD = "amoJesus1";
let isAdmin = false;

function toggleAdminLogin() {
  const login = document.getElementById('adminLogin');
  login.style.display = login.style.display === 'none' ? 'block' : 'none';
}

function loginAdmin() {
  const pass = document.getElementById('adminPass').value;
  if (pass !== ADMIN_PASSWORD) return alert('Senha incorreta');

  isAdmin = true;
  document.getElementById('adminLogin').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'block';
}

function logoutAdmin() {
  isAdmin = false;
  document.getElementById('adminPanel').style.display = 'none';
}

function resetAll() {
  if (!isAdmin) return;

  if (!confirm('Deseja resetar tudo?')) return;

  db.ref('options').set(defaultOptions);
  db.ref('history').set([]);
  db.ref('usersPlayed').set({});

  angle = 0;
  canSpin = true;
  spinning = false;

  const btn = document.querySelector('.spin');
  btn.disabled = false;
  btn.innerText = 'Girar';
  btn.style.opacity = '1';

  alert('Roleta resetada 🎄');
}

function generateHistoryImage() {
  if (!isAdmin) {
    alert('Acesso restrito ao administrador');
    return;
  }

  if (!history.length) {
    alert('Não há histórico para gerar imagem');
    return;
  }

  const width = 900;
  const lineHeight = 40;
  const padding = 40;
  const titleHeight = 90;
  const height =
    titleHeight + padding + history.length * lineHeight + padding;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  /* 🎄 FUNDO NATALINO */
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#0b7a3b');
  gradient.addColorStop(1, '#c1121f');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  /* 🎄 TÍTULO */
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🎄 Família Rodrigues', width / 2, 40);

  /* 📅 DATA */
  ctx.font = '16px Arial';
  ctx.fillText(
    new Date().toLocaleString('pt-BR'),
    width / 2,
    70
  );

  /* 📜 LISTA */
  ctx.textAlign = 'left';
  ctx.font = '20px Arial';
  ctx.textBaseline = 'middle';

  let y = titleHeight + padding;

  history.forEach((item, index) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillText(
      `${index + 1}. ${item.nome} → ${item.item}`,
      padding,
      y
    );
    y += lineHeight;
  });

  /* 💾 DOWNLOAD */
  const link = document.createElement('a');
  link.download = `historico-roleta-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

