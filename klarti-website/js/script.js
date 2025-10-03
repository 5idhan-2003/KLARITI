// Initialize Supabase client using configuration
let supabase;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Supabase client from config
    if (window.KLARTI_CONFIG) {
        supabase = window.supabase.createClient(
            window.KLARTI_CONFIG.SUPABASE.URL,
            window.KLARTI_CONFIG.SUPABASE.ANON_KEY
        );
    }
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }

        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = document.querySelectorAll('.nav-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add animation classes and observe elements
    const animateElements = document.querySelectorAll(
        '.section-header, .solution-card, .about-text, .contact-info, .contact-form, .stats-grid'
    );

    animateElements.forEach((element, index) => {
        element.classList.add('fade-in');
        observer.observe(element);

        // Add staggered delay for solution cards
        if (element.classList.contains('solution-card')) {
            element.style.transitionDelay = `${index * 0.1}s`;
        }
    });

    // Add slide animations for about section
    const aboutText = document.querySelector('.about-text');
    const aboutVisual = document.querySelector('.about-visual');

    if (aboutText) {
        aboutText.classList.add('slide-in-left');
        observer.observe(aboutText);
    }

    if (aboutVisual) {
        aboutVisual.classList.add('slide-in-right');
        observer.observe(aboutVisual);
    }

    // Animate stats on scroll
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;

                if (finalValue.includes('%')) {
                    animateNumber(target, 0, parseInt(finalValue), '%');
                } else if (finalValue.includes('+')) {
                    animateNumber(target, 0, parseInt(finalValue), '+');
                } else {
                    target.textContent = finalValue;
                }

                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Number animation function
    function animateNumber(element, start, end, suffix = '') {
        const duration = 2000;
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 16);
    }

    // Form submission with Supabase integration
    const contactForm = document.querySelector('.form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitButton = contactForm.querySelector('.submit-button');
            const originalText = submitButton.textContent;

            console.log('Form submission started...');

            // Check if Supabase is initialized
            if (!supabase) {
                console.error('Supabase client not initialized!');
                alert('Connection error. Please refresh the page and try again.');
                return;
            }

            // Get form data
            const institutionName = contactForm.querySelector('input[type="text"]').value.trim();
            const email = contactForm.querySelector('input[type="email"]').value.trim();
            const institutionType = contactForm.querySelector('select').value;
            const message = contactForm.querySelector('textarea').value.trim();

            console.log('Form data:', { institutionName, email, institutionType, message });

            // Validate required fields
            if (!institutionName || !email || !institutionType || !message) {
                alert('Please fill in all required fields.');
                return;
            }

            // Show loading state
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;

            try {
                console.log('Attempting to insert data into Supabase...');

                // Insert data into Supabase with explicit options
                const { data, error } = await supabase
                    .from('demo_requests')
                    .insert({
                        institution_name: institutionName,
                        contact_email: email,
                        institution_type: institutionType,
                        message: message
                    }, {
                        returning: 'minimal'
                    });

                console.log('Supabase response:', { data, error });

                if (error) {
                    console.error('Supabase error details:', error);
                    throw error;
                }

                console.log('Data inserted successfully:', data);

                // Success state
                submitButton.textContent = 'Demo Request Submitted! ✓';

                // Send notification email via Supabase Edge Function
                try {
                    await sendEmailNotification({
                        institutionName,
                        email,
                        institutionType,
                        message
                    });
                } catch (emailError) {
                    console.error('Email notification failed:', emailError);
                    // Don't show error to user since form submission was successful
                }

                // Reset form after success
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    contactForm.reset();
                }, 3000);

            } catch (error) {
                console.error('Submission failed with error:', error);

                // Show specific error message
                let errorMessage = 'Submission failed. ';

                if (error.message) {
                    console.log('Error message:', error.message);

                    if (error.message.includes('relation "demo_requests" does not exist')) {
                        errorMessage = 'Database not set up. Please run the SQL script first.';
                    } else if (error.message.includes('JWT')) {
                        errorMessage = 'Authentication error. Please check configuration.';
                    } else if (error.message.includes('permission denied')) {
                        errorMessage = 'Permission error. Please check database policies.';
                    } else {
                        errorMessage += error.message;
                    }
                }

                submitButton.textContent = errorMessage;

                // Reset button after 5 seconds for longer error messages
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 5000);
            }
        });
    }

    // Function to send email notification via Supabase Edge Function
    async function sendEmailNotification({ institutionName, email, institutionType, message }) {
        try {
            console.log('Sending email notification via Supabase Edge Function...');

            const { data, error } = await supabase.functions.invoke('send-email-notification', {
                body: {
                    institutionName,
                    email,
                    institutionType,
                    message
                }
            });

            if (error) {
                console.error('Edge Function error:', error);
                throw error;
            }

            console.log('✅ Email notification sent successfully:', data);
            return data;

        } catch (error) {
            console.error('Failed to send email notification:', error);

            // Fallback: Log the information for manual follow-up
            console.log('📋 Lead Information (manual follow-up required):', {
                institutionName,
                email,
                institutionType,
                message,
                timestamp: new Date().toLocaleString()
            });

            throw error;
        }
    }

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // Geometric animation for grid items in about section
    const gridItems = document.querySelectorAll('.grid-item');
    let animationDelay = 0;

    const gridObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    gridItems.forEach((item, index) => {
                        setTimeout(() => {
                            if (item.classList.contains('active')) {
                                item.style.transform = 'scale(1.1) rotate(5deg)';
                            }
                        }, index * 200);
                    });
                }, 500);
                gridObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const visualGrid = document.querySelector('.visual-grid');
    if (visualGrid) {
        gridObserver.observe(visualGrid);
    }

    // Add hover effects for solution cards
    const solutionCards = document.querySelectorAll('.solution-card');
    solutionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-4px) scale(1)';
        });
    });

    // Smooth fade-in effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';

        setTimeout(() => {
            heroTitle.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 800);
    }

    // Smooth fade-in for hero description
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) {
        heroDescription.style.opacity = '0';
        heroDescription.style.transform = 'translateY(30px)';

        setTimeout(() => {
            heroDescription.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
            heroDescription.style.opacity = '1';
            heroDescription.style.transform = 'translateY(0)';
        }, 1200);
    }

    // Smooth fade-in for hero buttons
    const heroButtons = document.querySelector('.hero-buttons');
    if (heroButtons) {
        heroButtons.style.opacity = '0';
        heroButtons.style.transform = 'translateY(30px)';

        setTimeout(() => {
            heroButtons.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
            heroButtons.style.opacity = '1';
            heroButtons.style.transform = 'translateY(0)';
        }, 1600);
    }

    // Add scroll progress indicator
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    scrollProgress.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #000, #444);
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    });
});