<template>
  <div class="add-message">
    <div class="article-title">
      {{ articleInfo.articleName }}
    </div>
    <textarea
      class="article-content"
      placeholder="留言经过筛选后显示，对所有人可见..."
      v-model="articleInfo.content"
    >
    </textarea>
    <div class="tips">
      留言请遵守当地法律法规，违禁者，将会限制本小程序的使用
    </div>
    <div
      class="btn-send"
      @click="sendMessage"
      :class="{'disabled': articleInfo.content.length === 0}"
      hover-class="button-hover"
    >
      订阅并留言
    </div>
  </div>
</template>

<script>
export default {
  name: "addMessage",
  data() {
    return {
      articleInfo: {
        articleName: "",
        articleId: "",
        content: "",
        userId: "",
        nickName: "",
        avatarUrl: "",
        openId: ""
      }
    }
  },
  methods: {
    /**
     * @description 提交留言
     */
    sendMessage() {
      let _this = this;
      uni.requestSubscribeMessage({
        tmplIds: ['ks1LgFs15g2vpX4WUGuhdYr7B-NwZ18dRA2OKzxlZCU'],
        success: function (res) {
          if (res['ks1LgFs15g2vpX4WUGuhdYr7B-NwZ18dRA2OKzxlZCU'] === 'accept') {
            _this.submitMessage();
          }
        },
        fail: function (err) {
          wx.showToast({
            title: "未能完成订阅"
          })
        }
      })
    },
    async submitMessage() {
      let _this = this;
      let userInfo = JSON.parse(wx.getStorageSync("userInfo"))
      _this.articleInfo.userId = wx.getStorageSync("userId")
      _this.articleInfo.nickName = userInfo.nickName;
      _this.articleInfo.avatarUrl = userInfo.avatarUrl;
      _this.articleInfo.openId = userInfo.openId;
      if (_this.articleInfo.content && _this.articleInfo.content.trim() !== "") {
        let result = await _this.$ajax.post("/api/comment/add", _this.articleInfo)
        if (result) {
          wx.showToast({
            title: "留言成功"
          })
          setTimeout(() => {
            wx.reLaunch({url: "/pages/article/details?id=" + _this.articleInfo.articleId})
          }, 2000)
        } else {
          wx.showModal({
            title: "留言提交失败",
            showCancel: false
          })
        }
      } else {
        console.error("消息数据有问题")
      }
    }
  },
  onLoad: function (params) {
    this.articleInfo.articleName = params.articleName;
    this.articleInfo.articleId = params.articleId;
  }
}
</script>

<style lang="scss" scoped>
  .add-message {
    background-color: #ffffff;
    min-height: 100%;

    .article-title {
      width: calc(100% - 80rpx);
      margin: 0 40rpx 0;
      padding-top: 40rpx;
      font-size: 26rpx;
      line-height: 50rpx;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      border-bottom: 2rpx solid #D7DCE6;
    }

    .article-content {
      width: calc(100% - 80rpx);
      margin: 0 40rpx;
      font-size: 26rpx;
      line-height: 45rpx;
      color: #333333;
      min-height: 200rpx;
      border-bottom: 2rpx solid #D7DCE6;
    }

    .tips {
      width: calc(100% - 80rpx);
      margin: 0 40rpx;
      color: #999999;
      font-size: 26rpx;
      line-height: 50rpx;
      border-bottom: 2rpx solid #D7DCE6;
    }

    .btn-send {
      width: 670rpx;
      height: 90rpx;
      background: linear-gradient(94deg, rgba(238, 123, 166, 1), rgba(240, 149, 183, 1));
      border-radius: 45rpx;
      color: #FFFFFF;
      font-size: 34rpx;
      text-align: center;
      line-height: 90rpx;
      margin: 40rpx 40rpx;
      position: relative;

      &.disabled {
        background: #E8E8E8;
        color: #999999;
      }

      &.button-hover {
        background: #E8E8E8;
        color: #ffffff;
      }
    }
  }
</style>
