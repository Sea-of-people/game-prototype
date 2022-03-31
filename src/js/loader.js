/**
 *
 * @param{BABYLON.Scene} scene
 * @param {BABYLON.Engine}engine
 * @returns {BABYLON.AssetsManager}
 */
export default function loadAssets(scene, engine) {
    let assetsManager = new BABYLON.AssetsManager(scene);
    loadTasks(assetsManager, scene);

    assetsManager.onProgress = function (
        remainingCount,
        totalCount,
        lastFinishedTask
    ) {
        engine.loadingUIText =
            "We are loading the scene. " +
            remainingCount +
            " out of " +
            totalCount +
            " items still need to be loaded.";
        console.log(
            "We are loading the scene. " +
            remainingCount +
            " out of " +
            totalCount +
            " items still need to be loaded." + lastFinishedTask.name
        );
    };
    return assetsManager;
}

/**
 *
 * @param {BABYLON.AssetsManager}assetsManager
 * @param {BABYLON.Scene} scene
 */
function loadTasks(assetsManager, scene) {
    var meshTask = assetsManager.addMeshTask(
        "meshesTasks", "", "./models/", "scene_prototype.babylon");
    var bbTask = assetsManager.addMeshTask(
        "bb_unitTask", "", "./models/", "bb-unit.babylon");

    meshTask.onSuccess = function (task) {
        console.log(task.loadedMeshes);
        let glassPanel = scene.getMeshByName("GlassPanel");
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.870, 0.988, 0.984);
        groundMaterial.alpha = 0.2;
        glassPanel.material = groundMaterial;

        let spawnRamp1 = scene.getMeshByName("SpawnRamp1");
        spawnRamp1.visibility = 0;
        let spawnRamp2 = scene.getMeshByName("SpawnRamp2");
        spawnRamp2.visibility = 0;
        let spawnRamp3 = scene.getMeshByName("SpawnRamp3");
        spawnRamp3.visibility = 0;
        let spawnTank = scene.getMeshByName("SpawnTank");
        spawnTank.visibility = 0;
        let trigger = scene.getMeshByName("Trigger1");
        trigger.visibility = 0;

        console.log(task.name + " loaded");

    }
    bbTask.onSuccess = function (task) {
        let meshes = task.loadedMeshes;
        for (let i = 0; i < meshes.length; i++) {
            // avoid rescaling body because of auto rescaling from other meshes
            // meshes[i].visibility = 0;

            if (meshes[i].name === "BB8_Body1" || meshes[i].name === "BB8_Body2") {

            } else {

                meshes[i].scaling = new BABYLON.Vector3(.23, .23, .23);
                meshes[i].rotate(new BABYLON.Vector3(0, 0.5, 0), BABYLON.Tools.ToRadians(180));
            }
        }
        console.log(task.name + " loaded");

    };
}