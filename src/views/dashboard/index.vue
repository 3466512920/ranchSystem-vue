<template>
  <div class="dashboard-container">
    <div class="content-car">
      <div style="flex: 1">
        <el-carousel height="600px">
          <el-carousel-item>
            <img src="../../assets/images/test1.jpg" alt="">
          </el-carousel-item>
          <el-carousel-item>
            <img src="../../assets/images/test2.jpg" alt="">
          </el-carousel-item>
          <el-carousel-item>
            <img src="../../assets/images/test3.jpg" alt="">
          </el-carousel-item>
          <el-carousel-item>
            <img src="../../assets/images/test4.jpg" alt="">
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <div class="contentA">
      <div class="layA">
        <div style="display: flex">
          <div style="flex: 1; margin-top: 10px;">
            <img src="../../assets/images/income.jpg" alt="" style="width: 80px; height: 80px">
          </div>
          <div style="flex: 2; margin-left: -70px">
            <div style="margin-top: 10px; font-size: 20px">年累计收入</div>
            <el-statistic style="margin-top: 10px" group-separator="," :precision="2" decimal-separator="." :value="income">
              <template slot="prefix">
                <b class="el-icon-s-flag" style="color: red" />
              </template>
              <template slot="suffix">
                <i class="el-icon-s-flag" style="color: blue" />
              </template>
            </el-statistic>
            <div style="margin-top: 10px; font-size: 10px">昨日新增{{ yesterdayIncome }}元</div>
          </div>
        </div>
      </div>
      <div class="layA">
        <div style="display: flex">
          <div style="flex: 1; margin-top: 10px">
            <img src="../../assets/images/outcome.jpg" alt="" style="width: 80px; height: 80px">
          </div>
          <div style="flex: 2; margin-left: -70px">
            <div style="margin-top: 10px; font-size: 20px">年累计支出</div>
            <el-statistic style="margin-top: 10px" group-separator="," :precision="2" decimal-separator="." :value="outcome">
              <template slot="prefix">
                <b class="el-icon-s-flag" style="color: red" />
              </template>
              <template slot="suffix">
                <i class="el-icon-s-flag" style="color: blue" />
              </template>
            </el-statistic>
            <div style="margin-top: 10px; font-size: 10px">昨日新增{{ yesterdayOutcome }}元</div>
          </div>
        </div>
      </div>
      <div class="layA">
        <div style="display: flex">
          <div style="flex: 1; margin-top: 10px">
            <img src="../../assets/images/feed.jpg" alt="" style="width: 80px; height: 80px">
          </div>
          <div style="flex: 2; margin-left: -70px">
            <div style="margin-top: 10px; font-size: 20px">饲料库存</div>
            <div style="margin-top: 10px">
              <span v-if="feedState==='库存充足'" style="color: deepskyblue">{{ feedState }}</span>
              <span v-else style="color: red">{{ feedState }}</span>
            </div>
            <div style="margin-top: 10px; font-size: 10px">
              <el-link>
                详情
              </el-link>
            </div>
          </div>
        </div>
      </div>
      <div class="layA">
        <div style="display: flex">
          <div style="flex: 1; margin-top: 10px">
            <img src="../../assets/images/medicine.jpg" alt="" style="width: 80px; height: 80px">
          </div>
          <div style="flex: 2; margin-left: -70px">
            <div style="margin-top: 10px; font-size: 20px">药品库存</div>
            <div style="margin-top: 10px">
              <span v-if="feedState==='库存充足'" style="color: deepskyblue">{{ medicineState }}</span>
              <span v-else style="color: red">{{ medicineState }}</span>
            </div>
            <div style="margin-top: 10px; font-size: 10px">
              <el-link>
                详情
              </el-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="contentB">
      <div class="layB1">
        <div class="css-background">
          <div class="css-form">
            <el-card class="css-introduce">
              <span style="line-height: 20px">
                xx牧场有限公司，始建于2010年，
                是集肉牛养殖与智慧管理的大型农牧企业。
                厂区于2015年全面建成，座落于xx省xx市xx新区，
                国道101与省道107交汇处，地域优越，交通方便，
                占地面积30000多平方米。
              </span>
            </el-card>
          </div>
        </div>
      </div>
      <div class="layB2">
        <span style="margin-left: 10px">重要公告</span>
        <!--通知列表-->
        <div style="width:460px; height: 200px; overflow:auto">
          <div v-for="item in noticeData" :key="item">
            <el-link class="css-link" @click="goToNoticeDetail(item)">
              <el-card shadow="always" class="notice-item">{{ item }}</el-card>
            </el-link>
          </div>
        </div>

      </div>
      <div id="calvingEcharts" class="layB3" />
    </div>

    <div class="contentC">
      <div id="ageEcharts" class="layC1" />
      <div id="healthEcharts" class="layC2" />
    </div>

    <el-dialog :title="noticeTitle" :visible.sync="dialogFormVisible" @close="clearForm">
      <el-card v-model="noticeForm">
        <span>{{ noticeForm.desc }}</span>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'

