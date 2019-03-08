Arena = function(game) //on créée notre objet Arena qui prend l'objet game en argument
{
    // VARIABLES UTILES
    this.game = game;
    var scene = game.scene;

    // SOL

    var ground = BABYLON.Mesh.CreateGround("ground1", 1000, 1000, 2, scene);
    ground.position.y = -5;
    ground.checkCollisions = true;
    ground.isPickable = true;

    var matSol = new BABYLON.StandardMaterial("matSol", scene);
    matSol.diffuseColor = new BABYLON.Color3(0.5, 1, 0.5);
    matSol.specularColor = new BABYLON.Color3(0.1, 0.6, 0.1);

    ground.material = matSol;

    // LUMIERES

    /*var light1 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 0, 10), scene);
    light1.intensity = 0.25;
    light1.diffuse = new BABYLON.Color3(0, 1, 1);

    var light2 = new BABYLON.SpotLight("Spot0", new BABYLON.Vector3(0, 100, 0), new BABYLON.Vector3(0, -1, 0), 0.8, 2, scene);
    light2.diffuse = new BABYLON.Color3(1, 0, 1);
    light2.specular = new BABYLON.Color3(1, 0, 1);
    light2.intensity = 0;*/

    var light3 = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(1, -1, -1), scene);
    light3.diffuse = new BABYLON.Color3(1, 1, 1);
    light3.specular = new BABYLON.Color3(1, 1, 1);


    // MATERIAUX ET TEXTURES

    // Normal map
    var ironNormalMap = new BABYLON.StandardMaterial("ironNormalMap", scene);
    ironNormalMap.bumpTexture = new BABYLON.Texture("assets/normalMap.jpg", scene);

    // VideoTexture
    var matVideo = new BABYLON.StandardMaterial("mat", scene);
    var videoTexture = new BABYLON.VideoTexture("video", ["assets/vtexture.mp4", "assets/vtexture.webm"], scene, true, true);
    matVideo.diffuseTexture = videoTexture;

    // Texture procédurale
    var matProcedural = new BABYLON.StandardMaterial("material", scene);
    var texture = new BABYLON.WoodProceduralTexture("texture", 1024, scene);
    matProcedural.diffuseTexture = texture;

    //  Multi-matériau
    var material0 = new BABYLON.StandardMaterial("mat0", scene);
    material0.diffuseColor = new BABYLON.Color3(1, 0, 0);

    var material1 = new BABYLON.StandardMaterial("mat1", scene);
    material1.diffuseColor = new BABYLON.Color3(0, 0, 1);

    var material2 = new BABYLON.StandardMaterial("mat2", scene);
    material2.emissiveColor = new BABYLON.Color3(0.4, 0, 0.4);

    var multimat = new BABYLON.MultiMaterial("multi", scene);
    multimat.subMaterials.push(material0);
    multimat.subMaterials.push(material1);
    multimat.subMaterials.push(material2);


    //MESHS ET COLLISIONS

    // Boxes
    var plat1 = new BABYLON.MeshBuilder.CreateBox("plat1", {height: 2, width: 30, depth: 30}, scene);
    plat1.position.y = 5;
    plat1.material = ironNormalMap;
    plat1.checkCollisions = true;

    var plat2 = new BABYLON.MeshBuilder.CreateBox("plat2", {height: 2, width: 30, depth: 30}, scene);
    plat2.position.y = 20;
    plat2.position.x = 40;
    plat2.material = ironNormalMap;
    plat2.checkCollisions = true;

    var plat3 = BABYLON.MeshBuilder.CreateBox("plat3", {height: 2, width: 30, depth: 30}, scene);
    plat3.position.y = 35;
    plat3.position.x = 40;
    plat3.position.z = 70;
    plat3.material = matProcedural;
    plat3.checkCollisions = true;

    // Sphere
    var sphere = new BABYLON.Mesh.CreateSphere("sphere", 16, 10, scene);
    sphere.checkCollisions = true;
    sphere.position.y = 30;
    sphere.position.z = 30;
    sphere.material = matVideo;

    // Cylindre
    var cylindre = new BABYLON.Mesh.CreateCylinder("cylindre", 150, 1, 20, 32, 1, scene, false);
    cylindre.checkCollisions = true;
    cylindre.position.y = 70;
    cylindre.position.x = 50;
    cylindre.position.z = -50;
    cylindre.material = multimat;

    cylindre.subMeshes = [];
    var verticesCount = cylindre.getTotalVertices();

    new BABYLON.SubMesh(0, 0, verticesCount, 0, 90, cylindre);
    new BABYLON.SubMesh(1, 0, verticesCount, 90, 120, cylindre);
    new BABYLON.SubMesh(2, 0, verticesCount, 120, 208, cylindre);

    // Tore
    var torus = BABYLON.Mesh.CreateTorus("torus", 15, 3, 32, scene, false);
    torus.checkCollisions = true;
    torus.position.y = 100;
    torus.position.x = 50;
    torus.position.z = -50;

    // ANIMATION

    var animationBox = new BABYLON.Animation("myAnimation", "position.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    var keys = []; 

    keys.push({
        frame: 0,
        value: 30
    });

    keys.push({
        frame: 20,
        value: 50
    });

    keys.push({
        frame: 100,
        value: 30
    });

    animationBox.setKeys(keys);

    plat3.animations = [];
    plat3.animations.push(animationBox);

    scene.beginAnimation(plat3, 0, 100, true);

    //AUDIO

    var birds = new BABYLON.Sound("birds", "assets/sounds/birds.mp3", this.game.scene, null, { loop: true, autoplay: true });

    //SKYBOX

    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox_snow/snow", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

};

Arena.prototype={

    //ANIMATION
    _animateWorld : function(ratioFps)
    {
      // Animation des plateformes (translation, rotation, redimensionnement ...)
      
    },
}