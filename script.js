document.addEventListener('DOMContentLoaded', function() {
    
    // State management variables
    let allKeywords = [];
    let currentIndex = 0;
    const batchSize = 15;
    let isLoading = false;

    // DOM Elements
    const contentContainer = document.getElementById('auto-content-container');
    const loader = document.getElementById('loader');

    /**
     * Capitalizes the first letter of each word in a string.
     * @param {string} str The string to capitalize.
     * @returns {string} The capitalized string.
     */
    function capitalizeEachWord(str) {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    /**
     * Loads and displays the next batch of keywords.
     */
    function loadNextBatch() {
        if (isLoading) return;
        isLoading = true;
        loader.style.display = 'block';

        // Get the next batch of keywords from the main array
        const batch = allKeywords.slice(currentIndex, currentIndex + batchSize);
        
        // Simulate a slight delay (like a network request) to make the loader visible
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

            // Update the index for the next batch
            currentIndex += batch.length;
            
            // Hide the loader when done
            loader.style.display = 'none';
            isLoading = false;

            // If all keywords are loaded, remove the scroll event listener
            if (currentIndex >= allKeywords.length) {
                window.removeEventListener('scroll', handleInfiniteScroll);
                loader.style.display = 'none'; // Ensure loader is hidden for good
            }

        }, 500); // 0.5 second delay
    }

    /**
     * Handles the scroll event to trigger loading the next batch.
     */
    function handleInfiniteScroll() {
        // Check if the user has scrolled near the bottom of the page
        if ((window.innerHeight + window.scrollY) >= document.documentElement.offsetHeight - 100) {
            loadNextBatch();
        }
    }

    /**
     * Initializes the page by fetching keywords from the file.
     */
    async function initialize() {
        try {
            const response = await fetch('keyword.txt');
            if (!response.ok) throw new Error('keyword.txt file not found.');
            
            const text = await response.text();
            allKeywords = text.split('\n').filter(k => k.trim() !== '');

            if (allKeywords.length > 0) {
                // Load the first batch
                loadNextBatch();
                // Add the event listener for infinite scrolling
                window.addEventListener('scroll', handleInfiniteScroll);
            } else {
                contentContainer.innerHTML = '<p>No keywords to display.</p>';
                loader.style.display = 'none';
            }
        } catch (error) {
            console.error('Error:', error);
            contentContainer.innerHTML = `<p style="text-align:center; color:red;">${error.message}</p>`;
            loader.style.display = 'none';
        }
    }

    // Start the process
    initialize();
});
