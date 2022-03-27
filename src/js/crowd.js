class Sphere {
  /**
   *
   * @param {String} name
   * @param {*} scene
   * @param {String} spawnMeshName
   * @param {BABYLON.Vector3} basicImpulse
   */
  constructor(name, scene, spawnMeshName, basicImpulse) {
    this._name = name;
    this._diameter = 8;
    this._rayon = this._diameter / 2;
    this._scene = scene;
    this.sphere = BABYLON.Mesh.CreateSphere(name, 4, this._diameter, scene);
    // this.sphere.showBoundingBox = true;
    this._spawnSphere = this._scene.getMeshByName(spawnMeshName);
    this._basicImpulse = basicImpulse;
    this.configureSphere();
  }

  configureSphere() {
    // let x =
    //   ((Math.random() * (this._maxX - this._rayon)) %
    //     (this._maxX - this._diameter)) -
    //   (this._maxX / 2 - this._rayon);
    // let z =
    //   ((Math.random() * (this._maxZ - this._rayon)) %
    //     (this._maxZ - this._diameter)) -
    //   (this._maxZ / 2 - this._rayon);
    // let spawnSphere = this._scene.getMeshByName("SpawnSpheres1");
    // this.sphere.position = new BABYLON.Vector3(x, this._y, z);
    this.sphere.position = this._spawnSphere.position.clone();
    // sphere.checkCollisions = true;
    this.sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.sphere,
      BABYLON.PhysicsImpostor.SphereImpostor,
      {
        mass: 3,
        restitution: 0.9,
        gravity: new BABYLON.Vector3(0, -9.81, 0),
      },
      this._scene
    );
    let sphereMaterial = new BABYLON.StandardMaterial(
      `${this._name}Material`,
      this._scene
    );
    sphereMaterial.diffuseColor = new BABYLON.Color3.Random();
    sphereMaterial.emissiveColor = new BABYLON.Color3.Random();
    this.sphere.material = sphereMaterial;
    this.sphere.physicsImpostor.applyImpulse(
        // new BABYLON.Vector3(15, -10, 0),
        this._basicImpulse,
        this.sphere.getAbsolutePosition()
    );
  }

  move() {
    // as move can be called even before the bbox is ready.
    // if (!this.sphere.bounder) return;

    // console.log(`${this._name}`);
    // follow the tank
    let tank = this._scene.getMeshByName("BB_Unit");
    // let's compute the direction vector that goes from Dude to the tank
    let direction = tank.position.subtract(this.sphere.position);
    let distance = direction.length(); // we take the vector that is not normalized, not the dir vector
    let dir = direction.normalize();
    dir.x *= 150;
    dir.z *= 150;
    // console.log(this.sphere.getDirection(this.sphere.position));
    if (distance < 70) {
      this.sphere.physicsImpostor.applyImpulse(
        dir,
        this.sphere.getAbsolutePosition()
      );
    }
  }
}

/**
 *
 * @param i
 * @param scene
 * @param spawnMeshName
 * @param basicImpulse
 * @returns {Sphere}
 */
function generateCrowd(i, scene, spawnMeshName, basicImpulse) {
  let sphere = new Sphere(`sphere${i}`, scene, spawnMeshName, basicImpulse);
  return sphere;
}

export default generateCrowd;
