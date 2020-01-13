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

/**
 * @description 下一等级计算匹配规则
 * @param score
 * @return {*}
 */
function nextLevelCount(score) {
  score = parseInt(score)
  let level = null;
  if (score >= 0) {
    level = '育儿新手'
  }
  if (score >= 200) {
    level = '育儿专家'
  }
  if (score >= 500) {
    level = '育儿叫兽'
  }
  if (score >= 1000) {
    level = '权威砖家'
  }
  if (score >= 2000) {
    level = "育儿圣者"
  }
  if (score >= 5000) {
    level = "育儿之神"
  }
  return level
}

/**
 * @description 等级百分比进度计算
 * @param score
 * @return {string}
 */
function levelPercentCount(score) {
  let levelArr = [0, 200, 500, 1000, 200, 5000, 10000]
  score = parseInt(score);
  let nextNum = 0;
  let currentIndex = 0;
  let flag = false;
  levelArr.map((item, index) => {
    if (!flag && item > score) {
      nextNum = item;
      currentIndex = index - 1;
      flag = true;
    }
  })
  return (((score - levelArr[currentIndex]) / (nextNum - levelArr[currentIndex])) * 100).toFixed(2)
}

/**
 * @description 计算年龄
 * @param birthDay
 * @return {*}
 */
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

/**
 * @description 月龄匹配
 * @param ageArr
 * @param birthDay
 * @return {*|number}
 */
function bestAgeMatch(ageArr, birthDay) {
  const b = new Date(birthDay).getTime();
  const d = new Date().getTime();
  let diff = (d - b) / 24 / 60 / 60 / 1000;
  let monthNum = 0;
  // 如果未满月,并且出生日少于15天，按照0个月进行计算
  if (diff < 15) {
    monthNum = 0;
  }
  // 如果未满月，并且出生日大于15天，按照一个月进行计算
  else if (diff < 30) {
    monthNum = 1;
  }
  // 如果超过一个月，进行最佳月龄匹配
  else {
    let flag = false;
    let nextNum = 0;
    let prevIndex = 0;
    ageArr.map((item, index) => {
      if (item.id * 30 > diff && !flag) {
        flag = true;
        prevIndex = index - 1;
        nextNum = item.id;
      }
    })
    let diffDay = (diff - ageArr[prevIndex].id * 30) / (nextNum * 30 - ageArr[prevIndex].id * 30);
    if (diffDay > 0.5) {
      monthNum = nextNum;
    } else {
      monthNum = ageArr[prevIndex].id;
    }
  }
  return monthNum
}

export {
  levelCount,
  nextLevelCount,
  levelPercentCount,
  ageDiffCount,
  bestAgeMatch
}
