<template>
  <div class="rpx" id="articleDetails">
    <!-- 授权弹窗 -->
    <auth-dialog v-if="showAuthDialog" @change="refuseAuth"></auth-dialog>
    <div class="article-main">
      <div class="article-title">{{ dataInfo.title }}</div>
      <div class="article-auth-info">
        <img class="article-auth-logo" src="http://file.xmxui.com/logo.png" />
        <div class="article-auth-main">
          <div class="article-auth-name">{{ dataInfo.author ? dataInfo.author : '育婴宝库' }}</div>
          <div class="article-auth-time">{{ dataInfo.createTime + ' 发表' }}</div>
        </div>
      </div>
      <div class="article-content" v-html="dataInfo.content"></div>
      <!-- 阅读数 -->
      <div class="article-read-num">{{ "阅读 " + dataInfo.viewsNum }}</div>
    </div>
    <!-- 文章评论 -->
    <div v-if="commentList.length > 0" class="article-comment">
      <!-- 标题 -->
      <div class="article-comment-title">精选留言</div>
      <!-- 评论列表 -->
      <div class="article-comment-list">
        <!-- 单条评论 -->
        <div v-for="item in commentList" :key="item.id" class="article-comment-item">
          <img :src="item.avatarUrl" alt class="comment-item-user-header" />
          <div class="comment-item-main">
            <!-- 用户信息 -->
            <div class="comment-item-header">
              <div class="comment-item-nickname">{{ item.nickName }}</div>
              <div
                class="comment-item-like-info"
                :class="{'liked' : item.liked }"
                @click="toggleItemLike(item)"
              >
                <img src="./../../static/article/like.png" alt v-if="!item.liked" />
                <img src="./../../static/article/liked.png" alt v-if="item.liked" />
                {{ item.likeNum ? item.likeNum : 0 }}
              </div>
            </div>
            <!-- 留言主体内容 -->
            <div class="comment-item-content">{{ item.content }}</div>
            <!-- 作者回复内容 -->
            <div class="comment-item-reply" v-if="item.reply && item.reply !== ''">
              <span class="author">作者回复：</span>
              {{ item.reply }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 留言区域 -->
    <div class="article-comment-form login-tips" v-if="!userInfo.userId">
      您还未登录，请先
      <span class="btn-login" @click="showAuthDialog = true">登录</span>
    </div>
    <div
      class="article-comment-form"
      v-if="userInfo.userId"
      :class="{'focusInput': inputFocus || messageSend}"
      :style="{'bottom': panelHeight + 'px'}"
    >
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
        />
        <div
          v-if="inputFocus || messageSend"
          @click="sendComment"
          :class="{'disabled': commentInfo.content.length === 0 || commentInfo.content.trim() === '' || messageSend}"
          class="send-message-btn"
        >{{ messageSend ? '提交中' : '提交'}}</div>
      </div>
      <!-- 收藏和点赞数 -->
      <div class="article-basic" :class="{'hide': inputFocus || messageSend }">
        <!-- 收藏 -->
        <div class="article-basic-item" :class="{'in-fact': favorite}" @click="favoriteEvent">
          <img src="http://file.xmxui.com/favorite.png" alt v-if="!favorite" />
          <img src="http://file.xmxui.com/favorited.png" alt v-if="favorite" />
          <div class="label">{{ favorite ? "取消收藏" : "加入收藏" }}</div>
        </div>
        <!-- 点赞数 -->
        <div
          class="article-basic-item"
          :class="{'in-fact': dataInfo.liked}"
          @click="toggleArticleLike"
        >
          <img src="http://file.xmxui.com/like.png" alt v-if="!dataInfo.liked" />
          <img src="http://file.xmxui.com/liked.png" alt v-if="dataInfo.liked" />
          <div class="label">{{ "赞 " + (dataInfo.likedNum ? dataInfo.likedNum : 0) }}</div>
        </div>
      </div>
    </div>
    <!-- 遮罩 -->
    <div v-if="inputFocus || messageSend" class="mask"></div>
  </div>
</template>

<script>
import authDialog from "./../../components/authDialog";

export default {
  name: "details",
  components: { authDialog },
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
      },
      // 登录人用户信息
      userInfo: {},
      // 显示授权弹窗
      showAuthDialog: false
    };
  },
  methods: {
    /**
     * @description 根据文章ID获取文章详情
     * @param commentInfo
     */
    async getArticleDetails(commentInfo) {
      this.articleParams =
        commentInfo && commentInfo.id ? commentInfo : this.articleParams;
      let params = {
        id: this.articleParams.id
      };
      if (this.userInfo && this.userInfo.userId) {
        params.userId = this.userInfo.userId;
      }
      let result = await this.$ajax.post("/api/article/details", params);
      let d = new Date(result.createTime);
      this.favorite = result.favorite;
      result.createTime =
        d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
      result.content = result.content.replace(
        /\<img/gi,
        "<img class='content-img'"
      );
      result.autor = result.autor ? result.autor : "育婴宝库";
      this.dataInfo = result;
      this.getCommentList();
      uni.setNavigationBarTitle({
        title: result.title
      });
    },
    /**
     * @description 触发收藏相关事件
     */
    favoriteEvent() {
      this.favorite ? this.cancelFavorite() : this.favoriteArticle();
    },
    /**
     * @description 收藏该文章
     */
    async favoriteArticle() {
      uni.showLoading();
      let result = await this.$ajax.post("/api/favorite/add", {
        articleId: this.dataInfo.id,
        articleName: this.dataInfo.title,
        description: this.dataInfo.description,
        typeName: this.dataInfo.typeName,
        typeId: this.dataInfo.typeId,
        thumb: this.dataInfo.thumb,
        userId: wx.getStorageSync("userId")
      });
      if (result) {
        this.favorite = true;
        setTimeout(() => {
          uni.hideLoading();
          wx.showToast({
            title: "收藏本文成功"
          });
        }, 1000);
      }
    },
    /**
     * @description 取消收藏
     */
    async cancelFavorite() {
      uni.showLoading();
      let result = await this.$ajax.post("/api/favorite/delete", {
        articleId: this.dataInfo.id,
        userId: wx.getStorageSync("userId")
      });
      if (result) {
        this.favorite = false;
        setTimeout(() => {
          uni.hideLoading();
          wx.showToast({
            title: "取消收藏成功"
          });
        }, 1000);
      }
    },
    /**
     * @description 获取评论列表
     */
    async getCommentList() {
      uni.showLoading();
      let params = {
        id: this.dataInfo.id
      };
      if (this.userInfo && this.userInfo.userId) {
        params.userId = this.userInfo.userId;
      }
      this.commentList = await this.$ajax.post(
        "/api/comment/getCommentList",
        params
      );
      setTimeout(() => {
        uni.hideLoading();
      }, 1000);
    },
    /**
     * @description 支持或取消某条留言
     * @param itemData
     */
    toggleItemLike(itemData) {
      if (!itemData.liked) {
        this.likeCommentInfo(itemData);
      } else {
        this.cancelLikeCommentInfo(itemData);
      }
    },
    /**
     * @description 支持留言
     * @param commentData
     */
    async likeCommentInfo(commentData) {
      uni.showLoading();
      let result = await this.$ajax.post("/api/like/comment", {
        articleId: this.dataInfo.id,
        userId: this.userInfo.userId,
        id: commentData.id
      });
      if (result) {
        commentData.likeNum += 1;
        commentData.liked = true;
        commentData.likeDataId = result.id;
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({
            title: "操作成功"
          });
        }, 1000);
      }
    },
    /**
     * @description 取消支持留言
     * @param commentData
     */
    async cancelLikeCommentInfo(commentData) {
      uni.showLoading();
      let result = await this.$ajax.post("/api/like/commentCancel", {
        likeDataId: commentData.likeDataId,
        commentId: commentData.id
      });
      if (result) {
        commentData.likeNum =
          commentData.likeNum > 1 ? (commentData.likeNum -= 1) : 0;
        commentData.liked = false;
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({
            title: "操作成功"
          });
        }, 1000);
      }
    },
    /**
     * @description 聚焦输入框
     */
    focusInput(e) {
      this.panelHeight = e.detail.height;
      this.inputFocus = true;
      this.setScrollBottom();
    },
    /**
     * @description 输入框失焦
     */
    blurInput() {
      this.inputFocus = false;
      this.panelHeight = 0;
      this.setScrollBottom();
    },
    /**
     * @description 滚动界面到最底部
     */
    setScrollBottom() {
      let _this = this;
      uni
        .createSelectorQuery()
        .select("#articleDetails")
        .boundingClientRect(function(rect) {
          // 使页面滚动到底部
          uni.pageScrollTo({
            scrollTop: _this.inputFocus
              ? rect.height + _this.panelHeight
              : rect.height
          });
        })
        .exec();
    },
    /**
     * @description 订阅留言回复
     */
    sendComment() {
      let _this = this;
      if (_this.commentInfo.content.trim() === "") {
        return;
      }
      _this.messageSend = true;
      wx.requestSubscribeMessage({
        tmplIds: ["ks1LgFs15g2vpX4WUGuhdYr7B-NwZ18dRA2OKzxlZCU"],
        success: function(res) {
          if (res["ks1LgFs15g2vpX4WUGuhdYr7B-NwZ18dRA2OKzxlZCU"] === "accept") {
            wx.showToast({
              title: "将推送审核结果"
            });
          }
        },
        fail: function(err) {
          wx.showToast({
            title: "不通知审核结果"
          });
        },
        complete: function() {
          // 此处设置延时是为了告知用户是否会有结果推送
          setTimeout(() => {
            _this.submitMessage();
          }, 1000);
        }
      });
    },
    /**
     * @description 文章点赞/取消点赞
     */
    toggleArticleLike() {
      if (this.dataInfo.liked) {
        this.cancelArticleLike();
      } else {
        this.likeArticleInfo();
      }
    },
    /**
     * @description 取消文章点赞
     */
    async cancelArticleLike() {
      wx.showToast({
        icon: "loading",
        mask: true
      });
      let result = await this.$ajax.post("/api/like/articleCancel", {
        id: this.dataInfo.likeDataId,
        articleId: this.dataInfo.id
      });
      if (result) {
        setTimeout(() => {
          wx.showToast({
            title: "操作成功"
          });
          this.dataInfo.liked = false;
          this.dataInfo.likedNum = parseInt(this.dataInfo.likedNum, 10) - 1;
        }, 1000);
      } else {
        setTimeout(() => {
          wx.showToast({
            title: "操作失败"
          });
        }, 1000);
      }
    },
    /**
     * @description 给文章点赞
     */
    async likeArticleInfo() {
      wx.showToast({
        icon: "loading",
        mask: true
      });
      let result = await this.$ajax.post("/api/like/article", {
        articleId: this.dataInfo.id,
        userId: this.userInfo.userId
      });
      if (result) {
        setTimeout(() => {
          wx.showToast({
            title: "操作成功"
          });
          this.dataInfo.liked = true;
          this.dataInfo.likeDataId = result.id;
          this.dataInfo.likedNum = parseInt(this.dataInfo.likedNum, 10) + 1;
        }, 1000);
      } else {
        setTimeout(() => {
          wx.showToast({
            title: "操作失败"
          });
        }, 1000);
      }
    },
    /**
     * @description 提交留言表单
     */
    async submitMessage() {
      let _this = this;
      _this.commentInfo.userId = _this.userInfo.userId;
      _this.commentInfo.nickName = _this.userInfo.nickName;
      _this.commentInfo.avatarUrl = _this.userInfo.avatarUrl;
      _this.commentInfo.openId = _this.userInfo.openId;
      _this.commentInfo.articleId = _this.dataInfo.id;
      _this.commentInfo.articleName = _this.dataInfo.title;
      if (
        _this.commentInfo.content &&
        _this.commentInfo.content.trim() !== ""
      ) {
        uni.showLoading();
        let result = await _this.$ajax.post(
          "/api/comment/add",
          _this.commentInfo
        );
        if (result) {
          setTimeout(() => {
            uni.hideLoading();
            uni.showToast({
              title: "操作成功"
            });
          }, 1000);
          _this.messageSend = false;
          _this.commentInfo.content = "";
          _this.blurInput();
        } else {
          wx.showModal({
            title: "留言提交失败",
            showCancel: false
          });
        }
      } else {
        console.error("消息数据有问题");
      }
    },
    /**
     * @description 用户拒绝授权
     */
    refuseAuth(res) {
      if (res === "success") {
        this.userInfo = wx.getStorageSync("userInfo")
          ? JSON.parse(wx.getStorageSync("userInfo"))
          : null;
        this.getArticleDetails();
      } else {
        wx.showToast({
          title: "您已拒绝授权"
        });
        this.showAuthDialog = false;
      }
    }
  },
  /**
   * @description 初始化读取文章数据信息
   */
  onLoad: function(options) {
    this.userInfo = wx.getStorageSync("userInfo")
      ? JSON.parse(wx.getStorageSync("userInfo"))
      : null;
    uni.setNavigationBarTitle({
      title: options.name
    });
    this.getArticleDetails(options);
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
};
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
      border-bottom: 2rpx solid #e8e8e8;

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
      .blockquote {
        display: block;
        border-left: 8rpx solid #ee7ba6;
        padding: 20rpx 10rpx;
        margin: 10rpx 0;
        line-height: 34rpx;
        font-size: 28rpx;
        color: #666666;
        font-weight: bold;
        background-color: #f1f1f1;
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
                color: #ee7ba6;
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
            background-color: #f3f3f3;
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
    border-top: 2rpx solid #e8e8e8;
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
        background-color: #f7f7f7;
        border: 2rpx solid #c7c7c7;
        border-radius: 36rpx 36rpx 36rpx;
      }

      &.show {
        width: 710rpx;

        input {
          width: 580rpx;
          margin-right: 20rpx;
        }

        .send-message-btn {
          width: 110rpx;
          font-size: 24rpx;
          text-align: center;
          line-height: 60rpx;
          color: #ffffff;
          height: 60rpx;
          background-color: #ee7ba6;
          border-radius: 30rpx 30rpx 30rpx;

          &.disabled {
            opacity: 0.5;
          }
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
            color: #ee7ba6;
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

    &.login-tips {
      width: 100%;
      display: flex;
      justify-content: center;
      color: #999999;
      padding: 50rpx 0 50rpx;

      .btn-login {
        color: #ee7ba6;
      }
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
