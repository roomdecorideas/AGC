document.addEventListener('DOMContentLoaded', async function() {

    // --- Pengaturan Feed (Judul dan Nama Author) ---
    const feedTitle = 'DecorInspire - Latest Design Inspirations';
    const authorName = 'DecorInspire Team';

    // --- Elemen DOM ---
    const feedOutputElement = document.getElementById('feed-output');


    // --- Fungsi Bantuan (Tidak ada perubahan) ---

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
     * @param {string} siteUrl - URL dasar website yang diambil dari domain.txt.
     * @returns {string} String XML yang lengkap.
     */
    function generateAtomFeed(keywordList, siteUrl) {
        const now = new Date();
        const updatedTime = now.toISOString();

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

        keywordList.forEach(keyword => {
            const title = generateSeoTitle(keyword);
            const encodedKeyword = encodeURIComponent(keyword);
            const articleUrl = `${siteUrl}/detail.html?q=${encodedKeyword}`;
            const imageUrl = `https://tse1.mm.bing.net/th?q=${encodedKeyword}`;
            
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
     * Fungsi inisialisasi yang mengambil semua data yang diperlukan dan memulai pembuatan feed.
     */
    async function initializeFeed() {
        try {
            // Langkah 1: Ambil URL dari domain.txt
            const domainResponse = await fetch('domain.txt');
            if (!domainResponse.ok) throw new Error('File domain.txt tidak ditemukan. Pastikan file tersebut ada.');
            const siteUrl = (await domainResponse.text()).trim();
            
            if (!siteUrl) throw new Error('File domain.txt kosong.');

            // Langkah 2: Ambil keywords dari keyword.txt
            const keywordResponse = await fetch('keyword.txt');
            if (!keywordResponse.ok) throw new Error('File keyword.txt tidak ditemukan.');
            let allKeywords = await keywordResponse.text();
            allKeywords = allKeywords.split('\n').filter(k => k.trim() !== '');

            // Langkah 3: Acak dan pilih 50 keyword
            shuffleArray(allKeywords);
            const keywordSelection = allKeywords.slice(0, 50);

            if (keywordSelection.length > 0) {
                // Langkah 4: Hasilkan feed XML dengan data yang sudah diambil
                const feedXml = generateAtomFeed(keywordSelection, siteUrl);
                
                // Tampilkan output di halaman
                feedOutputElement.textContent = feedXml;
            } else {
                feedOutputElement.textContent = 'Error: Tidak ada keyword ditemukan untuk membuat feed.';
            }

        } catch (error) {
            console.error('Error generating feed:', error);
            feedOutputElement.textContent = `Error: ${error.message}`;
        }
    }

    // Jalankan semua proses
    initializeFeed();
});
