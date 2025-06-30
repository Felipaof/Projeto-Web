// Armazenamento local 
const METAS_LOCAIS_KEY = 'metas_fluxo_financeiro';


const btnNovaMeta = document.getElementById('btnNovaMeta');
const modal = document.getElementById('modalMeta');
const closeBtn = document.querySelector('.close');
const formMeta = document.getElementById('formMeta');
const listaMetas = document.getElementById('listaMetas');
const metaIdInput = document.getElementById('metaId');


const formatarMoeda = (valor) => {
    return valor.toLocaleString('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    });
};

const calcularDiasRestantes = (prazo) => {
    const hoje = new Date();
    const dataPrazo = new Date(prazo);
    const diff = dataPrazo - hoje;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

//pega as metas
function obterMetas() {
    const metas = localStorage.getItem(METAS_LOCAIS_KEY);
    return metas ? JSON.parse(metas) : [];
}


function salvarMetas(metas) {
    localStorage.setItem(METAS_LOCAIS_KEY, JSON.stringify(metas));
}

function salvarMeta(meta) {
    const metas = obterMetas();
    
    if (meta.id) {
        // Atualiza
        const index = metas.findIndex(m => m.id === meta.id);
        if (index !== -1) {
            metas[index] = meta;
        }
    } else {
        // Adiciona
        meta.id = Date.now().toString();
        metas.push(meta);
    }
    
    salvarMetas(metas);
    return meta;
}

// Exclui
function excluirMeta(id) {
    const metas = obterMetas().filter(meta => meta.id !== id);
    salvarMetas(metas);
}

// Renderiza
function renderizarMetas() {
    const metas = obterMetas();
    listaMetas.innerHTML = '';

    if (metas.length === 0) {
        listaMetas.innerHTML = '<p class="sem-metas">Nenhuma meta cadastrada ainda.</p>';
        return;
    }

    metas.forEach(meta => {
        const progresso = Math.min((meta.valorAtual / meta.valorObjetivo) * 100, 100);
        const diasRestantes = calcularDiasRestantes(meta.prazo);
        const prazoFormatado = new Date(meta.prazo).toLocaleDateString('pt-BR');
        
        listaMetas.innerHTML += `
            <div class="meta-card">
                <div class="meta-header">
                    <h3>${meta.nome}</h3>
                    <span class="meta-prazo ${diasRestantes < 30 ? 'alerta' : ''}">
                        <i class="far fa-calendar-alt"></i> ${prazoFormatado}
                    </span>
                </div>
                
                <div class="meta-info">
                    <div class="meta-info-item">
                        <span class="meta-info-label">Valor Objetivo</span>
                        <span class="meta-info-value">${formatarMoeda(meta.valorObjetivo)}</span>
                    </div>
                    <div class="meta-info-item">
                        <span class="meta-info-label">Valor Atual</span>
                        <span class="meta-info-value">${formatarMoeda(meta.valorAtual)}</span>
                    </div>
                    <div class="meta-info-item">
                        <span class="meta-info-label">Dias Restantes</span>
                        <span class="meta-info-value">${diasRestantes}</span>
                    </div>
                </div>
                
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progresso}%"></div>
                    </div>
                    <div class="progress-info">
                        <span>Progresso: ${progresso.toFixed(1)}%</span>
                        <span>Faltam: ${formatarMoeda(meta.valorObjetivo - meta.valorAtual)}</span>
                    </div>
                </div>
                
                <div class="meta-actions">
                    <button class="btn-atualizar" onclick="editarMeta('${meta.id}')">
                        <i class="fas fa-edit"></i> Atualizar
                    </button>
                    <button class="btn-excluir" onclick="excluirMetaLocal('${meta.id}')">
                        <i class="fas fa-trash-alt"></i> Excluir
                    </button>
                </div>
            </div>
        `;
    });
}

// Edita
window.editarMeta = (id) => {
    const meta = obterMetas().find(m => m.id === id);
    if (meta) {
        metaIdInput.value = meta.id;
        document.getElementById('metaNome').value = meta.nome;
        document.getElementById('metaValor').value = meta.valorObjetivo;
        document.getElementById('metaAtual').value = meta.valorAtual;
        document.getElementById('metaPrazo').value = meta.prazo.split('T')[0];
        modal.style.display = 'block';
    }
};

// Exclui
window.excluirMetaLocal = (id) => {
    if (confirm('Tem certeza que deseja excluir esta meta permanentemente?')) {
        excluirMeta(id);
        renderizarMetas();
    }
};


btnNovaMeta.addEventListener('click', () => {
    metaIdInput.value = '';
    formMeta.reset();
    modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

formMeta.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const meta = {
        id: metaIdInput.value || null,
        nome: document.getElementById('metaNome').value.trim(),
        valorObjetivo: parseFloat(document.getElementById('metaValor').value),
        valorAtual: parseFloat(document.getElementById('metaAtual').value),
        prazo: document.getElementById('metaPrazo').value,
        criadoEm: new Date().toISOString()
    };

    if (meta.valorAtual > meta.valorObjetivo) {
        alert('O valor atual não pode ser maior que o objetivo!');
        return;
    }

    salvarMeta(meta);
    modal.style.display = 'none';
    formMeta.reset();
    renderizarMetas();
});


document.addEventListener('DOMContentLoaded', renderizarMetas);