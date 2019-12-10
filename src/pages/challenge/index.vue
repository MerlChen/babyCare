<template>
  <div class="page-challenge">
    <div class="page-challenge-item" v-for="item in list" :key="item.id" @click="changePage(item)">
      <div class="icons-bg">
        <img :src="item.imgPath" class="images" />
      </div>
      <div class="label">{{ item.name }}</div>
    </div>
    <tab-bar current-route="challenge"></tab-bar>
  </div>
</template>

<script>
import tabBar from "./../../components/tabBar";
export default {
  name: "index",
  components: {
    tabBar
  },
  data() {
    return {
      list: [
        {
          id: "chanllenge",
          imgPath: "./../../static/challenge/challenge.png",
          name: "知识问答",
          pageUrl: "/pages/challenge/question/index"
        },
        {
          id: "grade",
          imgPath: "./../../static/challenge/grade.png",
          name: "排行榜",
          pageUrl: "/pages/challenge/grade/index"
        }
      ]
    };
  },
  methods: {
    changePage(pageInfo) {
      wx.navigateTo({ url: pageInfo.pageUrl });
    }
  }
};
</script>

<style lang="scss">
.page-challenge {
  padding: 190rpx 115rpx 0;
  .page-challenge-item {
    background-color: #ffffff;
    width: 520rpx;
    border-radius: 10rpx 10rpx 10rpx;
    margin-bottom: 60rpx;
    padding: 68rpx 0;
    text-align: center;
    .icons-bg {
      width: 150rpx;
      height: 150rpx;
      border-radius: 100%;
      margin: 0 auto;
      background-color: #ee7ba6;
      .images {
        width: 64rpx;
        height: 50rpx;
        margin: 50rpx 43rpx;
      }
    }
    .label {
      font-size: 32rpx;
      margin-top: 22rpx;
      color: #ee7ba6;
    }
    &:nth-child(2) {
      margin-bottom: 0;
      .icons-bg {
        background-color: #d27bee;
      }
      .label {
        color: #d27bee;
      }
    }
  }
}
</style>
