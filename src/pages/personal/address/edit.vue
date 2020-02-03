<template>
  <div class="edit-address">
    <div class="edit-address-form">
      <div class="edit-address-item">
        <div class="label">收货人</div>
        <input class="value" type="text" v-model="addressInfo.name" placeholder="请输入收货人姓名" />
      </div>
      <div class="edit-address-item">
        <div class="label">联系电话</div>
        <input class="value" type="digit" v-model="addressInfo.phone" placeholder="请输入收货人联系电话" />
      </div>
      <div class="edit-address-item">
        <div class="label">省市区</div>
        <picker
          mode="region"
          v-model="addressInfo.region"
          class="value"
          @change="changeRegion"
        >{{ addressInfo.region[0] + addressInfo.region[1]+addressInfo.region[2] }}</picker>
      </div>
      <div class="edit-address-item">
        <div class="label">详细地址</div>
        <input class="value" v-model="addressInfo.details" type="text" placeholder="请输入详细地址" />
      </div>
    </div>
    <div class="set-to-default" :class="{'is-default': addressInfo.isDefault}">
      <checkbox-group @change="toggleDefault">
        <checkbox value="isDefault" :checked="addressInfo.isDefault" color="#55A1DC" />设为默认地址
      </checkbox-group>
    </div>
    <button class="confirm-save" hover-class="button-hover" @click="saveAddressInfo">保存</button>
    <button class="confirm-save delete" hover-class="button-hover" @click="deleteAddressInfo">删除</button>
  </div>
</template>

<script>
export default {
  name: "addAddress",
  data() {
    return {
      addressInfo: {
        isDefault: false,
        name: "",
        phone: "",
        regions: ["", "", ""],
        details: ""
      },
      params: {}
    };
  },
  methods: {
    /**
     * @description 获取详细地址数据信息
     */
    async getAddressDetails() {
      let addressInfo = await this.$ajax.post("/api/address/details", {
        id: this.params.addressId
      });
      addressInfo.region = JSON.parse(addressInfo.region);
      this.addressInfo = addressInfo;
    },
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
     * @description 更新地址数据信息
     */
    async saveAddressInfo() {
      let addressInfo = JSON.parse(JSON.stringify(this.addressInfo));
      addressInfo.region = JSON.stringify(addressInfo.region);
      let result = await this.$ajax.post("/api/address/edit", addressInfo);
      if (result) {
        uni.showToast({
          title: "操作成功"
        });
        this.changeToList();
      } else {
        uni.showModal({
          content: "修改地址信息失败，请重试。",
          showCancel: false
        });
      }
    },
    /**
     * @description 删除地址数据信息
     */
    async deleteAddressInfo() {
      let result = await this.$ajax.post(
        "/api/address/delete",
        this.addressInfo
      );
      if (result) {
        uni.showToast({
          title: "操作成功"
        });
        this.changeToList();
      } else {
        uni.showModal({
          content: "删除地址信息失败，请重试。",
          showCancel: false
        });
      }
    },
    /**
     * @description 界面跳转
     */
    changeToList() {
      setTimeout(() => {
        uni.redirectTo({
          url: "/pages/personal/address/index?id=" + this.params.id
        });
      }, 2000);
    }
  },
  onLoad(params) {
    this.params = params;
    this.getAddressDetails();
  }
};
</script>

<style lang="scss" scoped>
.edit-address {
  .edit-address-form {
    background-color: #ffffff;
    padding: 0 20rpx;

    .edit-address-item {
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
    bottom: 150rpx;
    transition: 0.3s ease-in-out background;
    &.delete {
      bottom: 40rpx;
    }
    &.button-hover {
      opacity: 0.7;
    }
  }
}
</style>
