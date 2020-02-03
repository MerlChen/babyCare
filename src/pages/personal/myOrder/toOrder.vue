<!--
 * @Author: Louis
 * @Date: 2020-01-31 19:09:32
 * @Email: huangxin1273@vip.qq.com
 * @LastEditors  : Louis
 * @LastEditTime : 2020-02-03 23:12:44
 * @Description: 订单提交界面
 -->
<template>
  <div class="to-order">
    <div class="to-order-address" @click="changeAddressInfo" v-if="addressInfo && addressInfo.name">
      <div class="to-order-address-main">
        <div class="address-item address-name">{{ addressInfo.name }}</div>
        <div class="address-item address-phone">{{ addressInfo.phone }}</div>
        <div class="address-item address-details">{{ addressInfo.address }}</div>
      </div>
      <img src="../../../static/right.png" alt />
    </div>
    <div class="to-order-address-add" v-else @click="addNewAddress">
      新增收货地址
      <img src="../../../static/right.png" alt />
    </div>
    <div class="goods-info">
      <img class="goods-info-pic" :src="goodsInfo.thumb" />
      <div class="goods-info-main">
        <div class="goods-info-name">{{ goodsInfo.name }}</div>
        <div class="goods-info-price">{{ goodsInfo.foldScoreNum + "积分" }}</div>
      </div>
    </div>
    <div class="to-order-details">
      <div class="to-order-details-total">
        合计：
        <div class="price">{{ goodsInfo.foldScoreNum }}</div>积分
      </div>
      <div class="to-order-details-button" @click="confirmChange">确定兑换</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "toOrder",
  data() {
    return {
      addressInfo: {},
      params: {},
      goodsInfo: {},
      userInfo: {}
    };
  },
  methods: {
    /**
     * @description 获取用户信息
     */
    getUserInfo() {
      this.userInfo = JSON.parse(wx.getStorageSync("userInfo"));
      if (!this.params.addressId) {
        this.getDefaultAddressInfo();
      } else {
        this.getAddressInfo();
      }
      this.getCommodityInfo();
    },
    /**
     * @description 获取用户的默认地址信息
     */
    async getDefaultAddressInfo() {
      this.addressInfo = await this.$ajax.post(
        "/api/address/getUserDefaultAddress",
        {
          userId: this.userInfo.userId,
          isDefault: true
        }
      );
    },
    /**
     * @description 获取指定收货地址信息
     */
    async getAddressInfo() {
      this.addressInfo = await this.$ajax.post("/api/address/details", {
        id: this.params.addressId
      });
    },
    /**
     * @description 获取商品信息
     */
    async getCommodityInfo() {
      this.goodsInfo = await this.$ajax.post("/api/commodity/details", {
        id: this.params.id
      });
    },
    /**
     * @description 确认兑换
     */
    async confirmChange() {
      uni.showLoading();
      // 检测参数是否异常
      let tips;
      if (!this.addressInfo.id) {
        uni.showModal({
          content: "请选择收件地址信息",
          showCancel: false
        });
        return;
      }
      let result = this.$ajax.post("/api/order/add", {
        commodityId: this.params.id,
        userId: this.userInfo.userId,
        addressId: this.addressInfo.id
      });
      if (result && !result.engine) {
        setTimeout(() => {
          uni.showToast({
            title: "兑换成功"
          });
          setTimeout(() => {
            uni.reLaunch({ url: "/pages/personal/index" });
          }, 2000);
        }, 3000);
      }
    },
    /**
     * @description 更改收货地址
     */
    changeAddressInfo() {
      uni.redirectTo({
        url: "/pages/personal/address/index?id=" + this.goodsInfo.id
      });
    },
    /**
     * @description 添加新地址
     */
    addNewAddress() {
      uni.redirectTo({
        url: "/pages/personal/address/add?id=" + this.goodsInfo.id
      });
    }
  },
  onLoad(params) {
    this.params = params;
    this.getUserInfo();
  }
};
</script>
<style lang="scss" scoped>
.to-order {
  min-height: 100%;

  .to-order-address {
    background-color: #ffffff;
    margin-bottom: 16rpx;

    .to-order-address-main {
      padding: 20rpx 60rpx 20rpx 24rpx;

      .address-name {
        font-size: 30rpx;
      }

      .address-phone {
        color: #666666;
        font-size: 28rpx;
        margin: 10rpx 0;
      }

      .address-details {
        color: #666666;
        font-size: 24rpx;
      }
    }

    img {
      width: 24rpx;
      height: 24rpx;
      position: absolute;
      right: 20rpx;
      top: 78rpx;
    }
  }

  .to-order-address-add {
    height: 100rpx;
    line-height: 100rpx;
    color: #c7c7cc;
    font-size: 28rpx;
    position: relative;
    background-color: #ffffff;
    margin-bottom: 16rpx;
    padding-left: 24rpx;

    img {
      width: 24rpx;
      height: 24rpx;
      position: absolute;
      top: 38rpx;
      right: 40rpx;
    }
  }

  .goods-info {
    background-color: #ffffff;
    padding: 24rpx 28rpx 24rpx 24rpx;
    display: flex;
    justify-content: flex-start;

    .goods-info-pic {
      width: 210rpx;
      height: 210rpx;
      margin-right: 20rpx;
    }

    .goods-info-main {
      width: calc(100% - 230rpx);

      .goods-info-name {
        font-size: 30rpx;
        line-height: 30rpx;
        color: #333333;
        margin-top: 4rpx;
      }

      .goods-info-description {
        font-size: 20rpx;
        line-height: 24rpx;
        height: 72rpx;
        margin-top: 24rpx;
        color: #999999;
      }

      .goods-info-price {
        font-size: 30rpx;
        margin-top: 24rpx;
        line-height: 30rpx;
        color: #ee7ba6;
      }
    }
  }

  .to-order-details {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;

    .to-order-details-total {
      padding: 29rpx 28rpx;
      font-size: 30rpx;
      color: #848484;
      display: flex;
      justify-content: flex-start;

      .price {
        color: #ee7ba6;
        margin-right: 10rpx;
      }
    }

    .to-order-details-button {
      font-size: 34rpx;
      padding: 27rpx 52rpx;
      background: linear-gradient(
        94deg,
        rgba(238, 123, 166, 1),
        rgba(240, 149, 183, 1)
      );
      color: #ffffff;
      transition: 0.3s ease-in-out all;
      &.button-hover {
        opacity: 0.7;
      }
    }
  }
}
</style>
