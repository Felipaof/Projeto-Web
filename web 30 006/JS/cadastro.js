        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
        import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
        import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

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
        const auth = getAuth(app);
        const db = getFirestore(app);

        window.cadastrarUsuario = async (e) => {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const cpf = document.getElementById('cpf').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('confirmar-senha').value;
            const telefone = document.getElementById('telefone').value;
            
            // Validação básica
            if (senha !== confirmarSenha) {
                mostrarErro("As senhas não coincidem!");
                return;
            }
            
            if (!document.getElementById('terms').checked) {
                mostrarErro("Você deve aceitar os termos de serviço!");
                return;
            }

            try {
                // Cria o usuário no Firebase Auth
                const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
                const user = userCredential.user;
                
                // Salva dados adicionais no Firestore
                await addDoc(collection(db, "usuarios"), {
                    uid: user.uid,
                    nome: nome,
                    cpf: cpf,
                    telefone: telefone,
                    dataCadastro: new Date()
                });
                
                // Redireciona para a dashboard após cadastro
                window.location.href = "dashboard.html";
                
            } catch (error) {
                let mensagemErro;
                switch(error.code) {
                    case "auth/email-already-in-use":
                        mensagemErro = "Este e-mail já está em uso.";
                        break;
                    case "auth/invalid-email":
                        mensagemErro = "E-mail inválido.";
                        break;
                    case "auth/weak-password":
                        mensagemErro = "Senha fraca (mínimo 6 caracteres).";
                        break;
                    default:
                        mensagemErro = "Erro ao cadastrar: " + error.message;
                }
                mostrarErro(mensagemErro);
            }
        };

        function mostrarErro(mensagem) {
            const erroElement = document.getElementById('erro-cadastro');
            erroElement.textContent = mensagem;
            erroElement.style.display = 'block';
            window.scrollTo(0, 0);
        }
         // Validação simples de senha 
        const senhaInput = document.getElementById('senha');
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');

        senhaInput.addEventListener('input', function() {
            const senha = this.value;
            let strength = 0;
            
            if (senha.length >= 8) strength += 1;
            if (senha.length >= 12) strength += 1;
            if (/[!@#$%^&*(),.?":{}|<>]/.test(senha)) strength += 1;
            if (/\d/.test(senha)) strength += 1;
            if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) strength += 1;
            
            const width = strength * 20;
            strengthBar.style.width = `${width}%`;
            
            if (strength <= 1) {
                strengthBar.style.backgroundColor = '#ff4d4d';
                strengthText.textContent = 'Força da senha: fraca';
            } else if (strength <= 3) {
                strengthBar.style.backgroundColor = '#ffcc00';
                strengthText.textContent = 'Força da senha: média';
            } else {
                strengthBar.style.backgroundColor = '#4CAF50';
                strengthText.textContent = 'Força da senha: forte';
            }
        });

        // Máscaras 
        document.getElementById('cpf').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 3) value = value.replace(/^(\d{3})(\d)/g, '$1.$2');
            if (value.length > 6) value = value.replace(/^(\d{3})\.(\d{3})(\d)/g, '$1.$2.$3');
            if (value.length > 9) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/g, '$1.$2.$3-$4');
            if (value.length > 11) value = value.substring(0, 14);
            e.target.value = value;
        });

        document.getElementById('telefone').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) value = '(' + value;
            if (value.length > 3) value = value.substring(0, 3) + ') ' + value.substring(3);
            if (value.length > 10) value = value.substring(0, 10) + '-' + value.substring(10);
            if (value.length > 15) value = value.substring(0, 15);
            e.target.value = value;
        });
        document.ge