<!--
 * @Author: Louis
 * @Date: 2019-10-29 08:36:25
 * @LastEditors: Louis
 * @LastEditTime: 2019-10-29 09:55:41
 * @Description:
 -->
<template>
  <div
    class="container"
    ref="container"
  >
    <!-- 授权弹窗 -->
    <auth-dialog></auth-dialog>
    <div class="title">
      2019年儿童身高体重标准快速筛选器
    </div>
    <div class="form-container">
      <form>
        <div class="form-item" v-if="babyList.length > 1">
          <div class="uni-list-cell-left">
            宝宝
          </div>
          <div class="uni-list-cell-db">
            <picker
              @change="changeBaby"
              :value="id"
              range-key="name"
              :range="babyList"
            >
              <div class="uni-input">
                {{ healthForm.babyInfo.name }}
              </div>
            </picker>
          </div>
        </div>
        <div class="form-item" v-if="healthForm.babyInfo.id === '1'">
          <div class="uni-list-cell-left">
            月龄
          </div>
          <div class="uni-list-cell-db">
            <picker
              @change="changeAge"
              :value="id"
              range-key="name"
              :range="ageList"
            >
              <div class="uni-input">{{ healthForm.age.name }}</div>
            </picker>
          </div>
        </div>
        <div class="form-item" v-if="healthForm.babyInfo.id === '1'">
          <div class="uni-list-cell-left">
            性别
          </div>
          <div class="uni-list-cell-db">
            <picker
              @change="changeSex"
              :value="id"
              range-key="name"
              :range="sexList"
            >
              <div class="uni-input">{{ healthForm.sex.name }}</div>
            </picker>
          </div>
        </div>
        <div class="form-item">
          <div class="uni-list-cell-left">
            身高
          </div>
          <div class="uni-list-cell-db">
            <input
              class="uni-input"
              type="digit"
              @input="changeHeight"
              :value="healthForm.height"
              placeholder="请输入身高（CM）"
              placeholder-style="color:#D8EDFC;"
            />
          </div>
        </div>
        <div class="form-item">
          <div class="uni-list-cell-left">
            体重
          </div>
          <div class="uni-list-cell-db">
            <input
              class="uni-input"
              type="digit"
              @input="changeWeight"
              :value="healthForm.weight"
              placeholder-style="color:#D8EDFC;"
              placeholder="请输入体重（KG）"
            />
          </div>
        </div>
        <div
          class="table-list"
          v-if="tableData[0].minusOne !== 0"
        >
          <div class="table">
            <div class="thead">
              <div class="td">数值</div>
              <div class="td">身高（CM）</div>
              <div class="td">体重（KG）</div>
            </div>
            <scroll-div
              scroll-y="true"
              height="200rpx"
            >
              <div class="tbody">
                <div class="tr">
                  <div class="td">-3SD</div>
                  <div
                    class="td"
                    :class="{'active': parseFloat(healthForm.height) < parseFloat(tableData[0].minusTwo)}"
                  >
                    {{ tableData[0].minusThree }}
                  </div>
                  <div
                    class="td"
                    :class="{'active': parseFloat(healthForm.weight) < parseFloat(tableData[1].minusTwo)}"
                  >
                    {{ tableData[1].minusThree }}
                  </div>
                </div>
                <div class="tr">
                  <div class="td">-2SD</div>
                  <div
                    class="td"
                    :class="{'active': parseFloat(tableData[0].minusTwo) < parseFloat(healthForm.height) && parseFloat(healthForm.height) < parseFloat(tableData[0].minusOne)}"
                  >
                    {{ tableData[0].minusTwo }}
                  </div>
                  <div
                    class="td"
                    :class="{'active': parseFloat(tableData[1].minusTwo) < parseFloat(healthForm.weight) && parseFloat(healthForm.weight) < parseFloat(tableData[1].minusOne)}"
                  >
                    {{ tableData[1].minusTwo}}
                  </div>
                </div>
                <div class="tr">
                  <div class="td">-1SD</div>
                  <div
                    class="td"
                    :class="{'active': parseFloat(tableData[0].minusOne) < parseFloat(healthForm.height) && parseFloat(healthForm.height) < parseFloat(tableData[0].normal)}"
                  >
                    {{ tableData[0].minusOne }}
                  </div>
                  <div
                    class="td"
                    :class="{'active': parseFloat(tableData[1].minusOne) < parseFloat(healthForm.weight) && parseFloat(healthForm.weight) < parseFloat(tableData[1].normal)}"
                  >
                    {{ tableData[1].minusOne }}
                  </div>
                </div>
                <div class="tr">
                  <div class="td">中位数</div>
                  <div
                    class="td"
                    :class="{'active': parseFloat(tableData[0].normal) < parseFloat(healthForm.height) && parseFloat(healthForm.height) < parseFloat(tableData[0].plusOne)}"
                  >
                    {{ tableData[0].normal }}
                  </div>
                  <div
                    class="td"
                    :class="{'active': parseFloat(tableData[1].normal) < parseFloat(healthForm.weight) && parseFloat(healthForm.weight) < parseFloat(tableData[1].plusOne)}"
                  >
                    {{ tableData[1].normal }}
                  </div>
                </div>
                <div class="tr">
                  <div class="td">+1SD</div>
                  <div
                    class="td"
                    :class="{'active': parseFloat(tableData[0].plusOne) < parseFloat(healthForm.height) && parseFloat(healthForm.height) < parseFloat(tableData[0].plusTwo)}"
                  >
                    {{ tableData[0].plusOne }}
                  </div>
                  <div
                    class="td"
                    :class="{'active': parseFloat(tableData[1].plusOne) < parseFloat(healthForm.weight) && parseFloat(healthForm.weight) < parseFloat(tableData[1].plusTwo)}"
                  >
                    {{ tableData[1].plusOne }}
                  </div>
                </div>
                <div class="tr">
                  <div class="td">+2SD</div>
                  <div
                    class="td"
                    :class="{'active': parseFloat(tableData[0].plusTwo) < parseFloat(healthForm.height) && parseFloat(healthForm.height) < parseFloat(tableData[0].plusThree)}"
                  >
                    {{ tableData[0].plusTwo }}
                  </div>
                  <div
                    class="td"
                    :class="{'active': parseFloat(tableData[1].plusTwo) < parseFloat(healthForm.weight) && parseFloat(healthForm.weight) < parseFloat(tableData[1].plusThree)}"
                  >
                    {{ tableData[1].plusTwo }}
                  </div>
                </div>
                <div class="tr">
                  <div class="td">+3SD</div>
                  <div
                    class="td"
                    :class="{'active': parseFloat(tableData[0].plusThree) <= parseFloat(healthForm.height)}"
                  >
                    {{ tableData[0].plusThree }}
                  </div>
                  <div
                    class="td"
                    :class="{'active': parseFloat(tableData[1].plusThree) <= parseFloat(healthForm.weight)}"
                  >
                    {{ tableData[1].plusThree }}
                  </div>
                </div>
              </div>
            </scroll-div>
          </div>
        </div>
        <button
          type="primary"
          class="query"
          @click="queryResult"
          hover-class="active"
        >
          查询
        </button>
      </form>
    </div>
  </div>
