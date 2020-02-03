<!--
 * @Author: Louis
 * @Date: 2020-01-20 16:39:02
 * @Email: huangxin1273@vip.qq.com
 * @LastEditors  : Louis
 * @LastEditTime : 2020-02-02 13:40:20
 * @Description: 调整文件图片
 -->
<template>
  <div class="about-us">
    <img class="about-logo" src="http://file.xmxui.com/logo2.png" />
    <div class="description" :class="{'needReset':needReset}">育婴宝库-专注科学育儿知识传播</div>
    <div class="author">作者微信：186-7446-0902</div>
    <div class="tips">商业合作微信：186-7446-0902</div>
    <div class="auth-info">版权所有&copy; 育婴宝库团队所有</div>
  </div>
</template>
<script>
export default {
  name: "aboutUS",
  data() {
    return {
      needReset: false
    };
  },
  onLoad() {
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
.about-us {
  height: 100%;
  width: 100%;
  text-align: center;
  background: url("http://file.xmxui.com/1579008528686") no-repeat;
  background-position: 0 0;
  background-size: 100% 100%;
  position: relative;
  font-size: 30rpx;
  color: #ffffff;
  text-shadow: 4rpx 4rpx 4rpx #666666;
  .about-logo {
    width: 300rpx;
    height: 300rpx;
    margin: 50rpx 225rpx 50rpx;
  }
  .description {
    font-size: 42rpx;
    padding-top: 400rpx;
    &.needReset {
      padding-top: 650rpx;
    }
  }
  .author {
    position: absolute;
    bottom: 140rpx;
    width: 100%;
  }
  .tips {
    position: absolute;
    bottom: 80rpx;
    width: 100%;
  }
  .auth-info {
    position: absolute;
    bottom: 20rpx;
    width: 100%;
    text-align: center;
    font-size: 24rpx;
  }
}
</style>