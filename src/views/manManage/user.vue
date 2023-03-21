<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input
            v-model="queryName"
            class="query-input"
            prefix-icon="el-icon-search"
            placeholder="请输入用户名字"
            clearable
            @keyup.enter.native="searchEnter"
          />
        </el-col>
        <el-col :span="4" align="right">
          <el-button size="medium" @click="openEditUI(null)">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 用户列表 -->
    <el-card>
      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column label="头像" width="100">
          <template v-slot="products">
            <img :src="products.row.photo" width="50" height="50" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="account" label="账号" width="100" />
        <el-table-column prop="name" label="名字" width="100" />
        <el-table-column prop="gender" label="性别" width="100" />
        <el-table-column prop="birthday" label="出生日期" width="100" />
        <el-table-column prop="registerDate" label="注册日期" width="100" />
        <el-table-column prop="telephoneNumber" label="电话" width="150" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="state" label="用户状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state === '1'">正常</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="openEditUI(scope.row.userId)" />
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteUser(scope.row)" />
          </template>
        </el-table-column>
      </el-table>

      <!--数据量显示-->
      <div style="margin:5px 0">
        <el-pagination
          layout="total"
          :total="total"
        />
      </div>
    </el-card>

    <!-- 用户信息编辑对话框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" @close="clearForm">
      <el-form ref="userFormRef" :model="userForm" :rules="rules">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="userForm.account" placeholder="登陆账号：输入其它信息后显示自动生成的账号" disabled autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="userForm.userId == null || userForm.userId === undefined" label="登录密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="userForm.password" type="password" show-password autocomplete="off" />
        </el-form-item>
        <el-form-item label="名字" :label-width="formLabelWidth">
          <el-input v-model="userForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-input v-model="userForm.gender" autocomplete="off" />
        </el-form-item>
        <el-form-item label="出生日期" :label-width="formLabelWidth">
          <el-input v-model="userForm.birthday" autocomplete="off" />
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <el-input v-model="userForm.telephoneNumber" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户状态" :label-width="formLabelWidth">
          <el-switch
            v-model="userForm.state"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="用户角色" :label-width="formLabelWidth">
          <el-checkbox-group
            v-model="userForm.roleIdList"
            :max="1"
            style="width: 85%"
          >
            <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleDesc }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="电子邮件" prop="email" :label-width="formLabelWidth">
          <el-input v-model="userForm.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="图片链接" prop="photo" :label-width="formLabelWidth">
          <el-input v-model="userForm.photo" autocomplete="off" style="width: 85%" type="textarea" :autosize="{ minRows: 1, maxRows: 3}" />
        </el-form-item>
        <el-form-item label="">
          <el-form-item label="">
            <img :src="userForm.photo" style="width:20%; margin-left: 20%" alt="">
          </el-form-item>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUser">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import { getUserList, queryByName, deleteUserById, getAccount, updateUser, addUser, getUserById } from '@/api/userManage'
import { queryAll } from '@/api/roleManage'
import store from '@/store'
import SocketService from '@/hooks/websocket'

export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      var reg =
        /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/
      if (!reg.test(value)) {
        return callback(new Error('邮箱格式错误'))
      }
      callback()
    }
    return {
      queryName: '',
      formLabelWidth: '130px',
      userForm: {
        roleIdList: []
      },
      dialogFormVisible: false,
      title: '',
      total: 0,
      userList: [],
      roleList: [],
      rules: {
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入电子邮件', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    const url = 'ws://localhost:8080/socket/' + store.getters.account
    SocketService.Instance.useWebSocket(url, this.handelMessage)

    this.getAll()
  },
  methods: {
    handelMessage(e) {
      if (typeof (WebSocket) === 'undefined') {
        console.log('您的浏览器不支持WebSocket')
      } else {
        console.log('您的浏览器支持WebSocket')

        console.log('收到数据：' + e.data)
        // 消息提醒
        alert(e.data)
      }
    },
    getAllRole() {
      queryAll().then(response => {
        this.roleList = response.data.dataList
        console.log(this.roleList)
      })
    },
    deleteUser(user) {
      this.$confirm(`您确认删除用户 ${user.name} ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUserById(user.userId).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.getAll()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 更新或者添加用户
    saveUser() {
      // userId存在则为更新
      if (this.userForm.userId) {
        // 触发表单验证
        this.$refs.userFormRef.validate((valid) => {
          if (valid) {
            // 提交请求给后台
            updateUser(this.userForm).then(response => {
              // 成功提示
              this.$message({
                type: 'success',
                message: response.message
              })
              // 关闭对话框
              this.dialogFormVisible = false
              // 刷新表格
              this.getAll()
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
        // eslint-disable-next-line brace-style
      }
      // 否则为新增
      else {
        // 触发表单验证
        this.$refs.userFormRef.validate((valid) => {
          if (valid) {
            // 提交请求给后台
            addUser(this.userForm).then(response => {
              // 成功提示
              this.$message({
                type: 'success',
                message: response.message
              })
              // 关闭对话框
              this.dialogFormVisible = false
              // 刷新表格
              this.getAll()
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    clearForm() {
      this.userForm = {
        roleIdList: []
      }
      this.$refs.userFormRef.clearValidate()
    },
    openEditUI(id) {
      this.getAllRole()
      if (id == null) {
        this.title = '新增用户'
        getAccount().then(response => {
          this.userForm.account = response.data
        })
      } else {
        this.title = '修改用户'
        // 根据id查询用户数据
        getUserById(id).then(response => {
          this.userForm = response.data
        })
      }
      this.dialogFormVisible = true
    },

    getAll() {
      getUserList().then((response) => {
        this.userList = response.data.dataList
        this.total = response.data.dataVolume
        console.log(this.userList)
      })
    },

    getUserByName(name) {
      queryByName(name).then((response) => {
        this.userList = response.data.dataList
        this.total = response.data.dataVolume
      })
    },

    // 按下键盘回车键进行搜索
    searchEnter(e) {
      var keyCode = window.event ? e.keyCode : e.which
      if (keyCode === 13) {
        this.getUserByName(this.queryName)
      }
    }

  }
}
</script>

<style>
.query-input {
  width: 400px;
  height: 20px;
  margin-right: 10px;
}
.el-dialog .el-input {
  width: 85%;
}

</style>
