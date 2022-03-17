export default function generateCrowd(count, scene, maxWidth, maxHeight) {

    for (let i = 0; i < count; i++) {

        let plusOrMinus = Math.random() * 195 % 190 - 95;
        let plusOrMinus2 = Math.random() * 195 % 190 - 95;
        // console.log(plusOrMinus);
        // let plusOrMinus2 = Math.random() % 200 + 100;
        let sphere = BABYLON.Mesh.CreateSphere(`sphere${i}`, 4, 10, scene);
        sphere.position = new BABYLON.Vector3(plusOrMinus, 6, plusOrMinus2);
        // sphere.checkCollisions = true;
        sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
            sphere,
            BABYLON.PhysicsImpostor.SphereImpostor, {
                mass: 10,
                restitution: 0.9,
                // gravity: new BABYLON.Vector3(0, -9.81, 0)

            },
            scene
        );
        // sphere.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(1, 0, 1, 0));

        // sphere.position = new BABYLON.Vector3(Math.random() * (maxWidth / 2 - (maxWidth / 2)) + (maxWidth / 2), 2, Math.random() * (maxHeight / 2 - (maxHeight / 2)) + (maxHeight / 2));
        // console.log(sphere.position)
    }
}