// Admin Panel State Yönetimi
const adminState = {
    isLoggedIn: false,
    currentUser: null,
    posts: [], // Blog yazıları
};

// Örnek kullanıcı (gerçek uygulamada bu bilgiler güvenli bir şekilde saklanmalı)
const DEMO_USER = {
    username: 'admin',
    password: 'admin123'
};

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    // Oturum kontrolü
    checkSession();

    // Login formu varsa
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Dashboard istatistiklerini yükle
    if (window.location.pathname.includes('dashboard.html')) {
        loadDashboardStats();
    }

    // Blog post yönetimi
    initializeBlogManagement();
    
    // Düzenleme sayfası kontrolü
    if (window.location.pathname.includes('new-post.html')) {
        handleEditPost();
    }

    // Yorum sayfası kontrolü
    if (window.location.pathname.includes('comments.html')) {
        displayComments();
        
        // Filtre değişikliğini dinle
        const statusFilter = document.getElementById('comment-status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                displayComments(e.target.value);
            });
        }
    }

    // Karakter sayacı fonksiyonları
    const metaTitleInput = document.getElementById('meta-title');
    const metaDescriptionInput = document.getElementById('meta-description');
    const metaTitleCounter = document.getElementById('meta-title-counter');
    const metaDescriptionCounter = document.getElementById('meta-description-counter');

    if (metaTitleInput && metaTitleCounter) {
        metaTitleInput.addEventListener('input', () => {
            updateCharacterCounter(metaTitleInput, metaTitleCounter, 60);
        });
    }

    if (metaDescriptionInput && metaDescriptionCounter) {
        metaDescriptionInput.addEventListener('input', () => {
            updateCharacterCounter(metaDescriptionInput, metaDescriptionCounter, 160);
        });
    }
});

// Oturum kontrolü
function checkSession() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn) {
        adminState.isLoggedIn = true;
        adminState.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        // Eğer login sayfasındaysak ve giriş yapılmışsa dashboard'a yönlendir
        if (window.location.pathname.includes('admin/index.html')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        // Eğer giriş yapılmamışsa ve dashboard sayfasındaysak login'e yönlendir
        if (window.location.pathname.includes('admin/dashboard.html')) {
            window.location.href = 'index.html';
        }
    }
}

// Giriş işlemi
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');

    try {
        // Demo giriş kontrolü (gerçek uygulamada API çağrısı yapılmalı)
        if (username === DEMO_USER.username && password === DEMO_USER.password) {
            // Giriş başarılı
            adminState.isLoggedIn = true;
            adminState.currentUser = { username };
            
            // Session bilgilerini kaydet
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify({ username }));
            
            // Dashboard'a yönlendir
            window.location.href = 'dashboard.html';
        } else {
            throw new Error('Kullanıcı adı veya şifre hatalı!');
        }
    } catch (error) {
        errorDiv.textContent = error.message;
    }
}

