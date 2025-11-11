// Modern Search with Autocomplete and Real-time Suggestions
class SearchManager {
    constructor() {
        this.searchInput = document.getElementById("search-input");
        this.searchButton = document.getElementById("search-button");
        this.searchResultsDropdown = document.getElementById("search-results-dropdown");
        
        // Debounce timer
        this.debounceTimer = null;
        this.debounceDelay = 300; // milliseconds
        
        // Check if elements exist
        if (!this.searchInput || !this.searchButton || !this.searchResultsDropdown) {
            console.warn('Search: Required elements not found');
            return;
        }
        
        this.init();
    }
    
    init() {
        // Click event for search button
        this.searchButton.addEventListener("click", () => this.performSearch());
        
        // Enter key event
        this.searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                this.performSearch();
            } else if (event.key === "Escape") {
                this.hideDropdown();
            } else if (event.key === "ArrowDown") {
                event.preventDefault();
                this.navigateResults("down");
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                this.navigateResults("up");
            }
        });
        
        // Input event with debouncing for better performance
        this.searchInput.addEventListener("input", () => this.handleSearchInput());
        
        // Focus event
        this.searchInput.addEventListener("focus", () => {
            if (this.searchInput.value.trim()) {
                this.handleSearchInput();
            }
        });
        
        // Blur event - hide dropdown after short delay
        this.searchInput.addEventListener("blur", () => {
            setTimeout(() => this.hideDropdown(), 200);
        });
        
        // Click outside to close dropdown
        document.addEventListener("click", (e) => {
            if (!e.target.closest('.search-wrapper')) {
                this.hideDropdown();
            }
        });
    }
    
    performSearch() {
        const query = this.searchInput.value.trim();
        
        if (query) {
            // Navigate to search results page
            window.location.hash = `#search/${encodeURIComponent(query)}`;
            
            // Clear input and hide dropdown
            this.searchInput.value = "";
            this.hideDropdown();
            
            // Remove focus
            this.searchInput.blur();
        }
    }
    
    handleSearchInput() {
        // Clear existing debounce timer
        clearTimeout(this.debounceTimer);
        
        // Set new debounce timer
        this.debounceTimer = setTimeout(() => {
            this.showSuggestions();
        }, this.debounceDelay);
    }
    
    showSuggestions() {
        const query = this.searchInput.value.trim().toLowerCase();
        
        // Hide if query is too short
        if (query.length < 1) {
            this.hideDropdown();
            return;
        }
        
        // Check if products exist
        if (typeof products === 'undefined' || !Array.isArray(products)) {
            console.warn('Search: Products data not available');
            this.searchResultsDropdown.innerHTML = 
                '<p class="search-no-result">Dữ liệu sản phẩm chưa sẵn sàng...</p>';
            this.searchResultsDropdown.style.display = "block";
            return;
        }
        
        // Filter products - search in name and description
        const results = products
            .filter(product => {
                const name = product.name?.toLowerCase() || '';
                const description = product.description?.toLowerCase() || '';
                return name.includes(query) || description.includes(query);
            })
            .slice(0, 5);
        
        if (results.length > 0) {
            // Generate HTML for results
            const resultsHTML = results
                .map(product => this.createResultItem(product, query))
                .join("");
            
            this.searchResultsDropdown.innerHTML = resultsHTML;
            this.searchResultsDropdown.style.display = "block";
            
            // Add click events to result items
            this.addResultClickEvents();
        } else {
            // No results found
            this.searchResultsDropdown.innerHTML = `
                <p class="search-no-result">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <br>
                    Không tìm thấy sản phẩm phù hợp với "${this.escapeHtml(query)}"
                </p>
            `;
            this.searchResultsDropdown.style.display = "block";
        }
    }
    
    createResultItem(product, query) {
        // Safely parse price
        const price = parseInt(product.price) || 0;
        const formattedPrice = price.toLocaleString("vi-VN");
        
        // Highlight matching text
        const highlightedName = this.highlightText(product.name || 'N/A', query);
        
        // Safe image URL
        const imageUrl = product.image || '../img/placeholder.jpg';
        
        return `
            <a href="#product/${product.id}" class="search-result-item" data-product-id="${product.id}">
                <img src="${imageUrl}" alt="${this.escapeHtml(product.name)}" 
                     onerror="this.src='../img/placeholder.jpg'">
                <div class="search-result-info">
                    <p class="search-result-name">${highlightedName}</p>
                    <p class="search-result-price">${formattedPrice}đ</p>
                </div>
            </a>
        `;
    }
    
    highlightText(text, query) {
        if (!query) return this.escapeHtml(text);
        
        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        const escapedText = this.escapeHtml(text);
        return escapedText.replace(regex, '<strong style="color: #fa5e9a;">$1</strong>');
    }
    
    addResultClickEvents() {
        const items = this.searchResultsDropdown.querySelectorAll('.search-result-item');
        items.forEach(item => {
            item.addEventListener('click', (e) => {
                this.hideDropdown();
                this.searchInput.value = '';
            });
        });
    }
    
    navigateResults(direction) {
        const items = this.searchResultsDropdown.querySelectorAll('.search-result-item');
        if (items.length === 0) return;
        
        const currentActive = this.searchResultsDropdown.querySelector('.search-result-item.active');
        let nextIndex = 0;
        
        if (currentActive) {
            const currentIndex = Array.from(items).indexOf(currentActive);
            if (direction === 'down') {
                nextIndex = (currentIndex + 1) % items.length;
            } else {
                nextIndex = (currentIndex - 1 + items.length) % items.length;
            }
            currentActive.classList.remove('active');
        }
        
        items[nextIndex].classList.add('active');
        items[nextIndex].scrollIntoView({ block: 'nearest' });
    }
    
    hideDropdown() {
        this.searchResultsDropdown.style.display = "none";
        this.searchResultsDropdown.innerHTML = "";
    }
    
    // Utility functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    escapeRegex(text) {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

// Initialize search when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SearchManager();
    });
} else {
    new SearchManager();
}
