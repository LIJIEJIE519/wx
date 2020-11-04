from snowboy import snowboydecoder
import sys
import wave

wave_file1 = "../assets/wavs/snow_yes.wav"
wave_file2 = "../assets/wavs/snow_no.wav"
wave_file3 = "../assets/wavs/snow_old.wav"

model_file1 = "../assets/models/yes.pmdl"
model_file2 = "../assets/models/no.pmdl"

f = wave.open(wave_file2)
assert f.getnchannels() == 1, "Error: Snowboy only supports 1 channel of audio (mono, not stereo)"
assert f.getframerate() == 16000, "Error: Snowboy only supports 16K sampling rate"
assert f.getsampwidth() == 2, "Error: Snowboy only supports 16bit per sample"
data = f.readframes(f.getnframes())
f.close()

detection = snowboydecoder.HotwordDetector([model_file1, model_file2], sensitivity=0.5)

ans = detection.detector.RunDetection(data)
print(ans)

if ans >= 1:
    print('YES 检测到关键词: ' + str(ans))
else:
    print('NO 未检测到关键词!')

