<template>
  <div class="question-main">
    <div class="current-main">
      <div class="current-icon">
        <img src="@/static/challenge/challenge.png" alt="">
      </div>
      <div class="current-info">
        <div class="current-info-level">
          <div class="current-level">
            {{ levelCount(userInfo.score) }}
          </div>
          <div class="current-level-target">
            {{ nextLevelCount(userInfo.score) }}
          </div>
        </div>
        <div class="current-info-score">
          {{ '当前积分：' + userInfo.score }}
        </div>
        <div class="current-info-progress">
          <div class="current-info-percent" :style="{'width': levelPercentCount(userInfo.score) +'%' }"></div>
        </div>
        <div class="current-info-progress-label">
          {{ levelPercentCount(userInfo.score) + '%' }}
        </div>
      </div>
    </div>
    <div class="challenge-rules">
      <div class="challenge-rules-title">
        挑战规则：
      </div>
      <div class="challenge-rules-item">
        1、每次答题将随机从题库中抽取10道题。
      </div>
      <div class="challenge-rules-item">
        2、答对计10分，答错不扣分
      </div>
      <div class="challenge-rules-item">
        3、答错后，将失去本次答题的机会
      </div>
      <!--<div class="challenge-rules-item">-->
        <!--4、每人每天拥有3次挑战机会，失去挑战机会后-->
      <!--</div>-->
      <!--<div class="challenge-rules-item">-->
        <!--5、当无挑战机会后，可分享至微信好友进行助力-->
      <!--</div>-->
      <!--<div class="challenge-rules-item">-->
        <!--6、好友每一次助力后，获取一次挑战次数-->
      <!--</div>-->
      <!--<div class="challenge-rules-item">-->
        <!--7、每天最多拥有5次助力机会-->
      <!--</div>-->
      <div class="challenge-rules-item">
        4、积分后期开放兑换育儿相关的物品哦
      </div>
    </div>
    <div class="challenge-button" @click="beginChallenge">
      开始挑战
    </div>
  </div>
</template>

<script>
import {levelCount, nextLevelCount,levelPercentCount} from "../../../tools/dataFormat";

export default {
  name: "index",
  data() {
    return {
      userInfo: {}
    }
  },
  mounted() {
    this.getUserInfo()
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
    },
    /**
     * @description 开始挑战
     */
    beginChallenge() {
      uni.navigateTo({url: '/pages/challenge/question/answer'});
    }
  }
}
</script>

<style lang="scss" scoped>
  .question-main {
    background-color: #FFFFFF;
    min-height: 100%;

    .current-main {
      width: calc(100% - 80rpx);
      padding: 40rpx 40rpx 40rpx;
      border-bottom: 2rpx solid #E8E8E8;
      display: flex;
      justify-content: flex-start;

      .current-icon {
        width: 148rpx;
        height: 148rpx;
        background-color: #EE7BA6;
        border: 2rpx solid #E8E8E8;
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
          color: #EE7BA6;
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
        background-color: #E6E6EC;
        border-radius: 7rpx;
        margin-top: 28rpx;

        .current-info-percent {
          width: 0;
          height: 14rpx;
          background: #EE7BA6;
          border-radius: 7rpx;
        }
      }

      .current-info-progress-label {
        position: absolute;
        right: 0;
        bottom: 10rpx;
        color: #EE7BA6;
        font-size: 20rpx;
        line-height: 20rpx;
      }
    }

    .challenge-rules {
      padding: 30rpx 30rpx 0;

      .challenge-rules-title {
        font-size: 30rpx;
        line-height: 30rpx;
        color: #333333;
        margin-bottom: 20rpx;
      }

      .challenge-rules-item {
        font-size: 24rpx;
        line-height: 24rpx;
        margin-bottom: 5rpx;
        color: #999999;
      }
    }

    .challenge-button {
      width: 670rpx;
      height: 90rpx;
      background: linear-gradient(94deg, rgba(238, 123, 166, 1), rgba(240, 149, 183, 1));
      border-radius: 45rpx;
      color: #FFFFFF;
      font-size: 34rpx;
      text-align: center;
      line-height: 90rpx;
      margin: 100rpx 40rpx 40rpx;
    }
  }
</style>
