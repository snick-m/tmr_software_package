# TorontoMetRobotics 2023 Fall Recruitment 
### Software Package
Submission repository for the Software Package, Option A and Camera System.[^1]
For my solution, I've built a rough 3D representation of the Robotic Arm and
PWM Meters for each motor. Additionally all received commands are listed along with timestamps.

### How to Run
1. run `python websocket_server.py`
2. run `npm start`
3. run `python controller_client.py`
4. Now you can use `w,a,s,d` for driving and `r f t g y h v b n m o p` for Arm controls
5. Use `1 2 3 4 5` to test various invalid packets. Hover on highlighted packets for more error info.

### Camera Task Explanation
Near the start of the project I had managed to get the camera streaming but I cannot seem to replicate it.
However, for the time I did manage to get it worked I pretty much had mashed a few tutorials to get it working that I was planning to analyse later.

I'll be noting what I learned about the Gstreamer task as my explanation of what I would do with more time.
Firstly, using GStreamer I need to take the webcam source through a conversion pipeline and then encode it with h264 or h265 based on support.
Then, the encoded feed gets fed into a udp stream that I will have to add extra information to for opencv to be able to open it directly.
Lastly, the OpenCV script will be using videoCapture() function to load the udp stream and show it with imshow, or serve it up to the Web GUI through an http stream.

Find out how long it took me 📊<br>
[![wakatime](https://wakatime.com/badge/user/c4933990-64f0-4101-b362-b288582ecb57/project/291caae2-8db1-46b2-ae78-d4151286fe56.svg?style=for-the-badge)](https://wakatime.com/@snick/projects/zzzonpgwom)
