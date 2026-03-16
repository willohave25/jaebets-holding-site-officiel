/* ============================================
   W2K AUTO-SCROLL — Module premium
   W2K-Digital 2025
   Défilement automatique intelligent
   ============================================ */

var W2KAutoScroll = (function () {
    'use strict';

    /* Configuration par défaut */
    var config = {
        speed: 'slow',
        pauseDuration: 12,
        inactivityDelay: 45,
        showIndicator: true
    };

    /* Vitesses en pixels par frame (~60fps) */
    var speedMap = {
        slow: 0.8,
        medium: 1.5,
        fast: 2.5
    };

    var isScrolling = false;
    var isPaused = false;
    var inactivityTimer = null;
    var scrollInterval = null;
    var indicator = null;
    var sections = [];
    var currentSectionIndex = 0;
    var pauseTimer = null;
    var userInteracted = false;

    /* Initialisation */
    function init(options) {
        /* Fusionner config */
        if (options) {
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    config[key] = options[key];
                }
            }
        }

        /* Trouver les sections */
        sections = document.querySelectorAll('[data-autoscroll]');
        if (sections.length === 0) return;

        /* Créer indicateur visuel */
        if (config.showIndicator) {
            createIndicator();
        }

        /* Écouter interactions utilisateur */
        bindUserEvents();

        /* Démarrer après pause initiale */
        setTimeout(function () {
            startAutoScroll();
        }, 3000);
    }

    /* Créer indicateur visuel */
    function createIndicator() {
        indicator = document.createElement('div');
        indicator.className = 'w2k-scroll-indicator';
        indicator.title = 'Auto-scroll actif';
        document.body.appendChild(indicator);
    }

    /* Mettre à jour indicateur */
    function updateIndicator(paused) {
        if (!indicator) return;
        if (paused) {
            indicator.classList.add('paused');
            indicator.title = 'Auto-scroll en pause';
        } else {
            indicator.classList.remove('paused');
            indicator.title = 'Auto-scroll actif';
        }
    }

    /* Démarrer le défilement automatique */
    function startAutoScroll() {
        if (isScrolling) return;
        isScrolling = true;
        isPaused = false;
        updateIndicator(false);
        scrollToNextSection();
    }

    /* Arrêter le défilement */
    function stopAutoScroll() {
        isScrolling = false;
        isPaused = true;
        updateIndicator(true);

        if (pauseTimer) {
            clearTimeout(pauseTimer);
            pauseTimer = null;
        }

        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;
        }
    }

    /* Défiler vers la section suivante */
    function scrollToNextSection() {
        if (isPaused || !isScrolling) return;

        if (currentSectionIndex >= sections.length) {
            /* Fin de page — navigation vers page suivante */
            navigateToNextPage();
            return;
        }

        var targetSection = sections[currentSectionIndex];
        var headerHeight = 80;
        var targetPos = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;

        /* Défilement progressif doux */
        smoothScrollTo(targetPos, function () {
            if (isPaused) return;

            /* Pause sur la section */
            pauseTimer = setTimeout(function () {
                currentSectionIndex++;
                scrollToNextSection();
            }, config.pauseDuration * 1000);
        });
    }

    /* Défilement progressif personnalisé */
    function smoothScrollTo(targetPos, callback) {
        var startPos = window.scrollY;
        var distance = targetPos - startPos;
        var duration = Math.abs(distance) / (speedMap[config.speed] || 0.8);
        duration = Math.max(duration, 800);
        duration = Math.min(duration, 3000);
        var startTime = null;

        function step(timestamp) {
            if (isPaused) return;
            if (!startTime) startTime = timestamp;

            var progress = Math.min((timestamp - startTime) / duration, 1);
            /* Courbe ease-in-out */
            var ease = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            window.scrollTo(0, startPos + distance * ease);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                if (callback) callback();
            }
        }

        requestAnimationFrame(step);
    }

    /* Navigation vers page suivante */
    function navigateToNextPage() {
        var nextPage = document.body.dataset.nextPage;
        if (nextPage) {
            pauseTimer = setTimeout(function () {
                window.location.href = nextPage;
            }, config.pauseDuration * 1000);
        } else {
            /* Boucler sur la même page */
            currentSectionIndex = 0;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            pauseTimer = setTimeout(function () {
                scrollToNextSection();
            }, config.pauseDuration * 1000);
        }
    }

    /* Écouter interactions utilisateur */
    function bindUserEvents() {
        var events = ['mousedown', 'wheel', 'touchstart', 'keydown'];

        events.forEach(function (evt) {
            document.addEventListener(evt, function () {
                onUserInteraction();
            }, { passive: true });
        });

        /* Click sur liens — pause définitive pendant navigation */
        document.addEventListener('click', function (e) {
            if (e.target.closest('a') || e.target.closest('button')) {
                onUserInteraction();
            }
        });
    }

    /* Réaction interaction utilisateur */
    function onUserInteraction() {
        userInteracted = true;
        stopAutoScroll();

        /* Nettoyer timer précédent */
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }

        /* Reprendre après délai inactivité */
        inactivityTimer = setTimeout(function () {
            userInteracted = false;
            /* Déterminer section actuelle visible */
            detectCurrentSection();
            startAutoScroll();
        }, config.inactivityDelay * 1000);
    }

    /* Détecter section actuellement visible */
    function detectCurrentSection() {
        var headerHeight = 80;
        var scrollPos = window.scrollY + headerHeight + window.innerHeight / 3;

        for (var i = sections.length - 1; i >= 0; i--) {
            if (sections[i].offsetTop <= scrollPos) {
                currentSectionIndex = i + 1;
                return;
            }
        }
        currentSectionIndex = 0;
    }

    /* API publique */
    return {
        init: init,
        pause: stopAutoScroll,
        resume: startAutoScroll
    };

})();
