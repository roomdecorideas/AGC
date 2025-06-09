document.addEventListener('DOMContentLoaded', async function() {

    // --- PENGATURAN PENTING ---
    // ▼▼▼ GANTI DENGAN URL WEBSITE ANDA YANG SEBENARNYA ▼▼▼
    const siteUrl = 'https://www.yourwebsitename.com';
    // ▲▲▲ GANTI DENGAN URL WEBSITE ANDA YANG SEBENARNYA ▲▲▲
    const feedTitle = 'DecorInspire - Latest Design Inspirations';
    const authorName = 'DecorInspire Team';


    // --- Elemen DOM ---
    const feedOutputElement = document.getElementById('feed-output');


    // --- Fungsi Bantuan (Sama seperti di skrip lain) ---

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function capitalizeEachWord(str) {
        if (!str) return '';
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    function generateSeoTitle(baseKeyword) {
        const hookWords = ['Best', 'Amazing', 'Cool', 'Inspiring', 'Creative', 'Awesome', 'Stunning', 'Beautiful', 'Unique', 'Ideas', 'Inspiration', 'Designs'];
        const randomHook = hookWords[Math.floor(Math.random() * hookWords.length)];
        const randomNumber = Math.floor(Math.random() * (200 - 55 + 1)) + 55;
        const capitalizedKeyword = capitalizeEachWord(baseKeyword);
        return `${randomNumber} ${randomHook} ${capitalizedKeyword}`;
    }


    // --- Fungsi Utama Pembuatan Feed ---

    /**
     * Menghasilkan seluruh feed dalam format Atom 1.0 XML.
     * @param {Array<string>} keywordList - Daftar 50 keyword yang sudah diacak.
     * @returns {string} String XML yang lengkap.
     */
    function generateAtomFeed(keywordList) {
        const now = new Date();
        const updatedTime = now.toISOString(); // Format tanggal standar ISO 8601

        // Header dari Atom Feed
        let xml = `<?xml version="1.0" encoding="utf-8"?>\n`;
        xml += `<feed xmlns="http://www.w3.org/2005/Atom">\n`;
        xml += `  <title>${feedTitle}</title>\n`;
        xml += `  <link href="${siteUrl}/feed.html" rel="self"/>\n`;
        xml += `  <link href="${siteUrl}/"/>\n`;
        xml += `  <updated>${updatedTime}</updated>\n`;
        xml += `  <id>${siteUrl}/</id>\n`;
        xml += `  <author>\n`;
        xml += `    <name>${authorName}</name>\n`;
        xml += `  </author>\n\n`;

        // Loop untuk setiap keyword dan buat <entry>
        keywordList.forEach(keyword => {
            const title = generateSeoTitle(keyword);
            const encodedKeyword = encodeURIComponent(keyword);
            const articleUrl = `${siteUrl}/detail.html?q=${encodedKeyword}`;
            const imageUrl = `https://tse1.mm.bing.net/th?q=${encodedKeyword}`;
            
            // Buat deskripsi yang mengandung keyword
            const description = `Discover one of the ${title}. Explore visual galleries and creative concepts related to ${capitalizeEachWord(keyword)}. Perfect for your next home or garden project.`;

            xml += `  <entry>\n`;
            xml += `    <title>${title}</title>\n`;
            xml += `    <link href="${articleUrl}"/>\n`;
            xml += `    <id>${articleUrl}</id>\n`;
            xml += `    <updated>${updatedTime}</updated>\n`;
            xml += `    <summary type="html"><![CDATA[${description}]]></summary>\n`;
            xml += `    <content type="html"><![CDATA[<img src="${imageUrl}" alt="${title}" /><br/>${description}]]></content>\n`;
            xml += `  </entry>\n\n`;
        });

        xml += `</feed>`;
        return xml;
    }


    /**
     * Fungsi inisialisasi yang mengatur logika pengacakan harian
     * dan menampilkan feed.
     */
    async function initializeFeed() {
        const today = new Date().toISOString().slice(0, 10);
        const storedDate = localStorage.getItem('feedShuffleDate');
        let keywordSelection = [];

        // Untuk feed, kita akan selalu acak ulang setiap hari
        // jadi kita tidak perlu menyimpan daftar keywordnya, cukup tanggalnya.
        // Jika Anda ingin feed tetap sama sepanjang hari, gunakan logika seperti di script.js
        
        try {
            const response = await fetch('keyword.txt');
            if (!response.ok) throw new Error('keyword.txt file not found.');
            
            let allKeywords = await response.text();
            allKeywords = allKeywords.split('\n').filter(k => k.trim() !== '');

            // Acak seluruh daftar keyword
            shuffleArray(allKeywords);
            
            // Ambil 50 keyword pertama dari hasil acakan
            keywordSelection = allKeywords.slice(0, 50);

            if (keywordSelection.length > 0) {
                // Hasilkan feed XML dari 50 keyword terpilih
                const feedXml = generateAtomFeed(keywordSelection);
                
                // Tampilkan output di elemen <pre>
                feedOutputElement.textContent = feedXml;
            } else {
                feedOutputElement.textContent = 'Error: No keywords found to generate feed.';
            }

        } catch (error) {
            console.error('Error generating feed:', error);
            feedOutputElement.textContent = `Error: ${error.message}`;
        }
    }

    // Jalankan proses pembuatan feed
    initializeFeed();
});
