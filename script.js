// Data Dummy Katalog Utama
let catalogItems = [
  {
    id: 1,
    title: "Kalkulator Saintifik Casio fx-991EX",
    category: "Elektronik",
    owner: "Rian Prasetyo",
    dept: "Teknik Elektro",
    nim: "22070510012",
    cod: "Perpustakaan Pusat Lt. 2 (Meja Diskusi 4)",
    schedule: "08:00 - 10:00 WIB | 13:00 - 15:00 WIB",
    available: true,
    icon: "fa-calculator"
  },
  {
    id: 2,
    title: "Proyektor Mini Portable HDMI",
    category: "Aksesoris",
    owner: "Dinda Ayu",
    dept: "Ilmu Komunikasi",
    nim: "23080110045",
    cod: "Gedung Dekanat Lt. 1",
    schedule: "10:00 - 12:00 WIB | 14:00 - 16:00 WIB",
    available: true,
    icon: "fa-video"
  },
  {
    id: 3,
    title: "Pointer Presentasi Wireless Digital",
    category: "Aksesoris",
    owner: "Budi Santoso",
    dept: "Informatika",
    nim: "267006111088",
    cod: "Kantin Fakultas Teknik",
    schedule: "08:00 - 16:00 WIB",
    available: true,
    icon: "fa-hand-pointer"
  }
];

let myInventory = [];
let selectedItemForPinjam = null;

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
  renderCatalog();
});

// Switch Sidebar Tabs Dynamically
function switchTab(tabId) {
  // Hide all tabs
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.classList.remove('active'));

  // Remove active styling from all nav items
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));

  // Show clicked tab & set active nav
  document.getElementById('tab-' + tabId).classList.add('active');
  document.getElementById('nav-' + tabId).classList.add('active');

  // Dynamic Header Text Update
  const headerTitle = document.getElementById('header-title');
  const headerSubtitle = document.getElementById('header-subtitle');

  switch(tabId) {
    case 'eksplor':
      headerTitle.innerText = "Eksplor & Pinjam Barang Kampus";
      headerSubtitle.innerText = "Katalog perlengkapan terverifikasi antar-mahasiswa";
      break;
    case 'pinjaman':
      headerTitle.innerText = "Pinjaman Saya (Pelacakan & Timer)";
      headerSubtitle.innerText = "Pantau durasi peminjaman aktif dan status permohonan";
      break;
    case 'permintaan':
      headerTitle.innerText = "Permintaan Masuk (Persetujuan Pemilik)";
      headerSubtitle.innerText = "Tinjau dan konfirmasi permohonan pinjam dari mahasiswa lain";
      break;
    case 'inventaris':
      headerTitle.innerText = "Inventaris Saya & Profil Pemilik";
      headerSubtitle.innerText = "Kelola barang yang kamu sewakan/pinjamkan ke sesama mahasiswa";
      break;
    case 'riwayat':
      headerTitle.innerText = "Riwayat Transaksi & Reputasi Mahasiswa";
      headerSubtitle.innerText = "Catatan transaksi selesai, reputasi kepercayaan, dan ulasan rekan";
      break;
  }
}

// Render Catalog Items
function renderCatalog() {
  const container = document.getElementById('items-container');
  container.innerHTML = '';

  catalogItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-img-wrap">
        <i class="fa-solid ${item.icon}" style="font-size: 64px; color: #64748b;"></i>
        <span class="status-tag">${item.available ? '• Tersedia' : '• Dipinjam'}</span>
      </div>
      <div class="item-body">
        <div class="item-title">${item.title}</div>
        <div class="owner-info">
          <div class="owner-avatar">${item.owner.charAt(0)}</div>
          <div class="owner-meta">
            <p>${item.owner}</p>
            <span>${item.dept} • NIM: ${item.nim}</span>
          </div>
        </div>
        <div class="item-details">
          <div><i class="fa-solid fa-location-dot"></i> Titik COD: ${item.cod}</div>
          <div><i class="fa-solid fa-clock"></i> ${item.schedule}</div>
        </div>
        <button class="btn-action" onclick="openPinjamModal(${item.id})">
          <i class="fa-solid fa-calendar-check"></i> Cek Jadwal & Pinjam
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  document.getElementById('stat-tersedia').innerText = catalogItems.filter(i => i.available).length;
}

// Filter Items
function filterItems() {
  const searchQuery = document.getElementById('search-input').value.toLowerCase();
  const selectedCat = document.getElementById('category-filter').value;
  const availableOnly = document.getElementById('available-only').checked;

  const filtered = catalogItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery) || 
                          item.owner.toLowerCase().includes(searchQuery) ||
                          item.cod.toLowerCase().includes(searchQuery);
    const matchesCat = (selectedCat === 'all') || (item.category === selectedCat);
    const matchesAvailable = !availableOnly || item.available;

    return matchesSearch && matchesCat && matchesAvailable;
  });

  const container = document.getElementById('items-container');
  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color: var(--text-muted); padding:40px;">Tidak ada barang yang sesuai filter.</div>';
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-img-wrap">
        <i class="fa-solid ${item.icon}" style="font-size: 64px; color: #64748b;"></i>
        <span class="status-tag">${item.available ? '• Tersedia' : '• Dipinjam'}</span>
      </div>
      <div class="item-body">
        <div class="item-title">${item.title}</div>
        <div class="owner-info">
          <div class="owner-avatar">${item.owner.charAt(0)}</div>
          <div class="owner-meta">
            <p>${item.owner}</p>
            <span>${item.dept} • NIM: ${item.nim}</span>
          </div>
        </div>
        <div class="item-details">
          <div><i class="fa-solid fa-location-dot"></i> Titik COD: ${item.cod}</div>
          <div><i class="fa-solid fa-clock"></i> ${item.schedule}</div>
        </div>
        <button class="btn-action" onclick="openPinjamModal(${item.id})">
          <i class="fa-solid fa-calendar-check"></i> Cek Jadwal & Pinjam
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function resetFilters() {
  document.getElementById('search-input').value = '';
  document.getElementById('category-filter').value = 'all';
  document.getElementById('time-start').value = '';
  document.getElementById('time-end').value = '';
  document.getElementById('available-only').checked = false;
  renderCatalog();
}

