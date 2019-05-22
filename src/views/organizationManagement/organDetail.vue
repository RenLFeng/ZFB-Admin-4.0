<template>
  <div>
    <div class="base-btn">
      <el-button @click="modalClose" icon="el-icon-arrow-left">返 回</el-button>
      <el-button type="primary" v-if="canEditOrganization" @click="editClick('orgForm')">保存</el-button>
    </div>
    <el-form
      :inline="true"
      :rules="rules"
      :model="editOrganData"
      ref="orgForm"
      label-width="90px"
      size="mini"
      style="background-color:#fff;"
    >
      <el-row style="padding: 10px">
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <el-tag style="margin-bottom:10px">基本信息</el-tag>
            <br>
            <el-form-item label="机构名称" prop="organName">
              <el-input
                :disabled="!canEditOrganization"
                v-model="editOrganData.organName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="机构账号" prop="organAccount">
              <el-input
                :disabled="!canEditOrganization"
                v-model="editOrganData.organAccount"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="机构编码" prop="userAccount">
              <el-input disabled v-model="editOrganData.userAccount" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="机构类型" prop="organType">
              <el-select :disabled="!canEditOrganization" v-model="editOrganData.organType">
                <el-option
                  v-for="(v,i) in getOrganTypeFeeData"
                  :label="v.name"
                  :key="i"
                  :value="v.type"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属上级">
              <el-input disabled v-model="editOrganData.organParentName"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <el-tag style="margin-bottom:10px">管理者信息</el-tag>
            <br>
            <el-form-item width="100%" label-width="100px" label="身份证号码" prop="idCard">
              <el-input
                :disabled="!canEditOrganization"
                v-model="editOrganData.idCard"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item width="100%" label-width="100px" label="联系方式" prop="phone">
              <el-input v-model="editOrganData.phone" autocomplete="off" :disabled="judge"></el-input>
            </el-form-item>
            <el-form-item width="100%" label-width="100px" label="详细地址" prop="area">
              <el-input v-model="editOrganData.area" autocomplete="off" :disabled="judge"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <el-tag style="margin-bottom:10px">结算信息</el-tag>
            <div class="radio">
              <el-radio v-model="editOrganData.accountType" :label="1" :disabled="judge">对公</el-radio>
              <el-radio v-model="editOrganData.accountType" :label="2" :disabled="judge">对私</el-radio>
            </div>
            <br>
            <el-form-item
              width="100%"
              :label="editOrganData.accountType===1?'收款单位':'收款人'"
              label-width="100px"
              prop="userName"
            >
              <el-input
                :disabled="!canEditOrganization"
                v-model="editOrganData.userName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="开户银行" label-width="100px" prop="bankCode" width="100">
              <el-select
                v-model="editOrganData.bankCode"
                :disabled="judge"
                placeholder="请选择"
                @change="findbank"
                style="width: 180px"
              >
                <el-option
                  v-for="(item ,index) in ourbank"
                  :key="index"
                  :label="item.btName"
                  :value="item.btCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item width="100%" label="支行" label-width="100px" prop="subBank">
              <el-input v-model="editOrganData.subBank" :disabled="judge" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item width="100%" label="储蓄卡号" label-width="100px" prop="cardNo">
              <el-input v-model="editOrganData.cardNo" :disabled="judge" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item width="100%" label-width="100px" label="预留手机号" prop="cardPhone">
              <el-input v-model="editOrganData.cardPhone" :disabled="judge" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item :label="editOrganData.accountType===1?'开户地区':'所在地区'" prop="areaOption">
              <el-cascader
                expand-trigger="hover"
                :disabled="judge"
                :options="areaData"
                :props="props"
                v-model="areaOption"
              ></el-cascader>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple" style="font-size: 14px;color:#606266">
            <el-tag style="margin-bottom:10px">库存信息</el-tag>
            <br>
            <el-row style="margin:0 0 20px 20px" :gutter="20">
              <el-col :span="12">
                <div class="grid-content bg-purple">设备库存</div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple">{{ editOrganData.posInventory }}台</div>
              </el-col>
            </el-row>
            <el-row style="margin:0 0 20px 20px" :gutter="20">
              <el-col :span="12">
                <div class="grid-content bg-purple">设备下发</div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple">{{ editOrganData.posOutNumber }}台</div>
              </el-col>
            </el-row>
            <el-row style="margin:0 0 20px 20px" :gutter="20">
              <el-col :span="12">
                <el-dropdown style="margin-top: -22px">
                  <el-button type="text">
                    <i>设备激活</i>
                    <span style="margin-left:80px">{{ editOrganData.posActivateNumber }}台</span>
                    <b class="el-icon-arrow-down el-icon--right"></b>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item, i) in editOrganData.activateList" :key="i">
                      {{ item.brandName }}
                      <span>激活{{ item.number }}台</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
            <el-row style="margin:0 0 20px 20px" :gutter="20">
              <el-col :span="12">
                <div class="grid-content bg-purple">激活码库存</div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple">{{ editOrganData.codeInventory }}个</div>
              </el-col>
            </el-row>
            <el-row style="margin:0 0 20px 20px" :gutter="20">
              <el-col :span="12">
                <div class="grid-content bg-purple">激活码下发</div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple">{{ editOrganData.codeOutNumber }}个</div>
              </el-col>
            </el-row>
            <el-row style="margin:0 0 20px 20px" :gutter="20">
              <el-col :span="12">
                <div class="grid-content bg-purple">激活码激活</div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple">{{ editOrganData.codeActivateNumber }}个</div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple" style="font-size: 14px;color:#606266">
            <el-tag style="margin-bottom:10px">分润费率</el-tag>
            <br>
            <el-row style="margin:0 0 20px 20px" :gutter="20">
              <el-col :span="10">
                <div class="grid-content bg-purple">设备还款费率</div>
              </el-col>
              <el-col :span="1">万</el-col>
              <el-col :span="11">
                <el-select v-model="editOrganData.posPayFee" size="mini" :disabled="judge">
                  <el-option v-for="(v,i) in listObj.posPayFeeList" :key="i" :label="v" :value="v"></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row style="margin:0 0 20px 20px" :gutter="20">
              <el-col :span="10">
                <div class="grid-content bg-purple">设备收款费率</div>
              </el-col>
              <el-col :span="1">万</el-col>
              <el-col :span="11">
                <el-select v-model="editOrganData.posRepayFee" size="mini" :disabled="judge">
                  <el-option
                    v-for="(v,i) in listObj.posRepayFeeList"
                    :key="i"
                    :label="v"
                    :value="v"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row
              style="margin: 20px 20px"
              :gutter="20"
              v-if="editOrganData.quickStatus === 0&&editOrganData.upQuickStatus === 1 && level === levelMap.PLATFORM"
            >
              开通快捷交易
              <el-switch v-model="dredgeQuick" :active-value="1" :inactive-value="0" @change="hint"></el-switch>
            </el-row>
            <el-row style="margin:0 0 20px 20px" :gutter="20" v-if="dredgeQuick === 1">
              <el-col :span="10">
                <div class="grid-content bg-purple">快捷还款费率</div>
              </el-col>
              <el-col :span="1">万</el-col>
              <el-col :span="11">
                <el-select v-model="editOrganData.quickPayFee" size="mini" :disabled="judge">
                  <el-option
                    v-for="(v,i) in listObj.quickPayFeeList"
                    :key="i"
                    :label="v"
                    :value="v"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row style="margin:0 0 20px 20px" :gutter="20" v-if="dredgeQuick === 1">
              <el-col :span="10">
                <div class="grid-content bg-purple">快捷收款费率</div>
              </el-col>
              <el-col :span="1">万</el-col>
              <el-col :span="11">
                <el-select v-model="editOrganData.quickRepayFee" size="mini" :disabled="judge">
                  <el-option
                    v-for="(v,i) in listObj.quickRepayFeeList"
                    :key="i"
                    :label="v"
                    :value="v"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="5" v-if="editOrganData.isOpen === 1">
          <el-tag style="margin-bottom:10px">开通合伙人奖励分配规则</el-tag>
          <br>
          <el-form-item label="分公司机构" prop="provinceAmt" v-if="editOrganData.organType === 2">
            <el-input v-model="editOrganData.provinceAmt" :disabled="canEdit"></el-input>
          </el-form-item>
          <el-form-item label="子公司" prop="organAmt" v-if="editOrganData.organType <= 3">
            <el-input v-model="editOrganData.organAmt" :disabled="canEdit"></el-input>
          </el-form-item>
          <el-form-item label="高级合伙人" prop="countyAmt" v-if="editOrganData.organType <= 9">
            <el-input v-model="editOrganData.countyAmt" :disabled="canEdit"></el-input>
          </el-form-item>
          <el-form-item label="直属合伙人">{{editOrganData.directAmt}}元</el-form-item>
          <el-form-item label="间接合伙人">{{editOrganData.indirectAmt}}元</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="account">
      <div class="balance">
        <h4
          style="display: inline-block;margin-right:60px"
        >账户余额：￥{{ accountinfo.balance | normAmount }}</h4>
      </div>
      <account-info v-if="editOrganData" :organId="organId"></account-info>
    </div>
  </div>
