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

export {
  levelCount
}
