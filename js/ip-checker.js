// Salve este código como ip-check.js e inclua-o nas suas páginas HTML que precisam de proteção

// Função para verificar o acesso
function verificarAcesso() {
  // Verifica se já temos um resultado em cache
  const cachedResult = localStorage.getItem('ipCheckResult');
  const cachedTime = localStorage.getItem('ipCheckTimestamp');
  const currentTime = new Date().getTime();
  
  // Se temos um resultado em cache válido (menos de 1 hora)
  if (cachedResult && cachedTime && (currentTime - parseInt(cachedTime) < 3600000)) {
    if (cachedResult === 'denied') {
      // Redireciona para página de acesso negado
      window.location.href = 'acesso-negado.html';
    }
    // Se for 'allowed', não faz nada e deixa a página carregar normalmente
    return;
  }
  
  // URL da sua API Gateway
  const ipCheckApiUrl = 'https://sua-api-gateway-url.execute-api.region.amazonaws.com/stage/check-ip';
  
  // Mostrar indicador de carregamento (opcional)
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'ip-check-loading';
  loadingDiv.innerHTML = 'Verificando seu acesso...';
  loadingDiv.style.position = 'fixed';
  loadingDiv.style.top = '0';
  loadingDiv.style.left = '0';
  loadingDiv.style.width = '100%';
  loadingDiv.style.backgroundColor = '#f8f9fa';
  loadingDiv.style.color = '#343a40';
  loadingDiv.style.textAlign = 'center';
  loadingDiv.style.padding = '10px';
  loadingDiv.style.zIndex = '9999';
  document.body.insertBefore(loadingDiv, document.body.firstChild);
  
  // Faz a requisição para a API
  fetch(ipCheckApiUrl)
    .then(response => response.json())
    .then(data => {
      // Remove o indicador de carregamento
      if (document.getElementById('ip-check-loading')) {
        document.getElementById('ip-check-loading').remove();
      }
      
      // Verifica se o acesso é permitido
      if (data.message === 'Acesso permitido') {
        // Armazena o resultado no localStorage
        localStorage.setItem('ipCheckResult', 'allowed');
        localStorage.setItem('ipCheckTimestamp', currentTime.toString());
        // Continua normalmente
      } else {
        // Armazena o resultado no localStorage
        localStorage.setItem('ipCheckResult', 'denied');
        localStorage.setItem('ipCheckTimestamp', currentTime.toString());
        // Redireciona para a página de acesso negado
        window.location.href = 'acesso-negado.html';
      }
    })
    .catch(error => {
      console.error('Erro ao verificar acesso:', error);
      // Remove o indicador de carregamento
      if (document.getElementById('ip-check-loading')) {
        document.getElementById('ip-check-loading').remove();
      }
      
      // Decisão sobre o que fazer em caso de erro
      // Opção 1: Permitir acesso em caso de erro
      // Opção 2: Negar acesso em caso de erro (mais seguro)
      localStorage.setItem('ipCheckResult', 'denied');
      localStorage.setItem('ipCheckTimestamp', currentTime.toString());
      window.location.href = 'acesso-negado.html';
    });
}

// Executa a verificação quando a página carrega
document.addEventListener('DOMContentLoaded', verificarAcesso);
