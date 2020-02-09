<template>
  <div class="question-main">
    <div class="current-main">
      <div class="current-icon">
        <img src="http://file.xmxui.com/challenge.png" alt />
      </div>
      <div class="current-info">
        <div class="current-info-level">
          <div class="current-level">{{ levelCount(userInfo.score) }}</div>
          <div class="current-level-target">{{ nextLevelCount(userInfo.score) }}</div>
        </div>
        <div class="current-info-score">{{ '当前积分：' + userInfo.score }}</div>
        <div class="current-info-progress">
          <div
            class="current-info-percent"
            :style="{'width': levelPercentCount(userInfo.score) +'%' }"
          ></div>
        </div>
        <div class="current-info-progress-label">{{ levelPercentCount(userInfo.score) + '%' }}</div>
      </div>
    </div>
    <div class="less-times-tips">
      今日剩余答题次数：
      <span class="num">{{ userInfo.surplusAnswerTimes }}</span>
    </div>
    <div class="challenge-rules">
      <div class="challenge-rules-title">挑战规则：</div>
      <div class="challenge-rules-item">1、每次答题将随机从题库中抽取10道题。</div>
      <div class="challenge-rules-item">2、答对计1积分，答错不扣分</div>
      <div class="challenge-rules-item">3、答错后，将失去本次答题的机会</div>
      <div class="challenge-rules-item">4、每人每天拥有3次挑战机会</div>
      <div class="challenge-rules-item">5、当无挑战机会后，可分享至微信好友进行助力</div>
      <div class="challenge-rules-item">6、好友每一次助力后，获取一次挑战次数</div>
      <div class="challenge-rules-item">7、每天最多拥有3次助力机会</div>
      <div class="challenge-rules-item">8、每个好友每天只能帮助同一分享者一次</div>
      <div class="challenge-rules-item">9、积分【积分商城】免费进行免费兑换物品哦</div>
    </div>
    <div
      class="challenge-button"
      hover-class="button-hover"
      @click="beginChallenge"
      v-if="parseInt(userInfo.surplusAnswerTimes,10) > 0 && parseInt(userInfo.surplusHelpTimes,10) > 0"
      :class="{'disabled': parseInt(userInfo.surplusAnswerTimes,10) === 0 && parseInt(userInfo.surplusHelpTimes,10) === 0}"
    >开始挑战</div>
    <button
      class="challenge-button"
      hover-class="button-hover"
      v-if="parseInt(userInfo.surplusAnswerTimes,10) === 0 && parseInt(userInfo.surplusHelpTimes,10) > 0"
      open-type="share"
    >请求好友帮助继续答题</button>
  </div>
</template>

<script>
import {
  levelCount,
  nextLevelCount,
  levelPercentCount
} from "../../../tools/dataFormat";

export default {
  name: "index",
  data() {
    return {
      userInfo: {}
    };
  },
  methods: {
    // 等级计算
    levelCount,
    // 下一等级计算
    nextLevelCount,
    // 等级进度条
    levelPercentCount,
    /**
     * @description 获取用户信息
     */
    async getUserInfo() {
      let userId = wx.getStorageSync("userId");
      this.userInfo = await this.$ajax.post("/api/user/getUserInfo", {
        userId: userId
      });
      wx.setStorageSync("userInfo", JSON.stringify(this.userInfo));
    },
    /**
     * @description 开始挑战
     */
    beginChallenge() {
      // 检测剩余答题次数
      if (parseInt(this.userInfo.surplusAnswerTimes) === 0) {
        uni.showModal({
          title: "温馨提示",
          content:
            parseInt(this.userInfo.surplusHelpTimes) === 0
              ? "学习虽好，可也不要忘了多陪陪家人哦，请明日再来。"
              : "当前剩余答题次数为0，您还可以分享给好友进行助力。",
          showCancel: false
        });
        return;
      }
      uni.navigateTo({ url: "/pages/challenge/question/answer" });
    }
  },
  /**
   * @description 触发微信分享
   * @return {{path: string, success: success, title: string, error: error}}
   */
  onShareAppMessage: function() {
    let userInfo = JSON.parse(wx.getStorageSync("userInfo"));
    let shareObj = {
      title:
        Math.random() > 0.5
          ? "万水千山总是情，朋友帮帮行不行。"
          : "朋友，帮我一下，我要免费兑礼品",
      path:
        "/pages/challenge/question/help?friendId=" +
        userInfo.userId +
        "&nickName=" +
        userInfo.nickName,
      imageUrl: "http://file.xmxui.com/pic.jpg"
    };
    return shareObj;
  },
  onShow() {
    this.getUserInfo();
  }
};
</script>

