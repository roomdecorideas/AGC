document.addEventListener('DOMContentLoaded', function() {
    
    // --- Variabel untuk Mengelola State ---
    let allKeywords = [];
    let currentIndex = 0;
    const batchSize = 15;
    let isLoading = false;

    // --- Elemen DOM ---
    const contentContainer = document.getElementById('auto-content-container');
    const loader = document.getElementById('loader');

    // --- Fungsi Bantuan ---

    /**
     * Mengacak urutan elemen dalam sebuah array.
     */
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

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


    // --- Fungsi Utama ---

    /**
     * Memuat dan menampilkan batch kata kunci berikutnya.
     */
    function loadNextBatch() {
        if (isLoading) return;
        isLoading = true;
        loader.style.display = 'block';

        const batch = allKeywords.slice(currentIndex, currentIndex + batchSize);
        
        setTimeout(() => {
            batch.forEach(keyword => {
                const encodedTerm = encodeURIComponent(keyword);
                const imageUrl = `https://tse1.mm.bing.net/th?q=${encodedTerm}`;
                const linkUrl = `detail.html?q=${encodedTerm}`; 
                
                // Panggil fungsi generateSeoTitle di sini
                const newTitle = generateSeoTitle(keyword);

                const cardHTML = `
                    <article class="content-card">
                        <a href="${linkUrl}">
                            <img src="${imageUrl}" alt="${newTitle}" loading="lazy">
                            <div class="content-card-body">
                                <h3>${newTitle}</h3>
                            </div>
                        </a>
                    </article>
                `;
                contentContainer.innerHTML += cardHTML;
            });

            currentIndex += batch.length;
            loader.style.display = 'none';
            isLoading = false;

            if (currentIndex >= allKeywords.length) {
                window.removeEventListener('scroll', handleInfiniteScroll);
                loader.style.display = 'none';
            }
        }, 500);
    }

    /**
     * Menangani event scroll untuk infinite loading.
     */
    function handleInfiniteScroll() {
        if ((window.innerHeight + window.scrollY) >= document.documentElement.offsetHeight - 100) {
            loadNextBatch();
        }
    }

    /**
     * Fungsi inisialisasi yang mengatur pengacakan harian.
     */
    async function initializeDailyShuffle() {
        const today = new Date().toISOString().slice(0, 10);
        const storedDate = localStorage.getItem('shuffleDate');
        const storedKeywords = localStorage.getItem('shuffledKeywords');

        if (storedDate === today && storedKeywords) {
            allKeywords = JSON.parse(storedKeywords);
            startDisplay();
        } else {
            try {
                const response = await fetch('keyword.txt');
                if (!response.ok) throw new Error('keyword.txt file not found.');
                
                const text = await response.text();
                const keywords = text.split('\n').filter(k => k.trim() !== '');
                
                shuffleArray(keywords);
                
                localStorage.setItem('shuffledKeywords', JSON.stringify(keywords));
                localStorage.setItem('shuffleDate', today);
                
                allKeywords = keywords;
                startDisplay();

            } catch (error) {
                console.error('Error:', error);
                contentContainer.innerHTML = `<p style="text-align:center; color:red;">${error.message}</p>`;
                loader.style.display = 'none';
            }
        }
    }

    /**
     * Memulai proses penampilan konten.
     */
    function startDisplay() {
        if (allKeywords.length > 0) {
            loadNextBatch();
            window.addEventListener('scroll', handleInfiniteScroll);
        } else {
            contentContainer.innerHTML = '<p>No keywords to display.</p>';
            loader.style.display = 'none';
        }
    }

    // Mulai semua proses
    initializeDailyShuffle();
});
