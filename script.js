document.addEventListener('DOMContentLoaded', () => { // Espera a página carregar totalmente antes de rodar o código
  const form = document.getElementById('contact-form'); // Pega o formulário pelo id do HTML
  const btn = document.getElementById('submit-btn'); // Pega o botão de enviar pelo id do HTML
  const status = document.getElementById('form-status'); // Pega o elemento onde mostramos mensagens ao usuário (definido lá no HTML)

  if (!form) return; // Se não encontrou o formulário, para aqui para evitar erros

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que o navegador recarregue a página ao enviar o formulário

    if (!form.checkValidity()) { // Verifica a validade dos campos usando a validação nativa do HTML
      form.reportValidity();
      return; // Sai se o formulário não estiver válido
    }

    btn.disabled = true; // Desabilita o botão para evitar múltiplos cliques/envios
    const originalText = btn.textContent; // Guarda o texto atual do botão para restaurar depois
    btn.textContent = 'Enviando...'; // Mostra que o envio está em progresso
    status.hidden = false; // Torna visível a área de status
    status.textContent = ''; // Limpa qualquer mensagem anterior

    const action = form.action; // Lê a URL para onde os dados serão enviados (definida no atributo action do form)
    const data = new FormData(form); // Cria um objeto com os campos do formulário para enviar

    try {
      const res = await fetch(action, { // Envia os dados para o servidor e espera a resposta,
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        status.textContent = 'Mensagem enviada com sucesso!';
        form.reset();
      } else {
        // tenta ler mensagem de erro do servidor
        const json = await res.json().catch(() => null);
        status.textContent = json && json.error ? `Erro: ${json.error}` : 'Erro ao enviar. Tente novamente mais tarde.';
      }
    } catch (err) {
      status.textContent = 'Erro de rede. Verifique sua conexão e tente novamente.';
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
      // esconde a mensagem após 5s
      setTimeout(() => { status.hidden = true; status.textContent = ''; }, 5000);
    }
  });
});
