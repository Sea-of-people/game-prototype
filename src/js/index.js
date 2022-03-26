import Tank from "./tank.js";
import createScene from "./scene.js";
import generateCrowd from "./crowd.js";

let canvas;
let engine;
let scene;

const maxCrowd = 30;
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
    let isGenerating = true;
    var assetsManager = new BABYLON.AssetsManager(scene);
    var meshTask = assetsManager.addMeshTask(
        "meshesTasks", "meshes", "models/", "scene_prototype.babylon");
    meshTask.onSuccess = function (task) {
        let glassPanel = task.loadedMeshes[0];
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.870, 0.988, 0.984);
        groundMaterial.alpha = 0.4;
        glassPanel.material = groundMaterial;
    }
    BABYLON.SceneLoader.ImportMesh("", "./models/",
        "scene_prototype.babylon", scene, (meshes) => {
            console.log('meshes', meshes);

            let glassPanel = meshes[0];
            const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
            groundMaterial.diffuseColor = new BABYLON.Color3(0.870, 0.988, 0.984);
            groundMaterial.alpha = 0.4;
            glassPanel.material = groundMaterial;
        },
        (remainingCount, totalCount, lastFinishedTask) => {
            engine.loadingUIText = 'We are loading the scene. ' + remainingCount + ' out of ' + totalCount + ' items still need to be loaded.';
        });
    assetsManager.onFinish = function (tasks) {
        engine.runRenderLoop(() => {
            if (isGenerating && scene.sphereList.length < maxCrowd) {
                scene.sphereList.push(generateCrowd(scene.sphereList.length, scene, 200, 50, 200));
                isGenerating = false;
                setTimeout(() => {
                    isGenerating = true;
                }, 2000);
            }
            let deltaTime = engine.getDeltaTime(); // remind you something ?
            tank.moveTank();

            for (let i = 0; i < scene.sphereList.length; i++) {
                let sphere = scene.sphereList[i];
                sphere.move();
            }
            scene.render();
        });
    }
    assetsManager.onTaskSuccessObservable.add(function (task) {
        console.log('task successful', task)
    });
    assetsManager.load();

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
    };

    window.addEventListener("resize", () => {
        engine.resize();
    });

    document.addEventListener("pointerlockchange", () => {
        let element = document.pointerLockElement || null;
        if (element) {
            // lets create a custom attribute
            scene.alreadyLocked = true;
        } else {
            scene.alreadyLocked = false;
        }
    });
}
