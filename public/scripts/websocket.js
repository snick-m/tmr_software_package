const ws = new WebSocket('ws://localhost:8765');

ws.onopen = () => {
    console.log('WebSocket Client Connected');
    document.getElementById('ws_status').innerHTML = 'WebSocket Client Connected';
}

ws.onclose = () => {
    console.log('WebSocket Client Disconnected');
    document.getElementById('ws_status').innerHTML = 'WebSocket Client Disconnected';
}

ws.onmessage = (e) => {
    if (!validateAndLogCommand(e.data)) return; // Skip processing if invalid command

    if (e.data.startsWith('A')) {
        let values = e.data.slice(2).split('_').map(Number);
        displayArmPWMs(values);

        let wrist_r = values[1] - 128;
        let wrist_l = values[2] - 128;

        if (wrist_l > 0 && wrist_r > 0) {
            arm_inc_values["wrist_y"] = 127;
        } else if (wrist_l < 0 && wrist_r < 0) {
            arm_inc_values["wrist_y"] = -127;
        } else if (wrist_l > 0 && wrist_r < 0) {
            arm_inc_values["wrist_x"] = 127;
        } else if (wrist_l < 0 && wrist_r > 0) {
            arm_inc_values["wrist_x"] = -127;
        } else {
            arm_inc_values["wrist_x"] = 0;
            arm_inc_values["wrist_y"] = 0;
        }

        arm_inc_values["shoulder"] = values[0] - 128;
        arm_inc_values["claw"] = values[3] - 128;
        arm_inc_values["gantry"] = values[4] - 128;
        arm_inc_values["spin"] = values[5] - 128;

        for (let key in arm_inc_values) {
            arm_inc_values[key] = arm_inc_values[key] / 3000; // 30 FPS * 100
        }
    } else if (e.data.startsWith('D')) {
        let values = e.data.slice(2).split('_').map(Number);
        displayWheelPWMs(values);
        
        wheel_inc_values["left_wheel_1"] = values[0] - 128;
        wheel_inc_values["right_wheel_1"] = values[1] - 128;
        wheel_inc_values["left_wheel_2"] = values[2] - 128;
        wheel_inc_values["right_wheel_2"] = values[3] - 128;
        wheel_inc_values["left_wheel_3"] = values[4] - 128;
        wheel_inc_values["right_wheel_3"] = values[5] - 128;

        for (let key in wheel_inc_values) {
            wheel_inc_values[key] = wheel_inc_values[key] / 1500; // 30 FPS * 50
        }
    }
}
