<!--
 * @Author: Louis
 * @Date: 2019-10-25 09:25:21
 * @LastEditors: Louis
 * @LastEditTime: 2019-10-29 09:46:22
 * @Description:文章列表界面
 -->
<template>
  <div class="home-page">
    <!-- 授权弹窗 -->
    <auth-dialog
      @change="getUserInfo"
      v-model="showAuth"
    >
    </auth-dialog>
    <!-- 搜索框 -->
    <div class="article-search">
      <input
        type="text"
        class="article-search-input"
        v-model="articleInfo"
        placeholder="#孩子感冒发烧了怎么办#"
      >
    </div>
    <!-- 页签切换 -->
    <div class="type-tab">
      <div
        v-for="item in tabList"
        :key="item.id"
        class="type-item"
        @click="showTypeList(item)"
      >
        <div class="type-item-icon-bg">
          <img
            class="type-item-icon"
            :src="item.imgPath"
          />
        </div>
        <div class="type-item-name">
          {{ item.name }}
        </div>
      </div>
    </div>
    <!-- 每日一课 -->
    <div class="daily-list">
      <div
        v-for="item in list"
        :key="item.id"
        @click="showArticleDetails(item)"
        class="daily-item"
      >
        <div class="daily-item-header">
          {{ item.dateInfo }}
        </div>
        <image :src="item.thumb" class="daily-item-main"></image>
        <div class="daily-item-title">
          {{ item.title }}
        </div>
      </div>
    </div>
    <tab-bar current-route="homePage"></tab-bar>
  </div>
</template>

<script>
import tabBar from "./../../components/tabBar";
import authDialog from "./../../components/authDialog";

export default {
  name: "index",
  components: {
    tabBar,
    authDialog
  },
  watch: {
    articleInfo(nVal) {
    }
  },
  data() {
    return {
      showAuth: false,
      tabList: [],
      articleInfo: "",
      searchImgPath: "./../../static/article/search.png",
      list: []
    };
  },
  onLoad() {
    this.$nextTick(() => {
      this.getUserInfo();
      this.getArticleList();
      this.getArticleType()
    });
  },
  methods: {
    /**
     * @description 获取用户信息--检测用户是否授权
     */
    getUserInfo(showAuth) {
      let _this = this;
      // 如果是弹窗过来的，那么直接关闭弹窗，读取用户信息
      if (showAuth === "hide") {
        this.showAuth = false;
      }
      wx.getSetting({
        success: res => {
          // 如果已授权，执行微信登录请求
          if (res && res.authSetting["scope.userInfo"]) {
            _this.wxLogin();
          }
          // 若未授权，跳转至授权界面
          else {
            _this.showAuth = true;
          }
        }
      });
    },
    /**
     * @description 执行微信登录
     */
    wxLogin() {
      let _this = this;
      wx.login({
        success: res => {
          _this.getOpenId(res);
        }
      });
    },
    /**
     * @description 根据登录时返回的code，获取openId
     * @param codeInfo
     */
    getOpenId(codeInfo) {
      let _this = this;
      // 获取用户openId
      _this.$ajax.post("/api/user/getOpenId", codeInfo).then(authInfo => {
        if (authInfo && authInfo.openid) {
          _this.userLogin(authInfo);
        }
      });
    },
    /**
     * @description 根据返回的授权信息，检测用户系统中是否存在该用户
     * @description 若系统中存在该用户，将用户的userId存储至本地
     * @description 若系统中不存在该用户，执行用户注册操作
     * @param authInfo
     */
    userLogin(authInfo) {
      let _this = this;
      _this.$ajax.post("/api/user/login", {
        openId: authInfo.openid
      }).then(res => {
        if (res) {
          _this.updateUserInfo(authInfo, res);
        } else {
          _this.userRegister(authInfo);
        }
      });
    },
    /**
     * @description 更新用户信息
     * @param authInfo
     * @param userData
     */
    updateUserInfo(authInfo, userData) {
      let _this = this;
      wx.getUserInfo({
        lang: "zh_CN",
        success: res => {
          let userInfo = res.userInfo;
          userInfo.openId = authInfo.openid;
          userInfo.userId = userData[0].userId;
          _this.$ajax.post("/api/user/updateUserInfo", userInfo).then(result => {
            if (result) {
              wx.setStorageSync("userId", result.userId);
              wx.setStorageSync("userInfo", JSON.stringify(result))
            }
          });
        }
      });
    },
    /**
     * @description 执行用户注册过后，将用户的Id存储至本地
     * @param authInfo
     */
    userRegister(authInfo) {
      let _this = this;
      wx.getUserInfo({
        lang: "zh_CN",
        success: res => {
          let userInfo = Object.assign({}, res.userInfo);
          userInfo.openId = authInfo.openid;
          _this.$ajax
            .post("/api/user/register", {
              avatarUrl: userInfo.avatarUrl,
              city: userInfo.city,
              country: userInfo.country,
              gender: userInfo.gender,
              nickName: userInfo.nickName,
              openId: userInfo.openId,
              province: userInfo.province
            })
            .then(result => {
              if (result) {
                wx.setStorageSync("userId", result.userId);
              }
            });
        }
      });
    },
    /**
     * @description 获取文章分类
     */
    async getArticleType() {
      if (this.tabList.length > 0) {
        return
      }
      this.tabList = await this.$ajax.post("/api/articleType/list");
    },
    /**
     * @description 获取文章列表
     */
    async getArticleList() {
      if (this.list.length > 0) {
        return
      }
      let result = await this.$ajax.post("/api/article/list", {
        pageSize: 10,
        pageNo: 1
      })
      if (result) {
        result.data.map(item => {
          let d = new Date(item.createTime)
          item.dateInfo = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()
        })
        this.list = result.data || []
      }
    },
    /**
     * @description 展示文章详情
     * @param itemData
     */
    showArticleDetails(itemData) {
      uni.navigateTo({
        url: "details?id=" + itemData.id + "&name=" + itemData.title
      });
    },
    /**
     * @description 展示对应分类下的文章
     * @param itemData
     */
    showTypeList(itemData) {
      wx.navigateTo({url: "/pages/article/list?id=" + itemData.id + "&typeName=" + itemData.name})
    },
    filterArticle() {
      console.log("搜索");
    }
  },
  /**
   * @description 分享信息设置
   */
  onShareAppMessage() {
    return {
      title: "育婴宝库-专注传播科学育儿知识",
      url: "/pages/article/index",
      imageUrl: "/static/pic.jpg"
    };
  }
};
</script>

