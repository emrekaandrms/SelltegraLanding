// Varsayılan dil
let currentLang = localStorage.getItem('language') || 'tr';

// Dil değiştirme fonksiyonu
function changeLang(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    translatePage();
}

// Sayfayı çevir
function translatePage() {
    const elements = document.querySelectorAll('[data-lang]');
    const langData = currentLang === 'tr' ? tr : en;

    elements.forEach(element => {
        const key = element.getAttribute('data-lang');
        const keys = key.split('.');
        let value = langData;
        
        // Nested objelerde değeri bul
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                value = key;
                break;
            }
        }

        // HTML içeriğini güncelle
        if (typeof value === 'string') {
            element.innerHTML = value;
        }

        // Placeholder varsa güncelle
        if (element.hasAttribute('placeholder')) {
            element.placeholder = value;
        }
    });

    // HTML lang attribute'unu güncelle
    document.documentElement.lang = currentLang;
}

// Sayfa yüklendiğinde çeviriyi başlat
document.addEventListener('DOMContentLoaded', () => {
    translatePage();

    // Dil seçimi için event listener ekle
    const langButtons = document.querySelectorAll('.lang-select');
    langButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = button.getAttribute('data-value');
            changeLang(lang);
        });
    });
}); 