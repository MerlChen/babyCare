<template>
  <div class="rpx" id="articleDetails">
    <div class="article-main">
      <div class="article-title">
        {{ dataInfo.title }}
      </div>
      <div class="article-auth-info">
        <img
          class="article-auth-logo"
          src="./../../static/logo.png"
        />
        <div class="article-auth-main">
          <div class="article-auth-name">
            {{ dataInfo.author ? dataInfo.author : '育婴宝典' }}
          </div>
          <div class="article-auth-time">
            {{ dataInfo.createTime + ' 发表' }}
          </div>
        </div>
      </div>
      <div
        class="article-content"
        v-html="dataInfo.content"
      >
      </div>
      <!-- 阅读数 -->
      <div class="article-read-num">
        {{ "阅读 " + dataInfo.viewsNum }}
      </div>
    </div>
    <!-- 文章评论 -->
    <div v-if="commentList.length > 0" class="article-comment">
      <!-- 标题 -->
      <div class="article-comment-title">
        精选留言
      </div>
      <!-- 评论列表 -->
      <div class="article-comment-list">
        <!-- 单条评论 -->
        <div
          v-for="item in commentList"
          :key="item.id"
          class="article-comment-item"
        >
          <img :src="item.avatarUrl" alt="" class="comment-item-user-header">
          <div class="comment-item-main">
            <!-- 用户信息 -->
            <div class="comment-item-header">
              <div class="comment-item-nickname">
                {{ item.nickName }}
              </div>
              <div
                class="comment-item-like-info"
                :class="{'liked' : item.liked }"
                @click="toggleItemLike(item)"
              >
                <img src="./../../static/article/like.png" alt="" v-if="!item.liked">
                <img src="./../../static/article/liked.png" alt="" v-if="item.liked">
                {{ item.likeNum ? item.likeNum : 0 }}
              </div>
            </div>
            <!-- 留言主体内容 -->
            <div class="comment-item-content">
              {{ item.content }}
            </div>
            <!-- 作者回复内容 -->
            <div class="comment-item-reply" v-if="item.reply && item.reply !== ''">
              <span class="author">
                作者回复：
              </span>
              {{ item.reply }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 留言区域 -->
    <div class="article-comment-form" :class="{'focusInput': inputFocus || messageSend}"
         :style="{'bottom': panelHeight + 'px'}">
      <!-- 输入框主体区域 -->
      <div class="article-comment-container" :class="{'show': inputFocus || messageSend }">
        <input
          type="text"
          confirm-type="send"
          :adjust-position="false"
          :readonly="messageSend"
          v-model="commentInfo.content"
          placeholder="留言经筛选后对所有人可见"
          @focus="focusInput"
          @blur="blurInput"
        >
        <div
          v-if="inputFocus || messageSend"
          @click="sendComment"
          class="send-message-btn"
        >
          {{ messageSend ? '提交中' : '提交'}}
        </div>
      </div>
      <!-- 收藏和点赞数 -->
      <div class="article-basic" :class="{'hide': inputFocus || messageSend }">
        <!-- 收藏 -->
        <div class="article-basic-item" :class="{'in-fact': favorite}" @click="favoriteEvent">
          <img src="./../../static/article/favorite.png" alt="" v-if="!favorite">
          <img src="./../../static/article/favorited.png" alt="" v-if="favorite">
          <div class="label">
            {{ favorite ? "取消收藏" : "加入收藏" }}
          </div>
        </div>
        <!-- 点赞数 -->
        <div class="article-basic-item" :class="{'in-fact': dataInfo.liked}">
          <img src="./../../static/article/like.png" alt="" v-if="!dataInfo.liked">
          <img src="./../../static/article/liked.png" alt="" v-if="dataInfo.liked">
          <div class="label">
            {{ "赞 " + (dataInfo.likeNum ? dataInfo.likeNum : 0) }}
          </div>
        </div>
      </div>
    </div>
    <!-- 遮罩 -->
    <div v-if="inputFocus || messageSend" class="mask"></div>
  </div>
</template>

<script>
export default {
  name: "details",
  data() {
    return {
      // 文章信息
      dataInfo: {},
      // 留言列表
      commentList: [],
      // 留言输入框是否聚焦
      inputFocus: false,
      // 是否正在提交留言信息
      messageSend: false,
      // 键盘高度
      panelHeight: 0,
      // 是否收藏此文章
      favorite: false,
      // 是否点赞此文章
      liked: false,
      // 文章的参数信息
      articleParams: null,
      // 订阅的数据信息
      commentInfo: {
        articleId: "",
        articleName: "",
        userId: "",
        content: "",
        nickName: "",
        avatarUrl: "",
        openId: ""
      }
    }
  },
  methods: {
    /**
     * @description 根据文章ID获取文章详情
     * @param commentInfo
     */
    async getArticleDetails(commentInfo) {
      this.articleParams = commentInfo.id ? commentInfo : this.articleParams;
      let result = await this.$ajax.post("/api/article/details", {
        id: this.articleParams.id,
        userId: wx.getStorageSync("userId")
      })
      let d = new Date(result.createTime);
      this.favorite = result.favorite;
      result.createTime = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
      result.content = result.content.replace(/\<img/gi, "<img class='content-img'")
      result.autor = result.autor ? result.autor : "育婴宝典";
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
      this.commentList = await this.$ajax.post("/api/comment/getCommentList", {
        id: this.dataInfo.id
      })
    },
    /**
     * @description 支持或取消某条留言
     * @param itemData
     */
    toggleItemLike(itemData) {
      if (!itemData.liked) {
        this.$set(itemData, 'liked', true)
      } else {
        itemData.liked = !itemData.liked;
      }
    },
    /**
     * @description 聚焦输入框
     */
    focusInput(e) {
      this.panelHeight = e.detail.height;
      this.inputFocus = true;
      this.setScrollBottom()
    },
    /**
     * @description 输入框失焦
     */
    blurInput() {
      this.inputFocus = false;
      this.panelHeight = 0;
      this.setScrollBottom()
    },
    /**
     * @description 滚动界面到最底部
     */
    setScrollBottom() {
      let _this = this;
      uni.createSelectorQuery().select('#articleDetails').boundingClientRect(function (rect) {
        // 使页面滚动到底部
        uni.pageScrollTo({
          scrollTop: _this.inputFocus ? (rect.height + _this.panelHeight) : rect.height
        })
      }).exec()
    },
    /**
     * @description 订阅留言回复
     */
    sendComment() {
      let _this = this;
      _this.messageSend = true;
      wx.requestSubscribeMessage({
        tmplIds: ['ks1LgFs15g2vpX4WUGuhdYr7B-NwZ18dRA2OKzxlZCU'],
        success: function (res) {
          if (res['ks1LgFs15g2vpX4WUGuhdYr7B-NwZ18dRA2OKzxlZCU'] === 'accept') {
            wx.showToast({
              title: "将推送审核结果"
            })
          }
        },
        fail: function (err) {
          console.log(err);
          wx.showToast({
            title: "不通知审核结果"
          })
        },
        complete: function () {
          // 此处设置延时是为了告知用户是否会有结果推送
          setTimeout(() => {
            _this.submitMessage()
          }, 2000)
        }
      })
    },
    /**
     * @description 提交留言表单
     */
    async submitMessage() {
      let _this = this;
      let userInfo = JSON.parse(wx.getStorageSync("userInfo"))
      _this.commentInfo.userId = userInfo.userId;
      _this.commentInfo.nickName = userInfo.nickName;
      _this.commentInfo.avatarUrl = userInfo.avatarUrl;
      _this.commentInfo.openId = userInfo.openId;
      _this.commentInfo.articleId = _this.dataInfo.id;
      _this.commentInfo.articleName = _this.dataInfo.title;
      if (_this.commentInfo.content && _this.commentInfo.content.trim() !== "") {
        let result = await _this.$ajax.post("/api/comment/add", _this.commentInfo)
        if (result) {
          wx.showToast({
            title: "留言成功"
          })
          _this.messageSend = false;
          _this.commentInfo.content = ""
          _this.blurInput()
        } else {
          wx.showModal({
            title: "留言提交失败",
            showCancel: false
          })
        }
      } else {
        console.error("消息数据有问题")
      }
    }
  },
  /**
   * @description 初始化读取文章数据信息
   */
  onLoad: function (options) {
    this.getArticleDetails(options)
  },
  /**
   * @description 下拉刷新文章数据信息
   */
  onPullDownRefresh() {
    setTimeout(() => {
      uni.stopPullDownRefresh();
      this.getArticleDetails();
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
  .rpx {
    .article-main {
      background-color: #ffffff;
      padding: 35rpx 30rpx 35rpx;

      .article-title {
        font-size: 32rpx;
        line-height: 40rpx;
        font-weight: bold;
        color: #333333;
      }

      .article-auth-info {
        width: 100%;
        padding-top: 60rpx;
        display: flex;
        padding-bottom: 36rpx;
        justify-content: flex-start;
        border-bottom: 2rpx solid #E8E8E8;

        .article-auth-logo {
          margin-right: 16rpx;
          width: 60rpx;
          height: 60rpx;
          border-radius: 4rpx 4rpx 4rpx;
        }

        .article-auth-main {
          color: #848484;

          .article-auth-name {
            width: 100%;
            font-size: 28rpx;
            line-height: 28rpx;
            margin-bottom: 8rpx;
          }

          .article-auth-time {
            font-size: 24rpx;
            line-height: 24rpx;
          }
        }
      }

      .article-content {
        width: 690rpx;
        padding: 30rpx 0 24rpx;
        color: #333333;

        .content-img {
          width: 100% !important;
        }
      }

      .article-read-num {
        padding-top: 70rpx;
        font-size: 24rpx;
        color: #848484;
      }
    }

    .article-comment {
      margin-top: 20rpx;
      background-color: #ffffff;
      padding: 30rpx 30rpx 50rpx;

      .article-comment-title {
        font-size: 28rpx;
        line-height: 28rpx;
        color: #848484;
        font-weight: 500;
      }

      .article-comment-list {
        .article-comment-item {
          display: flex;
          margin-top: 60rpx;
          justify-content: flex-start;

          .comment-item-user-header {
            width: 60rpx;
            height: 60rpx;
            margin-right: 20rpx;
            border-radius: 4rpx 4rpx 4rpx;
          }

          .comment-item-main {
            width: calc(100% - 80rpx);

            .comment-item-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 16rpx;

              .comment-item-nickname {
                font-size: 28rpx;
                line-height: 28rpx;
                color: #848484;
                font-weight: 500;
              }

              .comment-item-like-info {
                display: flex;
                color: #999999;
                font-size: 24rpx;
                line-height: 28rpx;
                justify-content: flex-start;

                img {
                  width: 28rpx;
                  height: 28rpx;
                  margin-right: 10rpx;
                }

                &.liked {
                  color: #EE7BA6;
                }
              }
            }

            .comment-item-content {
              font-size: 28rpx;
              line-height: 34rpx;
            }

            .comment-item-reply {
              color: #333333;
              font-size: 26rpx;
              margin-top: 12rpx;
              line-height: 34rpx;
              background-color: #F3F3F3;
              padding: 16rpx 16rpx 16rpx;
              border-radius: 4rpx 4rpx 4rpx;

              .author {
                color: #848484;
              }
            }
          }
        }
      }
    }

    .article-comment-form {
      width: calc(100% - 40rpx);
      height: 60rpx;
      padding: 20rpx 20rpx;
      background-color: #ffffff;
      border-top: 2rpx solid #E8E8E8;
      position: relative;
      display: flex;
      justify-content: flex-start;

      .article-comment-container {
        width: 500rpx;
        display: flex;
        position: relative;
        justify-content: flex-start;

        input {
          width: 100%;
          font-size: 26rpx;
          line-height: 32rpx;
          height: 32rpx;
          min-height: 32rpx;
          padding: 14rpx 25rpx;
          background-color: #F7F7F7;
          border: 2rpx solid #C7C7C7;
          border-radius: 36rpx 36rpx 36rpx;
        }

        &.show {
          width: 710rpx;

          input {
            width: 600rpx;
          }

          .send-message-btn {
            width: 110rpx;
            font-size: 24rpx;
            text-align: center;
            line-height: 60rpx;
            color: #EE7BA6;
          }
        }
      }

      .article-basic {
        opacity: 1;
        width: 210rpx;
        height: 60rpx;

        .article-basic-item {
          display: inline-block;
          width: 105rpx;
          height: 60rpx;
          text-align: center;

          img {
            width: 28rpx;
            height: 28rpx;
            margin: 0 34rpx 10rpx 33rpx;
            float: left;
          }

          .label {
            width: 100%;
            float: left;
            color: #848484;
            font-size: 22rpx;
            line-height: 22rpx;
          }

          &.in-fact {
            .label {
              color: #EE7BA6;
            }
          }
        }

        &.hide {
          width: 0;
          opacity: 0;
        }
      }

      &.focusInput {
        position: fixed;
        z-index: 2;
        left: 0;
        width: 100%;
      }
    }

    .mask {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      position: fixed;
      top: 0;
      left: 0;
    }
  }
</style>