// 对服务端进行websocket连接
import SocketService from '@/hooks/websocket'

import * as echarts from 'echarts'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    const url = 'ws://localhost:8080/socket/' + store.getters.account
    SocketService.Instance.useWebSocket(url, this.handelMessage)
  },

  // eslint-disable-next-line vue/order-in-components
  data() {
    return {
      dialogFormVisible: false,
      noticeData: ['第一季度绩效考核通知', '3月份牛只产犊数据公示', '2023年终福利公示', '国庆节放假通知', '第一季度绩效考核通知', '3月份牛只产犊数据公示'],
      noticeForm: {},
      noticeTitle: '',
      income: 125876,
      yesterdayIncome: 1685,
      outcome: 38975.5,
      yesterdayOutcome: '650',
      feedState: '库存充足',
      medicineState: '库存充足',
      ageData: [26, 35, 45, 52, 68, 31, 10],
      healthYData1: [15, 21, 11, 8, 16, 33, 12, 5, 6, 10, 15, 23],
      healthYData2: [3, 1, 0, 0, 0, 2, 1, 0, 4, 1, 0, 0]
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    goToNoticeDetail(item) {
      this.noticeTitle = item
      this.dialogFormVisible = true
    },
    clearForm() {
      this.noticeForm = {}
      this.dialogFormVisible = false
    },
    load() {
      let ageOption
      // eslint-disable-next-line prefer-const
      ageOption = {
        backgroundColor: '',
        /** 配置图标离容器上下左右的距离 */
        grid: {
        },
        title: {
          text: '各年龄段牛只占比情况',
          left: 'center'
        },
        legend: {
          data: ['0~3个月', '3~6个月', '6~9个月', '9~12个月', '12~15个月', '15~18个月', '18个月以上'],
          top: '85%',
          orient: 'horizontal'
        },
        tooltip: {
          trigger: 'axis'
        },
        series: [{
          type: 'pie',
          label: {
            show: true,
            formatter: '{b} : {c} ({d}%)' // b代表名称，c代表对应值，d代表百分比
          },
          radius: '55%',
          data: [
            {
              name: '0~3个月',
              value: this.ageData[0]
            },
            {
              name: '3~6个月',
              value: this.ageData[1]
            },
            {
              name: '6~9个月',
              value: this.ageData[2]
            },
            {
              name: '9~12个月',
              value: this.ageData[3]
            },
            {
              name: '12~15个月',
              value: this.ageData[4]
            },
            {
              name: '15~18个月',
              value: this.ageData[5]
            },
            {
              name: '18个月以上',
              value: this.ageData[6]
            }
          ]
        }]
      }

      let healthOption
      // eslint-disable-next-line prefer-const
      healthOption = {
        backgroundColor: '',
        /** 配置图标离容器上下左右的距离 */
        grid: {
          top: '20%',
          right: '10%',
          left: '10%',
          bottom: '10%'
        },
        title: {
          text: '前12个月牛只健康情况统计',
          left: 'center'
        },
        legend: {
          data: ['生病数量', '死亡数量'],
          top: '10%'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        yAxis: {
          type: 'value',
          name: '单位（只）'
        },
        series: [
          {
            name: '生病数量',
            type: 'bar',
            data: this.healthYData1
          },
          {
            name: '死亡数量',
            type: 'bar',
            data: this.healthYData2
          }
        ]
      }

      // eslint-disable-next-line no-unused-vars
      let calvingOption
      // eslint-disable-next-line prefer-const
      calvingOption = {
        backgroundColor: '',
        /** 配置图标离容器上下左右的距离 */
        grid: {
          top: '20%',
          right: '10%',
          left: '10%',
          bottom: '10%'
        },
        title: {
          text: '前12个月产犊数据统计',
          left: 'center'
        },
        legend: {
          data: ['成功数量', '流产数量'],
          top: '10%'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        yAxis: {
          type: 'value',
          name: '单位（只）'
        },
        series: [
          {
            name: '成功数量',
            type: 'line',
            data: this.healthYData1
          },
          {
            name: '流产数量',
            type: 'line',
            data: this.healthYData2
          }
        ]
      }

      const calvingEcharts = echarts.init(document.getElementById('calvingEcharts'), 'light', { renderer: 'svg' })
      calvingEcharts.setOption(calvingOption)

      const ageEcharts = echarts.init(document.getElementById('ageEcharts'), 'light', { renderer: 'svg' })
      ageEcharts.setOption(ageOption)

      const healthEcharts = echarts.init(document.getElementById('healthEcharts'), 'light', { renderer: 'svg' })
      healthEcharts.setOption(healthOption)

      window.addEventListener('resize', () => {
        calvingEcharts.resize()
        ageEcharts.resize()
        healthEcharts.resize()
      })
    },

    about() {
      this.$router.push('/about')
    },

    handelMessage(e) {
      if (typeof (WebSocket) === 'undefined') {
        console.log('您的浏览器不支持WebSocket')
      } else {
        console.log('您的浏览器支持WebSocket')

        console.log('收到数据：' + e.data)
        // 消息提醒
        alert(e.data)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  // margin: 30px;
  height: 100%;
  background-color: #e7eaed;
  //background-size: 100% 100%;
}
.contentA {
  display: flex;
}
.layA {
  flex: 1;
  margin: 10px;
  text-align: center;
  height: 100px;
  background-color: #fbfbfb;
  border-radius: 10px;
  color: black;
}
.content-car {
  display: flex;
  height: 600px;
  margin: 10px;
  border-radius: 10px;
}
.contentB {
  display: flex;
}
.layB1 {
  flex: 1;
  margin: 10px;
  height: 250px;
  border-radius: 10px;
  background-color: #fbfbfb;
  color: black;
  padding: 1px;
}
.layB2 {
  flex: 1;
  margin: 10px;
  height: 250px;
  border-radius: 10px;
  background-color: #fbfbfb;
  color: black;
  padding: 10px;
}
.layB3 {
  flex: 1;
  margin: 10px;
  height: 250px;
  border-radius: 10px;
  background-color: #fbfbfb;
  color: black;
  padding: 1px;
}
.contentC {
  display: flex;
}
.layC1 {
  flex: 2;
  margin: 10px;
  text-align: center;
  height: 350px;
  border-radius: 10px;
  background-color: #fbfbfb;
}
.layC2 {
  flex: 3;
  margin: 10px;
  text-align: center;
  height: 350px;
  background-color: #fbfbfb;
  border-radius: 10px;
  color: black;
}
.css-background {
  height: 250px;
  width: 461px;
  border-radius: 10px;
  background: url("~@/assets/images/cattle1.jpg");
  background-size: cover;
}
.css-form {
  height: 200px;
  width: 400px;
  border-radius: 10px;
  padding-top: 140px;
  opacity: 0.9;
}
.css-introduce {
  height: 112px;
  width: 461px;
  background-color: white;
  border-radius: 0 0 10px 10px;
}
.css-link {
  height: 40px;
  width: 440px;
  margin-top: 10px;
}
.notice-item {
  border-left: 2px solid blue;
  height: 40px;
  width: 440px;
  border-radius: 1px;
  line-height: 3px;
  margin: auto;
}

</style>
