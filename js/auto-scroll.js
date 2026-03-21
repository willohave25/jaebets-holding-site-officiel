/* ============================================
   W2K AUTO-SCROLL — Mode Vitrine Continue
   W2K-Digital 2025
   Défilement continu lent type écran salle d'attente
   Pas de pause, pas de saut, scroll fluide constant
   Boucle infinie : bas de page → page suivante
   ============================================ */

var W2KAutoScroll = (function () {
    'use strict';

    var config = {
        speed: 'slow',
        inactivityDelay: 45,
        showIndicator: true
    };

    /* Pixels par frame à ~60fps */
    var speedMap = {
        slow: 0.5,
        medium: 1.0,
        fast: 1.8
    };

    var animationId = null;
    var isPaused = false;
    var inactivityTimer = null;
    var indicator = null;
    var pixelsPerFrame = 0.5;

    /* Initialisation */
    function init(options) {
        if (options) {
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    config[key] = options[key];
                }
            }
        }

        pixelsPerFrame = speedMap[config.speed] || 0.5;

        if (config.showIndicator) {
            createIndicator();
        }

        bindUserEvents();

        /* Démarrer après 3 secondes */
        setTimeout(function () {
            startScroll();
        }, 3000);
    }

    /* Indicateur visuel */
    function createIndicator() {
        indicator = document.createElement('div');
        indicator.className = 'w2k-scroll-indicator';
        indicator.title = 'Vitrine active';
        document.body.appendChild(indicator);
    }

    function updateIndicator(paused) {
        if (!indicator) return;
        if (paused) {
            indicator.classList.add('paused');
            indicator.title = 'Vitrine en pause';
        } else {
            indicator.classList.remove('paused');
            indicator.title = 'Vitrine active';
        }
    }

    /* Défilement continu pixel par pixel */
    function startScroll() {
        if (animationId) return;
        isPaused = false;
        updateIndicator(false);

        function frame() {
            if (isPaused) return;

            var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            var currentPos = window.scrollY;

            if (currentPos >= maxScroll - 2) {
                /* Fin de page atteinte → page suivante */
                goToNextPage();
                return;
            }

            window.scrollTo(0, currentPos + pixelsPerFrame);
            animationId = requestAnimationFrame(frame);
        }

        animationId = requestAnimationFrame(frame);
    }

    /* Arrêter le défilement */
    function stopScroll() {
        isPaused = true;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        updateIndicator(true);
    }

    /* Navigation page suivante */
    function goToNextPage() {
        stopScroll();
        var nextPage = document.body.dataset.nextPage;
        if (nextPage) {
            /* Petit délai avant changement de page */
            setTimeout(function () {
                window.location.href = nextPage;
            }, 1500);
        } else {
            /* Pas de page suivante → remonter en haut et reprendre */
            window.scrollTo(0, 0);
            setTimeout(function () {
                startScroll();
            }, 1500);
        }
    }

    /* Interactions utilisateur */
    function bindUserEvents() {
        var events = ['mousedown', 'wheel', 'touchstart', 'keydown'];

        events.forEach(function (evt) {
            document.addEventListener(evt, function () {
                onUserInteraction();
            }, { passive: true });
        });

        document.addEventListener('click', function (e) {
            if (e.target.closest('a') || e.target.closest('button')) {
                onUserInteraction();
            }
        });
    }

    /* Pause au toucher, reprise après inactivité */
    function onUserInteraction() {
        stopScroll();

        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }

        inactivityTimer = setTimeout(function () {
            startScroll();
        }, config.inactivityDelay * 1000);
    }

    /* API publique */
    return {
        init: init,
        pause: stopScroll,
        resume: startScroll
    };

})();
