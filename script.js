// ==========================================
// 1. KONEKSI KE SUPABASE CLOUD
// Ganti teks di bawah dengan URL dan Key dari dashboard Supabase milikmu!
// ==========================================
const SUPABASE_URL = "https://hratlwlzcbpkoqgnqpgm.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_cQCwOmk-c_3FbQRJBsbcJQ_pWchppvh";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Ambil elemen HTML
const tombol = document.getElementById("tombolSimpan");
const tombolTarik = document.getElementById("tombolTarikData");
const nama = document.getElementById("inputNama");
const divisi = document.getElementById("pilihDivisi");
const areaTabel = document.getElementById("tabelData");

// ==========================================
// 2. FUNGSI UNTUK MENGAMBIL & MENGGAMBAR DATA (READ)
// Menggunakan 'async' karena menarik data dari internet butuh waktu
// ==========================================
async function gambarUlangTabel() {
  areaTabel.innerHTML = "<tr><td colspan='3'>Memuat data dari cloud...</td></tr>";

  // Minta data dari tabel 'staf' yang ada di Supabase
  const { data: daftarStaf, error } = await supabase
    .from("staf")
    .select("*");

  if (error) {
    console.error("Gagal mengambil data dari cloud:", error);
    areaTabel.innerHTML = "<tr><td colspan='3'>Gagal memuat data!</td></tr>";
    return;
  }

  // Bersihkan tabel sebelum membuat baris baru
  areaTabel.innerHTML = "";

  // Looping data yang didapat dari server Supabase
  for (let i = 0; i < daftarStaf.length; i++) {
    let staf = daftarStaf[i];

    let barisBaru = document.createElement("tr");

    let kolomNama = document.createElement("td");
    kolomNama.innerText = staf.nama_pendaftar;

    let kolomDivisi = document.createElement("td");
    kolomDivisi.innerText = staf.divisi_pendaftar;

    // --- MEMBUAT TOMBOL HAPUS (DELETE) ---
    let kolomAksi = document.createElement("td");
    let tombolHapus = document.createElement("button");
    tombolHapus.innerText = "Hapus";
    tombolHapus.style.backgroundColor = "#ef4444";
    tombolHapus.style.padding = "6px 12px";

    // Panggil server untuk menghapus data berdasarkan ID uniknya di cloud
    tombolHapus.addEventListener("click", async function () {
      tombolHapus.innerText = "...";
      
      const { error } = await supabase
        .from("staf")
        .delete()
        .eq("id", staf.id); // Hapus baris yang ID-nya cocok

      if (error) {
        alert("Gagal menghapus data di cloud!");
      } else {
        // Refresh tabel setelah data terhapus di cloud
        gambarUlangTabel();
      }
    });

    kolomAksi.appendChild(tombolHapus);

    barisBaru.appendChild(kolomNama);
    barisBaru.appendChild(kolomDivisi);
    barisBaru.appendChild(kolomAksi);

    areaTabel.appendChild(barisBaru);
  }
}

// ==========================================
// 3. MENYIMPAN DATA BARU KE CLOUD (CREATE)
// ==========================================
tombol.addEventListener("click", async function () {
  let namaStaf = nama.value;
  let divisiStaf = divisi.value;

  if (namaStaf === "" || divisiStaf === "Pilih Divisi...") {
    alert("Mohon lengkapi semua data!");
    return;
  }

  tombol.innerText = "Menyimpan...";

  // Kirim data baru ke database Supabase di internet
  const { error } = await supabase
    .from("staf")
    .insert([
      {
        nama_pendaftar: namaStaf,
        divisi_pendaftar: divisiStaf
      }
    ]);

  tombol.innerText = "Simpan Data";

  if (error) {
    alert("Gagal menyimpan ke Cloud: " + error.message);
  } else {
    // Reset form
    nama.value = "";
    divisi.value = "Pilih Divisi...";

    // Minta data terbaru dari cloud agar tabel ter-update
    gambarUlangTabel();
  }
});

// ==========================================
// 4. MENARIK DATA DARI API LUAR DAN DISIMPAN KE CLOUD
// ==========================================
tombolTarik.addEventListener("click", async function () {
  tombolTarik.innerText = "Sedang mengambil data...";

  try {
    // 1. Ambil data dari API publik
    let respons = await fetch("https://jsonplaceholder.typicode.com/users");
    let dataDariPusat = await respons.json();

    // 2. Format 3 data pertama agar sesuai struktur tabel Supabase kita
    let dataSiapKirim = [];
    for (let i = 0; i < 3; i++) {
      dataSiapKirim.push({
        nama_pendaftar: dataDariPusat[i].name,
        divisi_pendaftar: "Data Pusat"
      });
    }

    // 3. Simpan sekaligus 3 data tersebut ke Supabase Cloud!
    const { error } = await supabase
      .from("staf")
      .insert(dataSiapKirim);

    if (error) {
      alert("Gagal menyimpan data pusat ke Supabase.");
    } else {
      gambarUlangTabel();
    }

    tombolTarik.innerText = "Selesai! Tarik Data Lagi";
  } catch (error) {
    alert("Gagal mengambil data dari pusat. Periksa koneksi internet Anda.");
    tombolTarik.innerText = "Tarik Data Pusat (API)";
  }
});

// Jalankan fungsi gambarUlangTabel saat pertama kali halaman dibuka
gambarUlangTabel();