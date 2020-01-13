<template>
  <div class="page-challenge">
    <auth-dialog
      v-if="showAuthDialog"
      :to-main="`true`"
      current-route="challenge"
      @change="userAuthSetting"
    >
    </auth-dialog>
    <div
      class="page-challenge-item"
      v-for="(item,index) in list"
      :key="item.id"
      :class="{'is-first': index === 0}"
      @click="changePage(item)"
    >
      <div class="icons-bg">
        <img :src="item.imgPath" class="images" alt=""/>
      </div>
      <div class="label">{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
import authDialog from './../../components/authDialog'

export default {
  name: "index",
  components: {
    authDialog
  },
  data() {
    return {
      list: [
        {
          id: "chanllenge",
          imgPath: "./../../static/challenge/challenge.png",
          name: "知识问答",
          pageUrl: "/pages/challenge/question/index",
          needUser: true
        },
        {
          id: "grade",
          imgPath: "./../../static/challenge/grade.png",
          name: "排行榜",
          pageUrl: "/pages/challenge/grade/index",
          needUser: false
        }
      ],
      showAuthDialog: false
    };
  },
  methods: {
    /**
     * @description 前往子级页面
     * @param pageInfo
     */
    changePage(pageInfo) {
      let userInfo = wx.getStorageSync("userInfo") ? JSON.parse(wx.getStorageSync("userInfo")) : null;
      if ((userInfo && userInfo.userId) || !pageInfo.needUser) {
        wx.navigateTo({url: pageInfo.pageUrl});
      } else {
        this.showAuthDialog = true;
      }
    },
    /**
     * @description 用户授权操作
     * @param res
     */
    userAuthSetting(res) {
      this.showAuthDialog = false;
      if (res === "success") {
        let userId = wx.getStorageSync("userId");
        this.$ajax.post("/api/user/getUserInfo", {userId: userId}).then(res => {
          if (res) {
            wx.setStorageSync("userInfo", JSON.stringify(res))
            wx.navigateTo({ url: "/pages/challenge/question/index"})
          }
        });
      }
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
      margin-top: 60rpx;
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

      &.is-first {
        margin-top: 0;

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
