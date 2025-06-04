document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const menuPrincipal = document.querySelector('.menu-principal');

    if (hamburgerBtn && menuPrincipal) {
        // Evento para abrir e fechar o menu
        hamburgerBtn.addEventListener('click', function() {
            menuPrincipal.classList.toggle('active');
        });
    }
});
// --- LÓGICA DO FORMULÁRIO DE CONTATO ---

// Seleciona o formulário pela ID que demos a ele no HTML
const contactForm = document.querySelector('#contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o recarregamento da página

        // ATENÇÃO: Substitua pelos seus IDs do EmailJS
        const SERVICE_ID = 'SEU_SERVICE_ID';
        const TEMPLATE_ID = 'SEU_TEMPLATE_ID';

        // Envia o formulário usando EmailJS
        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, this)
            .then(function() {
                alert('Mensagem enviada com sucesso!');
                contactForm.reset(); // Limpa o formulário
            }, function(error) {
                alert('Ocorreu um erro. Tente novamente.');
                console.log('ERRO EMAILJS...', error);
            });
    });
}