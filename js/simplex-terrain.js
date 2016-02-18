function init() {

    //VAR

    var stats = initStats();
    var simplex = new SimplexNoise();
    var cube, geometry, material;

    //GUI

    var gui = new dat.GUI({
        height : 5 * 32 - 1
    });

    var params = {
        dimension: 2000,
        segment: 16,
        fact: 8,
        mult: 100,
        trasl: 0,
        barr: 0,
        level: 1
    };

    gui.add(params, 'dimension').min(100).max(2000).step(10).onChange(function (e) {
        scene.remove(mesh);
        params.segment=Math.floor(params.segment);
        createMesh();
    });

    gui.add(params, 'segment').min(2).max(512).step(1).onChange(function (e) {
        scene.remove(mesh);
        params.segment=Math.floor(params.segment);
        params.fact=Math.floor(params.segment/2);
        createMesh();
    });

    gui.add(params, 'fact').min(2).max(512).listen().step(1).onChange(function (e) {
        scene.remove(mesh);
        params.segment=Math.floor(params.segment);
        createMesh();
    });

    gui.add(params, 'mult').min(0).max(1000).step(5).onChange(function (e) {
        scene.remove(mesh);
        params.segment=Math.floor(params.segment);
        createMesh();
    });

    gui.add(params, 'trasl').min(0).max(100).step(1).onChange(function (e) {
        scene.remove(mesh);
        params.segment=Math.floor(params.segment);
        createMesh();
    });

    gui.add(params, 'level').min(0).max(100).step(1).onChange(function (e) {
        scene.remove(mesh);
        params.segment=Math.floor(params.segment);
        createMesh();
    });

    gui.add(params, 'barr').min(-100).max(100).step(1).onChange(function (e) {
        scene.remove(mesh);
        params.segment=Math.floor(params.segment);
        createMesh();
    });

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);

    var webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0xffffff, 1.0));
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    webGLRenderer.shadowMapEnabled = false;

    createMesh(params["dimension"]);

    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 550;
    camera.lookAt(new THREE.Vector3(0, 0 , 0));

    var orbitControls = new THREE.OrbitControls(camera, webGLRenderer.domElement);
    orbitControls.autoRotate = false;
    var clock = new THREE.Clock();

    orbitControls.center = new THREE.Vector3(0, 0 , 0);

    var ambiLight = new THREE.AmbientLight(0x111111);
    scene.add(ambiLight);
    var spotLight = new THREE.DirectionalLight(0xffffff);
    spotLight.position.set(-20, 30, 40);
    spotLight.intensity = 1.5;
    scene.add(spotLight);

    // add the output of the renderer to the html element
    document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);

    render();

    function createMesh () {

        var noise=0;

        geometry = new THREE.PlaneGeometry(params.dimension, params.dimension, (params.segment+1), (params.segment+1));
        //geometry.rotateX( - Math.PI / 2 );

        var index = 0;
        for(var i = 0; i <= params.segment; i++) {
            for(var j = 0; j <= params.segment; j++) {

                var vertex = geometry.vertices[index];
                //vertex.y = 1+terrainn[i][j];

                //vertex.x += Math.random() * 20 - 10;
                //vertex.y += Math.random() * 20 - 10;
                noise = simplex.noise2D(i/params.fact, j/params.fact)*params.mult+params.trasl;

                if (noise<params.barr) 
                    vertex.z=params.level;
                else 
                    vertex.z=noise;

                index++;
            }
        }

        for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {


            var g=Math.floor((Math.random() * (180-120) + 120));
            geometry.faces[ i ].color=new THREE.Color("rgb(0, "+g+", 0)");

        }

        material = new THREE.MeshLambertMaterial( { vertexColors: THREE.FaceColors} );

        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );
    }

    function render() {
        stats.update();

        //sphere.rotation.y=step+=0.01;
        var delta = clock.getDelta();
        orbitControls.update(delta);

        // render using requestAnimationFrame
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);
    }

    function initStats() {

        var stats = new Stats();
        stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.getElementById("Stats-output").appendChild(stats.domElement);

        return stats;
    }
}