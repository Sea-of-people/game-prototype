class Sphere {
  /**
   *
   * @param {String} name
   * @param {*} scene
   * @param {Number} maxX
   * @param {Number} y
   * @param {Number} maxZ
   */
  constructor(name, scene, maxX, y, maxZ) {
    this._name = name;
    this._maxX = maxX;
    this._y = y;
    this._maxZ = maxZ;
    this._diameter = 10;
    this._rayon = this._diameter / 2;
    this._scene = scene;
    this.sphere = BABYLON.Mesh.CreateSphere(name, 4, this._diameter, scene);
    this.sphere.showBoundingBox = true;
    this._speed = 1;
    this.configureSphere();
  }

  configureSphere() {
    let x =
      ((Math.random() * (this._maxX - this._rayon)) %
        (this._maxX - this._diameter)) -
      (this._maxX / 2 - this._rayon);
    let z =
      ((Math.random() * (this._maxZ - this._rayon)) %
        (this._maxZ - this._diameter)) -
      (this._maxZ / 2 - this._rayon);
    this.sphere.position = new BABYLON.Vector3(x, this._y, z);
    // sphere.checkCollisions = true;
    this.sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.sphere,
      BABYLON.PhysicsImpostor.SphereImpostor,
      {
        mass: 1,
        // restitution: 0.9,
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
  }

  move() {
    // as move can be called even before the bbox is ready.
    // if (!this.sphere.bounder) return;

    // console.log(`${this._name}`);
    // follow the tank
    let tank = this._scene.getMeshByName("heroTank");
    // let's compute the direction vector that goes from Dude to the tank
    let direction = tank.position.subtract(this.sphere.position);
    let distance = direction.length(); // we take the vector that is not normalized, not the dir vector
    let dir = direction.normalize();
    dir.x *= 0.2;
    dir.z *= 0.2;
    // console.log(this.sphere.getDirection(this.sphere.position));
    if (distance < 50) {
      this.sphere.physicsImpostor.applyImpulse(
        dir,
        this.sphere.getAbsolutePosition()
      );
    }
  }
}

function generateCrowd(i, scene, maxX, y, maxZ) {
  let sphere = new Sphere(`sphere${i}`, scene, maxX, y, maxZ);
  return sphere;
}

export default generateCrowd;
