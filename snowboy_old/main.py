from flask import Flask
from flask import request
from util import webm_to_wav, snowboy_from_file, detect_tongue
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
        if detect_tongue(image_path=file_path) >= 0.5:
            os.remove(file_path)
            return "Yes"
        else:
            os.remove(file_path)
            return "No"
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
    else:
        return 'failed'

@app.route("/detect_tongue", methods=["GET"])
def test_tongue():
    return str(detect_tongue())

@app.route("/test", methods=["GET"])
def test():
    return "test"


if __name__ == '__main__':
    # app.run(debug=True, host="127.0.0.1", port=9999)
    app.run(debug=True, host="0.0.0.0", port=9999)
