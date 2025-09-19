// Basic JavaScript for MP1

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  
  // Get navbar and navigation links
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section, header, footer');
  
  // Function to update navbar size based on scroll position
  function updateNavbarSize() {
    const scrollY = window.scrollY;
    
    if (scrollY <= 50) {
      // At top - make navbar larger
      navbar.classList.add('large');
      navLinks.forEach(link => {
        link.classList.add('large-text');
      });
    } else {
      // Scrolled down - make navbar smaller
      navbar.classList.remove('large');
      navLinks.forEach(link => {
        link.classList.remove('large-text');
      });
    }
  }
  
  // Function to update active nav link based on current section
  function updateActiveNavLink() {
    const scrollY = window.scrollY;
    const navbarHeight = navbar.offsetHeight;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;
    
    // Remove active class from all links
    navLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    // Find which section is most visible in the viewport
    let currentSection = 'header';
    let maxVisibleArea = 0;
    
    // Check each section to see which one has the most visible area
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const viewportTop = scrollY + navbarHeight;
      const viewportBottom = scrollY + windowHeight;
      
      // Calculate the visible area of this section
      const visibleTop = Math.max(sectionTop, viewportTop);
      const visibleBottom = Math.min(sectionBottom, viewportBottom);
      const visibleArea = Math.max(0, visibleBottom - visibleTop);
      
      // If this section has more visible area than previous sections
      if (visibleArea > maxVisibleArea) {
        maxVisibleArea = visibleArea;
        currentSection = section.id;
      }
    });
    
    // Special handling for edge cases
    // If we're at the very top, always show header
    if (scrollY < 50) {
      currentSection = 'header';
    }
    
    // If we're near the bottom, always show contact
    if (scrollY + windowHeight >= documentHeight - 50) {
      currentSection = 'contact';
    }
    
    // Add active class to current section's nav link
    const activeLink = document.querySelector(`a[href="#${currentSection}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }
  
  // Handle scroll events
  window.addEventListener('scroll', function() {
    updateNavbarSize();
    updateActiveNavLink();
  });
  
  // Handle window resize events
  window.addEventListener('resize', function() {
    // Recalculate positions when window size changes
    setTimeout(function() {
      updateActiveNavLink();
    }, 100);
  });
  
  // Add smooth scrolling functionality - more robust approach
  function addSmoothScrolling() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('#navbar a, nav a');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Only handle internal links that start with #
        if (href && href.startsWith('#')) {
          e.preventDefault();
          // Smooth scroll triggered for internal navigation
          
          const targetSection = document.querySelector(href);
          
          if (targetSection) {
            let targetPosition;
            
            // Calculate exact position for each section
            if (href === '#header') {
              // For header, go to the very top
              targetPosition = 0;
            } else {
              // For other sections, position exactly at the start accounting for navbar
              const navbarHeight = navbar.offsetHeight || 80; // fallback height
              targetPosition = targetSection.offsetTop - navbarHeight;
            }
            
            // Scroll to computed target position
            
            // Use simple browser smooth scroll - more reliable
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }
  
  // Custom smooth scroll function that always works
  function smoothScrollTo(targetPosition, duration) {
    const start = window.pageYOffset;
    const distance = targetPosition - start;
    let startTime = null;
    
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Use easing function for smooth animation
      const easedProgress = easeInOutQuad(progress);
      window.scrollTo(0, start + distance * easedProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    }
    
    requestAnimationFrame(animation);
  }
  
  // Call the smooth scrolling setup
  addSmoothScrolling();
  
  // Backup smooth scroll removed to prevent conflicts
  
  // Easing function for smooth animation fallback
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
  
  // Carousel functionality
  function initializeCarousel() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Function to show specific slide
    function showSlide(index) {
      // Remove active class from all slides and dots
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      // Add active class to current slide and dot
      if (slides[index]) {
        slides[index].classList.add('active');
      }
      if (dots[index]) {
        dots[index].classList.add('active');
      }
      
      currentSlide = index;
    }
    
    // Function to go to next slide
    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    }
    
    // Function to go to previous slide
    function prevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      showSlide(currentSlide);
    }
    
    // Event listeners for navigation arrows
    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', prevSlide);
    }
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
      });
    });
    
    // Auto-play carousel (optional - can be removed)
    let autoPlayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    
    // Pause auto-play on hover
    const carousel = document.querySelector('.carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
      });
      
      carousel.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(nextSlide, 5000);
      });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    });
    
    // Initialize first slide
    showSlide(0);
  }
  
  // Removed custom paging; rely on native scroll + navbar smooth links

  // (No custom paging functions)
  
  // Modal functionality
  function initializeModals() {
    const modalBtns = document.querySelectorAll('.modal-btn');
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal-close');
    
    // Open modal when button is clicked
    modalBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const modalId = this.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        
        if (modal) {
          modal.style.display = 'flex';
          setTimeout(() => {
            modal.classList.add('show');
            animateModalContent(modal);
          }, 10);
          
          // Prevent body scroll when modal is open
          document.body.style.overflow = 'hidden';
        }
      });
    });
    
    // Close modal when X is clicked
    modalCloses.forEach(closeBtn => {
      closeBtn.addEventListener('click', function() {
        const modal = this.closest('.modal');
        closeModal(modal);
      });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
      modal.addEventListener('click', function(e) {
        if (e.target === this) {
          closeModal(this);
        }
      });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
          closeModal(openModal);
        }
      }
    });
    
    function closeModal(modal) {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }, 300);
    }
    
    // Animate modal content items
    function animateModalContent(modal) {
      const items = modal.querySelectorAll('.project-item, .process-step');
      items.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('fade-in');
        }, index * 150);
      });
    }
  }
  
  // Initialize carousel functionality
  initializeCarousel();
  
  // Native scrolling only; navbar clicks provide smooth navigation
  // Initialize modal functionality
  initializeModals();
  
  // No custom paging initialization
  
  // Initialize on page load
  updateNavbarSize();
  updateActiveNavLink();
  
  // Debug logs removed for clean production code
});