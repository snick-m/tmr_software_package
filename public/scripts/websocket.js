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
    if (e.data.startsWith('A')) {
        let values = e.data.slice(2).split('_').map(Number);

        let wrist_r = values[1] - 128;
        let wrist_l = values[2] - 128;

        if (wrist_l > 0 && wrist_r > 0) {
            inc_values["wrist_y"] = 127;
        } else if (wrist_l < 0 && wrist_r < 0) {
            inc_values["wrist_y"] = -127;
        } else if (wrist_l > 0 && wrist_r < 0) {
            inc_values["wrist_x"] = 127;
        } else if (wrist_l < 0 && wrist_r > 0) {
            inc_values["wrist_x"] = -127;
        } else {
            inc_values["wrist_x"] = 0;
            inc_values["wrist_y"] = 0;
        }

        inc_values["shoulder"] = values[0] - 128;
        inc_values["claw"] = values[3] - 128;
        inc_values["gantry"] = values[4] - 128;
        inc_values["spin"] = values[5] - 128;

        for (let key in inc_values) {
            inc_values[key] = inc_values[key] / 3000; // 30 FPS * 100
        }
    }
}
