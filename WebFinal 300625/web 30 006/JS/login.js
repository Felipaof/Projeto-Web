import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import {getDatabase, ref, set, get, child} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCU_jlDrdbWZ780KdBmBMregGqoVFhw2Ag",
    authDomain: "my-fluxo-finance.firebaseapp.com",
    projectId: "my-fluxo-finance",
    storageBucket: "my-fluxo-finance.appspot.com",
    messagingSenderId: "310977282920",
    appId: "1:310977282920:web:d003d14bf72f508da0ccdd",
    measurementId: "G-SBWWBYKLQB"
};

const app = initializeApp(firebaseConfig);

    const db = getDatabase(app);
        document.getElementById("submit").addEventListener('click',function(e){
        e.preventDefault();

        set(ref(db, 'email/' + document.getElementById("email").value),
        {

            Usuário: document.getElementById("email").value,
            Senha: document.getElementById("password").value,

        });
        
            alert("Login Efetuado com sucesso!");

    });
    const auth = getAuth(app);
        // Função para fazer login
        window.fazerLogin = async (email, senha) => {
            try {
                await signInWithEmailAndPassword(auth, email, senha);
                window.location.href = "dashboard.html";
            } catch (error) {
                let mensagemErro;
                switch(error.code) {
                    case "auth/invalid-email": mensagemErro = "E-mail inválido."; break;
                    case "auth/user-disabled": mensagemErro = "Conta desativada."; break;
                    case "auth/user-not-found": mensagemErro = "Usuário não encontrado."; break;
                    case "auth/wrong-password": mensagemErro = "Senha incorreta."; break;
                    default: mensagemErro = "Erro ao fazer login.";
                }
                document.getElementById('erro-login').textContent = mensagemErro;
                document.getElementById('erro-login').style.display = 'block';
            }
        };

        // Verifica se logado
        onAuthStateChanged(auth, (user) => {
            if (user) window.location.href = "dashboard.html";
        });
        