<template>
  <div class="favorite-list">
    <div
      v-for="item in list"
      :key="item.id"
      class="favorite-item"
      @click="showDetails(item)"
    >
      <div class="favorite-item-container">
        <div class="title">
          {{ item.articleName }}
        </div>
        <div class="description">
          {{ item.description }}
        </div>
      </div>
      <img :src="item.thumb" alt="" class="favorite-item-thumb">
    </div>
  </div>
</template>

<script>
export default {
  name: "favorite",
  data() {
    return {
      list: [],
      userInfo: {}
    }
  },
  methods: {
    /**
     * @description 读取我的收藏列表
     * @return {Promise<void>}
     */
    async getFavoriteList() {
      this.list = await this.$ajax.post("/api/favorite/list", {
        userId: wx.getStorageSync("userId")
      })
    },
    /**
     * @description 查看文章详情
     * @param itemData
     */
    showDetails(itemData) {
      uni.navigateTo({
        url: "/pages/article/details?id=" + itemData.articleId
      });
    },
    /**
     * @description 获取用户信息
     */
    async getUserInfo() {
      this.userInfo = await this.$ajax.post("/api/user/getUserInfo", {
        userId: wx.getStorageSync("userId")
      })
    }
  },
  mounted() {
    this.getFavoriteList()
    this.getUserInfo();
  },
  /**
   * @description 分享信息设置
   */
  onShareAppMessage() {
    return {
      title: this.userInfo.nickName + '的收藏列表',
      path: "/pages/personal/favorite/list?userId=" + wx.getStorageSync("userId") + '&userName=' + this.userInfo.nickName,
      imageUrl: "/static/pic"
    };
  }
}
</script>

<style lang="scss" scoped>
  .favorite-list {
    background-color: #ffffff;
    min-height: 100%;

    .favorite-item {
      padding: 25rpx 25rpx 25rpx;
      border-top: 2rpx solid #E8E8E8;
      display: flex;
      justify-content: space-between;

      &:nth-last-child(1) {
        border-bottom: 2rpx solid #E8E8E8;
      }

      .favorite-item-container {
        width: calc(100% - 230rpx);

        .title {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 30rpx;
          line-height: 30rpx;
          margin-bottom: 24rpx;
        }

        .description {
          font-size: 24rpx;
          line-height: 36rpx;
          height: 146rpx;
          overflow: hidden;
          color: #999999;
        }
      }

      .favorite-item-thumb {
        width: 200rpx;
        height: 200rpx;
        -webkit-border-radius: 8rpx 8rpx 8rpx;
        -moz-border-radius: 8rpx 8rpx 8rpx;
        border-radius: 8rpx 8rpx 8rpx;
      }
    }
  }
</style>
