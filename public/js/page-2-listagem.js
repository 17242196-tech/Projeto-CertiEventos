document.addEventListener('DOMContentLoaded', () => {
                const params = new URLSearchParams(window.location.search);
                const categoria = params.get('categoria');
                const titleElement = document.getElementById('category-display');

                if (categoria && titleElement) {
                    const nomeCategoria = decodeURIComponent(categoria);
                    titleElement.textContent = nomeCategoria;

                    document.title = `ESUDA Conecta | ${nomeCategoria}`;
                } else if (titleElement) {
                    titleElement.textContent = 'Todos os Eventos';
                }
            });