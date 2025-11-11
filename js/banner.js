// Modern Banner Carousel with Featured Products
class BannerCarousel {
    constructor() {
        this.currentSlide = 0;
        this.autoPlayInterval = null;
        this.isTransitioning = false;
        
        // DOM elements
        this.slidesContainer = document.querySelector('.slides');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.indicatorsContainer = document.getElementById('banner-indicators');
        
        // Check if elements exist
        if (!this.slidesContainer) {
            console.warn('Banner carousel: .slides container not found');
            return;
        }
        
        // Load products and create slides
        this.loadFeaturedProducts();
    }
    
    async loadFeaturedProducts() {
        try {
            // Wait for products to be loaded
            if (typeof products === 'undefined') {
                console.warn('Products not loaded yet, using static banners');
                this.initWithStaticBanners();
                return;
            }
            
            // Get featured products (highest price = premium products)
            const featuredProducts = products
                .sort((a, b) => b.price - a.price)
                .slice(0, 4); // Get top 4 expensive products
            
            // Create product banner slides
            this.createProductSlides(featuredProducts);
            this.init();
        } catch (error) {
            console.error('Error loading featured products:', error);
            this.initWithStaticBanners();
        }
    }
    
    initWithStaticBanners() {
        this.slides = Array.from(this.slidesContainer.children);
        this.totalSlides = this.slides.length;
        
        if (this.totalSlides > 0) {
            this.init();
        }
    }
    
    createProductSlides(featuredProducts) {
        // Clear existing slides
        this.slidesContainer.innerHTML = '';
        
        featuredProducts.forEach(product => {
            const slide = document.createElement('div');
            slide.className = 'banner-slide';
            slide.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="banner-overlay">
                    <div class="banner-content">
                        <span class="banner-badge">SẢN PHẨM NỔI BẬT</span>
                        <h2 class="banner-title">${product.name}</h2>
                        <p class="banner-price">${parseInt(product.price).toLocaleString('vi-VN')}đ</p>
                        <a href="#product/${product.id}" class="banner-btn-view">
                            <i class="fas fa-eye"></i> Xem Chi Tiết
                        </a>
                    </div>
                </div>
            `;
            this.slidesContainer.appendChild(slide);
        });
        
        this.slides = Array.from(this.slidesContainer.children);
        this.totalSlides = this.slides.length;
    }
    
    init() {
        // Create indicators
        this.createIndicators();
        
        // Event listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Touch/swipe support
        this.addTouchSupport();
        
        // Keyboard navigation
        this.addKeyboardSupport();
        
        // Pause on hover
        const banner = document.querySelector('.banner');
        if (banner) {
            banner.addEventListener('mouseenter', () => this.pauseAutoPlay());
            banner.addEventListener('mouseleave', () => this.startAutoPlay());
        }
        
        // Start auto-play
        this.startAutoPlay();
        
        // Initial update
        this.updateSlide(false);
    }
    
    createIndicators() {
        if (!this.indicatorsContainer) return;
        
        for (let i = 0; i < this.totalSlides; i++) {
            const indicator = document.createElement('button');
            indicator.classList.add('banner-indicator');
            indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }
    
    updateSlide(animate = true) {
        if (this.isTransitioning) return;
        
        // Update transform
        const translateX = -this.currentSlide * (100 / this.totalSlides);
        
        if (!animate) {
            this.slidesContainer.style.transition = 'none';
        } else {
            this.slidesContainer.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            this.isTransitioning = true;
        }
        
        this.slidesContainer.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        this.updateIndicators();
        
        // Reset transition lock after animation
        if (animate) {
            setTimeout(() => {
                this.isTransitioning = false;
            }, 600);
        }
    }
    
    updateIndicators() {
        if (!this.indicatorsContainer) return;
        
        const indicators = this.indicatorsContainer.querySelectorAll('.banner-indicator');
        indicators.forEach((indicator, index) => {
            if (index === this.currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlide();
        this.resetAutoPlay();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlide();
        this.resetAutoPlay();
    }
    
    goToSlide(index) {
        if (index === this.currentSlide) return;
        this.currentSlide = index;
        this.updateSlide();
        this.resetAutoPlay();
    }
    
    startAutoPlay() {
        this.pauseAutoPlay();
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resetAutoPlay() {
        this.pauseAutoPlay();
        this.startAutoPlay();
    }
    
    addTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        const banner = document.querySelector('.banner');
        if (!banner) return;
        
        banner.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        banner.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
        
        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        };
        
        this.handleSwipe = handleSwipe;
    }
    
    addKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            // Only handle if banner is visible
            const banner = document.querySelector('.banner');
            if (!banner || !this.isElementInViewport(banner)) return;
            
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
    }
    
    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// Initialize carousel when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new BannerCarousel();
    });
} else {
    new BannerCarousel();
}
