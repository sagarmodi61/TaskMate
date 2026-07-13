document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. LIGHT / DARK THEME TOGGLE
  // ==========================================
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Retrieve saved theme or default to system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else {
    htmlElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // ==========================================
  // 2. MOBILE MENU OVERLAY
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const toggleMenu = () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    
    // Prevent scrolling when mobile menu is active
    if (mobileMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  mobileMenuBtn.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Close menu when a link is clicked
      mobileMenuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ==========================================
  // 3. SCROLL REVEAL ANIMATIONS
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve after showing to prevent continuous triggers
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1, // trigger when 10% visible
    rootMargin: '0px 0px -50px 0px' // offset to feel premium
  });

  revealElements.forEach(element => {
    revealOnScroll.observe(element);
  });

  // ==========================================
  // 4. INTERACTIVE SCREENSHOT GALLERY
  // ==========================================
  const galleryTrack = document.getElementById('gallery-track');
  const gallerySlides = document.querySelectorAll('.gallery-slide');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  const indicators = document.querySelectorAll('.gallery-indicators .indicator');
  
  let currentSlideIndex = 0;
  const totalSlides = gallerySlides.length;

  const updateGallery = (index) => {
    // Clamp/Wrap Index
    if (index >= totalSlides) index = 0;
    if (index < 0) index = totalSlides - 1;
    
    currentSlideIndex = index;

    // Translate the track container
    galleryTrack.style.transform = `translateX(-${currentSlideIndex * 25}%)`;

    // Toggle active classes on slides
    gallerySlides.forEach((slide, i) => {
      if (i === currentSlideIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Toggle active classes on indicators
    indicators.forEach((indicator, i) => {
      if (i === currentSlideIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  };

  prevBtn.addEventListener('click', () => {
    updateGallery(currentSlideIndex - 1);
  });

  nextBtn.addEventListener('click', () => {
    updateGallery(currentSlideIndex + 1);
  });

  indicators.forEach(indicator => {
    indicator.addEventListener('click', (e) => {
      const targetIndex = parseInt(e.target.getAttribute('data-index'), 10);
      updateGallery(targetIndex);
    });
  });

  // Optional: Auto-slide gallery every 8 seconds
  let autoSlideTimer = setInterval(() => {
    updateGallery(currentSlideIndex + 1);
  }, 8000);

  // Reset auto-slide timer on manual interaction
  const resetAutoSlide = () => {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(() => {
      updateGallery(currentSlideIndex + 1);
    }, 8000);
  };

  prevBtn.addEventListener('click', resetAutoSlide);
  nextBtn.addEventListener('click', resetAutoSlide);
  indicators.forEach(ind => ind.addEventListener('click', resetAutoSlide));

  // ==========================================
  // 5. FAQ ACCORDION TRANSITIONS
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      
      // Close all other panels (Accordion behavior)
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherPanel = otherItem.querySelector('.faq-panel');
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherPanel.style.maxHeight = null;
        }
      });

      // Toggle current panel
      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        item.classList.remove('active');
        panel.style.maxHeight = null;
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        item.classList.add('active');
        // Set max-height to scrollHeight to trigger smooth transition
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

});
