function mostrarTela(idTela) {
    const telas = document.querySelectorAll('.screen');
    telas.forEach(tela => tela.classList.add('hidden'));
    
    const telaAlvo = document.getElementById(idTela);
    if (telaAlvo) {
        telaAlvo.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const usuarioInput = document.getElementById('usuario').value;
            const senhaInput = document.getElementById('senha').value;

            if (usuarioInput && senhaInput) {
                document.getElementById('login').classList.add('hidden');
                document.getElementById('painel').classList.remove('hidden');
                mostrarTela('inicio');
            } else {
                alert("Preencha usuário e senha!");
            }
        });
    }
});

function sair() {
    document.getElementById('painel').classList.add('hidden');
    document.getElementById('login').classList.remove('hidden');
}
