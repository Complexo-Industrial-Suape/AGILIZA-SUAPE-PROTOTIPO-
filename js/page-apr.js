/* Formulário digital da APR - Análise Preliminar de Riscos (frente + verso).
   As etapas são linhas dinâmicas; cada uma calcula T3 = T1 + T2 ao vivo e
   resolve a faixa de criticidade (Tabela 3) automaticamente. */
window.Agiliza = window.Agiliza || {};
Agiliza.Paginas = Agiliza.Paginas || {};

let referenciaRenderizada = false;

function renderizarReferencia() {
    if (referenciaRenderizada) return;
    referenciaRenderizada = true;

    const dados = Agiliza.AprData;
    const container = document.getElementById('apr-referencia-conteudo');

    const tabela1Linhas = dados.TABELA1.map(function (item) {
        return '<tr><td>' + item.valor + ' - ' + item.label + '</td><td>' + item.descricao + '</td></tr>';
    }).join('');

    const tabela2Linhas = dados.TABELA2.map(function (item) {
        return '<tr><td>' + item.valor + ' - ' + item.label + '</td><td>' + item.descricao + '</td></tr>';
    }).join('');

    const tabela3Linhas = dados.TABELA3_FAIXAS.map(function (faixa) {
        const rotuloFaixa = faixa.min === faixa.max ? String(faixa.min) : (faixa.min + '-' + faixa.max);
        return '<tr><td>' + rotuloFaixa + '</td><td><span class="criticidade-badge ' + faixa.corClass + '">' + faixa.label + '</span></td></tr>';
    }).join('');

    const observacoesItens = dados.OBSERVACOES_IMPORTANTES.map(function (texto) {
        return '<li>' + texto + '</li>';
    }).join('');

    container.innerHTML =
        '<h4>Tabela 1 &mdash; Valoração Qualitativa de Exposição (T1)</h4>' +
        '<table class="tabela-referencia"><thead><tr><th>Categoria</th><th>Descrição</th></tr></thead><tbody>' + tabela1Linhas + '</tbody></table>' +
        '<h4>Tabela 2 &mdash; Valoração Qualitativa do Efeito à Saúde (T2)</h4>' +
        '<table class="tabela-referencia"><thead><tr><th>Categoria</th><th>Descrição</th></tr></thead><tbody>' + tabela2Linhas + '</tbody></table>' +
        '<h4>Tabela 3 &mdash; Gradação da Prioridade de Monitorização (T1+T2=T3)</h4>' +
        '<table class="tabela-referencia"><thead><tr><th>T3</th><th>Criticidade</th></tr></thead><tbody>' + tabela3Linhas + '</tbody></table>' +
        '<h4>Observações Importantes</h4>' +
        '<ol class="observacoes-list">' + observacoesItens + '</ol>';
}

