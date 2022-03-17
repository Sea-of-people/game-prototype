function generateCrowd(count, scene, maxWidth, maxHeight) {
    for (let i = 0; i < count; i ++) {
        let sphere = BABYLON.Mesh.CreateSphere(
            `sphere${i}`, 4, 2, scene);
        sphere.position = new BABYLON.Vector3(Math.random() * maxWidth, )
    }
}