<template>
  <div class="article-details">
    <div class="article-title">
      {{ dataInfo.title }}
    </div>
    <div class="article-time">
      {{ dataInfo.createTime }}
    </div>
    <div
      class="article-content"
      v-html="dataInfo.content"
    >
    </div>
    <div class="article-like-info">
      <div class="article-like-item">
        <img src="./../../static/article/view.png" alt="">
        <div class="label">
          {{ dataInfo.viewsNum }}
        </div>
      </div>
      <div class="article-like-item">
        <img
          src="./../../static/article/favorite.png"
          alt=""
          v-if="!favorited"
          @click="favoriteArticle"
        >
        <img
          src="./../../static/article/favorited.png"
          v-if="favorited"
          alt=""
          @click="cancelFavorite"
        >
        <div class="label">
          {{ favorited ? '取消收藏' : '收藏本文' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "details",
    data() {
      return {
        dataInfo: {},
        favorited: false
      }
    },
    methods: {
      /**
       * @description 根据文章ID获取文章详情
       * @param articleInfo
       */
      async getArticleDetails(articleInfo) {
        let result = await this.$ajax.post("/api/article/details", articleInfo)
        let d = new Date(result.createTime);
        result.createTime = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
        result.content = result.content.replace(/\<img/gi, "<img class='content-img'")
        this.dataInfo = result;
        uni.setNavigationBarTitle({
          title: result.title
        })
      },
      /**
       * @description 收藏该文章
       */
      favoriteArticle() {
        this.favorited = true;
      },
      /**
       * @description 取消收藏
       */
      cancelFavorite() {
        this.favorited = false;
      }
    },
    onLoad: function (options) {
      this.getArticleDetails(options)
    },
    onPullDownRefresh() {
      setTimeout(() => {
        uni.stopPullDownRefresh();
        this.getArticleDetails(true);
      }, 1000);
    }
  }
</script>

<style lang="scss">
  .article-details {
    background-color: #ffffff;
    padding: 20rpx 20rpx 20rpx;

    .article-title {
      text-align: center;
      font-size: 30rpx;
      font-weight: bold;
      color: #333333;
    }

    .article-time {
      text-align: center;
      font-size: 24rpx;
      line-height: 44rpx;
      color: #666666;
    }

    .article-content {
      width: 710rpx;
      padding-bottom: 20rpx;
      color: #333333;

      .content-img {
        width: 100% !important;
      }
    }

    .article-like-info {
      padding: 40rpx 40rpx 40rpx;
      display: flex;
      justify-content: space-between;
      .article-like-item{
        display: flex;
        justify-content: flex-start;
        .label{
          font-size: 28rpx;
          line-height: 46rpx;
        }
      }
      img{
        width: 46rpx;
        height: 46rpx;
        margin-right: 10rpx;
      }
    }
  }
</style>
