function createScene(engine, canvas) {
    let scene = new BABYLON.Scene(engine);
    scene.enablePhysics();

    let ground = createGround(scene);
    let walls = createWalls(scene);

    let debugCamera = createDebugCamera(scene, canvas);
    let followCamera = createFollowCamera(scene, ground);
    scene.activeCamera = followCamera;
    scene.collisionsEnabled = true;
    createLights(scene);

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
    let light = new BABYLON.HemisphericLight("dir", new BABYLON.Vector3(-20, 20, 0), scene);
    let light2 = new BABYLON.HemisphericLight("dir2", new BABYLON.Vector3(0, 0, 20), scene);
    let light3 = new BABYLON.HemisphericLight("dir3", new BABYLON.Vector3(20, 20, 0), scene);
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
    camera.keysUp.push('z'.charCodeAt(0));
    camera.keysDown.push('s'.charCodeAt(0));
    camera.keysLeft.push('q'.charCodeAt(0));
    camera.keysRight.push('d'.charCodeAt(0));
    camera.keysUp.push('Z'.charCodeAt(0));
    camera.keysDown.push('S'.charCodeAt(0));
    camera.keysLeft.push('Q'.charCodeAt(0));
    camera.keysRight.push('D'.charCodeAt(0));
    return camera;
}

function createFollowCamera(scene, target) {
    let camera = new BABYLON.FollowCamera("tankFollowCamera", new BABYLON.Vector3(0, 200, -70), scene, target);

    camera.radius = 50; // how far from the object to follow
    camera.heightOffset = 1; // how high above the object to place the camera
    camera.rotationOffset = 180; // the viewing angle
    camera.cameraAcceleration = 0; // how fast to move
    camera.maxCameraSpeed = 0; // speed limit
    // camera.
    camera.position.z -= 40;
    camera.position.y += 50;
    //camera.setTarget(new BABYLON.Vector3(100, 0, 0));
    // camera.setPosition(new BABYLON.Vector3(0, 0, 20));
    return camera;
}

export default createScene;