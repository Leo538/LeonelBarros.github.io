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
  // Una vez que todo esté cargado, ejecutamos el fondo de Three.js
window.addEventListener('DOMContentLoaded', () => {
    var stats = initStats();

    // Crear la escena
    var scene = new THREE.Scene();

    // Crear la cámara
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Crear el renderizador y establecer su tamaño
    var webGLRenderer = new THREE.WebGLRenderer({ antialias: true });
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('WebGL-output').appendChild(webGLRenderer.domElement);

    // Añadir el renderizador al contenedor HTML
    document.getElementById('WebGL-output').appendChild(webGLRenderer.domElement);

    // Posicionar la cámara y apuntarla al centro de la escena
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 50;
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    // Ajustar el tamaño del renderizador y la cámara al cambiar el tamaño de la ventana
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Control de la geometría animada
    var step = 0;
    var knot;

    // Configuración de controles con dat.GUI
    var controls = new (function () {
        this.radius = 40;
        this.tube = 28.2;
        this.radialSegments = 600;
        this.tubularSegments = 12;
        this.p = 5;
        this.q = 4;
        this.heightScale = 4;
        this.asParticles = true;
        this.rotate = true;

        this.redraw = function () {
            if (knot) scene.remove(knot);

            var geom = new THREE.TorusKnotGeometry(
                controls.radius,
                controls.tube,
                Math.round(controls.radialSegments),
                Math.round(controls.tubularSegments),
                Math.round(controls.p),
                Math.round(controls.q),
                controls.heightScale
            );

            if (controls.asParticles) {
                knot = createParticleSystem(geom);
            } else {
                knot = createMesh(geom);
            }

            scene.add(knot);
        };
    })();

    var gui = new dat.GUI();
    gui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
    gui.add(controls, 'tube', 0, 40).onChange(controls.redraw);
    gui.add(controls, 'radialSegments', 0, 400).step(1).onChange(controls.redraw);
    gui.add(controls, 'tubularSegments', 1, 20).step(1).onChange(controls.redraw);
    gui.add(controls, 'p', 1, 10).step(1).onChange(controls.redraw);
    gui.add(controls, 'q', 1, 15).step(1).onChange(controls.redraw);
    gui.add(controls, 'heightScale', 0, 5).onChange(controls.redraw);
    gui.add(controls, 'asParticles').onChange(controls.redraw);
    gui.add(controls, 'rotate').onChange(controls.redraw);
    gui.close();

    controls.redraw();
    render();

    // Crear un sprite para partículas
    function generateSprite() {
        var canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;

        var context = canvas.getContext('2d');
        var gradient = context.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            0,
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 2
        );
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
        gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,1)');

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    function createParticleSystem(geom) {
        var material = new THREE.ParticleSystemMaterial({
            color: 0xffffff,
            size: 3,
            transparent: true,
            blending: THREE.AdditiveBlending,
            map: generateSprite(),
        });

        var system = new THREE.ParticleSystem(geom, material);
        system.sortParticles = true;
        return system;
    }

    function createMesh(geom) {
        var meshMaterial = new THREE.MeshNormalMaterial({});
        meshMaterial.side = THREE.DoubleSide;

        var mesh = new THREE.Mesh(geom, meshMaterial);
        return mesh;
    }

    function render() {
        stats.update();

        if (controls.rotate) {
            knot.rotation.y = step += 0.01;
        }

        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);
    }

    function initStats() {
        var stats = new Stats();
        stats.setMode(0);

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.getElementById('Stats-output').appendChild(stats.domElement);

        return stats;
    }
});