<style lang="scss" scoped>
.question-main {
  background-color: #ffffff;
  min-height: 100%;

  .current-main {
    width: calc(100% - 80rpx);
    padding: 40rpx 40rpx 40rpx;
    border-bottom: 2rpx solid #e8e8e8;
    display: flex;
    justify-content: flex-start;

    .current-icon {
      width: 148rpx;
      height: 148rpx;
      background-color: #ee7ba6;
      border: 2rpx solid #e8e8e8;
      border-radius: 100%;
      text-align: center;
      position: relative;
      margin-right: 30rpx;

      img {
        width: 63rpx;
        height: 54rpx;
        position: absolute;
        top: 47rpx;
        left: 43rpx;
      }
    }
  }

  .current-info {
    width: calc(100% - 180rpx);
    position: relative;

    .current-info-level {
      display: flex;
      justify-content: flex-start;
      margin-top: 20rpx;

      .current-level {
        font-size: 28rpx;
        line-height: 34rpx;
        color: #333333;
        margin-right: 12rpx;
      }

      .current-level-target {
        width: 100rpx;
        height: 34rpx;
        background: rgba(238, 123, 166, 0.15);
        border: 1rpx solid rgba(238, 123, 166, 1);
        border-radius: 17rpx;
        font-size: 18rpx;
        line-height: 34rpx;
        text-align: center;
        color: #ee7ba6;
      }
    }

    .current-info-score {
      margin-top: 20rpx;
      color: #848484;
      font-size: 24rpx;
      line-height: 24rpx;
    }

    .current-info-progress {
      width: 420rpx;
      height: 14rpx;
      background-color: #e6e6ec;
      border-radius: 7rpx;
      margin-top: 28rpx;

      .current-info-percent {
        width: 0;
        height: 14rpx;
        background: #ee7ba6;
        border-radius: 7rpx;
      }
    }

    .current-info-progress-label {
      position: absolute;
      right: 0;
      bottom: 10rpx;
      color: #ee7ba6;
      font-size: 20rpx;
      line-height: 20rpx;
    }
  }

  .less-times-tips {
    color: #333333;
    font-size: 24rpx;
    line-height: 40rpx;
    margin: 30rpx 0;
    padding: 0 20rpx;
    .num {
      color: #ee7ba6;
      font-weight: bold;
    }
  }

  .challenge-rules {
    border-left: 8rpx solid #ee7ba6;
    padding: 20rpx 20rpx;
    margin: 30rpx 0;
    background-color: #f1f1f1;
    .challenge-rules-title {
      font-size: 30rpx;
      line-height: 30rpx;
      color: #333333;
      margin-bottom: 20rpx;
    }

    .challenge-rules-item {
      font-size: 24rpx;
      line-height: 30rpx;
      margin-bottom: 5rpx;
      color: #666666;
    }
  }

  .challenge-button {
    width: 670rpx;
    height: 90rpx;
    background: linear-gradient(
      94deg,
      rgba(238, 123, 166, 1),
      rgba(240, 149, 183, 1)
    );
    border-radius: 45rpx;
    color: #ffffff;
    font-size: 34rpx;
    text-align: center;
    line-height: 90rpx;
    margin: 100rpx 40rpx 40rpx;
    &.disabled {
      background: #dedede;
      color: #ffffff;
    }
  }

  .button-hover {
    background: #e8e8e8;
    color: #ffffff;
  }
}
</style>
