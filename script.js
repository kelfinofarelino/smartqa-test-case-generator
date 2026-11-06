/* ============================================================
   SmartQA – Test Case Generator  |  script.js
   ============================================================ */

'use strict';

/* ----------------------------------------------------------
   TEMPLATE LIBRARY
   ---------------------------------------------------------- */
const TEMPLATES = {
  login: `Sebagai pengguna terdaftar, saya ingin dapat login ke sistem menggunakan email dan password yang valid agar dapat mengakses dashboard akun saya.

Aktor: Pengguna terdaftar
Field: Email (format valid), Password (min 8 karakter)
Aksi: Klik tombol "Login"
Kondisi: Akun aktif, tidak dikunci
Sistem: Redirect ke halaman dashboard setelah login berhasil`,

  checkout: `Sebagai pelanggan, saya ingin dapat melakukan checkout keranjang belanja saya dengan memilih metode pembayaran dan alamat pengiriman agar pesanan dapat diproses.

Aktor: Pelanggan yang sudah login
Field: Alamat pengiriman, Metode pembayaran (Kartu Kredit / Transfer Bank / COD), Kode voucher (opsional)
Aksi: Klik tombol "Bayar Sekarang"
Kondisi: Keranjang tidak kosong, stok tersedia
Sistem: Membuat order, mengirim email konfirmasi, mengurangi stok`,

  reset: `Sebagai pengguna, saya ingin dapat mereset password saya melalui email agar dapat mengakses kembali akun saya ketika lupa password.

Aktor: Pengguna terdaftar
Field: Email terdaftar, Password baru (min 8 karakter), Konfirmasi password baru
Aksi: Klik "Kirim Link Reset", lalu set password baru
Kondisi: Email terdaftar di sistem, link reset berlaku 1 jam
Sistem: Mengirim email reset, memperbarui password di database`,

  register: `Sebagai calon pengguna, saya ingin dapat mendaftar akun baru menggunakan email dan password agar dapat menggunakan layanan.

Aktor: Pengguna baru (belum memiliki akun)
Field: Nama lengkap, Email, Password (min 8 karakter), Konfirmasi password, Nomor telepon (opsional)
Aksi: Klik tombol "Daftar"
Kondisi: Email belum terdaftar di sistem
Sistem: Mengirim email verifikasi, menyimpan data akun`,

  search: `Sebagai pengguna, saya ingin dapat mencari produk menggunakan kata kunci di kolom pencarian agar dapat menemukan produk yang saya butuhkan dengan cepat.

Aktor: Pengguna (login maupun tamu)
Field: Kolom pencarian (min 1 karakter), Filter kategori (opsional), Sorting (opsional)
Aksi: Ketik kata kunci lalu tekan Enter atau klik ikon cari
Kondisi: Sistem terhubung ke database produk
Sistem: Menampilkan hasil pencarian relevan, menampilkan pesan "Produk tidak ditemukan" jika tidak ada hasil`
};

/* ----------------------------------------------------------
   TEST CASE BLUEPRINTS
   Per-template definitions for all three test types.
   Each item: { type, scenario, steps, expected }
   ---------------------------------------------------------- */
