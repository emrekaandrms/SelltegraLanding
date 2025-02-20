// Varsayılan dil
let currentLang = localStorage.getItem('language') || 'tr';

// IP'ye göre dil belirleme fonksiyonu
async function setLanguageByLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        // Türkiye'den bağlanıyorsa Türkçe, değilse İngilizce
        const detectedLang = data.country_code === 'TR' ? 'tr' : 'en';
        
        // Eğer daha önce kullanıcı tarafından seçilmiş bir dil yoksa
        if (!localStorage.getItem('language')) {
            currentLang = detectedLang;
            localStorage.setItem('language', detectedLang);
        }
        
        translatePage();
    } catch (error) {
        console.error('Lokasyon belirleme hatası:', error);
        // Hata durumunda varsayılan olarak Türkçe göster
        if (!localStorage.getItem('language')) {
            currentLang = 'tr';
            localStorage.setItem('language', 'tr');
        }
        translatePage();
    }
}

// Dil değiştirme fonksiyonu
function changeLang(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    translatePage();
}

// Sayfayı çevir
function translatePage() {
    const elements = document.querySelectorAll('[data-lang]');
    const langData = currentLang === 'tr' ? TR_LANG : EN_LANG;

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
    
    // Dil seçici dropdown'ını güncelle
    const languageText = document.querySelector('#languageDropdown span');
    if (languageText) {
        languageText.textContent = currentLang === 'tr' ? 'Türkçe' : 'English';
    }
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener('DOMContentLoaded', () => {
    // IP bazlı dil tespitini başlat
    setLanguageByLocation();

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