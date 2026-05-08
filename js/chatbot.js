/* ============================================
   JAEBETS — Assistant Virtuel 24/24
   W2K-Digital 2025
   ============================================ */

(function () {
    'use strict';

    /* ---- Base de connaissances ---- */
    var KB = [
        {
            keywords: ['où', 'navette', 'position', 'trajet en cours', 'suivi', 'localisation', 'retrouver'],
            response: 'Votre navette est actuellement en cours de trajet. Suivez-la en temps réel ici :<br><a href="https://passagers.jaebets-holding.com/suivi.html" target="_blank" rel="noopener">Suivi en temps réel</a><br>Merci pour votre patience.'
        },
        {
            keywords: ['modifier', 'changer', 'nouveau trajet', 'nouvelle destination', 'nouveau départ'],
            response: 'Bien sûr ! Merci de préciser :<br>• Nouveau point de départ<br>• Nouvelle destination<br>• Heure souhaitée<br>Nous vérifions la disponibilité immédiatement.<br><a href="contact.html">Contacter un conseiller</a>'
        },
        {
            keywords: ['pas récupéré', 'n\'ai pas été', 'oublié', 'non récupéré', 'navette n\'est pas', 'navette pas venue'],
            response: 'Nous sommes sincèrement désolés pour ce désagrément. Votre demande est prioritaire. Un agent analyse votre dossier. Vous serez recontacté sous peu avec une solution.<br><a href="contact.html">Déposer une réclamation</a>'
        },
        {
            keywords: ['réclamation', 'plainte', 'incident', 'problème', 'déposer'],
            response: 'Vous pouvez déposer une réclamation ici :<br><a href="https://jaebets-holding.com/contact.html" target="_blank" rel="noopener">jaebets-holding.com/contact.html</a><br>Ou décrivez-nous le problème directement ici. Nous traiterons votre demande sous 24h.'
        },
        {
            keywords: ['humain', 'conseiller', 'agent', 'parler à', 'appeler', 'téléphone', 'contact'],
            response: 'Vous pouvez parler à un conseiller :<br><a href="contact.html">Formulaire de contact</a><br>📞 <a href="tel:+2252724450244">27 24 45 02 44</a><br>📞 <a href="tel:+2250544039393">05 44 03 93 93</a><br>Nous restons disponibles pour vous aider.'
        },
        {
            keywords: ['avantage', 'pourquoi', 'bénéfice', 'service', 'qualité'],
            response: 'Avec Navette Express :<br>✅ Ponctualité garantie<br>✅ Service adapté aux entreprises<br>✅ Suivi en temps réel<br>✅ Paiement simple et sécurisé<br>✅ Climatisation & confort'
        },
        {
            keywords: ['zone', 'disponible', 'ville', 'couverture', 'secteur', 'commune', 'dessert'],
            response: 'Nous opérons actuellement à :<br>• Abidjan (Angré, Cocody, Plateau, Marcory, Yopougon, Koumassi, Port-Bouët…)<br>• Bingerville<br>• Grand Bassam<br>• Bonoua<br>D\'autres villes arrivent bientôt !<br><a href="zones-lignes.html">Voir toutes les zones</a>'
        },
        {
            keywords: ['inscrire', 'inscription', 'créer compte', 'compte', 's\'enregistrer', 'rejoindre'],
            response: 'Inscrivez-vous en 1 minute :<br><a href="https://passagers.jaebets-holding.com/inscription.html" target="_blank" rel="noopener">Créer mon compte</a><br>✔️ Créez votre compte<br>✔️ Réservez votre première navette<br>✔️ Profitez du service'
        },
        {
            keywords: ['entreprise', 'b2b', 'société', 'personnel', 'employés', 'abonnement entreprise', 'corporate'],
            response: 'Oui, nous proposons des solutions sur mesure pour entreprises :<br>• Transport du personnel<br>• Abonnements mensuels<br>• Devis personnalisé<br><a href="https://entreprise.jaebets-holding.com/" target="_blank" rel="noopener">Espace Entreprises</a><br><a href="transport-personnel.html">En savoir plus</a>'
        },
        {
            keywords: ['tarif', 'prix', 'coût', 'combien', 'abonnement', 'mensuel', 'ligne', 'fcfa'],
            response: 'Nos abonnements mensuels varient de 30 000 à 60 000 FCFA selon la ligne.<br>Exemples :<br>• Cocody → Plateau : 30 000 FCFA<br>• Angré → Plateau : 35 000 FCFA<br>• Grand Bassam → Bingerville : 60 000 FCFA<br><a href="tarifs-navette.html">Voir tous les tarifs</a>'
        },
        {
            keywords: ['réserver', 'réservation', 'booking', 'prendre', 'commande'],
            response: 'Parfait ! Pour réserver, merci de préciser :<br>📍 Départ<br>📍 Destination<br>⏰ Heure souhaitée<br>👥 Nombre de passagers<br><a href="https://passagers.jaebets-holding.com/inscription.html" target="_blank" rel="noopener">Réserver en ligne</a>'
        },
        {
            keywords: ['paiement', 'payer', 'mobile money', 'orange money', 'mtn', 'moov', 'carte', 'espèces', 'cash', 'fineopay'],
            response: 'Vous pouvez payer via :<br>💳 Carte bancaire (Visa / Mastercard)<br>📱 Orange Money<br>📱 MTN Money<br>📱 Moov Money<br>💵 Espèces à bord (tickets unitaires)<br>Paiement sécurisé via FineoPay.'
        },
        {
            keywords: ['annuler', 'annulation', 'remboursement', 'résilier'],
            response: 'Oui, c\'est possible :<br>✔️ Annulation jusqu\'à 48h avant le trajet<br>✔️ Remboursement au prorata pour les abonnements<br>✔️ Résiliation avec préavis de 15 jours<br><a href="contact.html">Nous contacter</a>'
        },
        {
            keywords: ['confirmer', 'confirmation', 'valider', 'récapitulatif'],
            response: 'Une fois votre réservation validée :<br>✔️ Vous recevez un récapitulatif par SMS/email<br>✔️ Vous effectuez le paiement<br>✔️ Votre navette est confirmée ✅'
        },
        {
            keywords: ['bonjour', 'salut', 'bonsoir', 'hello', 'hi', 'bonne journée'],
            response: 'Bonjour ! Je suis l\'assistant virtuel JAEBETS. Comment puis-je vous aider aujourd\'hui ?<br>Vous pouvez me poser des questions sur nos lignes, tarifs, réservations ou services.'
        },
        {
            keywords: ['merci', 'super', 'parfait', 'nickel', 'ok', 'bien', 'génial'],
            response: 'Avec plaisir ! N\'hésitez pas si vous avez d\'autres questions. Bon voyage avec Navette Express !'
        }
    ];

    var SUGGESTIONS_INITIALES = [
        'Quels sont vos tarifs ?',
        'Comment s\'inscrire ?',
        'Zones disponibles',
        'Moyens de paiement',
        'Contacter un conseiller'
    ];

    /* ---- DOM ---- */
    var widget = document.getElementById('chatbot-widget');
    var toggleBtn = document.getElementById('chatbotToggle');
    var closeBtn = document.getElementById('chatbotClose');
    var box = document.getElementById('chatbotBox');
    var messagesEl = document.getElementById('chatbotMessages');
    var suggestionsEl = document.getElementById('chatbotSuggestions');
    var inputEl = document.getElementById('chatbotInput');
    var sendBtn = document.getElementById('chatbotSend');
    var badge = document.getElementById('chatbotBadge');

    if (!widget || !toggleBtn || !box) return;

    var isOpen = false;
    var badgeVisible = true;

    /* ---- Helpers ---- */
    function addMessage(text, from) {
        var div = document.createElement('div');
        div.className = 'chatbot-message chatbot-message-' + from;
        var bubble = document.createElement('div');
        bubble.className = 'chatbot-bubble';
        bubble.innerHTML = text;
        div.appendChild(bubble);
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showTyping() {
        var div = document.createElement('div');
        div.className = 'chatbot-message chatbot-message-bot chatbot-typing-wrap';
        div.id = 'chatbotTyping';
        div.innerHTML = '<div class="chatbot-bubble"><span class="chatbot-typing"><span></span><span></span><span></span></span></div>';
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function hideTyping() {
        var el = document.getElementById('chatbotTyping');
        if (el) el.remove();
    }

    function normalize(str) {
        return str.toLowerCase()
            .replace(/[éèêë]/g, 'e')
            .replace(/[àâä]/g, 'a')
            .replace(/[ùûü]/g, 'u')
            .replace(/[îï]/g, 'i')
            .replace(/[ôö]/g, 'o')
            .replace(/[ç]/g, 'c')
            .replace(/[^a-z0-9\s]/g, ' ');
    }

    function findResponse(text) {
        var norm = normalize(text);
        var best = null;
        var bestScore = 0;
        KB.forEach(function (entry) {
            var score = 0;
            entry.keywords.forEach(function (kw) {
                if (norm.indexOf(normalize(kw)) !== -1) score++;
            });
            if (score > bestScore) {
                bestScore = score;
                best = entry;
            }
        });
        if (best && bestScore > 0) return best.response;
        return 'Je n\'ai pas bien compris votre question. Vous pouvez :<br>📞 Appeler le <a href="tel:+2250544039393">05 44 03 93 93</a><br>💬 <a href="contact.html">Contacter notre équipe</a><br>Ou reformulez votre question.';
    }

    function sendMessage(text) {
        text = text.trim();
        if (!text) return;
        hideSuggestions();
        addMessage(text, 'user');
        if (inputEl) inputEl.value = '';
        showTyping();
        setTimeout(function () {
            hideTyping();
            addMessage(findResponse(text), 'bot');
        }, 900 + Math.random() * 400);
    }

    function showSuggestions(list) {
        if (!suggestionsEl) return;
        suggestionsEl.innerHTML = '';
        list.forEach(function (label) {
            var btn = document.createElement('button');
            btn.className = 'chatbot-suggestion-btn';
            btn.textContent = label;
            btn.addEventListener('click', function () { sendMessage(label); });
            suggestionsEl.appendChild(btn);
        });
        suggestionsEl.style.display = 'flex';
    }

    function hideSuggestions() {
        if (suggestionsEl) suggestionsEl.style.display = 'none';
    }

    function openChat() {
        isOpen = true;
        box.classList.add('active');
        toggleBtn.classList.add('active');
        if (badge) { badge.style.display = 'none'; badgeVisible = false; }
        if (messagesEl.children.length === 0) {
            setTimeout(function () {
                addMessage('Bonjour ! Je suis l\'<strong>Assistant JAEBETS</strong>, disponible 24h/24.<br>Comment puis-je vous aider ?', 'bot');
                setTimeout(function () { showSuggestions(SUGGESTIONS_INITIALES); }, 400);
            }, 300);
        }
        if (inputEl) inputEl.focus();
    }

    function closeChat() {
        isOpen = false;
        box.classList.remove('active');
        toggleBtn.classList.remove('active');
    }

    /* ---- Events ---- */
    toggleBtn.addEventListener('click', function () {
        if (isOpen) closeChat(); else openChat();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeChat);

    if (sendBtn) sendBtn.addEventListener('click', function () {
        if (inputEl) sendMessage(inputEl.value);
    });

    if (inputEl) {
        inputEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') sendMessage(inputEl.value);
        });
    }

    /* Ouvrir auto après 8s si pas encore ouvert */
    setTimeout(function () {
        if (!isOpen && badge) {
            badge.classList.add('pulse');
        }
    }, 8000);

})();
