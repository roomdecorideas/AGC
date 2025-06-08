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
     * Mengacak urutan elemen dalam sebuah array menggunakan algoritma Fisher-Yates.
     * @param {Array} array Array yang akan diacak.
     */
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Tukar elemen
        }
    }

    /**
     * Mengubah setiap awal kata menjadi huruf kapital.
     * @param {string} str String yang akan diubah.
     * @returns {string} String dengan format Title Case.
     */
    function capitalizeEachWord(str) {
        if (!str) return '';
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }


    // --- Fungsi Utama ---

    /**
     * Memuat dan menampilkan batch kata kunci berikutnya ke halaman.
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

                const cardHTML = `
                    <article class="content-card">
                        <a href="${linkUrl}">
                            <img src="${imageUrl}" alt="${keyword}" loading="lazy">
                            <div class="content-card-body">
                                <h3>${capitalizeEachWord(keyword)}</h3>
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
     * Fungsi inisialisasi utama yang mengatur logika pengacakan harian.
     */
    async function initializeDailyShuffle() {
        const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
        const storedDate = localStorage.getItem('shuffleDate');
        const storedKeywords = localStorage.getItem('shuffledKeywords');

        if (storedDate === today && storedKeywords) {
            // Gunakan daftar acak yang sudah tersimpan untuk hari ini
            console.log("Loading shuffled keywords from localStorage for today.");
            allKeywords = JSON.parse(storedKeywords);
            startDisplay();
        } else {
            // Ambil, acak, dan simpan daftar baru
            console.log("No valid shuffle for today. Fetching and shuffling new keywords.");
            try {
                const response = await fetch('keyword.txt');
                if (!response.ok) throw new Error('keyword.txt file not found.');
                
                const text = await response.text();
                const keywords = text.split('\n').filter(k => k.trim() !== '');
                
                // Acak daftar kata kunci
                shuffleArray(keywords);
                
                // Simpan daftar yang sudah diacak dan tanggal hari ini
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
     * Memulai proses penampilan konten dan infinite scroll.
     */
    function startDisplay() {
        if (allKeywords.length > 0) {
            loadNextBatch(); // Muat batch pertama
            window.addEventListener('scroll', handleInfiniteScroll);
        } else {
            contentContainer.innerHTML = '<p>No keywords to display.</p>';
            loader.style.display = 'none';
        }
    }

    // Mulai semua proses dengan logika pengacakan harian
    initializeDailyShuffle();
});
