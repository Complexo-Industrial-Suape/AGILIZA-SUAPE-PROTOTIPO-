/* Navegação entre telas (SPA). Qualquer elemento com a classe .view é uma
   "página"; navegar para uma delas esconde todas as outras. */
window.Agiliza = window.Agiliza || {};

Agiliza.Nav = {
    navigateTo(pageId) {
        const alvo = document.getElementById(pageId);
        if (!alvo) return;

        document.querySelectorAll('.view').forEach(function (el) {
            el.classList.remove('view-active');
            el.classList.add('view-hidden');
        });

        alvo.classList.remove('view-hidden');
        alvo.classList.add('view-active');
        window.scrollTo(0, 0);
    }
};
