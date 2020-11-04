from snowboy import snowboydecoder
import sys
import wave

# Demo code for detecting hotword in a .wavs file
# Example Usage:
#  $ python demo3.py resources/snowboy.wavs resources/models/snowboy.umdl
# Should print:
#  Hotword Detected!
#
#  $ python demo3.py resources/ding.wavs resources/models/snowboy.umdl
# Should print:
#  Hotword Not Detected!


# if len(sys.argv) != 3:
#     print("Error: need to specify wave file name and models name")
#     print("Usage: python demo3.py wave_file model_file")
#     sys.exit(-1)

# wave_file = sys.argv[1]
# model_file = sys.argv[2]

# wave_file = "../snow_old.wavs"
wave_file = "resources/snowboy.wav"
model_file = "../assets/models/old.pmdl"

f = wave.open(wave_file)
assert f.getnchannels() == 1, "Error: Snowboy only supports 1 channel of audio (mono, not stereo)"
assert f.getframerate() == 16000, "Error: Snowboy only supports 16K sampling rate"
assert f.getsampwidth() == 2, "Error: Snowboy only supports 16bit per sample"
data = f.readframes(f.getnframes())
f.close()

detection = snowboydecoder.HotwordDetector(model_file, sensitivity=0.5)

ans = detection.detector.RunDetection(data)

if ans == 1:
    print('YES 检测到关键词！')
else:
    print('NO 未检测到关键词!')

