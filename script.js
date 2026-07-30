function pad2(n) {
  return String(n).padStart(2, "0");
}

function buatPhotoSlot(item) {
  const wrap = document.createElement("div");
  wrap.className = "photo-slot";
  wrap.innerHTML = `
    <div class="photo-slot-media">
      <span class="placeholder-label">${item.caption || "[Foto]"}</span>
      <img src="${item.src}" alt="${item.caption || "Foto kenangan"}"
          onerror="this.remove()">
    </div>
    ${item.caption ? `<span class="photo-caption">${item.caption}</span>` : ""}
  `;
  return wrap;
}

function isiNama() {
  if (typeof CONFIG === "undefined") return;
  document.querySelectorAll("[data-nama-pasangan]").forEach((el) => {
    el.textContent = CONFIG.namaPasangan;
  });
  document.querySelectorAll("[data-nama-pengirim]").forEach((el) => {
    el.textContent = CONFIG.namaPengirim;
  });
  document.querySelectorAll("[data-tagline-hero]").forEach((el) => {
    el.textContent = CONFIG.taglineHero;
  });
}

function mulaiHatiMengambang(containerId, jumlah = 14) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const emojis = ["💛", "💕", "✨", "🎈", "💖"];

  function spawn() {
    const el = document.createElement("span");
    el.className = "float-item";
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + "%";
    el.style.animationDuration = 6 + Math.random() * 6 + "s";
    el.style.fontSize = 1 + Math.random() * 1.4 + "rem";
    container.appendChild(el);
    setTimeout(() => el.remove(), 13000);
  }

  for (let i = 0; i < jumlah; i++) {
    setTimeout(spawn, i * 400);
  }
  setInterval(spawn, 1200);
}

function tembakConfetti(containerId, jumlah = 60) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const warna = ["#FF6F91", "#8C6FE6", "#FFC857", "#FFE1EA", "#EDE7FF"];

  for (let i = 0; i < jumlah; i++) {
    const el = document.createElement("span");
    el.className = "confetti-piece";
    el.style.left = Math.random() * 100 + "%";
    el.style.background = warna[Math.floor(Math.random() * warna.length)];
    el.style.animationDuration = 2.5 + Math.random() * 2.5 + "s";
    el.style.animationDelay = Math.random() * 0.6 + "s";
    el.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    container.appendChild(el);
    setTimeout(() => el.remove(), 6000);
  }
}

function initGembok() {
  const countdownEl = document.getElementById("countdown");
  const btnBuka = document.getElementById("btnBuka");
  const iconWrap = document.getElementById("gemboklconWrap");
  const icon = document.getElementById("gembokIcon");
  const hintEl = document.getElementById("gembokHint");
  if (!countdownEl || typeof CONFIG === "undefined") return;

  const target = new Date(CONFIG.tanggalBuka).getTime();

  function bukaTampilan() {
    countdownEl.style.display = "none";
    if (iconWrap) iconWrap.classList.add("is-open");
    if (icon) icon.classList.add("is-open");
    if (btnBuka) {
      btnBuka.disabled = false;
      btnBuka.textContent = "🎉 Buka Kejutan";
      btnBuka.onclick = () => {
        window.location.href = "beranda.html";
      };
    }
    if (hintEl)
      hintEl.textContent = "Waktunya sudah tiba! Klik tombolnya ya 🎁";
  }

  function tick() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      bukaTampilan();
      return;
    }

    const hari = Math.floor(diff / 86400000);
    const jam = Math.floor((diff % 86400000) / 3600000);
    const menit = Math.floor((diff % 3600000) / 60000);
    const detik = Math.floor((diff % 60000) / 1000);

    const elHari = document.getElementById("cdHari");
    const elJam = document.getElementById("cdJam");
    const elMenit = document.getElementById("cdMenit");
    const elDetik = document.getElementById("cdDetik");
    if (elHari) elHari.textContent = pad2(hari);
    if (elJam) elJam.textContent = pad2(jam);
    if (elMenit) elMenit.textContent = pad2(menit);
    if (elDetik) elDetik.textContent = pad2(detik);
  }

  tick();
  const interval = setInterval(() => {
    if (Date.now() >= target) clearInterval(interval);
    tick();
  }, 1000);

  if (btnBuka) {
    btnBuka.addEventListener("click", () => {
      if (btnBuka.disabled) {
        btnBuka.classList.remove("shake");
        void btnBuka.offsetWidth;
        btnBuka.classList.add("shake");
      }
    });
  }
}

function renderPhotoGrid(gridId, data) {
  const grid = document.getElementById(gridId);
  if (!grid || !Array.isArray(data)) return;
  data.forEach((item) => grid.appendChild(buatPhotoSlot(item)));
}

function renderAlasan(listId, data) {
  const list = document.getElementById(listId);
  if (!list || !Array.isArray(data)) return;
  list.innerHTML = data
    .map(
      (item, i) => `
    <li class="alasan-item">
      <span class="alasan-number">${pad2(i + 1)}</span>
      <span class="alasan-emoji">${item.emoji || "💛"}</span>
      <span class="alasan-text">${item.teks}</span>
    </li>
  `,
    )
    .join("");
}

function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("navLinks");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  isiNama();
  initNavToggle();
  initGembok();

  if (document.getElementById("floatingHearts")) {
    mulaiHatiMengambang("floatingHearts");
  }
  if (document.getElementById("confettiBurst")) {
    tembakConfetti("confettiBurst");
  }

  if (typeof FOTO_HERO !== "undefined") renderPhotoGrid("heroGrid", FOTO_HERO);
  if (typeof FOTO_GALERI !== "undefined")
    renderPhotoGrid("galeriGrid", FOTO_GALERI);
  if (typeof FOTO_ALASAN !== "undefined")
    renderPhotoGrid("alasanFotoGrid", FOTO_ALASAN);
  if (typeof FOTO_SURAT !== "undefined")
    renderPhotoGrid("suratFotoKiri", FOTO_SURAT.slice(0, 1));
  if (typeof FOTO_SURAT !== "undefined")
    renderPhotoGrid("suratFotoKanan", FOTO_SURAT.slice(1, 2));
  if (typeof FOTO_PENUTUP !== "undefined")
    renderPhotoGrid("penutupGrid", FOTO_PENUTUP);
  if (typeof DAFTAR_ALASAN !== "undefined")
    renderAlasan("alasanList", DAFTAR_ALASAN);
});
