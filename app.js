// --- FIXMYPDF: HOMEPAGE LOGIC --- //

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Grab elements needed for the search filter
    const searchInput = document.getElementById('search-input');
    const toolCards = document.querySelectorAll('.tool-card');
    const noResults = document.getElementById('no-results');

    // 2. Listen for the user typing in the search bar
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        let visibleCount = 0;

        // 3. Loop through all 17 tool cards
        toolCards.forEach(card => {
            // Get the text from the h3 (Title) and p (Description)
            const title = card.querySelector('h3').textContent.toLowerCase();
            const desc = card.querySelector('p').textContent.toLowerCase();

            // 4. If the typed word is in the title or description, show it
            if (title.includes(searchTerm) || desc.includes(searchTerm)) {
                card.style.display = 'flex'; // Show card
                visibleCount++;
            } else {
                card.style.display = 'none'; // Hide card
            }
        });

        // 5. Show "No tools found" message if everything is hidden
        if (visibleCount === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }
    });

});