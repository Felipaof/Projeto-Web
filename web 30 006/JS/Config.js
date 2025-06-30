document.addEventListener('DOMContentLoaded', function () {
  const bgPicker = document.getElementById('bg-color-picker');
  const primaryPicker = document.getElementById('primary-color-picker');
  const customColor = document.getElementById('customColor');
  const fontFamily = document.getElementById('fontFamily');
  const fontSize = document.getElementById('fontSize');
  const preview = document.querySelector('.font-preview');
  const resetButton = document.getElementById('resetSettings');

  // Cores padrão para os seletores
  const bgColors = ['#ffffff', '#f8f9fa', '#e9ecef', '#212529', '#f1f8e9', '#e3f2fd'];
  const primaryColors = ['#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#dc3545', '#fd7e14'];

  // Cria os botões de seleção de cor
  function createColorOptions(container, colors, type) {
    container.innerHTML = ''; // Limpa o container primeiro
    
    colors.forEach(color => {
      const btn = document.createElement('button');
      btn.className = 'color-option';
      btn.style.backgroundColor = color;
      btn.dataset.color = color;
      btn.title = color;
      
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove a classe 'active' de todos os botões do mesmo container
        container.querySelectorAll('.color-option').forEach(option => {
          option.classList.remove('active');
        });
        
        // Adiciona 'active' ao botão clicado
        btn.classList.add('active');
        
        // Salva no localStorage
        if (type === 'bg') {
          localStorage.setItem('bgColor', color);
        } else {
          localStorage.setItem('primaryColor', color);
        }
        
        saveTheme();
      });
      
      container.appendChild(btn);
    });
  }

  // Salva o tema atual
  function saveTheme() {
    const theme = {
      bgColor: localStorage.getItem('bgColor') || getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim() || '#white',
      primaryColor: localStorage.getItem('primaryColor') || getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#0d6efd',
      fontFamily: fontFamily.value,
      fontSize: fontSize.value
    };
    
    localStorage.setItem('siteTheme', JSON.stringify(theme));
    
    // Atualiza outras abas
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'siteTheme',
      newValue: JSON.stringify(theme)
    }));
    
    // Aplica na página atual
    if (typeof applyThemeSettings === 'function') {
      applyThemeSettings();
    }
  }

  // Restaura as seleções salvas
  function restoreSelections() {
    const savedTheme = localStorage.getItem('siteTheme');
    
    if (savedTheme) {
      const theme = JSON.parse(savedTheme);
      
      // Restaura seleção de fonte
      if (theme.fontFamily) {
        fontFamily.value = theme.fontFamily;
        preview.style.fontFamily = theme.fontFamily;
      }
      
      // Restaura tamanho da fonte
      if (theme.fontSize) {
        fontSize.value = theme.fontSize;
        preview.style.fontSize = theme.fontSize;
      }
      
      // Marca as cores selecionadas
      if (theme.bgColor) {
        markSelectedColor(bgPicker, theme.bgColor);
      }
      
      if (theme.primaryColor) {
        markSelectedColor(primaryPicker, theme.primaryColor);
        customColor.value = theme.primaryColor;
      }
    }
  }

  // Marca a cor selecionada nos pickers
  function markSelectedColor(container, color) {
    container.querySelectorAll('.color-option').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.color.toLowerCase() === color.toLowerCase()) {
        btn.classList.add('active');
      }
    });
  }

  // Event listeners
  fontFamily.addEventListener('change', () => {
    preview.style.fontFamily = fontFamily.value;
    saveTheme();
  });

  fontSize.addEventListener('change', () => {
    preview.style.fontSize = fontSize.value;
    saveTheme();
  });

  customColor.addEventListener('input', () => {
    localStorage.setItem('primaryColor', customColor.value);
    markSelectedColor(primaryPicker, customColor.value);
    saveTheme();
  });

 resetButton.addEventListener('click', (e) => {
  e.preventDefault();
  if (confirm('Deseja resetar todas as configurações para os valores padrão?')) {
    // Limpa todo o localStorage relacionado ao tema
    localStorage.removeItem('siteTheme');
    localStorage.removeItem('bgColor');
    localStorage.removeItem('primaryColor');
    localStorage.removeItem('fontFamily');
    localStorage.removeItem('fontSize');
    
    // Reseta os selects para valores padrão
    fontFamily.value = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    fontSize.value = "16px";
    preview.style.fontFamily = fontFamily.value;
    preview.style.fontSize = fontSize.value;
    
    // Remove seleção de cores
    bgPicker.querySelectorAll('.color-option').forEach(btn => btn.classList.remove('active'));
    primaryPicker.querySelectorAll('.color-option').forEach(btn => btn.classList.remove('active'));
    
    // Reseta cor personalizada para branco (#ffffff)
    customColor.value = '#ffffff';
    
    // Define as cores padrão explicitamente
    document.documentElement.style.setProperty('--primary-color', '#0d6efd');
    document.documentElement.style.setProperty('--bg-color', '#ffffff'); // Cor de fundo branca
    
    // Marca a cor branca como ativa no seletor de fundo
    markSelectedColor(bgPicker, '#ffffff');
    
    // Força a aplicação do tema padrão
    saveTheme();
    location.reload();
  }
});

  // Inicialização
  createColorOptions(bgPicker, bgColors, 'bg');
  createColorOptions(primaryPicker, primaryColors, 'primary');
  restoreSelections();
});