// ====== PENGATURAN TOKO (ubah sesuai kebutuhan) ======
const WHATSAPP = "081244047910"; // format internasional tanpa + atau 0 di depan
// Tambahkan foto produk dengan mengisi "img": "images/nama-file.jpg"

const PRODUCTS = [
  { id: 1, nama: "Baje Mandar", kat: "jajanan", pola: "sure", harga: 35000, desc: "Kudapan manis tradisional Mandar dari ketan, gula merah, dan kelapa. Kemasan 250 g.", img: "" },
  { id: 2, nama: "Golla Kambu", kat: "jajanan", pola: "belah", harga: 25000, desc: "Kue ketan, gula merah, dan kelapa muda parut, dibungkus daun pisang kering. Isi 5 buah.", img: "" },
  { id: 3, nama: "Kasippi", kat: "jajanan", pola: "garis", harga: 30000, desc: "Camilan tradisional khas Mandar, cocok untuk teman minum teh atau kopi. Kemasan 200 g.", img: "" },
  { id: 4, nama: "Minyak Mandar", kat: "minyak", pola: "sure", harga: 60000, desc: "Minyak kelapa asli (lomo' Mandar) yang dimasak perlahan di atas tungku, beraroma khas. Botol 500 ml.", img: "" }
];
const KAT = { jajanan: "Kue & camilan", minyak: "Minyak Mandar" };

const rupiah = n => "Rp" + n.toLocaleString("id-ID");
const $ = id => document.getElementById(id);
let cart = {};
try { cart = JSON.parse(localStorage.getItem("mandar-cart")) || {}; } catch (e) { cart = {}; }

function save() { try { localStorage.setItem("mandar-cart", JSON.stringify(cart)); } catch (e) {} }

function renderProducts(cat = "semua") {
  const list = PRODUCTS.filter(p => cat === "semua" || p.kat === cat);
  $("productGrid").innerHTML = list.map(p => `
    <article class="card">
      <div class="thumb ${p.pola}">
        ${p.img ? `<img src="${p.img}" alt="${p.nama}" loading="lazy">` : ""}
        <span class="tag">${KAT[p.kat]}</span>
      </div>
      <div class="info">
        <h3>${p.nama}</h3>
        <p>${p.desc}</p>
        <div class="buy"><span class="price">${rupiah(p.harga)}</span>
          <button class="add" data-id="${p.id}">Tambah</button></div>
      </div>
    </article>`).join("");
}

function renderCart() {
  const items = Object.entries(cart).map(([id, q]) => ({ ...PRODUCTS.find(p => p.id == id), q }));
  const count = items.reduce((s, i) => s + i.q, 0);
  const total = items.reduce((s, i) => s + i.q * i.harga, 0);
  $("cartCount").textContent = count;
  $("cartTotal").textContent = rupiah(total);
  $("checkout").disabled = !count;
  $("cartItems").innerHTML = items.length ? items.map(i => `
    <div class="line">
      <b>${i.nama}</b><span>${rupiah(i.q * i.harga)}</span>
      <div class="qty"><button data-dec="${i.id}" aria-label="Kurangi">−</button>${i.q}<button data-inc="${i.id}" aria-label="Tambah">+</button></div>
      <button class="remove" data-del="${i.id}">Hapus</button>
    </div>`).join("") : `<p class="empty">Keranjang masih kosong. Pilih produk dulu.</p>`;
  save();
}

function toggleCart(open) {
  $("drawer").classList.toggle("open", open);
  $("drawer").setAttribute("aria-hidden", !open);
  $("overlay").hidden = !open;
}

document.addEventListener("click", e => {
  const t = e.target;
  if (t.dataset.cat) {
    document.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c === t));
    renderProducts(t.dataset.cat);
  }
  if (t.classList.contains("add")) { cart[t.dataset.id] = (cart[t.dataset.id] || 0) + 1; renderCart(); toggleCart(true); }
  if (t.dataset.inc) { cart[t.dataset.inc]++; renderCart(); }
  if (t.dataset.dec) { if (--cart[t.dataset.dec] < 1) delete cart[t.dataset.dec]; renderCart(); }
  if (t.dataset.del) { delete cart[t.dataset.del]; renderCart(); }
});

$("openCart").onclick = () => toggleCart(true);
$("closeCart").onclick = $("overlay").onclick = () => toggleCart(false);
document.addEventListener("keydown", e => { if (e.key === "Escape") toggleCart(false); });

$("checkout").onclick = () => {
  const lines = Object.entries(cart).map(([id, q]) => {
    const p = PRODUCTS.find(x => x.id == id);
    return `- ${p.nama} x${q} = ${rupiah(p.harga * q)}`;
  });
  const total = Object.entries(cart).reduce((s, [id, q]) => s + PRODUCTS.find(x => x.id == id).harga * q, 0);
  const pesan = `Halo Oleh Oleh Khas Mandar, saya ingin memesan:\n${lines.join("\n")}\n\nTotal: ${rupiah(total)}\nMohon info ongkir dan cara pembayaran.`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(pesan)}`, "_blank");
};

renderProducts();
renderCart();