<template>
  <div class="address-manage">
    <div class="address-list" v-if="list.length > 0">
      <div class="address-item" v-for="item in list" :key="item.id" @click="selectAddress(item)">
        <div class="address-item-container">
          <div class="address-item-main">
            <div class="address-item-main-name">{{ item.name }}</div>
            <div class="address-item-main-phone">{{ item.phone }}</div>
          </div>
          <div class="address-item-details">{{ item.address }}</div>
        </div>
        <img src="../../../static/edit.png" alt @click.stop="editAddressInfo(item)" />
      </div>
    </div>
    <div class="no-address-tips" v-if="list.length === 0">暂无地址数据，点击下方添加按钮进行添加</div>
    <button class="address-add" hover-class="button-active" @click="addAddressInfo">添加新地址</button>
  </div>
</template>
<script>
export default {
  name: "addressList",
  data() {
    return {
      list: [],
      params: {}
    };
  },
  computed: {
    userId() {
      return wx.getStorageSync("userId");
    }
  },
  methods: {
    /**
     * @description 获取地址列表数据
     */
    async getAddressList() {
      this.list = await this.$ajax.post("/api/address/list", {
        userId: this.userId
      });
    },
    /**
     * @description 编辑地址信息
     * @param itemData
     */
    editAddressInfo(itemData) {
      uni.navigateTo({
        url:
          "/pages/personal/address/edit?addressId=" +
          itemData.id +
          "&id=" +
          this.params.id
      });
    },
    /**
     * @description 选中的地址信息
     * @param itemData
     */
    selectAddress(itemData) {
      uni.redirectTo({
        url:
          "/pages/personal/myOrder/toOrder?addressId=" +
          itemData.id +
          "&id=" +
          this.params.id
      });
    },
    /**
     * @description 添加新地址
     */
    addAddressInfo() {
      uni.navigateTo({
        url: "/pages/personal/address/add?id=" + this.params.id
      });
    }
  },
  onLoad(params) {
    this.params = params;
    this.getAddressList();
  }
};
</script>
<style lang="scss" scoped>
.address-manage {
  height: 100%;
  position: relative;

  .no-address-tips {
    text-align: center;
    color: #666666;
    font-size: 24rpx;
    line-height: 200rpx;
  }

  .address-list {
    height: calc(100% - 160rpx);
    overflow-y: auto;

    .address-item {
      width: 100%;
      position: relative;
      background-color: #ffffff;
      border-bottom: 2rpx solid #d7dce6;

      &:nth-last-child(1) {
        border: none;
      }

      .address-item-container {
        width: calc(100% - 60rpx);
        padding: 20rpx 40rpx 20rpx 20rpx;

        .address-item-main {
          font-size: 30rpx;
          line-height: 46rpx;
          color: #333333;
          display: flex;
          justify-content: flex-start;

          .address-item-main-name {
            margin-right: 40rpx;
          }

          .address-item-main-phone {
            color: #666666;
            font-size: 24rpx;
          }
        }

        .address-item-details {
          font-size: 24rpx;
          color: #666666;
          line-height: 40rpx;
        }
      }

      img {
        width: 60rpx;
        height: 60rpx;
        position: absolute;
        right: 20rpx;
        top: 14rpx;
      }
    }
  }

  .address-add {
    color: #ffffff;
    width: calc(100% - 80rpx);
    background: linear-gradient(
      94deg,
      rgba(238, 123, 166, 1),
      rgba(240, 149, 183, 1)
    );
    border-radius: 45rpx;
    position: absolute;
    bottom: 40rpx;
    left: 40rpx;
    transition: 0.3s ease-in-out background;

    &.button-active {
      opacity: 0.7;
    }
  }
}
</style>
