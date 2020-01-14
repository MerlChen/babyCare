<template>
  <div class="share">
    您的好友{{ requestParams.nickName }}需要您的助力
    <div
      class="help-button"
      hover-class="button-hover"
      @click="helpFriend"
    >
      帮助他（她）
    </div>
    <authDialog
      v-if="showAuthDialog"
      @change="userAuthSetting"
    >
    </authDialog>
  </div>
</template>

<script>
import authDialog from './../../../components/authDialog'

export default {
  name: "help",
  components: {
    authDialog
  },
  data() {
    return {
      requestParams: {},
      showAuthDialog: ""
    }
  },
  methods: {
    userAuthSetting(res) {
      if (res === "success") {
        wx.showToast({
          title: "已执行登录了"
        })
      } else {
        wx.showToast({
          title: "用户拒绝授权了"
        })
      }
    },
    helpFriend() {
      let userId = wx.getStorageSync("help")
      if (!userId) {
        this.showAuthDialog = true;
      } else {
        wx.showToast({
          title: "帮助成功"
        })
      }
    }
  },
  onLoad(params) {
    this.requestParams = params ? params : {
      userId: "111",
      nickName: "Exception"
    }
  }
}
</script>

<style lang="scss" scoped>
  .share {
    height: 100%;
    width: 100%;
    background: #EE7BA6;
  }
</style>
