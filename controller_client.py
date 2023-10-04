from pynput.keyboard import Key, KeyCode, Listener
from websockets import client, exceptions as connection_exceptions
from datetime import datetime

import asyncio

# Setup asynchronous program stuff

q = asyncio.Queue()
loop = asyncio.new_event_loop()

ws: client.WebSocketClientProtocol = None
run = True

allowed_keys = "wsadtg yhvb op rf nm"
active_keys = set()

last_drive_msg = ""
last_arm_msg = ""

pwm_values = [
    [128, 128, 128], # Left Wheels
    [128, 128, 128], # Right Wheels

    [128, 128, 128, 128, 128, 128], # Shoulder, WR, WL, Claw, Gantry, Spin
    [128, 128, 128, 128] # Cam1x, Cam1y, Cam2x, Cam2y
]

def drive_msg(): # D_PWML1_PWMR1_PWML2_PWMR2_PWML3_PWMR3
    return f"D_{pwm_values[0][0]}_{pwm_values[1][0]}_{pwm_values[0][1]}_{pwm_values[1][1]}_{pwm_values[0][2]}_{pwm_values[1][2]}"

def arm_msg(): # A_Shoulder_WR_WL_Claw_Gantry_Spin_Cam1x_Cam1y_Cam2x_Cam2y
    return f"A_{pwm_values[2][0]}_{pwm_values[2][1]}_{pwm_values[2][2]}_{pwm_values[2][3]}_{pwm_values[2][4]}_{pwm_values[2][5]}_{pwm_values[3][0]}_{pwm_values[3][1]}_{pwm_values[3][2]}_{pwm_values[3][3]}"

def process_msgs(): # Generate message and send if changed
    global last_drive_msg, last_arm_msg, ws, q, loop

    d_msg = drive_msg()
    a_msg = arm_msg()

    if d_msg != last_drive_msg:
        loop.call_soon_threadsafe(q.put_nowait, d_msg)
        last_drive_msg = d_msg
    
    if a_msg != last_arm_msg:
        loop.call_soon_threadsafe(q.put_nowait, a_msg)
        last_arm_msg = a_msg

def on_press(key: KeyCode): # Convert key press to pwm values [Keyboard Controller mapping]
    global run, active_keys, ws, last_drive_msg, last_arm_msg, pwm_values, allowed_keys
    
    if key == Key.esc:
        # Stop listener
        print("Stopping listener")
        run = False
        loop.call_soon_threadsafe(q.put_nowait, "STOP")

    try: # Check if key is a letter
        key = key.char
    except AttributeError:
        key = ''
    
    # Invalid command tests
    # Press 1-5 with controller running to test. View result in Web GUI
    if key == '1': # Wrong Command Type 
        loop.call_soon_threadsafe(q.put_nowait, "B_128_128_128_128_128_128")
        return
    if key == '2': # Not enough values - Drive
        loop.call_soon_threadsafe(q.put_nowait, "D_255_255_255_255_255")
        return
    if key == '3': # Non-number values
        loop.call_soon_threadsafe(q.put_nowait, "D_v55_255_255_255_255_255")
        return
    if key == '4': # Not enough values - Arm
        loop.call_soon_threadsafe(q.put_nowait, "A_255_255_255_255_255_255")
        return
    if key == '5': # Blank command
        loop.call_soon_threadsafe(q.put_nowait, "")
        return

    if key not in allowed_keys or key in active_keys:
        return

    active_keys.add(key)

    # Set pwm based on pressed key
    match key:
        case "w":
            pwm_values[0] = [255, 255, 255]
            pwm_values[1] = [255, 255, 255]
        case "s":
            pwm_values[0] = [0, 0, 0]
            pwm_values[1] = [0, 0, 0]
        case "a":
            pwm_values[0] = [0, 0, 0]
            pwm_values[1] = [255, 255, 255]
        case "d":
            pwm_values[0] = [255, 255, 255]
            pwm_values[1] = [0, 0, 0]

        case "t":
            pwm_values[2][0] = 255
        case "g":
            pwm_values[2][0] = 0
        
        case "y":
            pwm_values[2][1] = 255
            pwm_values[2][2] = 0
        case "h":
            pwm_values[2][1] = 0
            pwm_values[2][2] = 255
        
        case "v":
            pwm_values[2][1] = 255
            pwm_values[2][2] = 255
        case "b":
            pwm_values[2][1] = 0
            pwm_values[2][2] = 0
        
        case "o":
            pwm_values[2][3] = 255
        case "p":
            pwm_values[2][3] = 0

        case "r":
            pwm_values[2][4] = 255
        case "f":
            pwm_values[2][4] = 0

        case "n":
            pwm_values[2][5] = 255
        case "m":
            pwm_values[2][5] = 0

    process_msgs()

def on_release(key: KeyCode): # Reset to neutral state on release
    global pwm_values

    try: # Check if key is a letter
        key = key.char
    except AttributeError:
        key = ''

    if key not in allowed_keys or key not in active_keys:
        return

    active_keys.remove(key)

    # Reset to neutral on release
    if key in "wsad":
        pwm_values[0] = [128, 128, 128]
        pwm_values[1] = [128, 128, 128]
    elif key in "tg":
        pwm_values[2][0] = 128
    elif key in "yhvb":
        pwm_values[2][1] = 128
        pwm_values[2][2] = 128
    elif key in "op":
        pwm_values[2][3] = 128
    elif key in "rf":
        pwm_values[2][4] = 128
    elif key in "nm":
        pwm_values[2][5] = 128
    
    process_msgs()

async def main():
    global ws, run, q

    async for websocket in client.connect("ws://localhost:8765"):        
        try:
            ws = websocket
            print("Connected to server.")

            while run:
                msg = await q.get() # Wait for keypress to be processed into messages to send
                if msg == "STOP": # Graceful exit by pressing esc
                    break
                print(f"[{datetime.now()}] - {msg}") # Print timestamped command to console
                await websocket.send(msg)

            await websocket.close()
            break
        except connection_exceptions.ConnectionClosed as e:
            print(f'Terminated', e)

listener = Listener(on_press=on_press, on_release=on_release)
listener.start()

loop.run_until_complete(main())
loop.close()