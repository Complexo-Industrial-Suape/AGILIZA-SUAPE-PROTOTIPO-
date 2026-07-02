/* Dados de referência da APR (frente + verso), extraídos dos documentos oficiais:
   "APR FRENTE NOVA LOGO" e "FOLHA VERSO ATUALIZADA" — ver docs/referencia/. */
window.Agiliza = window.Agiliza || {};

Agiliza.AprData = {
    TABELA1: [
        { valor: 0, label: "Não há exposição", descricao: "Nenhum contato com agente ou contato irrelevante." },
        { valor: 1, label: "Baixos Níveis", descricao: "Contato infrequente com o agente." },
        { valor: 2, label: "Exposição Moderada", descricao: "Contato frequente com o agente à baixas concentrações ou infrequente às altas concentrações." },
        { valor: 3, label: "Exposição Elevada", descricao: "Contato frequente com o agente a altas concentrações." },
        { valor: 4, label: "Exposições Elevadíssimas", descricao: "Contato frequente com o agente a concentrações elevadíssimas." }
    ],

    TABELA2: [
        { valor: 0, label: "Pouca importância / não conhecidos", descricao: "Efeitos reversíveis de pouca importância ou não conhecidos, ou apenas suspeitos." },
        { valor: 1, label: "Reversíveis preocupantes", descricao: "Efeitos reversíveis preocupantes." },
        { valor: 2, label: "Reversíveis preocupantes severos", descricao: "Efeitos reversíveis preocupantes severos." },
        { valor: 3, label: "Irreversíveis preocupantes", descricao: "Efeitos irreversíveis preocupantes." },
        { valor: 4, label: "Ameaça à vida", descricao: "Ameaça à vida ou doença - lesão incapacitante." }
    ],

    TABELA3_FAIXAS: [
        { min: 0, max: 1, label: "Irrelevante", corClass: "criticidade-irrelevante" },
        { min: 2, max: 3, label: "Relevante", corClass: "criticidade-relevante" },
        { min: 4, max: 5, label: "Atenção", corClass: "criticidade-atencao" },
        { min: 6, max: 7, label: "Crítico", corClass: "criticidade-critico" },
        { min: 8, max: 8, label: "Emergencial", corClass: "criticidade-emergencial" }
    ],

    OBSERVACOES_IMPORTANTES: [
        "A cópia da APR e lista de presença deverá ser anexada na PT.",
        "Anexar o Plano de Emergência (PAE) na APR.",
        "Manter área limpa e organizada todas as vezes que terminar o serviço.",
        "Realizar a revisão da APR caso tenha outros equipamentos que não estejam contemplados na APR.",
        "Proibido uso de celular ou qualquer aparelho eletrônico não intrínseco.",
        "Evitar siglas, salvo se seus significados forem amplamente conhecidos.",
        "Não caminhar por dutos ou estruturas que não suportem o peso.",
        "Não caminhar sem devida amarração pelos dutos da dutovia.",
        "Não utilizar cabos e tomadas subdimensionados, nem incompatíveis com o ambiente.",
        "Verificar a existência de área classificada, respeitando as normas e procedimentos específicos de cada local.",
        "Em caso de chuva, interromper imediatamente as atividades com equipamentos elétricos, se for permitido no local.",
        "Tornar de amplo conhecimento a Portaria 047/2020, exarada pelo Porto de Suape.",
        "Em caso de emergência em áreas comuns, o Porto de Suape deverá ser imediatamente comunicado. Prontidão Base Terra: (81) 9.8668-5718 / Ambulância: (81) 9.9417-1391.",
        "Fica condicionado o início dos serviços a quente, mediante a autorização do comandante do navio e do Porto de Suape.",
        "Uso obrigatório do colete salva-vidas nas atividades nos píeres e cais."
    ],

    calcularT3(t1, t2) {
        return t1 + t2;
    },

    getCriticidade(t3) {
        return this.TABELA3_FAIXAS.find(function (faixa) {
            return t3 >= faixa.min && t3 <= faixa.max;
        });
    }
};
