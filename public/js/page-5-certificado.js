document.addEventListener('DOMContentLoaded', () => {
    const codeInput = document.getElementById('validation-code');
    const validateBtn = document.getElementById('validate-btn');
    const certificateBtn = document.getElementById('certificate-btn');
    const certificateStatus = document.getElementById('certificate-status');

    const VALID_CODE = "ESUDA-ABC-2025";
    let participationValidated = false;

    window.checkCode = function() {
        if (codeInput.value.trim().length > 5) {
            validateBtn.disabled = false;
        } else {
            validateBtn.disabled = true;
        }
    };

    window.validateCode = function() {
        const enteredCode = codeInput.value.trim().toUpperCase();
        validateBtn.disabled = true; 

        if (enteredCode === VALID_CODE) {
            participationValidated = true;
            certificateBtn.disabled = false;
            certificateBtn.classList.remove('btn-emit-certificate-disabled');
            certificateBtn.classList.add('btn-emit-certificate-active');
            
            certificateBtn.innerHTML = `EMITIR MEU CERTIFICADO`;
            certificateStatus.textContent = `(Validação de presença concluída!)`;

            alert("Sucesso! Sua presença foi confirmada. Clique em 'EMITIR MEU CERTIFICADO'.");
        } else {
            participationValidated = false;
            certificateBtn.disabled = true;

            alert("Erro: Código de validação inválido. Tente novamente.");

            validateBtn.disabled = false;
        }
    };

    window.emitCertificate = function() {
        if (!participationValidated) {
            alert("Atenção: Você precisa validar sua presença antes de emitir o certificado.");
            return;
        }
        
        const nomeParticipante = "ROBERTO FERNANDE DA C. FILHO"; 
        const nomeEvento = "Workshop: Inovação e Tendências em I.A.";
        const cargaHoraria = "10 horas";
        const dataEmissao = new Date().toLocaleDateString('pt-BR');
        const codigoCertificado = VALID_CODE;

        const certificadoHTML = `
            <div style="width: 297mm; height: 210mm; border: 10px solid #004AAD; padding: 20mm; box-sizing: border-box; font-family: 'Inter', sans-serif; text-align: center; background-image: url('img/fundo-esuda.png'); background-size: cover;">
                <h1 style="color: #004AAD; font-size: 3rem; margin-bottom: 5mm; border-bottom: 3px solid #FF7F00;">CERTIFICADO</h1>
                <p style="font-size: 1.2rem; color: #495057; margin-bottom: 20mm;">A **ESUDA Conecta** certifica que</p>
                
                <h2 style="color: #FF7F00; font-size: 3.5rem; margin-bottom: 5mm; text-transform: uppercase;">${nomeParticipante}</h2>
                
                <p style="font-size: 1.2rem; color: #495057; line-height: 1.6;">
                    participou ativamente do evento:<br>
                    <strong style="font-size: 1.5rem; color: #004AAD;">"${nomeEvento}"</strong>
                </p>
                
                <p style="font-size: 1.2rem; color: #495057; margin-top: 10mm;">
                    Com carga horária total de <strong style="color: #004AAD;">${cargaHoraria}</strong>, realizado em ${dataEmissao}.
                </p>
                
                <div style="display: flex; justify-content: space-around; margin-top: 40mm;">
                    <div style="font-size: 1rem;">
                        ____________________________________<br>
                        Diretoria de Eventos ESUDA
                    </div>
                    <div style="font-size: 1rem;">
                        ____________________________________<br>
                        Coordenação Acadêmica
                    </div>
                </div>
                
                <p style="font-size: 0.8rem; color: #6b7280; margin-top: 20mm;">Código de Autenticidade: ${codigoCertificado}</p>
            </div>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Certificado ESUDA Conecta</title>');
        // Adiciona um estilo básico para impressão
        printWindow.document.write('<style>@page { size: A4 landscape; margin: 0; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(certificadoHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };
    
    const aceiteTermos = document.getElementById('aceite_termos');
    const submitButton = document.getElementById('submitButton');
    if (aceiteTermos && submitButton) {
        aceiteTermos.addEventListener('change', () => {
            submitButton.disabled = !aceiteTermos.checked;
        });
    }
});