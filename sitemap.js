document.addEventListener('DOMContentLoaded', async function() {

    // --- Pengaturan Sitemap ---
    const MAX_URLS = 5000;

    // --- Elemen DOM ---
    const sitemapOutputElement = document.getElementById('sitemap-output');


    // --- Fungsi Utama Pembuatan Sitemap ---

    /**
     * Menghasilkan sitemap dalam format XML standar.
     * @param {Array<string>} keywordList - Daftar keyword yang akan dimasukkan ke sitemap.
     * @param {string} siteUrl - URL dasar website.
     * @returns {string} String XML yang lengkap.
     */
    function generateSitemapXml(keywordList, siteUrl) {
        // Mendapatkan tanggal hari ini dalam format YYYY-MM-DD untuk <lastmod>
        const today = new Date().toISOString().slice(0, 10);

        // Header dari Sitemap XML
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Loop untuk setiap keyword dan buat blok <url>
        keywordList.forEach(keyword => {
            if (!keyword) return; // Lewati baris kosong

            const encodedKeyword = encodeURIComponent(keyword);
            const loc = `${siteUrl}/detail.html?q=${encodedKeyword}`;

            xml += '  <url>\n';
            xml += `    <loc>${loc}</loc>\n`;
            xml += `    <lastmod>${today}</lastmod>\n`;
            xml += '    <changefreq>daily</changefreq>\n';
            xml += '    <priority>0.7</priority>\n';
            xml += '  </url>\n';
        });

        xml += '</urlset>';
        return xml;
    }


    /**
     * Fungsi inisialisasi yang mengambil semua data dan memulai pembuatan sitemap.
     */
    async function initializeSitemap() {
        try {
            // Langkah 1: Ambil URL dari domain.txt
            const domainResponse = await fetch('domain.txt');
            if (!domainResponse.ok) throw new Error('File domain.txt tidak ditemukan.');
            const siteUrl = (await domainResponse.text()).trim();
            if (!siteUrl) throw new Error('File domain.txt kosong.');

            // Langkah 2: Ambil keywords dari keyword.txt
            const keywordResponse = await fetch('keyword.txt');
            if (!keywordResponse.ok) throw new Error('File keyword.txt tidak ditemukan.');
            let allKeywords = await keywordResponse.text();
            allKeywords = allKeywords.split('\n').filter(k => k.trim() !== '');

            // Langkah 3: Batasi jumlah keyword sesuai maksimum yang ditentukan
            const sitemapKeywords = allKeywords.slice(0, MAX_URLS);

            if (sitemapKeywords.length > 0) {
                // Langkah 4: Hasilkan sitemap XML dari daftar keyword
                const sitemapXml = generateSitemapXml(sitemapKeywords, siteUrl);
                
                // Tampilkan output di halaman
                sitemapOutputElement.textContent = sitemapXml;
            } else {
                sitemapOutputElement.textContent = 'Error: Tidak ada keyword ditemukan untuk membuat sitemap.';
            }

        } catch (error) {
            console.error('Error generating sitemap:', error);
            sitemapOutputElement.textContent = `Error: ${error.message}`;
        }
    }

    // Jalankan semua proses
    initializeSitemap();
});