</template>

<script>
let vm;
import {bestAgeMatch} from "../../../tools/dataFormat"
import authDialog from './../../../components/authDialog'

export default {
  name: "index",
  components:{ authDialog },
  data() {
    return {
      healthForm: {
        age: {},
        sex: {},
        babyInfo: {},
        weight: "",
        height: ""
      },
      babyList: [],
      ageList: [],
      sexList: [],
      tableData: [
        {
          minusThree: 0,
          minusTwo: 0,
          minusOne: 0,
          normal: 0,
          plusOne: 0,
          plusTwo: 0,
          plusThree: 0
        },
        {
          minusThree: 0,
          minusTwo: 0,
          minusOne: 0,
          normal: 0,
          plusOne: 0,
          plusTwo: 0,
          plusThree: 0
        }
      ]
    };
  },
  methods: {
    /**
     * @description 数据清空
     * @fullClear 全部清空
     */
    clearDataInfo(fullClear) {
      this.tableData = [
        {
          minusThree: 0,
          minusTwo: 0,
          minusOne: 0,
          normal: 0,
          plusOne: 0,
          plusTwo: 0,
          plusThree: 0
        },
        {
          minusThree: 0,
          minusTwo: 0,
          minusOne: 0,
          normal: 0,
          plusOne: 0,
          plusTwo: 0,
          plusThree: 0
        }
      ];
      if (fullClear) {
        this.healthForm = {
          age: {},
          babyInfo: {
            id: "1",
            name: "请选择宝宝"
          },
          sex: {},
          weight: "",
          height: ""
        };
        this.setAgeList();
        this.setSexList();
      }
    },
    /**
     * @description 设置年龄列表
     */
    setAgeList() {
      for (let i = 0; i < 82; i++) {
        if (i <= 12) {
          this.ageList.push({
            id: i,
            name: i + "个月"
          });
        }
        if (i > 12 && (i - 12) % 3 === 0) {
          this.ageList.push({
            id: i,
            name:
              i + "个月（" + (i % 12) === 0
                ? parseInt(i / 12) + "岁）"
                : i +
                "个月（" +
                parseInt(i / 12) +
                "岁零" +
                (i - parseInt(i / 12) * 12) +
                "月）"
          });
        }
      }
      this.healthForm.age = this.ageList[0];
    },
    /**
     * @description 设置性别列表
     */
    setSexList() {
      this.sexList = [
        {
          id: "1",
          name: "男"
        },
        {
          id: "2",
          name: "女"
        }
      ];
      this.healthForm.sex = this.sexList[0];
    },
    /**
     * @description 更改年龄
     */
    changeAge(res) {
      this.healthForm.age = this.ageList[res.target.value];
    },
    /**
     * @description 更改性别
     */
    changeSex(res) {
      this.healthForm.sex = this.sexList[res.target.value];
    },
    /**
     * @description 更改身高
     */
    changeHeight(res) {
      this.healthForm.height = res.target.value;
    },
    /**
     * @description 更改体重
     */
    changeWeight(res) {
      this.healthForm.weight = res.target.value;
    },
    /**
     * @description 获取宝宝列表
     */
    async getBabyList() {
      this.babyList.push({
        id: "1",
        name: "请选择宝宝"
      });
      let list = await this.$ajax.post("/api/baby/getBabyList", {
        userId: wx.getStorageSync("userId")
      });
      if (list && list.length > 0) {
        list.map(item => {
          this.babyList.push(item);
        })
      }
    },
    /**
     * @description 更改选中的宝宝
     * @param res 宝宝信息
     */
    changeBaby(res) {
      this.healthForm.babyInfo = this.babyList[res.detail.value];
      if (this.healthForm.babyInfo.id === '1') {
        this.healthForm.age = this.ageList[0]
        this.healthForm.sex = this.sexList[0]
      } else {
        this.healthForm.age.id = bestAgeMatch(this.ageList, this.healthForm.babyInfo.birthDay);
        this.healthForm.sex.id = this.healthForm.babyInfo.sex;
      }
    },
    /**
     * @description 查询结果
     */
    async queryResult() {
      let _this = this;
      _this.clearDataInfo();
      let result = await _this.$ajax.post("/api/getHealthInfo", {
        sex: _this.healthForm.sex.id,
        age: _this.healthForm.age.id,
        userId: wx.getStorageSync("userId"),
        babyId: _this.healthForm.babyInfo.id !== '1' ? _this.healthForm.babyInfo.id : "",
        height: _this.healthForm.height,
        weight: _this.healthForm.weight
      });
      if (result) {
        _this.tableData = result || [];
        wx.showToast({
          title: "查询成功",
          type: "success"
        });
      }
    },
  },
  mounted() {
    vm = this;
    this.getBabyList();
    this.clearDataInfo(true);
    wx.showShareMenu({
      withShareTicket: true
    });
  },
  /**
   * @description 分享信息设置
   */
  onShareAppMessage() {
    return {
      title: "我正在【育婴宝库】查询孩子的身高、体重跟同龄人的对比情况",
      url: "/pages/personal/tools/search",
      desc: "查询孩子的身高、体重发育是否达标",
      imageUrl: "/static/pic.jpg"
    };
  },
  onPullDownRefresh() {
    setTimeout(function () {
      uni.stopPullDownRefresh();
      vm.clearDataInfo(true);
    }, 1000);
  }
};
</script>