function optionsDeTabela(tabela) {
    return '<option value="">Selecione</option>' + tabela.map(function (item) {
        return '<option value="' + item.valor + '" title="' + item.descricao.replace(/"/g, '&quot;') + '">' +
            item.valor + ' - ' + item.label + '</option>';
    }).join('');
}

function criarLinhaEtapa() {
    const linha = document.createElement('div');
    linha.className = 'etapa-row';
    linha.innerHTML =
        '<div class="etapa-row-header">' +
            '<strong class="etapa-numero-label">Etapa</strong>' +
            '<button type="button" class="btn-remover-etapa">Remover</button>' +
        '</div>' +
        '<div class="etapa-grid">' +
            '<div><label>Etapa da Atividade:</label><textarea data-field="etapaAtividade" rows="2" required></textarea></div>' +
            '<div><label>Ferramentas, equipamentos e materiais:</label><textarea data-field="ferramentas" rows="2"></textarea></div>' +
            '<div>' +
                '<label>Tipo de controle:</label>' +
                '<div class="options-group">' +
                    '<label><input type="checkbox" data-field="tipoControle" value="SST"> SST</label>' +
                    '<label><input type="checkbox" data-field="tipoControle" value="MA"> MA</label>' +
                '</div>' +
            '</div>' +
            '<div><label>Perigo/Aspecto:</label><textarea data-field="perigoAspecto" rows="2"></textarea></div>' +
            '<div><label>Dano/Impacto:</label><textarea data-field="danoImpacto" rows="2"></textarea></div>' +
            '<div><label>EPC <span class="sub-label">(Equipamento de Proteção Coletiva)</span>:</label><textarea data-field="epc" rows="2"></textarea></div>' +
            '<div><label>EPI / CA Específicos:</label><textarea data-field="epiCa" rows="2"></textarea></div>' +
            '<div>' +
                '<label>Exposição (T1):</label>' +
                '<select data-field="t1">' + optionsDeTabela(Agiliza.AprData.TABELA1) + '</select>' +
            '</div>' +
            '<div>' +
                '<label>Efeito à Saúde (T2):</label>' +
                '<select data-field="t2">' + optionsDeTabela(Agiliza.AprData.TABELA2) + '</select>' +
            '</div>' +
            '<div>' +
                '<label>Risco (T1+T2=T3):</label>' +
                '<div><span class="t3-readout">&mdash;</span> <span class="criticidade-badge">&mdash;</span></div>' +
            '</div>' +
            '<div class="etapa-grid-full"><label>Recomendações:</label><textarea data-field="recomendacoes" rows="2"></textarea></div>' +
        '</div>';

    const selectT1 = linha.querySelector('[data-field="t1"]');
    const selectT2 = linha.querySelector('[data-field="t2"]');

    function recalcular() {
        const t3Readout = linha.querySelector('.t3-readout');
        const badge = linha.querySelector('.criticidade-badge');
        const t1 = selectT1.value;
        const t2 = selectT2.value;

        badge.className = 'criticidade-badge';

        if (t1 === '' || t2 === '') {
            t3Readout.innerText = '—';
            badge.innerText = '—';
            return;
        }

        const t3 = Agiliza.AprData.calcularT3(Number(t1), Number(t2));
        const criticidade = Agiliza.AprData.getCriticidade(t3);
        t3Readout.innerText = String(t3);
        badge.classList.add(criticidade.corClass);
        badge.innerText = criticidade.label;
    }

    selectT1.addEventListener('change', recalcular);
    selectT2.addEventListener('change', recalcular);

    linha.querySelector('.btn-remover-etapa').addEventListener('click', function () {
        const container = document.getElementById('apr-etapas-container');
        if (container.children.length <= 1) return;
        linha.remove();
        renumerarEtapas();
    });

    return linha;
}

function renumerarEtapas() {
    const container = document.getElementById('apr-etapas-container');
    const linhas = container.querySelectorAll('.etapa-row');
    linhas.forEach(function (linha, indice) {
        linha.querySelector('.etapa-numero-label').innerText = 'Etapa ' + (indice + 1);
        const btnRemover = linha.querySelector('.btn-remover-etapa');
        btnRemover.disabled = linhas.length <= 1;
    });
}

function adicionarEtapa() {
    document.getElementById('apr-etapas-container').appendChild(criarLinhaEtapa());
    renumerarEtapas();
}

function lerEtapas() {
    const linhas = document.querySelectorAll('#apr-etapas-container .etapa-row');
    return Array.from(linhas).map(function (linha) {
        const t1 = linha.querySelector('[data-field="t1"]').value;
        const t2 = linha.querySelector('[data-field="t2"]').value;
        const tipoControle = Array.from(linha.querySelectorAll('[data-field="tipoControle"]:checked')).map(function (el) { return el.value; });
        const t3 = (t1 !== '' && t2 !== '') ? Agiliza.AprData.calcularT3(Number(t1), Number(t2)) : null;
        const criticidade = t3 !== null ? Agiliza.AprData.getCriticidade(t3) : null;

        return {
            etapaAtividade: linha.querySelector('[data-field="etapaAtividade"]').value,
            ferramentas: linha.querySelector('[data-field="ferramentas"]').value,
            tipoControle: tipoControle,
            perigoAspecto: linha.querySelector('[data-field="perigoAspecto"]').value,
            danoImpacto: linha.querySelector('[data-field="danoImpacto"]').value,
            epc: linha.querySelector('[data-field="epc"]').value,
            epiCa: linha.querySelector('[data-field="epiCa"]').value,
            t1: t1 === '' ? null : Number(t1),
            t2: t2 === '' ? null : Number(t2),
            t3: t3,
            criticidade: criticidade,
            recomendacoes: linha.querySelector('[data-field="recomendacoes"]').value
        };
    });
}

function validarEtapas(etapas) {
    if (etapas.length === 0) {
        alert('Adicione pelo menos uma etapa da atividade.');
        return false;
    }
    for (let i = 0; i < etapas.length; i++) {
        const etapa = etapas[i];
        if (!etapa.etapaAtividade.trim()) {
            alert('Preencha a descrição da Etapa ' + (i + 1) + '.');
            return false;
        }
        if (etapa.tipoControle.length === 0) {
            alert('Selecione ao menos um Tipo de Controle (SST/MA) na Etapa ' + (i + 1) + '.');
            return false;
        }
        if (etapa.t1 === null || etapa.t2 === null) {
            alert('Selecione a Exposição (T1) e o Efeito à Saúde (T2) na Etapa ' + (i + 1) + '.');
            return false;
        }
    }
    return true;
}

Agiliza.Paginas.Apr = {
    abrirNova() {
        renderizarReferencia();

        const form = document.getElementById('form-apr');
        form.reset();

        const container = document.getElementById('apr-etapas-container');
        container.innerHTML = '';
        adicionarEtapa();

        const empresaId = Agiliza.Storage.getSession();
        const empresa = empresaId ? Agiliza.Storage.getEmpresa(empresaId) : null;
        document.getElementById('apr-empresa').value = empresa ? empresa.razaoSocial : '';
    }
};

Agiliza.initApr = function initApr() {
    document.getElementById('btn-add-etapa').addEventListener('click', adicionarEtapa);

    document.getElementById('btn-voltar-dashboard-from-apr').addEventListener('click', function () {
        Agiliza.Paginas.Dashboard.render();
        Agiliza.Nav.navigateTo('dashboard-page');
    });

    document.getElementById('form-apr').addEventListener('submit', function (e) {
        e.preventDefault();

        const etapas = lerEtapas();
        if (!validarEtapas(etapas)) return;

        if (!document.getElementById('apr-observacoes-ciencia').checked) {
            alert('É necessário declarar ciência das Observações Importantes.');
            return;
        }

        const registro = {
            id: Agiliza.Storage.gerarId('apr'),
            empresaId: Agiliza.Storage.getSession(),
            solicitacaoId: null,
            contratoNumero: document.getElementById('apr-contrato').value,
            unidadeOperacional: document.getElementById('apr-unidade').value,
            processoExecucao: document.getElementById('apr-processo').value,
            funcao: document.getElementById('apr-funcao').value,
            dataInicio: document.getElementById('apr-data-inicio').value,
            dataFinal: document.getElementById('apr-data-final').value,
            numeroAprRevisao: document.getElementById('apr-numero-revisao').value,
            responsavelTecnico: document.getElementById('apr-responsavel-tecnico').value,
            equipeColaboradores: document.getElementById('apr-equipe').value,
            descricaoAtividade: document.getElementById('apr-descricao').value,
            etapas: etapas,
            observacoesCiencia: true,
            assinaturaEquipe: document.getElementById('apr-assinatura-equipe').value,
            assinaturaResponsavelTecnico: document.getElementById('apr-assinatura-responsavel').value,
            dataAssinatura: document.getElementById('apr-data-assinatura').value,
            status: 'Enviada',
            dataCriacao: new Date().toISOString()
        };

        Agiliza.Storage.saveApr(registro);

        alert('APR enviada com sucesso!\nProtocolo: ' + registro.id);

        Agiliza.Paginas.Dashboard.render();
        Agiliza.Nav.navigateTo('dashboard-page');
    });
};
