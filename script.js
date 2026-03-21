document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Animate burger menu
        const bars = mobileMenu.querySelectorAll('.bar');
        if (mobileMenu.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');

            const bars = mobileMenu.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll reveal animation using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ==========================================
    // Picture-in-Picture Insta Reel Logic
    // ==========================================
    const heroSection = document.getElementById('home');
    const pipContainer = document.getElementById('pip-container');
    const instaFrame = document.getElementById('insta-reel-frame');
    const closePipBtn = document.getElementById('close-pip');
    let pipDismissed = false; // To track if the user manually closed the mini player

    const instaReels = [
        "https://www.instagram.com/p/DWFF6W5k-zJ/embed",
        "https://www.instagram.com/p/DWGUouGj37j/embed",
        "https://www.instagram.com/p/DWGS4nejz5D/embed"
    ];

    if (heroSection && pipContainer && closePipBtn) {
        const pipObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If the hero section is out of view, and PIP wasn't dismissed
                if (!entry.isIntersecting && !pipDismissed) {

                    // Pick a random Instagram Reel
                    const randomReel = instaReels[Math.floor(Math.random() * instaReels.length)];

                    if (instaFrame.src !== randomReel) {
                        instaFrame.src = randomReel;
                    }

                    pipContainer.classList.add('active'); // Slide into view
                } else {
                    // Back to hero section
                    pipContainer.classList.remove('active'); // Slide out of view
                }
            });
        }, { threshold: 0.1 }); // triggers when less than 10% of hero is visible

        pipObserver.observe(heroSection);

        // Handle closing the PIP manually
        closePipBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            pipContainer.classList.remove('active');
            pipDismissed = true; // Prevent it from re-opening again unless page reloads

            // Clear iframe so it stops playing background audio
            setTimeout(() => { instaFrame.src = ""; }, 500);
        });
    }

    // ==========================================
    // Store Opening Countdown & Confetti
    // ==========================================
    
    // Trigger Confetti Celebration
    if (typeof confetti === 'function') {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    // Countdown Timer Logic
    const countdownEl = document.getElementById('hero-countdown');
    if (countdownEl) {
        // Set target date to tomorrow at 9:00 AM
        const openingDate = new Date();
        openingDate.setDate(openingDate.getDate() + 1);
        openingDate.setHours(9, 0, 0, 0);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minsEl = document.getElementById('mins');
        const secsEl = document.getElementById('secs');
        const badgeEl = document.querySelector('.celebration-badge');

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = openingDate.getTime() - now;

            if (distance < 0) {
                clearInterval(timerInterval);
                daysEl.innerText = "00";
                hoursEl.innerText = "00";
                minsEl.innerText = "00";
                secsEl.innerText = "00";
                if(badgeEl) badgeEl.innerText = "🎉 We Are Open! 🎉";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((distance % (1000 * 60)) / 1000);

            daysEl.innerText = days.toString().padStart(2, '0');
            hoursEl.innerText = hours.toString().padStart(2, '0');
            minsEl.innerText = mins.toString().padStart(2, '0');
            secsEl.innerText = secs.toString().padStart(2, '0');
        };

        updateCountdown();
        const timerInterval = setInterval(updateCountdown, 1000);
    }
});
