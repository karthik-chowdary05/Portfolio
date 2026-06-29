document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Loader Control ---
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.visibility = 'hidden';
    }, 500);
  });

  // Fallback loader removal if load event takes too long
  setTimeout(() => {
    if (loader.style.visibility !== 'hidden') {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.visibility = 'hidden';
      }, 500);
    }
  }, 2500);

  // --- Scroll Progress Bar & Header Scrolled Class ---
  const scrollProgress = document.getElementById('scrollProgress');
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    // Progress bar
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    scrollProgress.style.width = scrolled + '%';

    // Header active background on scroll
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Menu Toggle ---
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      navLinks.classList.toggle('mobile-active');
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      
      // Update menu icon
      const menuIcon = mobileMenuBtn.querySelector('i');
      if (menuIcon) {
        if (!isExpanded) {
          menuIcon.setAttribute('data-lucide', 'x');
        } else {
          menuIcon.setAttribute('data-lucide', 'menu');
        }
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }
    });

    // Close mobile menu when clicking a nav link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        const menuIcon = mobileMenuBtn.querySelector('i');
        if (menuIcon) {
          menuIcon.setAttribute('data-lucide', 'menu');
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        }
      });
    });
  }

  // --- Light/Dark Theme Switcher ---
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('theme');

  // Apply saved theme on load
  if (currentTheme === 'dark') {
    document.body.classList.add('dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      let theme = 'light';
      if (document.body.classList.contains('dark')) {
        theme = 'dark';
      }
      localStorage.setItem('theme', theme);
    });
  }

  // --- Scroll Spy (Active Section Nav Link) ---
  const sections = document.querySelectorAll('section');
  const navLinksList = document.querySelectorAll('.nav-link');

  const scrollSpyOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // triggers when section covers middle of viewport
    threshold: 0
  };

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinksList.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, scrollSpyOptions);

  sections.forEach(section => {
    scrollSpyObserver.observe(section);
  });

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const revealOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); // trigger animation once
      }
    });
  }, revealOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // --- Skill Bars Animation ---
  const skillsSection = document.getElementById('skills');
  
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBars = document.querySelectorAll('.skill-progress');
          progressBars.forEach(bar => {
            const level = bar.getAttribute('data-level');
            bar.style.width = level;
          });
          skillsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    skillsObserver.observe(skillsSection);
  }

  // --- Achievements Counter Animation ---
  const achievementsSection = document.getElementById('achievements');
  let countersAnimated = false;

  function runCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 1200; // Total duration in ms
      const frameRate = 1000 / 60; // 60 FPS
      const totalFrames = Math.round(duration / frameRate);
      let frame = 0;

      const timer = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentValue = Math.floor(target * progress);
        
        // Append '+' to numbers for premium representation
        const suffix = '+';

        if (frame >= totalFrames) {
          counter.textContent = target + suffix;
          clearInterval(timer);
        } else {
          counter.textContent = currentValue + suffix;
        }
      }, frameRate);
    });
  }

  if (achievementsSection) {
    const achievementsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounters();
          achievementsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    achievementsObserver.observe(achievementsSection);
  }

  // --- Contact Form Submission & Toast System ---
  const contactForm = document.getElementById('contactForm');
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icon based on type
    const iconName = type === 'success' ? 'check-circle-2' : 'alert-circle';
    
    toast.innerHTML = `
      <i data-lucide="${iconName}"></i>
      <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons({
        attrs: {
          class: 'toast-icon'
        },
        nameAttr: 'data-lucide'
      });
    }

    // Slide out after 3 seconds, remove after 3.5 seconds
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 3000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = contactForm.querySelectorAll('.form-input, .form-textarea');
      
      inputs.forEach(input => {
        // Simple inputs reset
        input.classList.remove('invalid');
        
        // Validation check
        if (input.hasAttribute('required') && !input.value.trim()) {
          input.classList.add('invalid');
          isValid = false;
        }
        
        // Email specific validation
        if (input.type === 'email' && input.value.trim()) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(input.value.trim())) {
            input.classList.add('invalid');
            isValid = false;
          }
        }

        // Phone number specific validation (optional, check structure if entered)
        if (input.type === 'tel' && input.value.trim()) {
          const phonePattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
          if (!phonePattern.test(input.value.trim().replace(/\s/g, ''))) {
            input.classList.add('invalid');
            isValid = false;
          }
        }
      });
      
      if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const origContent = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i data-lucide="loader" class="loader-spinner" style="width:16px; height:16px; margin:0; animation: spin 1s linear infinite;"></i> Sending...`;
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
        
        const formData = {
          name: document.getElementById('formName').value,
          email: document.getElementById('formEmail').value,
          phone: document.getElementById('formPhone').value,
          message: document.getElementById('formMessage').value,
          _subject: `New Portfolio Message from ${document.getElementById('formName').value}`,
          _captcha: "false"
        };

        fetch("https://formsubmit.co/ajax/srikarthikmanne@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(formData)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          showToast('Thank you! Your message was sent successfully.');
          contactForm.reset();
        })
        .catch(error => {
          console.error('Error submitting form:', error);
          showToast('Oops! Something went wrong. Please try again.', 'error');
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origContent;
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        });
      } else {
        showToast('Please fix the errors in the form.', 'error');
      }
    });
    
    // Clear validation styling as user edits
    const fields = contactForm.querySelectorAll('.form-input, .form-textarea');
    fields.forEach(field => {
      field.addEventListener('input', () => {
        if (field.classList.contains('invalid')) {
          field.classList.remove('invalid');
        }
      });
    });
  }
});
