const arm_pwm_displays = [
    document.getElementById('shoulder'),
    document.getElementById('wrist_r'),
    document.getElementById('wrist_l'),
    document.getElementById('claw'),
    document.getElementById('gantry'),
    document.getElementById('spin')
];

const wheel_pwm_displays = [
    document.getElementById('left_wheel_1'),
    document.getElementById('right_wheel_1'),
    document.getElementById('left_wheel_2'),
    document.getElementById('right_wheel_2'),
    document.getElementById('left_wheel_3'),
    document.getElementById('right_wheel_3')
];

function displayArmPWMs(values) {
    for (let i = 0; i < arm_pwm_displays.length; i++) {
        arm_pwm_displays[i].innerHTML = values[i];
    }
}

function displayWheelPWMs(values) {
    for (let i = 0; i < wheel_pwm_displays.length; i++) {
        wheel_pwm_displays[i].innerHTML = values[i];
    }
}