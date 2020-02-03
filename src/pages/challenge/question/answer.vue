<template>
  <div class="answer-page">
    <div class="question-title">{{ 'Q-' + parseInt(index + 1) + '：' + list[index].name }}</div>
    <div class="answer-list">
      <div class="title">请选择：</div>
      <div
        class="answer-item"
        :class="{
        'is-right': needWait && 'optionA' === list[index].answer
        }"
        @click="checkAnswer('optionA')"
        v-if="list[index].optionA"
      >
        <img
          src="@/static/challenge/error.png"
          alt
          class="answer-item-result"
          v-if="needWait && answer !== list[index].answer && answer === 'optionA'"
        />
        <img
          src="@/static/challenge/right.png"
          alt
          class="answer-item-result"
          v-if="needWait && answer === list[index].answer && answer === 'optionA'"
        />
        {{ list[index].optionA }}
      </div>
      <div
        class="answer-item"
        :class="{
        'is-right': needWait && 'optionB' === list[index].answer
        }"
        @click="checkAnswer('optionB')"
        v-if="list[index].optionB"
      >
        <img
          src="@/static/challenge/error.png"
          alt
          class="answer-item-result"
          v-if="needWait && answer !== list[index].answer && answer === 'optionB'"
        />
        <img
          src="@/static/challenge/right.png"
          alt
          class="answer-item-result"
          v-if="needWait && answer === list[index].answer && answer === 'optionB'"
        />
        {{ list[index].optionB }}
      </div>
      <div
        class="answer-item"
        :class="{
        'is-right': needWait && 'optionC' === list[index].answer
        }"
        @click="checkAnswer('optionC')"
        v-if="list[index].optionC"
      >
        <img
          src="@/static/challenge/error.png"
          alt
          class="answer-item-result"
          v-if="needWait && answer !== list[index].answer && answer === 'optionC'"
        />
        <img
          src="@/static/challenge/right.png"
          alt
          class="answer-item-result"
          v-if="needWait && answer === list[index].answer && answer === 'optionC'"
        />
        {{ list[index].optionC }}
      </div>
      <div
        class="answer-item"
        :class="{
        'is-right': needWait && 'optionD' === list[index].answer
        }"
        @click="checkAnswer('optionD')"
        v-if="list[index].optionD"
      >
        <img
          src="@/static/challenge/error.png"
          alt
          class="answer-item-result"
          v-if="needWait && answer !== list[index].answer && answer === 'optionD'"
        />
        <img
          src="@/static/challenge/right.png"
          alt
          class="answer-item-result"
          v-if="needWait && answer === list[index].answer && answer === 'optionD'"
        />
        {{ list[index].optionD }}
      </div>
      <div
        class="answer-item"
        :class="{
        'is-right': needWait && 'optionOne' === list[index].answer
        }"
        @click="checkAnswer('optionOne')"
        v-if="list[index].optionOne"
      >
        <img
          src="@/static/challenge/error.png"
          alt
          class="answer-item-result"
          v-if="needWait && answer !== list[index].answer && answer === 'optionOne'"
        />
        <img
          src="@/static/challenge/right.png"
          alt
          class="answer-item-result"
          v-if="needWait && answer === list[index].answer && answer === 'optionOne'"
        />
        {{ list[index].optionOne }}
      </div>
      <div
        class="answer-item"
        :class="{
        'is-right': needWait && 'optionTwo' === list[index].answer
        }"
        @click="checkAnswer('optionTwo')"
        v-if="list[index].optionTwo"
      >
        <img
          src="@/static/challenge/error.png"
          alt
          class="answer-item-result"
          v-if="needWait && answer !== list[index].answer && answer === 'optionTwo'"
        />
        <img
          src="@/static/challenge/right.png"
          alt
          class="answer-item-result"
          v-if="needWait && answer === list[index].answer && answer === 'optionTwo'"
        />
        {{ list[index].optionTwo }}
      </div>
      <div
        class="error-tips"
        v-if="answer !== list[index].answer && needWait"
      >{{ list[index].errorTips ? list[index].errorTips : '' }}</div>
      <div
        class="next-button"
        v-if="index < 9 && needWait && list[index].answer === answer"
        @click="changeQuestion"
        hover-class="button-hover"
      >下一题</div>
      <div
        class="next-button"
        v-if="index === 9 && needWait"
        @click="backToQuestion"
        hover-class="button-hover"
      >完成挑战</div>
      <div
        class="question-tips"
        v-if="needWait && list[index].tips"
        hover-class="button-hover"
      >解答：{{ list[index].tips }}</div>
      <div
        class="next-button"
        v-if="answer !== list[index].answer && needWait && parseInt(userInfo.surplusAnswerTimes,10) > 1"
        @click="reChallenge"
        hover-class="button-hover"
      >重新挑战</div>
      <button
        class="next-button"
        v-if="needWait  && parseInt(userInfo.surplusAnswerTimes,10) === 1 && answer !== list[index].answer"
        hover-class="button-hover"
        open-type="share"
      >请求好友帮助</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "answer",
  data() {
    return {
      list: [],
      index: 0,
      needWait: false,
      answer: false,
      userInfo: {}
    };
  },
  mounted() {
    this.getQuestionList();
  },
  methods: {
    /**
     * @description 获取问题列表
     * @returns {Promise<void>}
     */
    async getQuestionList() {
      uni.showLoading();
      let result = await this.$ajax.post("/api/question/list", {
        pageSize: 10,
        pageNo: 1,
        userId: this.userInfo.userId
      });
      uni.hideLoading();
      if (result) {
        this.list = result;
      } else {
        uni.showModal({
          content: "您已无答题次数，请分享至好友，进行答题助力",
          showCancel: false,
          success: () => {
            uni.reLaunch({ url: "/pages/challenge/question/index" });
          }
        });
      }
    },
    /**
     * @description 检查选项是否就是答案
     * @param answerData
     */
    checkAnswer(answerData) {
      if (this.needWait) {
        return;
      }
      this.needWait = true;
      this.answer = answerData;
      // 答对并且已经是第十题的时候，更新分数
      if (this.index === 9 && answerData === this.list[this.index].answer) {
        this.submitScore(true);
      }
      // 如果答错，提交更新分数
      if (answerData !== this.list[this.index].answer) {
        this.submitScore();
      }
    },
    /**
     * @description 答对切换问题
     */
    changeQuestion() {
      this.needWait = false;
      this.index++;
      this.answer = null;
    },
    /**
     * @description 答错重新挑战
     */
    reChallenge() {
      this.index = 0;
      this.answer = null;
      this.needWait = false;
      if (parseInt(this.userInfo.surplusAnswerTimes) === 1) {
        uni.showModal({
          conent: "您已无答题次数，请分享至好友进行助力",
          showCancel: false,
          success: () => {
            uni.reLaunch({
              url: "/pages/challenge/question/index"
            });
          }
        });
      }
      this.getQuestionList();
    },
    /**
     * @description 答题完成提交分数
     */
    async submitScore(fullRight) {
      await this.$ajax.post("/api/question/submit", {
        userId: this.userInfo.userId,
        score: fullRight ? 10 : this.index
      });
    },
    /**
     * @description 答题完成，返回答题主界面
     */
    backToQuestion() {
      uni.redirectTo({ url: "/pages/challenge/question/index" });
    }
  },
  onLoad() {
    this.userInfo = JSON.parse(wx.getStorageSync("userInfo"));
  },
  /**
   * @description 触发微信分享
   * @return {{path: string, success: success, title: string, error: error}}
   */
  onShareAppMessage: function() {
    let shareObj = {
      title:
        Math.random() > 0.5
          ? "万水千山总是情，朋友帮帮行不行。"
          : "朋友，帮我一下，我要免费兑礼品",
      path:
        "/pages/challenge/question/help?friendId=" +
        this.userInfo.userId +
        "&nickName=" +
        this.userInfo.nickName,
      imageUrl: "http://file.xmxui.com/pic.jpg",
      success: () => {}
    };
    return shareObj;
  }
};
</script>

