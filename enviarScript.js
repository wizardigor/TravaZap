/**
 * Função para enviar mensagens automáticas no WhatsApp Web
 * @param {string} scriptText - Texto contendo as mensagens a serem enviadas (separadas por quebras de linha ou tabs)
 * @returns {Promise<number>} - Retorna uma promise que resolve com o número de mensagens enviadas
 */
async function enviarScript(scriptText) {
    // Configuração dos intervalos de tempo (em milissegundos)
    const TEMPO_ENTRE_MENSAGENS = 250; // Intervalo entre o envio de uma mensagem e outra
    const TEMPO_APOS_DIGITAR = 100;   // Intervalo após digitar antes de clicar no botão enviar
    const TEMPO_ESPERA_FINAL = 250;   // Intervalo de espera após última mensagem

    // Processa o texto: divide em linhas, remove espaços e linhas vazias
    const lines = scriptText.split(/[\n\t]+/)
                            .map(line => line.trim())
                            .filter(line => line);
    
    // Obtém elementos da interface do WhatsApp
    const main = document.querySelector("#main");
    const textarea = main.querySelector(`div[contenteditable="true"]`);
    
    if (!textarea) throw new Error("Não há uma conversa aberta");
    
    // Envia cada linha como uma mensagem separada
    for (const line of lines) {
        console.log(line); // Log para depuração
    
        // Digita a mensagem no campo de texto
        textarea.focus();
        document.execCommand('insertText', false, line);
        textarea.dispatchEvent(new Event('change', {bubbles: true}));
    
        // Envia a mensagem após um pequeno intervalo
        setTimeout(() => {
            (main.querySelector(`[data-testid="send"]`) || 
             main.querySelector(`[data-icon="wds-ic-send-filled"]`)).click();
        }, TEMPO_APOS_DIGITAR);
        
        // Aguarda intervalo entre mensagens (exceto após a última)
        if (lines.indexOf(line) !== lines.length - 1) {
            await new Promise(resolve => setTimeout(resolve, TEMPO_ENTRE_MENSAGENS));
        }
    }
    
    // Aguarda um tempo final antes de retornar
    await new Promise(resolve => setTimeout(resolve, TEMPO_ESPERA_FINAL));
    return lines.length;
}

enviarScript(`
//[COLE O TEXTO COMPLETO DO FILME AQUI]
`).then(e => console.log(`Código finalizado, ${e} mensagens enviadas`)).catch(console.error)
