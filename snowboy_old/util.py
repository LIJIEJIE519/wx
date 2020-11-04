from snowboy import snowboydecoder
import os
import wave
import json
import numpy as np
import requests
from PIL import Image

# 微信录音 webm 转 wav
def webm_to_wav(webm_path, wav_path, sampling_rate=16000, channel=1):
    """
    webm 转 wavs
    :param webm_path: 输入 webm 路劲
    :param wav_path: 输出 wavs 路径
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

# 从文件识别一个关键字
def snowboy_from_file(wave_file, models=["assets/models/old.pmdl"]):
    f = wave.open(wave_file)
    assert f.getnchannels() == 1, "Error: Snowboy only supports 1 channel of audio (mono, not stereo)"
    assert f.getframerate() == 16000, "Error: Snowboy only supports 16K sampling rate"
    assert f.getsampwidth() == 2, "Error: Snowboy only supports 16bit per sample"
    data = f.readframes(f.getnframes())
    f.close()

    detection = snowboydecoder.HotwordDetector(models, sensitivity=0.5)
    ans = detection.detector.RunDetection(data)
    # 0--未检测到关键词，>=1--检测到关键词
    return str(ans)

def load_image_into_numpy_array(image):
  (im_width, im_height) = image.size
  return np.array(image.getdata()).reshape((im_height, im_width, 3)).astype(np.uint8)

def detect_tongue(image_path="assets/imgs/test_tongue.jpeg"):
    image = Image.open(image_path)
    image_np = np.expand_dims(load_image_into_numpy_array(image), 0)

    data = json.dumps({
        "instances": image_np.tolist()
    })
    headers = {"content-type": "application/json"}
    json_response = requests.post(
        'http://localhost:8501/v1/models/my_tongue:predict',
        data=data, headers=headers)

    # print(json_response.text)
    predictions = json.loads(json_response.text)
    predictions = predictions["predictions"]

    output_dict = {}
    output_dict['num_detections'] = int(predictions[0]['num_detections'])
    output_dict['detection_classes'] = np.array(predictions[0]['detection_classes']).astype(np.uint8)
    output_dict['detection_boxes'] = np.array(predictions[0]['detection_boxes'])
    output_dict['detection_scores'] = np.array(predictions[0]['detection_scores'])
    # print(output_dict)
    return output_dict["detection_scores"][0]

# print(detect_tongue("assets/imgs/test_tongue.jpeg"))
print(snowboy_from_file("assets/wavs/snow_old.wav", models=["assets/models/yes.pmdl", "assets/models/no.pmdl"]))

# webm_to_wav("audio/20201006082014.mp3", "audio/1.wavs")