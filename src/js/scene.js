/**
 *
 * @param{BABYLON.Scene} scene
 */
function createGUI(scene) {
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

    scene.gui = {}
    scene.gui.scoreText = text;
}

function createScene(engine, canvas) {
    let scene = new BABYLON.Scene(engine);

    scene.enablePhysics(
        new BABYLON.Vector3(0, -9.81, 0)
    );

    scene.collisionsEnabled = true;
    createLights(scene);
    let background = new BABYLON.Layer("back", "./assets/background.jpg", scene);
    background.isBackground = true;
    background.texture.level = 0;

    scene.score = 0;
    //createGUI(scene);

    return scene;
}

/**
 *
 * @param{BABYLON.Scene} scene
 */
function createLights(scene) {
    // i.e sun light with all light rays parallels, the vector is the direction.
    let light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(-20, 20, 0), scene);
    let light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 0, 20), scene);
    let light3 = new BABYLON.HemisphericLight("light3", new BABYLON.Vector3(20, 20, 0), scene);
    light.intensity = 0.5;
    light2.intensity = 0.5;
    light3.intensity = 0.5;
    // let light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 1), scene);
}

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
    // prevent camera to cross ground
    camera.checkCollisions = true;
    // avoid flying with the camera
    // camera.applyGravity = true;

    // Add extra keys for camera movements
    // Need the ascii code of the extra key(s). We use a string method here to get the ascii code
    // camera.keysUp.push('z'.charCodeAt(0));
    // camera.keysDown.push('s'.charCodeAt(0));
    // camera.keysLeft.push('q'.charCodeAt(0));
    // camera.keysRight.push('d'.charCodeAt(0));
    // camera.keysUp.push('Z'.charCodeAt(0));
    // camera.keysDown.push('S'.charCodeAt(0));
    // camera.keysLeft.push('Q'.charCodeAt(0));
    // camera.keysRight.push('D'.charCodeAt(0));
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

export {createScene, createGUI, createFollowCamera, createDebugCamera};