const TC_DATA = {
  login: {
    positive: [
      {
        scenario: 'Login berhasil dengan kredensial valid',
        steps: '1. Buka halaman login\n2. Masukkan email terdaftar yang valid\n3. Masukkan password yang benar (≥8 karakter)\n4. Klik tombol "Login"',
        expected: 'Pengguna diarahkan ke halaman dashboard. Sesi login aktif.'
      },
      {
        scenario: 'Login berhasil dan sesi tersimpan (Remember Me)',
        steps: '1. Buka halaman login\n2. Isi email dan password valid\n3. Centang opsi "Remember Me"\n4. Klik "Login"\n5. Tutup browser, buka kembali',
        expected: 'Pengguna langsung masuk tanpa perlu login ulang. Cookie sesi tersimpan.'
      }
    ],
    negative: [
      {
        scenario: 'Login gagal dengan password salah',
        steps: '1. Buka halaman login\n2. Masukkan email valid\n3. Masukkan password yang salah\n4. Klik "Login"',
        expected: 'Muncul pesan error "Email atau password salah." Pengguna tidak diarahkan ke dashboard.'
      },
      {
        scenario: 'Login gagal dengan email tidak terdaftar',
        steps: '1. Buka halaman login\n2. Masukkan email yang tidak terdaftar\n3. Masukkan sembarang password\n4. Klik "Login"',
        expected: 'Muncul pesan error "Akun tidak ditemukan." Form tidak dikirim ke server.'
      },
      {
        scenario: 'Login gagal dengan field kosong',
        steps: '1. Buka halaman login\n2. Kosongkan field email dan password\n3. Klik "Login"',
        expected: 'Validasi form menampilkan pesan "Email wajib diisi" dan "Password wajib diisi".'
      }
    ],
    edge: [
      {
        scenario: 'Login dengan email menggunakan huruf kapital',
        steps: '1. Masukkan email dengan campuran huruf kapital (contoh: User@Email.COM)\n2. Masukkan password benar\n3. Klik "Login"',
        expected: 'Sistem memperlakukan email sebagai case-insensitive. Login berhasil.'
      },
      {
        scenario: 'Login gagal setelah 5 percobaan salah (Account Lock)',
        steps: '1. Masukkan password salah sebanyak 5 kali berturut-turut\n2. Coba login kembali',
        expected: 'Akun terkunci sementara. Muncul pesan "Akun dikunci selama 15 menit karena terlalu banyak percobaan."'
      },
      {
        scenario: 'Login dengan spasi di awal/akhir email',
        steps: '1. Masukkan email dengan spasi di awal atau akhir (contoh: " user@email.com ")\n2. Masukkan password benar\n3. Klik "Login"',
        expected: 'Sistem melakukan trim spasi secara otomatis. Login tetap berhasil.'
      }
    ]
  },
  checkout: {
    positive: [
      {
        scenario: 'Checkout berhasil dengan kartu kredit valid',
        steps: '1. Tambahkan produk ke keranjang\n2. Buka halaman checkout\n3. Isi alamat pengiriman lengkap\n4. Pilih metode pembayaran "Kartu Kredit"\n5. Masukkan detail kartu valid\n6. Klik "Bayar Sekarang"',
        expected: 'Order berhasil dibuat. Email konfirmasi dikirim. Stok produk berkurang.'
      },
      {
        scenario: 'Checkout berhasil menggunakan kode voucher diskon',
        steps: '1. Tambahkan produk ke keranjang\n2. Buka checkout\n3. Masukkan kode voucher yang valid\n4. Verifikasi harga berkurang\n5. Selesaikan pembayaran',
        expected: 'Diskon diterapkan sesuai nilai voucher. Order dibuat dengan harga setelah diskon.'
      }
    ],
    negative: [
      {
        scenario: 'Checkout gagal dengan kartu kredit kedaluwarsa',
        steps: '1. Pilih produk dan buka checkout\n2. Isi alamat pengiriman\n3. Pilih kartu kredit\n4. Masukkan detail kartu yang sudah kedaluwarsa\n5. Klik "Bayar Sekarang"',
        expected: 'Muncul pesan error "Kartu kredit kedaluwarsa." Transaksi tidak diproses.'
      },
      {
        scenario: 'Checkout gagal dengan keranjang kosong',
        steps: '1. Kosongkan keranjang belanja\n2. Coba akses halaman checkout secara langsung',
        expected: 'Sistem redirect pengguna ke halaman keranjang dengan pesan "Keranjang Anda kosong."'
      },
      {
        scenario: 'Checkout gagal dengan kode voucher tidak valid',
        steps: '1. Buka checkout\n2. Masukkan kode voucher yang salah/kedaluwarsa\n3. Klik "Terapkan"',
        expected: 'Muncul pesan "Kode voucher tidak valid atau sudah kedaluwarsa." Harga tidak berubah.'
      }
    ],
    edge: [
      {
        scenario: 'Checkout ketika stok produk habis saat proses pembayaran',
        steps: '1. Tambahkan produk yang hampir habis ke keranjang\n2. Mulai proses checkout\n3. Simulasikan stok habis di tengah proses',
        expected: 'Sistem menampilkan pesan "Maaf, stok produk telah habis." Order tidak dibuat.'
      },
      {
        scenario: 'Checkout dengan jumlah item melebihi stok tersedia',
        steps: '1. Coba tambahkan produk melebihi jumlah stok yang tersedia',
        expected: 'Sistem membatasi input maksimum sesuai stok. Tombol tambah nonaktif saat batas tercapai.'
      },
      {
        scenario: 'Checkout dengan koneksi internet terputus saat konfirmasi',
        steps: '1. Mulai proses checkout\n2. Putuskan koneksi internet sebelum konfirmasi akhir\n3. Klik "Bayar Sekarang"',
        expected: 'Sistem menampilkan pesan error koneksi. Order tidak terduplikasi saat koneksi pulih.'
      }
    ]
  },
  reset: {
    positive: [
      {
        scenario: 'Reset password berhasil melalui email valid',
        steps: '1. Klik "Lupa Password"\n2. Masukkan email terdaftar\n3. Klik "Kirim Link Reset"\n4. Buka email, klik link reset\n5. Masukkan password baru yang valid\n6. Konfirmasi password baru\n7. Klik "Simpan Password"',
        expected: 'Password berhasil diperbarui. Pengguna dapat login dengan password baru.'
      }
    ],
    negative: [
      {
        scenario: 'Reset password dengan email tidak terdaftar',
        steps: '1. Klik "Lupa Password"\n2. Masukkan email yang tidak terdaftar\n3. Klik "Kirim Link Reset"',
        expected: 'Muncul pesan "Email tidak ditemukan di sistem kami." Email tidak dikirim.'
      },
      {
        scenario: 'Reset password dengan password baru yang tidak sesuai konfirmasi',
        steps: '1. Buka link reset yang valid\n2. Masukkan password baru\n3. Masukkan konfirmasi password yang berbeda\n4. Klik "Simpan"',
        expected: 'Muncul pesan validasi "Password dan konfirmasi password tidak cocok."'
      },
      {
        scenario: 'Reset password gagal dengan link yang sudah kedaluwarsa',
        steps: '1. Buka link reset yang sudah lebih dari 1 jam\n2. Coba masukkan password baru',
        expected: 'Muncul halaman error "Link reset sudah kedaluwarsa." Pengguna diminta mengirim ulang.'
      }
    ],
    edge: [
      {
        scenario: 'Kirim permintaan reset password berulang kali',
        steps: '1. Klik "Lupa Password" dan kirim 3 permintaan berturut-turut ke email sama',
        expected: 'Hanya link terbaru yang valid. Link sebelumnya otomatis tidak berlaku.'
      },
      {
        scenario: 'Reset password dengan password baru sama dengan password lama',
        steps: '1. Buka link reset\n2. Masukkan password yang identik dengan password sebelumnya\n3. Klik "Simpan"',
        expected: 'Sistem menampilkan pesan "Password baru tidak boleh sama dengan password lama."'
      }
    ]
  },
  register: {
    positive: [
      {
        scenario: 'Registrasi berhasil dengan data lengkap dan valid',
        steps: '1. Buka halaman registrasi\n2. Isi nama lengkap, email baru, password (≥8 karakter)\n3. Konfirmasi password\n4. Klik "Daftar"\n5. Cek email verifikasi',
        expected: 'Akun berhasil dibuat. Email verifikasi dikirim. Pengguna diarahkan ke halaman konfirmasi.'
      }
    ],
    negative: [
      {
        scenario: 'Registrasi gagal dengan email sudah terdaftar',
        steps: '1. Isi form registrasi dengan email yang sudah dipakai akun lain\n2. Klik "Daftar"',
        expected: 'Muncul pesan "Email sudah terdaftar. Silakan login atau gunakan email lain."'
      },
      {
        scenario: 'Registrasi gagal dengan format email tidak valid',
        steps: '1. Masukkan email tidak valid (contoh: "user@" atau "useremail")\n2. Klik "Daftar"',
        expected: 'Validasi menampilkan "Format email tidak valid."'
      },
      {
        scenario: 'Registrasi gagal dengan password terlalu pendek',
        steps: '1. Masukkan password kurang dari 8 karakter\n2. Klik "Daftar"',
        expected: 'Muncul pesan "Password minimal 8 karakter."'
      }
    ],
    edge: [
      {
        scenario: 'Registrasi dengan nama lengkap yang mengandung karakter khusus',
        steps: '1. Masukkan nama lengkap dengan karakter seperti <script> atau SQL injection\n2. Klik "Daftar"',
        expected: 'Sistem melakukan sanitasi input. Akun tidak dibuat dengan karakter berbahaya.'
      },
      {
        scenario: 'Submit form registrasi dua kali (double submit)',
        steps: '1. Isi form registrasi valid\n2. Klik tombol "Daftar" dua kali dengan cepat',
        expected: 'Hanya satu akun yang dibuat. Tidak ada duplikasi data.'
      }
    ]
  },
  search: {
    positive: [
      {
        scenario: 'Pencarian berhasil dengan kata kunci yang relevan',
        steps: '1. Masukkan kata kunci yang ada dalam database produk (contoh: "sepatu")\n2. Tekan Enter atau klik ikon cari',
        expected: 'Daftar produk relevan ditampilkan dengan nama, harga, dan gambar produk.'
      },
      {
        scenario: 'Pencarian dengan filter kategori menghasilkan hasil akurat',
        steps: '1. Masukkan kata kunci\n2. Pilih filter kategori (contoh: "Sepatu > Pria")\n3. Klik "Terapkan Filter"',
        expected: 'Hanya produk dalam kategori yang dipilih yang ditampilkan.'
      }
    ],
    negative: [
      {
        scenario: 'Pencarian dengan kata kunci yang tidak ada di database',
        steps: '1. Masukkan kata kunci yang tidak ada (contoh: "xyzproduktidakada123")\n2. Tekan Enter',
        expected: 'Halaman menampilkan pesan "Produk tidak ditemukan" dengan saran pencarian lain.'
      },
      {
        scenario: 'Pencarian dengan field kosong',
        steps: '1. Kosongkan kolom pencarian\n2. Tekan Enter atau klik tombol cari',
        expected: 'Sistem tidak melakukan pencarian atau menampilkan semua produk / pesan validasi.'
      }
    ],
    edge: [
      {
        scenario: 'Pencarian dengan karakter khusus atau skrip berbahaya',
        steps: '1. Masukkan karakter seperti <script>alert(1)</script> atau \' OR 1=1 --\n2. Tekan Enter',
        expected: 'Input disanitasi. Tidak ada eksekusi script. Tampil pesan "Tidak ada hasil" atau hasil kosong.'
      },
      {
        scenario: 'Pencarian dengan kata kunci sangat panjang (>200 karakter)',
        steps: '1. Tempelkan teks lebih dari 200 karakter ke kolom pencarian\n2. Tekan Enter',
        expected: 'Sistem membatasi panjang input atau memotong query. Tidak ada error pada server.'
      },
      {
        scenario: 'Pencarian dengan variasi ejaan (typo tolerance)',
        steps: '1. Masukkan kata kunci dengan salah ketik ringan (contoh: "sepatuu" atau "spatu")',
        expected: 'Sistem menampilkan saran "Apakah maksud Anda: sepatu?" atau hasil produk terdekat.'
      }
    ]
  }
};

