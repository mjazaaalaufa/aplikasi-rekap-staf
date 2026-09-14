// ==========================================
// 1. KONEKSI KE SUPABASE CLOUD
// ==========================================
const SUPABASE_URL = "https://hratlwlzcbpkoqgnqpgm.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_cQCwOmk-c_3FbQRJBsbcJQ_pWchppvh";

// Mengubah nama variabel dari 'supabase' jadi 'supabaseClient' agar tidak bentrok
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Ambil elemen HTML
const tombol = document.getElementById("tombolSimpan");
const tombolTarik = document.getElementById("tombolTarikData");
const nama = document.getElementById("inputNama");
const divisi = document.getElementById("pilihDivisi");
const areaTabel = document.getElementById("tabelData");

// ==========================================
// 2. FUNGSI UNTUK MENGAMBIL & MENGGAMBAR DATA (READ)
// ==========================================
async function gambarUlangTabel() {
  areaTabel.innerHTML = "<tr><td colspan='3'>Memuat data dari cloud...</td></tr>";

  // Minta data dari tabel 'staf' di Supabase Cloud
  const { data: daftarStaf, error } = await supabaseClient
    .from("staf")
    .select("*");

  if (error) {
    console.error("Gagal mengambil data dari cloud:", error);
    areaTabel.innerHTML = "<tr><td colspan='3'>Gagal memuat data! Periksa RLS/Koneksi.</td></tr>";
    return;
  }

  // Bersihkan tabel sebelum membuat baris baru
  areaTabel.innerHTML = "";

  // Looping data dari server
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

    tombolHapus.addEventListener("click", async function () {
      tombolHapus.innerText = "...";
      
      const { error } = await supabaseClient
        .from("staf")
        .delete()
        .eq("id", staf.id);

      if (error) {
        alert("Gagal menghapus data di cloud!");
      } else {
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

  const { error } = await supabaseClient
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
    nama.value = "";
    divisi.value = "Pilih Divisi...";
    gambarUlangTabel();
  }
});

// ==========================================
// 4. MENARIK DATA DARI API LUAR DAN DISIMPAN KE CLOUD
// ==========================================
tombolTarik.addEventListener("click", async function () {
  tombolTarik.innerText = "Sedang mengambil data...";

  try {
    let respons = await fetch("https://jsonplaceholder.typicode.com/users");
    let dataDariPusat = await respons.json();

    let dataSiapKirim = [];
    for (let i = 0; i < 3; i++) {
      dataSiapKirim.push({
        nama_pendaftar: dataDariPusat[i].name,
        divisi_pendaftar: "Data Pusat"
      });
    }

    const { error } = await supabaseClient
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