// Toggle Modal
function toggleModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal.classList.contains('open')) {
    modal.classList.remove('open');
  } else {
    modal.classList.add('open');
  }
}

// Modal Pinjam Logic
function openPinjamModal(itemId) {
  selectedItemForPinjam = catalogItems.find(i => i.id === itemId);
  if (selectedItemForPinjam) {
    document.getElementById('modal-pinjam-item-name').innerText = selectedItemForPinjam.title;
    document.getElementById('pinjam-location').value = selectedItemForPinjam.cod;
    toggleModal('modal-pinjam');
  }
}

function submitLoan() {
  const reason = document.getElementById('pinjam-reason').value;
  if (!reason) {
    alert("Harap isi alasan peminjaman terlebih dahulu.");
    return;
  }

  alert(`Permintaan pinjam untuk "${selectedItemForPinjam.title}" telah dikirim ke pemilik (${selectedItemForPinjam.owner})! Status dapat dipantau pada tab "Pinjaman Saya".`);
  toggleModal('modal-pinjam');
  document.getElementById('pinjam-reason').value = '';
  switchTab('pinjaman');
}

// Add New Inventory Item
function addNewItem() {
  const name = document.getElementById('input-item-name').value;
  const category = document.getElementById('input-item-category').value;
  const location = document.getElementById('input-item-location').value;

  if (!name) {
    alert("Harap isi nama barang terlebih dahulu.");
    return;
  }

  const newItem = {
    id: catalogItems.length + 1,
    title: name,
    category: category,
    owner: document.getElementById('user-name-display').innerText,
    dept: "Informatika",
    nim: "267006111075",
    cod: location,
    schedule: "08:00 - 16:00 WIB",
    available: true,
    icon: category === 'Elektronik' ? 'fa-laptop-code' : 'fa-box-open'
  };

  catalogItems.push(newItem);
  myInventory.push(newItem);

  renderCatalog();
  renderMyInventory();
  toggleModal('modal-tambah');

  document.getElementById('input-item-name').value = '';
  document.getElementById('badge-inventaris-count').innerText = `${myInventory.length} Barang`;
  alert("Barang berhasil ditambahkan ke inventaris Anda dan publik!");
}

function renderMyInventory() {
  const container = document.getElementById('my-inventory-container');
  
  if (myInventory.length === 0) {
    container.innerHTML = `
      <div class="card-box empty-state">
        <i class="fa-solid fa-boxes-packing"></i>
        <h4 style="font-size:15px; font-weight:700; margin-bottom:4px;">Belum ada barang di inventaris Anda</h4>
        <p style="font-size:12px; color:var(--text-muted);">Daftarkan peralatan kuliah Anda yang dapat dipinjamkan kepada rekan mahasiswa sekampus.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `<div class="items-grid"></div>`;
  const grid = container.querySelector('.items-grid');

  myInventory.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-img-wrap">
        <i class="fa-solid ${item.icon}" style="font-size: 64px; color: #64748b;"></i>
        <span class="status-tag">• Milik Saya</span>
      </div>
      <div class="item-body">
        <div class="item-title">${item.title}</div>
        <div class="item-details">
          <div><i class="fa-solid fa-location-dot"></i> Titik COD: ${item.cod}</div>
          <div><i class="fa-solid fa-clock"></i> ${item.schedule}</div>
        </div>
        <button class="btn-action" style="background:#10b981;" onclick="alert('Status barang diperbarui!')">
          <i class="fa-solid fa-toggle-on"></i> Status: Tersedia Dipinjam
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Request Table Approval Actions
function approveRequest(id) {
  const actionsDiv = document.getElementById(`request-actions-${id}`);
  actionsDiv.innerHTML = `<span class="badge badge-green" style="font-size:12px; padding:6px 12px;"><i class="fa-solid fa-check"></i> Pinjaman Disetujui</span>`;
}

function rejectRequest(id) {
  const actionsDiv = document.getElementById(`request-actions-${id}`);
  actionsDiv.innerHTML = `<span class="badge" style="background:#fee2e2; color:#ef4444; font-size:12px; padding:6px 12px;"><i class="fa-solid fa-xmark"></i> Permintaan Ditolak</span>`;
}

// Switch Demo User
function switchUser(name, nim, dept, avatar) {
  document.getElementById('user-name-display').innerText = name;
  document.getElementById('user-nim-display').innerText = `${nim} • ${dept}`;
  document.getElementById('user-avatar').innerText = avatar;

  document.getElementById('my-profile-name').innerText = name;
  document.getElementById('my-profile-nim').innerText = `${nim} • ${dept}`;
  document.getElementById('my-profile-avatar').innerText = avatar;

  toggleModal('modal-login');
  alert(`Akun berhasil diganti ke ${name}!`);
}