<template>
  <div class="baby-details">
    <div class="baby-details-item" hover-class="active">
      <div class="label">
        宝宝名称：
      </div>
      <div class="container">
        <input type="text" class="input-container" v-model="babyInfo.name">
      </div>
    </div>
    <div class="baby-details-item" hover-class="active">
      <div class="label">
        出生日期：
      </div>
      <div class="container">
        <picker mode="date" :value="babyInfo.birthDay" :start="startDate" :end="endDate" @change="birthDayChange">
          <div class="uni-input">{{ babyInfo.birthDay }}</div>
        </picker>
      </div>
    </div>
    <div class="baby-details-item" hover-class="active">
      <div class="label">
        宝宝性别：
      </div>
      <div class="container">
        <radio-group @change="changeSex">
          <label class="radio">
            <radio value="1" color="#EE7BA6" :checked="parseInt(babyInfo.sex) === 1"/>
            男
          </label>
          <label class="radio">
            <radio value="2" color="#EE7BA6" :checked="parseInt(babyInfo.sex) === 2"/>
            女
          </label>
        </radio-group>
      </div>
    </div>
    <div class="btn-area">
      <button class="btn-delete btn" hover-class="active" @click="deleteBabyInfo">删除</button>
      <button class="btn-update btn" hover-class="active" @click="updateBabyInfo">保存</button>
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
        birthDay: "2011-01-01",
        sex: 1
      },
      startDate: "2000-01-01",
      endDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
    }
  },
  onLoad: function (options) {
    this.getBabyInfo(options)
  },
  methods: {
    /**
     * @description 获取宝宝详情
     * @param options
     * @return {Promise<void>}
     */
    async getBabyInfo(options) {
      this.babyInfo = await this.$ajax.post("/api/baby/getBabyDetails", options)
    },
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
     * @description 删除宝宝信息
     */
    async deleteBabyInfo() {
      let result = this.$ajax.post("/api/baby/deleteBabyInfo", this.babyInfo)
      if (result) {
        wx.showToast({
          title: "操作成功",
          duration: 2000
        });
        setTimeout(() => {
          uni.navigateTo({url: "/pages/personal/baby/index"})
        }, 2000)
      }
    },
    /**
     * @description 更新宝宝信息
     */
    updateBabyInfo() {
      let result = this.$ajax.post("/api/baby/updateBabyInfo", this.babyInfo)
      if (result) {
        wx.showToast({
          title: "操作成功",
          duration: 2000
        });
        setTimeout(() => {
          uni.navigateTo({url: "/pages/personal/baby/index"})
        }, 2000)
      }
    }
  }
}
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

    .btn-area {
      position: absolute;
      left: 0;
      bottom: 50rpx;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      -webkit-border-radius: 8rpx 8rpx 8rpx;
      -moz-border-radius: 8rpx 8rpx 8rpx;
      border-radius: 8rpx 8rpx 8rpx;

      .btn {
        width: 50%;
        text-align: center;
        -webkit-border-radius: none;
        -moz-border-radius: none;
        border-radius: none;
        border: none;

        &.btn-delete {
          color: #333333;
          background-color: #E8ECF2;
        }

        &.btn-update {
          color: #ffffff;
          background-color: #EE7BA6;
        }
      }
    }

    .active {
      background-color: #E8ECF2;
    }
  }
</style>
