// Función para cargar contenido dinámico
function loadContent(page) {
    fetch(page)
        .then(response => response.text())
        .then(data => {
            document.getElementById('main-content').innerHTML = data;
        })
        .catch(error => console.log('Error al cargar el contenido:', error));
}

// Función para cargar el footer solo una vez
function loadFooter() {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.log('Error al cargar el footer:', error));
}

// Llama a loadFooter para cargar el footer al cargar la página
loadFooter();
