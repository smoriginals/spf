/* =============================================
   SP FOUNDATIONS - MAIN JAVASCRIPT
   ============================================= */

$(function () {
    'use strict';

    /* ---- PRELOADER ---- */
    $(window).on('load', function () {
        setTimeout(function () {
            $('#preloader').fadeOut(500);
        }, 800);
    });

    /* ---- STICKY HEADER ---- */
    var $header = $('.main-header');
    var headerHeight = $header.outerHeight();

    $(window).on('scroll.sticky', function () {
        if ($(this).scrollTop() > 100) {
            $header.addClass('sticky');
            $('body').css('padding-top', headerHeight);
        } else {
            $header.removeClass('sticky');
            $('body').css('padding-top', 0);
        }
    });

    /* ---- SCROLL TO TOP ---- */
    var $scrollBtn = $('#scrollTop');
    $(window).on('scroll.scrolltop', function () {
        if ($(this).scrollTop() > 300) {
            $scrollBtn.addClass('show');
        } else {
            $scrollBtn.removeClass('show');
        }
    });
    $scrollBtn.on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 500, 'swing');
    });

    /* ---- ACTIVE NAV LINK ---- */
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    $('.navbar-nav .nav-link').each(function () {
        var href = $(this).attr('href');
        if (href === currentPage) {
            $(this).addClass('active');
        }
    });

    /* ---- TESTIMONIALS OWL CAROUSEL ---- */
    if ($('.testimonials-carousel').length) {
        $('.testimonials-carousel').owlCarousel({
            loop: true,
            margin: 20,
            nav: false,
            dots: true,
            autoplay: true,
            autoplayTimeout: 5000,
            autoplayHoverPause: true,
            responsive: {
                0:   { items: 1 },
                576: { items: 1 },
                768: { items: 2 },
                992: { items: 3 }
            }
        });
    }

    /* ---- PARTNERS OWL CAROUSEL ---- */
    if ($('.partners-carousel').length) {
        $('.partners-carousel').owlCarousel({
            loop: true,
            margin: 30,
            nav: false,
            dots: false,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplaySpeed: 1000,
            responsive: {
                0:   { items: 2 },
                576: { items: 3 },
                768: { items: 4 },
                992: { items: 5 },
                1200:{ items: 6 }
            }
        });
    }

    /* ---- GALLERY OWL (homepage small gallery) ---- */
    if ($('.gallery-carousel').length) {
        $('.gallery-carousel').owlCarousel({
            loop: true,
            margin: 10,
            nav: true,
            dots: false,
            navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
            autoplay: true,
            autoplayTimeout: 3500,
            responsive: {
                0:   { items: 1 },
                576: { items: 2 },
                768: { items: 3 },
                992: { items: 4 }
            }
        });
    }

    /* ---- FANCYBOX / LIGHTBOX ---- */
    if ($.fancybox) {
        $('[data-fancybox="gallery"]').fancybox({
            loop: true,
            buttons: ['zoom', 'slideShow', 'fullScreen', 'download', 'close'],
            animationEffect: 'zoom-in-out',
            transitionEffect: 'slide',
        });

        $('[data-fancybox="video"]').fancybox({
            youtube: { controls: 1, showinfo: 0 },
        });
    }

    /* ---- COUNTER ANIMATION (Stats Bar) ---- */
    function animateCounters() {
        // Staggered card entrance
        $('.stat-item').each(function (i) {
            var $el = $(this);
            setTimeout(function () {
                $el.addClass('stat-animated');
            }, i * 120);
        });

        // Rolling number animation
        $('.counter').each(function () {
            var $this = $(this);
            var target = parseInt($this.data('target'), 10);
            var duration = 1800;
            var start = 0;
            var increment = target / (duration / 16);
            var timer = setInterval(function () {
                start += increment;
                if (start >= target) {
                    start = target;
                    clearInterval(timer);
                }
                $this.text(Math.floor(start).toLocaleString('en-IN'));
            }, 16);
        });
    }

    /* Trigger counters when stats bar scrolls into view (or already visible on load) */
    var countersAnimated = false;
    function checkCounters() {
        if (!countersAnimated && $('.stats-bar').length) {
            var statsTop = $('.stats-bar').offset().top;
            if ($(window).scrollTop() + $(window).height() > statsTop + 30) {
                countersAnimated = true;
                animateCounters();
            }
        }
    }
    $(window).on('scroll.counter', checkCounters);
    checkCounters(); // fire immediately if stats bar already in view on page load

    /* ---- HERO VIDEO MANAGEMENT ---- */
    (function () {
        var heroEl = document.getElementById('heroCarousel');
        if (!heroEl) return;

        var bsCarousel = bootstrap.Carousel.getOrCreateInstance(heroEl, {
            interval: 5000,
            ride: false,
            pause: false
        });

        function isMobile() { return window.innerWidth < 768; }

        function applyAutoPlay() {
            if (isMobile()) {
                bsCarousel.cycle();   // mobile: auto-advance every 5s
            } else {
                bsCarousel.pause();   // desktop: manual only
            }
        }

        function playSlideVideo(slide) {
            if (isMobile()) return;
            var vid = slide && slide.querySelector('video');
            if (!vid) return;
            vid.currentTime = 0;
            vid.play().catch(function () {});
        }

        function pauseAllVideos() {
            heroEl.querySelectorAll('video').forEach(function (v) { v.pause(); });
        }

        /* Init */
        applyAutoPlay();
        var firstSlide = heroEl.querySelector('.carousel-item.active');
        if (firstSlide) playSlideVideo(firstSlide);

        /* Pause outgoing, play incoming */
        heroEl.addEventListener('slide.bs.carousel', function () { pauseAllVideos(); });
        heroEl.addEventListener('slid.bs.carousel', function () {
            var active = heroEl.querySelector('.carousel-item.active');
            if (active) playSlideVideo(active);
        });

        /* Re-apply on resize / orientation change */
        window.addEventListener('resize', function () {
            applyAutoPlay();
            if (!isMobile()) {
                var active = heroEl.querySelector('.carousel-item.active');
                if (active) {
                    var vid = active.querySelector('video');
                    if (vid && vid.paused) vid.play().catch(function () {});
                }
            } else {
                pauseAllVideos();
            }
        });
    })();

    /* ---- PROGRESS BAR ANIMATION ---- */
    var progressAnimated = false;
    $(window).on('scroll.progress', function () {
        if (!progressAnimated && $('.progress-fill').length) {
            var progTop = $('.progress-fill').first().offset().top;
            if ($(window).scrollTop() + $(window).height() > progTop + 50) {
                progressAnimated = true;
                $('.progress-fill').each(function () {
                    var width = $(this).data('width') || '0%';
                    $(this).css('width', width);
                });
            }
        }
    });

    /* ---- DONATION AMOUNT SELECTOR ---- */
    $('.amount-btn').on('click', function () {
        $('.amount-btn').removeClass('selected');
        $(this).addClass('selected');
        var amount = $(this).data('amount');
        if (amount) {
            $('#donationAmount').val(amount);
        }
    });

    /* ---- PAYMENT METHOD SELECTOR ---- */
    $('.payment-method-card').on('click', function () {
        $('.payment-method-card').removeClass('selected');
        $(this).addClass('selected');
        var method = $(this).data('method');
        $('#paymentMethod').val(method);
        // Show/hide relevant payment info
        $('.payment-info-section').hide();
        $('#pay-' + method).fadeIn(300);
    });

    /* ---- DONATION FORM VALIDATION & SUBMIT ---- */
    $('#donationForm').on('submit', function (e) {
        e.preventDefault();
        var $form = $(this);
        var $btn = $form.find('[type="submit"]');
        var amount = $('#donationAmount').val();
        var name   = $('#donorName').val().trim();
        var email  = $('#donorEmail').val().trim();
        var phone  = $('#donorPhone').val().trim();

        // Basic validation
        if (!amount || parseFloat(amount) < 10) {
            showAlert('Please enter a valid donation amount (minimum ₹10).', 'error');
            return;
        }
        if (!name) { showAlert('Please enter your name.', 'error'); return; }
        if (!isValidEmail(email)) { showAlert('Please enter a valid email address.', 'error'); return; }
        if (!isValidPhone(phone)) { showAlert('Please enter a valid 10-digit phone number.', 'error'); return; }

        $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Processing...');

        $.ajax({
            url: 'process-donation.php',
            method: 'POST',
            data: $form.serialize(),
            dataType: 'json',
            success: function (resp) {
                if (resp.success) {
                    showAlert(resp.message, 'success');
                    $form[0].reset();
                    $('.amount-btn').removeClass('selected');
                    $('.payment-method-card').removeClass('selected');
                } else {
                    showAlert(resp.message || 'An error occurred. Please try again.', 'error');
                }
            },
            error: function () {
                showAlert('Connection error. Please try again later.', 'error');
            },
            complete: function () {
                $btn.prop('disabled', false).html('<i class="fas fa-heart me-2"></i>Donate Now');
            }
        });
    });

    /* ---- CONTACT FORM VALIDATION & SUBMIT ---- */
    $('#contactForm').on('submit', function (e) {
        e.preventDefault();
        var $form = $(this);
        var $btn  = $form.find('[type="submit"]');
        var name    = $('#contactName').val().trim();
        var email   = $('#contactEmail').val().trim();
        var phone   = $('#contactPhone').val().trim();
        var message = $('#contactMessage').val().trim();

        if (!name)   { showAlert('Please enter your name.', 'error'); return; }
        if (!isValidEmail(email)) { showAlert('Please enter a valid email.', 'error'); return; }
        if (!isValidPhone(phone)) { showAlert('Please enter a valid phone number.', 'error'); return; }
        if (!message || message.length < 10) { showAlert('Please enter a message (at least 10 characters).', 'error'); return; }

        $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Sending...');

        $.ajax({
            url: 'contact-process.php',
            method: 'POST',
            data: $form.serialize(),
            dataType: 'json',
            success: function (resp) {
                if (resp.success) {
                    showAlert(resp.message, 'success');
                    $form[0].reset();
                } else {
                    showAlert(resp.message || 'An error occurred.', 'error');
                }
            },
            error: function () {
                showAlert('Connection error. Please try again later.', 'error');
            },
            complete: function () {
                $btn.prop('disabled', false).html('<i class="fas fa-paper-plane me-2"></i>Send Message');
            }
        });
    });

    /* ---- REGISTER FORM ---- */
    $('#registerForm').on('submit', function (e) {
        e.preventDefault();
        var $form = $(this);
        var $btn  = $form.find('[type="submit"]');
        var password = $('#regPassword').val();
        var confirm  = $('#regConfirm').val();

        if (password !== confirm) {
            showAlert('Passwords do not match.', 'error');
            return;
        }
        if (password.length < 8) {
            showAlert('Password must be at least 8 characters.', 'error');
            return;
        }

        $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Registering...');

        $.ajax({
            url: 'register-process.php',
            method: 'POST',
            data: $form.serialize(),
            dataType: 'json',
            success: function (resp) {
                if (resp.success) {
                    showAlert(resp.message, 'success');
                    setTimeout(function () { window.location.href = 'login.html'; }, 2000);
                } else {
                    showAlert(resp.message || 'Registration failed.', 'error');
                }
            },
            error: function () {
                showAlert('Connection error. Please try again.', 'error');
            },
            complete: function () {
                $btn.prop('disabled', false).html('<i class="fas fa-user-plus me-2"></i>Register');
            }
        });
    });

    /* ---- LOGIN FORM ---- */
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();
        var $form = $(this);
        var $btn  = $form.find('[type="submit"]');

        $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Logging in...');

        $.ajax({
            url: 'login-process.php',
            method: 'POST',
            data: $form.serialize(),
            dataType: 'json',
            success: function (resp) {
                if (resp.success) {
                    showAlert('Login successful! Redirecting...', 'success');
                    setTimeout(function () { window.location.href = resp.redirect || 'index.html'; }, 1500);
                } else {
                    showAlert(resp.message || 'Invalid credentials.', 'error');
                    $btn.prop('disabled', false).html('<i class="fas fa-sign-in-alt me-2"></i>Login');
                }
            },
            error: function () {
                showAlert('Connection error. Please try again.', 'error');
                $btn.prop('disabled', false).html('<i class="fas fa-sign-in-alt me-2"></i>Login');
            }
        });
    });

    /* ---- GALLERY FILTER ---- */
    $('.filter-btn').on('click', function () {
        var filter = $(this).data('filter');
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');

        if (filter === 'all') {
            $('.g-item').fadeIn(300);
        } else {
            $('.g-item').hide();
            $('.g-item[data-category="' + filter + '"]').fadeIn(300);
        }
    });

    /* ---- PASSWORD SHOW/HIDE TOGGLE ---- */
    $('.toggle-password').on('click', function () {
        var $input = $($(this).data('target'));
        var type = $input.attr('type') === 'password' ? 'text' : 'password';
        $input.attr('type', type);
        $(this).find('i').toggleClass('fa-eye fa-eye-slash');
    });

    /* ---- SMOOTH SCROLL (anchor links) ---- */
    $('a[href^="#"]').on('click', function (e) {
        var target = $(this).attr('href');
        if (target !== '#' && $(target).length) {
            e.preventDefault();
            var offset = $header.outerHeight() + 10;
            $('html, body').animate({ scrollTop: $(target).offset().top - offset }, 600);
        }
    });

    /* ---- HERO CAROUSEL ANIMATION RESET ---- */
    $('#heroCarousel').on('slid.bs.carousel', function () {
        $(this).find('.carousel-caption h5, .carousel-caption h2, .carousel-caption p, .carousel-caption .btns').each(function (i) {
            $(this).css({ opacity: 0, transform: 'translateY(30px)' }).delay(i * 100).animate({ opacity:1 }, { duration: 600, step: function(now) { $(this).css('transform','translateY('+(30*(1-now))+'px)'); } });
        });
    });

    /* ---- TOOLTIP INIT ---- */
    var tooltipElList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipElList.map(function (el) { return new bootstrap.Tooltip(el); });

    /* ============================================
       UTILITY FUNCTIONS
       ============================================ */
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        return /^[6-9]\d{9}$/.test(phone);
    }

    function showAlert(message, type) {
        var cls = type === 'success' ? 'alert-success-custom' : 'alert-error-custom';
        var icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        var $alert = $('<div class="' + cls + ' mt-3"><i class="fas ' + icon + ' me-2"></i>' + message + '</div>');
        var $container = $('#formAlertContainer');
        if (!$container.length) {
            $container = $('<div id="formAlertContainer"></div>');
            $('form:visible').first().before($container);
        }
        $container.html($alert);
        $('html, body').animate({ scrollTop: $container.offset().top - 100 }, 400);
        setTimeout(function () { $alert.fadeOut(400, function () { $(this).remove(); }); }, 5000);
    }

    // Expose showAlert globally
    window.showNotification = showAlert;
});