</template>
<script>
import { queryPermission } from '@/util'
import areaData from '../../assets/lib/jialian.json'
import { post } from '../../store/requestFacade.js'
import accountInfo from '../../components/accountInfo'
import { levelMap } from '../../server/level.js'
import { handleOrganArr, handleOrganObj, judgeWithLevel } from './own.js'
export default {
  name: 'account-flow',
  components: {
    accountInfo
  },
  props: {
    //   所属上级选择数据列表
    orgSelectData: {
      type: Array,
      default: () => []
    },
    organId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      judge: false,
      obj: '',
      accountShow: false,
      editOrganData: {},
      level: '',
      levelMap: levelMap,
      transactionType: '',
      accountType: '',
      dredgeQuick: 0,
      bankName: '',
      areaData: [],
      monthProfitData: {},
      areaOption: [],
      profitAllData: {},
      props: {
        value: 'value',
        label: 'text',
        children: 'children'
      },
      ourbank: [],
      getOrganTypeFeeData: [],
      accountinfo: '',
      isEdit: '',
      rules: {
        organName: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
        organAccount: [{ required: true, message: '请输入机构账号', trigger: 'blur' }],
        organCode: [{ required: true, message: '请输入机构编码', trigger: 'blur' }],
        organType: [{ required: true, message: '请选择机构类型', trigger: 'change' }],
        userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        idCard: [{ required: true, message: '请输入身份证号码', trigger: 'blur' }],
        bankCode: [{ required: true, message: '请输入开户银行', trigger: 'change' }],
        subBank: [{ required: true, message: '请输入支行', trigger: 'blur' }],
        cardNo: [{ required: true, message: '请输入储蓄卡号', trigger: 'blur' }],
        cardPhone: [{ required: true, message: '请输入预留手机号', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
        area: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        provinceAmt: [{ required: true, message: '请输入分公司机构开通合伙人奖励', trigger: 'blur' }],
        organAmt: [{ required: true, message: '请输入子公司开通合伙人奖励', trigger: 'blur' }],
        countyAmt: [{ required: true, message: '请输入高级合伙人开通合伙人奖励', trigger: 'blur' }]
      }
    }
  },
  computed: {
    listObj() {
      return this.obj[this.editOrganData.organType] || {}
    },
    canEditOrganization() {
      return queryPermission('editOrganization') // 编辑机构
    },
    canEdit() {
      if (this.isEdit === 1) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    editClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editOrg()
        } else {
          return false
        }
      })
    },
    hint() {
      if (this.dredgeQuick === 1) {
        this.editOrganData.quickPayFee = this.listObj.quickPayFeeList[0]
        this.editOrganData.quickRepayFee = this.listObj.quickRepayFeeList[0]
        this.$confirm('开通快捷交易后无法关闭，您确定开通快捷交易吗?', '是否继续').catch(() => {
          this.dredgeQuick = 0
        })
      }
    },
    // 获取机构详情
    async organDetail() {
      try {
        const res = await post({
          url: 'organ/detail',
          data: {
            organId: this.organId
          }
        })
        this.editOrganData = res.data
        this.isEdit = res.data.isEdit
        this.areaOption = [res.data.provinceCode, res.data.cityCode]
        this.dredgeQuick = res.data.quickStatus
        this.findbank(res.data.bankCode)
        this.accountInfo()
      } catch (err) {
        console.log(err)
      }
    },
    // 获取银行列表
    async getbank() {
      try {
        const res = await post({
          url: 'channel/queryBankTrunk'
        })
        this.ourbank = res.data
      } catch (error) {
        console.log(error)
      }
    },
    findbank(btCode) {
      const bankinfo = this.ourbank.find(item => {
        return item.btCode === btCode
      })
      this.bankName = bankinfo.btName
    },
    async editOrg() {
      try {
        const res = await post({
          url: 'organ/editOrganInfo',
          data: {
            accountType: this.editOrganData.accountType,
            organId: this.editOrganData.organId,
            organName: this.editOrganData.organName,
            phone: this.editOrganData.phone, // 联系方式
            bank: this.bankName,
            subBank: this.editOrganData.subBank,
            cardNo: this.editOrganData.cardNo,
            cardPhone: this.editOrganData.cardPhone, // 银行预留手机号
            provinceCode: this.areaOption[0],
            cityCode: this.areaOption[1],
            area: this.editOrganData.area,
            userName: this.editOrganData.userName,
            idCard: this.editOrganData.idCard,
            organAccount: this.editOrganData.organAccount,
            organType: this.editOrganData.organType,
            bankCode: this.editOrganData.bankCode,
            posPayFee: this.editOrganData.posPayFee,
            posRepayFee: this.editOrganData.posRepayFee,
            quickPayFee: this.editOrganData.quickPayFee,
            quickRepayFee: this.editOrganData.quickRepayFee,
            quickStatus: this.dredgeQuick ? this.dredgeQuick : 0,
            rewardId: this.editOrganData.rewardId ? this.editOrganData.rewardId : '',
            provinceAmt: this.editOrganData.provinceAmt,
            organAmt: this.editOrganData.organAmt,
            countyAmt: this.editOrganData.countyAmt,
            directAmt: this.editOrganData.directAmt,
            indirectAmt: this.editOrganData.indirectAmt
          }
        })
        this.$emit('modalClose')
        this.$message({
          message: res.msg,
          type: 'success'
        })
      } catch (err) {
        console.log(err)
      }
    },
    modalClose() {
      this.$emit('modalClose')
    },
    async accountInfo() {
      try {
        const res = await post({
          url: 'organAccount/AccountInfo',
          data: {
            organId: this.editOrganData.organId
          }
        })
        this.accountinfo = res.data
        this.pickerOptions = {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6 || time.getTime() < res.data.addDate
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getOrganTypeFee() {
      try {
        const res = await post({
          url: 'organ/getEditOrganTypeFee'
        })
        this.getOrganTypeFeeData = res.data
        this.obj = handleOrganObj(handleOrganArr(res.data))
      } catch (error) {
        console.log(error)
      }
    }
  },

  mounted() {
    this.getbank()
    this.getOrganTypeFee()
    this.level = localStorage.getItem('level')
    this.areaData = areaData
    this.organDetail()
    this.judge = judgeWithLevel(localStorage.getItem('level'))
  }
}
</script>
<style>
.balance {
  margin-top: 10px;
  background-color: #fff;
  height: 50px;
  line-height: 50px;
  padding: 0 30px;
  font-size: 20px;
}
.base-btn {
  margin: 15px 0;
  display: flex;
  justify-content: space-between;
}
i {
  display: inline-block;
  font-style: normal;
}
.radio {
  display: flex;
  justify-content: center;
}
</style>
