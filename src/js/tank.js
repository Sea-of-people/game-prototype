class Tank {
    /**
     *
     * @param {BABYLON.Scene} scene
     */
    constructor(scene) {
        this.scene = scene;
        this.inputStates = {};
        this.skills = {
            "pushAway": false,
            "attract": false
        }
        this.createTank();
        this.createBounder();
        this.tankEvent();
        this.bounder.tankMesh = this.tank;
    }

    createTank() {
        this.tank = this.scene.getMeshByName("BB_Unit");

        this.scene.sphereList = [];

        let spawnTank = this.scene.getMeshByName("SpawnTank");
        console.log(spawnTank.position);
        this.tank.position = spawnTank.position.clone();
        this.tank.position.y -= .2;
        this.tank.speed = 0.4;
        this.tank.frontVector = new BABYLON.Vector3(0, 0, 1);
    }

    createBounder() {
        const bounderOptions = {
            diameter: 7,
            segments: 30
        };

        this.bounder = new BABYLON.MeshBuilder.CreateSphere("bounderTank", bounderOptions, this.scene);
        let bounderMaterial = new BABYLON.StandardMaterial("bounderTankMaterial", this.scene);

        this.bounder.position = this.tank.position.clone();
        this.bounder.visibility = false;
        this.bounder.checkCollisions = true;

        this.bounder.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.bounder,
            BABYLON.PhysicsImpostor.SphereImpostor, {
                mass: 150,
                friction: .2,
                restitution: .6
            },
            this.scene
        );

        this.bounder.frontVector = new BABYLON.Vector3(0, 0, 1);
        // return bounder;
    }

    skillAttract() {
        if (!this.skills["attract"] && this.inputStates.space) {
            console.log("attract");

            this.skills["attract"] = true;
            setTimeout(() => {
                this.skills["attract"] = false;
            }, 2000);
            for (let i = 0; i < this.scene.sphereList.length; i++) {
                let sphere = this.scene.sphereList[i];
                sphere.attract();
            }
        }
    }

    skillPushAway() {
        if (!this.skills["pushAway"] && this.inputStates.shift) {
            this.skills["pushAway"] = true;
            setTimeout(() => {
                this.skills["pushAway"] = false;
            }, 2000);
            for (let i = 0; i < this.scene.sphereList.length; i++) {
                let sphere = this.scene.sphereList[i];
                sphere.pushAway();
            }
        }
    }

    activateEvents() {
        this.moveTank();
        this.skillAttract();
        this.skillPushAway();
    }

    moveTank() {
        if (!this.bounder) return;

        this.tank.position = this.bounder.position.clone();
        this.tank.rotation = this.bounder.rotation.clone();

        this.xMovement = 0;
        this.yMovement = 0;
        this.zMovement = 0;

        if (this.bounder.position.y > 2) {
            this.zMovement = 0;
            this.yMovement = -2;
        }
        if (this.inputStates.up) {
            this.bounder.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(
                this.bounder.physicsImpostor.getLinearVelocity().x + Math.sin(this.bounder.rotation.y),
                this.bounder.physicsImpostor.getLinearVelocity().y,
                this.bounder.physicsImpostor.getLinearVelocity().z + Math.cos(this.bounder.rotation.y)));
        }
        if (this.inputStates.down) {
            this.bounder.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(
                this.bounder.physicsImpostor.getLinearVelocity().x - Math.sin(this.bounder.rotation.y),
                this.bounder.physicsImpostor.getLinearVelocity().y,
                this.bounder.physicsImpostor.getLinearVelocity().z - Math.cos(this.bounder.rotation.y)));
        }
        if (this.inputStates.left) {
            this.bounder.rotation.y -= 0.02;
            this.bounder.frontVector = new BABYLON.Vector3(Math.sin(this.bounder.rotation.y), 0, Math.cos(this.bounder.rotation.y));
        }
        if (this.inputStates.right) {
            this.bounder.rotation.y += 0.02;
            this.bounder.frontVector = new BABYLON.Vector3(Math.sin(this.bounder.rotation.y), 0, Math.cos(this.bounder.rotation.y));
        }
    }

    tankEvent() {
        this.inputStates.left = false;
        this.inputStates.right = false;
        this.inputStates.up = false;
        this.inputStates.down = false;
        this.inputStates.space = false;
        this.inputStates.shift = false;

        window.addEventListener('keydown', (event) => {
            if ((event.key === "q") || (event.key === "Q")) {
                this.inputStates.left = true;
            } else if ((event.key === "z") || (event.key === "Z")) {
                this.inputStates.up = true;
            } else if ((event.key === "d") || (event.key === "D")) {
                this.inputStates.right = true;
            } else if ((event.key === "s") || (event.key === "S")) {
                this.inputStates.down = true;
            } else if (event.key === " ") {
                this.inputStates.space = true;
            } else if (event.key === "Shift") {
                this.inputStates.shift = true;
            }
        }, false);

        window.addEventListener('keyup', (event) => {
            if ((event.key === "q") || (event.key === "Q")) {
                this.inputStates.left = false;
            } else if ((event.key === "z") || (event.key === "Z")) {
                this.inputStates.up = false;
            } else if ((event.key === "d") || (event.key === "D")) {
                this.inputStates.right = false;
            } else if ((event.key === "s") || (event.key === "S")) {
                this.inputStates.down = false;
            } else if (event.key === " ") {
                this.inputStates.space = false;
            } else if (event.key === "Shift") {
                this.inputStates.shift = false;
            }
        }, false);

       
    }

}

export default Tank;