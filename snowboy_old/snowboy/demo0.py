from snowboy import snowboydecoder
import wave
import signal

interrupted = False


def signal_handler(signal, frame):
    global interrupted
    interrupted = True


def interrupt_callback():
    global interrupted
    return interrupted

def detected():
    print("YES 检测到关键词！\n")

wave_file = "../snow_old.wav"
model = "../old.pmdl"

print("请输入检测类型：0-->麦克风 / 1-->file.wav!\n")
type_what = input()
if int(type_what) == 0:
    # 信号【进程之间通讯的方式】--Ctrl+C【终止进程  中断进程】
    signal.signal(signal.SIGINT, signal_handler)

    # 识别模型
    detector = snowboydecoder.HotwordDetector(model, sensitivity=0.6)
    print('Listening... Press Ctrl+C to exit')

    # main loop
    # 开始识别
    detector.start(detected_callback=detected,
                   interrupt_check=interrupt_callback,
                   sleep_time=0.03)
    detector.terminate()
else:
    f = wave.open(wave_file)
    assert f.getnchannels() == 1, "Error: Snowboy only supports 1 channel of audio (mono, not stereo)"
    assert f.getframerate() == 16000, "Error: Snowboy only supports 16K sampling rate"
    assert f.getsampwidth() == 2, "Error: Snowboy only supports 16bit per sample"
    data = f.readframes(f.getnframes())
    f.close()

    detection = snowboydecoder.HotwordDetector(model, sensitivity=0.6)
    ans = detection.detector.RunDetection(data)
    if ans == 1:
        print('YES 检测到关键词！')
    else:
        print('NO 未检测到关键词!')
