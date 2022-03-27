function createScene(engine, canvas) {
    let scene = new BABYLON.Scene(engine);
    scene.enablePhysics(
        new BABYLON.Vector3(0, -9.81, 0)
    );

    // let ground = createGround(scene);
    // let walls = createWalls(scene);


    scene.collisionsEnabled = true;
    createLights(scene);
    var background = new BABYLON.Layer("back", "./assets/background.jpg", scene);
    background.isBackground = true;
    background.texture.level = 0;

    scene.score = 0;

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
        "myUI"
    );
    var createRectangle = function() {
        var rect1 = new BABYLON.GUI.Rectangle();
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

    var createRectangleHelp = function() {
        var rect1 = new BABYLON.GUI.Rectangle();
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
    textHelp.text =  "Move: ZQSD | Attraction: SpaceBar | Repulsion: Shift";
    textHelp.color = "white";
    textHelp.fontSize = 24;
    rectHelp.addControl(textHelp);

    rectHelp.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    rectHelp.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

    rect.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    rect.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

    scene.gui = {}
    scene.gui.scoreText = text;

    // text1.advancedTexture.addControl(text1);

    return scene;
}

function createGround(scene) {
    const groundOptions = {
        width: 200,
        height: 200,
        subdivisions: 20
    };
    //scene is optional and defaults to the current scene
    const ground = BABYLON.MeshBuilder.CreateGround("ground", groundOptions, scene);
    //const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", 'images/hmap1.png', groundOptions, scene);

    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.878, 0.858, 0.745);
    //groundMaterial.diffuseTexture = new BABYLON.Texture("images/grass.jpg");
    ground.material = groundMaterial;
    // to be taken into account by collision detection
    ground.checkCollisions = true;
    //groundMaterial.wireframe=true;

    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
        ground,
        BABYLON.PhysicsImpostor.HeightmapImpostor, {
            mass: 0,
            friction: 5,
            restitution: 0.5
        },
        scene
    );

    return ground;
}

function createWalls(scene) {

    const wallOptions = {
        width: 200,
        height: 20,
        subdivision: 20
    }
    const wallMaterial = new BABYLON.StandardMaterial("wallMaterial", scene, wallOptions);
    wallMaterial.diffuseColor = new BABYLON.Color3(0.717, 0.521, 0.521);
    wallMaterial.backFaceCulling = false;


    const wall = BABYLON.MeshBuilder.CreatePlane("wall", wallOptions, scene);
    const wall1 = BABYLON.MeshBuilder.CreatePlane("wall1", wallOptions, scene);
    const wall2 = BABYLON.MeshBuilder.CreatePlane("wall2", wallOptions, scene);
    const wall3 = BABYLON.MeshBuilder.CreatePlane("wall3", wallOptions, scene);

    wall.material = wallMaterial;
    wall1.material = wallMaterial;
    wall2.material = wallMaterial;
    wall3.material = wallMaterial;

    wall.position = new BABYLON.Vector3(0, 10, 100);
    wall1.position = new BABYLON.Vector3(0, 10, -100);
    wall2.position = new BABYLON.Vector3(-100, 10, 0);
    wall3.position = new BABYLON.Vector3(100, 10, 0);

    wall2.rotation.y = Math.PI / 2;
    wall3.rotation.y = Math.PI / 2;

    wall.physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.1}, scene);
    wall1.physicsImpostor = new BABYLON.PhysicsImpostor(wall1, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 , restitution: 0.1}, scene);
    wall2.physicsImpostor = new BABYLON.PhysicsImpostor(wall2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 , restitution: 0.1}, scene);
    wall3.physicsImpostor = new BABYLON.PhysicsImpostor(wall3, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 , restitution: 0.1}, scene);

    return {wall, wall1, wall2, wall3};
}

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

function createFollowCamera(scene, target) {

    let camera = new BABYLON.FollowCamera("tankFollowCamera", target.position, scene, target);

    camera.radius = 150; // how far from the object to follow
    camera.heightOffset = 180; // how high above the object to place the camera

    camera.rotationOffset = 90; // the viewing angle
    camera.cameraAcceleration = 0.1; // how fast to move
    camera.maxCameraSpeed = 1; // speed limit

    return camera;
}

export { createScene, createFollowCamera, createDebugCamera };