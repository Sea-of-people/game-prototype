import Tank from "./tank.js";
import {createScene, createFollowCamera, createDebugCamera} from "./scene.js";
import generateCrowd from "./crowd.js";

let canvas;
let engine;
let scene;
let tank;

const maxCrowd = 30;

window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene(engine, canvas);

    scene.gameOver = false;
    const axes = new BABYLON.AxesViewer(scene, 20);
    // modify some default settings (i.e pointer events to prevent cursor to go
    // out of the game window)
    modifySettings();

    // let tank = scene.getMeshByName("heroTank");
    // let canon = scene.getMeshByName("cylinder");
    scene.isGenerating = true;
    var assetsManager = new BABYLON.AssetsManager(scene);
    var meshTask = assetsManager.addMeshTask(
        "meshesTasks", "", "./models/", "scene_prototype.babylon");
    var bbTask = assetsManager.addMeshTask(
        "bb_unitTask", "", "./models/", "bb-unit.babylon");

    meshTask.onSuccess = function (task) {
        console.log(task.loadedMeshes);
        let glassPanel = scene.getMeshByName("GlassPanel");
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.870, 0.988, 0.984);
        groundMaterial.alpha = 0.2;
        glassPanel.material = groundMaterial;

        let spawnRamp1 = scene.getMeshByName("SpawnRamp1");
        spawnRamp1.visibility = 0;
        let spawnRamp2 = scene.getMeshByName("SpawnRamp2");
        spawnRamp2.visibility = 0;
        let spawnRamp3 = scene.getMeshByName("SpawnRamp3");
        spawnRamp3.visibility = 0;
        let spawnTank = scene.getMeshByName("SpawnTank");
        spawnTank.visibility = 0;
        let trigger = scene.getMeshByName("Trigger1");
        trigger.visibility = 0;

        console.log(task.name + " loaded");

    }
    bbTask.onSuccess = function (task) {
        let meshes = task.loadedMeshes;
        for (let i = 0; i < meshes.length; i++) {
            // meshes[0].scaling = new BABYLON.Vector3(.3, .3, .25);
            if (meshes[i].name === "BB8_Body1" || meshes[i].name === "BB8_Body2") {

            } else {

                meshes[i].scaling = new BABYLON.Vector3(.23, .23, .23);
                meshes[i].rotate(new BABYLON.Vector3(0, 0.5, 0), BABYLON.Tools.ToRadians(180));
            }
        }
        console.log(task.name + " loaded");

    };

    assetsManager.onProgress = function (
        remainingCount,
        totalCount,
        lastFinishedTask
    ) {
        engine.loadingUIText =
            "We are loading the scene. " +
            remainingCount +
            " out of " +
            totalCount +
            " items still need to be loaded.";
        console.log(
            "We are loading the scene. " +
            remainingCount +
            " out of " +
            totalCount +
            " items still need to be loaded." + lastFinishedTask.name
        );
    };

    // scene.executeWhenReady(() => {
    // let tank = new Tank(scene);

    assetsManager.onFinish = function (tasks) {
        tank = new Tank(scene);
        let debugCamera = createDebugCamera(scene, canvas);
        let followCamera = createFollowCamera(scene, scene.getMeshByName("BB8_Body2"));
        scene.activeCamera = followCamera;
        // scene.activeCamera = debugCamera;



        let trigger = scene.getMeshByName("Trigger1");
        setTriggerProperties(trigger);

        console.log("Starting game...");
        engine.runRenderLoop(() => {
            // if (scene.gameOver) {
            //     scene.gameOver = false;
            //     console.log("GAME OVER !")
            //     scene = createScene();
            // }
            scene.gui.scoreText.text = scene.gui.scoreText.baseText + scene.score;
            if (scene.isGenerating && scene.sphereList.length < maxCrowd) {
                scene.sphereList.push(
                    generateCrowd(
                        scene.sphereList.length,
                        scene,
                        "SpawnRamp1",
                        new BABYLON.Vector3(20, -15, 0)));
                scene.sphereList.push(
                    generateCrowd(scene.sphereList.length,
                        scene, "SpawnRamp2",
                        new BABYLON.Vector3(0, -15, 20)));
                scene.sphereList.push(
                    generateCrowd(scene.sphereList.length,
                        scene, "SpawnRamp3",
                        new BABYLON.Vector3(0, -15, -20)));
                scene.isGenerating = false;
                setTimeout(() => {
                    scene.isGenerating = true;
                }, 2000);
            }
            let deltaTime = engine.getDeltaTime(); // remind you something ?

            tank.activateEvents();
            scene.render();
        });
    };

    assetsManager.load();
}

function setTriggerProperties(trigger) {
    trigger.actionManager = new BABYLON.ActionManager(scene);
    trigger.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
            {
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: {
                    mesh: tank.bounder,
                    usePreciseIntersection: true
                }
            },
            () => {
                scene.sphereList.forEach(sphere => {
                    sphere.disposeSelfGameOver();
                })
                scene.sphereList = [];
                scene.isGenerating = true;
                scene.score = 0;
                let spawnTank = scene.getMeshByName("SpawnTank");
                tank.bounder.position = spawnTank.position.clone();
                tank.bounder.position.y -= .2;
                tank.bounder.speed = 0.4;
                tank.bounder.frontVector = new BABYLON.Vector3(0, 0, 1);
                tank.bounder.physicsImpostor.setAngularVelocity(new BABYLON.Vector3.Zero());
                tank.bounder.physicsImpostor.setLinearVelocity(new BABYLON.Vector3.Zero());
            }
        )
    );
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
