// Blog verilerini yönetmek için basit bir state yönetimi
const blogState = {
    currentPage: 1,
    postsPerPage: 6,
    posts: [],
    filteredPosts: []
};

// Örnek blog verileri (normalde bu veriler bir API'den gelecek)
const samplePosts = [
    {
        id: 1,
        title: 'E-ticarette Başarının Sırları',
        excerpt: 'Online mağazanızı başarıya ulaştırmak için bilmeniz gereken temel stratejiler...',
        content: 'Lorem ipsum dolor sit amet...',
        image: '../assets/images/blog-placeholder.jpg',
        date: '1 Mart 2024',
        category: 'E-ticaret'
    },
    {
        id: 2,
        title: 'Sosyal Medya Pazarlama Trendleri',
        excerpt: '2024 yılında sosyal medya pazarlamasında öne çıkan trendler ve stratejiler...',
        content: 'Lorem ipsum dolor sit amet...',
        image: '../assets/images/blog-placeholder.jpg',
        date: '28 Şubat 2024',
        category: 'Dijital Pazarlama'
    },
    // Daha fazla örnek post eklenebilir
];

// Blog yazılarını yükle
function loadBlogPosts() {
    try {
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        blogState.posts = posts;
        blogState.filteredPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
        displayPosts();
        updatePagination();
    } catch (error) {
        console.error('Blog yazıları yüklenirken hata:', error);
        showError('Blog yazıları yüklenirken bir hata oluştu.');
    }
}

// Blog yazılarını görüntüle
function displayPosts() {
    const blogContainer = document.querySelector('.blog-grid');
    if (!blogContainer) return;

    const startIndex = (blogState.currentPage - 1) * blogState.postsPerPage;
    const endIndex = startIndex + blogState.postsPerPage;
    const postsToShow = blogState.filteredPosts.slice(startIndex, endIndex);

    if (postsToShow.length === 0) {
        blogContainer.innerHTML = `
            <div class="no-posts">
                <p>Henüz blog yazısı bulunmuyor.</p>
            </div>
        `;
        return;
    }

    blogContainer.innerHTML = postsToShow.map(post => {
        // Resim kontrolü
        let imageUrl = post.image;
        if (!imageUrl) {
            imageUrl = '../img/blog/post-placeholder.jpg';
        }

        return `
            <article class="blog-post">
                <div class="post-image">
                    <img class="list-foto" src="${imageUrl}" alt="${post.title}" onerror="this.src='../img/blog/post-placeholder.jpg'">
                </div>
                <div class="post-content">
                    <div class="post-meta">
                        <span><i class="far fa-calendar"></i> ${post.date}</span>
                        <span><i class="far fa-folder"></i> ${post.category}</span>
                    </div>
                    <h2>${post.title}</h2>
                    <p>${post.excerpt || post.content.substring(0, 150) + '...'}</p>
                    <a href="post.html?id=${post.id}" class="read-more">Devamını Oku <i class="fas fa-arrow-right"></i></a>
                </div>
            </article>
        `;
    }).join('');
}

// Sayfalama güncelleme
function updatePagination() {
    const paginationContainer = document.querySelector('.blog-pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(blogState.filteredPosts.length / blogState.postsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }

    paginationContainer.style.display = 'flex';
    paginationContainer.innerHTML = `
        <button class="prev-page" ${blogState.currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i> Önceki
        </button>
        <span class="current-page">Sayfa ${blogState.currentPage} / ${totalPages}</span>
        <button class="next-page" ${blogState.currentPage === totalPages ? 'disabled' : ''}>
            Sonraki <i class="fas fa-chevron-right"></i>
        </button>
    `;

    // Sayfalama olaylarını ekle
    const prevButton = paginationContainer.querySelector('.prev-page');
    const nextButton = paginationContainer.querySelector('.next-page');

    prevButton.addEventListener('click', () => {
        if (blogState.currentPage > 1) {
            blogState.currentPage--;
            displayPosts();
            updatePagination();
            window.scrollTo(0, 0);
        }
    });

    nextButton.addEventListener('click', () => {
        if (blogState.currentPage < totalPages) {
            blogState.currentPage++;
            displayPosts();
            updatePagination();
            window.scrollTo(0, 0);
        }
    });
}

// Blog arama fonksiyonu
function searchPosts(query) {
    query = query.toLowerCase().trim();
    
    blogState.filteredPosts = blogState.posts.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        (post.tags && post.tags.toLowerCase().includes(query))
    ).sort((a, b) => new Date(b.date) - new Date(a.date));

    blogState.currentPage = 1;
    displayPosts();
    updatePagination();
}

// Kategori filtreleme
function filterByCategory(category) {
    blogState.filteredPosts = category 
        ? blogState.posts.filter(post => post.category.toLowerCase() === category.toLowerCase())
        : [...blogState.posts];

    blogState.filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    blogState.currentPage = 1;
    displayPosts();
    updatePagination();
}

// Hata mesajı göster
function showError(message) {
    const blogGrid = document.querySelector('.blog-grid');
    if (blogGrid) {
        blogGrid.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
    }
}

// Blog detay sayfası için post detaylarını yükle
async function loadPostDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('id'));

    if (!postId) {
        window.location.href = '/blog';
        return;
    }

    try {
        // Normalde burada bir API çağrısı yapılacak
        const post = blogState.posts.find(p => p.id === postId);
        
        if (!post) {
            showError('Blog yazısı bulunamadı.');
            return;
        }

        renderPostDetail(post);
    } catch (error) {
        console.error('Blog detayı yüklenirken hata:', error);
        showError('Blog yazısı yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
}

// Blog detayını görüntüle
function renderPostDetail(post) {
    const blogDetail = document.querySelector('.blog-detail');
    if (!blogDetail) return;

    blogDetail.innerHTML = `
        <article>
            <div class="blog-detail-header">
                <h1>${post.title}</h1>
                <div class="blog-detail-meta">
                    <span class="date">${post.date}</span>
                    <span class="category">${post.category}</span>
                </div>
            </div>
            <div class="blog-detail-image">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="blog-detail-content">
                ${post.content}
            </div>
        </article>
    `;
}

// RSS feed'i yükle ve linki güncelle
function loadRSSFeed() {
    try {
        const rssFeed = localStorage.getItem('rssFeed');
        if (rssFeed) {
            const blob = new Blob([rssFeed], { type: 'application/xml' });
            const feedUrl = URL.createObjectURL(blob);
            
            // RSS feed linkini güncelle
            const rssLinks = document.querySelectorAll('a[href*="feed.xml"]');
            rssLinks.forEach(link => {
                link.href = feedUrl;
                link.download = 'feed.xml';
            });
        }
    } catch (error) {
        console.error('RSS feed yüklenirken hata:', error);
    }
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    // Blog yazılarını yükle
    loadBlogPosts();

    // Arama fonksiyonunu ekle
    const searchInput = document.querySelector('#blog-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchPosts(e.target.value);
        });
    }

    // Kategori filtreleme
    const categoryFilter = document.querySelector('#category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            filterByCategory(e.target.value);
        });
    }

    // RSS feed'i yükle
    loadRSSFeed();
}); 