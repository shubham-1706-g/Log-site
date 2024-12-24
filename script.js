// Navbar JS
document.addEventListener("DOMContentLoaded", () => {
    const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
    const sideNav = document.querySelector(".side-nav");
    const navOverlay = document.querySelector(".nav-overlay");
    const sideNavDropdowns = document.querySelectorAll(".side-nav-dropdown");
    const navbar = document.getElementById('smart-navbar');
    let lastScrollTop = 0;
    let isScrolling = false;

    // Smart Navbar Visibility
    const handleNavbarVisibility = () => {
        const scrollTop = window.pageYOffset;

        if (scrollTop > lastScrollTop && scrollTop > 80) {
            navbar.classList.add('navbar--hidden');
        } else {
            navbar.classList.remove('navbar--hidden');
        }

        lastScrollTop = scrollTop;
        isScrolling = false;
    };

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleNavbarVisibility();
            });
            isScrolling = true;
        }
    });

    // Mobile Navigation
    const toggleMobileNav = () => {
        sideNav.classList.toggle("active");
        navOverlay.classList.toggle("active");
        document.body.style.overflow = sideNav.classList.contains("active") ? "hidden" : "";
    };

    mobileNavToggle.addEventListener("click", toggleMobileNav);
    navOverlay.addEventListener("click", toggleMobileNav);

    // Side Navigation Dropdowns
    sideNavDropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector(".side-nav-item");

        trigger.addEventListener("click", () => {
            const isActive = dropdown.classList.contains("active");

            // Close other dropdowns
            sideNavDropdowns.forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove("active");
                }
            });

            dropdown.classList.toggle("active");

            // Rotate chevron icon
            const icon = trigger.querySelector(".fas.fa-chevron-down");
            icon.style.transform = isActive ? "rotate(0deg)" : "rotate(180deg)";
        });
    });

    // Handle keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && sideNav.classList.contains("active")) {
            toggleMobileNav();
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 1024 && sideNav.classList.contains("active")) {
                toggleMobileNav();
            }
        }, 250);
    });

    // Handle touch events for better mobile experience
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    const handleSwipe = () => {
        const swipeThreshold = 100;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance < 0 && !sideNav.classList.contains("active")) {
                // Swipe left - open nav
                toggleMobileNav();
            } else if (swipeDistance > 0 && sideNav.classList.contains("active")) {
                // Swipe right - close nav
                toggleMobileNav();
            }
        }
    };

    // Prevent body scroll when side nav is open on iOS
    sideNav.addEventListener("touchmove", (e) => {
        if (sideNav.scrollHeight <= sideNav.clientHeight) {
            e.preventDefault();
        }
    }, { passive: false });

    // Handle smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    // Close mobile nav if open
                    if (sideNav.classList.contains("active")) {
                        toggleMobileNav();
                    }

                    // Smooth scroll to target
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

//Navbar js ends here


