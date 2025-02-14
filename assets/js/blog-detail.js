// Blog detay sayfası için gerekli fonksiyonlar

// Blog yazısı detaylarını yükle
function loadPostDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('id'));
    
    if (!postId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const post = posts.find(p => p.id === postId);

        if (!post) {
            window.location.href = 'index.html';
            return;
        }

        // Sayfa başlığını güncelle
        document.title = `${post.title} - Selltegra Blog`;

        // Meta açıklamasını güncelle
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = post.metaDescription || post.excerpt || '';
        }

        // Blog içeriğini görüntüle
        const blogDetail = document.querySelector('.blog-detail');
        if (blogDetail) {
            // İçeriği düzenle (paragrafları koru)
            blogDetail.innerHTML = `
                <article class="blog-post">
                    <header class="blog-post-header">
                        <h1 class="blog-post-title">${post.title}</h1>
                        <div class="blog-post-meta">
                            <span class="blog-post-date"><i class="far fa-calendar"></i> ${post.date}</span>
                            <span class="blog-post-category"><i class="far fa-folder"></i> ${post.category}</span>
                        </div>
                    </header>

                    <div class="blog-post-image">
                        <img src="${post.image}" alt="${post.title}" class="img-detail">
                    </div>
                    
                    <div class="blog-post-content">
                        ${post.content.split('\n').map(paragraph => 
                            paragraph.trim() ? `<p>${paragraph.trim()}</p>` : ''
                        ).join('')}
                    </div>

                    ${post.tags ? `
                    <div class="blog-post-tags">
                        <h3>Etiketler:</h3>
                        <div class="tags">
                            ${post.tags.split(',').map(tag => `
                                <span class="tag">${tag.trim()}</span>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                </article>
            `;
        }

        // İlgili yazıları yükle
        loadRelatedPosts(post);
    } catch (error) {
        console.error('Blog yazısı yüklenirken hata:', error);
        window.location.href = 'index.html';
    }
}

// İlgili yazıları yükle
function loadRelatedPosts(currentPost) {
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    
    // Aynı kategorideki diğer yazıları bul
    const relatedPosts = posts
        .filter(post => 
            post.id !== currentPost.id && 
            post.category === currentPost.category
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);

    const relatedPostsContainer = document.querySelector('.related-posts');
    if (relatedPostsContainer && relatedPosts.length > 0) {
        relatedPostsContainer.innerHTML = `
            <h2>İlgili Yazılar</h2>
            <div class="related-posts-grid">
                ${relatedPosts.map(post => `
                    <article class="related-post-card">
                        <div class="related-post-image">
                            <img src="${post.image}" alt="${post.title}">
                        </div>
                        <div class="related-post-content">
                            <div class="related-post-meta">
                                <span class="related-post-date"><i class="far fa-calendar"></i> ${post.date}</span>
                                <span class="related-post-category"><i class="far fa-folder"></i> ${post.category}</span>
                            </div>
                            <h3 class="related-post-title">
                                <a href="post.html?id=${post.id}">${post.title}</a>
                            </h3>
                        </div>
                    </article>
                `).join('')}
            </div>
        `;
    }
}

// Yorumları yükle
function loadComments(postId) {
    try {
        const comments = JSON.parse(localStorage.getItem(`comments_${postId}`)) || [];
        const commentsList = document.querySelector('.comments-list');
        const moderationSetting = localStorage.getItem('comment_moderation') || 'pending';

        if (comments.length === 0) {
            commentsList.innerHTML = '<p>Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>';
            return;
        }

        commentsList.innerHTML = comments
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(comment => {
                const showComment = moderationSetting === 'auto' || comment.status === 'approved';
                if (!showComment) return '';

                return `
                    <div class="comment">
                        <div class="comment-header">
                            <span class="comment-author">${comment.name}</span>
                            <span class="comment-date">${comment.date}</span>
                        </div>
                        <div class="comment-content">
                            <p>${comment.comment}</p>
                        </div>
                        ${comment.status === 'pending' ? 
                            '<span class="comment-status pending">Onay Bekliyor</span>' : 
                            ''}
                    </div>
                `;
            })
            .join('');
    } catch (error) {
        console.error('Yorumlar yüklenirken hata:', error);
    }
}

// Yorum formunu işle
function handleCommentSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const postId = new URLSearchParams(window.location.search).get('id');
    const moderationSetting = localStorage.getItem('comment_moderation') || 'pending';

    try {
        const comment = {
            id: Date.now(),
            postId: parseInt(postId),
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            comment: form.comment.value.trim(),
            date: new Date().toLocaleDateString('tr-TR'),
            status: moderationSetting === 'auto' ? 'approved' : 'pending'
        };

        // Yorumları getir ve yeni yorumu ekle
        const comments = JSON.parse(localStorage.getItem(`comments_${postId}`)) || [];
        comments.push(comment);
        localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));

        // Formu temizle
        form.reset();

        // Yorumları yeniden yükle
        loadComments(postId);

        // Başarı mesajı göster
        alert(moderationSetting === 'auto' ? 
            'Yorumunuz başarıyla eklendi.' : 
            'Yorumunuz gönderildi ve onay bekliyor.');

    } catch (error) {
        console.error('Yorum kaydedilirken hata:', error);
        alert('Yorum kaydedilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    loadPostDetail();

    // Yorum formunu dinle
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', handleCommentSubmit);
    }

    // Yorumları yükle
    const postId = new URLSearchParams(window.location.search).get('id');
    if (postId) {
        loadComments(postId);
    }
}); 