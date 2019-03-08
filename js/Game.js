// Une fois tous les fichiers du jeu chargés, on lance le jeu
document.addEventListener("DOMContentLoaded", function () 
{
    new Game('renderCanvas');
}, false);

//On définit l'objet Game dans lequel on va pouvoir faire appel à ses méthodes définies dans son prototype
//ainsi que des fonctions extérieures à Game
Game = function(canvasId) 
{
    // On définit notre canvas et engine ici
    // Rappel: var truc définit une variable locale
    // et this.truc définit un attribut de l'objet 
    var canvas = document.getElementById(canvasId);
    var engine = new BABYLON.Engine(canvas, true);
    this.engine = engine;

    // on crée la variable _this pour utiliser notre objet dans notre boucle de rendu
    // et dans notre addEventListener, bref les méthodes d'objets n'appartenant pas à Game
    var _this = this;

    // On initie la scène avec le moteur Babylon
    this.scene = this._initScene(engine);

    //On crée nos objets player et arena
    var _player = new Player(this, canvas); //this est l'objet Game
    var _arena = new Arena(this);

    /* à décommenter si vous êtes dans Weapon.js
    // Les roquettes générées dans Player.js
    this._rockets = [];
    // Les explosions qui découlent des roquettes
    this._explosionRadius = [];
    */


    // Enregistre et exécute une boucle de rendu : Va lancer les fonctions à chaque frame
    engine.runRenderLoop(function () 
    {
        // On récupère les fps
        _this.fps = Math.round(1000/engine.getDeltaTime()); //getDeltaTime() nous donne le temps en ms entre chaque frame

        // On checke le mouvement du joueur en lui envoyant le ratio de fps
        _player._checkMove((_this.fps)/60);

        //On anime notre arène en lui envoyant le ratio de fps
        _arena._animateWorld((_this.fps)/60);

        //On affiche le rendu de la scène
        _this.scene.render();

        /*à décommenter si vous êtes dans Weapon.js
        // Si launchBullets est a true, on tire
        if(_player.camera.weapons.launchBullets === true){
            _player.camera.weapons.launchFire(_arena);
        }
        */
    });

    // Ajuste la vue 3D si la fenetre est agrandie ou diminuée
    window.addEventListener("resize", function () 
    {
        if (engine) 
        {
            engine.resize();
        }
    },false);
};


Game.prototype = { //On définit les méthodes de notre objet dans son prototype (question de lisibilité du code)
    
    //Initialisation de la scène
    _initScene : function(engine) 
    {
        //On crée une scène avec le moteur Babylon
        var scene = new BABYLON.Scene(engine);
        //On définit la couleur d'effacement du frame buffer dans scene
        scene.clearColor = new BABYLON.Color4(0.5, 0, 0, 1);

        //On autorise les collisions dans notre scène
        scene.collisionsEnabled = true;
        // Physique
        scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        //On renvoie la scène créée
        return scene;
    }
};

// ------------------------- TRANSFO DE DEGRES/RADIANS 
function degToRad(deg)
{
   return (Math.PI*deg)/180
}
// ----------------------------------------------------

// -------------------------- TRANSFO DE DEGRES/RADIANS 
function radToDeg(rad)
{
   return (rad*180)/Math.PI
}
// ----------------------------------------------------