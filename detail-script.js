document.addEventListener('DOMContentLoaded', function() {

    // DOM Elements
    const detailTitle = document.getElementById('detail-title');
    const detailImageContainer = document.getElementById('detail-image-container');
    const detailBody = document.getElementById('detail-body');
    const relatedPostsContainer = document.getElementById('related-posts-container');

    // Get the keyword from the URL parameter (?q=...)
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get('q');

    /**
     * Capitalizes the first letter of each word in a string.
     * @param {string} str The string to capitalize.
     * @returns {string} The capitalized string.
     */
    function capitalizeEachWord(str) {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    // If no keyword is found in the URL, display an error message
    if (!keyword) {
        detailTitle.textContent = 'Content Not Found';
        detailBody.innerHTML = '<p>Sorry, the requested content could not be found. Please return to the <a href="index.html">homepage</a>.</p>';
        if (relatedPostsContainer) {
            relatedPostsContainer.closest('.related-posts-section').style.display = 'none';
        }
        return;
    }

    /**
     * Populates the main article content based on the keyword.
     * @param {string} term The keyword from the URL.
     */
    function populateMainContent(term) {
        const decodedTerm = decodeURIComponent(term).replace(/\+/g, ' ');
        const capitalizedTerm = capitalizeEachWord(decodedTerm);

        // Set the page title and H1 heading
        document.title = `${capitalizedTerm} | DecorInspire`;
        detailTitle.textContent = capitalizedTerm;

        // Set the main image from Bing
        const imageUrl = `https://tse1.mm.bing.net/th?q=${encodeURIComponent(decodedTerm)}&w=800&h=500&c=7&rs=1&p=0`;
        detailImageContainer.innerHTML = `<img src="${imageUrl}" alt="${capitalizedTerm}">`;

        // Create the fake article paragraphs in English
        detailBody.innerHTML = `
            <p>Welcome to our inspiration gallery dedicated to <strong>${capitalizedTerm}</strong>. Finding the perfect idea for your project can sometimes be a challenge. Here, we've gathered a wide range of the best visual references to help you get a clearer and more detailed picture.</p>
            <p>Every detail in <strong>${capitalizedTerm}</strong> plays a crucial role in creating the atmosphere you desire. From color selection and textures to element arrangement, everything contributes to the final result. Notice how experts combine various components to produce a harmonious and functional design related to the topic of ${capitalizedTerm}.</p>
            <p>We hope this collection of images and ideas about <strong>${capitalizedTerm}</strong> sparks your creativity. Feel free to save the images you love as a reference for your next project. Happy creating!</p>
        `;
    }

    /**
     * Fetches and displays related posts based on the keyword.
     * @param {string} term The keyword to find related suggestions for.
     */
    function generateRelatedPosts(term) {
        // This logic uses the Google Suggest API to find related keywords
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
     * Callback function for the Google Suggest API call.
     * This must be a global function.
     * @param {Array} data The data returned from the API.
     */
    window.handleRelatedSuggest = function(data) {
        const suggestions = data[1]; // The second item in the array is the list of suggestions
        relatedPostsContainer.innerHTML = ''; // Clear the "loading" placeholder

        if (!suggestions || suggestions.length === 0) {
            relatedPostsContainer.closest('.related-posts-section').style.display = 'none';
            return;
        }

        const originalKeyword = decodeURIComponent(keyword).replace(/\+/g, ' ').toLowerCase();
        let relatedCount = 0;

        suggestions.forEach(relatedTerm => {
            // Don't show the same keyword and limit to 8 related posts
            if (relatedTerm.toLowerCase() === originalKeyword || relatedCount >= 8) return;

            relatedCount++;
            const encodedTerm = encodeURIComponent(relatedTerm);
            const imageUrl = `https://tse1.mm.bing.net/th?q=${encodedTerm}`;
            // Link will direct to another detail page, creating a Browse loop
            const linkUrl = `detail.html?q=${encodedTerm}`;

            const card = `
                <article class="content-card">
                    <a href="${linkUrl}">
                        <img src="${imageUrl}" alt="${relatedTerm}" loading="lazy">
                        <div class="content-card-body">
                            <h3>${capitalizeEachWord(relatedTerm)}</h3>
                        </div>
                    </a>
                </article>
            `;
            relatedPostsContainer.innerHTML += card;
        });

        // If no unique related posts were found, hide the section
        if(relatedCount === 0) {
             relatedPostsContainer.closest('.related-posts-section').style.display = 'none';
        }
    };

    // Execute all functions
    populateMainContent(keyword);
    generateRelatedPosts(keyword);

});
