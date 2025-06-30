// temas.js - Atualizado para aplicar em todas as páginas
document.addEventListener('DOMContentLoaded', function() {
  applyThemeSettings();
  
  // Adiciona listener para quando o tema for alterado em outra aba
  window.addEventListener('storage', function(event) {
    if (event.key === 'siteTheme') {
      applyThemeSettings();
    }
  });
});

function applyThemeSettings() {
  const savedTheme = localStorage.getItem('siteTheme');
  if (savedTheme) {
    const theme = JSON.parse(savedTheme);
    const root = document.documentElement;
    
    // Aplica as variáveis CSS globais
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--bg-color', theme.bgColor);
    root.style.setProperty('--font-family', theme.fontFamily);
    root.style.setProperty('--font-size', theme.fontSize);
    
    // Aplica estilos diretamente no body
    document.body.style.fontFamily = theme.fontFamily;
    document.body.style.fontSize = theme.fontSize;
    document.body.style.backgroundColor = theme.bgColor;
    
    // Atualiza elementos específicos que usam a cor primária
    updatePrimaryColorElements(theme.primaryColor);
    
    // Ajusta tamanhos de fonte relativos
    adjustRelativeFontSizes(theme.fontSize);
  }
}

function updatePrimaryColorElements(primaryColor) {
  // Atualiza todos os elementos que usam a cor primária
  const elements = [
    '.card-header',
    '.btn-primary',
    '.botao-primario',
    '.welcome-banner',
    '.add-transaction',
    '.btn-nova-meta',
    'header',
    '.navbar',
    '.config-card .card-header',
    '.sidebar .nav-link.active'
  ];
  
  elements.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.backgroundColor = primaryColor;
    });
  });
}

function adjustRelativeFontSizes(baseFontSize) {
  const size = parseInt(baseFontSize);
  const adjustments = [
    { selector: 'h1', size: size * 2 },
    { selector: 'h2', size: size * 1.5 },
    { selector: 'h3', size: size * 1.3 },
    { selector: '.card-value', size: size * 1.5 },
    { selector: '.transaction-amount', size: size * 1.1 }
  ];
  
  adjustments.forEach(item => {
    document.querySelectorAll(item.selector).forEach(el => {
      el.style.fontSize = `${item.size}px`;
    });
  });
}