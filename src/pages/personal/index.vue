<!--
 * @Author: Louis
 * @Date: 2019-10-25 09:25:21
 * @LastEditors  : Louis
 * @LastEditTime : 2020-02-03 23:13:10
 * @Description: 增加菜单获取
 -->
<template>
  <div class="personal-page">
    <!-- 授权弹窗 -->
    <auth-dialog
      :to-main="`true`"
      current-route="personal"
      @change="getPersonalInfo"
      v-if="needAuth"
    ></auth-dialog>
    <!-- 用户信息 -->
    <div class="personal-info">
      <!-- 用户头像 -->
      <img class="personal-info-head" :src="userInfo.avatarUrl" />
      <!-- 用户主体信息 -->
      <div class="personal-info-main">
        <!-- 用户昵称 -->
        <div class="personal-info-name">{{ userInfo.nickName }}</div>
        <!-- 用户所在地区 -->
        <div
          class="personal-info-city"
          v-if="userInfo.country && userInfo.province && userInfo.city"
        >
          {{
          "所在地区：" +
          userInfo.country +
          "-" +
          userInfo.province +
          "-" +
          userInfo.city
          }}
        </div>
        <div
          class="personal-info-city"
          v-else-if="!userInfo.country && userInfo.province && userInfo.city"
        >{{ "所在地区：" + userInfo.province + "-" + userInfo.city }}</div>
        <div class="personal-info-city" v-else>所在地区： 地区不详</div>
        <!-- 用户级别及积分信息 -->
        <div class="personal-info-level">{{ levelCount(userInfo.score) + "：" + userInfo.score }}</div>
      </div>
    </div>
    <!-- 个人中心功能菜单 -->
    <div
      v-for="(item, index) in menuList"
      :key="item.id"
      @click="changePage(item)"
      class="personal-menu-item"
    >
      <div
        class="personal-menu-item-container"
        :class="{ 'no-border': index + 1 === menuList.length }"
      >
        <img :src="item.iconPath" class="personal-menu-icon" alt />
        <div class="personal-menu-name">{{ item.name }}</div>
        <img src="@/static/right.png" class="personal-menu-right-icon" alt />
      </div>
    </div>
    <div class="mark" v-if="loading">数据请求中，请稍后...</div>
  </div>
</template>

<script>
import { levelCount } from "../../tools/dataFormat";
import authDialog from "./../../components/authDialog";

export default {
  name: "index",
  components: {
    authDialog
  },
  data() {
    return {
      userInfo: {
        avatarUrl: "http://file.xmxui.com/logo2.png",
        nickName: "昵称就是七个字",
        province: "",
        country: "",
        city: "",
        level: "育儿新手",
        score: "0"
      },
      needAuth: true,
      menuList: [],
      loading: false
    };
  },
  /**
   * @description 触发微信分享
   * @return {{path: string, success: success, title: string, error: error}}
   */
  onShareAppMessage: function() {
    return {
      title: "我正库【育婴宝库】学习科学的育儿知识",
      path: "/pages/article/index",
      imageUrl: "http://file.xmxui.com/pic.jpg"
    };
  },
  onShow() {
    this.userInfo = JSON.parse(wx.getStorageSync("userInfo"));
  },
  methods: {
    /**
     * @description 积分换算成等级
     */
    levelCount,
    /**
     * @description 获取用户详细数据信息
     */
    async getPersonalInfo() {
      let userId = wx.getStorageSync("userId");
      this.$ajax.post("/api/user/getUserInfo", { userId: userId }).then(res => {
        if (res) {
          this.userInfo = res;
          this.loading = false;
        }
      });
    },
    /**
     * @description 切换至子级系统
     */
    changePage(itemData) {
      uni.navigateTo({ url: itemData.pageInfo });
    },
    /**
     * @description 获取系统菜单
     */
    async getMenuList() {
      this.menuList = await this.$ajax.post("/api/menu/list");
    }
  },
  onLoad(params) {
    this.loading = true;
    this.getMenuList();
    let userId = wx.getStorageSync("userId");
    if (userId && userId !== "") {
      this.getPersonalInfo();
    }
    if (params && params.toBabyList) {
      this.needAuth = false;
      uni.navigateTo({ url: "/pages/personal/baby/index" });
    } else {
      this.needAuth = true;
      wx.showTabBar();
    }
  }
};
</script>

<style lang="scss">
.personal-page {
  box-sizing: border-box;
  min-height: 100%;
  .mark {
    position: fixed;
    top: 0;
    left: 0;
    background: #ffffff;
    text-emphasis: center;
    color: #333333;
  }
  .personal-info {
    display: flex;
    justify-content: flex-start;
    padding: 40rpx 40rpx;
    background-color: #ffffff;
    margin-bottom: 20rpx;

    .personal-info-head {
      width: 150rpx;
      height: 150rpx;
      -webkit-border-radius: 100%;
      -moz-border-radius: 100%;
      border-radius: 100%;
      border: 2rpx solid #d7dce6;
    }

    .personal-info-main {
      width: calc(100% - 200rpx);
      margin-left: 30rpx;
      padding-top: 22rpx;

      .personal-info-name {
        font-size: 30rpx;
        line-height: 30rpx;
        color: #333333;
      }

      .personal-info-city {
        font-size: 24rpx;
        line-height: 24rpx;
        margin-top: 20rpx;
        color: #848484;
      }

      .personal-info-level {
        font-size: 24rpx;
        line-height: 24rpx;
        margin-top: 14rpx;
        color: #848484;
      }
    }
  }

  .personal-menu-item {
    font-size: 28rpx;
    background-color: #ffffff;
    position: relative;
    color: #333333;

    .personal-menu-item-container {
      display: flex;
      justify-content: flex-start;
      border-bottom: 2rpx solid #d7dce6;
      line-height: 34rpx;
      padding: 33rpx 0;
      width: calc(100% - 60rpx);
      margin: 0 30rpx;

      .personal-menu-icon {
        width: 34rpx;
        height: 34rpx;
        margin-right: 24rpx;
      }

      .personal-menu-right-icon {
        position: absolute;
        right: 30rpx;
        width: 24rpx;
        height: 24rpx;
        top: 38rpx;
      }

      &.no-border {
        border-bottom: none;
      }
    }
    &.split {
      margin-top: 40rpx;
    }
    &.noBorder {
      .personal-menu-item-container {
        border: none;
      }
    }
  }
}
</style>
