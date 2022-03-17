import generateCrowd from './crowd.js';

let canvas;
let engine;
let scene;
// vars for handling inputs
let inputStates = {};

window.onload = startGame;


function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();

    const axes = new BABYLON.AxesViewer(scene, 20);
    // modify some default settings (i.e pointer events to prevent cursor to go
    // out of the game window)
    modifySettings();

    let tank = scene.getMeshByName("heroTank");
    let canon = scene.getMeshByName("cylinder");

    engine.runRenderLoop(() => {
        let deltaTime = engine.getDeltaTime(); // remind you something ?

        tank.move();
        canon.move();
        scene.render();
    });
}

function createScene() {
    let scene = new BABYLON.Scene(engine);
    scene.enablePhysics();

    let ground = createGround(scene);
    let freeCamera = createFreeCamera(scene);

    let tank = createTank(scene);
    let canon = createCanon(scene, tank);
    let crowd = generateCrowd(50, scene, 200, 200);

    // second parameter is the target to follow
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
    // wall.physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.PlaneImpostor, { mass: 0 }, scene);
    // wall1.physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.PlaneImpostor, { mass: 0 }, scene);
    // wall2.physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.PlaneImpostor, { mass: 0 }, scene);
    // wall3.physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.PlaneImpostor, { mass: 0 }, scene);
    wall.checkCollisions = true;
    wall1.checkCollisions = true;
    wall2.checkCollisions = true;
    wall3.checkCollisions = true;


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
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
        ground,
        BABYLON.PhysicsImpostor.HeightmapImpostor, {
            mass: 0
        },
        scene
    );
    
    return ground;
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

