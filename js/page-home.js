/* Página inicial (portal SUAPE) */
window.Agiliza = window.Agiliza || {};

Agiliza.initHome = function initHome() {
    document.getElementById('btn-abrir-login').addEventListener('click', function () {
        Agiliza.Nav.navigateTo('login-page');
    });
};
