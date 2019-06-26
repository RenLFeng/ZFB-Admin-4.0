<template>
  <el-container>
    <el-header style="line-height:60px;background-color:#fff">
      <el-button size="small" icon="el-icon-arrow-left" @click="goback">返回</el-button>
      <div style="float:right" v-show="withdrawDetail.auditStatus === 0">
        <el-button size="small" type="primary" @click="financeAudit">财务审核</el-button>
        <el-button size="small" type="primary" @click="auditSuccess">通过</el-button>
        <el-button size="small" type="primary" @click="auditFail">不通过</el-button>
      </div>
    </el-header>
    <el-main v-if="type === typeMap.USERS" style="background-color:#fff">
      <el-row>
        <el-col :span="6">
          <div>
            <el-tag>会员信息</el-tag>
            <el-form label-width="150px" label-position="left">
              <el-form-item label="会员姓名" style="margin:0">
                <p>{{withdrawDetail.username}}</p>
              </el-form-item>
              <el-form-item label="会员账号" style="margin:0">
                <p>{{withdrawDetail.organaccount}}</p>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="6">
          <el-tag>账户信息</el-tag>
          <el-form label-width="150px" label-position="left">
            <el-form-item label="开户银行" style="margin:0">
              <p>{{withdrawDetail.bankTrunkName}}</p>
            </el-form-item>
            <el-form-item label="储蓄卡号" style="margin:0">
              <p>{{withdrawDetail.bankCardNo}}</p>
            </el-form-item>
            <el-form-item label="预留手机号" style="margin:0">
              <p>{{withdrawDetail.phone}}</p>
            </el-form-item>
            <el-form-item label="审核状态" style="margin:0">
              <p
                :class="getAuditColor(withdrawDetail.auditStatus)"
              >{{getAuditStatus(withdrawDetail.auditStatus)}}</p>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <el-tag>提现信息</el-tag>
          <el-form label-width="150px" label-position="left">
            <el-form-item label="提现金额" style="margin:0">
              <p>{{withdrawDetail.withdrawAmt}} 元</p>
            </el-form-item>
            <el-form-item label="手续费" style="margin:0">
              <p>{{withdrawDetail.fee}} 元</p>
            </el-form-item>
            <el-form-item label="到账金额" style="margin:0">
              <p>{{withdrawDetail.arrivalAmt}} 元</p>
            </el-form-item>
            <el-form-item label="付款状态" style="margin:0">
              <p
                :class="getPayColor(withdrawDetail.payStatus)"
              >{{getPayStatus(withdrawDetail.payStatus)}}</p>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <div v-show="withdrawDetail.auditStatus === 2">
            <el-tag>审核意见</el-tag>
            <el-input
              type="textarea"
              placeholder="暂无信息"
              :value="withdrawDetail.auditRemark"
              class="channelinfo"
              :autosize="{ minRows: 4, maxRows: 6}"
              readonly
            ></el-input>
          </div>
          <div v-show="withdrawDetail.auditStatus === 1">
            <el-tag>订单信息</el-tag>
            <span v-show="withdrawDetail.payOrderNo" style="padding:0 20px;font-size:13px">订单</span>
            <span style="font-size:13px">{{withdrawDetail.payOrderNo}}</span>
            <el-input
              type="textarea"
              placeholder="暂无订单信息"
              :value="withdrawDetail.upMsg"
              class="channelinfo"
              :autosize="{ minRows: 4, maxRows: 6}"
              readonly
            ></el-input>
          </div>
        </el-col>
      </el-row>
    </el-main>
    <el-main v-if="type === typeMap.ORGAN" style="background-color:#fff">
      <el-row>
        <el-col :span="12">
          <el-tag>提现信息</el-tag>
          <el-form label-width="150px" label-position="left">
            <el-row>
              <el-col :span="12">
                <el-form-item label="提现金额" style="margin:0">
                  <p>{{withdrawDetail.withdrawAmt}} 元</p>
                </el-form-item>
                <el-form-item label="手续费" style="margin:0">
                  <p>{{withdrawDetail.fee}} 元</p>
                </el-form-item>
                <el-form-item label="到账金额" style="margin:0">
                  <p>{{withdrawDetail.arrivalAmt}} 元</p>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="代付状态" style="margin:0">
                  <p
                    :class="getPayColor(withdrawDetail.payStatus)"
                  >{{getPayStatus(withdrawDetail.payStatus)}}</p>
                </el-form-item>
                <el-form-item label="审核状态" style="margin:0">
                  <p
                    :class="getAuditColor(withdrawDetail.auditStatus)"
                  >{{getAuditStatus(withdrawDetail.auditStatus)}}</p>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="12">
          <div v-show="withdrawDetail.auditStatus === 2">
            <el-tag>审核意见</el-tag>
            <el-input
              type="textarea"
              placeholder="暂无通道信息"
              :value="withdrawDetail.auditRemark"
              class="channelinfo"
              :autosize="{ minRows: 4, maxRows: 6}"
              readonly
            ></el-input>
          </div>
          <div v-show="withdrawDetail.auditStatus === 1">
            <el-tag>订单信息</el-tag>
            <span style="padding:0 20px;font-size:13px" v-if="withdrawDetail.payOrderNo">订单</span>
            <span style="font-size:13px">{{withdrawDetail.payOrderNo}}</span>
            <el-input
              type="textarea"
              placeholder="暂无订单信息"
              :value="withdrawDetail.upMsg"
              class="channelinfo"
              :autosize="{ minRows: 4, maxRows: 6}"
              readonly
            ></el-input>
          </div>
        </el-col>
      </el-row>
    </el-main>
    <div class="balance">
      <h4 style="display: inline-block;margin-right:60px">账户余额：{{accountinfo.balance|normAmount}}元</h4>
    </div>
    <!-- 机构信息 -->
    <div class="treasuryInfo" v-if="type === typeMap.ORGAN">
      <el-form label-width="100px" label-position="left">
        <el-row>
          <el-col :span="4">
            <el-tag>基本信息</el-tag>
            <el-form-item label="机构名称">
              <span>{{accountinfo.organName}}</span>
            </el-form-item>
            <el-form-item label="机构编码">
              <span>{{accountinfo.useraccount}}</span>
            </el-form-item>
            <el-form-item label="机构类型">
              <span>{{accountinfo.organLevel|organType}}</span>
            </el-form-item>
            <el-form-item label="所属上级">
              <span>{{accountinfo.upOrganName}}</span>
            </el-form-item>
            <el-form-item label="所在地区">
              <span>{{accountinfo.merchantProv}}{{accountinfo.merchantCity}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-tag>结算信息</el-tag>
            <el-form-item label="开户银行">
              <span>{{accountinfo.btName}}</span>
            </el-form-item>
            <el-form-item label="支行">
              <span>{{accountinfo.subName}}</span>
            </el-form-item>
            <el-form-item label="储蓄卡号">
              <span>{{accountinfo.bankCardNo}}</span>
            </el-form-item>
            <el-form-item label="预留手机号">
              <span>{{accountinfo.cardPhone}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-tag>管理者信息</el-tag>
            <el-form-item label="姓名">
              <span>{{accountinfo.name}}</span>
            </el-form-item>
            <el-form-item label="身份证号码">
              <span>{{accountinfo.idCard}}</span>
            </el-form-item>
            <el-form-item label="联系方式">
              <span>{{accountinfo.phone}}</span>
            </el-form-item>
            <el-form-item label="详细地址">
              <span>{{accountinfo.detAddress}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-tag>库存信息</el-tag>
            <el-form-item label="设备库存">
              <span>{{accountinfo.devStock}}台</span>
            </el-form-item>
            <el-form-item label="设备下发">
              <span>{{accountinfo.lowerNumber}}台</span>
            </el-form-item>
            <el-form-item label="设备激活">
              <el-dropdown>
                <el-button type="text">
                  <span>{{accountinfo.devActivation}}台</span>
                  <b class="el-icon-arrow-down el-icon--right"></b>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item, i) in accountinfo.posStockActivitySum" :key="i">
                    {{item.brandSubName}}
                    <span>激活{{item.brandSubNameSum}}台</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
            <!-- <el-form-item label="激活码库存">
              <span>{{accountinfo.codeInventory}}台</span>
            </el-form-item>
            <el-form-item label="激活码下发">
              <span>{{accountinfo.codeOutNumber}}台</span>
            </el-form-item>
            <el-form-item label="激活码激活">
              <span>{{accountinfo.codeActivateNumber}}台</span>
            </el-form-item>-->
          </el-col>
          <el-col :span="3">
            <el-tag>分润费率</el-tag>
            <el-form-item label="设备还款费率">
              <span>万{{accountinfo.posPayFee}}</span>
            </el-form-item>
            <el-form-item label="设备收款费率">
              <span>万{{accountinfo.posRepayFee}}</span>
            </el-form-item>
            <!-- <el-form-item label="快捷还款费率">
              <span>万{{accountinfo.quickPayFee}}</span>
            </el-form-item>
            <el-form-item label="快捷收款费率">
              <span>万{{accountinfo.quickRepayFee}}</span>
            </el-form-item> -->
          </el-col>
          <el-col :span="3" v-if="accountinfo.isOpen === 1">
            <el-tag>开通合伙人奖励分配规则</el-tag>
            <el-form-item label="分公司" v-if="accountinfo.organLevel <= 2">
              <span>{{accountinfo.provinceAmt}}元</span>
            </el-form-item>
            <el-form-item label="子公司" v-if="accountinfo.organLevel <= 3">
              <span>{{accountinfo.organAmt}}元</span>
            </el-form-item>
            <el-form-item label="高级合伙人">
              <span>{{accountinfo.countyAmt}}元</span>
            </el-form-item>
            <el-form-item label="直属合伙人">
              <span>{{accountinfo.directAmt}}元</span>
            </el-form-item>
            <el-form-item label="间接合伙人">
              <span>{{accountinfo.indirectAmt}}元</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 账户收益 -->
    <account-info :type="type" v-if="accountShow" :organId="withdrawDetail.organId"></account-info>
    <!-- 弹窗 -->
    <el-dialog title="财务审核" :visible.sync="isFinance" width="30%" :before-close="financeClose">
      <el-form label-position="top">
        <el-form-item label="财务审核意见">
          <el-input type="textarea" v-model="financeRemark" :rows="5"></el-input>
        </el-form-item>
      </el-form>
      <i style="color:#E6A23C">提醒:</i>
      <p>财务审核,不走支付通道,由财务人工转账处理</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isFinance = false">取 消</el-button>
        <el-button type="primary" @click="toFinance">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提现审核" :visible.sync="isFail" width="30%" :before-close="handleClose">
      <el-form label-position="top">
        <el-form-item label="审核不通过意见">
          <el-input type="textarea" v-model="remark" :rows="5"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isFail = false">取 消</el-button>
        <el-button type="primary" @click="sureFail">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提现审核" :visible.sync="isSuccess" width="30%" :before-close="close">
      <span v-show="withdrawDetail.withdrawType ===1">
        是否确定为机构
        <span style="color:#409EFF;">{{withdrawDetail.organName}}</span> 代付金额:
        <span style="color:#F56C6C">{{withdrawDetail.withdrawAmt}}元</span>
      </span>
      <span v-show="withdrawDetail.withdrawType ===2">
        是否确定为会员
        <span style="color:#409EFF;">{{withdrawDetail.username}}</span> 代付金额:
        <span style="color:#F56C6C">{{withdrawDetail.withdrawAmt}}元</span>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isSuccess = false">取 消</el-button>
        <el-button type="primary" @click="sureSuccess">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import { post } from '../../../store/requestFacade.js'
import accountInfo from '../../../components/accountInfo'
const typeMap = {
  ORGAN: 1,
  USERS: 2
}

export default {
  components: {
    accountInfo
  },
  props: {
    withdrawArg: {
      type: Object,
      default: () => {}
    },
    type: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      typeMap: typeMap,
      isFinance: false,
      isFail: false,
      isSuccess: false,
      financeRemark: '',
      remark: '',
      withdrawDetail: {},
      accountShow: false,
      accountinfo: {}
    }
  },
  methods: {
    goback() {
      this.$emit('goback')
    },
    async getWithdrawalDetail() {
      try {
        const res = await post({
          url: 'withdraw/getrecord',
          data: {
            withdrawId: this.withdrawArg.withdrawId
          }
        })
        this.withdrawDetail = res.data
        this.accountShow = true
        this.getaccountInfo()
      } catch (err) {
        console.log(err)
      }
    },
    async getaccountInfo() {
      try {
        const res = await post({
          url: 'organAccount/AccountInfo',
          data: {
            organId: this.withdrawDetail.organId
          }
        })
        this.accountinfo = res.data
        console.log('this.accountinfo: ', this.accountinfo)
      } catch (error) {
        console.log(error)
      }
    },
    getOrganLevel(organLevel) {
      switch (organLevel) {
        case 1:
          return '总公司'
        case 2:
          return '分公司'
        case 3:
          return '子公司'
        case 4:
          return '机构直推合伙人'
        case 5:
          return '合伙人'
        case 6:
          return '机构直推普通用户'
        case 7:
          return '普通用户'
        default:
          break
      }
    },
    getAuditStatus(status) {
      const auditStatus = {
        0: '待审核',
        1: '已审核',
        2: '不通过'
      }
      return auditStatus[status]
    },
    getPayStatus(status) {
      const payStatus = {
        0: '待处理',
        2: '代付中',
        3: '代付成功',
        4: '代付失败'
      }
      return payStatus[status]
    },
    financeAudit() {
      this.isFinance = true
    },
    auditFail() {
      this.isFail = true
    },
    auditSuccess() {
      this.isSuccess = true
    },
    // 财务审核
    async toFinance() {
      if (this.financeRemark === '') {
        this.$message({
          type: 'warning',
          message: '内容不能为空'
        })
      } else {
        this.finance()
      }
    },
    async finance() {
      try {
        const res = await post({
          url: 'withdraw/financeAudit',
          data: {
            withdrawId: this.withdrawArg.withdrawId,
            auditStatus: 1,
            remark: this.financeRemark
          }
        })
        this.isFinance = false
        await this.$message({
          type: 'success',
          message: res.msg
        })
        this.getWithdrawalDetail()
      } catch (err) {
        console.log(err)
      }
    },
    async sureFail() {
      if (this.remark === '') {
        this.$message({
          type: 'warning',
          message: '内容不能为空'
        })
      } else {
        try {
          const res = await post({
            url: 'withdraw/audit',
            data: {
              withdrawId: this.withdrawArg.withdrawId,
              auditStatus: 2,
              remark: this.remark
            }
          })
          this.isFail = false
          await this.$message({
            type: 'success',
            message: res.msg
          })
          this.getWithdrawalDetail()
        } catch (err) {
          console.log(err)
        }
      }
    },
    async sureSuccess() {
      this.isSuccess = false
      try {
        const res = await post({
          url: 'withdraw/audit',
          data: {
            withdrawId: this.withdrawArg.withdrawId,
            auditStatus: 1,
            remark: ''
          }
        })
        await this.$message({
          type: 'success',
          message: res.msg
        })
        this.getWithdrawalDetail()
      } catch (err) {
        console.log(err)
      }
    },
    financeClose() {
      this.isFinance = false
    },
    handleClose() {
      this.isFail = false
    },
    close() {
      this.isSuccess = false
    },
    getPayColor(status) {
      if (status === 1 || status === 4) {
        return 'warning'
      }
      if (status === 3) {
        return 'success'
      }
    },
    getAuditColor(status) {
      if (status === 2) {
        return 'warning'
      }
      if (status === 1) {
        return 'success'
      }
    }
  },
  mounted() {
    console.log(this.type)
    this.getWithdrawalDetail()
  },
  filters: {
    organType(type) {
      const organTypeMap = {
        1: '平台',
        2: '分公司',
        3: '子公司',
        9:'高级合伙人'
      }
      return organTypeMap[type]
    }
  }
}
</script>
<style scoped>
.warning {
  color: #f56c6c;
}
.success {
  color: #67c23a;
}
.channelinfo {
  display: block;
  margin-top: 20px;
}
i {
  display: inline-block;
  width: 100px;
  font-style: normal;
}
.balance {
  margin-top: 10px;
  background-color: #fff;
  height: 50px;
  line-height: 50px;
  padding: 0 30px;
  font-size: 20px;
}
.treasuryInfo {
  margin-top: 10px;
  font-size: 14px;
  color: #777;
  padding: 15px;
  background-color: #fff;
}
p {
  margin-top: 5px;
}
.el-form-item {
  margin-bottom: 0;
}
</style>
