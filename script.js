// Dados simulados da aplicação
const mockRanking = [
    { pos: 1, nome: "Ramon (IFMA)", turma: "1º ano - A", acertos: 20, pct: "100%" },
    { pos: 2, nome: "Maria Clara", turma: "1º ano - A", acertos: 19, pct: "95%" },
    { pos: 3, nome: "João Pedro", turma: "1º ano - B", acertos: 18, pct: "90%" },
    { pos: 4, nome: "Ana Beatriz", turma: "1º ano - C", acertos: 16, pct: "80%" },
    { pos: 5, nome: "Carlos Eduardo", turma: "1º ano - A", acertos: 15, pct: "75%" },
    { pos: 6, nome: "Beatriz Lima", turma: "1º ano - B", acertos: 14, pct: "70%" }
];

const mockGabarito = [
    { q: 1, sua: "B", correta: "B", status: "ok" },
    { q: 2, sua: "C", correta: "C", status: "ok" },
    { q: 3, sua: "A", correta: "B", status: "no", errada: "A" },
    { q: 4, sua: "D", correta: "D", status: "ok" },
    { q: 5, sua: "B", correta: "B", status: "ok" },
    { q: 6, sua: "A", correta: "A", status: "ok" },
    { q: 7, sua: "C", correta: "C", status: "ok" },
    { q: 8, sua: "C", correta: "D", status: "no", errada: "C" },
    { q: 9, sua: "B", correta: "B", status: "ok" },
    { q: 10, sua: "C", correta: "C", status: "ok" },
    { q: 11, sua: "A", correta: "A", status: "ok" },
    { q: 12, sua: "C", correta: "B", status: "no", errada: "C" },
    { q: 13, sua: "D", correta: "D", status: "ok" },
    { q: 14, sua: "C", correta: "C", status: "ok" },
    { q: 15, sua: "A", correta: "A", status: "ok" },
    { q: 16, sua: "B", correta: "B", status: "ok" },
    { q: 17, sua: "C", correta: "C", status: "ok" },
    { q: 18, sua: "B", correta: "A", status: "no", errada: "B" },
    { q: 19, sua: "D", correta: "D", status: "ok" },
    { q: 20, sua: "B", correta: "B", status: "ok" }
];

// Função de navegação entre telas
function mostrarTela(screenId) {
    document.querySelectorAll('.dashboard .screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.remove('hidden');
    }
    
    // Atualiza estado ativo no menu
    document.querySelectorAll('.side-nav button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-screen') === screenId) {
            btn.classList.add('active');
        }
    });
}

// Inicializadores ao carregar a página
document.addEventListener('DOMContentLoaded', () => {

    // 1. Lógica de Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usuario = document.getElementById('usuario').value.trim();
            const senha = document.getElementById('senha').value.trim();

            if (usuario !== "" && senha !== "") {
                document.getElementById('login').classList.add('hidden');
                document.getElementById('painel').classList.remove('hidden');
                mostrarTela('inicio');
            } else {
                document.getElementById('mensagemLogin थकान').textContent = "Preencha os campos corretamente!";
            }
        });
    }

    // 2. Botão de Mostrar/Ocultar Senha
    const toggleBtn = document.getElementById('togglePassword');
    const senhaInput = document.getElementById('senha');
    if (toggleBtn && senhaInput) {
        toggleBtn.addEventListener('click', () => {
            if (senhaInput.type === 'password') {
                senhaInput.type = 'text';
                toggleBtn.textContent = '◎';
            } else {
                senhaInput.type = 'password';
                toggleBtn.textContent = '◉';
            }
        });
    }

    // 3. Navegação por cliques em botões com data-goto
    document.querySelectorAll('[data-goto]').forEach(btn => {
        btn.addEventListener('click', () => {
            const screen = btn.getAttribute('data-goto');
            mostrarTela(screen);
        });
    });

    // 4. Navegação pelo Menu Lateral
    document.querySelectorAll('.side-nav button[data-screen]').forEach(btn => {
        btn.addEventListener('click', () => {
            const screen = btn.getAttribute('data-screen');
            mostrarTela(screen);
        });
    });

    // 5. Botão de Logout / Sair
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            document.getElementById('painel').classList.add('hidden');
            document.getElementById('login').classList.remove('hidden');
            document.getElementById('usuario').value = '';
            document.getElementById('senha').value = '';
        });
    }

    // 6. Preencher Grid de Questões na tela de Resultado (20 questões)
    const questionsGrid = document.getElementById('questionsGrid');
    if (questionsGrid) {
        questionsGrid.innerHTML = '';
        mockGabarito.forEach(item => {
            const div = document.createElement('div');
            div.className = 'question';
            const corClasse = item.status === 'ok' ? 'green' : 'red';
            div.innerHTML = `${item.q} <span class="answer ${corClasse}">${item.sua}</span>`;
            questionsGrid.appendChild(div);
        });
    }

    // 7. Preencher Tabela de Gabarito
    const answerBody = document.getElementById('answerBody');
    if (answerBody) {
        answerBody.innerHTML = '';
        mockGabarito.forEach(item => {
            const tr = document.createElement('tr');
            if (item.status === 'ok') {
                tr.innerHTML = `
                    <td>Questão ${item.q}</td>
                    <td><span class="answer green" style="margin:0 auto;">${item.sua}</span></td>
                    <td><span class="answer green" style="margin:0 auto;">${item.correta}</span></td>
                    <td><span class="status ok">Correta</span></td>
                `;
            } else {
                tr.innerHTML = `
                    <td>Questão ${item.q}</td>
                    <td><span class="answer red" style="margin:0 auto;">${item.sua}</span></td>
                    <td><span class="answer green" style="margin:0 auto;">${item.correta}</span></td>
                    <td><span class="status no">Incorreta</span></td>
                `;
            }
            answerBody.appendChild(tr);
        });
    }

    // 8. Preencher Tabela de Ranking
    const rankingBody = document.getElementById('rankingBody');
    if (rankingBody) {
        function renderRanking(filtro) {
            rankingBody.innerHTML = '';
            let dados = mockRanking;
            if (filtro && filtro !== 'Geral') {
                dados = mockRanking.filter(r => r.turma === filtro);
            }

            dados.forEach((item, index) => {
                const tr = document.createElement('tr');
                let medalhaOuPos = `<span class="rank-number">${index + 1}º</span>`;
                if (index === 0) medalhaOuPos = `<span class="medal">🥇</span>`;
                if (index === 1) medalhaOuPos = `<span class="medal">🥈</span>`;
                if (index === 2) medalhaOuPos = `<span class="medal">🥉</span>`;

                tr.innerHTML = `
                    <td>${medalhaOuPos}</td>
                    <td><span class="student-name"><span class="avatar">👤</span>${item.nome}</span></td>
                    <td>${item.turma}</td>
                    <td class="score">${item.acertos}/20</td>
                    <td class="percent">${item.pct}</td>
                    <td><span class="row-arrow">›</span></td>
                `;
                rankingBody.appendChild(tr);
            });
        }

        renderRanking('Geral');

        const rankingFilter = document.getElementById('rankingFilter');
        if (rankingFilter) {
            rankingFilter.addEventListener('change', (e) => {
                renderRanking(e.target.value);
            });
        }
    }
});