// Çıkış işlemi
function handleLogout() {
    adminState.isLoggedIn = false;
    adminState.currentUser = null;
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Blog yönetimi başlatma
function initializeBlogManagement() {
    // Post listesi varsa
    const postList = document.querySelector('.post-list tbody');
    if (postList) {
        loadPosts();
    }

    // Post formu varsa
    const postForm = document.querySelector('.post-form');
    if (postForm) {
        postForm.addEventListener('submit', handlePostSubmit);
    }
}

// Blog yazılarını yükle
async function loadPosts() {
    const postList = document.querySelector('.post-list tbody');
    if (!postList) return;

    try {
        // Normalde burada API çağrısı yapılacak
        // Şimdilik localStorage'dan okuyoruz
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        adminState.posts = posts;

        // Post listesini güncelle
        renderPosts(postList);
    } catch (error) {
        console.error('Blog yazıları yüklenirken hata:', error);
        showError('Blog yazıları yüklenirken bir hata oluştu.');
    }
}

// Blog yazılarını görüntüle
function renderPosts(postList) {
    postList.innerHTML = adminState.posts.map(post => `
        <tr>
            <td>${post.title}</td>
            <td>${post.category}</td>
            <td>${post.date}</td>
            <td>
                <div class="post-actions">
                    <button onclick="editPost(${post.id})" class="edit-button">Düzenle</button>
                    <button onclick="deletePost(${post.id})" class="delete-button">Sil</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// RSS feed'i güncelle
async function updateRSSFeed(post) {
    try {
        // RSS feed template'ini oluştur
        let rssContent = localStorage.getItem('rssFeed') || `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
    <channel>
        <title>Selltegra Blog</title>
        <link>https://selltegra.com/blog/</link>
        <description>Selltegra Blog - E-ticaret, Dijital Pazarlama ve SEO hakkında güncel bilgiler</description>
        <language>tr-TR</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="https://selltegra.com/blog/feed.xml" rel="self" type="application/rss+xml"/>
    </channel>
</rss>`;

        // XML'i parse et
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(rssContent, 'text/xml');

        // Yeni item elementi oluştur
        const channel = xmlDoc.querySelector('channel');
        const items = channel.getElementsByTagName('item');

        // Mevcut item'ı kontrol et
        let existingItem = null;
        for (let i = 0; i < items.length; i++) {
            const guid = items[i].querySelector('guid');
            if (guid && guid.textContent === `https://selltegra.com/blog/post.html?id=${post.id}`) {
                existingItem = items[i];
                break;
            }
        }

        // Yeni item içeriği
        const itemContent = `
            <item>
                <title>${post.title}</title>
                <link>https://selltegra.com/blog/post.html?id=${post.id}</link>
                <description><![CDATA[${post.excerpt || post.content.substring(0, 150) + '...'}]]></description>
                <pubDate>${new Date().toUTCString()}</pubDate>
                <guid isPermaLink="true">https://selltegra.com/blog/post.html?id=${post.id}</guid>
                <category>${post.category}</category>
                <author>Selltegra</author>
                <content:encoded><![CDATA[${post.content}]]></content:encoded>
            </item>
        `;

        // Yeni item'ı ekle
        const tempDoc = parser.parseFromString(itemContent, 'text/xml');
        const newItem = tempDoc.querySelector('item');

        if (existingItem) {
            channel.replaceChild(newItem, existingItem);
        } else {
            if (items.length > 0) {
                channel.insertBefore(newItem, items[0]);
            } else {
                channel.appendChild(newItem);
            }
        }

        // lastBuildDate'i güncelle
        let lastBuildDate = channel.querySelector('lastBuildDate');
        if (!lastBuildDate) {
            lastBuildDate = xmlDoc.createElement('lastBuildDate');
            channel.insertBefore(lastBuildDate, channel.firstChild);
        }
        lastBuildDate.textContent = new Date().toUTCString();

        // XML'i string'e çevir ve localStorage'a kaydet
        const serializer = new XMLSerializer();
        const updatedXml = serializer.serializeToString(xmlDoc);
        localStorage.setItem('rssFeed', updatedXml);

        // feed.xml dosyasını da güncelle (Blob ve URL kullanarak)
        const blob = new Blob([updatedXml], { type: 'application/xml' });
        const feedUrl = URL.createObjectURL(blob);
        
        // RSS feed linkini güncelle
        const rssLinks = document.querySelectorAll('a[href*="feed.xml"]');
        rssLinks.forEach(link => {
            link.href = feedUrl;
            link.download = 'feed.xml';
        });

        console.log('RSS feed başarıyla güncellendi');
    } catch (error) {
        console.error('RSS feed güncellenirken hata:', error);
        throw error;
    }
}

// Blog yazısı düzenleme
function editPost(postId) {
    const post = adminState.posts.find(p => p.id === parseInt(postId));
    if (!post) return;

    // Düzenleme sayfasına yönlendir
    window.location.href = 'new-post.html?edit=' + postId;
}

