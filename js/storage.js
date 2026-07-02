/* Camada de persistência local (localStorage). Sem backend: o protótipo roda
   inteiramente no navegador, então cada empresa/solicitação/APR fica salva
   apenas no navegador de quem preencheu o formulário. */
window.Agiliza = window.Agiliza || {};

(function () {
    const PREFIXO = "agilizaSuape:";
    const CHAVE_EMPRESAS = PREFIXO + "empresas";
    const CHAVE_SOLICITACOES = PREFIXO + "solicitacoes";
    const CHAVE_APRS = PREFIXO + "aprs";
    const CHAVE_SESSAO = PREFIXO + "session";

    // Fallback em memória caso localStorage não esteja disponível (ex: navegação privada).
    const memoria = {};

    function lerBruto(chave, valorPadrao) {
        try {
            const valor = window.localStorage.getItem(chave);
            return valor === null ? valorPadrao : JSON.parse(valor);
        } catch (erro) {
            return Object.prototype.hasOwnProperty.call(memoria, chave) ? memoria[chave] : valorPadrao;
        }
    }

    function gravarBruto(chave, valor) {
        memoria[chave] = valor;
        try {
            window.localStorage.setItem(chave, JSON.stringify(valor));
        } catch (erro) {
            // Segue apenas com o fallback em memória.
        }
    }

    function gerarId(prefixo) {
        return prefixo + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
    }

    Agiliza.Storage = {
        gerarId,

        getEmpresa(empresaId) {
            const empresas = lerBruto(CHAVE_EMPRESAS, {});
            return empresas[empresaId] || null;
        },

        saveEmpresa(empresa) {
            const empresas = lerBruto(CHAVE_EMPRESAS, {});
            empresas[empresa.empresaId] = empresa;
            gravarBruto(CHAVE_EMPRESAS, empresas);
        },

        listSolicitacoes(empresaId) {
            const todas = lerBruto(CHAVE_SOLICITACOES, []);
            return todas
                .filter(function (registro) { return registro.empresaId === empresaId; })
                .sort(function (a, b) { return new Date(b.dataCriacao) - new Date(a.dataCriacao); });
        },

        saveSolicitacao(registro) {
            const todas = lerBruto(CHAVE_SOLICITACOES, []);
            todas.push(registro);
            gravarBruto(CHAVE_SOLICITACOES, todas);
        },

        listAprs(empresaId) {
            const todas = lerBruto(CHAVE_APRS, []);
            return todas
                .filter(function (registro) { return registro.empresaId === empresaId; })
                .sort(function (a, b) { return new Date(b.dataCriacao) - new Date(a.dataCriacao); });
        },

        saveApr(registro) {
            const todas = lerBruto(CHAVE_APRS, []);
            todas.push(registro);
            gravarBruto(CHAVE_APRS, todas);
        },

        getSession() {
            return lerBruto(CHAVE_SESSAO, null);
        },

        setSession(empresaId) {
            gravarBruto(CHAVE_SESSAO, empresaId);
        },

        clearSession() {
            gravarBruto(CHAVE_SESSAO, null);
        }
    };
})();
