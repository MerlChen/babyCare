<!--
 * @Author: Louis
 * @Date: 2020-01-31 17:56:28
 * @LastEditors  : Louis
 * @LastEditTime : 2020-02-06 18:28:13
 -->
<template>
  <div class="points-mall">
    <div class="points-mall-head">
      <div class="title">剩余可用积分</div>
      <div class="my-point">{{ userInfo.usefulScore }}</div>
      <div class="my-order" @click="toMyOrder">
        <div class="my-order-label">订单</div>
        <img src="./../../../static/personal/pointsMall/myOrder.png" class="my-order-img" />
      </div>
    </div>
    <div class="commodity-list">
      <div class="title">商品清单</div>
      <div class="commodity-item" @click="showDetails(item)" v-for="item in list" :key="item.id">
        <img class="commodity-item-img" :src="item.thumb" />
        <div class="commodity-item-container">
          <div class="commodity-item-title">{{ item.name }}</div>
          <div class="commodity-item-point">{{ item.foldScoreNum + "积分" }}</div>
        </div>
        <div class="commodity-item-target" v-if="item.lessNum <= 5 && item.lessNum > 0">
          <div class="commodity-item-target-container">{{ "仅剩 " + item.lessNum + " 件" }}</div>
        </div>
        <div class="commodity-item-target" v-if="item.lessNum === 0">
          <div class="commodity-item-target-container">余货不足</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "pointGoods",
  data() {
    return {
      list: [],
      userInfo: {}
    };
  },
  methods: {
    /**
     * @description 获取用户信息，保证积分准确性
     */
    async getUserInfo() {
      const userId = wx.getStorageSync("userId");
      this.userInfo = await this.$ajax.post("/api/user/getUserInfo", {
        userId: userId
      });
      wx.setStorageSync("userInfo", JSON.stringify(this.userInfo));
    },
    /**
     * @description 获取商品列表
     */
    async getCommodityList() {
      this.list = await this.$ajax.post("/api/commodity/all");
    },
    /**
     * @description 查阅历史订单
     */
    toMyOrder() {
      uni.navigateTo({ url: "/pages/personal/myOrder/index" });
    },
    /**
     * @description 展示详情
     * @param itemData
     */
    showDetails(itemData) {
      if (itemData.lessNum === 0) {
        uni.showModal({
          title: "余货不足",
          content: "对不起，此商品已全部兑换完毕，我们将尽快补充货源。",
          showCancel: false
        });
      } else {
        uni.navigateTo({
          url: "/pages/personal/pointsMall/details?id=" + itemData.id
        });
      }
    }
  },
  onShow() {
    this.getUserInfo();
    this.getCommodityList();
  }
};
</script>
<style lang="scss" scoped>
.points-mall {
  min-height: 100%;

  .points-mall-head {
    height: 340rpx;
    width: 100%;
    background: url("http://file.xmxui.com/1579525119678") no-repeat;
    background-size: 100% 100%;
    position: relative;

    .title {
      width: 100%;
      text-align: center;
      font-size: 32rpx;
      line-height: 32rpx;
      color: #ffffff;
      padding-top: 56rpx;
    }

    .my-point {
      text-align: center;
      width: 100%;
      font-size: 60rpx;
      line-height: 60rpx;
      color: #ffffff;
      margin-top: 40rpx;
    }

    .my-order {
      padding: 11rpx 24rpx;
      background: #ffffff;
      position: absolute;
      top: 60rpx;
      right: 0rpx;
      border-radius: 26rpx 0 0 26rpx;
      display: flex;
      justify-content: flex-start;

      .my-order-label {
        font-size: 24rpx;
        line-height: 30rpx;
        color: #ee7ba6;
      }

      .my-order-img {
        width: 30rpx;
        height: 30rpx;
        margin-left: 10rpx;
      }
    }
  }

  .commodity-list {
    padding: 30rpx 30rpx 0 30rpx;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .title {
      width: 100%;
      font-size: 32rpx;
      line-height: 32rpx;
      border-left: 6rpx solid #ee7ba6;
      padding-left: 20rpx;
      color: #ee7ba6;
    }

    .commodity-item {
      margin-top: 30rpx;
      width: calc(calc(100% - 40rpx) / 2);
      background-color: #ffffff;
      position: relative;
      .commodity-item-target {
        width: 130rpx;
        height: 130rpx;
        overflow: hidden;
        position: absolute;
        top: -3rpx;
        left: -3rpx;

        .commodity-item-target-container {
          text-align: center;
          text-shadow: rgba(95, 91, 91, 0.8) 0 2rpx 0;
          -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
          position: relative;
          padding: 7rpx 0;
          right: 50rpx;
          font-weight: bolder;
          top: 20rpx;
          width: 190rpx;
          background-color: #ee7ba5d5;
          background-image: -webkit-gradient(
            linear,
            left top,
            left bottom,
            from(#ee7ba5d5),
            to(#ee7ba6)
          );
          background-image: -webkit-linear-gradient(top, #ee7ba5d5, #ee7ba6);
          color: #ffffff;
          box-shadow: 0px 0px 3rpx rgba(0, 0, 0, 0.5);
        }
      }
      .commodity-item-img {
        width: 100%;
        height: 240rpx;
        border-radius: 4rpx 4rpx 4rpx;
      }

      .commodity-item-container {
        padding: 10rpx 20rpx;
        .commodity-item-title {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 30rpx;
          color: #333333;
        }

        .commodity-item-point {
          line-height: 56rpx;
          font-size: 30rpx;
          color: #ee7ba6;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
