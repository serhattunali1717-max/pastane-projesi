// Sayfa ilk açıldığında tarayıcı hafızasından (localStorage) eski sepeti yükle
let cart = JSON.parse(localStorage.getItem('bakery_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Ürünler sayfasındaysak butonları dinle
    const orderButtons = document.querySelectorAll('.order-btn');
    if (orderButtons.length > 0) {
        orderButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                const name = productCard.querySelector('.product-info h3').innerText;
                const priceText = productCard.querySelector('.price').innerText;
                const price = parseFloat(priceText.replace(' ₺', ''));

                addToCart(name, price);
            });
        });
    }

    // Arayüzleri ilk yüklemede güncelle
    updateCartBadge();
    if (document.getElementById('sepet-page-items')) {
        updateSepetPageUI();
    }
});

// Sepete Ekleme Fonksiyonu
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    saveCart();
    updateCartBadge();
    alert(`${name} sepete eklendi!`);
}

// Sağ üstteki ikonun üzerindeki sayıyı güncelleme
function updateCartBadge() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.innerText = totalCount;
    }
}

// SEPET SAYFASI İÇERİĞİNİ LİSTELEME
function updateSepetPageUI() {
    const container = document.getElementById('sepet-page-items');
    const subtotalEl = document.getElementById('sepet-subtotal');
    const totalEl = document.getElementById('sepet-total-price');

    if (!container) return;

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (subtotalEl) subtotalEl.innerText = totalPrice + ' ₺';
    if (totalEl) totalEl.innerText = totalPrice + ' ₺';

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-msg">Sepetiniz henüz boş.</p>';
        return;
    }

    container.innerHTML = '';
    cart.forEach(item => {
        const row = document.createElement('div');
        row.classList.add('sepet-page-item');
        row.innerHTML = `
            <div class="sepet-item-details">
                <h4>${item.name}</h4>
                <p>Adet: ${item.quantity} | Toplam: ${item.price * item.quantity} ₺</p>
            </div>
            <i class="fa-solid fa-trash delete-btn" onclick="removeFromSepetPage('${item.name}')"></i>
        `;
        container.appendChild(row);
    });
}

// Sepet Sayfasından Ürün Silme
function removeFromSepetPage(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    updateCartBadge();
    updateSepetPageUI();
}

// Verileri Tarayıcı Hafızasına Kaydetme
function saveCart() {
    localStorage.setItem('bakery_cart', JSON.stringify(cart));
}
// ÖDEME SAYFASI İŞLEMLERİ
document.addEventListener('DOMContentLoaded', () => {
    // Eğer ödeme sayfasındaysak toplam tutarı butonun içine yazdır
    const paymentAmountEl = document.getElementById('payment-amount');
    if (paymentAmountEl) {
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        paymentAmountEl.innerText = totalPrice + ' ₺';
    }
});

// Ödeme Formu Gönderildiğinde Sunucuya Haber Veren Fonksiyon
function handlePayment(event) {
    event.preventDefault(); // Sayfanın aniden yenilenmesini engeller

    // Sepet toplamını hesapla
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Sunucuya göndereceğimiz paketi (veriyi) hazırlıyoruz
    let siparisPaketi = {
        kartSahibi: document.getElementById('card-name').value,
        toplamTutar: totalPrice,
        sepetIcerigi: cart
    };

    // fetch fonksiyonu ile Python sunucumuzdaki '/api/odeme-yap' rotasına bağlanıyoruz
    fetch('/api/odeme-yap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siparisPaketi) // Veriyi sunucunun anlayacağı dile (JSON) çeviriyoruz
    })
    .then(response => response.json()) // Sunucudan gelen yanıtı oku
    .then(data => {
        // Eğer sunucu "başarılı" dediyse:
        if (data.durum === "basarili") {
            alert(data.mesaj); // Sunucudan gelen o özel başarı mesajını ekranda göster

            // Alışveriş bittiği için sepeti sıfırla
            cart = [];
            saveCart();

            // Kullanıcıyı ana sayfaya gönder
            window.location.href = '/';
        }
    })
    .catch(error => {
        console.error('Hata oluştu:', error);
        alert('Sunucuya bağlanırken bir hata oluştu!');
    });
}