<style lang="scss">
  .container {
    min-height: 100%;
    background: #ee7ba6;
    color: #ffffff;
    position: relative;

    .title {
      padding-top: 10rpx;
      text-align: center;
      font-size: 30rpx;
    }

    .form-item {
      display: flex;
      justify-content: flex-start;
      padding: 0 40rpx;
      line-height: 120rpx;
      border-bottom: 2rpx solid #dddddd;

      .uni-list-cell-left {
        width: 120rpx;
      }

      .uni-list-cell-db {
        width: calc(100% - 120rpx);

        input {
          height: 120rpx;
          line-height: 120rpx;

          ::placeholder {
            color: #ffffff;
          }
        }
      }
    }

    .table-list {
      .table {
        padding-top: 50rpx;
        width: 100%;

        .thead {
          display: flex;
          justify-content: flex-start;
          border-top: 2rpx solid #ffffff;
          border-bottom: 2rpx solid #ffffff;

          .td {
            width: calc(100% / 3);
            border-right: 2rpx solid #ffffff;
            padding: 0 10rpx;
            line-height: 50rpx;

            &:nth-child(1) {
              border-left: 2rpx solid #ffffff;
            }
          }
        }

        .tbody {
          width: 100%;

          .tr {
            border-bottom: 2rpx solid #ffffff;
            display: flex;
            justify-content: flex-start;

            .td {
              width: calc(100% / 3);
              border-right: 2rpx solid #ffffff;
              padding: 0 10rpx;
              line-height: 60rpx;

              &:nth-child(1) {
                border-left: 2rpx solid #ffffff;
              }

              &.active {
                background-color: #ffffff;
                color: #007aff;
              }
            }
          }
        }
      }
    }

    .query {
      background-color: #ffffff;
      color: #ee7ba6;
      width: 690rpx;
      padding: 30rpx 0;
      font-size: 34rpx;
      line-height: 34rpx;
      text-align: center;
      -webkit-border-radius: 45rpx;
      -moz-border-radius: 45rpx;
      border-radius: 45rpx;
      margin: 100rpx 30rpx 80rpx;
    }

    .active {
      background-color: #E8E8E8;
    }
  }
</style>
