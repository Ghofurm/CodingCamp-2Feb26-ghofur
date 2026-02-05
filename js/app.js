// Ambil elemen DOM
const form = document.getElementById("todoForm");
const inputTugas =
  document.getElementById("todoInput");
const inputTanggal =
  document.getElementById("dateInput");
const listKonten =
  document.getElementById("todoList");
const statusKosong =
  document.getElementById("emptyState");

// Ambil data dari local storage
let daftarTugas =
  JSON.parse(localStorage.getItem("todos")) || [];
let filterSekarang = "all";

// Fungsi save
function updateStorage() {
  localStorage.setItem(
    "todos",
    JSON.stringify(daftarTugas),
  );
}

// Fungsi render
function tampilkanTugas() {
  listKonten.innerHTML = "";

  let dataFilter = daftarTugas.filter((tugas) => {
    const tglTugas = new Date(
      tugas.date,
    ).setHours(0, 0, 0, 0);
    const tglHariIni = new Date().setHours(
      0,
      0,
      0,
      0,
    );

    if (filterSekarang === "today")
      return tglTugas === tglHariIni;
    if (filterSekarang === "upcoming")
      return tglTugas > tglHariIni;
    if (filterSekarang === "past")
      return tglTugas < tglHariIni;
    return true;
  });

  if (dataFilter.length === 0) {
    statusKosong.style.display = "block";
    listKonten.classList.remove("show");
  } else {
    statusKosong.style.display = "none";
    listKonten.classList.add("show");

    dataFilter.forEach((item) => {
      const div = document.createElement("div");
      div.className = "todo-item";
      div.innerHTML = `
        <div class="todo-content">
          <div class="todo-text">${item.text}</div>
          <div class="todo-date">${item.date}</div>
        </div>
        <button onclick="hapusTugas(${item.id})" class="btn-delete">HAPUS</button>
      `;
      listKonten.appendChild(div);
    });
  }
}

form.onsubmit = (e) => {
  e.preventDefault();

  if (
    inputTugas.value.trim() === "" ||
    !inputTanggal.value
  ) {
    alert("Isi semua dulu besss!");
    return;
  }

  const tugasBaru = {
    id: Date.now(),
    text: inputTugas.value,
    date: inputTanggal.value,
  };

  daftarTugas.push(tugasBaru);
  updateStorage();
  tampilkanTugas();
  form.reset();
};

// Fungsi hapus global
window.hapusTugas = (id) => {
  daftarTugas = daftarTugas.filter(
    (t) => t.id !== id,
  );
  updateStorage();
  tampilkanTugas();
};

// Filter button klik
document
  .querySelectorAll(".btn-filter")
  .forEach((btn) => {
    btn.onclick = (e) => {
      document
        .querySelector(".btn-filter.active")
        .classList.remove("active");
      e.target.classList.add("active");
      filterSekarang = e.target.dataset.filter;
      tampilkanTugas();
    };
  });

tampilkanTugas();
