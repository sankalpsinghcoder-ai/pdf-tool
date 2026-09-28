// --- FIXMYPDF: HOMEPAGE LOGIC --- //

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Grab elements needed for the search filter
    const searchInput = document.getElementById('search-input');
    const toolCards = document.querySelectorAll('.tool-card');
    const noResults = document.getElementById('no-results');

    if (!searchInput) return;

    // 2. Listen for the user typing in the search bar
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        let visibleCount = 0;

        // 3. Loop through all tool cards
        toolCards.forEach(card => {
            const title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
            const desc = card.querySelector('p') ? card.querySelector('p').textContent.toLowerCase() : '';
            const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();

            // 4. Match against title, description, or localized search keywords
            if (!searchTerm || title.includes(searchTerm) || desc.includes(searchTerm) || keywords.includes(searchTerm)) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // 5. Show "No tools found" message if everything is hidden
        if (noResults) {
            if (visibleCount === 0) {
                noResults.classList.remove('hidden');
            } else {
                noResults.classList.add('hidden');
            }
        }
    });

});