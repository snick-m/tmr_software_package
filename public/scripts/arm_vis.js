/* =============================== SCENE SETUP ============================== */

const canvas = document.getElementById("arm_vis"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

const scene = new BABYLON.Scene(engine);

const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 5, new BABYLON.Vector3(0, 0, 0), scene);
camera.attachControl(canvas, true);

const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);


/* ============================= ARM COMPONENTS ============================= */

const gantry = BABYLON.MeshBuilder.CreateBox("gantry", { height: 0.2, width: 1, depth: 0.5 }, scene);
gantry.position.x = 0.5;

const spin = BABYLON.MeshBuilder.CreateCylinder("spin", { height: 0.1, diameter: 0.5 }, scene);
spin.position.x = -0.5;
spin.rotation.z = Math.PI / 2;
spin.parent = gantry;

const shoulder = BABYLON.MeshBuilder.CreateBox("shoulder", { height: 1, width: 0.1, depth: 0.2 }, scene);
shoulder.setPivotPoint(new BABYLON.Vector3(0, -0.5, 0));
shoulder.position.y = 0.5;
shoulder.parent = spin;

const wrist = BABYLON.MeshBuilder.CreateBox("wrist", { height: 0.25, width: 0.1, depth: 0.1 }, scene);
wrist.setPivotPoint(new BABYLON.Vector3(0, -0.125, 0));
wrist.position.y = 0.6125;
wrist.parent = shoulder;

const claw_a = BABYLON.MeshBuilder.CreateBox("claw_a", { height: 0.4, width: 0.05, depth: 0.05 }, scene);
claw_a.setPivotPoint(new BABYLON.Vector3(0, -0.2, 0));
claw_a.position.y = 0.125 + 0.2;
claw_a.rotation.x = Math.PI / 4;
claw_a.parent = wrist;

const claw_b = BABYLON.MeshBuilder.CreateBox("claw_b", { height: 0.4, width: 0.05, depth: 0.05 }, scene);
claw_b.setPivotPoint(new BABYLON.Vector3(0, -0.2, 0));
claw_b.position.y = 0.125 + 0.2;
claw_b.rotation.x = Math.PI / 4;
claw_b.rotation.y = Math.PI;
claw_b.parent = wrist;

var inc_values = {
    "gantry": 0,
    "spin": 0,
    "shoulder": 0,
    "wrist_x": 0,
    "wrist_y": 0,
    "claw": 0
}

setInterval(() => {
    gantry.position.y = clampedIncrement(gantry.position.y, inc_values["gantry"], 0, 2);
    // spin.rotation.y = clampedIncrement(spin.rotation.y, inc_values["spin"], -Math.PI, Math.PI);
    spin.rotate(BABYLON.Axis.Y, inc_values["spin"], BABYLON.Space.LOCAL);
    shoulder.rotation.z = clampedIncrement(shoulder.rotation.z, -inc_values["shoulder"], -Math.PI / 2, Math.PI / 2);
    wrist.rotation.z = clampedIncrement(wrist.rotation.z, inc_values["wrist_x"], -Math.PI / 2, Math.PI / 2);
    wrist.rotation.y = clampedIncrement(wrist.rotation.y, inc_values["wrist_y"], -Math.PI / 2, Math.PI / 2);
    claw_a.rotation.x = clampedIncrement(claw_a.rotation.x, inc_values["claw"], -Math.PI / 2, Math.PI / 2);
    claw_b.rotation.x = clampedIncrement(claw_b.rotation.x, inc_values["claw"], -Math.PI / 2, Math.PI / 2);
}, 1000 / 30);

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});

function clampedIncrement(variable, increment, min, max) {
    variable = Math.min(Math.max(variable + increment, min), max);
    return variable;
}