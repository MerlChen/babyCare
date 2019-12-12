<template>
  <div class="add-baby-info">
    <div class="add-baby-item" hover-class="active">
      <div class="label">
        宝宝姓名：
      </div>
      <div class="container">
        <input type="text" class="input-container" placeholder="请输入宝宝名称" v-model="babyInfo.name">
      </div>
    </div>
    <div class="add-baby-item" hover-class="active">
      <div class="label">
        出生日期：
      </div>
      <div class="container">
        <picker mode="date" :value="babyInfo.birthDay" :start="startDate" :end="endDate" @change="birthDayChange">
          <div class="uni-input">{{ babyInfo.birthDay }}</div>
        </picker>
      </div>
    </div>
    <div class="add-baby-item">
      <div class="label">
        宝宝性别：
      </div>
      <div class="container">
        <radio-group @change="changeSex">
          <label class="radio">
            <radio value="1" color="#EE7BA6" :checked="babyInfo.sex === 1"/>
            男
          </label>
          <label class="radio">
            <radio value="2" color="#EE7BA6" :checked="babyInfo.sex === 2"/>
            女
          </label>
        </radio-group>
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
        sex: 1,
        userId: "",
        birthDay: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
      },
      startDate: "1990-01-01",
      endDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
    }
  },
  methods: {
    /**
     * @description 更改出生日期
     * @param res
     */
    birthDayChange(res) {
      this.babyInfo.birthDay = res.detail.value
    },
    /**
     * @description 更改性别
     * @param res
     */
    changeSex(res) {
      this.babyInfo.sex = res.detail.value;
    },
    /**
     * @description 保存数据信息
     * @return {Promise<void>}
     */
    async saveBabyInfo() {
      let tips = ""
      if (!this.babyInfo.name || this.babyInfo.name.trim() === "") {
        tips = "请填写宝宝名称"
        wx.showToast({
          title: tips,
          icon: "loading",
          duration: 2000
        })
        return
      }
      this.babyInfo.userId = wx.getStorageSync("userId")
      let result = await this.$ajax.post("/api/baby/saveBabyInfo", this.babyInfo)
      if (result) {
        wx.showToast({
          title: "操作成功",
          icon: "success",
          duration: 2000
        })
        setTimeout(() => {
          uni.redirectTo({url: "/pages/personal/baby/index"})
        }, 2000)
      }
    },
  }
}
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
      border-bottom: 2rpx solid #E8ECF2;
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
      background-color: #E8ECF2;
    }
  }
</style>