/* ----------------------------------------------------------
   GENERIC TEST CASE BUILDER
   Parses free-form feature text into structured test cases
   when no matching template key is found.
   ---------------------------------------------------------- */
function buildGenericTestCases(featureText) {
  const lines = featureText.split('\n').map(l => l.trim()).filter(Boolean);
  const title = lines[0] || 'Fitur';

  return {
    positive: [
      {
        scenario: `${title} – Skenario sukses dengan input valid`,
        steps: `1. Buka halaman/fitur yang diuji\n2. Masukkan semua data yang valid dan lengkap\n3. Klik tombol aksi utama`,
        expected: 'Sistem memproses permintaan dengan sukses. Respons sesuai yang diharapkan.'
      },
      {
        scenario: `${title} – Alur utama selesai tanpa error`,
        steps: `1. Navigasi ke fitur\n2. Lakukan alur utama step by step sesuai requirement\n3. Verifikasi output akhir`,
        expected: 'Semua langkah selesai tanpa error. Output sesuai dengan spesifikasi.'
      }
    ],
    negative: [
      {
        scenario: `${title} – Input tidak valid / format salah`,
        steps: `1. Buka fitur\n2. Masukkan data dengan format yang salah atau tidak sesuai\n3. Submit form/aksi`,
        expected: 'Sistem menampilkan pesan validasi yang tepat. Aksi tidak diproses.'
      },
      {
        scenario: `${title} – Field wajib dibiarkan kosong`,
        steps: `1. Buka fitur\n2. Kosongkan satu atau lebih field wajib\n3. Klik tombol aksi`,
        expected: 'Muncul pesan error "Field ini wajib diisi." Sistem tidak melanjutkan proses.'
      },
      {
        scenario: `${title} – Akses tanpa otorisasi`,
        steps: `1. Coba akses fitur tanpa login atau dengan akun yang tidak memiliki izin`,
        expected: 'Sistem menolak akses dan menampilkan halaman error 401/403 atau redirect ke login.'
      }
    ],
    edge: [
      {
        scenario: `${title} – Input pada batas maksimum karakter`,
        steps: `1. Masukkan nilai tepat pada batas maksimum yang diizinkan (contoh: 255 karakter)\n2. Submit`,
        expected: 'Sistem menerima input pada batas maksimum tanpa error.'
      },
      {
        scenario: `${title} – Input melebihi batas maksimum`,
        steps: `1. Masukkan nilai satu karakter di atas batas maksimum\n2. Submit`,
        expected: 'Sistem menolak input dengan pesan "Melebihi batas maksimum karakter."'
      },
      {
        scenario: `${title} – Perilaku dengan karakter khusus dan Unicode`,
        steps: `1. Masukkan karakter khusus (seperti emoji, simbol, atau aksara non-ASCII)\n2. Submit`,
        expected: 'Sistem menangani input dengan benar tanpa crash atau data corruption.'
      }
    ]
  };
}

