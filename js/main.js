/* ============================================
   JAEBETS HOLDING — Script principal
   W2K-Digital 2025
   Navigation, carrousel, formulaires, animations
   ============================================ */

(function () {
    'use strict';

    /* ----------------------------------------
       HEADER STICKY AU SCROLL
       ---------------------------------------- */
    const header = document.getElementById('mainHeader');
    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    /* ----------------------------------------
       MENU MOBILE HAMBURGER
       ---------------------------------------- */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');

    function openMobileMenu() {
        if (!mobileMenu || !mobileMenuOverlay) return;
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        if (hamburger) hamburger.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        if (!mobileMenu || !mobileMenuOverlay) return;
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburger) hamburger.addEventListener('click', openMobileMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    /* Sous-menus accordéon mobile */
    var accordionToggles = document.querySelectorAll('.accordion-toggle');
    accordionToggles.forEach(function (toggle) {
        toggle.addEventListener('click', function () {
            var content = this.nextElementSibling;
            var isActive = this.classList.contains('active');

            // Fermer tous les autres
            accordionToggles.forEach(function (t) {
                t.classList.remove('active');
                if (t.nextElementSibling) {
                    t.nextElementSibling.classList.remove('active');
                }
            });

            if (!isActive) {
                this.classList.add('active');
                if (content) content.classList.add('active');
            }
        });
    });

    // Fermer menu mobile sur clic lien
    var mobileLinks = document.querySelectorAll('.mobile-nav-list a:not(.accordion-toggle)');
    mobileLinks.forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
    });

    /* ----------------------------------------
       CARROUSEL TÉMOIGNAGES
       ---------------------------------------- */
    var carouselTrack = document.getElementById('carouselTrack');
    var carouselPrev = document.getElementById('carouselPrev');
    var carouselNext = document.getElementById('carouselNext');
    var carouselDotsContainer = document.getElementById('carouselDots');

    if (carouselTrack) {
        var cards = carouselTrack.querySelectorAll('.temoignage-card');
        var totalCards = cards.length;
        var currentIndex = 0;
        var autoPlayInterval = null;
        var autoPlayDelay = 5000;

        // Créer les dots
        if (carouselDotsContainer) {
            for (var i = 0; i < totalCards; i++) {
                var dot = document.createElement('button');
                dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', 'Témoignage ' + (i + 1));
                dot.dataset.index = i;
                carouselDotsContainer.appendChild(dot);
            }
        }

        function goToSlide(index) {
            if (index < 0) index = totalCards - 1;
            if (index >= totalCards) index = 0;
            currentIndex = index;
            carouselTrack.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
            updateDots();
        }

        function updateDots() {
            if (!carouselDotsContainer) return;
            var dots = carouselDotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach(function (dot, idx) {
                dot.classList.toggle('active', idx === currentIndex);
            });
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        function startAutoPlay() {
            stopAutoPlay();
            autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
        }

        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }

        if (carouselNext) carouselNext.addEventListener('click', function () {
            nextSlide();
            startAutoPlay();
        });

        if (carouselPrev) carouselPrev.addEventListener('click', function () {
            prevSlide();
            startAutoPlay();
        });

        if (carouselDotsContainer) {
            carouselDotsContainer.addEventListener('click', function (e) {
                if (e.target.classList.contains('carousel-dot')) {
                    goToSlide(parseInt(e.target.dataset.index));
                    startAutoPlay();
                }
            });
        }

        // Swipe tactile
        var touchStartX = 0;
        var touchEndX = 0;

        carouselTrack.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, { passive: true });

        carouselTrack.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            var diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            startAutoPlay();
        }, { passive: true });

        startAutoPlay();
    }

    /* ----------------------------------------
       COMPTEUR ANIMÉ — CHIFFRES CLÉS
       ---------------------------------------- */
    var chiffreNumbers = document.querySelectorAll('.chiffre-number[data-count]');
    var chiffreAnimated = false;

    function animateCounters() {
        chiffreNumbers.forEach(function (el) {
            var target = parseInt(el.dataset.count);
            var current = 0;
            var duration = 2000;
            var step = Math.ceil(target / (duration / 16));
            var start = null;

            function updateCounter(timestamp) {
                if (!start) start = timestamp;
                var progress = timestamp - start;
                current = Math.min(Math.floor((progress / duration) * target), target);
                el.textContent = current;
                if (current < target) {
                    requestAnimationFrame(updateCounter);
                } else {
                    el.textContent = target;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    if (chiffreNumbers.length > 0) {
        var chiffresSection = document.getElementById('chiffres');
        if (chiffresSection) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && !chiffreAnimated) {
                        chiffreAnimated = true;
                        animateCounters();
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.3 });
            observer.observe(chiffresSection);
        }
    }

    /* ----------------------------------------
       FAQ ACCORDÉON (pages intérieures)
       ---------------------------------------- */
    var faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(function (question) {
        question.addEventListener('click', function () {
            var answer = this.nextElementSibling;
            var isActive = this.classList.contains('active');

            // Fermer toutes les réponses
            faqQuestions.forEach(function (q) {
                q.classList.remove('active');
                if (q.nextElementSibling) {
                    q.nextElementSibling.style.maxHeight = null;
                }
            });

            if (!isActive) {
                this.classList.add('active');
                if (answer) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            }
        });
    });

    /* ----------------------------------------
       FORMULAIRE CONTACT DÉROULANT
       ---------------------------------------- */
    var formSelect = document.getElementById('contactCategory');
    var dynamicFields = document.getElementById('dynamicFields');

    if (formSelect && dynamicFields) {
        formSelect.addEventListener('change', function () {
            var value = this.value;
            dynamicFields.innerHTML = '';

            if (!value) return;

            var fieldsConfig = {
                'construction': [
                    { label: 'Type de projet', type: 'select', options: ['Construction neuve', 'Rénovation', 'Réhabilitation', 'Aménagement'] },
                    { label: 'Surface estimée (m²)', type: 'text', placeholder: 'Ex: 200 m²' },
                    { label: 'Localisation du chantier', type: 'text', placeholder: 'Quartier, commune...' }
                ],
                'commerce': [
                    { label: 'Type de produits', type: 'text', placeholder: 'Décrivez les produits recherchés' },
                    { label: 'Volume estimé', type: 'text', placeholder: 'Quantités approximatives' }
                ],
                'representation': [
                    { label: 'Nom de l\'entreprise à accompagner', type: 'text', placeholder: 'Raison sociale' },
                    { label: 'Pays d\'origine', type: 'text', placeholder: 'Pays de l\'entreprise' },
                    { label: 'Type d\'accompagnement', type: 'select', options: ['Implantation', 'Représentation commerciale', 'Formalités administratives', 'Autre'] }
                ],
                'import-export': [
                    { label: 'Sens de l\'opération', type: 'select', options: ['Import vers CI', 'Export depuis CI', 'Les deux'] },
                    { label: 'Type de marchandise', type: 'text', placeholder: 'Nature des produits' },
                    { label: 'Pays partenaire', type: 'text', placeholder: 'Pays source/destination' }
                ],
                'fourniture': [
                    { label: 'Type de mobilier/fournitures', type: 'select', options: ['Mobilier bureau', 'Équipement IT', 'Fournitures de bureau', 'Combiné'] },
                    { label: 'Nombre de postes', type: 'text', placeholder: 'Ex: 20 postes' }
                ],
                'prestation': [
                    { label: 'Type de prestation', type: 'select', options: ['Consulting', 'Gestion de projet', 'Sous-traitance', 'Autre'] },
                    { label: 'Durée estimée', type: 'text', placeholder: 'Ex: 3 mois' }
                ],
                'navette': [
                    { label: 'Type de service Navette', type: 'select', options: ['Transport Personnel B2B', 'Abonnement Individuel', 'Location Bus Événement'] },
                    { label: 'Nombre de personnes', type: 'text', placeholder: 'Nombre de passagers' },
                    { label: 'Trajet souhaité', type: 'text', placeholder: 'Départ → Arrivée' }
                ],
                'transport-b2b': [
                    { label: 'Nombre d\'employés', type: 'text', placeholder: 'Ex: 50 employés' },
                    { label: 'Zone de ramassage', type: 'text', placeholder: 'Quartiers/communes' },
                    { label: 'Destination', type: 'text', placeholder: 'Lieu de travail' }
                ],
                'transport-individuel': [
                    { label: 'Ligne souhaitée', type: 'text', placeholder: 'Ex: Yopougon-Plateau' },
                    { label: 'Horaires préférés', type: 'select', options: ['Matin (6h-9h)', 'Soir (17h-20h)', 'Matin et Soir'] }
                ],
                'location-bus': [
                    { label: 'Type d\'événement', type: 'select', options: ['Mariage', 'Excursion', 'Conférence', 'Séminaire', 'Autre'] },
                    { label: 'Date souhaitée', type: 'date' },
                    { label: 'Nombre de passagers', type: 'text', placeholder: 'Nombre de personnes' },
                    { label: 'Trajet', type: 'text', placeholder: 'Départ → Destination' }
                ],
                'autre': [
                    { label: 'Précisez votre besoin', type: 'textarea', placeholder: 'Décrivez votre demande en détail...' }
                ]
            };

            var fields = fieldsConfig[value];
            if (!fields) return;

            fields.forEach(function (field) {
                var group = document.createElement('div');
                group.className = 'form-group dynamic-field';

                var label = document.createElement('label');
                label.className = 'form-label';
                label.textContent = field.label;
                group.appendChild(label);

                var input;
                if (field.type === 'select') {
                    input = document.createElement('select');
                    input.className = 'form-control';
                    var defaultOpt = document.createElement('option');
                    defaultOpt.value = '';
                    defaultOpt.textContent = 'Sélectionnez...';
                    input.appendChild(defaultOpt);
                    field.options.forEach(function (opt) {
                        var option = document.createElement('option');
                        option.value = opt;
                        option.textContent = opt;
                        input.appendChild(option);
                    });
                } else if (field.type === 'textarea') {
                    input = document.createElement('textarea');
                    input.className = 'form-control';
                    input.placeholder = field.placeholder || '';
                    input.rows = 4;
                } else if (field.type === 'date') {
                    input = document.createElement('input');
                    input.type = 'date';
                    input.className = 'form-control';
                } else {
                    input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'form-control';
                    input.placeholder = field.placeholder || '';
                }

                group.appendChild(input);
                dynamicFields.appendChild(group);
            });

            // Animation apparition
            dynamicFields.style.opacity = '0';
            dynamicFields.style.transform = 'translateY(10px)';
            requestAnimationFrame(function () {
                dynamicFields.style.transition = 'all 0.3s ease';
                dynamicFields.style.opacity = '1';
                dynamicFields.style.transform = 'translateY(0)';
            });
        });
    }

    /* Validation formulaire contact */
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var isValid = true;
            var requiredFields = contactForm.querySelectorAll('[required]');

            requiredFields.forEach(function (field) {
                var group = field.closest('.form-group');
                if (!group) return;

                if (!field.value.trim()) {
                    group.classList.add('error');
                    group.classList.remove('success');
                    isValid = false;
                } else if (field.type === 'email' && !validateEmail(field.value)) {
                    group.classList.add('error');
                    group.classList.remove('success');
                    isValid = false;
                } else {
                    group.classList.remove('error');
                    group.classList.add('success');
                }
            });

            if (isValid) {
                // Simulation envoi
                var submitBtn = contactForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.textContent = 'Envoi en cours...';
                    submitBtn.disabled = true;
                }
                setTimeout(function () {
                    alert('Merci ! Votre message a été envoyé. Nous vous répondrons sous 24h.');
                    contactForm.reset();
                    if (dynamicFields) dynamicFields.innerHTML = '';
                    contactForm.querySelectorAll('.form-group').forEach(function (g) {
                        g.classList.remove('success', 'error');
                    });
                    if (submitBtn) {
                        submitBtn.textContent = 'Envoyer le message';
                        submitBtn.disabled = false;
                    }
                }, 1500);
            }
        });
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /* ----------------------------------------
       ANIMATION APPARITION AU SCROLL
       ---------------------------------------- */
    var animElements = document.querySelectorAll('.pole-card, .pourquoi-card, .highlight-card, .service-card, .process-step');
    if (animElements.length > 0) {
        var animObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry, index) {
                if (entry.isIntersecting) {
                    setTimeout(function () {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 80);
                    animObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animElements.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(24px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            animObserver.observe(el);
        });
    }

    /* ----------------------------------------
       SMOOTH SCROLL LIENS INTERNES
       ---------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                var headerHeight = header ? header.offsetHeight : 80;
                var targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

})();