<style lang="scss" scoped>
  .home-page {
    background-color: #ffffff;
    padding-bottom: 88rpx;
    /** 轮播图样式控制  */
    .ad-main {
      width: 100%;
      height: 280rpx;

      .ad-item {
        height: 280rpx;

        .ad-img {
          width: 100%;
          height: 280rpx;
        }
      }
    }

    /* 搜索 */
    .article-search {
      width: calc(100% - 30rpx);
      background-color: #FBE4EF;
      position: relative;
      display: none;
      padding: 15rpx 15rpx;

      input {
        width: calc(100% - 70rpx);
        border: 2rpx solid #e8e8e8;
        border-radius: 28rpx 28rpx 28rpx;
        padding: 10rpx 20rpx 10rpx 50rpx;
        font-size: 24rpx;
        line-height: 24rpx;
        min-height: inherit;
        background-color: #ffffff;

        &:focus {
          border-color: #3673ff;
        }
      }
    }

    /** 页签切换样式控制  */
    .type-tab {
      background-color: #ffffff;
      display: flex;
      justify-content: space-between;
      padding: 60rpx 70rpx 50rpx;

      .type-item {
        text-align: center;
        color: #333333;
        width: 110rpx;

        .type-item-icon-bg {
          width: 110rpx;
          height: 110rpx;
          -webkit-border-radius: 100%;
          -moz-border-radius: 100%;
          border-radius: 100%;


          .type-item-icon {
            width: 60rpx;
            height: 60rpx;
            margin-top: 25rpx;
          }
        }

        .type-item-name {
          margin-top: 20rpx;
          font-size: 28rpx;
          color: #333333;
        }

        &:nth-child(1) {
          .type-item-icon-bg {
            background-color: #E0A5EA;
          }
        }

        &:nth-child(2) {
          .type-item-icon-bg {
            background-color: #83D6FE;
          }
        }

        &:nth-child(3) {
          .type-item-icon-bg {
            background-color: #FCAECF;
          }
        }

        &:nth-child(4) {
          .type-item-icon-bg {
            background-color: #F5DF7F;
          }
        }
      }
    }

    /* 每日一报 */
    .daily-list {
      padding: 0 30rpx;

      .daily-item {
        margin-bottom: 15rpx;
        width: 100%;
        border: 2rpx solid rgba(232, 232, 232, 1);
        box-shadow: 0rpx 8rpx 10rpx 0rpx rgba(0, 0, 0, 0.1);
        border-radius: 10rpx 10rpx 10rpx 10rpx;
        position: relative;
        height: 408rpx;

        .daily-item-header {
          font-size: 24rpx;
          padding: 25rpx 20rpx;
          display: flex;
          justify-content: space-between;
          color: #333333;
          font-weight: bold;
          text-shadow: 2rpx 2rpx 2rpx #FFFFFF;
        }

        .daily-item-main {
          width: 100%;
          height: 320rpx;
          border-radius: 0 0 10rpx 10rpx;
        }

        .daily-item-title {
          color: #FFFFFF;
          font-size: 32rpx;
          text-shadow: 2rpx 2rpx 2rpx #000000;
          line-height: 36rpx;
          position: absolute;
          top: 100rpx;
          left: 25rpx;
          font-weight: bold;
        }
      }
    }
  }
</style>
