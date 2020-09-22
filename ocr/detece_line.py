# coding:utf8

import cv2
import numpy as np
import base64
import math


def rotate_bound(image, angle):
    # 获取图像的尺寸
    # 旋转中心
    (h, w) = image.shape[:2]
    (cx, cy) = (w / 2, h / 2)

    # 设置旋转矩阵
    M = cv2.getRotationMatrix2D((cx, cy), -angle, 1.0)
    cos = np.abs(M[0, 0])
    sin = np.abs(M[0, 1])

    # 计算图像旋转后的新边界
    nW = int((h * sin) + (w * cos))
    nH = int((h * cos) + (w * sin))

    # 调整旋转矩阵的移动距离（t_{x}, t_{y}）
    M[0, 2] += (nW / 2) - cx
    M[1, 2] += (nH / 2) - cy

    return cv2.warpAffine(image, M, (nW, nH))


def base64_to_np(base64img):
    img_data = base64.b64decode(base64img)
    nparr = np.fromstring(img_data, np.uint8)
    img_np = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img_np


def get_theta(img):

    img = base64_to_np(img)

    # 转为灰度图像
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # 高斯变模糊
    gass = cv2.GaussianBlur(gray, (15,15), 0)

    # Canny边缘检测
    edges = cv2.Canny(gass, 50, 100)
    """
    canny边缘检测：
    有五个步骤：
            1 高斯滤波器降噪
            2 计算梯度
            3 边缘上使用非最大抑制 nms
            4 边缘上使用双阈值去除假阳性
            5 分析所有边缘连接 消除不明显的边缘
    """

    minLineLength = 150
    maxLineGap = 3
    lines = cv2.HoughLinesP(edges, 1, np.pi / 180, 100, minLineLength, maxLineGap)
    """
    cv2.HoughLinesP
        作用：标准霍夫线变换， 找到图像中的所有直线
        参数：
            1 二值图
            2 半径精度
            3 角度精度
            4 最短检测长度
            5 允许的最大缺口
        返回：
            一个列表，每一项是一个四元组，分别是直线两个端点的坐标
    """
    # 在图片上画直线
    for line in lines:
        for x1, y1, x2, y2 in line:

            cv2.line(img, (x1, y1), (x2, y2), (0, 255, 0), 2)

    all_select_k = []
    for line in lines:
        for x1, y1, x2, y2 in line:
            if x1 == x2:
                continue
            # 在图片上画直线
            k = (y1-y2)/(x1-x2)
            if k <=1 and k>=-1: #选择斜率大于等－１小于等１的
                all_select_k.append(k)
    sorted(all_select_k)
    if len(all_select_k) < 3: #有角度的小于3个，直接返回原图
        return

    all_select_k = all_select_k[1:-1] #去掉最大值和最小值
    avg = sum(all_select_k) / len(all_select_k) # 计算平均斜率

    h = math.atan(avg)  # 斜率到弧度
    print(h)
    # h = -1 * h
    # theta = math.degrees(h) #弧度到角度
    # print(theta)

    # rotated_img = rotate_bound(img, theta)
    # return rotated_img
    # cv2.imwrite("imgs/rotated_img.jpg", rotated_img)

    return h




if __name__ == '__main__':
    img = cv2.imread("imgs/time3.jpg")
    # img = detect_line_and_rotate(img)
    # print(img)
    theta = get_theta(img)
    print(theta)