<style lang="scss" scoped>
.answer-page {
  background-color: #ffffff;
  min-height: 100%;
  padding: 40rpx 0 40rpx;

  .question-title {
    font-size: 30rpx;
    color: #ee86ad;
    line-height: 35rpx;
    padding: 0 40rpx 40rpx;
    border-bottom: 2rpx solid #e8e8e8;
  }

  .answer-list {
    padding: 40rpx 40rpx 40rpx;

    .title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333333;
    }

    .answer-item {
      width: calc(100% - 80rpx);
      padding: 20rpx 20rpx 20rpx 60rpx;
      line-height: 30rpx;
      border-radius: 30rpx 30rpx 30rpx;
      margin: 40rpx auto;
      background-color: #ee86ad;
      color: #ffffff;
      font-size: 24rpx;
      text-align: left;
      position: relative;

      .answer-item-result {
        width: 30rpx;
        height: 30rpx;
        position: absolute;
        top: 20rpx;
        left: 20rpx;
      }

      &.is-right {
        background-color: #9dd98a;
      }
    }

    .error-tips {
      font-size: 24rpx;
      line-height: 30rpx;
      color: #666666;
    }

    .next-button {
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
      margin: 60rpx 0 40rpx;
      box-shadow: 2px 2px 2px #f095b7;
    }

    .question-tips {
      display: block;
      border-left: 8px solid #ee86ad;
      padding: 5px 10px;
      margin: 10px 0;
      line-height: 1.4;
      font-size: 100%;
      background-color: #f1f1f1;
    }

    .button-hover {
      background: #e8e8e8;
      color: #ffffff;
    }
  }
}
</style>
