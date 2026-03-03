document.addEventListener('DOMContentLoaded', () => {

    /* ====================== 1. CONFIGURAÇÃO E CONEXÃO ====================== */
    // Conecta com as suas chaves do Supabase
    const _supabaseUrl = 'https://zbnpwicdgobxkvesgayr.supabase.co';
    const _supabaseKey = 'sb_publishable_Bw_NeyC1z_bHKnKOYjns0w_wAiAw5Lc';
    const supabaseClient = supabase.createClient(_supabaseUrl, _supabaseKey);

    /* ====================== 2. LOGIN POR CREDENCIAL (TOKEN) ====================== */
    const loginForm = document.getElementById('loginForm');
    const loginModal = document.getElementById('loginModal');
    const corporateDashboard = document.getElementById('corporateDashboard');
    const contentLayer = document.querySelector('.content-layer');
    const siteHeader = document.querySelector('.site-header');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const tokenDigitado = document.getElementById('securityToken').value.toUpperCase().trim();

            // Busca a empresa dona do token no banco de dados
            const { data: empresa, error } = await supabaseClient
                .from('empresas')
                .select('*')
                .eq('id_acesso', tokenDigitado)
                .single();

            if (empresa) {
                // Sucesso: Esconde a landing e mostra o dashboard
                loginModal.classList.remove('active');
                contentLayer.style.display = 'none';
                corporateDashboard.style.display = 'block';
                if (siteHeader) siteHeader.style.display = 'none';
                document.querySelector('.site-footer').style.display = 'none';

                console.log(`Logado como: ${empresa.nome_empresa}`);
                
                // Inicia a escuta dos sensores em tempo real
                iniciarMonitoramentoRealtime();
            } else {
                document.getElementById('loginFeedback').innerHTML = 
                    '<span style="color:#FF3B5C; font-size: 0.9rem; margin-top: 10px; display: block;">Credencial inválida.</span>';
            }
        });
    }

    /* ====================== 3. ATUALIZAÇÃO EM TEMPO REAL (NUVEM) ====================== */
    function iniciarMonitoramentoRealtime() {
        console.log("A.R.B.O. conectado à nuvem. Aguardando dados...");

        // Escuta qualquer inserção na tabela 'leituras'
        supabaseClient
            .channel('db-changes')
            .on('postgres_changes', 
                { event: 'INSERT', schema: 'public', table: 'leituras' }, 
                (payload) => {
                    const dados = payload.new;
                    console.log("Nova leitura do ESP32:", dados);

                    // A. Atualiza a métrica de Consumo Atual (mostrando a Temp atual)
                    const metricsDisplay = document.getElementById('liveConsumptionValue');
                    if (metricsDisplay) {
                        metricsDisplay.innerHTML = `${dados.temperatura} <span style="font-size: 1.2rem; font-weight: 400;">°C</span>`;
                    }

                    // B. Atualiza o Mapa Galáxia (Bolinha do RH)
                    // Se a temperatura passar de 25°C, a bolinha fica vermelha (Alerta NR-17)
                    const bolhaRH = document.querySelector('.bubble'); 
                    if (bolhaRH && dados.dispositivo_id === "vaso_rh_01") {
                        if (dados.temperatura > 25) {
                            bolhaRH.className = 'bubble red'; // Estilo vermelho do seu CSS
                        } else {
                            bolhaRH.className = 'bubble green'; // Estilo preto/luxo do seu CSS
                        }
                    }
                }
            )
            .subscribe();
    }

    /* ====================== 4. ANIMAÇÕES DE VITRINE (ORIGINAIS) ====================== */
    const header = document.querySelector('.site-header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.classList.add('is-hidden');
        } else {
            header.classList.remove('is-hidden');
        }
        if (currentScrollY > 50) header.classList.add('scrolled-bg');
        else header.classList.remove('scrolled-bg');
        lastScrollY = currentScrollY;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
