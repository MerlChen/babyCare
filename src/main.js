import Vue from 'vue'
import App from './App'
import fly from "@/tools/flyio";

Vue.config.productionTip = false;

App.mpType = 'app';
fly.config.baseURL = 'https://health.xmxui.com/';

// 请求体配置
fly.interceptors.request.use((request) => {
  //给所有请求添加自定义header
  request.headers["content-type"] = "application/x-www-form-urlencoded";
  let openId = wx.getStorageSync('openId');
  if (openId && request.body && !request.body.openId) {
    request.body.openId = openId;
  }
  return request;
});
// 返回体配置
fly.interceptors.response.use((response) => {
  if (response && response.data.isSuccess) {
    return response.data.totalPage ? response.data : response.data.data;
  } else {
    return false
  }
})
Vue.prototype.$ajax = fly;
const app = new Vue({
  ...App
});
app.$mount();
