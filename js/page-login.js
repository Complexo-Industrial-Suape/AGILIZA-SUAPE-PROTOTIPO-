/* Página de login. Não há backend real: aceita o login de demonstração
   (CNPJ "0000" / Senha "0000") ou o CNPJ de uma empresa já cadastrada
   localmente (qualquer senha não vazia, já que não há senha de verdade
   armazenada em nenhum lugar). */
window.Agiliza = window.Agiliza || {};

Agiliza.initLogin = function initLogin() {
    const DEMO_EMPRESA_ID = "00000000000000";

    function entrarComoEmpresa(empresaId) {
        Agiliza.Storage.setSession(empresaId);
        Agiliza.Paginas.Dashboard.render();
        Agiliza.Nav.navigateTo('dashboard-page');
    }

    function seedEmpresaDemo() {
        if (Agiliza.Storage.getEmpresa(DEMO_EMPRESA_ID)) return;
        Agiliza.Storage.saveEmpresa({
            empresaId: DEMO_EMPRESA_ID,
            razaoSocial: "Empresa Demonstração",
            cnpj: "00.000.000/0000-00",
            cep: "", numero: "", complemento: "", telefone: "",
            tiposResiduo: [],
            tiposOperacao: [],
            documentos: [],
            termosAceitos: true,
            dataCadastro: new Date().toISOString()
        });
    }

    document.getElementById('form-login').addEventListener('submit', function (e) {
        e.preventDefault();

        const cnpjVal = document.getElementById('login-cnpj').value.trim();
        const senhaVal = document.getElementById('login-senha').value;
        const cnpjDigitos = cnpjVal.replace(/\D/g, '');

        this.reset();

        if (cnpjVal === "0000" && senhaVal === "0000") {
            seedEmpresaDemo();
            entrarComoEmpresa(DEMO_EMPRESA_ID);
            return;
        }

        const empresaExistente = Agiliza.Storage.getEmpresa(cnpjDigitos);
        if (empresaExistente && senhaVal.length > 0) {
            entrarComoEmpresa(empresaExistente.empresaId);
            return;
        }

        alert("Credenciais inválidas! Tente CNPJ: 0000 e Senha: 0000, ou o CNPJ de uma empresa já cadastrada.");
    });

    document.getElementById('link-ir-cadastro').addEventListener('click', function (e) {
        e.preventDefault();
        Agiliza.Nav.navigateTo('cadastro-categoria-page');
    });

    document.getElementById('btn-voltar-home-from-login').addEventListener('click', function () {
        Agiliza.Nav.navigateTo('home-page');
    });
};
