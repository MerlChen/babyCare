<template>
  <div class="add-address">
    <div class="add-address-form">
      <div class="add-address-item">
        <div class="label">收货人</div>
        <input class="value" type="text" v-model="addressInfo.name" placeholder="请输入收货人姓名" />
      </div>
      <div class="add-address-item">
        <div class="label">联系电话</div>
        <input class="value" type="digit" v-model="addressInfo.phone" placeholder="请输入收货人联系电话" />
      </div>
      <div class="add-address-item">
        <div class="label">省市区</div>
        <picker
          mode="region"
          v-model="addressInfo.region"
          class="value"
          @change="changeRegion"
        >{{ addressInfo.region[0] + addressInfo.region[1]+addressInfo.region[2] }}</picker>
      </div>
      <div class="add-address-item">
        <div class="label">详细地址</div>
        <input class="value" type="text" v-model="addressInfo.details" placeholder="请输入详细地址" />
      </div>
    </div>
    <div class="set-to-default" :class="{'is-default': addressInfo.isDefault}">
      <checkbox-group @change="toggleDefault">
        <checkbox value="isDefault" :checked="addressInfo.isDefault" color="#55A1DC" />设为默认地址
      </checkbox-group>
    </div>
    <button class="confirm-save" hover-class="button-hover" @click="saveAddressInfo">保存</button>
  </div>
</template>

<script>
export default {
  name: "addAddress",
  data() {
    return {
      addressInfo: {
        isDefault: true,
        name: "",
        phone: "",
        region: ["请选择省市区", "", ""],
        details: ""
      },
      params: {}
    };
  },
  methods: {
    /**
     * @description 是否设置成默认地址
     */
    toggleDefault(res) {
      this.addressInfo.isDefault = !!(
        res.detail.value[0] && res.detail.value[0] === "isDefault"
      );
    },
    /**
     * @description 更改省市区
     * @param res
     */
    changeRegion(res) {
      this.addressInfo.region = res.detail.value;
    },
    /**
     * @description 保存地址数据
     */
    async saveAddressInfo() {
      let addressInfo = JSON.parse(JSON.stringify(this.addressInfo));
      addressInfo.userId = wx.getStorageSync("userId");
      addressInfo.region = JSON.stringify(addressInfo.region);
      let result = await this.$ajax.post("/api/address/add", addressInfo);
      if (result) {
        uni.showToast({
          title: "操作成功"
        });
        setTimeout(() => {
          uni.redirectTo({
            url: "/pages/personal/address/index?id=" + this.params.id
          });
        }, 2000);
      } else {
        console.log(result);
        uni.showModal({
          content: "数据保存失败",
          showCancel: false
        });
      }
    }
  },
  onLoad(params) {
    this.params = params;
  }
};
</script>

<style lang="scss" scoped>
.add-address {
  .add-address-form {
    background-color: #ffffff;
    padding: 0 20rpx;

    .add-address-item {
      display: flex;
      justify-content: flex-start;
      height: 100rpx;
      line-height: 100rpx;
      border-bottom: 1rpx solid #e8e8e8;

      .label {
        width: 110rpx;
      }

      .value {
        width: calc(100% - 120rpx);
        height: 100rpx;
        line-height: 100rpx;
        min-height: 100rpx;
      }

      &:nth-last-child(1) {
        border: none;
      }
    }
  }

  .set-to-default {
    margin: 40rpx 20rpx;
    color: #666666;

    &.is-default {
      color: #55a1dc;
    }
  }

  .confirm-save {
    color: #ffffff;
    font-size: 34rpx;
    background: linear-gradient(
      94deg,
      rgba(238, 123, 166, 1),
      rgba(240, 149, 183, 1)
    );
    border-radius: 45rpx;
    width: calc(100% - 80rpx);
    position: absolute;
    left: 40rpx;
    bottom: 40rpx;
    transition: 0.3s ease-in-out background;

    &.button-hover {
      opacity: 0.7;
    }
  }
}
</style>
