from flask import Flask
from flask import request
import os
import time
app = Flask(__name__)


@app.route("/uploadImg", methods=["POST"])
def get_pic():
    upload_file = request.files['file']
    file_name = time.strftime('%Y%m%d%H%M%S',time.localtime(time.time()))+".jpg"
    if upload_file:
        file_path = os.path.join('D:/IT_experience/python/ocr/imgs/', file_name)
        upload_file.save(file_path)
        return file_name
    else:
        return 'failed'

@app.route("/uploadAudio", methods=["POST"])
def get_audio():
    upload_file = request.files['file']
    file_name = time.strftime('%Y%m%d%H%M%S', time.localtime(time.time())) + ".wav"
    if upload_file:
        file_path = os.path.join("audio/"+file_name)
        upload_file.save(file_path)
        return file_name
    else:
        return 'failed'


if __name__ == '__main__':
    app.run(debug=True, host="127.0.0.1", port=9999)
