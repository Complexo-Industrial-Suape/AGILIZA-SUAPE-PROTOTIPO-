/* Seleção de categoria + formulário de cadastro de empresa (Agiliza SUAPE). */
window.Agiliza = window.Agiliza || {};

// Função global usada pelo onchange inline dos inputs de arquivo (fora do
// escopo do DOMContentLoaded para poder ser chamada diretamente pelo HTML).
window.updateFileName = function (input) {
    const fileName = input.files[0] ? input.files[0].name : "Nenhum arquivo escolhido";
    input.parentElement.querySelector('.file-name').innerText = fileName;
};

Agiliza.initCadastro = function initCadastro() {
    const DOCUMENTOS_MAP = [
        { inputId: 'docCartaApresentacao', nome: 'Carta de Apresentação de Anexo', dataId: null },
        { inputId: 'docAntaq', nome: 'Formulário da ANTAQ', dataId: 'docAntaqValidade' },
        { inputId: 'docAnp', nome: 'Autorização da ANP / Cópia de Autorização da ANTAQ', dataId: 'docAnpValidade' },
        { inputId: 'docAtoConstitutivo', nome: 'Ato Constitutivo, Estatuto ou Contrato Social', dataId: null },
        { inputId: 'docIbama', nome: 'Autorização Ambiental de Transporte de Produtos Perigosos (IBAMA)', dataId: 'docIbamaValidade' },
        { inputId: 'docFormularioServico', nome: 'Formulário de Solicitação de Serviço', dataId: null }
    ];

    document.getElementById('btn-voltar-login-from-cat').addEventListener('click', function () {
        Agiliza.Nav.navigateTo('login-page');
    });

    document.getElementById('link-voltar-login').addEventListener('click', function (e) {
        e.preventDefault();
        Agiliza.Nav.navigateTo('login-page');
    });

    document.getElementById('btn-cat-oleoso').addEventListener('click', function () {
        Agiliza.Nav.navigateTo('agiliza-page');
    });

    document.getElementById('btn-voltar-home-from-form').addEventListener('click', function () {
        document.getElementById('cadastroForm').reset();
        Agiliza.Nav.navigateTo('home-page');
    });

    /* Máscaras */
    const cnpjInputForm = document.getElementById('cnpj');
    const empresaIdHidden = document.getElementById('empresaId');

    cnpjInputForm.addEventListener('input', function () {
        empresaIdHidden.value = Agiliza.Masks.aplicarMascaraCnpj(cnpjInputForm);
    });

    document.getElementById('cep').addEventListener('input', function () {
        Agiliza.Masks.aplicarMascaraCep(this);
    });

    /* Envio do cadastro */
    document.getElementById('cadastroForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const residuosMarcados = document.querySelectorAll('input[name="tipoResiduo"]:checked');
        const operacoesMarcadas = document.querySelectorAll('input[name="tipoOperacao"]:checked');

        if (residuosMarcados.length === 0) {
            alert('Por favor, selecione pelo menos um Tipo de Resíduo.');
            return;
        }

        if (operacoesMarcadas.length === 0) {
            alert('Por favor, selecione pelo menos um Tipo de Operação.');
            return;
        }

        if (!empresaIdHidden.value) {
            alert('Informe um CNPJ válido.');
            return;
        }

        const documentos = DOCUMENTOS_MAP.map(function (doc) {
            const input = document.getElementById(doc.inputId);
            const arquivo = input.files[0];
            if (!arquivo) return null;
            return {
                nome: doc.nome,
                arquivoNome: arquivo.name,
                dataValidade: doc.dataId ? document.getElementById(doc.dataId).value : null
            };
        }).filter(Boolean);

        const empresa = {
            empresaId: empresaIdHidden.value,
            razaoSocial: document.getElementById('razaoSocial').value,
            cnpj: cnpjInputForm.value,
            cep: document.getElementById('cep').value,
            numero: document.getElementById('numero').value,
            complemento: document.getElementById('complemento').value,
            telefone: document.getElementById('tel').value,
            tiposResiduo: Array.from(residuosMarcados).map(function (el) { return el.value; }),
            tiposOperacao: Array.from(operacoesMarcadas).map(function (el) { return el.value; }),
            documentos: documentos,
            termosAceitos: document.getElementById('termos').checked,
            dataCadastro: new Date().toISOString()
        };

        Agiliza.Storage.saveEmpresa(empresa);
        Agiliza.Storage.setSession(empresa.empresaId);

        this.reset();
        document.getElementById('empresaId').value = '';

        Agiliza.Paginas.Dashboard.render();
        Agiliza.Nav.navigateTo('dashboard-page');
    });
};
