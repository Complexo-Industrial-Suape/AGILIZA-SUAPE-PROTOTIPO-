/* Painel da empresa logada: lista Solicitações de Anuência e APRs salvas. */
window.Agiliza = window.Agiliza || {};
Agiliza.Paginas = Agiliza.Paginas || {};

Agiliza.Paginas.Dashboard = {
    render() {
        const empresaId = Agiliza.Storage.getSession();
        if (!empresaId) {
            Agiliza.Nav.navigateTo('home-page');
            return;
        }

        const empresa = Agiliza.Storage.getEmpresa(empresaId);
        document.getElementById('dashboard-empresa-nome').innerText = empresa ? empresa.razaoSocial : 'Empresa';
        document.getElementById('dashboard-empresa-cnpj').innerText = empresa ? ('CNPJ: ' + empresa.cnpj) : '';

        this._renderSolicitacoes(empresaId);
        this._renderAprs(empresaId);
    },

    _renderSolicitacoes(empresaId) {
        const container = document.getElementById('lista-solicitacoes');
        const registros = Agiliza.Storage.listSolicitacoes(empresaId);

        if (registros.length === 0) {
            container.innerHTML = '<p class="record-list-empty">Nenhuma solicitação registrada ainda.</p>';
            return;
        }

        container.innerHTML = registros.map(function (registro) {
            return '<div class="record-card">' +
                '<div class="record-card-main">' +
                    '<strong>' + escapeHtml(registro.nomeEmbarcacao) + '</strong>' +
                    '<span class="sub-label">Berço: ' + escapeHtml(registro.bercoAtracacao) + ' &middot; Início: ' + formatarDataHora(registro.inicioServico) + '</span>' +
                '</div>' +
                '<span class="status-badge status-enviada">' + escapeHtml(registro.status) + '</span>' +
            '</div>';
        }).join('');
    },

    _renderAprs(empresaId) {
        const container = document.getElementById('lista-aprs');
        const registros = Agiliza.Storage.listAprs(empresaId);

        if (registros.length === 0) {
            container.innerHTML = '<p class="record-list-empty">Nenhuma APR registrada ainda.</p>';
            return;
        }

        container.innerHTML = registros.map(function (registro) {
            const pior = piorCriticidade(registro.etapas);
            const badgeClass = pior ? pior.corClass : '';
            const badgeLabel = pior ? pior.label : registro.status;

            return '<div class="record-card">' +
                '<div class="record-card-main">' +
                    '<strong>' + escapeHtml(registro.processoExecucao || 'APR') + ' &mdash; Contrato ' + escapeHtml(registro.contratoNumero) + '</strong>' +
                    '<span class="sub-label">Atividade: ' + formatarData(registro.dataInicio) + ' a ' + formatarData(registro.dataFinal) + '</span>' +
                '</div>' +
                '<span class="criticidade-badge ' + badgeClass + '">' + escapeHtml(badgeLabel) + '</span>' +
            '</div>';
        }).join('');
    }
};

function piorCriticidade(etapas) {
    if (!etapas || etapas.length === 0) return null;
    return etapas.reduce(function (pior, etapa) {
        if (!etapa.criticidade) return pior;
        if (!pior || etapa.t3 > pior.t3) {
            return Object.assign({ t3: etapa.t3 }, etapa.criticidade);
        }
        return pior;
    }, null);
}

function formatarDataHora(isoString) {
    if (!isoString) return '-';
    const data = new Date(isoString);
    if (isNaN(data.getTime())) return '-';
    return data.toLocaleString('pt-BR');
}

function formatarData(isoString) {
    if (!isoString) return '-';
    const data = new Date(isoString + 'T00:00:00');
    if (isNaN(data.getTime())) return '-';
    return data.toLocaleDateString('pt-BR');
}

function escapeHtml(texto) {
    if (texto === undefined || texto === null) return '';
    const div = document.createElement('div');
    div.innerText = String(texto);
    return div.innerHTML;
}

Agiliza.initDashboard = function initDashboard() {
    document.getElementById('btn-sair-dashboard').addEventListener('click', function () {
        Agiliza.Storage.clearSession();
        Agiliza.Nav.navigateTo('home-page');
    });

    document.getElementById('btn-nova-solicitacao').addEventListener('click', function () {
        Agiliza.Paginas.Solicitacao.abrirNova();
        Agiliza.Nav.navigateTo('solicitacao-page');
    });

    document.getElementById('btn-nova-apr').addEventListener('click', function () {
        Agiliza.Paginas.Apr.abrirNova();
        Agiliza.Nav.navigateTo('apr-page');
    });
};
