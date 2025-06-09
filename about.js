document.addEventListener('DOMContentLoaded', async function() {
    
    // Fungsi untuk memuat nama domain dan menampilkannya
    async function loadDomainName() {
        try {
            const response = await fetch('domain.txt');
            if (!response.ok) {
                // Jika file tidak ditemukan, biarkan teks default
                console.warn('domain.txt not found. Using default text.');
                return;
            }
            
            const siteUrl = (await response.text()).trim();
            if (siteUrl) {
                // Ekstrak hostname dari URL lengkap
                // contoh: "https://www.yourwebsitename.com" -> "yourwebsitename.com"
                const domainName = new URL(siteUrl).hostname.replace('www.', '');

                // Cari semua elemen span yang perlu diisi
                const domainSpans = document.querySelectorAll('#domain-name, #domain-name-2');
                
                // Isi setiap elemen dengan nama domain yang sudah diekstrak
                domainSpans.forEach(span => {
                    if (span.id === 'domain-name') {
                        span.textContent = domainName.charAt(0).toUpperCase() + domainName.slice(1);
                    } else {
                        span.textContent = domainName;
                    }
                });
            }
        } catch (error) {
            console.error('Error loading domain.txt:', error);
        }
    }

    // Panggil fungsi saat halaman dimuat
    loadDomainName();
});
