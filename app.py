from flask import Flask, request, jsonify, render_template
import os

# Flask uygulamasını başlatıyoruz ve HTML dosyalarımızın olduğu klasörü tanıtıyoruz
app = Flask(__name__, template_folder='.', static_folder='.', static_url_path='')


# Ana Sayfa Rotası (Ziyaretçi siteye ilk girdiğinde index.html'i açar)
@app.route('/')
def ana_sayfa():
    return render_template('index.html')


# Ürünler Sayfası Rotası
@app.route('/urunler.html')
def urunler_sayfasi():
    return render_template('urunler.html')


# İletişim Sayfası Rotası
@app.route('/iletisim.html')
def iletisim_sayfasi():
    return render_template('iletisim.html')


# Sepet Sayfası Rotası
@app.route('/sepet.html')
def sepet_sayfasi():
    return render_template('sepet.html')


# Ödeme Sayfası Rotası
@app.route('/odeme.html')
def odeme_sayfasi():
    return render_template('odeme.html')


# GERÇEK ETKİLEŞİM NOKTASI: Ödeme İsteğini Karşılayan API
@app.route('/api/odeme-yap', methods=['POST'])
def odeme_yap():
    # Frontend'den (JavaScript) gönderilen sepet ve kart verilerini alıyoruz
    gelen_veri = request.get_json()

    kart_sahibi = gelen_veri.get('kartSahibi', 'Bilinmeyen Kullanıcı')
    toplam_tutar = gelen_veri.get('toplamTutar', '0')

    # Sunucu tarafında (Python konsolunda) siparişi yazdırıyoruz
    print("\n--- YENİ SİPARİŞ GELDİ ---")
    print(f"Müşteri: {kart_sahibi}")
    print(f"Ödenen Tutar: {toplam_tutar} ₺")
    print("-------------------------\n")

    # Frontend'e işlemin başarılı olduğuna dair yanıt dönüyoruz
    return jsonify({
        "durum": "basarili",
        "mesaj": f"Harika! {kart_sahibi}, ödemeniz sunucu tarafından başarıyla onaylandı. Siparişiniz hazırlanıyor!"
    })


if __name__ == '__main__':
    app.run(debug=True)