<!--
 * @Author: Louis
 * @Date: 2019-10-25 09:25:21
 * @LastEditors: Louis
 * @LastEditTime: 2019-10-29 09:57:27
 * @Description:身高体重曲线图
 -->
<template>
  <div class="personal-charts">
    <canvas
      canvas-id="heightCanvas"
      disable-scroll="true"
      class="heightCanvas canvas"
    >
    </canvas>
    <canvas
      canvas-id="weightCanvas"
      disable-scroll="true"
      class="weightCanvas canvas"
    >
    </canvas>
  </div>
</template>

<script>
let wxCharts = require("../../../tools/wx-charts.min");
let lineCharts = null;
export default {
  name: "charts",
  data() {
    return {};
  },
  onLoad() {
    this.$nextTick(() => {
      this.setChartsInfo();
    });
  },
  methods: {
    setChartsInfo() {
      this.setHeightChartsInfo();
      this.setWeightChartsInfo();
    },
    setHeightChartsInfo() {
      let windowWidth = null;
      windowWidth = wx.getSystemInfoSync().windowWidth + 20;
      let categories = [];
      let data = [];
      for (let i = 0; i < 10; i++) {
        categories.push("2019-" + (i + 1));
        data.push(Math.random() * (20 - 10) + 10);
      }
      let simulationData = {
        categories: categories,
        data: data
      };
      lineCharts = new wxCharts({
        canvasId: "heightCanvas",
        type: "line",
        categories: simulationData.categories,
        animation: true,
        series: [
          {
            name: "身高",
            data: [75, 76, 78, 83, 87, 90, 100, 105, 118, 135],
            format: function(val, name) {
              return val.toFixed(2) + "cm";
            }
          }
        ],
        xAxis: {
          title: "身高成长曲线(CM)",
          format: function(val) {
            return val.toFixed(2);
          },
          min: 0
        },
        yAxis: {
          disableGrid: true
        },
        width: windowWidth,
        height: 220,
        dataLabel: false,
        dataPointShape: true,
        extra: {
          lineStyle: "curve"
        }
      });
    },
    setWeightChartsInfo() {
      let windowWidth = null;
      windowWidth = wx.getSystemInfoSync().windowWidth + 20;
      let categories = [];
      let data = [];
      for (let i = 0; i < 10; i++) {
        categories.push("2019-" + (i + 1));
        data.push(Math.random() * (20 - 10) + 10);
      }
      let simulationData = {
        categories: categories,
        data: data
      };
      lineCharts = new wxCharts({
        canvasId: "weightCanvas",
        type: "line",
        categories: simulationData.categories,
        animation: true,
        series: [
          {
            name: "体重",
            data: [15, 16, 18, 23, 27, 30, 30, 35, 38, 35],
            format: function(val, name) {
              return val.toFixed(2) + "KG";
            }
          }
        ],
        xAxis: {
          title: "体重成长曲线(KG)",
          format: function(val) {
            return val.toFixed(2);
          },
          min: 0
        },
        yAxis: {
          disableGrid: true
        },
        width: windowWidth,
        height: 220,
        dataLabel: false,
        dataPointShape: true,
        extra: {
          lineStyle: "curve"
        }
      });
    }
  },
  mounted() {
    wx.showShareMenu({
      withShareTicket: true
    });
  },
  /**
   * @description 分享信息设置
   */
  onShareAppMessage() {
    return {
      title: "优速查-快速查询、统计孩子的身高、体重",
      url: "/pages/article/index",
      desc: "查询并统计孩子的身高、体重发育趋势",
      imageUrl: "/static/pic.png"
    };
  }
};
</script>

<style lang="scss" scoped>
.personal-charts {
  canvas {
    width: 100%;
    background-color: #ffffff;
    height: 400rpx;
    margin-bottom: 20rpx;
  }
}
</style>