/* ----------------------------------------------------------
   DETECT TEMPLATE KEY from feature text
   ---------------------------------------------------------- */
function detectTemplateKey(text) {
  const t = text.toLowerCase();
  if (t.includes('login') || t.includes('masuk')) return 'login';
  if (t.includes('checkout') || t.includes('belanja') || t.includes('pembayaran') || t.includes('bayar')) return 'checkout';
  if (t.includes('reset') || t.includes('lupa password')) return 'reset';
  if (t.includes('registrasi') || t.includes('daftar') || t.includes('register')) return 'register';
  if (t.includes('cari') || t.includes('search') || t.includes('pencarian')) return 'search';
  return null;
}

/* ----------------------------------------------------------
   MAIN GENERATOR
   ---------------------------------------------------------- */
let allTestCases = [];

function generateTestCases() {
  const featureText = document.getElementById('featureInput').value.trim();
  if (!featureText) {
    shakeElement(document.getElementById('featureInput'));
    return;
  }

  const wantPositive = document.getElementById('chkPositive').checked;
  const wantNegative = document.getElementById('chkNegative').checked;
  const wantEdge     = document.getElementById('chkEdge').checked;

  if (!wantPositive && !wantNegative && !wantEdge) {
    alert('Pilih setidaknya satu cakupan pengujian.');
    return;
  }

  // Show spinner
  setLoading(true);

  // Simulate async generation (UX feel)
  setTimeout(() => {
    const key = detectTemplateKey(featureText);
    const tcData = key ? TC_DATA[key] : buildGenericTestCases(featureText);

    const raw = [];
    if (wantPositive) raw.push(...(tcData.positive || []).map(t => ({ ...t, type: 'positive' })));
    if (wantNegative) raw.push(...(tcData.negative || []).map(t => ({ ...t, type: 'negative' })));
    if (wantEdge)     raw.push(...(tcData.edge     || []).map(t => ({ ...t, type: 'edge' })));

    allTestCases = raw.map((tc, i) => ({
      id: `TC-${String(i + 1).padStart(2, '0')}`,
      ...tc
    }));

    renderTable(allTestCases);
    updateCounters(allTestCases);
    setActiveFilter('all');
    showResultSection();
    saveToLocalStorage(featureText, allTestCases);
    setLoading(false);
  }, 380);
}

