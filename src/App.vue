<!--
 * @Author: Louis
 * @Date: 2019-10-25 09:25:21
 * @LastEditors: Louis
 * @LastEditTime: 2019-10-29 09:56:22
 * @Description: 增加用户信息存储至本地
 -->
<template>
</template>

<script>
export default {
  onLaunch: function() {
    // #ifdef APP-PLUS
    // 锁定屏幕方向
    plus.screen.lockOrientation("portrait-primary"); //锁定
    // 检测升级
    uni.request({
      url: "https://uniapp.dcloud.io/update", //检查更新的服务器地址
      data: {
        appid: plus.runtime.appid,
        version: plus.runtime.version,
        imei: plus.device.imei
      },
      success: res => {
        if (res.statusCode == 200 && res.data.isUpdate) {
          let openUrl =
            plus.os.name === "iOS" ? res.data.iOS : res.data.Android;
          // 提醒用户更新
          uni.showModal({
            title: "更新提示",
            content: res.data.note ? res.data.note : "是否选择更新",
            success: showResult => {
              if (showResult.confirm) {
                plus.runtime.openURL(openUrl);
              }
            }
          });
        }
      }
    });
    // #endif
  },
  mounted() {
    wx.showShareMenu({
      withShareTicket: true
    });
  }
};
</script>

<style lang="scss">
.auth-main {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  .auth-dialog {
    position: relative;
    z-index: 3;
    width: 600rpx;
    height: 390rpx;
  }
}

/* #ifndef APP-PLUS-NVUE */
/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
/* 以下样式用于 hello uni-app 演示所需 */
page {
  background-color: #f4f5f6;
  height: 100%;
  font-size: 28rpx;
  line-height: 1.8;
}

.uni-header-logo {
  padding: 30rpx;
  text-align: center;
  margin-top: 10rpx;
}

.uni-header-logo image {
  width: 140rpx;
  height: 140rpx;
}

.uni-hello-text {
  color: #7a7e83;
}

.uni-hello-addfile {
  text-align: center;
  line-height: 300rpx;
  background: #fff;
  padding: 50rpx;
  margin-top: 10px;
  font-size: 38rpx;
  color: #808080;
}

/* #endif*/
</style>