// Düzenleme sayfası yüklendiğinde
function handleEditPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    if (editId) {
        // Blog yazılarını getir
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const post = posts.find(p => p.id === parseInt(editId));
        
        if (post) {
            // Form elementlerini seç
            const titleInput = document.querySelector('#title');
            const categorySelect = document.querySelector('#category');
            const excerptTextarea = document.querySelector('#excerpt');
            const contentTextarea = document.querySelector('#content');
            const metaTitleInput = document.querySelector('#meta-title');
            const metaDescriptionTextarea = document.querySelector('#meta-description');
            const tagsInput = document.querySelector('#tags');
            const form = document.querySelector('.post-form');
            const pageTitle = document.querySelector('h1');
            const submitButton = document.querySelector('.save-button');

            // Form elementleri varsa değerleri doldur
            if (form) {
                if (titleInput) titleInput.value = post.title || '';
                if (categorySelect) categorySelect.value = post.category || '';
                if (excerptTextarea) excerptTextarea.value = post.excerpt || '';
                if (contentTextarea) contentTextarea.value = post.content || '';
                if (metaTitleInput) metaTitleInput.value = post.metaTitle || '';
                if (metaDescriptionTextarea) metaDescriptionTextarea.value = post.metaDescription || '';
                if (tagsInput) tagsInput.value = post.tags || '';
                
                // Form verisine edit ID'sini ekle
                form.dataset.editId = editId;
                
                // Başlık ve buton metnini güncelle
                if (pageTitle) pageTitle.textContent = 'Blog Yazısını Düzenle';
                if (submitButton) submitButton.textContent = 'Güncelle';
            }
        }
    }
}

// Blog yazısı ekleme/düzenleme fonksiyonunu güncelle
async function handlePostSubmit(e) {
    e.preventDefault();

    try {
        const form = e.target;
        const formData = new FormData(form);
        const editId = form.dataset.editId;
        
        // Form verilerini kontrol et
        const title = formData.get('title');
        const category = formData.get('category');
        const content = formData.get('content');
        
        if (!title || !category || !content) {
            throw new Error('Lütfen zorunlu alanları doldurun.');
        }

        // Fotoğraf kontrolü
        const imageInput = document.getElementById('image');
        if (!imageInput.files || imageInput.files.length === 0) {
            throw new Error('Lütfen bir kapak görseli seçin.');
        }

        const imageFile = imageInput.files[0];
        
        // Dosya tipi kontrolü
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(imageFile.type)) {
            throw new Error('Lütfen geçerli bir görsel dosyası seçin (JPEG, PNG, GIF veya WEBP).');
        }

        // Dosya boyutu kontrolü (2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (imageFile.size > maxSize) {
            throw new Error('Görsel dosyası 2MB\'dan küçük olmalıdır.');
        }

        // Resmi Base64'e çevir
        let imageUrl = '';
        try {
            const reader = new FileReader();
            imageUrl = await new Promise((resolve, reject) => {
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(new Error('Resim okunamadı'));
                reader.readAsDataURL(imageFile);
            });
        } catch (error) {
            console.error('Resim yükleme hatası:', error);
            throw new Error('Resim yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
        
        // Post nesnesini oluştur
        const post = {
            id: editId ? parseInt(editId) : Date.now(),
            title: title.trim(),
            category: category.trim(),
            content: content.trim(),
            excerpt: (formData.get('excerpt') || '').trim(),
            date: editId ? (adminState.posts.find(p => p.id === parseInt(editId))?.date || new Date().toLocaleDateString('tr-TR')) : new Date().toLocaleDateString('tr-TR'),
            image: imageUrl,
            metaTitle: (formData.get('meta-title') || '').trim(),
            metaDescription: (formData.get('meta-description') || '').trim(),
            tags: (formData.get('tags') || '').trim()
        };

        // Blog yazılarını getir
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        
        if (editId) {
            // Mevcut postu güncelle
            const index = posts.findIndex(p => p.id === parseInt(editId));
            if (index !== -1) {
                // Eğer yeni resim yüklenmemişse eski resmi koru
                if (!imageUrl) {
                    post.image = posts[index].image;
                }
                posts[index] = { ...posts[index], ...post };
            } else {
                throw new Error('Düzenlenecek yazı bulunamadı.');
            }
        } else {
            // Yeni post ekle
            posts.push(post);
        }
        
        // Değişiklikleri kaydet
        localStorage.setItem('blogPosts', JSON.stringify(posts));

        // RSS feed'i güncelle
        try {
            await updateRSSFeed(post);
        } catch (error) {
            console.error('RSS feed güncellenirken hata:', error);
            // RSS hatası yazı kaydetmeyi engellemeyecek
        }

        // State'i güncelle
        adminState.posts = posts;

        // Başarı mesajı göster
        showSuccess(`Blog yazısı başarıyla ${editId ? 'güncellendi' : 'kaydedildi'}.`);
        
        // Yönlendirme yap
        setTimeout(() => {
            window.location.href = 'posts.html';
        }, 1000);
        
    } catch (error) {
        console.error('Blog yazısı işlenirken hata:', error);
        showError(error.message || `Blog yazısı ${editId ? 'güncellenirken' : 'kaydedilirken'} bir hata oluştu.`);
    }
}

