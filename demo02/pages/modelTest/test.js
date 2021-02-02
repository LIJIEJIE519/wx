
function loadModelFromLocal(localFolder) {
  return new Promise((resolve, reject) => {
    // 从本地文件加载模型
    let files = [];
    let model_files = [];
    console.log('readdirSync');
    try {
      files = fileManager.readdirSync(localFolder);
    } catch (err) {
      console.log(err);
    }
    console.log(files.length);

    let weights_exist = true;
    if (files.length > 0) {
      // model.json必须位于第一个
      model_files.push(localFolder + 'model.json');
      // 解析model.json文件
      let lines = fileManager.readFileSync(model_files[0], "utf-8");
      let json = JSON.parse(lines);
      let weights_manifest = json.weightsManifest;
      for (let i = 0; i < weights_manifest.length; i++) {
        if (files.indexOf(weights_manifest[i].paths.toString()) < 0) {
          console.log(weights_manifest[i].paths + " not exists!");
          weights_exist = false;
          break;
        }
        // console.log(weights_manifest[i].paths);
        // console.log(md5(fileManager.readFileSync(modelLocalFolder + weights_manifest[i].paths)));
        model_files.push(localFolder + weights_manifest[i].paths);
      }
    }
    if (weights_exist) {
      resolve(tf.loadLayersModel(tf.io.mpFiles(model_files)));
    } else {
      resolve(tf.loadLayersModel(MOBILENET_MODEL_PATH));
    }
  });
}