<template>
  <div>
    <el-dialog :visible="true" title="修改任务" @close="cancel" center>
      <div style="margin-bottom: 16px;">{{amountDisplay}}</div>
      <el-date-picker type="datetime" align="left" v-model="editedToExecuteAt"/>
      <div style="margin-top: 16px;">注意事项</div>
      <ol style="margin: 16px;">
        <li>重新设置一个任务执行时间</li>
        <li>新的执行时间不能早已当前时间</li>
        <li>新的执行时间不能晚于下一个任务的执行时间</li>
      </ol>
      <el-button type="success" @click="save">保存</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'time-edit',
  data() {
    return {
      editedToExecuteAt: undefined
    }
  },
  mounted() {
    this.editedToExecuteAt = new Date(this.toExecuteAt)
  },
  props: {
    amount: {
      type: String,
      default: () => ''
    },
    toExecuteAt: {
      type: Number,
      default: () => ''
    },
    taskId: {
      type: String,
      default: () => ''
    }
  },
  computed: {
    amountDisplay() {
      return `交易金额：${this.amount}元`
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    save() {
      if (this.editedToExecuteAt === null || this.editedToExecuteAt === undefined) {
        this.$message('调整计划时间不能为空')
        return
      }
      if (this.editedToExecuteAt.getTime() < Date.now()) {
        this.$message('新的执行时间不能早已当前时间')
        return
      }
      this.$emit('save', {
        editedToExecuteAt: this.editedToExecuteAt,
        taskId: this.taskId
      })
    }
  }
}
</script>

<style lang="css" scoped>
</style>
