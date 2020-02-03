<!--
 * @Author: Louis
 * @Date: 2020-02-03 21:33:56
 * @Email: huangxin1273@vip.qq.com
 * @LastEditors  : Louis
 * @LastEditTime : 2020-02-03 23:08:21
 * @Description: 商品详情界面
 -->
<template>
  <div class="commodity-details">
    <div class="commodity-container">
      <img :src="dataInfo.thumb" class="commodity-thumb" alt />
      <div class="commodity-name">{{ dataInfo.name }}</div>
      <div class="commodity-decription" v-html="dataInfo.description"></div>
    </div>
    <div class="tool-bar">
      <div class="commodity-price">{{ dataInfo.foldScoreNum +"积分"}}</div>
      <div hover-class="button-hover" class="change-button" @click="toOrder">兑换</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataInfo: {
        name: "",
        thumb: "",
        description: "",
        foldScoreNum: ""
      },
      params: {}
    };
  },
  methods: {
    async getCommodityDetails() {
      let result = await this.$ajax.post("/api/commodity/details", {
        id: this.params.id
      });
      if (result && !result.engine) {
        result.description = result.description.replace(
          /\<img/gi,
          "<img class='content-img'"
        );
        this.dataInfo = result;
      }
    },
    toOrder() {
      uni.navigateTo({
        url: "/pages/personal/myOrder/toOrder?id=" + this.params.id
      });
    }
  },
  onLoad(params) {
    this.params = params;
    this.getCommodityDetails();
  }
};
</script>

<style lang="scss" scoped>
.commodity-details {
  min-height: 100%;
  background: #ffffff;
  position: relative;
  .commodity-container {
    height: calc(100% - 100rpx);
    overflow-y: auto;
    .commodity-thumb {
      width: 100%;
    }
    .commodity-name {
      font-size: 32rpx;
      line-height: 38rpx;
      color: #333333;
      font-weight: bold;
      padding: 0 20rpx;
      margin-bottom: 10rpx;
    }
    .commodity-decription /deep/ {
      p {
        margin: 0;
      }
      .blockquote {
        display: block;
        border-left: 8rpx solid #ee7ba6;
        padding: 20rpx 10rpx;
        margin: 10rpx 0;
        line-height: 34rpx;
        font-size: 28rpx;
        color: #666666;
        font-weight: bold;
        background-color: #f1f1f1;
      }
      .content-img {
        max-width: 750rpx;
      }
    }
  }
  .tool-bar {
    height: 100rpx;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    font-size: 28rpx;
    line-height: 100rpx;
    display: flex;
    justify-content: space-between;
    border-top: 2rpx solid #d7dce6;
    background: #ffffff;
    .commodity-price {
      padding-left: 20rpx;
      color: #ee7ba6;
      font-weight: bold;
    }
    .change-button {
      font-size: 34rpx;
      padding: 0 52rpx;
      color: #ffffff;
      background: linear-gradient(
        94deg,
        rgba(238, 123, 166, 1),
        rgba(240, 149, 183, 1)
      );
      transition: 0.3s ease-in-out all;
      &.button-hover {
        opacity: 0.7;
      }
    }
  }
}
</style>