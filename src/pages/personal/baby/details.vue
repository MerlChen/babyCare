<template>
  <div class="baby-details">
    <div class="baby-details-item" hover-class="active">
      <div class="label">宝宝名称：</div>
      <div class="container">
        <input type="text" class="input-container" v-model="babyInfo.name" />
      </div>
    </div>
    <div class="baby-details-item" hover-class="active">
      <div class="label">出生日期：</div>
      <div class="container">
        <picker
          mode="date"
          :value="babyInfo.birthDay"
          :start="startDate"
          :end="endDate"
          @change="birthDayChange"
        >
          <div class="uni-input">{{ babyInfo.birthDay }}</div>
        </picker>
      </div>
    </div>
    <div class="baby-details-item" hover-class="active">
      <div class="label">宝宝性别：</div>
      <div class="container">
        <picker :value="babyInfo.sex" range-key="name" :range="sexList" @change="changeSex">
          <div class="uni-input">{{ sexLabel }}</div>
        </picker>
      </div>
    </div>
    <div class="btn-area">
      <div class="btn-delete btn" hover-class="active" @click="deleteBabyInfo">删除</div>
      <div class="btn-update btn" hover-class="active" @click="updateBabyInfo">保存</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "details",
  data() {
    return {
      babyInfo: {
        name: "宝宝姓名",
        birthDay: "2000-01-01",
        sex: ""
      },
      sexLabel: "",
      startDate: "2000/01/01",
      endDate:
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate(),
      sexList: [
        {
          id: "",
          name: "请选择"
        },
        {
          id: "1",
          name: "男"
        },
        {
          id: "2",
          name: "女"
        }
      ]
    };
  },
  onLoad: function(options) {
    this.getBabyInfo(options);
  },
  methods: {
    /**
     * @description 获取宝宝详情
     * @param options
     * @return {Promise<void>}
     */
    async getBabyInfo(options) {
      this.babyInfo = await this.$ajax.post(
        "/api/baby/getBabyDetails",
        options
      );
      this.sexList.map(item => {
        if (parseInt(this.babyInfo.sex, 10) === parseInt(item.id, 10)) {
          this.sexLabel = item.name;
        }
      });
    },
    /**
     * @description 更改出生日期
     * @param res
     */
    birthDayChange(res) {
      this.babyInfo.birthDay = res.detail.value;
    },
    /**
     * @description 更改性别
     * @param res
     */
    changeSex(res) {
      this.babyInfo.sex = this.sexList[res.detail.value].id;
      this.sexLabel = this.sexList[res.detail.value].name;
    },
    /**
     * @description 删除宝宝信息
     */
    async deleteBabyInfo() {
      let result = this.$ajax.post("/api/baby/deleteBabyInfo", this.babyInfo);
      if (result) {
        wx.showToast({
          title: "操作成功",
          duration: 2000
        });
        setTimeout(() => {
          uni.reLaunch({ url: "/pages/personal/index?toBabyList=true" });
        }, 2000);
      }
    },
    /**
     * @description 更新宝宝信息
     */
    updateBabyInfo() {
      if (!this.babyInfo.name || this.babyInfo.name.trim() === "") {
        wx.showToast({
          title: "请输入姓名"
        });
        return;
      }
      if (!this.babyInfo.sex || this.babyInfo.sex === "") {
        wx.showToast({
          title: "请选择性别"
        });
        return;
      }
      let result = this.$ajax.post("/api/baby/updateBabyInfo", this.babyInfo);
      if (result) {
        wx.showToast({
          title: "操作成功",
          duration: 2000
        });
        setTimeout(() => {
          uni.reLaunch({ url: "/pages/personal/index?toBabyList=true" });
        }, 2000);
      }
    }
  }
};
</script>

<style lang="scss">
.baby-details {
  background-color: #ffffff;
  min-height: 100%;
  position: relative;

  .baby-details-item {
    height: 120rpx;
    line-height: 120rpx;
    width: calc(100% - 60rpx);
    display: flex;
    justify-content: flex-start;
    border-bottom: 2rpx solid #e8ecf2;
    padding: 0 30rpx;

    .label {
      width: 140rpx;
      color: #c8c7cc;
    }

    .container {
      width: calc(100% - 140rpx);

      .input-container {
        line-height: 120rpx;
        height: 120rpx;
      }

      .radio {
        margin-right: 10rpx;
      }
    }
  }

  .btn-area {
    position: absolute;
    left: 0;
    bottom: 50rpx;
    width: 100%;
    -webkit-border-radius: 8rpx 8rpx 8rpx;
    -moz-border-radius: 8rpx 8rpx 8rpx;
    border-radius: 8rpx 8rpx 8rpx;

    .btn {
      left: 30rpx;
      bottom: 40rpx;
      width: 690rpx;
      color: #ee7ba6;
      padding: 30rpx 0;
      font-size: 34rpx;
      line-height: 34rpx;
      position: absolute;
      text-align: center;
      background-color: #ffffff;
      border: 1rpx solid #ee7ba6;
      -webkit-border-radius: 45rpx;
      -moz-border-radius: 45rpx;
      border-radius: 45rpx;
      &.btn-update {
        bottom: 160rpx;
        background-color: #ee7ba6;
        color: #ffffff;
      }
    }
  }

  .active {
    background-color: #e8ecf2;
  }
}
</style>
