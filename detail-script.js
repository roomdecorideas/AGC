document.addEventListener('DOMContentLoaded', function() {

    // --- Elemen DOM ---
    const detailTitle = document.getElementById('detail-title');
    const detailImageContainer = document.getElementById('detail-image-container');
    const detailBody = document.getElementById('detail-body');
    const relatedPostsContainer = document.getElementById('related-posts-container');

    // --- Mendapatkan Keyword dari URL ---
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get('q');

    // --- Fungsi Bantuan ---

    /**
     * Mengubah setiap awal kata menjadi huruf kapital.
     */
    function capitalizeEachWord(str) {
        if (!str) return '';
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    /**
     * ▼▼▼ FUNGSI BARU UNTUK MEMBUAT JUDUL SEO ▼▼▼
     * Membuat judul dengan format: [Angka Acak] [Hook Acak] [Keyword]
     * @param {string} baseKeyword Keyword dasar.
     * @returns {string} Judul baru yang sudah diformat.
     */
    function generateSeoTitle(baseKeyword) {
        const hookWords = ['Best', 'Amazing', 'Cool', 'Inspiring', 'Creative', 'Awesome', 'Stunning', 'Beautiful', 'Unique', 'Ideas', 'Inspiration', 'Designs'];
        const randomHook = hookWords[Math.floor(Math.random() * hookWords.length)];
        const randomNumber = Math.floor(Math.random() * (200 - 55 + 1)) + 55;
        const capitalizedKeyword = capitalizeEachWord(baseKeyword);

        return `${randomNumber} ${randomHook} ${capitalizedKeyword}`;
    }

    // --- Logika Utama ---

    // Jika tidak ada keyword, tampilkan error.
    if (!keyword) {
        detailTitle.textContent = 'Content Not Found';
        detailBody.innerHTML = '<p>Sorry, the requested content could not be found. Please return to the <a href="index.html">homepage</a>.</p>';
        if (relatedPostsContainer) {
            relatedPostsContainer.closest('.related-posts-section').style.display = 'none';
        }
        return;
    }

    /**
     * Mengisi konten utama halaman detail.
     */
    function populateMainContent(term) {
        const decodedTerm = decodeURIComponent(term).replace(/\+/g, ' ');
        const newTitle = generateSeoTitle(decodedTerm);
        const capitalizedTermForArticle = capitalizeEachWord(decodedTerm);

        // Set judul tab browser dan H1 dengan format baru
        document.title = `${newTitle} | DecorInspire`;
        detailTitle.textContent = newTitle;

        const imageUrl = `https://tse1.mm.bing.net/th?q=${encodeURIComponent(decodedTerm)}&w=800&h=500&c=7&rs=1&p=0`;
        detailImageContainer.innerHTML = `<img src="${imageUrl}" alt="${newTitle}">`;

        // Isi artikel tetap menggunakan keyword asli agar lebih mudah dibaca
        detailBody.innerHTML = `
            <p>Welcome to our inspiration gallery dedicated to <strong>${capitalizedTermForArticle}</strong>. Finding the perfect idea for your project can sometimes be a challenge. Here, we've gathered a wide range of the best visual references to help you get a clearer and more detailed picture.</p>
            <p>Every detail in <strong>${capitalizedTermForArticle}</strong> plays a crucial role in creating the atmosphere you desire. From color selection and textures to element arrangement, everything contributes to the final result. Notice how experts combine various components to produce a harmonious and functional design related to the topic of ${capitalizedTermForArticle}.</p>
            <p>We hope this collection of images and ideas about <strong>${capitalizedTermForArticle}</strong> sparks your creativity. Feel free to save the images you love as a reference for your next project. Happy creating!</p>
        `;
    }

    /**
     * Mengambil dan menampilkan 'Related Posts'.
     */
    function generateRelatedPosts(term) {
        const script = document.createElement('script');
        script.src = `https://suggestqueries.google.com/complete/search?jsonp=handleRelatedSuggest&hl=en&client=firefox&q=${encodeURIComponent(term)}`;
        document.head.appendChild(script);
        
        script.onload = () => script.remove();
        script.onerror = () => {
            relatedPostsContainer.innerHTML = '<div class="loading-placeholder">Could not load related inspiration.</div>';
            script.remove();
        }
    }

    /**
     * Callback function untuk API Google Suggest.
     */
    window.handleRelatedSuggest = function(data) {
        const suggestions = data[1];
        relatedPostsContainer.innerHTML = '';

        if (!suggestions || suggestions.length === 0) {
            relatedPostsContainer.closest('.related-posts-section').style.display = 'none';
            return;
        }

        const originalKeyword = decodeURIComponent(keyword).replace(/\+/g, ' ').toLowerCase();
        let relatedCount = 0;

        suggestions.forEach(relatedTerm => {
            if (relatedTerm.toLowerCase() === originalKeyword || relatedCount >= 8) return;

            relatedCount++;
            const encodedTerm = encodeURIComponent(relatedTerm);
            const imageUrl = `https://tse1.mm.bing.net/th?q=${encodedTerm}`;
            const linkUrl = `detail.html?q=${encodedTerm}`;
            
            // Panggil fungsi generateSeoTitle untuk judul related posts
            const newRelatedTitle = generateSeoTitle(relatedTerm);

            const card = `
                <article class="content-card">
                    <a href="${linkUrl}">
                        <img src="${imageUrl}" alt="${newRelatedTitle}" loading="lazy">
                        <div class="content-card-body">
                            <h3>${newRelatedTitle}</h3>
                        </div>
                    </a>
                </article>
            `;
            relatedPostsContainer.innerHTML += card;
        });

        if(relatedCount === 0) {
             relatedPostsContainer.closest('.related-posts-section').style.display = 'none';
        }
    };

    // Jalankan semua fungsi
    populateMainContent(keyword);
    generateRelatedPosts(keyword);
});
