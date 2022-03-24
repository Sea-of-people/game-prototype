class Sphere {
  constructor(name, scene, maxX, y, maxZ) {
    this._name = name;
    this._maxX = maxX;
    this._y = y;
    this._maxZ = maxZ;
    this._diameter = 10;
    this._rayon = this._diameter / 2;
    this._scene = scene;
    this.sphere = BABYLON.Mesh.CreateSphere(name, 4, this._diameter, scene);
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
}

function generateCrowd(i, scene, maxX, y, maxZ) {
  let sphere = new Sphere(`sphere${i}`, scene, maxX, y, maxZ);
}

export default generateCrowd;
