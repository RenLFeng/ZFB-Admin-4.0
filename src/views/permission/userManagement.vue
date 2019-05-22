<template>
  <div>
    <div class="base-tit">
      <Breadcrumb item="系统管理,权限管理,管理员"></Breadcrumb>
      <el-button type="text" @click="addNewAdmin">新建管理员</el-button>
    </div>
    <el-table :data="adminList" border style="width: 100%">
      <el-table-column
        :prop="v.tableTitle"
        :label="v.tableLabel"
        :key="v.tableTitle"
        :width="v.width"
        v-for="v in table"
      ></el-table-column>
      <el-table-column prop="operation" label="操作" width="320">
        <template slot-scope="scope">
          <el-button @click="showResetPassword(scope.row)" size="small" plain>重置密码</el-button>
          <el-button size="small" @click="showEditAccount(scope.row)" plain>编辑</el-button>
          <el-button type="danger" size="small" @click="showDeletedUser(scope.row)" plain>删除</el-button>
          <el-button
            type="danger"
            size="small"
            @click="showFreezeAccount(scope.row)"
            plain
            v-if="scope.row.enable === 1 "
          >禁用</el-button>
          <el-button
            type="success"
            size="small"
            @click="showAvailableAccount(scope.row)"
            v-else
            plain
          >启用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新建管理员 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <el-form :model="AdminForm" :rules="rules" ref="AdminForm">
        <el-form-item label="账号" prop="LoginAccout" :label-width="formLabelWidth">
          <el-input v-model="AdminForm.LoginAccout" autocomplete="off" :disabled="!canInput"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name" :label-width="formLabelWidth">
          <el-input v-model="AdminForm.name" autocomplete="off" @input="nameChanged"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="selectedValue" :label-width="formLabelWidth">
          <el-select v-model="AdminForm.selectedValue" placeholder="请选择" @change="selectChanged">
            <el-option
              v-for="item in  RoleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="commonSubmit('AdminForm')">保 存</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 重制密码 -->
    <el-dialog title="重置密码" :visible.sync="resetPasswordDialogVisible" width="40%">
      <p>
        是否将管理员「 {{ currentRows.userName }} 」的登陆账号重置为
        <b>a123456</b>？
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="resetUserPassword">确 定</el-button>
        <el-button @click="resetPasswordDialogVisible =false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 删除账号 -->
    <el-dialog title="删除账号" :visible.sync="deletedDialogVisible" width="40%">
      <p>删除账号后「 {{ currentRows.userName }} 」账号无法登陆管理后台，确实删除该账号吗？</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deletedUser">确 定</el-button>
        <el-button @click="deletedDialogVisible =false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 禁用账号 -->
    <el-dialog title="禁用账号" :visible.sync="freezeDialogVisible" width="40%">
      <p>禁用账号后「 {{ currentRows.userName }} 」账号无法登陆管理后台，确实禁用该账号吗？</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="FreezeAccount">确 定</el-button>
        <el-button @click="freezeDialogVisible =false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 启用账号 -->
    <el-dialog title="账号激活" :visible.sync="availableDialogVisible" width="40%">
      <p>激活账号后「 {{ currentRows.userName }} 」账号可以登陆管理后台，确实激活该账号吗？</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="availableAccount">确 定</el-button>
        <el-button @click="availableDialogVisible =false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { post } from '../../store/requestFacade'
