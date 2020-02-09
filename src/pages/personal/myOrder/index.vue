<!--
 * @Author: Louis
 * @Date: 2020-01-21 01:53:43
 * @LastEditors  : Louis
 * @LastEditTime : 2020-02-06 18:35:05
 -->
<template>
  <div class="my-order">
    <div class="my-order-item" v-for="item in list" :key="item.id">
      <div class="my-order-item-time">{{ item.dateInfo }}</div>
      <div class="my-order-item-container">
        <!-- 商品图片 -->
        <img class="my-order-item-commodity-img" :src="item.commodityThumb" />
        <!-- 状态 -->
        <div class="target">
          <div class="target-con">{{ statusChange(item.status) }}</div>
        </div>
        <!-- 商品主要信息区域 -->
        <div class="my-order-commodity-main">
          <div class="my-order-commodity-name">{{ item.commodityName }}</div>
          <div
            class="my-order-track-info"
            v-if="item.status === '4'"
          >{{ item.trackName+":"+item.trackNumber }}</div>
          <div class="my-order-item-info" :class="{ success: item.status !== '6' }">
            <div class="my-order-item-points">{{ item.scoreNum + "积分" }}</div>
          </div>
          <div
            class="button"
            hover-class="button-hover"
            @click="confirmRecive(item)"
            v-if="item.status === '4'"
          >确认签收</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { statusChange } from "./../../../tools/dataFormat";
export default {
  name: "myOrder",
  data() {
    return {
      list: []
    };
  },
  methods: {
    /**
     * @description: 更改状态文本
     * @param {type}
     * @return:
     */

    statusChange,
    /**
     * @description 获取订单列表
     */
    async getOrderList() {
      uni.showLoading();
      let list = await this.$ajax.post("/api/order/list", {
        userId: wx.getStorageSync("userId")
      });
      list.map(item => {
        let d = new Date(item.createTime);
        item.dateInfo =
          d.getFullYear() +
          "/" +
          (d.getMonth() + 1) +
          "/" +
          d.getDate() +
          " " +
          d.getHours() +
          ":" +
          d.getMinutes() +
          ":" +
          d.getSeconds();
      });
      this.list = list;
      uni.hideLoading();
    },
    /**
     * @description 确认操作
     * @param itemData
     */
    confirmRecive(itemData) {
      uni.showModal({
        title: "温馨提示",
        content: "请确认您已经收到了兑换的该物品。",
        success: res => {
          if (res.confirm) {
            uni.showLoading();
            this.confirmOrder(itemData);
          }
        }
      });
    },
    async confirmOrder(itemData) {
      let result = await this.$ajax.post("/api/order/edit", {
        id: itemData.id,
        status: 5
      });
      uni.hideLoading();
      if (result && !result.engine) {
        uni.showToast({
          title: "操作成功"
        });
        this.getOrderList();
      } else {
        uni.showModal({
          content: "操作失败，请重试",
          showCancel: false
        });
      }
    }
  },
  onShow() {
    this.getOrderList();
  }
};
</script>

<style lang="scss" scoped>
.my-order {
  min-height: 100%;

  .my-order-item {
    margin-top: 30rpx;

    .my-order-item-time {
      font-size: 24rpx;
      font-weight: bold;
      color: #848484;
      line-height: 24rpx;
      padding: 0 30rpx 24rpx 30rpx;
    }

    .my-order-item-container {
      background: #ffffff;
      padding: 24rpx 24rpx 24rpx;
      position: relative;
      display: flex;
      justify-content: flex-start;
      box-shadow: 10rpx 3rpx 8rpx 2rpx #d7dce6;

      .my-order-item-commodity-img {
        width: 210rpx;
        height: 210rpx;
        margin-right: 20rpx;
      }

      .target {
        width: 130rpx;
        height: 130rpx;
        overflow: hidden;
        position: absolute;
        top: -3rpx;
        left: -3rpx;

        .target-con {
          text-align: center;
          text-shadow: rgba(95, 91, 91, 0.8) 0 2rpx 0;
          -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
          position: relative;
          padding: 7rpx 0;
          right: 55rpx;
          font-weight: bolder;
          top: 13rpx;
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

      .my-order-commodity-main {
        width: calc(100% - 230rpx);
        position: relative;

        .my-order-commodity-name {
          font-size: 30rpx;
          line-height: 30rpx;
          color: #333333;
        }

        .my-order-commodity-description {
          font-size: 20rpx;
          line-height: 24rpx;
          height: 72rpx;
          margin-top: 24rpx;
          color: #999999;
        }

        .my-order-track-info {
          line-height: 100rpx;
          font-size: 30rpx;
          color: #666666;
        }
        .button {
          background-color: #ee7ba6;
          color: #ffffff;
          padding: 15rpx 20rpx;
          border-radius: 10rpx;
          position: absolute;
          right: 0;
          bottom: 0;
          font-size: 24rpx;
          line-height: 24rpx;
          box-shadow: 4rpx 4rpx 4rpx #d7dce6;
          transition: 0.3s ease-in-out all;
          &.button-hover {
            opacity: 0.7;
          }
        }
        .my-order-item-info {
          position: absolute;
          left: 0;
          bottom: 0;
          font-size: 24rpx;
          line-height: 44rpx;
          color: #999999;
          &.success {
            color: #ee7ba6;
          }
        }
      }
    }
  }
}
</style>