// Blog yazısı silme
async function deletePost(postId) {
    if (!confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) return;

    try {
        // Normalde burada API çağrısı yapılacak
        // Şimdilik localStorage'dan siliyoruz
        const posts = adminState.posts.filter(p => p.id !== postId);
        localStorage.setItem('blogPosts', JSON.stringify(posts));

        // Listeyi güncelle
        adminState.posts = posts;
        const postList = document.querySelector('.post-list tbody');
        if (postList) {
            renderPosts(postList);
        }

        showSuccess('Blog yazısı başarıyla silindi.');
    } catch (error) {
        console.error('Blog yazısı silinirken hata:', error);
        showError('Blog yazısı silinirken bir hata oluştu.');
    }
}

// Başarı mesajı göster
function showSuccess(message) {
    // Burada bir toast veya bildirim gösterilebilir
    alert(message);
}

// Hata mesajı göster
function showError(message) {
    // Burada bir toast veya bildirim gösterilebilir
    alert(message);
}

// Tüm yorumları yükle
function loadAllComments() {
    try {
        const allComments = [];
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        
        // Tüm blog yazılarının yorumlarını topla
        posts.forEach(post => {
            const postComments = JSON.parse(localStorage.getItem(`comments_${post.id}`)) || [];
            postComments.forEach(comment => {
                allComments.push({
                    ...comment,
                    postTitle: post.title
                });
            });
        });

        // Yorumları tarihe göre sırala
        allComments.sort((a, b) => new Date(b.date) - new Date(a.date));

        return allComments;
    } catch (error) {
        console.error('Yorumlar yüklenirken hata:', error);
        return [];
    }
}

// Yorumları görüntüle
function displayComments(status = 'all') {
    const commentsList = document.getElementById('comments-list');
    if (!commentsList) return;

    const allComments = loadAllComments();
    const filteredComments = status === 'all' 
        ? allComments 
        : allComments.filter(comment => comment.status === status);

    commentsList.innerHTML = filteredComments.map(comment => `
        <tr>
            <td>
                <div class="comment-author">
                    ${comment.name}
                    <small>${comment.email}</small>
                </div>
            </td>
            <td>
                <div class="comment-content">${comment.comment}</div>
            </td>
            <td>${comment.postTitle}</td>
            <td>${comment.date}</td>
            <td>
                <span class="status ${comment.status}">
                    ${getStatusText(comment.status)}
                </span>
            </td>
            <td class="actions">
                ${comment.status === 'pending' ? `
                    <button onclick="approveComment(${comment.postId}, ${comment.id})" class="action-button approve-button">
                        <i class="fas fa-check"></i>
                        <span>Onayla</span>
                    </button>
                    <button onclick="rejectComment(${comment.postId}, ${comment.id})" class="action-button reject-button">
                        <i class="fas fa-times"></i>
                        <span>Reddet</span>
                    </button>
                ` : ''}
                <button onclick="deleteComment(${comment.postId}, ${comment.id})" class="action-button delete-button">
                    <i class="fas fa-trash"></i>
                    <span>Sil</span>
                </button>
            </td>
        </tr>
    `).join('');
}

