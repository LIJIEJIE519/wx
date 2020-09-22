from flask import Flask, jsonify
from flask import request
import json
import urllib
from detece_line import get_theta
import os
import time
import base64
app = Flask(__name__)



def posturl(data):
    # 请求头
    headers = {
        'Authorization': 'APPCODE 43d1ea9dc83a488c82a42c3263fa7532',  # APPCODE +你的appcod,一定要有空格！！！
        'Content-Type': 'application/json; charset=UTF-8'
    }
    url = "https://ocrapi-advanced.taobao.com/ocrservice/advanced"

    try:
        data["rotate"] = True
        params=json.dumps(data).encode(encoding='UTF8')
        # "rotate": false,
        # print(params)
        req = urllib.request.Request(url, params, headers)
        r = urllib.request.urlopen(req)
        html =r.read()
        r.close()
        jos = json.loads(html.decode("utf8"))
        print(jos['content'].split(" "))
        return jos['content']
    except urllib.error.HTTPError as e:
        print(e.code)
        print(e.read().decode("utf8"))
        return None


def get_info_from_ocr_res(data):
    """
    data: list
    """
    key = ["低密度脂蛋白", "总胆固醇", "甘油三脂", "甘油三酯"] # 甘油三脂和甘油三酯的简称均为TG
    pos = 0
    info = {}
    while pos < len(data):
        if data[pos] in key:
            t = pos + 1
            if t < len(data):
                info[data[pos]] = float(data[t])
                # pos = t
        pos += 1

    return info

@app.route("/uploadImg", methods=["POST"])
def get_pic():
    upload_file = request.files['file']
    file_name = time.strftime('%Y%m%d%H%M%S',time.localtime(time.time()))+".jpg"
    if upload_file:
        file_path = os.path.join('D:/IT_experience/python/ocr/imgs/', file_name)
        upload_file.save(file_path)
        # print('file saved to %s' % file_path)
        return file_name
    else:
        return 'failed'

@app.route("/uploadAudio", methods=["POST"])
def get_audio():
    upload_file = request.files['file']
    file_name = time.strftime('%Y%m%d%H%M%S', time.localtime(time.time())) + ".pcm"
    if upload_file:
        file_path = os.path.join('D:/IT_experience/python/ocr/audio/', file_name)
        upload_file.save(file_path)
        # print('file saved to %s' % file_path)
        return file_name
    else:
        return 'failed'

@app.route("/ocrTest", methods=["POST"])
def get_ocr_result_test():
    # print(request.data)
    # get_json = request.json("data")
    # postdata = request.form['data']
    postdata = request.data
    postdata = json.loads(postdata)
    img_json = postdata["data"]
    # print("postdata:", postdata)

    theta = get_theta(img_json["img"])
    print(theta)
    if abs(theta)>=1:
        return jsonify({'data': "", "error:":True, "rotate":True})
    data = posturl(img_json)
    info = get_info_from_ocr_res(data.split(" "))
    print("info:", info)
    if info is not None:
        return jsonify({'data': info, "error:":False})
    else:
        return jsonify({'data': "", "error:":True})

@app.route("/ocr", methods=["POST"])
def get_ocr_result():
    fileName = json.loads(request.data)['data']
    with open("D:/IT_experience/python/ocr/imgs/" + fileName, 'rb') as f:  # 以二进制读取本地图片
        data = f.read()
        encodeStr = str(base64.b64encode(data), 'utf-8')  # base64编码图片

    img_json = {'img': encodeStr}
    theta = get_theta(img_json["img"])
    if abs(theta) >= 1:
        return jsonify({'data': "", "error:":True, "rotate":True})
    data = posturl(img_json)
    info = get_info_from_ocr_res(data.split(" "))
    if info is not None:
        return jsonify({'data': info, "error:":False})
    else:
        return jsonify({'data': "", "error:":True})


if __name__ == '__main__':
    app.run(debug=True, host="127.0.0.1", port=9999)
