import Tank from './tank.js';
import createScene from './scene.js';

let canvas;
let engine;
let scene;

window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene(engine, canvas);
    let tank = new Tank(scene);

    const axes = new BABYLON.AxesViewer(scene, 20);
    // modify some default settings (i.e pointer events to prevent cursor to go
    // out of the game window)
    modifySettings();

    // let tank = scene.getMeshByName("heroTank");
    // let canon = scene.getMeshByName("cylinder");

    engine.runRenderLoop(() => {
        let deltaTime = engine.getDeltaTime(); // remind you something ?

        tank.moveTank();
        tank.moveTurret();
        scene.render();
    });
}

function modifySettings() {
    // as soon as we click on the game window, the mouse pointer is "locked"
    // you will have to press ESC to unlock it
    scene.onPointerDown = () => {
        if (!scene.alreadyLocked) {
            console.log("requesting pointer lock");
            canvas.requestPointerLock();
        } else {
            console.log("Pointer already locked");
        }
    }

    window.addEventListener("resize", () => {
        engine.resize()
    });

    document.addEventListener("pointerlockchange", () => {
        let element = document.pointerLockElement || null;
        if (element) {
            // lets create a custom attribute
            scene.alreadyLocked = true;
        } else {
            scene.alreadyLocked = false;
        }
    })
}