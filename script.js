const tombol = document.getElementById("tombolSimpan");
const nama = document.getElementById("inputNama");
const divisi = document.getElementById("pilihDivisi");
const areaTabel = document.getElementById("tabelData");

// 1. KITA BUAT "KOTAK PENYIMPANAN" SEMENTARA (ARRAY)
// Coba ambil data dari localStorage dulu. Jika kosong (null), buat array kosong [].
let daftarStaf = JSON.parse(localStorage.getItem("dataStafKita")) || [];

// 2. FUNGSI UNTUK MENGGAMBAR TABEL (RENDER)
// Fungsi ini bertugas membaca Array 'daftarStaf' lalu membuatkan tabelnya.
function gambarUlangTabel() {
  // Bersihkan tabel dulu sebelum menggambar ulang, agar tidak dobel
  areaTabel.innerHTML = ""; 

  // Looping: Baca setiap data di dalam kotak penyimpanan kita
  for (let i = 0; i < daftarStaf.length; i++) {
    let staf = daftarStaf[i];
    
    let barisBaru = document.createElement("tr");
    
    let kolomNama = document.createElement("td");
    kolomNama.innerText = staf.namaPendaftar; // Ambil nilai nama
    
    let kolomDivisi = document.createElement("td");
    kolomDivisi.innerText = staf.divisiPendaftar; // Ambil nilai divisi

    barisBaru.appendChild(kolomNama);
    barisBaru.appendChild(kolomDivisi);
    areaTabel.appendChild(barisBaru);
  }
}

// 3. JALANKAN FUNGSI GAMBAR SAAT HALAMAN PERTAMA KALI DIBUKA
// Ini mencegah tabel kosong saat kita me-refresh halaman!
function gambarUlangTabel() {
  areaTabel.innerHTML = ""; 

  for (let i = 0; i < daftarStaf.length; i++) {
    let staf = daftarStaf[i];
    let barisBaru = document.createElement("tr");
    
    let kolomNama = document.createElement("td");
    kolomNama.innerText = staf.namaPendaftar;
    
    let kolomDivisi = document.createElement("td");
    kolomDivisi.innerText = staf.divisiPendaftar;

    // --- BAGIAN BARU: MEMBUAT TOMBOL HAPUS ---
    let kolomAksi = document.createElement("td"); // Buat kolom ke-3
    let tombolHapus = document.createElement("button"); // Buat tombol
    tombolHapus.innerText = "Hapus";
    tombolHapus.style.backgroundColor = "#ef4444"; // Beri warna merah
    tombolHapus.style.padding = "6px 12px"; // Sesuaikan ukurannya

    // MEMBERI INSTRUKSI PADA TOMBOL HAPUS
    tombolHapus.addEventListener("click", function() {
      
      // 1. Potong/buang data dari array berdasarkan urutannya (i)
      // Perintah splice(i, 1) artinya: Mulai dari urutan ke-i, buang 1 data.
      daftarStaf.splice(i, 1);
      
      // 2. Simpan kembali laci penyimpanan yang sudah berkurang isinya ke localStorage
      localStorage.setItem("dataStafKita", JSON.stringify(daftarStaf));
      
      // 3. Gambar ulang tabelnya agar nama yang dihapus hilang dari layar!
      gambarUlangTabel();
      
    });

    kolomAksi.appendChild(tombolHapus); // Masukkan tombol ke dalam kolom
    // --- AKHIR BAGIAN BARU ---

    barisBaru.appendChild(kolomNama);
    barisBaru.appendChild(kolomDivisi);
    barisBaru.appendChild(kolomAksi); // Jangan lupa masukkan kolom aksi ke baris
    
    areaTabel.appendChild(barisBaru);
  }
}

// 4. INSTRUKSI SAAT TOMBOL DIKLIK
tombol.addEventListener("click", function() {
  let namaStaf = nama.value;
  let divisiStaf = divisi.value;

  if (namaStaf === "" || divisiStaf === "Pilih Divisi...") {
    alert("Mohon lengkapi semua data!");
    return; 
  }

  // BUNGKUS DATA BARU MENJADI SEBUAH "OBJEK"
  let dataBaru = {
    namaPendaftar: namaStaf,
    divisiPendaftar: divisiStaf
  };

  // 1. Masukkan data baru ke dalam Array (kotak penyimpanan)
  daftarStaf.push(dataBaru);

  // 2. SIMPAN ARRAY TERSEBUT KE DALAM LOCAL STORAGE BROWSER!
  // Kita harus mengubahnya jadi teks (JSON.stringify) karena browser hanya bisa menyimpan teks
  localStorage.setItem("dataStafKita", JSON.stringify(daftarStaf));

  // 3. Panggil fungsi gambar tabel agar layar ter-update
  gambarUlangTabel();

  // Kosongkan form
  nama.value = "";
  divisi.value = "Pilih Divisi...";
});

// Perintah wajib untuk menggambar tabel sesaat setelah halaman selesai di-refresh
gambarUlangTabel();