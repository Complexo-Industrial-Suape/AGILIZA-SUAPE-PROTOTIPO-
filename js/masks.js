/* Máscaras de entrada reutilizáveis (CNPJ, CEP). */
window.Agiliza = window.Agiliza || {};

Agiliza.Masks = {
    // Aplica a máscara 00.000.000/0000-00 e devolve só os dígitos.
    aplicarMascaraCnpj(input) {
        const x = input.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/);
        input.value = !x[2] ? x[1] : x[1] + '.' + x[2] + '.' + x[3] + '/' + x[4] + (x[5] ? '-' + x[5] : '');
        return input.value.replace(/\D/g, '');
    },

    aplicarMascaraCep(input) {
        const x = input.value.replace(/\D/g, '').match(/(\d{0,5})(\d{0,3})/);
        input.value = !x[2] ? x[1] : x[1] + '-' + x[2];
        return input.value;
    }
};
