
const firebaseConfig = {
    apiKey: "AIzaSyCU_jlDrdbWZ780KdBmBMregGqoVFhw2Ag",
    authDomain: "my-fluxo-finance.firebaseapp.com",
    projectId: "my-fluxo-finance",
    storageBucket: "my-fluxo-finance.appspot.com",
    messagingSenderId: "310977282920",
    appId: "1:310977282920:web:d003d14bf72f508da0ccdd",
    measurementId: "G-SBWWBYKLQB"
};


firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
    // verifica se ta logado
    auth.onAuthStateChanged((user) => {
        if (user) {
            displayUserInfo(user);
            loadUserData(user.uid);
        } else {
            window.location.href = '../index.html';
        }
    });

    //gráfico
    initChart();
    

    setupUserMenu();
});

// mostra as informações do usuário
function displayUserInfo(user) {
    const userEmailElement = document.getElementById('user-email');
    const welcomeMessageElement = document.getElementById('welcome-message');
    
    //email
    userEmailElement.textContent = user.email;
    
    //boas-vindas
    const userName = user.displayName || user.email.split('@')[0];
    welcomeMessageElement.textContent = `Bem-vindo de volta, ${userName}!`;
    
    //imagem
    if (user.photoURL) {
        document.querySelector('.user-avatar').src = user.photoURL;
    } else {
        //inicial
        document.querySelector('.user-avatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4a6fa5&color=fff`;
    }
}

// carrega os dados do usuário
function loadUserData(userId) {
    db.collection('usuarios').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                console.log("Dados do usuário:", userData);
                
            } else {
                console.log("Nenhum dado adicional encontrado para este usuário");
            }
        })
        .catch((error) => {
            console.error("Erro ao carregar dados do usuário:", error);
        });
}

//gráfico com Chart.js
function initChart() {
    const ctx = document.getElementById('financeChart').getContext('2d');
    const financeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [
                {
                    label: 'Receitas',
                    data: [3200, 3800, 4100, 3900, 4800, 5250],
                    backgroundColor: '#4CAF50',
                    borderRadius: 4
                },
                {
                    label: 'Despesas',
                    data: [2800, 3200, 3500, 3700, 4200, 3780],
                    backgroundColor: '#F44336',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': R$ ' + context.raw.toLocaleString('pt-BR');
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    }
                }
            }
        }
    });
}


function setupUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    userMenu.addEventListener('click', function() {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    // fecha dropdown
    document.addEventListener('click', function(event) {
        if (!userMenu.contains(event.target)) {
            dropdownMenu.style.display = 'none';
        }
    });
}