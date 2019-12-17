<template>
  <div class="article-details">
    <div class="article-main">
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
      <!-- 收藏、查看次数 -->
      <div class="article-like-info">
        <div class="article-like-item">
          <img src="./../../static/article/view.png" alt="">
          <div class="label">
            {{ dataInfo.viewsNum }}
          </div>
        </div>
        <div
          class="article-like-item"
          @click="favoriteEvent"
        >
          <img
            src="./../../static/article/favorite.png"
            alt=""
            v-if="!favorite"
          >
          <img
            src="./../../static/article/favorited.png"
            v-if="favorite"
            alt=""
          >
          <div class="label">
            {{ favorite ? '取消收藏' : '收藏本文' }}
          </div>
        </div>
      </div>
    </div>
    <!-- 文章评论 -->
    <div class="article-comment">
      <!-- 评论输入框 -->
      <div class="article-comment-title">
        <div class="title">
          <img src="./../../static/article/favorited.png" alt="">
          精选留言
        </div>
        <div class="btn" @click="writeMessage">
          写留言
        </div>
      </div>
      <!-- 评论列表 -->
      <div class="article-comment-list">
        <!-- 单条评论 -->
        <div
          v-for="item in commentList"
          :key="item.id"
          class="article-comment-item"
        >
          <div class="comment-item-user-info">
            <img :src="item.avatarUrl" alt="" class="comment-item-header">
            <div class="comment-item-name">
              {{ item.nickName }}
            </div>
          </div>
          <div class="comment-item-content">
            {{ item.content }}
          </div>
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
      favorite: false,
      commentList: []
    }
  },
  methods: {
    /**
     * @description 根据文章ID获取文章详情
     * @param articleInfo
     */
    async getArticleDetails(articleInfo) {
      let result = await this.$ajax.post("/api/article/details", {
        id: articleInfo.id,
        userId: wx.getStorageSync("userId")
      })
      let d = new Date(result.createTime);
      this.favorite = result.favorite;
      result.createTime = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
      result.content = result.content.replace(/\<img/gi, "<img class='content-img'")
      this.dataInfo = result;
      this.getCommentList();
      uni.setNavigationBarTitle({
        title: result.title
      })
    },
    /**
     * @description 触发收藏相关事件
     */
    favoriteEvent() {
      this.favorite ? this.cancelFavorite() : this.favoriteArticle()
    },
    /**
     * @description 收藏该文章
     */
    async favoriteArticle() {
      let result = await this.$ajax.post("/api/favorite/add", {
        articleId: this.dataInfo.id,
        articleName: this.dataInfo.title,
        description: this.dataInfo.description,
        thumb: this.dataInfo.thumb,
        userId: wx.getStorageSync("userId")
      })
      if (result) {
        wx.showToast({
          title: "收藏本文成功"
        })
        this.favorite = true;
      }
    },
    /**
     * @description 取消收藏
     */
    async cancelFavorite() {
      let result = await this.$ajax.post("/api/favorite/delete", {
        articleId: this.dataInfo.id,
        userId: wx.getStorageSync("userId")
      })
      if (result) {
        wx.showToast({
          title: "取消收藏成功"
        })
        this.favorite = false;
      }
    },
    /**
     * @description 获取评论列表
     */
    async getCommentList() {
      this.commentList = await this.$ajax.post("/api/article/getCommentList", {
        id: this.dataInfo.id
      })
    },
    /**
     * @description 写留言
     */
    writeMessage() {

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
  },
  /**
   * @description 分享信息设置
   */
  onShareAppMessage() {
    return {
      title: this.dataInfo.title,
      path: "/pages/article/details?id=" + this.dataInfo.id,
      imageUrl: this.dataInfo.thumb
    };
  }
}
</script>

<style lang="scss">
  .article-details {
    .article-main {
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

        .article-like-item {
          display: flex;
          justify-content: flex-start;

          .label {
            font-size: 28rpx;
            line-height: 46rpx;
          }
        }

        img {
          width: 46rpx;
          height: 46rpx;
          margin-right: 10rpx;
        }
      }
    }

    .article-comment {
      margin-top: 20rpx;
      background-color: #ffffff;
      padding: 0rpx 20rpx;

      .article-comment-title {
        display: flex;
        padding: 30rpx 20rpx 30rpx;
        justify-content: space-between;
        font-size: 30rpx;
        line-height: 40rpx;
        color: #666666;

        .title {
          display: flex;
          justify-content: flex-start;

          img {
            width: 40rpx;
            height: 40rpx;
            margin-right: 10rpx;
          }
        }

        .btn {
          color: #007aff;
        }
      }

      .article-comment-list {
        .article-comment-item {
          margin-bottom: 40rpx;
          display: flex;
          justify-content: flex-start;

          &:nth-last-child(1) {
            margin: 0;
          }

          .comment-item-user-info {
            width: 80rpx;
            text-align: center;

            .comment-item-header {
              width: 80rpx;
              height: 80rpx;
              border-radius: 20rpx 20rpx 20rpx;
              float: left;
            }

            .comment-item-name {
              float: left;
              width: 100%;
              font-size: 20rpx;
              line-height: 20rpx;
              margin-top: 10rpx;
              color: #666666;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }

          .comment-item-content {
            margin: 0 0 0 20rpx;
            font-size: 24rpx;
            color: #333333;
            line-height: 30rpx;
            width: calc(100% - 120rpx);
          }
        }
      }
    }
  }
</style>
