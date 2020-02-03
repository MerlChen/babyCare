<template>
  <div class="add-baby-info">
    <div class="add-baby-item" hover-class="active">
      <div class="label">宝宝姓名：</div>
      <div class="container">
        <input type="text" class="input-container" placeholder="请输入宝宝名称" v-model="babyInfo.name" />
      </div>
    </div>
    <div class="add-baby-item" hover-class="active">
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
    <div class="add-baby-item">
      <div class="label">宝宝性别：</div>
      <div class="container">
        <picker :value="babyInfo.sex" range-key="name" :range="sexList" @change="changeSex">
          <div class="uni-input">{{ sexLabel }}</div>
        </picker>
      </div>
    </div>
    <button hover-class="active" class="btn-finished" @click="saveBabyInfo">完成</button>
  </div>
</template>

<script>
export default {
  name: "add",
  data() {
    return {
      babyInfo: {
        name: "",
        sex: "",
        userId: "",
        birthDay:
          new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          new Date().getDate()
      },
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
      ],
      sexLabel: "请选择",
      startDate: "2000-01-01",
      endDate:
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate()
    };
  },
  methods: {
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
     * @description 保存数据信息
     * @return {Promise<void>}
     */
    async saveBabyInfo() {
      let tips = "";
      if (!this.babyInfo.name || this.babyInfo.name.trim() === "") {
        tips = "请填写宝宝名称";
      }
      if (!this.babyInfo.sex || this.babyInfo.sex.trim() === "") {
        tips = "请选择宝宝性别";
      }
      if (tips !== "") {
        wx.showToast({
          title: tips,
          duration: 2000
        });
        return;
      }
      this.babyInfo.userId = wx.getStorageSync("userId");
      let result = await this.$ajax.post(
        "/api/baby/saveBabyInfo",
        this.babyInfo
      );
      if (result) {
        wx.showToast({
          title: "操作成功",
          icon: "success",
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
.add-baby-info {
  background-color: #ffffff;
  min-height: 100%;
  position: relative;

  .add-baby-item {
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
      picker {
        width: 100%;
        height: 120rpx;
        line-height: 120rpx;
      }
      .input-container {
        line-height: 120rpx;
        height: 120rpx;
      }

      .radio {
        margin-right: 10rpx;
      }
    }
  }

  .btn-finished {
    left: 30rpx;
    bottom: 40rpx;
    width: 690rpx;
    color: #ffffff;
    padding: 30rpx 0;
    font-size: 34rpx;
    line-height: 34rpx;
    position: absolute;
    text-align: center;
    background-color: #ee7ba6;
    -webkit-border-radius: 45rpx;
    -moz-border-radius: 45rpx;
    border-radius: 45rpx;
  }

  .active {
    background-color: #e8ecf2;
  }
}
</style>
