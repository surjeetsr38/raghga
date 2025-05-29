// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Typing Animation
    const phrases = ['I Game |', 'I Edit |', 'I Create |', 'I Game | I Edit | I Create |'];
    const typingText = document.querySelector('.typing-text');
    const hiddenText = document.querySelector('.hidden-text');
    let phraseIndex = 0;
    let charIndex = 0;
    let isWaiting = false;

    function colorText(text) {
        const words = text.split(/(\s+)/).filter(Boolean);
        return words.map(word => {
            if (word.trim() === 'I') {
                return `<span class="letter-i">I</span>`;
            } else if (word === '|' || word === ' ') {
                return word;
            } else if (word.trim().length > 0) {
                return `<span class="first-letter">${word[0]}</span>${word.slice(1)}`;
            }
            return word;
        }).join('');
    }

    function typeText() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isWaiting) {
            setTimeout(() => {
                isWaiting = false;
                // Instantly clear the text
                typingText.innerHTML = '';
                charIndex = 0;
                // Move to next phrase
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeText();
            }, 1000); // Wait 1 second before starting next word
            return;
        }

        // Typing animation
        typingText.innerHTML = colorText(currentPhrase.substring(0, charIndex + 1));
        charIndex++;

        if (charIndex === currentPhrase.length) {
            isWaiting = true;
        }

        const typingSpeed = 150; // Consistent typing speed
        if (!isWaiting) {
            setTimeout(typeText, typingSpeed);
        } else {
            typeText(); // Immediately trigger the waiting state
        }
    }

    // Start the typing animation with initial delay
    setTimeout(typeText, 1500);

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Video background handling
    const desktopVideo = document.querySelector('.desktop-video');
    const mobileVideo = document.querySelector('.mobile-video');

    // Function to check if device is mobile
    function isMobile() {
        return window.innerWidth < 768;
    }

    // Function to handle video loading based on device
    function handleVideoLoading() {
        if (isMobile()) {
            if (desktopVideo) desktopVideo.pause();
            if (mobileVideo) {
                mobileVideo.play().catch(function(error) {
                    console.log("Video autoplay failed:", error);
                });
            }
        } else {
            if (mobileVideo) mobileVideo.pause();
            if (desktopVideo) {
                desktopVideo.play().catch(function(error) {
                    console.log("Video autoplay failed:", error);
                });
            }
        }
    }

    // Initial load
    handleVideoLoading();

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleVideoLoading, 250);
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Video Interaction Handlers
    const allVideos = document.querySelectorAll('.project-video');
    
    allVideos.forEach(video => {
        video.addEventListener('play', () => {
            // Pause all other videos
            allVideos.forEach(otherVideo => {
                if (otherVideo !== video && !otherVideo.paused) {
                    otherVideo.pause();
                }
            });
        });
    });

    document.querySelectorAll('.portfolio-item').forEach(item => {
        const video = item.querySelector('video');
        const likeBtn = item.querySelector('.btn-like');
        const commentBtn = item.querySelector('.btn-comment');
        const shareBtn = item.querySelector('.btn-share');
        const commentsSection = item.querySelector('.comments-section');
        const commentForm = item.querySelector('.comment-form');
        const viewCount = item.querySelector('.view-count span');
        let views = parseInt(localStorage.getItem(`views-${video.src}`) || '0');

        // Initialize view count
        viewCount.textContent = views;

        // View counter
        video.addEventListener('play', () => {
            views++;
            viewCount.textContent = views;
            localStorage.setItem(`views-${video.src}`, views.toString());
        });

        // Like functionality
        if (likeBtn) {
            const likeCount = likeBtn.querySelector('.like-count');
            let likes = parseInt(localStorage.getItem(`likes-${video.src}`) || '0');
            let isLiked = localStorage.getItem(`liked-${video.src}`) === 'true';

            likeCount.textContent = likes;
            if (isLiked) likeBtn.classList.add('active');

            likeBtn.addEventListener('click', () => {
                if (!isLiked) {
                    likes++;
                    likeBtn.classList.add('active');
                    isLiked = true;
                } else {
                    likes--;
                    likeBtn.classList.remove('active');
                    isLiked = false;
                }
                likeCount.textContent = likes;
                localStorage.setItem(`likes-${video.src}`, likes.toString());
                localStorage.setItem(`liked-${video.src}`, isLiked.toString());
            });
        }

        // Comment functionality
        if (commentBtn) {
            commentBtn.addEventListener('click', () => {
                commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
            });
        }

        // Share functionality
        if (shareBtn) {
            shareBtn.addEventListener('click', async () => {
                try {
                    if (navigator.share) {
                        await navigator.share({
                            title: 'Check out this awesome video!',
                            text: 'Watch this amazing content from my portfolio',
                            url: window.location.href
                        });
                    } else {
                        // Fallback for browsers that don't support Web Share API
                        const dummy = document.createElement('input');
                        document.body.appendChild(dummy);
                        dummy.value = window.location.href;
                        dummy.select();
                        document.execCommand('copy');
                        document.body.removeChild(dummy);
                        alert('Link copied to clipboard!');
                    }
                } catch (err) {
                    console.error('Error sharing:', err);
                }
            });
        }

        // Comment form handling
        if (commentForm) {
            commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = commentForm.querySelector('input');
                const commentsList = item.querySelector('.comments-list');
                
                if (input.value.trim()) {
                    const comment = document.createElement('div');
                    comment.className = 'comment-item';
                    comment.innerHTML = `
                        <div class="d-flex justify-content-between">
                            <strong>User</strong>
                            <small>${new Date().toLocaleDateString()}</small>
                        </div>
                        <p class="mb-0">${input.value}</p>
                    `;
                    commentsList.appendChild(comment);
                    input.value = '';

                    // Update comment count
                    const commentCount = item.querySelector('.comment-count');
                    commentCount.textContent = parseInt(commentCount.textContent) + 1;
                }
            });
        }
    });

    // Form submission handling
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your form submission logic here
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }

    // Add loading animation for portfolio items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
        });
    });

    // Social Media Hover Effects
    document.querySelectorAll('.social-icons a').forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            const platform = icon.getAttribute('data-platform');
            icon.style.color = {
                youtube: '#ff0000',
                twitch: '#6441a5',
                twitter: '#1da1f2',
                instagram: '#e1306c'
            }[platform] || '#ffffff';
        });

        icon.addEventListener('mouseleave', () => {
            icon.style.color = '';
        });
    });

    // Form Handling
    const form = document.getElementById('videoRequestForm');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
            submitButton.disabled = true;
            
            // Collect form data
            const formData = new FormData();
            formData.append('name', form.querySelector('#name').value);
            formData.append('email', form.querySelector('#email').value);
            formData.append('projectType', form.querySelector('#projectType').value);
            formData.append('description', form.querySelector('#description').value);
            formData.append('length', form.querySelector('#length').value);
            formData.append('deadline', form.querySelector('#deadline').value);
            formData.append('sourceFiles', form.querySelector('#sourceFiles').value);
            formData.append('budget', form.querySelector('#budget').value);
            formData.append('requirements', form.querySelector('#requirements').value);

            try {
                // Replace with your Google Apps Script Web App URL
                const response = await fetch('https://script.google.com/macros/s/AKfycbwmMy7Bk3ytRmrwsJ9NKvbkTRIW6XZBhyppYpdESF4axmqyAq-oZJcC_DeyuUlFCZx8/exec', {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                });

                // Show success message
                form.reset();
                submitButton.innerHTML = '<i class="fas fa-check me-2"></i>Sent Successfully!';
                setTimeout(() => {
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                }, 3000);

                // Show success alert
                alert('Thank you! Your request has been submitted successfully.');

            } catch (error) {
                console.error('Error:', error);
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
                alert('There was an error submitting your request. Please try again.');
            }
        });
    }
}); 