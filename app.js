/* -------------------------------------------------------------
   INTERACTION LOGIC AND ANIMATION ENGINE - DRA. CAROLINA CASTRO
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Sticky Header scroll effect ---
    const header = document.getElementById('main-header');
    
    const handleScrollHeader = () => {
        if (window.scrollY > 80) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    };
    
    window.addEventListener('scroll', handleScrollHeader);
    handleScrollHeader(); // Initialize on page load

    // --- 2. Mobile Burger Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    const toggleMobileMenu = () => {
        mobileMenuBtn.classList.toggle('active');
        mobileNav.classList.toggle('open');
        
        // Prevent body scrolling when menu is open
        if (mobileNav.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };
    
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileNav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // --- 3. Dynamic Service Card Expansion (Read More Accordion) ---
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    
    readMoreButtons.forEach(btn => {
        // Handle click on button
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering parent clicks
            toggleCardExpansion(btn);
        });
        
        // Handle click on parent expandable card for improved UX
        const parentCard = btn.closest('.expandable');
        if (parentCard) {
            parentCard.addEventListener('click', () => {
                toggleCardExpansion(btn);
            });
        }
    });
    
    const toggleCardExpansion = (btn) => {
        const descFull = btn.previousElementSibling;
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            // Collapse
            descFull.classList.add('hidden');
            btn.setAttribute('aria-expanded', 'false');
            btn.innerHTML = 'Leia mais <span class="arrow">↓</span>';
        } else {
            // Expand
            descFull.classList.remove('hidden');
            btn.setAttribute('aria-expanded', 'true');
            btn.innerHTML = 'Leia menos <span class="arrow">↑</span>';
        }
    };

    // --- 4. Scroll Reveal Fallback (For browsers lacking Scroll-Driven CSS animations) ---
    const animatedElements = document.querySelectorAll('.animated-reveal');
    
    // Check for native CSS Scroll-Driven Animation support
    const supportsScrollDrivenAnimations = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
    
    if (!supportsScrollDrivenAnimations) {
        // Browser does NOT support native scroll-driven animations -> Setup IntersectionObserver fallback
        
        // Add fallback setup classes
        animatedElements.forEach(el => {
            el.classList.add('js-reveal');
        });
        
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Once animated, we can unobserve if we want a one-shot enter animation
                    observer.unobserve(entry.target);
                }
            });
        };
        
        const revealObserver = new IntersectionObserver(revealCallback, {
            root: null, // Viewport
            threshold: 0.15, // Trigger when 15% of the element is visible
            rootMargin: '0px 0px -40px 0px' // Offset trigger point slightly from bottom edge
        });
        
        animatedElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // --- 5. Active Link Highlight on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const highlightActiveLink = () => {
        let scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120; // Offset for sticky header
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    
    window.addEventListener('scroll', highlightActiveLink);
    highlightActiveLink(); // Trigger once on load

    // --- 6. Set Current Year dynamically in Footer ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
