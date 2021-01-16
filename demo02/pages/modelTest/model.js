// import * as tf from '@tensorflow/tfjs-core'
const regeneratorRuntime = require('regenerator-runtime')
import * as tfl from '@tensorflow/tfjs-layers'

judge().then(value => console.log("最终识别结果为：" + value));
async function predictBreed(){
  console.log("Model is loading...");
  const MODEL_URL = '../../model/model.json';
  // mobilenet = await tfl.loadLayersModel("https://ai.flypot.cn/models/coco-ssd/model.json");
  mobilenet = await tfl.loadLayersModel(MODEL_URL);
  console.log("Model loaded Successfully!")
}

//调用判别逻辑并返回结果
async function judge() {
    const image1_value = await predictBreed();
    return "final_result";
}