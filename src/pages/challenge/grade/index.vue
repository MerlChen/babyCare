<template>
  <div class="grade-page">
    <div class="grade-page-bg" :class="{'half': !userInfo.userId}"></div>
    <div class="grade-personal-info" v-if="userInfo && userInfo.userId">
      <img :src="userInfo.avatarUrl" alt="" class="grade-personal-head">
      <div class="grade-personal-main">
        <div class="grade-personal-name">
          {{ userInfo.nickName }}
        </div>
        <div class="grade-personal-level">
          {{ userInfo.level + userInfo.score }}
        </div>
      </div>
      <div class="grade-personal-rank">
        {{ '排名:' + userInfo.rank }}
      </div>
    </div>
    <div class="grade-list">
      <div
        class="grade-item"
        v-for="(item,index) in list"
        :key="item.userId"
      >
        <div class="grade-item-rank">
          <img
            src="@/static/challenge/grade/No1.png"
            alt=""
            v-if="index === 0"
            class="grade-item-rank-img"
          >
          <img
            src="@/static/challenge/grade/No2.png"
            alt=""
            v-if="index === 1"
            class="grade-item-rank-img"
          >
          <img
            src="@/static/challenge/grade/No3.png"
            alt=""
            v-if="index === 2"
            class="grade-item-rank-img"
          >
          {{ index > 2 ? index + 1 : '' }}
        </div>
        <img :src="item.avatarUrl" alt="" class="grade-item-head">
        <div class="grade-item-name">
          {{ item.nickName }}
        </div>
        <div class="grade-item-level">
          {{ levelCount(item.score) + ':' + item.score }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {levelCount} from "../../../tools/dataFormat";

export default {
  name: "gradeList",
  data() {
    return {
      list: [],
      userInfo: {}
    };
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    levelCount,
    /**
     * @description 获取用户信息
     */
    getUserInfo() {
      let userId = wx.getStorageSync("userId");
      if(!userId){
        this.getGradeList()
        return
      }
      this.$ajax.post("/api/user/getUserInfo", {
        userId: userId
      }).then(res => {
        if (res) {
          this.userInfo = res;
          this.userInfo.level = this.levelCount(this.userInfo.score);
          this.getGradeList()
        }
      })
    },
    getGradeList() {
      this.$ajax.post("/api/user/getGradeList", {
        pageSize: 10,
        pageNo: 1
      }).then(res => {
        this.list = res;
      })
    }
  }
};
</script>
<style lang="scss" scoped>
  .grade-page {
    min-height: 100%;
    background-color: #FFFFFF;
    position: relative;

    .grade-page-bg {
      background-color: #EE7BA6;
      height: 106px;
      &.half{
        height: 66px;
      }
    }

    .grade-personal-info {
      width: 616rpx;
      background-color: #FFFFFF;
      box-shadow: 0 6rpx 8rpx 0 rgba(0, 0, 0, 0.1);
      height: 120rpx;
      left: 37rpx;
      position: absolute;
      top: 90rpx;
      z-index: 2;
      display: flex;
      justify-content: flex-start;
      padding: 30rpx 30rpx 30rpx;

      .grade-personal-head {
        width: 120rpx;
        height: 120rpx;
        border-radius: 100%;
        border: 2rpx solid #E8E8E8;
        margin-right: 20rpx;
      }

      .grade-personal-main {
        margin-top: 25rpx;

        .grade-personal-name {
          font-size: 30rpx;
          line-height: 30rpx;
          color: #333333;
        }

        .grade-personal-level {
          color: #EE7BA6;
          font-size: 24rpx;
          line-height: 24rpx;
          margin-top: 20rpx;
        }
      }

      .grade-personal-rank {
        position: absolute;
        right: 30rpx;
        line-height: 120rpx;
      }
    }

    .grade-list {
      position: relative;
      padding: 100rpx 30rpx 0;

      .grade-item {
        width: calc(100% - 40rpx);
        padding: 20rpx 20rpx 20rpx;
        border-bottom: 2rpx solid #E8E8E8;
        display: flex;
        justify-content: flex-start;
        height: 80rpx;
        position: relative;

        &:nth-last-child(1) {
          border-bottom: none;
        }

        .grade-item-rank {
          width: 42rpx;
          line-height: 80rpx;
          text-align: center;
          color: #333333;
          font-weight: bold;
          font-size: 30rpx;
          margin-right: 40rpx;

          .grade-item-rank-img {
            width: 42rpx;
            height: 53rpx;
            margin-top: 15rpx;
          }
        }

        .grade-item-head {
          width: 78rpx;
          height: 78rpx;
          border: 2rpx solid #E8E8E8;
          border-radius: 100%;
          margin-right: 12rpx;
        }

        .grade-item-name {
          line-height: 80rpx;
          font-size: 30rpx;
          color: #333333;
          font-weight: 500;
        }

        .grade-item-level {
          position: absolute;
          right: 20rpx;
          font-size: 30rpx;
          line-height: 80rpx;
          color: #EE7BA6;
        }
      }
    }
  }
</style>
