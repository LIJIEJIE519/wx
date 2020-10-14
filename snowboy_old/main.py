from flask import Flask
from flask import request
from util import webm_to_wav, snowboy_from_file
import os
import time
app = Flask(__name__)


@app.route("/uploadImg", methods=["POST"])
def get_pic():
    upload_file = request.files['file']
    file_name = time.strftime('%Y%m%d%H%M%S',time.localtime(time.time()))+".jpg"
    if upload_file:
        file_path = os.path.join('imgs/', file_name)
        upload_file.save(file_path)
        return file_name
    else:
        return 'failed'

# 上传录音文件
@app.route("/uploadAudio", methods=["POST"])
def get_audio():
    upload_file = request.files['file']
    file_name = time.strftime('%Y%m%d%H%M%S', time.localtime(time.time()))
    mp3_file = "audio/"+file_name+".mp3"
    wav_file = "audio/"+file_name+".wav"
    if upload_file:
        # file_path = os.path.join("audio/", mp3_file)
        upload_file.save(mp3_file)
        # webm 2 wav
        is_wav = webm_to_wav(mp3_file, wav_file)
        if is_wav == 0:
            res = snowboy_from_file(wav_file, "model/xiaobai.pmdl")
            os.remove(mp3_file)
            os.remove(wav_file)
            return res
        else:
            return "webm 2 wav失败，上传音频错误"
        # return file_name
    else:
        return 'failed'

if __name__ == '__main__':
    app.run(debug=True, host="127.0.0.1", port=9999)
