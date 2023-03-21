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
            placeholder="请输入角色名"
            clearable
            @keyup.enter.native="searchEnter"
          />
        </el-col>
        <el-col :span="4" align="right">
          <el-button size="medium" @click="openEditUI(null)">添加角色</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 角色列表 -->
    <el-card>
      <el-table :data="roleList" stripe style="width: 100%">
        <el-table-column prop="roleId" label="角色ID" width="300" />
        <el-table-column prop="roleName" label="角色名" width="300" />
        <el-table-column prop="roleDesc" label="描述" width="300" />
        <el-table-column label="操作" fixed="right" width="180">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="openEditUI(scope.row.roleId)" />
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteRole(scope.row)" />
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
      <el-form ref="roleFormRef" :model="roleForm" :rules="rules">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="roleForm.roleName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input v-model="roleForm.roleDesc" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="menuIdList" label="权限设置" :label-width="formLabelWidth">
          <el-tree
            ref="menuRef"
            :data="menuList"
            :props="menuProps"
            show-checkbox
            style="width: 85%"
            default-expand-all
            node-key="menuId"
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { addRole, deleteRole, getRoleById, queryAll, queryByName, updateRole } from '@/api/roleManage'
import { queryAllMenu } from '@/api/menuManage'

export default {
  data() {
    return {
      queryName: '',
      formLabelWidth: '130px',
      roleForm: {},
      dialogFormVisible: false,
      title: '',
      total: 0,
      roleList: [],
      menuList: [],
      menuProps: {
        children: 'children',
        label: 'title'
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getAll()
    // 获取菜单列表
    this.getAllMenu()
  },
  methods: {
    deleteRole(role) {
      this.$confirm(`您确认删除角色 ${role.roleName} ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(role.roleId).then(response => {
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

    saveRole() {
      // 获取菜单权限列表
      const checkedKeys = this.$refs.menuRef.getCheckedKeys()
      const halfCheckedKeys = this.$refs.menuRef.getHalfCheckedKeys()
      this.roleForm.menuIdList = checkedKeys.concat(halfCheckedKeys)

      // 更新角色权限
      if (this.roleForm.roleId) {
        // 触发表单验证
        this.$refs.roleFormRef.validate((valid) => {
          if (valid) {
            // 提交请求给后台
            updateRole(this.roleForm).then(response => {
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
      // 添加角色权限
      else {
        // 触发表单验证
        this.$refs.roleFormRef.validate((valid) => {
          if (valid) {
            // 提交请求给后台
            addRole(this.roleForm).then(response => {
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
      this.roleForm = {}
      this.$refs.roleFormRef.clearValidate()
      this.$refs.menuRef.setCheckedKeys([])
    },
    openEditUI(id) {
      this.dialogFormVisible = true
      if (id == null) {
        this.title = '新增角色'
      } else {
        this.title = '修改角色'
        // 根据id查询用户数据
        getRoleById(id).then(response => {
          // 数据回显
          this.roleForm = response.data
          this.$refs.menuRef.setCheckedKeys(response.data.menuIdList)
        })
      }
    },

    getAll() {
      queryAll().then((response) => {
        this.roleList = response.data.dataList
        this.total = response.data.dataVolume
        console.log(this.roleList)
      })
    },

    getAllMenu() {
      queryAllMenu().then(response => {
        this.menuList = response.data
      })
    },

    getRoleByName(name) {
      queryByName(name).then((response) => {
        this.roleList = response.data.dataList
        this.total = response.data.dataVolume
      })
    },

    // 按下键盘回车键进行搜索
    searchEnter(e) {
      var keyCode = window.event ? e.keyCode : e.which
      if (keyCode === 13) {
        this.getRoleByName(this.queryName)
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
