import pyaudio
import wave

def play_audio_file():
    ding_wav = wave.open("snowboy/resources/snowboy.wav", 'rb')
    ding_data = ding_wav.readframes(ding_wav.getnframes())
    audio = pyaudio.PyAudio()
    stream_out = audio.open(
        format=audio.get_format_from_width(ding_wav.getsampwidth()),
        channels=ding_wav.getnchannels(),
        rate=ding_wav.getframerate(), input=False, output=True)
    stream_out.start_stream()
    stream_out.write(ding_data)

    stream_out.stop_stream()
    stream_out.close()
    audio.terminate()

play_audio_file()