<!--
 * @Author: Louis
 * @Date: 2019-10-28 10:10:15
 * @LastEditors: Louis
 * @LastEditTime: 2019-10-29 09:44:46
 * @Description: 底部页签组件
 -->
<template>
  <div class="tab-bar">
    <div
      class="tab-bar-item"
      v-for="item in list"
      :key="item.id"
      @click="changePage(item)"
    >
      <image
        :src="item.id === currentRoute ? item.activeImgPath : item.imgPath"
        class="tab-bar-item-img"
        lazy-load="false"
      >
      </image>
      <div
        class="tab-bar-item-name"
        :class="{'active': item.id === currentRoute }"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "tabBar",
  props: {
    currentRoute: {
      type: String,
      default: "homePage"
    }
  },
  data() {
    return {
      list: [
        {
          id: "homePage",
          name: "知识课堂",
          imgPath: "./../static/tab/home.png",
          activeImgPath: "./../static/tab/home_active.png",
          pagePath: "/pages/article/index"
        },
        {
          id: "challenge",
          name: "问答挑战",
          imgPath: "./../static/tab/question.png",
          activeImgPath: "./../static/tab/question_active.png",
          pagePath: "/pages/challenge/index"
        },
        {
          id: "personal",
          name: "个人中心",
          imgPath: "./../static/tab/personal.png",
          activeImgPath: "./../static/tab/personal_active.png",
          pagePath: "/pages/personal/index"
        }
      ]
    };
  },
  methods: {
    /**
     * @description 切换界面
     * @param itemData 对应的数据信息
     */
    changePage(itemData) {
      if (itemData.id !== this.currentRoute) {
        wx.navigateTo({ url: itemData.pagePath });
      }
    }
  }
};
</script>
<style lang="scss">
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 88upx;
  background-color: #ffffff;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  border-top: 2upx solid #e8e8e8;
  .tab-bar-item {
    width: calc(100% / 3);
    text-align: center;
    padding: 10upx 0;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .tab-bar-item-img {
      width: 40upx;
      height: 40upx;
    }
    .tab-bar-item-name {
      width: 100%;
      margin-top: 4upx;
      font-size: 24upx;
      line-height: 24upx;
      &.active {
        color: #ee7ba6;
      }
    }
  }
}
</style>