/* ----------------------------------------------------------
   RENDER TABLE
   ---------------------------------------------------------- */
function renderTable(cases) {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';

  cases.forEach(tc => {
    const tr = document.createElement('tr');
    tr.className = 'row-visible';
    tr.dataset.type = tc.type;

    tr.innerHTML = `
      <td class="td-cell td-id">${tc.id}</td>
      <td class="td-cell"><span class="badge ${badgeClass(tc.type)}">${badgeLabel(tc.type)}</span></td>
      <td class="td-cell font-medium text-slate-200">${escHtml(tc.scenario)}</td>
      <td class="td-cell whitespace-pre-line">${escHtml(tc.steps)}</td>
      <td class="td-cell">${escHtml(tc.expected)}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ----------------------------------------------------------
   FILTER
   ---------------------------------------------------------- */
function setActiveFilter(filter) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });

  const rows = document.querySelectorAll('#tableBody tr');
  let visible = 0;
  rows.forEach(row => {
    const show = filter === 'all' || row.dataset.type === filter;
    row.className = show ? 'row-visible' : 'row-hidden';
    if (show) visible++;
  });

  document.getElementById('emptyState').classList.toggle('hidden', visible > 0);
}

function updateCounters(cases) {
  const count = t => cases.filter(c => c.type === t).length;
  document.getElementById('countAll').textContent      = cases.length;
  document.getElementById('countPositive').textContent = count('positive');
  document.getElementById('countNegative').textContent = count('negative');
  document.getElementById('countEdge').textContent     = count('edge');
}

/* ----------------------------------------------------------
   COPY TO CLIPBOARD
   ---------------------------------------------------------- */
function copyTable() {
  if (!allTestCases.length) return;

  const header = ['Test Case ID', 'Test Type', 'Scenario Description', 'Test Steps', 'Expected Result'];
  const rows = allTestCases.map(tc => [
    tc.id,
    badgeLabel(tc.type),
    tc.scenario,
    tc.steps.replace(/\n/g, ' | '),
    tc.expected
  ]);

  const text = [header, ...rows].map(r => r.map(cell => `"${cell}"`).join('\t')).join('\n');

  navigator.clipboard.writeText(text).then(() => showToast('✔ Tabel berhasil disalin ke clipboard!')).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('✔ Tabel berhasil disalin ke clipboard!');
  });
}

/* ----------------------------------------------------------
   EXPORT TO CSV
   ---------------------------------------------------------- */
function exportCsv() {
  if (!allTestCases.length) return;

  const header = ['Test Case ID', 'Test Type', 'Scenario Description', 'Test Steps', 'Expected Result'];
  const rows = allTestCases.map(tc => [
    tc.id,
    badgeLabel(tc.type),
    tc.scenario,
    tc.steps,
    tc.expected
  ]);

  const csvContent = [header, ...rows]
    .map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\r\n');

  const bom = '\uFEFF'; // UTF-8 BOM for Excel
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `test-cases-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ----------------------------------------------------------
   LOCAL STORAGE
   ---------------------------------------------------------- */
const LS_KEY = 'smartqa_last_session';

function saveToLocalStorage(feature, cases) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ feature, cases, ts: Date.now() }));
  } catch (_) { /* quota exceeded – silently ignore */ }
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (!data.cases || !data.cases.length) return;

    document.getElementById('featureInput').value = data.feature || '';
    allTestCases = data.cases;
    renderTable(allTestCases);
    updateCounters(allTestCases);
    setActiveFilter('all');
    showResultSection();
    document.getElementById('historyBadge').classList.remove('hidden');
  } catch (_) { /* corrupted data – ignore */ }
}

