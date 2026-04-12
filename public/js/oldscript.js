     // Lógica simples de navegação do carrossel
    
        const carousel = document.getElementById('carousel');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        const scrollAmount = 350; 

        nextBtn.addEventListener('click', () => {
            carousel.scrollLeft += scrollAmount;
        });

        prevBtn.addEventListener('click', () => {
            carousel.scrollLeft -= scrollAmount;
        });
        
        // Simulação de alerta para o "FALE CONOSCO"
        function showContactForm(message) {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">FALE CONOSCO</h3>
                    <p class="text-gray-700 mb-6">${message}</p>
                    <button onclick="document.body.removeChild(this.closest('.fixed'))" class="w-full bg-red-700 text-white font-semibold py-2 rounded-lg hover:bg-red-800 transition duration-150">Fechar</button>
                </div>
            `;
            document.body.appendChild(modal);
        }