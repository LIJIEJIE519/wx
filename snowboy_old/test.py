import pyaudio
import wave

# def play_audio_file():
#     ding_wav = wave.open("snowboy/resources/snowboy.wav", 'rb')
#     ding_data = ding_wav.readframes(ding_wav.getnframes())
#     audio = pyaudio.PyAudio()
#     stream_out = audio.open(
#         format=audio.get_format_from_width(ding_wav.getsampwidth()),
#         channels=ding_wav.getnchannels(),
#         rate=ding_wav.getframerate(), input=False, output=True)
#     stream_out.start_stream()
#     stream_out.write(ding_data)
#
#     stream_out.stop_stream()
#     stream_out.close()
#     audio.terminate()
#
# play_audio_file()

#
# from pydub import AudioSegment
#
# def trans_mp3_to_wav(filepath):
#     song = AudioSegment.from_mp3(filepath)
#     AudioSegment.fr
#     song.export("now.wav", format="wav")
#
# trans_mp3_to_wav("audio/test.mp3")


import os
def webm_to_wav(webm_path, wav_path, sampling_rate, channel):
    """
    webm 转 wav
    :param webm_path: 输入 webm 路劲
    :param wav_path: 输出 wav 路径
    :param sampling_rate: 采样率
    :param channel: 通道数
    :return: wav文件
    """
    # 如果存在wav_path文件，先删除。
    if os.path.exists(wav_path):  # 如果文件存在
        # 删除文件，可使用以下两种方法。
        os.remove(wav_path)
    # 终端命令
    command = "ffmpeg -loglevel quiet -i {} -ac {} -ar {} {}".format(webm_path, channel, sampling_rate, wav_path)
    # print('命令是：',command)
    # 执行终端命令
    os.system(command)
if __name__ == '__main__':
    webm_path = "audio/old.mp3"
    wav_path = "audio/old.wav"
    sampling_rate = 16000
    channel = 1
    webm_to_wav(webm_path, wav_path, sampling_rate, channel)
