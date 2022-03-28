import Tank from "./tank.js";
import {createFollowCamera, createScene, createGUI} from "./scene.js";
import generateCrowd from "./crowd.js";
import loadAssets from "./loader.js";

let canvas;
let engine;
let scene;
let tank;

const MAX_SPAWN = 30;

window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene(engine, canvas);

    scene.gameOver = false;

    modifySettings();

    scene.isGenerating = true;
    let assetsManager = loadAssets(scene, engine);


    assetsManager.onFinish = function (tasks) {
        // let debugCamera = createDebugCamera(scene, canvas);
        let camera = createFollowCamera(scene, scene.getMeshByName("BB8_Body2"));
        scene.activeCamera = camera;
        createGUI(scene);
        // scene.activeCamera = debugCamera;
        tank = new Tank(scene);
        let trigger = scene.getMeshByName("Trigger1");
        setTriggerProperties(trigger);

        console.log("Starting game...");
        scene.executeWhenReady(
            () => engine.runRenderLoop(() => {
            scene.gui.scoreText.text = scene.gui.scoreText.baseText + scene.score;
            if (scene.isGenerating && scene.sphereList.length < MAX_SPAWN) {
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
            // let deltaTime = engine.getDeltaTime();

            tank.activateEvents();
            scene.render();
        }));
    };

    assetsManager.load();
}

/**
 *
 * @param{BABYLON.AbstractMesh} trigger
 */
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
        scene.alreadyLocked = !!element;
    });
}
