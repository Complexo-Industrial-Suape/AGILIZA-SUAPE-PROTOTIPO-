/* Ponto de entrada único: inicializa todas as páginas depois que o DOM
   estiver pronto. Cada init* apenas registra listeners; nenhuma lógica de
   inicialização roda antes daqui. */
document.addEventListener('DOMContentLoaded', function () {
    Agiliza.initHome();
    Agiliza.initLogin();
    Agiliza.initCadastro();
    Agiliza.initDashboard();
    Agiliza.initSolicitacao();
    Agiliza.initApr();
});
