<template>
  <div class="cattle-container">
    <div class="cattle-lay">
      <div class="cattle-layA">
        <div style="height: 100px">
          功能区域
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="table-expand">
                <el-form-item label="详细信息">
                  <div style="display: flex;flex-wrap:wrap">
                    <div class="label-style">牛只ID：{{ props.row.cattleId }}</div>
                    <div class="label-style">品种：{{ props.row.breed }}</div>
                    <div class="label-style">性别：{{ props.row.sex }}</div>
                    <div class="label-style">月龄：{{ props.row.age }}</div>
                    <div class="label-style">重量：{{ props.row.weight }}</div>
                    <div class="label-style">来源：{{ props.row.source }}</div>
                    <div class="label-style">父亲ID：{{ props.row.fatherId }}</div>
                    <div class="label-style">母亲ID：{{ props.row.motherId }}</div>
                    <div class="label-style">入场日期：{{ props.row.feedDate }}</div>
                    <div class="label-style">离场日期：{{ props.row.leaveDate }}</div>
                    <div class="label-style">健康情况：{{ props.row.healthStatus }}</div>
                    <div class="label-style">牛舍ID：{{ props.row.cattleRoomId }}</div>
                    <div class="label-style">备注：{{ props.row.note }}</div>
                    <div class="label-style"></div>
                  </div>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="牛只ID" prop="cattleId" />
          <el-table-column label="品种" prop="breed" />
          <el-table-column label="性别" prop="sex" />
          <el-table-column label="月龄" prop="age" />
        </el-table>
      </div>
      <div class="cattle-layB">
        其它数据
      </div>
    </div>

    <el-dialog :visible.sync="dialogFormVisible" @close="clearForm">
      <el-card v-model="cattleForm" />
    </el-dialog>
  </div>
</template>

<script>

export default {
  data() {
    return {
      dialogFormVisible: false,
      cattleForm: {},
      tableData: [{
        cattleId: 12922,
        breed: '西门塔尔牛',
        sex: '公牛',
        age: 12,
        weight: 300,
        source: '牧场繁育',
        fatherId: 9254,
        motherId: 8691,
        feedDate: '2022-03-09',
        leaveDate: '暂无',
        healthStatus: '正常',
        cattleRoomId: '39',
        note: '无'
      }, {
        cattleId: 12059,
        breed: '利木赞牛',
        sex: '母牛',
        age: 9,
        weight: 300,
        source: '牧场繁育',
        fatherId: 9254,
        motherId: 8691,
        feedDate: '2022-03-09',
        leaveDate: '暂无',
        healthStatus: '正常',
        cattleRoomId: '39',
        note: '无'
      }, {
        cattleId: 10268,
        breed: '西门塔尔牛',
        sex: '公牛',
        age: 8,
        weight: 300,
        source: '牧场繁育',
        fatherId: 9254,
        motherId: 8691,
        feedDate: '2022-03-09',
        leaveDate: '暂无',
        healthStatus: '正常',
        cattleRoomId: '39',
        note: '无'
      }, {
        cattleId: 11658,
        breed: '利木赞牛',
        sex: '公牛',
        age: 10,
        weight: 300,
        source: '牧场繁育',
        fatherId: 9254,
        motherId: 8691,
        feedDate: '2022-03-09',
        leaveDate: '暂无',
        healthStatus: '正常',
        cattleRoomId: '39',
        note: '无'
      }]
    }
  },
  mounted() {
  },

  methods: {
    goToDetail() {
      this.dialogFormVisible = true
    },
    clearForm() {
      this.cattleForm = {}
      this.dialogFormVisible = false
    }
  }
}

</script>

<style>
.cattle-container {
  height: 100%;
  background-color: #e7eaed;
}
.cattle-lay {
  display: flex;
}
.cattle-layA {
  flex: 2;
  margin: 10px;
  border-radius: 10px;
  background-color: #fbfbfb;
  text-align: center;
  height: 700px;
}
.cattle-layB {
  flex: 1;
  margin: 10px;
  border-radius: 10px;
  background-color: #fbfbfb;
  text-align: center;
  height: 700px;
}
.table-expand {
  padding-left: 60px;
}
.label-style {
  width: 33.33%;
  color:rgb(153, 153, 153);
  font-size: 13px;
}

</style>
