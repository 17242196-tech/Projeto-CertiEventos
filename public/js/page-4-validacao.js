document.addEventListener('DOMContentLoaded', () => {
            const emailElement = document.getElementById('user-email');
            const params = new URLSearchParams(window.location.search);
            const email = params.get('email');
            if (email) {
                emailElement.textContent = decodeURIComponent(email);
            }
        });

        function resendEmail() {
            alert('Um novo e-mail de confirmação foi enviado. Por favor, cheque sua caixa de entrada.');
        }

        function alert(message) {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full text-center">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">Aviso</h3>
                    <p class="text-gray-700 mb-6">${message}</p>
                    <button onclick="document.body.removeChild(this.closest('.fixed'))" class="w-full bg-red-700 text-white font-semibold py-2 rounded-lg hover:bg-red-800 transition duration-150">Ok</button>
                </div>
            `;
            document.body.appendChild(modal);
        }