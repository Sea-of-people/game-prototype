/**
 *
 * @param{BABYLON.Scene} scene
 */

class Scene extends BABYLON.Scene {
    score = 0;
    background = new BABYLON.Layer("back", "./assets/background.jpg", this);

    constructor(engine) {
        super(engine);

        this.enablePhysics(
            new BABYLON.Vector3(0, -9.81, 0)
        );

        this.collisionsEnabled = true;
        this.createLights();
        this.createGUI();
        this.background.isBackground = true;
        this.background.texture.level = 0;


    }

    createLights() {
        this.light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(-20, 20, 0), this);
        this.light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 0, 20), this);
        this.light3 = new BABYLON.HemisphericLight("light3", new BABYLON.Vector3(20, 20, 0), this);
        this.light.intensity = 0.5;
        this.light2.intensity = 0.5;
        this.light3.intensity = 0.5;
    }

    createGUI() {
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
            "myUI"
        );
        let createRectangle = function () {
            let rect1 = new BABYLON.GUI.Rectangle();
            rect1.width = 0.2;
            rect1.height = "40px";
            rect1.cornerRadius = 20;
            rect1.color = "Orange";
            rect1.thickness = 4;
            rect1.background = "green";
            advancedTexture.addControl(rect1);
            return rect1;
        }
        let rect = createRectangle();

        let createRectangleHelp = function () {
            let rect1 = new BABYLON.GUI.Rectangle();
            rect1.width = 0.5;
            rect1.height = "40px";
            rect1.cornerRadius = 20;
            rect1.color = "Orange";
            rect1.thickness = 4;
            rect1.background = "green";
            advancedTexture.addControl(rect1);
            return rect1;
        }

        let rectHelp = createRectangleHelp();

        let text = new BABYLON.GUI.TextBlock();
        text.baseText = "Score: ";
        text.text = "Score: 0";
        text.color = "white";
        text.fontSize = 24;
        rect.addControl(text);

        let textHelp = new BABYLON.GUI.TextBlock();
        textHelp.text = "Move: ZQSD | Attraction: SpaceBar | Repulsion: Shift";
        textHelp.color = "white";
        textHelp.fontSize = 24;
        rectHelp.addControl(textHelp);

        rectHelp.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        rectHelp.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

        rect.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        rect.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

        this.gui = {}
        this.gui.scoreText = text;
    }
}



/**
 *
 * @param{BABYLON.Scene} scene
 */

/**
 *
 * @param{BABYLON.Scene} scene
 * @param {HTMLElement}canvas
 * @returns {BABYLON.FreeCamera}
 */
function createDebugCamera(scene, canvas) {
    let camera = new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(-5, 250, -40), scene);
    camera.attachControl(canvas);
    camera.cameraDirection.z = Math.PI / 4;

    camera.checkCollisions = true;
    return camera;
}

/**
 *
 * @param{BABYLON.Scene} scene
 * @param {BABYLON.AbstractMesh}target
 * @returns {BABYLON.FollowCamera}
 */
function createFollowCamera(scene, target) {

    let camera = new BABYLON.FollowCamera("tankFollowCamera", target.position, scene, target);

    camera.radius = 150; // how far from the object to follow
    camera.heightOffset = 180; // how high above the object to place the camera

    camera.rotationOffset = 90; // the viewing angle
    camera.cameraAcceleration = 0.1; // how fast to move
    camera.maxCameraSpeed = 1; // speed limit

    return camera;
}

export {createFollowCamera, createDebugCamera, Scene};