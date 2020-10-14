from snowboy import snowboydecoder
import os
import wave

def webm_to_wav(webm_path, wav_path, sampling_rate=16000, channel=1):
    """
    webm 转 wav
    :param webm_path: 输入 webm 路劲
    :param wav_path: 输出 wav 路径
    :param sampling_rate: 采样率
    :param channel: 通道数
    :return: wav文件
    """
    # 如果存在wav_path文件，先删除。
    if os.path.exists(wav_path):
        os.remove(wav_path)
    # 终端命令
    command = "ffmpeg -loglevel quiet -i {} -ac {} -ar {} {}".format(webm_path, channel, sampling_rate, wav_path)
    # print(command)
    # 执行终端命令
    is_success = os.system(command)
    return is_success

def snowboy_from_file(wave_file, model="model/old.pmdl"):
    f = wave.open(wave_file)
    assert f.getnchannels() == 1, "Error: Snowboy only supports 1 channel of audio (mono, not stereo)"
    assert f.getframerate() == 16000, "Error: Snowboy only supports 16K sampling rate"
    assert f.getsampwidth() == 2, "Error: Snowboy only supports 16bit per sample"
    data = f.readframes(f.getnframes())
    f.close()

    detection = snowboydecoder.HotwordDetector(model, sensitivity=0.6)
    ans = detection.detector.RunDetection(data)
    if ans == 1:
        return 'YES 检测到关键词!'
    else:
        return 'NO 未检测到关键词!'


print(snowboy_from_file("model/snow_old.wav"))

# webm_to_wav("audio/20201006082014.mp3", "audio/1.wav")