<!--
 * @Author: Louis
 * @Date: 2019-10-25 09:25:21
 * @LastEditors: Louis
 * @LastEditTime: 2019-10-29 09:51:32
 * @Description:
 -->
<template>
  <div class="personal-page">
    <!-- 用户信息 -->
    <div class="personal-info">
      <!-- 用户头像 -->
      <image
        class="personal-info-head"
        :src="userInfo.avatarUrl"
      >
      </image>
      <!-- 用户主体信息 -->
      <div class="personal-info-main">
        <!-- 用户昵称 -->
        <div class="personal-info-name">
          {{ userInfo.nickName }}
        </div>
        <!-- 用户所在地区 -->
        <div class="personal-info-city">
          {{ userInfo.province +'·'+ userInfo.city }}
        </div>
        <!-- 用户级别及积分信息 -->
        <div class="personal-info-level">
          {{ levelCount(userInfo.score) + "："+ userInfo.score }}
        </div>
      </div>
    </div>
    <!-- 个人中心功能菜单 -->
    <div
      v-for="(item,index) in menuList"
      :key="item.id"
      @click="changePage(item)"
      class="personal-menu-item"
    >
      <div
        class="personal-menu-item-container"
        :class="{'no-border': index+1 === menuList.length}"
      >
        <img
          :src="item.iconPath"
          class="personal-menu-icon"
        />
        <div class="personal-menu-name">
          {{ item.name }}
        </div>
        <img
          src="./../../static/personal/right.png"
          class="personal-menu-right-icon">
      </div>
    </div>
    <!-- tabBar -->
    <tab-bar current-route="personal"></tab-bar>
  </div>
</template>

<script>
import tabBar from "./../../components/tabBar";
import {levelCount} from "../../tools/dataFormat";

export default {
  name: "index",
  components: {
    tabBar
  },
  data() {
    return {
      userInfo: {
        avatarUrl: "",
        nickName: "昵称就是七个字",
        province: "湖南",
        city: "长沙",
        level: "育儿砖家",
        score: "2000"
      },
      menuList: [
        {
          id: "myBaby",
          name: "我的宝贝",
          iconPath: "./../../static/personal/baby.png",
          pageInfo: "/pages/personal/baby/index"
        },
        {
          id: "basicTool",
          name: "身高体重查询器",
          iconPath: "./../../static/personal/search.png",
          pageInfo: "/pages/personal/tools/search"
        },
        {
          id: "myTools",
          name: "微量元素单位转换",
          iconPath: "./../../static/personal/tools.png",
          pageInfo: "/pages/personal/tools/change"
        },
        {
          id: "favorite",
          name: "我的收藏",
          iconPath: "./../../static/article/favorited.png",
          pageInfo: "/pages/personal/favorite/index"
        }
      ]
    };
  },
  /**
   * @description 触发微信分享
   * @return {{path: string, success: success, title: string, error: error}}
   */
  onShareAppMessage: function () {
    return {
      title: "我正在“育儿帮”学习专业的育儿知识",
      path: "/pages/article/index",
      success: res => {
        console.log(res);
      },
      error: err => {
        console.log(err);
      }
    };
  },
  methods: {
    /**
     * @description 积分换算成等级
     */
    levelCount,
    /**
     * @description 获取用户详细数据信息
     */
    getPersonalInfo() {
      let userId = wx.getStorageSync("userId");
      this.$ajax.post("/api/user/getUserInfo", {userId: userId}).then(res => {
        if (res) {
          this.userInfo = res;
        }
      });
    },
    /**
     * @description 切换至子级系统
     */
    changePage(itemData) {
      uni.navigateTo({url: itemData.pageInfo});
    }
  },
  mounted() {
    this.getPersonalInfo();
  }
};
</script>

<style lang="scss">
  .personal-page {
    box-sizing: border-box;

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
          margin-top: 12rpx;
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
    }
  }
</style>
