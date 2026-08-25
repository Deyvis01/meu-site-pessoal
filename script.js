// CARRINHO
const btnCarrinho = document.getElementById('btn-carrinho');
const modalCarrinho = document.getElementById('modal-carrinho');
const btnFecharCarrinho = document.getElementById('btn-fechar-carrinho');
const botoesComprar = document.querySelectorAll('.btn-comprar');

let carrinho = [];
let totalPreco = 0;

function formatBRL(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

// Abrir/Fechar Modal
if (btnCarrinho && btnCarrinho.tagName === 'BUTTON') {
    btnCarrinho.addEventListener('click', () => {
        modalCarrinho.classList.add('ativo');
    });
}

if (btnFecharCarrinho) {
    btnFecharCarrinho.addEventListener('click', () => {
        modalCarrinho.classList.remove('ativo');
    });
}

modalCarrinho.addEventListener('click', (e) => {
    if (e.target === modalCarrinho) {
        modalCarrinho.classList.remove('ativo');
    }
});

// Adicionar ao Carrinho
botoesComprar.forEach((botao) => {
    botao.addEventListener('click', (e) => {
        const card = e.target.closest('.produto-card');
        if (!card) return;

        const nome = card.querySelector('.produto-nome').textContent.trim();
        const precoTexto = card.querySelector('.produto-preco').textContent.trim();
        const precoValor = Number(card.dataset.preco) || parseFloat(precoTexto.replace(/[^0-9,]/g, '').replace(',', '.'));

        carrinho.push({ nome, precoTexto, precoValor });
        totalPreco += precoValor;

        atualizarCarrinho();
        mostrarNotificacao(`${nome} adicionado ao carrinho!`);
    });
});

function atualizarCarrinho() {
    const contagem = document.querySelector('.carrinho-count');
    const totalEl = document.getElementById('total-preco');
    const carrinhoItems = document.getElementById('carrinho-items');

    if (contagem) contagem.textContent = carrinho.length;
    if (totalEl) totalEl.textContent = formatBRL(totalPreco);

    if (carrinho.length === 0) {
        carrinhoItems.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio</p>';
        return;
    }

    carrinhoItems.innerHTML = carrinho.map((item, index) => `
        <div style="padding: 0.8rem; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <p style="margin: 0; font-weight: 600; color: #1a1a1a;">${item.nome}</p>
                <p style="margin: 0.3rem 0 0 0; color: #666;">${item.precoTexto}</p>
            </div>
            <button onclick="removerDoCarrinho(${index})" style="background: #e0e0e0; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-weight: 500;">Remover</button>
        </div>
    `).join('');
}

function removerDoCarrinho(index) {
    const item = carrinho[index];
    if (!item) return;

    carrinho.splice(index, 1);
    totalPreco -= item.precoValor;
    if (totalPreco < 0) totalPreco = 0;

    atualizarCarrinho();
}

window.removerDoCarrinho = removerDoCarrinho;

// Checkout
const btnCheckout = document.querySelector('.btn-checkout');
if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
        if (carrinho.length === 0) {
            mostrarNotificacao('Seu carrinho está vazio.');
            return;
        }

        const resumo = carrinho.map(i => `- ${i.nome} (${i.precoTexto})`).join('\n');
        const mensagem = `Olá, Vetech! Quero finalizar a compra.\n\nItens:\n${resumo}\n\nTotal: ${formatBRL(totalPreco)}`;

        const confirmar = confirm(`Finalizar compra\n\nTotal: ${formatBRL(totalPreco)}\n\nClique OK para enviar para o WhatsApp.`);
        if (!confirmar) return;

        const telefoneWhatsApp = '5511998765432';
        const url = `https://wa.me/${telefoneWhatsApp}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');

        carrinho = [];
        totalPreco = 0;
        atualizarCarrinho();
        modalCarrinho.classList.remove('ativo');
        mostrarNotificacao('✅ Pedido enviado!');
    });
}

function mostrarNotificacao(mensagem) {
    const notif = document.createElement('div');
    notif.textContent = mensagem;
    notif.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #1a1a1a;
        color: #fff;
        padding: 1rem 1.5rem;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 999;
    `;

    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;

        if (document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
        }
    });
});