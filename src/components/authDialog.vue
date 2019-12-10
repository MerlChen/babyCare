<template>
  <!-- 授权弹窗 -->
  <div
    class="auth-main"
    v-if="value"
  >
    <div class="auth-dialog">
      <image
        class="wechat-logo"
        src="./../static/logo.jpg"
      >
      </image>
      <div class="main-title">
        微信授权
      </div>
      <div class="main-tips">
        为了您更好的使用本产品，请先完成微信授权
      </div>
      <button
        class="auth-btn"
        open-type="getUserInfo"
        @getuserinfo="getAuthUserInfo"
      >
        立即授权
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "dialog",
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * @description 授权获取用户信息
     * @param res 授权信息
     */
    getAuthUserInfo(res) {
      if (res.detail.userInfo) {
        uni.showToast({
          title: "授权成功", //提示的内容,
          icon: "success", //图标,
          duration: 2000, //延迟时间,
          mask: true //显示透明蒙层，防止触摸穿透
        });
        this.$emit('change', 'hide')
      } else {
        uni.showToast({
          title: "请重新授权",
          icon: "error",
          duration: 2000,
          mask: true
        })
      }
    }
  }
}
</script>

<style lang="scss">
  /** 授权弹窗样式控制 */
  .auth-main {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 3;

    .auth-dialog {
      position: fixed;
      width: 600rpx;
      height: 390rpx;
      background-color: #ffffff;
      border-radius: 20rpx 20rpx 20rpx;
      left: 75rpx;
      top: 50%;
      margin-top: -300rpx;
      z-index: 4;
      text-align: center;

      .wechat-logo {
        width: 150rpx;
        height: 150rpx;
        border-radius: 100%;
        position: relative;
        margin-top: -75rpx;
        border: 4px solid #e8e8e8;
      }

      .main-title {
        margin-top: 20rpx;
        font-size: 34rpx;
        color: #333333;
      }

      .main-tips {
        margin-top: 16rpx;
        font-size: 24rpx;
        color: #606060;
      }

      .auth-btn {
        width: 370rpx;
        height: 72rpx;
        color: #ffffff;
        font-size: 30rpx;
        text-align: center;
        margin-top: 40rpx;
        background: linear-gradient(
            94deg,
            rgba(238, 123, 166, 1),
            rgba(240, 149, 183, 1)
        );
        border-radius: 36rpx;
      }
    }
  }
</style>
