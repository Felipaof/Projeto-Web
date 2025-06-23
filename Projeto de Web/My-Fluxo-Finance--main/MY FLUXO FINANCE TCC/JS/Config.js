document.addEventListener('DOMContentLoaded', function() {
    // Seletores
    const colorOptions = document.querySelectorAll('.color-option');
    const customColor = document.getElementById('customColor');
    const fontFamily = document.getElementById('fontFamily');
    const fontSize = document.getElementById('fontSize');
    const resetButton = document.getElementById('resetSettings');
    const fontPreview = document.querySelector('.font-preview');
    
    // Aplicar tema para todas as páginas
    function applyThemeToAllPages() {
        const theme = {
            bgColor: localStorage.getItem('bgColor') || '#f8f9fa',
            primaryColor: localStorage.getItem('primaryColor') || '#0d6efd',
            fontFamily: localStorage.getItem('fontFamily') || "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            fontSize: localStorage.getItem('fontSize') || '16px'
        };
        
        // Salva o tema atual no localStorage para todas as páginas
        localStorage.setItem('siteTheme', JSON.stringify(theme));
    }
    
    // Aplicar cor de fundo
    function applyBackgroundColor(color) {
        document.body.style.backgroundColor = color;
        localStorage.setItem('bgColor', color);
        applyThemeToAllPages();
    }
    
    // Aplicar cor primária
    function applyPrimaryColor(color) {
        document.documentElement.style.setProperty('--primary-color', color);
        
        // Atualizar elementos em todas as páginas
        const elementsToUpdate = [
            '.card-header',
            '.botao-primario',
            '.welcome-banner',
            '.add-transaction',
            '.btn-nova-meta',
            'header'
        ];
        
        elementsToUpdate.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.style.backgroundColor = color;
            });
        });
        
        localStorage.setItem('primaryColor', color);
        applyThemeToAllPages();
    }
    
    // Aplicar fonte
    function applyFont(font) {
        document.body.style.fontFamily = font;
        localStorage.setItem('fontFamily', font);
        applyThemeToAllPages();
    }
    
    // Aplicar tamanho da fonte
    function applyFontSize(size) {
        document.body.style.fontSize = size;
        
        // Ajustar elementos baseados no tamanho da fonte
        const adjustElements = [
            { selector: 'body', property: 'fontSize' },
            { selector: 'h1', property: 'fontSize', multiplier: 2 },
            { selector: 'h2', property: 'fontSize', multiplier: 1.5 },
            { selector: 'h3', property: 'fontSize', multiplier: 1.3 },
            { selector: '.card-value', property: 'fontSize', multiplier: 1.5 }
        ];
        
        const baseSize = parseInt(size);
        adjustElements.forEach(item => {
            const value = item.multiplier ? `${baseSize * item.multiplier}px` : size;
            document.querySelectorAll(item.selector).forEach(el => {
                el.style[item.property] = value;
            });
        });
        
        localStorage.setItem('fontSize', size);
        applyThemeToAllPages();
    }
    
    // Carregar configurações salvas
    function loadSettings() {
        // Verificar se há um tema salvo para todas as páginas
        const savedTheme = localStorage.getItem('siteTheme');
        if (savedTheme) {
            const theme = JSON.parse(savedTheme);
            applyBackgroundColor(theme.bgColor);
            applyPrimaryColor(theme.primaryColor);
            applyFont(theme.fontFamily);
            applyFontSize(theme.fontSize);
            return;
        }
        
        // Cor de fundo
        const savedBgColor = localStorage.getItem('bgColor');
        if (savedBgColor) applyBackgroundColor(savedBgColor);
        
        // Cor primária
        const savedPrimaryColor = localStorage.getItem('primaryColor');
        if (savedPrimaryColor) applyPrimaryColor(savedPrimaryColor);
        
        // Fonte
        const savedFontFamily = localStorage.getItem('fontFamily');
        if (savedFontFamily) {
            fontFamily.value = savedFontFamily;
            applyFont(savedFontFamily);
        }
        
        // Tamanho da fonte
        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) {
            fontSize.value = savedFontSize;
            applyFontSize(savedFontSize);
        }
    }
    
    // Event listeners
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            if (this.parentElement.previousElementSibling.textContent.includes('Fundo')) {
                applyBackgroundColor(color);
            } else {
                applyPrimaryColor(color);
            }
            
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    customColor.addEventListener('input', function() {
        applyPrimaryColor(this.value);
    });
    
    fontFamily.addEventListener('change', function() {
        applyFont(this.value);
        fontPreview.style.fontFamily = this.value;
    });
    
    fontSize.addEventListener('change', function() {
        applyFontSize(this.value);
        fontPreview.style.fontSize = this.value;
    });
    
    resetButton.addEventListener('click', function() {
        if (confirm('Tem certeza que deseja resetar todas as configurações?')) {
            localStorage.clear();
            location.reload();
        }
    });
    
    // Carregar configurações ao iniciar
    loadSettings();
    
    // Atualizar pré-visualização
    fontPreview.style.fontFamily = fontFamily.value;
    fontPreview.style.fontSize = fontSize.value;
});