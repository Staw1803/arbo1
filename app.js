document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa o Supabase com as variáveis da Vercel
    const _supabaseUrl = 'https://zbnpwicdgobxkvesgayr.supabase.co';
    const _supabaseKey = 'sb_publishable_Bw_NeyC1z_bHKnKOYjns0w_wAiAw5Lc';
    const supabaseClient = supabase.createClient(_supabaseUrl, _supabaseKey);

    const loginForm = document.getElementById('loginForm');
    const corporateDashboard = document.getElementById('corporateDashboard');
    const contentLayer = document.querySelector('.content-layer');

    // 2. Lógica de Login por Empresa (Credencial Única)
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = document.getElementById('securityToken').value.toUpperCase().trim();

            // Busca se o token existe na tabela 'empresas'
            const { data: empresa, error } = await supabaseClient
                .from('empresas')
                .select('*')
                .eq('id_acesso', token)
                .single();

            if (empresa) {
                loginModal.classList.remove('active');
                contentLayer.style.display = 'none';
                corporateDashboard.style.display = 'block';
                document.querySelector('.site-header').style.display = 'none';
                
                // Ativa o Realtime para esta empresa
                conectarDadosEmTempoReal(empresa.id);
            } else {
                document.getElementById('loginFeedback').innerHTML = '<span style="color:#FF3B5C;">Token inválido.</span>';
            }
        });
    }

    // 3. Função Realtime: Recebe dados do DHT11 sem atualizar a página
    function conectarDadosEmTempoReal(empresaId) {
        //         supabaseClient
            .channel('viva-arbo')
            .on('postgres_changes', 
                { event: 'INSERT', schema: 'public', table: 'leituras' }, 
                (payload) => {
                    const novaLeitura = payload.new;
                    console.log("Dado novo:", novaLeitura);

                    // Atualiza a Temperatura no seu Dashboard
                    const tempDisplay = document.getElementById('liveConsumptionValue');
                    if (tempDisplay) {
                        tempDisplay.innerHTML = `${novaLeitura.temperatura} <span style="font-size:1.2rem;">°C</span>`;
                    }

                    // Muda a cor da bolinha no Mapa Galáxia (Ex: RH)
                    const bolha = document.querySelector('.bubble');
                    if (bolha && novaLeitura.dispositivo_id === "vaso_rh_01") {
                        bolha.className = novaLeitura.temperatura > 25 ? 'bubble red' : 'bubble green';
                    }
                }
            )
            .subscribe();
    }

    // 4. Suas animações de Scroll originais
    const header = document.querySelector('.site-header');
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 100) header.classList.add('is-hidden');
        else header.classList.remove('is-hidden');
        lastScrollY = currentScrollY;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
