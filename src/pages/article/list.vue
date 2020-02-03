<template>
  <div class="article-list">
    <div v-if="list.length > 0">
      <div
        v-for="item in list"
        :key="item.id"
        class="article-item"
        @click="showArticleDetails(item)"
      >
        <div class="article-main">
          <div class="article-title">{{ item.title }}</div>
          <div class="article-desc">{{ item.description }}</div>
        </div>
        <img :src="item.thumb" class="article-img" />
      </div>
    </div>
    <div class="no-data-tips" v-else>暂无数据</div>
  </div>
</template>

<script>
export default {
  name: "list",
  data() {
    return {
      list: []
    };
  },
  onLoad: function(options) {
    uni.setNavigationBarTitle({
      title: "知识课堂-" + options.typeName
    });
    this.getArticleList(options);
  },
  methods: {
    /**
     * @description 获取文章列表数据
     */
    async getArticleList(params) {
      let result = await this.$ajax.post("/api/article/currentList", {
        typeId: params.id
      });
      this.list = result.data;
    },
    /**
     * @description 展示文章详情
     * @param articleInfo
     */
    showArticleDetails(articleInfo) {
      uni.navigateTo({
        url: "details?id=" + articleInfo.id + "&name=" + articleInfo.title
      });
    }
  }
};
</script>

<style lang="scss">
.article-list {
  background-color: #ffffff;
  min-height: 100%;

  .article-item {
    padding: 25rpx 25rpx 25rpx;
    border-top: 2rpx solid #e8e8e8;
    display: flex;
    justify-content: space-between;

    &:nth-last-child(1) {
      border-bottom: 2rpx solid #e8e8e8;
    }

    .article-main {
      width: calc(100% - 230rpx);

      .article-title {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 30rpx;
        line-height: 30rpx;
        margin-bottom: 24rpx;
      }

      .article-desc {
        font-size: 24rpx;
        line-height: 36rpx;
        height: 146rpx;
        overflow: hidden;
        color: #999999;
      }
    }

    .article-img {
      width: 200rpx;
      height: 200rpx;
      -webkit-border-radius: 8rpx 8rpx 8rpx;
      -moz-border-radius: 8rpx 8rpx 8rpx;
      border-radius: 8rpx 8rpx 8rpx;
    }
  }
  .no-data-tips {
    line-height: 200rpx;
    color: #666666;
    text-align: center;
  }
}
</style>
