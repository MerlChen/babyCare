<template>
  <!-- 授权弹窗 -->
  <div
    class="auth-main"
    v-show="showAuth"
  >
    <div class="auth-dialog">
      <img
        class="wechat-logo"
        src="./../static/logo.png"
      />
      <div class="main-title">
        微信授权
      </div>
      <div class="main-tips">
        为了您更好的使用本产品，请先完成微信授权
      </div>
      <button
        class="auth-btn"
        open-type="getUserInfo"
        @getuserinfo="getAuthUserInfo"
      >
        立即授权
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "dialog",
  props: {
    toMain: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showAuth: false,
      emitResult: false
    }
  },
  methods: {
    /**
     * @description 授权获取用户信息
     * @param res 授权信息
     */
    getAuthUserInfo(res) {
      if (res.detail.userInfo) {
        this.emitResult = true;
        this.getUserInfo('hide');
      } else {
        if (this.toMain) {
          wx.showModal({
            title: "温馨提示",
            content: "您已拒绝微信授权，因数据需要与帐号绑定，请您体验其他功能，给您带来的不变，敬请谅解。",
            showCancel: false,
            confirmColor: "#ee7ba6",
            success:()=>{
              uni.reLaunch({url: "/pages/article/index"})
            }
          })
        } else {
          this.$emit("change", "failed")
        }
      }
    },
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
            uni.showToast({
              title: "数据加载中",
              icon: "loading",
              duration: 30000,
              mask: true
            })
            _this.wxLogin();
          }
          // 若未授权，显示授权弹窗
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
              _this.emitResultInfo();
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
                wx.setStorageSync("userInfo", JSON.stringify(result))
                _this.emitResultInfo();
              }
            });
        }
      });
    },
    /**
     * @description 返回结果，执行回调
     */
    emitResultInfo() {
      wx.hideToast();
      this.$emit("change", "success")
    }
  },
  mounted() {
    this.getUserInfo();
  }
}
</script>

<style lang="scss">
  /** 授权弹窗样式控制 */
  .auth-main {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 3;

    .auth-dialog {
      position: fixed;
      width: 600rpx;
      height: 390rpx;
      background-color: #ffffff;
      border-radius: 20rpx 20rpx 20rpx;
      left: 75rpx;
      top: 50%;
      margin-top: -300rpx;
      z-index: 4;
      text-align: center;

      .wechat-logo {
        width: 150rpx;
        height: 150rpx;
        border-radius: 100%;
        position: relative;
        margin-top: -75rpx;
        border: 4px solid #e8e8e8;
      }

      .main-title {
        margin-top: 20rpx;
        font-size: 34rpx;
        color: #333333;
      }

      .main-tips {
        margin-top: 16rpx;
        font-size: 24rpx;
        color: #606060;
      }

      .auth-btn {
        width: 370rpx;
        height: 72rpx;
        color: #ffffff;
        font-size: 30rpx;
        text-align: center;
        margin-top: 40rpx;
        background: linear-gradient(
            94deg,
            rgba(238, 123, 166, 1),
            rgba(240, 149, 183, 1)
        );
        border-radius: 36rpx;
      }
    }
  }
</style>
