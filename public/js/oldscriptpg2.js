// Função para simular pré-seleção da categoria via URL
        document.addEventListener('DOMContentLoaded', () => {
            const params = new URLSearchParams(window.location.search);
            const category = params.get('categoria');
            const titleElement = document.getElementById('category-title');
            if (category) {
                titleElement.textContent = `| ${decodeURIComponent(category)}`;
                document.title = `ESUDA Eventos - ${decodeURIComponent(category)}`;
            } else {
                titleElement.textContent = '| Todos';
            }
        });