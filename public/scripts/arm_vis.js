/* =============================== SCENE SETUP ============================== */

const canvas = document.getElementById("arm_vis"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

const scene = new BABYLON.Scene(engine);

const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.75, 5, new BABYLON.Vector3(-0.5, -0.75, 0), scene);
camera.attachControl(canvas, true);
camera.wheelPrecision = 50;

const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);


/* ============================= ARM COMPONENTS ============================= */

const gantry = BABYLON.MeshBuilder.CreateBox("gantry", { height: 0.2, width: 1, depth: 0.5 }, scene);
gantry.position.x = -0.5;

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

/* ============================ WHEEL COMPONENTS ============================ */

const WD = 0.35; // Wheel Diameter
const wheel_y_offset = -1;

const left_wheel_1 = BABYLON.MeshBuilder.CreateBox("left_wheel_1", { height: WD, width: WD, depth: 0.1 }, scene);
left_wheel_1.position.x = -0.75;
left_wheel_1.position.y = wheel_y_offset;
left_wheel_1.position.z = -0.75;
left_wheel_1.rotation.z = Math.PI / 2;

const left_wheel_2 = BABYLON.MeshBuilder.CreateBox("left_wheel_2", { height: WD, width: WD, depth: 0.1 }, scene);
left_wheel_2.position.x = 0;
left_wheel_2.position.y = wheel_y_offset;
left_wheel_2.position.z = -0.75;
left_wheel_2.rotation.z = Math.PI / 2;

const left_wheel_3 = BABYLON.MeshBuilder.CreateBox("left_wheel_3", { height: WD, width: WD, depth: 0.1 }, scene);
left_wheel_3.position.x = 0.75;
left_wheel_3.position.y = wheel_y_offset;
left_wheel_3.position.z = -0.75;
left_wheel_3.rotation.z = Math.PI / 2;

const right_wheel_1 = BABYLON.MeshBuilder.CreateBox("right_wheel_1", { height: WD, width: WD, depth: 0.1 }, scene);
right_wheel_1.position.x = -0.75;
right_wheel_1.position.y = wheel_y_offset;
right_wheel_1.position.z = 0.75;
right_wheel_1.rotation.z = Math.PI / 2;

const right_wheel_2 = BABYLON.MeshBuilder.CreateBox("right_wheel_2", { height: WD, width: WD, depth: 0.1 }, scene);
right_wheel_2.position.x = 0;
right_wheel_2.position.y = wheel_y_offset;
right_wheel_2.position.z = 0.75;
right_wheel_2.rotation.z = Math.PI / 2;

const right_wheel_3 = BABYLON.MeshBuilder.CreateBox("right_wheel_3", { height: WD, width: WD, depth: 0.1 }, scene);
right_wheel_3.position.x = 0.75;
right_wheel_3.position.y = wheel_y_offset;
right_wheel_3.position.z = 0.75;
right_wheel_3.rotation.z = Math.PI / 2;

var arm_inc_values = {
    "gantry": 0,
    "spin": 0,
    "shoulder": 0,
    "wrist_x": 0,
    "wrist_y": 0,
    "claw": 0,
};

var wheel_inc_values = {
    "left_wheel_1": 0,
    "left_wheel_2": 0,
    "left_wheel_3": 0,
    "right_wheel_1": 0,
    "right_wheel_2": 0,
    "right_wheel_3": 0
}

setInterval(() => { // Update the visualization
    gantry.position.y = clampedIncrement(gantry.position.y, arm_inc_values["gantry"], 0, 2);
    // spin.rotation.y = clampedIncrement(spin.rotation.y, arm_inc_values["spin"], -Math.PI, Math.PI);
    spin.rotate(BABYLON.Axis.Y, arm_inc_values["spin"], BABYLON.Space.LOCAL);
    shoulder.rotation.z = clampedIncrement(shoulder.rotation.z, -arm_inc_values["shoulder"], -Math.PI / 2, Math.PI / 2);
    wrist.rotation.z = clampedIncrement(wrist.rotation.z, arm_inc_values["wrist_x"], -Math.PI / 2, Math.PI / 2);
    wrist.rotation.y = clampedIncrement(wrist.rotation.y, arm_inc_values["wrist_y"], -Math.PI / 2, Math.PI / 2);
    claw_a.rotation.x = clampedIncrement(claw_a.rotation.x, arm_inc_values["claw"], -Math.PI / 2, Math.PI / 2);
    claw_b.rotation.x = clampedIncrement(claw_b.rotation.x, arm_inc_values["claw"], -Math.PI / 2, Math.PI / 2);

    left_wheel_1.rotation.z += wheel_inc_values["left_wheel_1"];
    left_wheel_2.rotation.z += wheel_inc_values["left_wheel_2"];
    left_wheel_3.rotation.z += wheel_inc_values["left_wheel_3"];
    right_wheel_1.rotation.z += wheel_inc_values["right_wheel_1"];
    right_wheel_2.rotation.z += wheel_inc_values["right_wheel_2"];
    right_wheel_3.rotation.z += wheel_inc_values["right_wheel_3"];
}, 1000 / 30); // 30 FPS

// Register a render loop to repeatedly render the scene
let cam_angle = -Math.PI / 2;
let cam_angle_inc = 0.005;
let cam_direction = 1;

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