function createFreeCamera(scene) {
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

function createCanon(scene, tank) {
    var cylinder = BABYLON.Mesh.CreateCylinder("cylinder", 5, 1, 1, 6, 1, scene, false, BABYLON.Mesh.DEFAULTSIDE);
    var box = BABYLON.MeshBuilder.CreateBox("box", {
        height: 1,
        depth: 4,
        width: 4
    }, scene);
    // cylinder.position.y = tank.position.y +1;

    // box.parent = cylinder;
    cylinder.parent = box;
    box.parent = tank;
    box.position.y = tank.position.y + 1;

    let boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
    boxMaterial.diffuseColor = new BABYLON.Color3.Random;
    boxMaterial.emissiveColor = new BABYLON.Color3.Random;
    box.material = boxMaterial;

    let cylinderMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
    cylinderMaterial.diffuseColor = new BABYLON.Color3.Random;
    cylinderMaterial.emissiveColor = new BABYLON.Color3.Random;
    cylinder.material = cylinderMaterial;


    // cylinder.rotation = (new BABYLON.Vector3(120, 5, 0));
    cylinder.position.z = tank.position.z + 2;
    cylinder.rotation.x = Math.PI / 2;
    cylinder.move = () => {
        //tank.position.z += -1; // speed should be in unit/s, and depends on
        // deltaTime !

        // if we want to move while taking into account collision detections
        // collision uses by default "ellipsoids"

        let yMovement = 0;

        if (cylinder.position.y > 2) {
            zMovement = 0;
            yMovement = -2;
        }
        //tank.moveWithCollisions(new BABYLON.Vector3(0, yMovement, zMovement));


        if (inputStates.fireUp) {

        }
        if (inputStates.fireDown) {


        }
        if (inputStates.fireLeft) {
            //tank.moveWithCollisions(new BABYLON.Vector3(-1*tank.speed, 0, 0));
            // cylinder.rotation.y -= 0.01;
            // cylinder.frontVector = new BABYLON.Vector3(Math.sin(cylinder.rotation.y), 0, Math.cos(cylinder.rotation.y));
            box.rotation.y -= 0.01;
            box.frontVector = new BABYLON.Vector3(Math.sin(box.rotation.y), 0, Math.cos(box.rotation.y));
        }
        if (inputStates.fireRight) {
            //tank.moveWithCollisions(new BABYLON.Vector3(1*tank.speed, 0, 0));
            // cylinder.rotation.y += 0.01;
            // cylinder.frontVector = new BABYLON.Vector3(Math.sin(cylinder.rotation.y), 0, Math.cos(cylinder.rotation.y));
            box.rotation.y += 0.01;
            box.frontVector = new BABYLON.Vector3(Math.sin(box.rotation.y), 0, Math.cos(box.rotation.y));
        }
    }
    return cylinder;
}

let zMovement = 5;

function createTank(scene) {
    let tank = new BABYLON.MeshBuilder.CreateBox("heroTank", {
        height: 1,
        depth: 6,
        width: 6
    }, scene);

    let tankMaterial = new BABYLON.StandardMaterial("tankMaterial", scene);
    tankMaterial.diffuseColor = new BABYLON.Color3.Red;
    tankMaterial.emissiveColor = new BABYLON.Color3.Blue;
    tank.material = tankMaterial;

    // By default the box/tank is in 0, 0, 0, let's change that...
    tank.position.y = 0.6;
    tank.speed = 0.4;
    tank.frontVector = new BABYLON.Vector3(0, 0, 1);

    tank.move = () => {
        //tank.position.z += -1; // speed should be in unit/s, and depends on
        // deltaTime !

        // if we want to move while taking into account collision detections
        // collision uses by default "ellipsoids"

        let yMovement = 0;

        if (tank.position.y > 2) {
            zMovement = 0;
            yMovement = -2;
        }
        //tank.moveWithCollisions(new BABYLON.Vector3(0, yMovement, zMovement));


        if (inputStates.up) {
            //tank.moveWithCollisions(new BABYLON.Vector3(0, 0, 1*tank.speed));
            tank.moveWithCollisions(tank.frontVector.multiplyByFloats(tank.speed, tank.speed, tank.speed));
        }
        if (inputStates.down) {
            //tank.moveWithCollisions(new BABYLON.Vector3(0, 0, -1*tank.speed));
            tank.moveWithCollisions(tank.frontVector.multiplyByFloats(-tank.speed, -tank.speed, -tank.speed));

        }
        if (inputStates.left) {
            //tank.moveWithCollisions(new BABYLON.Vector3(-1*tank.speed, 0, 0));
            tank.rotation.y -= 0.02;
            tank.frontVector = new BABYLON.Vector3(Math.sin(tank.rotation.y), 0, Math.cos(tank.rotation.y));
        }
        if (inputStates.right) {
            //tank.moveWithCollisions(new BABYLON.Vector3(1*tank.speed, 0, 0));
            tank.rotation.y += 0.02;
            tank.frontVector = new BABYLON.Vector3(Math.sin(tank.rotation.y), 0, Math.cos(tank.rotation.y));
        }
    }

    return tank;
}

window.addEventListener("resize", () => {
    engine.resize()
});

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

    document.addEventListener("pointerlockchange", () => {
        let element = document.pointerLockElement || null;
        if (element) {
            // lets create a custom attribute
            scene.alreadyLocked = true;
        } else {
            scene.alreadyLocked = false;
        }
    })

    // key listeners for the tank
    inputStates.left = false;
    inputStates.right = false;
    inputStates.up = false;
    inputStates.down = false;
    inputStates.space = false;

    inputStates.fireLeft = false;
    inputStates.fireRight = false;
    inputStates.fireUp = false;
    inputStates.fireDown = false;
    inputStates.fireSpace = false;

    //add the listener to the main, window object, and update the states
    window.addEventListener('keydown', (event) => {
        if ((event.key === "q") || (event.key === "Q")) {
            inputStates.left = true;
        } else if ((event.key === "z") || (event.key === "Z")) {
            inputStates.up = true;
        } else if ((event.key === "d") || (event.key === "D")) {
            inputStates.right = true;
        } else if ((event.key === "s") || (event.key === "S")) {
            inputStates.down = true;
        } else if (event.key === " ") {
            inputStates.space = true;
        }
    }, false);

    window.addEventListener('keyup', (event) => {
        if ((event.key === "q") || (event.key === "Q")) {
            inputStates.left = false;
        } else if ((event.key === "z") || (event.key === "Z")) {
            inputStates.up = false;
        } else if ((event.key === "d") || (event.key === "D")) {
            inputStates.right = false;
        } else if ((event.key === "s") || (event.key === "S")) {
            inputStates.down = false;
        } else if (event.key === " ") {
            inputStates.space = false;
        }
    }, false);

    window.addEventListener('keydown', (event) => {
        if ((event.key === "ArrowLeft")) {
            inputStates.fireLeft = true;
        } else if ((event.key === "ArrowUp")) {
            inputStates.fireUp = true;
        } else if ((event.key === "ArrowRight")) {
            inputStates.fireRight = true;
        } else if ((event.key === "ArrowDown")) {
            inputStates.fireDown = true;
        } else if (event.key === " ") {
            inputStates.fireSpace = true;
        }
    }, false);

    //if the key will be released, change the states object
    window.addEventListener('keyup', (event) => {
        if ((event.key === "ArrowLeft")) {
            inputStates.fireLeft = false;
        } else if ((event.key === "ArrowUp")) {
            inputStates.fireUp = false;
        } else if ((event.key === "ArrowRight")) {
            inputStates.fireRight = false;
        } else if ((event.key === "ArrowDown")) {
            inputStates.fireDown = false;
        } else if (event.key === " ") {
            inputStates.fireSpace = false;
        }
    }, false);
}