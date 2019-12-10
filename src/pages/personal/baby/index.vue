<template>
  <div class="my-baby-page">
    <div
      class="my-baby-item"
      v-for="item in list"
      :key="item.id"
      hover-class="hover-item"
      @click="getBabyInfo(item)"
    >
      <div class="baby-info">
        <div class="baby-sex">
          <img
            src="@/static/personal/baby/girl.png"
            alt=""
            v-if="parseInt(item.sex) === 2"
          >
          <img
            src="@/static/personal/baby/boy.png"
            alt=""
            v-if="parseInt(item.sex) === 1"
          >
        </div>
        <div class="baby-basic">
          <div class="baby-name">
            {{ item.name }}
          </div>
          <div class="baby-birthday">
            {{ '出生日期：' + item.birthDay }}
          </div>
        </div>
      </div>
      <div class="baby-age">
        {{ ageDiffCount(item.birthDay) }}
      </div>
    </div>
    <div
      class="my-baby-item is-add"
      @click="addBabyInfo"
      hover-class="button-hover"
    >
      + 添加数据
    </div>
  </div>
</template>

<script>
import {ageDiffCount} from "../../../tools/dataFormat"

export default {
  name: "babyList",
  data() {
    return {
      list: []
    }
  },
  mounted() {
    this.getBabyList()
  },
  methods: {
    ageDiffCount,
    /**
     * @description 获取宝宝列表信息
     */
    async getBabyList() {
      this.list = await this.$ajax.post("/api/baby/getBabyList", {
        userId: wx.getStorageSync("userId")
      })
    },
    /**
     * @description 获取宝宝详细信息
     * @param babyData
     */
    getBabyInfo(babyData) {
      uni.navigateTo({url: "/pages/personal/baby/details?id=" + babyData.id})
    },
    /**
     * @description 添加宝宝数据
     */
    addBabyInfo() {
      uni.navigateTo({url: "/pages/personal/baby/add"})
    }
  }
}
</script>

<style lang="scss" scoped>
  .my-baby-page {
    min-height: 100%;
    background-color: #ffffff;
    .my-baby-item {
      width: calc(100% - 60rpx);
      padding: 30rpx 30rpx 30rpx;
      border-bottom: 1rpx solid #E8E8E8;
      display: flex;
      justify-content: space-between;
      position: relative;

      .baby-info {
        display: flex;
        justify-content: flex-start;

        .baby-sex {
          width: 100rpx;
          height: 100rpx;
          -webkit-border-radius: 100%;
          -moz-border-radius: 100%;
          border-radius: 100%;
          border: 2rpx solid #E8E8E8;
          position: relative;
          margin-right: 20rpx;

          img {
            width: 60rpx;
            height: 60rpx;
            position: absolute;
            left: 20rpx;
            top: 20rpx;
          }
        }

        .baby-basic {
          .baby-name {
            font-size: 30rpx;
            line-height: 30rpx;
            font-weight: bold;
            margin: 15rpx 0 10rpx;
          }

          .baby-birthday {
            color: #666666;
          }
        }
      }

      .baby-age {
        line-height: 100rpx;
        float: right;
        color: #EE7BA6;
        font-size: 28rpx;
        font-weight: 600;
      }

      &.is-add {
        justify-content: center;
      }
    }

    .button-hover {
      background-color: #E8E8E8;
      color: #ffffff;
    }
    .hover-item{
      background-color: #E8E8E8;
    }
  }
</style>
