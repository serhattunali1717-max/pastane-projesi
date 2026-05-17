import os
from flask import Flask, request, jsonify, render_template

# Klasör yollarını Render sunucusunun anlayacağı şekilde temizliyoruz
app = Flask(__name__, template_folder=os.getcwd(), static_folder=os.getcwd(), static_url_path='')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/urunler')
def urunler():
    return render_template('urunler.html')

@app.route('/sepet')
def sepet():
    return render_template('sepet.html')

@app.route('/iletisim')
def iletisim():
    return render_template('iletisim.html')

@app.route('/odeme')
def odeme():
    return render_template('odeme.html')

if __name__ == '__main__':
    # Render'ın port ayarını otomatik almasını sağlıyoruz
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
