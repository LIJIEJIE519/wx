from snowboy import snowboydecoder
import sys
import signal

interrupted = False


def signal_handler(signal, frame):
    global interrupted
    interrupted = True


def interrupt_callback():
    global interrupted
    return interrupted

def detected():
    print("Great，我已经识别到你的关键字！\n")

# if len(sys.argv) == 1:
#     print("Error: need to specify models name")
#     print("Usage: python demo.py your.models")
#     sys.exit(-1)
# argv[0] 为模块名，args[1]为第一个传入参数
# models = sys.argv[1]
model = "../old.pmdl"

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