import { AdminBaseColume, ParseRoleList, ParseAdminList } from './own/calc'
import {
  getRoleList,
  getAdminList,
  createNewAdminUser,
  resetPassword,
  editAdminUser,
  delAdminUser,
  FreezeUser,
  ThawUser
} from '../../server/Interface'
export default {
  name: 'userManagement',
  data() {
    return {
      table: AdminBaseColume,
      dialogVisible: false,
      resetPasswordDialogVisible: false,
      deletedDialogVisible: false,
      freezeDialogVisible: false,
      availableDialogVisible: false,
      formLabelWidth: '90px',
      canSelect: true,
      canInput: true,
      AdminForm: {
        name: '',
        LoginAccout: '',
        selectedValue: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入管理员名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在3到20个字符', trigger: 'blur' }
        ],
        LoginAccout: [
          { required: true, message: '请输入管理员账号', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在5到20个字符', trigger: 'blur' }
        ],
        selectedValue: [{ required: true, message: '请选择角色', trigger: 'blur' }]
      },
      roleList: [],
      adminList: [],
      currentRows: {},
      dialogTitle: '新建管理员',
      userModify: false
    }
  },
  computed: {
    RoleOptions() {
      return this.roleList.map(v => ({
        value: v.roleId,
        label: v.roleName
      }))
    }
  },
  mounted() {
    this.getUser()
    this.getRoles()
  },
  methods: {
    getUser() {
      post({
        url: getAdminList,
        data: {}
      }).then(res => {
        this.adminList = ParseAdminList(res.data.rows)
      })
    },
    getRoles() {
      post({
        url: getRoleList,
        data: {}
      }).then(res => {
        this.roleList = ParseRoleList(res.data.rows).map(v => ({
          roleName: v.name,
          roleId: v.id
        }))
      })
    },

    addNewAdmin() {
      this.dialogTitle = '新建管理员'
      this.dialogVisible = !this.dialogVisible
      this.$nextTick(function() {
        this.$refs['AdminForm'].resetFields()
      })
    },
    commonSubmit(formName) {
      this.$refs[formName].validate(vaild => {
        if (vaild) {
          if (this.dialogTitle === '新建管理员') {
            this.submitAddNewAdmin()
          } else {
            this.editAccount()
          }
        } else {
          return false
        }
      })
    },
    submitAddNewAdmin() {
      const body = {
        userName: this.AdminForm.name,
        userAccount: this.AdminForm.LoginAccout,
        roleid: this.AdminForm.selectedValue
      }
      post({
        url: createNewAdminUser,
        data: { ...body }
      }).then(res => {
        if (res.data === '添加成功') {
          this.dialogVisible = !this.dialogVisible
          this.getUser()
        }
      })
    },
    accessCurrentRows(rows) {
      this.currentRows = rows
    },
    showResetPassword(Row) {
      this.accessCurrentRows(Row)
      this.resetPasswordDialogVisible = !this.resetPasswordDialogVisible
    },
    resetUserPassword() {
      post({
        url: resetPassword,
        data: {
          userId: this.currentRows.userId
        }
      }).then(res => {
        if (res.data === '重置密码成功') {
          this.resetPasswordDialogVisible = !this.resetPasswordDialogVisible
          this.$message.success('操作成功')
        }
      })
    },
    showEditAccount(Row) {
      this.accessCurrentRows(Row)
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '编辑账号'
      this.AdminForm.name = Row.userName
      this.AdminForm.LoginAccout = Row.userAccount
      this.canInput = false
      this.AdminForm.selectedValue = this.RoleOptions.filter(v => v.label === Row.roleName)[0].value
    },
    // 编辑账号
    editAccount() {
      if (!this.userModify) {
        this.dialogVisible = !this.dialogVisible
        this.$message.info(`没有修改「 ${this.currentRows.userName}」管理员`)
        return
      }
      const body = {
        userName: this.AdminForm.name,
        userAccount: this.AdminForm.LoginAccout,
        roleId: this.AdminForm.selectedValue
      }

      post({
        url: editAdminUser,
        data: {
          ...body
        }
      }).then(res => {
        if (res.data === '编辑成功') {
          this.$message.success('操作成功')
          this.dialogVisible = !this.dialogVisible
          this.userModify = false
          this.getUser()
        }
      })
    },
    showDeletedUser(Row) {
      this.accessCurrentRows(Row)
      this.deletedDialogVisible = !this.deletedDialogVisible
    },
    deletedUser() {
      post({
        url: delAdminUser,
        data: {
          userId: this.currentRows.userId
        }
      }).then(res => {
        if (res.data === '删除成功') {
          this.$message.success('操作成功')
          this.deletedDialogVisible = !this.deletedDialogVisible
          this.getUser()
        }
      })
    },
    showFreezeAccount(Row) {
      this.accessCurrentRows(Row)
      this.freezeDialogVisible = !this.freezeDialogVisible
    },
    FreezeAccount() {
      post({
        url: FreezeUser,
        data: {
          userId: this.currentRows.userId
        }
      }).then(res => {
        if (res.data === '冻结成功') {
          this.$message.success('操作成功')
          this.freezeDialogVisible = !this.freezeDialogVisible
          this.getUser()
        }
      })
    },
    showAvailableAccount(Row) {
      this.accessCurrentRows(Row)
      this.availableDialogVisible = !this.availableDialogVisible
    },
    availableAccount() {
      post({
        url: ThawUser,
        data: {
          userId: this.currentRows.userId
        }
      }).then(res => {
        if (res.data === '解冻成功') {
          this.$message.success('操作成功')
          this.availableDialogVisible = !this.availableDialogVisible
          this.getUser()
        }
      })
    },
    nameChanged() {
      this.userModify = true
    },
    selectChanged() {
      this.userModify = true
    }
  },
  created() {}
}
</script>

<style scoped></style>
