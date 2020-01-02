<template>
  <div class="tools-change">
    <div class="tools-change-item">
      <div class="label">
        微量元素：
      </div>
      <picker
        @change="changeType"
        :value="id"
        class="container"
        range-key="name"
        :range="typeList"
      >
        <div class="uni-input">{{ dataInfo.typeInfo.name }}</div>
      </picker>
    </div>
    <div class="tools-change-item">
      <div class="label">国际单位：</div>
      <div class="container">
        <input
          type="digit"
          :value="dataInfo.international"
          @change="changeInternational"
          placeholder-style="color:#FFFFFF;"
          placeholder="请输入国际单位数量（IU）"
          class="input-container"
        >
      </div>
    </div>
    <div class="tools-change-item">
      <div class="label">标准单位：</div>
      <picker
        @change="changeUnit"
        :value="id"
        class="container"
        range-key="name"
        :range="unitList"
      >
        <div class="uni-input">{{ dataInfo.unitInfo.name }}</div>
      </picker>
    </div>
    <div class="tools-change-item" v-if="showResult">
      <div class="label">
        计算结果：
      </div>
      <div class="container">
        {{ dataInfo.standard + (dataInfo.unitInfo.id) }}
      </div>
    </div>
    <div
      class="change-result-btn"
      hover-class="button-hover"
      @click="showResult ? resetForm() : changeResult()"
    >
      {{ showResult ? "重置表单" : "开始换算" }}
    </div>
  </div>
</template>

<script>
export default {
  name: "change",
  data() {
    return {
      typeList: [
        {
          id: "1",
          name: "请选择微量元素"
        },
        {
          id: "VA",
          name: "维生素A"
        },
        {
          id: "VC",
          name: "维生素C"
        },
        {
          id: "VD",
          name: "维生素D"
        },
        {
          id: "VE",
          name: "维生素E"
        },
        {
          id: "VD3",
          name: "维生素D3"
        }
      ],
      unitList: [
        {
          id: "1",
          name: "请选择单位"
        },
        {
          id: "ug",
          name: "ug(微克)"
        },
        {
          id: "mg",
          name: "mg(毫克)"
        }
      ],
      dataInfo: {
        typeInfo: {
          id: "1",
          name: "请选择微量元素"
        },
        unitInfo: {
          id: "1",
          name: "请选择单位"
        },
        international: 0,
        standard: ""
      },
      showResult: false
    }
  },
  methods: {
    /**
     * @description 更改微量元素类型
     * @param res
     */
    changeType(res) {
      this.dataInfo.typeInfo = this.typeList[res.target.value];
      if(this.showResult){
        this.changeResult()
      }
    },
    /**
     * @description 更改单位类型
     * @param res
     */
    changeUnit(res) {
      this.dataInfo.unitInfo = this.unitList[res.target.value]
      if(this.showResult){
        this.changeResult()
      }
    },
    /**
     * @description 重置表单
     */
    resetForm() {
      this.dataInfo.typeInfo = {
        id: 1,
        name: "请选择"
      }
      this.dataInfo.unitInfo = {
        id: "1",
        name: "请选择单位"
      }
      this.standard = "";
      this.showResult = false;
    },
    /**
     * @description 开始换算
     */
    changeResult() {
      let typeId = this.dataInfo.typeInfo.id;
      let unitId = this.dataInfo.unitInfo.id;
      let errorTips = false;
      if (this.dataInfo.international === '0') {
        errorTips = "请输入国际单位数量"
      }
      if (unitId === "1") {
        errorTips = "请选择标准单位"
      }
      if (typeId === "1") {
        errorTips = "请选择微量元素"
      }
      if (errorTips) {
        wx.showModal({
          title: "温馨提示",
          showCancel: false,
          content: errorTips
        });
        return
      }
      // 结果用ug，进行转换
      let resultNum = 0;
      // 维生素D3
      if (typeId === 'VD3') {
        resultNum = parseFloat(this.dataInfo.international) * 0.025
      }
      // 维生素A
      if (typeId === 'VA') {
        resultNum = parseFloat(this.dataInfo.international) * 0.3
      }
      // 维生素C
      if (typeId === 'VC') {
        resultNum = parseFloat(this.dataInfo.international) * 50
      }
      // 维生素D
      if (typeId === 'VD') {
        resultNum = parseFloat(this.dataInfo.international) * 0.025
      }
      // 维生素E
      if (typeId === 'VE') {
        resultNum = parseFloat(this.dataInfo.international)
      }
      // 如果选择的是mg
      if (unitId === 'mg') {
        resultNum = resultNum / 1000
      }
      this.dataInfo.standard = resultNum;
      this.showResult = true;
    },
    /**
     * @description 更改国际单位数量
     * @param res
     */
    changeInternational(res) {
      this.dataInfo.international = res.target.value;
    }
  },
  /**
   * @description 分享信息设置
   */
  onShareAppMessage() {
    return {
      title: "维生素的国际单位不会换算？快来【育婴宝库】进行数值转换吧",
      url: "/pages/personal/tools/change",
      desc: "维生素国际单位和常用单位转换",
      imageUrl: "/static/pic.jpg"
    };
  },
}
</script>

<style lang="scss" scoped>
  .tools-change {
    height: 100%;
    color: #ffffff;
    position: relative;
    background-color: #ee7ba6;

    .tools-change-item {
      display: flex;
      padding: 0 30rpx;
      line-height: 120rpx;
      justify-content: flex-start;
      border-bottom: 2rpx solid #c8c7cc;

      .container {
        .input-container {
          height: 120rpx;
          line-height: 120rpx;

          &::placeholder {
            color: #ffffff;
          }
        }
      }
    }

    .change-result-btn {
      left: 30rpx;
      bottom: 40rpx;
      width: 690rpx;
      color: #ee7ba6;
      padding: 30rpx 0;
      font-size: 34rpx;
      line-height: 34rpx;
      position: absolute;
      text-align: center;
      background-color: #ffffff;
      -webkit-border-radius: 45rpx;
      -moz-border-radius: 45rpx;
      border-radius: 45rpx;
    }
    .button-hover{
      background-color: #E8ECF2;
    }
  }
</style>
