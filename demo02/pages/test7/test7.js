// const advise = {
//   '气滞血瘀症': "",
// }

const plans = [
  '1.宜健脾化湿去痰浊。\n2.注意脾胃功能的调养，少饮冷、忌贪凉，不可轻易进补，少食肥甘厚腻食物。\n3.可多食用一些健脾化痰的食物，比如含有橘皮、山楂、茯苓、薏苡仁、红豆、白术等食材的药膳或代茶饮。可选用针灸、中药汽疗等治疗方法化痰去浊增强代谢。',

  '1.注意保护脾肾功能。\n2.忌贪凉饮冷，忌食寒凉伤阳、厚腻难消化的食物，比如西瓜、苦瓜、绿豆、啤酒、螃蟹等。\n3.适宜食用一些补益脾肾阳气的食物，比如山药、韭菜、狗肉、羊肉、冬虫夏草。可选用三伏贴、艾灸、艾叶泡脚、药浴、汽疗等治疗方法温补脾肾阳气。',

  '1.宜滋补肝肾之阴。\n2.日常生活中应注意保持良好的情绪，养成良好的生活习惯和作息规律，避免熬夜，饮食宜清淡，避免使用辛辣刺激的食物。\n3.适宜服用含有桑葚、枸杞、山药、桑叶、菊花、决明子、红枣等食材的药膳或代茶饮。多锻炼身体，可多练习太极拳、八段锦等中医导引增强体质。',

  '1.宜养阴清火。\n2.养成良好的生活习惯，饮食宜清淡，避免使用辛辣刺激的食物。规律起居，避免熬夜。建议食用百合、沙参、天门冬、麦冬、竹叶、白茅根、川贝、雪梨、菊花等食材的药膳或代茶饮。\n3.适宜简单轻松的运动，如慢跑、游泳、太极拳、八段锦，运动不宜剧烈，不宜汗出过多。',

  '1.宜理气活血化瘀。\n2.平时应注意保持良好的情绪，避免急躁、惊恐、忧虑等不良情绪。\n3.适宜服用含有玫瑰花、代代花、合欢花、厚朴花、三七、山楂、丹参、红花、益母草等药材的药膳或代茶饮。也可采用中医理疗，针灸、按摩、刮痧等改善血液循环，促进气血通畅。',
]

const results = [
  "痰浊阻遏症",
  "脾肾阳虚症",
  "肝肾阴虚症",
  "阴虚阳亢症",
  "气滞血瘀症"
]

var res = {};

Page({
  data: {
    result: '',
    plan: '',
    
  },

  onLoad: function (option) {
    // res = JSON.parse(option.res);
    // console.log(res);
    // var resType = res.type != null ? res.type : 0;
    // var question = parseInt(res.q1)+parseInt(res.q2)+parseInt(res.q3);
    var resType = 4;
    var question = 0;
    var option = 0;
    switch (resType) {
      case 0:
        if (question == 0) {option = 2;} else {option = 0;}
        break;
      case 1:
        if (question == 0) {option = 1;} else {option = 1;}
        break;
      case 2:
        if (question == 0) {option = 4;} else {option = 2;}
        break;
      case 3:
        if (question == 0) {option = 4;} else {option = 3;}
        break;
      case 4:
        if (question == 0) {option = 2;} else {option = 4;}
        break;
      default:
        option = 0;
    }
    this.setData({
      result: results[option],
      plan: plans[option]
    });
  },
})
