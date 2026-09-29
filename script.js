  // Data Produk
        const products = [
            {
                id: 1,
                name: "Baje' Mandar",
                category: "makanan",
                price: 25000,
                image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=600&auto=format&fit=crop",
                desc: "Kue tradisional dari beras ketan, gula merah asli, dan kelapa parut sangrai dengan cita rasa gurih khas."
            },
            {
                id: 2,
                name: "Golla Kambu",
                category: "makanan",
                price: 30000,
                image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop",
                desc: "Camilan khas berbahan dasar kacang tanah dan beras ketan, dibungkus unik menggunakan daun pisang kering."
            },
            {
                id: 3,
                name: "Minyak Mandar (VCO)",
                category: "minyak",
                price: 45000,
                image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&auto=format&fit=crop",
                desc: "Minyak kelapa murni diproses secara tradisional tanpa bahan kimia. Sangat baik untuk kesehatan dan kecantikan."
            },
            {
                id: 4,
                name: "Kue Paso",
                category: "makanan",
                price: 20000,
                image: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?q=80&w=600&auto=format&fit=crop",
                desc: "Kue manis berbentuk paku/kerucut dengan isian gula merah cair meleleh di dalam bungkus daun pisang."
            }
        ];

        let cart = [];
        let currentCategory = 'all';

        // Render Produk ke Grid
        function renderProducts(items) {
            const grid = document.getElementById('productGrid');
            grid.innerHTML = '';

            if(items.length === 0) {
                grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Produk tidak ditemukan...</p>';
                return;
            }

            items.forEach(p => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <div class="product-img-wrapper">
                        <span class="tag">${p.category === 'makanan' ? 'Kue' : 'Minyak'}</span>
                        <img src="${p.image}" class="product-img" alt="${p.name}">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${p.name}</h3>
                        <p class="product-desc">${p.desc}</p>
                        <div class="product-bottom">
                            <span class="product-price">Rp ${p.price.toLocaleString('id-ID')}</span>
                            <div class="btn-group">
                                <button class="btn-icon" onclick="openDetail(${p.id})"><i class="fa-regular fa-eye"></i></button>
                                <button class="btn-add" onclick="addToCart(${p.id})">+ Keranjang</button>
                            </div>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });
        }

        // Filter Kategori
        function filterCategory(cat, btn) {
            currentCategory = cat;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts();
        }

        // Search & Combined Filter
        function filterProducts() {
            const query = document.getElementById('searchInput').value.toLowerCase();
            const filtered = products.filter(p => {
                const matchCategory = currentCategory === 'all' || p.category === currentCategory;
                const matchSearch = p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query);
                return matchCategory && matchSearch;
            });
            renderProducts(filtered);
        }

        // Cart Logic
        function addToCart(id) {
            const product = products.find(p => p.id === id);
            const existItem = cart.find(item => item.id === id);

            if (existItem) {
                existItem.qty++;
            } else {
                cart.push({ ...product, qty: 1 });
            }

            updateCartUI();
            toggleCart(true); // Auto Buka Cart
        }

        function updateCartQty(id, change) {
            const item = cart.find(i => i.id === id);
            if(item) {
                item.qty += change;
                if(item.qty <= 0) {
                    cart = cart.filter(i => i.id !== id);
                }
            }
            updateCartUI();
        }

        function updateCartUI() {
            const cartItemsContainer = document.getElementById('cartItems');
            const cartCount = document.getElementById('cart-count');
            const cartTotal = document.getElementById('cartTotal');

            // Count Badge
            const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
            cartCount.innerText = totalQty;

            // Total Price
            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
            cartTotal.innerText = `Rp ${totalPrice.toLocaleString('id-ID')}`;

            // Render Items
            cartItemsContainer.innerHTML = '';
            if(cart.length === 0) {
                cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); margin-top: 2rem;">Keranjang Anda kosong.</p>';
                return;
            }

            cart.forEach(item => {
                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <img src="${item.image}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">Rp ${(item.price * item.qty).toLocaleString('id-ID')}</div>
                        <div class="qty-controls">
                            <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)">-</button>
                            <span style="font-size: 0.85rem; font-weight:700;">${item.qty}</span>
                            <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
                        </div>
                    </div>
                `;
                cartItemsContainer.appendChild(div);
            });
        }

        // Toggle Drawer / Modal
        function toggleCart(forceOpen = false) {
            const drawer = document.getElementById('cartDrawer');
            const overlay = document.getElementById('overlay');
            if(forceOpen || !drawer.classList.contains('open')) {
                drawer.classList.add('open');
                overlay.classList.add('active');
            } else {
                drawer.classList.remove('open');
                overlay.classList.remove('active');
            }
        }

        function openDetail(id) {
            const p = products.find(prod => prod.id === id);
            document.getElementById('modalTitle').innerText = p.name;
            document.getElementById('modalCategory').innerText = p.category.toUpperCase();
            document.getElementById('modalDesc').innerText = p.desc;
            
            document.getElementById('detailModal').classList.add('active');
            document.getElementById('overlay').classList.add('active');
        }

        function closeAll() {
            document.getElementById('cartDrawer').classList.remove('open');
            document.getElementById('detailModal').classList.remove('active');
            document.getElementById('overlay').classList.remove('active');
        }

        function toggleFaq(element) {
            element.classList.toggle('active');
        }

        // Checkout WA
        function checkoutWA() {
            if(cart.length === 0) return alert("Keranjang belanjaan masih kosong!");

            let message = "Halo MandarStore! Saya ingin memesan produk berikut:\n\n";
            cart.forEach(i => {
                message += `• ${i.name} (${i.qty}x) = Rp ${(i.price * i.qty).toLocaleString('id-ID')}\n`;
            });
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
            message += `\n*Total Belanja:* Rp ${total.toLocaleString('id-ID')}`;
            message += `\n\nMohon info rekening dan ongkos kirim. Terima kasih!`;

            const phone = "6281234567890"; // Ganti nomor Anda di sini
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        }

        // Dynamic Live Sales Popup Animation
        const buyers = ["Ahmad dari Polewali", "Nur dari Majene", "Rina dari Mamuju", "Budi dari Makassar"];
        function showLivePopup() {
            const popup = document.getElementById('livePopup');
            const text = document.getElementById('popupText');
            
            const randomBuyer = buyers[Math.floor(Math.random() * buyers.length)];
            const randomProduct = products[Math.floor(Math.random() * products.length)].name;
            
            text.innerText = `${randomBuyer} - ${randomProduct}`;
            popup.classList.add('show');

            setTimeout(() => {
                popup.classList.remove('show');
            }, 4000);
        }

        // Initialization
        window.onload = () => {
            renderProducts(products);
            setInterval(showLivePopup, 9000); // Popup muncul setiap 9 detik
        };