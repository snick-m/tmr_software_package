// DOM Elements that show pwm values

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

// Separate functions for different packet sizes

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

/* =========================== COMMAND LOG DISPLAY ========================== */

const log_item = document.createElement('span'); // Base element to display each command
const log = document.getElementById('command_log');

// Check for errors in the command packet and display it in the log appropriately
function validateAndLogCommand(command) {
    let { valid, error } = validateCommand(command);
    const item = log_item.cloneNode();
    item.innerHTML = command.trim() != '' ? command : '&nbsp;';
    item.classList.add('py-1', 'mx-2', 'my-0.5', 'hover:my-2', 'rounded-lg', 'transition-all');

    if (!valid) {
        item.classList.add('bg-yellow-300');
        item.title = error;
    }

    log.insertBefore(item, log.firstChild);
    return valid;
}

// A_shoulder_wristRight_wristLeft_claw_gantry_spin_cam1x_cam1y_cam2x_cam2y
// D_leftWheel1_rightWheel1_leftWheel2_rightWheel2_leftWheel3_rightWheel3

function isOutOfRange(value) {
    return value < 0 || value > 255;
}

// Check for 4 different types of errors in the command packet and generate appropriate error messages
function validateCommand(command) {
    if (!command.startsWith('A') && !command.startsWith('D')) {
        return {
            valid: false,
            error: 'Invalid command type. Must start with A or D.'
        };
    } else {
        let vals = command.slice(2).split('_');

        if (command.startsWith("A")) {
            if (vals.length != 10) {
                return {
                    valid: false,
                    error: 'Arm commands must have 10 values separated by underscores.'
                };
            }
        } else {
            if (vals.length != 6) {
                return {
                    valid: false,
                    error: 'Wheel commands must have 6 values separated by underscores.'
                };
            }
        }

        if (vals.some(isNaN)) {
            return {
                valid: false,
                error: 'Command values must be numbers.'
            };
        }

        if (vals.some(isOutOfRange)) {
            return {
                valid: false,
                error: 'Command values must be between 0 and 255.'
            };
        }
    }

    return {
        valid: true
    };
}