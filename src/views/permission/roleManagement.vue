<template>
  <div>
    <div class="base-tit">
      <Breadcrumb item="系统管理,权限管理,角色"></Breadcrumb>
      <el-button type="text" @click="addNewRole()">新建角色</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" stripe border>
      <el-table-column
        :prop="v.tableTitle"
        :label="v.tableLabel"
        :key="v.tableTitle"
        :width="v.width"
        v-for="v in table"
      ></el-table-column>
      <el-table-column prop="operation" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="editRole(scope.row)" size="small" plain>分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="分配权限" :visible.sync="dialogVisible" width="40%">
      <el-form :model="RoleForm" :rules="rules" ref="RoleForm">
        <el-form-item label="角色名称" prop="RoleName" :label-width="formLabelWidth">
          <el-input v-model="RoleForm.RoleName" autocomplete="off" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="RoleDescription" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入角色描述"
            v-model="RoleForm.RoleDescription"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-tree
        :data="vaildPermission"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        highlight-current
        ref="tree"
        @check="handleNodeClick"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit('RoleForm')">保 存</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { RoleBaseColume, ParseRoleList, accessRolePermission } from './own/calc'
import { map } from './own/permission'
import { createNewRole, editRolePermisson, getRoleList } from '../../server/Interface'
import { post } from '../../store/requestFacade'
// import { difference } from '../../util'
export default {
  name: 'role-management',
  data() {
    return {
      init: 0,
      vaildPermission: map,
      branch: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      table: RoleBaseColume,
      dialogVisible: false,
      tableData: [],
      formLabelWidth: '90px',
      RoleForm: {
        RoleName: '',
        RoleDescription: ''
      },
      rules: {
        RoleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        RoleDescription: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ]
      },
      permissionCodes: [],
      mode: 'edit',
      roleId: 0,
      NotOperationList: []
    }
  },
  mounted() {
    this.getRoleList()
    this.accessBranch()
    const branch = arr =>
      [].concat(...arr.map(v => v.children.length && [v.id, ...branch(v.children)])).filter(Boolean)
    this.NotOperationList = branch(this.vaildPermission)
    

  },
  methods: {
    accessBranch() {
      const branchList = []
      const fn = arr => {
        arr &&
          arr.forEach(v => {
            branchList.push(v)
            if (v.subMenuItems) {
              fn(v.subMenuItems)
            }
          })
      }
      fn(this.vaildPermission)
      this.branch = branchList.filter(v => v.subMenuItems.length === 0).map(v => v.id)
    },
    getRoleList() {
      post({
        url: getRoleList,
        data: {}
      }).then(res => {

        this.tableData = ParseRoleList(res.data.rows).sort((a, b) => {
          return a.id >= b.id ? 1 : -1
        })
      })
    },
    addNewRole() {
      this.dialogVisible = !this.dialogVisible
      this.mode = 'addnew'
      this.RoleForm.RoleName = ''
      this.RoleForm.RoleDescription = ''
      this.$nextTick(function() {
        this.$refs.tree.setCheckedKeys([])
      })
    },
    editRole(rowData) {
      this.dialogVisible = !this.dialogVisible
      this.mode = 'edit'
      this.RoleForm.RoleName = rowData.name
      this.RoleForm.RoleDescription = rowData.remark
      this.roleId = rowData.id
      this.$nextTick(function() {
        const idList = [...accessRolePermission(rowData.permissions)]
        const filterlist = idList.filter(v => !this.NotOperationList.includes(v))
        this.$refs.tree.setCheckedKeys(filterlist)
      })
    },
    submit(formName) {
      let url = this.mode === 'edit' ? editRolePermisson : createNewRole
      this.$refs[formName].validate(valid => {
        if (valid) {
          const permissionCodes = this.$refs.tree.getCheckedNodes(false, true).map(v => v.code)
          const body = {
            roleName: this.RoleForm.RoleName,
            remark: this.RoleForm.RoleDescription,
            permissionCodes: [...new Set(permissionCodes)]
          }
          const editBody = {
            ...body,
            roleId: this.roleId
          }
          const postBody = this.mode === 'edit' ? editBody : body
          post({
            url,
            data: {
              ...postBody
            }
          }).then(res => {
            if (res.data === '创建成功' || '修改成功') {
              this.dialogVisible = !this.dialogVisible
              this.$message.success('操作成功')
              this.getRoleList()
            }
          })
        } else {
          this.$message.error('请填写必选项!')
        }
      })
    },
    handleNodeClick(node, status) {
      // return
      // const currentNodeChecked = status.checkedKeys.includes(node.id)
      // const childrenNodeIdList = node.children ? node.children.map(v => v.id) : []
      // const nowList = currentNodeChecked
      //   ? [...status.checkedKeys, ...getFatherId(node)]
      //   : difference([...status.checkedKeys.filter(v => v !== node.id)], childrenNodeIdList)
      // const UniqueVaildList = [...new Set(nowList)]
      // this.$nextTick(function() {
      //   this.$refs.tree.setCheckedKeys(UniqueVaildList)
      // })
    }
  }
}
</script>
