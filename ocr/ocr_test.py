import requests
import base64
import json
with open("imgs/time6.jpg", 'rb') as f:  # 以二进制读取本地图片
    data = f.read()
    encodestr = str(base64.b64encode(data),'utf-8') # base64编码图片


url = "http://127.0.0.1:9999/ocrTest"
data = {'data': {'img': encodestr}}
data = json.dumps(data)
# print(data)
res = requests.post(url=url,data=data)
# print(res)
print(res.text.encode().decode('unicode_escape'))