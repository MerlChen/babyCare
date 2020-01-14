<template>
  <div class="share">
    <div class="title">助力好友答题赢积分</div>
    <div class="title-tips">积分可免费兑好礼</div>
    <div
      class="tips-label"
      :class="{'highScreen':needReset}"
    >您的好友{{ ' ' + linkInfo.nickName + ' ' }}需要您的帮助</div>
    <div class="tips-answer">答题的积分能免费兑换礼品哦</div>
    <div class="help-button" hover-class="button-hover" @click="helpFriend">我要帮忙</div>
    <div class="copy-right">育婴宝库·传递科学的育儿知识</div>
    <authDialog v-if="showAuthDialog" @change="userAuthSetting"></authDialog>
  </div>
</template>

<script>
import authDialog from "./../../../components/authDialog";

export default {
  name: "help",
  components: {
    authDialog
  },
  data() {
    return {
      linkInfo: {},
      showAuthDialog: "",
      needReset: false
    };
  },
  methods: {
    userAuthSetting(res) {
      if (res === "success") {
        this.helpFriend();
      } else {
        wx.showModal({
          title: "温馨提示",
          content: "您需要授权才能帮助好友哦",
          success: res => {
            if (!res.confirm) {
              wx.showToast({
                title: "您已拒绝授权"
              });
              this.showAuthDialog = false;
            }
          }
        });
      }
    },
    /**
     * @description 帮助朋友
     */
    async helpFriend() {
      let userId = wx.getStorageSync("userId");
      if (!userId) {
        this.showAuthDialog = true;
      } else {
        this.checkUseful();
        let result = await this.$ajax.post("/api/question/helpFriend", {
          userId: userId,
          friendId: this.linkInfo.friendId
        });
        wx.showToast({
          title: "数据请求中",
          icon: "loading"
        });
        if (result) {
          setTimeout(() => {
            wx.hideToast();
            wx.showModal({
              title: "帮助成功",
              content: "答题可免费换取礼品哦，您也要来答题吗？",
              success: () => {
                uni.reLaunch({ url: "/pages/challenge/question/index" });
              }
            });
          }, 1000);
        }
      }
    },
    /**
     * @description 检测是否已在今天帮助过该用户
     */
    async checkUseful() {
      let userId = await wx.getStorageSync("userId");
      if (this.linkInfo.friendId === userId) {
        wx.showModal({
          title: "操作失败",
          content: "咱是个讲原则的小程序，不能自己帮自己哦。",
          showCancel: false
        });
        return;
      } else {
        let friendArr = wx.getStorageSync("friendId")
          ? wx.getStorageSync("friendId")
          : [];
        let helpTime = wx.getStorageSync("helpTime");
        let d = new Date();
        let now =
          d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
        if (friendArr && friendArr.length > 0) {
          let flag = false;
          friendArr.map(item => {
            if (item === this.linkInfo.friendId && helpTime === now) {
              flag = true;
            }
          });
          if (flag) {
            wx.showModal({
              title: "帮助失败",
              content: "您今天已经帮助过他了哦",
              showCancel: false
            });
            return;
          }
        } else {
          friendArr.push(this.linkInfo.friendId);
          wx.setStorageSync("helpTime", now);
        }
      }
    }
  },
  onLoad(params) {
    this.linkInfo = params;
    wx.getSystemInfo({
      success: res => {
        if (res.screenHeight > 736) {
          this.needReset = true;
        }
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.share {
  height: 100%;
  width: 100%;
  background: url("http://file.xmxui.com/1579008528686") no-repeat;
  background-position: 0 0;
  background-size: 100% 100%;
  .title {
    text-align: center;
    font-size: 60rpx;
    color: #ffffff;
    padding-top: 100rpx;
    text-shadow: 8rpx 8rpx 8rpx #ee86ad;
  }
  .title-tips {
    text-align: center;
    font-size: 60rpx;
    color: #ffffff;
    padding-top: 30rpx;
    text-shadow: 8rpx 8rpx 8rpx #ee86ad;
  }
  .tips-label {
    text-align: center;
    padding: 500rpx 40rpx 20rpx 40rpx;
    color: #ffffff;
    font-size: 40rpx;
    text-shadow: 4rpx 4rpx 4rpx #666666;
    &.highScreen {
      padding: 650rpx 40rpx 20rpx 40rpx;
    }
  }
  .tips-answer {
    text-align: center;
    font-size: 30rpx;
    color: #ffffff;
    text-shadow: 4rpx 4rpx 4rpx #666666;
  }
  .help-button {
    text-align: center;
    width: 670rpx;
    background: rgba(255, 255, 255, 0.3);
    color: rgba(255, 255, 255, 0.75);
    letter-spacing: 3rpx;
    font-size: 34rpx;
    line-height: 34rpx;
    margin: 30rpx 40rpx 0;
    padding: 23rpx 0;
    border-radius: 45px;
    box-shadow: 4rpx 4rpx 4rpx #ffc0c9a6;
    transition: 0.3s ease-in-out all;
  }
  .button-hover {
    background: rgba(255, 255, 255, 0.5);
  }
  .copy-right {
    position: absolute;
    bottom: 30rpx;
    font-size: 24rpx;
    line-height: 24rpx;
    color: #ffffff;
    text-shadow: 2rpx 2rpx 2rpx #999999;
    text-align: center;
    width: 100%;
  }
}
</style>
