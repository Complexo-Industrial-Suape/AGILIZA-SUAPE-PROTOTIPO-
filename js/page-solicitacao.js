/* Formulário de Solicitação de Anuência para Retirada de Resíduos de
   Embarcação (Portaria nº 99/2025), com validação de antecedência mínima
   de 36 horas para o início do serviço. */
window.Agiliza = window.Agiliza || {};
Agiliza.Paginas = Agiliza.Paginas || {};

const HORAS_MINIMAS_ANTECEDENCIA = 36;

Agiliza.Paginas.Solicitacao = {
    abrirNova() {
        const form = document.getElementById('form-solicitacao');
        form.reset();
        document.getElementById('sol-inicio-aviso').style.display = 'none';

        const empresaId = Agiliza.Storage.getSession();
        const empresa = empresaId ? Agiliza.Storage.getEmpresa(empresaId) : null;
        document.getElementById('sol-empresa-prestadora').value = empresa ? empresa.razaoSocial : '';
    }
};

function horasAteInicio(valorInicio) {
    if (!valorInicio) return null;
    const inicio = new Date(valorInicio);
    if (isNaN(inicio.getTime())) return null;
    return (inicio.getTime() - Date.now()) / 3600000;
}

function verificarAntecedencia() {
    const inicioInput = document.getElementById('sol-inicio');
    const aviso = document.getElementById('sol-inicio-aviso');
    const horas = horasAteInicio(inicioInput.value);

    if (horas === null || horas >= HORAS_MINIMAS_ANTECEDENCIA) {
        aviso.style.display = 'none';
        return true;
    }

    const faltamHoras = Math.max(0, HORAS_MINIMAS_ANTECEDENCIA - horas);
    const horasInt = Math.floor(faltamHoras);
    const minutosInt = Math.round((faltamHoras - horasInt) * 60);
    aviso.innerText = 'Atenção: o início do serviço deve ter no mínimo ' + HORAS_MINIMAS_ANTECEDENCIA +
        ' horas de antecedência. Faltam ' + horasInt + 'h' + minutosInt + 'min para atingir o prazo mínimo.';
    aviso.style.display = 'block';
    return false;
}

Agiliza.initSolicitacao = function initSolicitacao() {
    document.getElementById('btn-voltar-dashboard-from-solicitacao').addEventListener('click', function () {
        Agiliza.Paginas.Dashboard.render();
        Agiliza.Nav.navigateTo('dashboard-page');
    });

    document.getElementById('sol-inicio').addEventListener('input', verificarAntecedencia);
    document.getElementById('sol-inicio').addEventListener('change', verificarAntecedencia);

    document.getElementById('form-solicitacao').addEventListener('submit', function (e) {
        e.preventDefault();

        const inicioInput = document.getElementById('sol-inicio');
        const terminoInput = document.getElementById('sol-termino');

        if (!verificarAntecedencia()) {
            inicioInput.focus();
            inicioInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        if (new Date(terminoInput.value) <= new Date(inicioInput.value)) {
            alert('O término do serviço deve ser posterior ao início do serviço.');
            return;
        }

        const tipoNavegacao = document.querySelector('input[name="sol-tipo-navegacao"]:checked');

        const registro = {
            id: Agiliza.Storage.gerarId('sol'),
            empresaId: Agiliza.Storage.getSession(),
            requerente: document.getElementById('sol-requerente').value,
            responsavel: document.getElementById('sol-responsavel').value,
            contatoResponsavel: document.getElementById('sol-contato').value,
            nomeEmbarcacao: document.getElementById('sol-embarcacao').value,
            tipoNavegacao: tipoNavegacao ? tipoNavegacao.value : null,
            tipologiaResiduos: document.getElementById('sol-tipologia').value,
            quantidadeResiduos: document.getElementById('sol-quantidade').value,
            bercoAtracacao: document.getElementById('sol-berco').value,
            inicioServico: inicioInput.value,
            terminoServico: terminoInput.value,
            empresaPrestadora: document.getElementById('sol-empresa-prestadora').value,
            status: 'Enviada',
            dataCriacao: new Date().toISOString()
        };

        Agiliza.Storage.saveSolicitacao(registro);

        alert('Solicitação de Anuência enviada com sucesso!\nProtocolo: ' + registro.id);

        Agiliza.Paginas.Dashboard.render();
        Agiliza.Nav.navigateTo('dashboard-page');
    });
};
