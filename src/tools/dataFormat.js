/**
 * @description 根据积分反馈当前等级
 * @param score
 * @returns {null}
 */
function levelCount(score) {
  score = parseInt(score);
  let level = null;
  if (score >= 0) {
    level = "育儿盲人";
  }
  if (score > 200) {
    level = "育儿新手";
  }
  if (score > 500) {
    level = "育儿砖家";
  }
  if (score > 1000) {
    level = "育儿叫兽";
  }
  if (score > 2000) {
    level = "权威砖家";
  }
  if (score > 5000) {
    level = "育儿圣者";
  }
  if (score > 10000) {
    level = "育儿之神";
  }
  return level
}

function ageDiffCount(birthDay) {
  let b = new Date(birthDay).getTime()
  let d = new Date().getTime()
  let diff = (d - b) / 24 / 60 / 60 / 1000
  let result = null
  // 小于一个月龄
  if (diff > 0) {
    result = diff.toFixed(0) + '天'
  }
  // 如果是满月
  if (diff > 30) {
    result = parseInt(diff / 30) + '个月' + diff % 30 + '天'
  }
  // 超过一岁
  if (diff > 365) {
    result = parseInt(diff / 365) + '岁' + parseInt((diff % 365) / 30) + '个月' + parseInt(((diff % 365) % 30)) + '天'
  }
  return result
}

export {
  levelCount,
  ageDiffCount
}