//corousel js

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.hero-carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');

    // Clone first and last slides for infinite effect
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);

    // Add clones to carousel
    carousel.appendChild(firstClone);
    carousel.insertBefore(lastClone, slides[0]);

    let currentSlide = 1; // Start from first real slide (after clone)
    let autoSlideInterval;
    let isDragging = false;
    let startX;
    let currentX;
    let slideWidth;
    const totalSlides = slides.length;

    // Initialize and update slide dimensions
    const updateSlideWidth = () => {
        slideWidth = carousel.offsetWidth;
        // Position carousel at first real slide without transition
        carousel.style.transition = 'none';
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    };

    // Initial setup
    updateSlideWidth();

    // Update carousel position with proper dot indication
    const updateCarousel = (transition = true) => {
        carousel.style.transition = transition ? 'transform 0.3s ease-out' : 'none';
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update dots - account for cloned slides
        const realIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === realIndex);
        });
    };

    // Handle infinite loop transitions
    const handleTransitionEnd = () => {
        if (currentSlide === 0) {
            // If we're at the first clone, jump to the last real slide
            carousel.style.transition = 'none';
            currentSlide = totalSlides;
            carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        } else if (currentSlide === totalSlides + 1) {
            // If we're at the last clone, jump to the first real slide
            carousel.style.transition = 'none';
            currentSlide = 1;
            carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
    };

    // Auto slide functionality
    const startAutoSlide = () => {
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
            currentSlide++;
            updateCarousel();
        }, 3000);
    };

    const stopAutoSlide = () => {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    };

    // Click navigation
    const handleClick = (e) => {
        if (!isDragging) {
            const rect = carousel.getBoundingClientRect();
            const clickX = e.clientX - rect.left;

            if (clickX > rect.width / 2) {
                currentSlide++;
            } else {
                currentSlide--;
            }

            updateCarousel();
            stopAutoSlide();
            startAutoSlide();
        }
    };

    //Nav hide/show 
    //Navbar animation
    document.addEventListener('DOMContentLoaded', function () {
        let prevScrollPos = window.pageYOffset;
        let timeoutId = null;
        const navbar = document.getElementById('smart-navbar');

        function showNavbar() {
            navbar.classList.remove('navbar--hidden');
            navbar.classList.add('navbar--visible');
        }

        function hideNavbar() {
            navbar.classList.add('navbar--hidden');
            navbar.classList.remove('navbar--visible');
        }

        window.addEventListener('scroll', function () {
            // Clear the existing timeout
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            const currentScrollPos = window.pageYOffset;
            const isScrollingDown = prevScrollPos < currentScrollPos;
            const isAtTop = currentScrollPos < 10;
            const isAtBottom = window.innerHeight + currentScrollPos >= document.documentElement.scrollHeight - 100;

            // Show navbar at top and bottom of page
            if (isAtTop || isAtBottom) {
                showNavbar();
            } else if (!isAtTop && !isAtBottom && isScrollingDown) {
                hideNavbar();
            } else {
                showNavbar();
            }

            // Set timeout to show navbar after 3 seconds of no scrolling
            timeoutId = setTimeout(() => {
                showNavbar();
            }, 3000);

            prevScrollPos = currentScrollPos;
        });
    });


    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Drag functionality
    const handleDragStart = (e) => {
        isDragging = true;
        startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
        currentX = startX;
        carousel.style.transition = 'none';
        stopAutoSlide();
    };

    const handleDragMove = (e) => {
        if (!isDragging) return;

        e.preventDefault();
        currentX = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
        const diff = currentX - startX;
        const drag = -(currentSlide * slideWidth - diff);
        carousel.style.transform = `translateX(${drag}px)`;
    };

    const handleDragEnd = () => {
        if (!isDragging) return;

        isDragging = false;
        const diff = currentX - startX;
        const threshold = slideWidth / 3;

        if (Math.abs(diff) > threshold) {
            currentSlide += diff > 0 ? -1 : 1;
        }

        updateCarousel();
        startAutoSlide();
    };

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index + 1; // Account for cloned slide
            updateCarousel();
            stopAutoSlide();
            startAutoSlide();
        });
    });

    // Event listeners
    carousel.addEventListener('click', handleClick);
    carousel.addEventListener('transitionend', handleTransitionEnd);

    // Mouse events
    carousel.addEventListener('mousedown', handleDragStart);
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);

    // Touch events
    carousel.addEventListener('touchstart', handleDragStart, { passive: true });
    carousel.addEventListener('touchmove', handleDragMove, { passive: false });
    carousel.addEventListener('touchend', handleDragEnd);

    // Visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoSlide();
        } else {
            startAutoSlide();
        }
    });

    // Window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateSlideWidth();
            updateCarousel(false);
        }, 250);
    });

    // Start the carousel
    setTimeout(() => {
        carousel.style.transition = 'transform 0.3s ease-out';
        startAutoSlide();
    }, 50);
});

//scroll our services js ends here


// Clone scroll content for seamless loop
document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.querySelector('.services-scroll');
    scrollContainer.innerHTML += scrollContainer.innerHTML;
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.section-title, .section-subtitle, .services-grid').forEach(element => {
    observer.observe(element);
});