/* ----------------------------------------------------------
   UI HELPERS
   ---------------------------------------------------------- */
function showResultSection() {
  document.getElementById('resultSection').classList.remove('hidden');
  document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setLoading(on) {
  const btn     = document.getElementById('btnGenerate');
  const text    = document.getElementById('btnText');
  const spinner = document.getElementById('btnSpinner');
  btn.disabled        = on;
  text.textContent    = on ? 'Generating…' : '⚙ Generate Test Cases';
  spinner.classList.toggle('hidden', !on);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.add('hidden'), 2800);
}

function shakeElement(el) {
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake 0.35s ease';
  el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
  el.focus();
}

function badgeClass(type) {
  return { positive: 'badge-positive', negative: 'badge-negative', edge: 'badge-edge' }[type] || '';
}

function badgeLabel(type) {
  return { positive: 'Positive', negative: 'Negative', edge: 'Edge Case' }[type] || type;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ----------------------------------------------------------
   INJECT SHAKE KEYFRAME
   ---------------------------------------------------------- */
(function injectShakeKeyframe() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);
})();

/* ----------------------------------------------------------
   EVENT LISTENERS
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Quick template selector
  document.getElementById('quickTemplate').addEventListener('change', function () {
    const key = this.value;
    if (key && TEMPLATES[key]) {
      document.getElementById('featureInput').value = TEMPLATES[key];
      document.getElementById('historyBadge').classList.add('hidden');
    }
  });

  // Generate button
  document.getElementById('btnGenerate').addEventListener('click', generateTestCases);

  // Keyboard shortcut: Ctrl+Enter in textarea
  document.getElementById('featureInput').addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generateTestCases();
  });

  // Filter buttons
  document.getElementById('filterBar').addEventListener('click', function (e) {
    const btn = e.target.closest('.filter-btn');
    if (btn) setActiveFilter(btn.dataset.filter);
  });

  // Copy & Export
  document.getElementById('btnCopy').addEventListener('click', copyTable);
  document.getElementById('btnExport').addEventListener('click', exportCsv);

  // Load last session from localStorage
  loadFromLocalStorage();
});