// Durum metnini getir
function getStatusText(status) {
    switch (status) {
        case 'pending': return 'Onay Bekliyor';
        case 'approved': return 'Onaylandı';
        case 'rejected': return 'Reddedildi';
        default: return status;
    }
}

// Yorumu onayla
function approveComment(postId, commentId) {
    try {
        const comments = JSON.parse(localStorage.getItem(`comments_${postId}`)) || [];
        const commentIndex = comments.findIndex(c => c.id === commentId);
        
        if (commentIndex !== -1) {
            comments[commentIndex].status = 'approved';
            localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
            displayComments(document.getElementById('comment-status-filter').value);
            showSuccess('Yorum onaylandı.');
        }
    } catch (error) {
        console.error('Yorum onaylanırken hata:', error);
        showError('Yorum onaylanırken bir hata oluştu.');
    }
}

// Yorumu reddet
function rejectComment(postId, commentId) {
    try {
        const comments = JSON.parse(localStorage.getItem(`comments_${postId}`)) || [];
        const commentIndex = comments.findIndex(c => c.id === commentId);
        
        if (commentIndex !== -1) {
            comments[commentIndex].status = 'rejected';
            localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
            displayComments(document.getElementById('comment-status-filter').value);
            showSuccess('Yorum reddedildi.');
        }
    } catch (error) {
        console.error('Yorum reddedilirken hata:', error);
        showError('Yorum reddedilirken bir hata oluştu.');
    }
}

// Yorumu sil
function deleteComment(postId, commentId) {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return;

    try {
        const comments = JSON.parse(localStorage.getItem(`comments_${postId}`)) || [];
        const filteredComments = comments.filter(c => c.id !== commentId);
        localStorage.setItem(`comments_${postId}`, JSON.stringify(filteredComments));
        displayComments(document.getElementById('comment-status-filter').value);
        showSuccess('Yorum silindi.');
    } catch (error) {
        console.error('Yorum silinirken hata:', error);
        showError('Yorum silinirken bir hata oluştu.');
    }
}

// Dashboard istatistiklerini yükle
function loadDashboardStats() {
    try {
        // Blog yazılarını getir
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const totalPosts = posts.length;

        // Toplam görüntülenme sayısını hesapla
        const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);

        // Toplam yorum sayısını hesapla
        let totalComments = 0;
        posts.forEach(post => {
            const comments = JSON.parse(localStorage.getItem(`comments_${post.id}`)) || [];
            totalComments += comments.length;
        });

        // İstatistikleri güncelle
        document.getElementById('total-posts').textContent = totalPosts;
        document.getElementById('total-views').textContent = totalViews;
        document.getElementById('total-comments').textContent = totalComments;

    } catch (error) {
        console.error('İstatistikler yüklenirken hata:', error);
    }
}

// Karakter sayacı fonksiyonları
function updateCharacterCounter(inputElement, counterElement, maxLength) {
    const currentLength = inputElement.value.length;
    counterElement.textContent = currentLength;
    
    const counterDiv = counterElement.parentElement;
    
    // Renk değişimleri için sınıfları güncelle
    if (currentLength >= maxLength) {
        counterDiv.classList.remove('warning');
        counterDiv.classList.add('danger');
    } else if (currentLength >= maxLength * 0.8) {
        counterDiv.classList.remove('danger');
        counterDiv.classList.add('warning');
    } else {
        counterDiv.classList.remove('warning', 'danger');
    }
} 