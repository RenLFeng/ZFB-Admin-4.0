<template>
  <div>
    <div class="base-tit">
      <el-button plain icon="el-icon-arrow-left" @click="modalClose">返回</el-button>
      <el-button type="primary" @click="addOrgBtn('orgForm')">保 存</el-button>
    </div>
    <p>
      <el-tag>基本信息</el-tag>
    </p>
    <el-form
      :inline="true"
      :model="addOrganData"
      :rules="rules"
      ref="orgForm"
      class="demo-ruleForm"
      label-width="120px"
      size="small"
    >
      <el-form-item label="机构类型" prop="organType">
        <el-select v-model="addOrganData.organType" @change="clearorganType">
          <el-option v-for="(v,i) in getOrganTypeFeeData" :label="v.name" :key="i" :value="v.type"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属上级">
        <el-select v-model="addOrganData.organId" @change="getOrganRule">
          <el-option
            v-for="(item,index) in selectDevor"
            :key="index"
            :label="item.organName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机构名称" prop="organName">
        <el-input v-model="addOrganData.organName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="机构账号" prop="organAccount">
        <el-input v-model="addOrganData.organAccount" autocomplete="off"></el-input>
      </el-form-item>
      <el-row style="margin-top:20px">
        <el-col :span="12">
          <el-tag>结算信息</el-tag>
          <br>
          <el-form-item style="margin-left:120px">
            <el-radio v-model="toOrganType" :label="1">对公</el-radio>
            <el-radio v-model="toOrganType" :label="2">对私</el-radio>
          </el-form-item>
          <br>
          <el-form-item
            width="100%"
            :label="toOrganType===1?'收款单位':'收款人'"
            prop="userName"
            class="demo-ruleForm"
          >
            <el-input v-model="addOrganData.userName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item width="100%" label="开户银行" class="demo-ruleForm" prop="bankName">
            <el-select v-model="addOrganData.bankCode" placeholder="请选择" @change="findbank">
              <el-option
                v-for="(item ,index) in ourbank"
                :key="index"
                :label="item.btName"
                :value="item.btCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item width="100%" label="支行" prop="subName" class="demo-ruleForm">
            <el-input v-model="addOrganData.subName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item width="100%" label="银行账号" prop="cardNo" class="demo-ruleForm">
            <el-input v-model="addOrganData.cardNo" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item width="100%" label="预留手机号" prop="cardPhone" class="demo-ruleForm">
            <el-input v-model="addOrganData.cardPhone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item :label="toOrganType===1?'开户地区':'所在地区'" prop="areaOption">
            <el-cascader
              expand-trigger="hover"
              @change="handleChange"
              :options="areaData"
              :props="props"
              v-model="addOrganData.areaOption"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-tag>管理者信息</el-tag>
          <br>
          <el-form-item></el-form-item>
          <br>
          <el-form-item width="100%" label="身份证号码" prop="idCard" class="demo-ruleForm">
            <el-input v-model="addOrganData.idCard" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item width="100%" label="联系方式" prop="phone" class="demo-ruleForm">
            <el-input v-model="addOrganData.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item width="100%" label="详细地址" prop="detailAddr" class="demo-ruleForm">
            <el-input v-model="addOrganData.detailAddr" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px">
        <el-col :span="12">
          <p>
            <el-tag>分润费率</el-tag>
          </p>
          <el-form-item width="100%" label="设备还款费率" prop="posPayFee" class="demo-ruleForm">
            <el-select v-model="addOrganData.posPayFee" :disabled="judge">
              <el-option v-for="(v,i) in listObj.posPayFeeList" :key="i" :label="v" :value="v"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item width="100%" label="设备收款费率" prop="posRepayFee" class="demo-ruleForm">
            <el-select v-model="addOrganData.posRepayFee" :disabled="judge">
              <el-option v-for="(v,i) in listObj.posRepayFeeList" :key="i" :label="v" :value="v"></el-option>
            </el-select>
          </el-form-item>
          <br>
          <!-- <el-form-item label="开通快捷交易" v-if="level === levelMap.PLATFORM&&isQuickStatus">
            <el-switch v-model="dredgeQuick" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>-->
          <br>
          <el-form-item
            width="100%"
            label="快捷还款费率"
            prop="quickPayFee"
            class="demo-ruleForm"
            v-if="dredgeQuick===1"
          >
            <el-select v-model="addOrganData.quickPayFee" :disabled="judge">
              <el-option v-for="(v,i) in listObj.quickPayFeeList" :key="i" :label="v" :value="v"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            width="100%"
            label="快捷收款费率"
            prop="quickRepayFee"
            class="demo-ruleForm"
            v-if="dredgeQuick=== 1"
          >
            <el-select v-model="addOrganData.quickRepayFee" :disabled="judge">
              <el-option v-for="(v,i) in listObj.quickRepayFeeList" :key="i" :label="v" :value="v"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6" v-if="organRuleData.isOpen === 1">
          <p>
            <el-tag>开通合伙人奖励分配规则</el-tag>
            <el-form-item label="奖励总金额">{{organRuleData.totalReward}}元</el-form-item>
          </p>
          <el-form-item label="分公司" prop="provinceAmt" v-if="addOrganData.organType <= 2">
            <el-input v-model="addOrganData.provinceAmt" :disabled="canEdit"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="子公司" prop="organAmt" v-if="addOrganData.organType <= 3">
            <el-input v-model="addOrganData.organAmt" :disabled="canEdit"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="高级合伙人" prop="countyAmt" v-if="addOrganData.organType <= 9">
            <el-input v-model="addOrganData.countyAmt" :disabled="canEdit"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="直接合伙人">{{organRuleData.directAmt}}元</el-form-item>
          <el-form-item label="间接合伙人">{{organRuleData.indirectAmt}}元</el-form-item>
        </el-col> -->
      </el-row>
    </el-form>
  </div>
</template>
<script>
import areaData from '../../assets/lib/jialian.json'
import { post } from '../../store/requestFacade.js'
import { levelMap } from '../../server/level'
import { handleOrganArr, handleOrganObj, judgeWithLevel } from './own.js'
export default {
  name: 'add-organ',
  props: {
    orgSelectData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      judge: '',
      obj: '',
      level: '',
      isEdit: true,
      levelMap: levelMap,
      dredgeQuick: 0,
      toOrganType: 1,
      provinceType: '子公司',
      getOrganTypeFeeData: [],
      areaData: [],
      props: {
        value: 'value',
        label: 'text',
        children: 'children'
      },
      addOrganData: {
        organType: null,
        areaOption: [],
        provinceCode: '',
        cityCode: '',
        organAccount: '',
        bankName: '',
        subName: '',
        cardNo: '',
        cardPhone: '',
        userName: '',
        idCard: '',
        phone: '',
        detailAddr: '',
        organId: '',
        bankCode: '',
        posPayFee: '',
        posRepayFee: '',
        quickPayFee: '',
        quickRepayFee: '',
        provinceAmt: '',
        organAmt: '',
        countyAmt: ''
      },
      rules: {
        organName: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
        organAccount: [{ required: true, message: '请输入机构账号', trigger: 'blur' }],
        organType: [{ required: true, message: '请选择机构类型', trigger: 'change' }],
        areaOption: [{ required: true, message: '请选择地区', trigger: 'change' }],
        bankName: [{ required: true, message: '请输入开户银行', trigger: 'blur' }],
        subName: [{ required: true, message: '请输入支行', trigger: 'blur' }],
        cardNo: [{ required: true, message: '请输入储蓄卡号', trigger: 'blur' }],
        cardPhone: [{ required: true, message: '请输入预留手机号', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        idCard: [{ required: true, message: '请输入身份证号码', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
        detailAddr: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        provinceAmt: [{ required: true, message: '请输入分公司开通合伙人奖励', trigger: 'blur' }],
        organAmt: [{ required: true, message: '请输入子公司开通合伙人奖励', trigger: 'blur' }],
        countyAmt: [{ required: true, message: '请输入高级合伙人开通合伙人奖励', trigger: 'blur' }],
        posPayFee: [{ required: true, message: '请选择设备还款费率', trigger: 'change' }],
        posRepayFee: [{ required: true, message: '请选择设备收款费率', trigger: 'change' }],
        quickPayFee: [{ required: true, message: '请选择快捷还款费率', trigger: 'change' }],
        quickRepayFee: [{ required: true, message: '请选择快捷收款费率', trigger: 'change' }]
      },
      organizationData: [],
      ourbank: [],
      posPayFeeData: [],
      organRuleData: {}
    }
  },
  methods: {
    modalClose() {
      this.$emit('modalClose')
    },
    // 添加机构
    async addOrgBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addOrgan()
        } else {
          return false
        }
      })
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
    // getOrganTypeFee
    async getOrganRule() {
      try {
        const res = await post({
          url: 'organRule/getOrganRule',
          data: {
            organId: this.addOrganData.organId
          }
        })
        this.organRuleData = res.data
        this.addOrganData.organAmt = res.data.organAmt
        this.addOrganData.countyAmt = res.data.countyAmt
        this.isEdit = res.data.isEdit
        // if (this.addOrganData.organType === 3 && this.addOrganData.organId === 1) {
        //   this.addOrganData.provinceAmt = 0
        // } else {
        this.addOrganData.provinceAmt = res.data.provinceAmt
        // }
      } catch (err) {
        console.log(err)
      }
    },
    findbank(btCode) {
      let bankinfo = {}
      bankinfo = this.ourbank.find(item => {
        return item.btCode === btCode
      })
      this.addOrganData.bankName = bankinfo.btName
    },
    async addOrgan() {
      try {
        const res = await post({
          url: 'organ/addOrgan',
          data: {
            accountType: this.toOrganType,
            organName: this.addOrganData.organName,
            organParentId: this.addOrganData.organId,
            organAccount: this.addOrganData.organAccount,
            organType: this.addOrganData.organType,
            provinceCode: this.addOrganData.provinceCode,
            cityCode: this.addOrganData.cityCode,
            bankName: this.addOrganData.bankName,
            subName: this.addOrganData.subName,
            cardNo: this.addOrganData.cardNo,
            cardPhone: this.addOrganData.cardPhone,
            userName: this.addOrganData.userName,
            idCard: this.addOrganData.idCard,
            phone: this.addOrganData.phone,
            address: this.addOrganData.detailAddr,
            bankCode: this.addOrganData.bankCode,
            posPayFee: this.addOrganData.posPayFee,
            posRepayFee: this.addOrganData.posRepayFee,
            quickPayFee: this.addOrganData.quickPayFee,
            quickRepayFee: this.addOrganData.quickRepayFee,
            // quickStatus: this.dredgeQuick,
            rewardId: this.organRuleData.rewardId ? this.organRuleData.rewardId : '',
            totalReward: this.organRuleData.totalReward ? this.organRuleData.totalReward : '',
            provinceAmt: this.addOrganData.provinceAmt ? this.addOrganData.provinceAmt : 0,
            organAmt: this.addOrganData.organAmt ? this.addOrganData.organAmt : 0,
            countyAmt: this.addOrganData.countyAmt ? this.addOrganData.countyAmt : 0,
            directAmt: this.organRuleData.directAmt ? this.organRuleData.directAmt : 0,
            indirectAmt: this.organRuleData.indirectAmt ? this.organRuleData.indirectAmt : 0
          }
        })
        this.$emit('modalClose')
        this.$message({
          message: res.data,
          type: 'success'
        })
      } catch (err) {
        console.log(err)
      }
    },
    handleChange(value) {
      this.addOrganData.provinceCode = value[0]
      this.addOrganData.cityCode = value[1]
    },
    // 获取上级机构
    async getorganization() {
      try {
        const res = await post({
          url: 'organ/orgSelect'
        })
        this.organizationData = res.data
      } catch (err) {
        console.log(err)
      }
    },
    clearorganType() {
      this.addOrganData.organId = ''
      this.addOrganData.posPayFee = this.listObj.posPayFeeList[0]
      this.addOrganData.posRepayFee = this.listObj.posRepayFeeList[0]
      this.addOrganData.quickPayFee = this.listObj.quickPayFeeList[0]
      this.addOrganData.quickRepayFee = this.listObj.quickRepayFeeList[0]
      this.addOrganData.organAmt = ''
      this.addOrganData.countyAmt = ''
      this.addOrganData.provinceAmt = ''
    },
    async getOrganTypeFee() {
      try {
        const res = await post({
          url: 'organ/getOrganTypeFee'
        })
        this.getOrganTypeFeeData = res.data
        this.obj = handleOrganObj(handleOrganArr(res.data))
        console.log('this.obj: ', this.obj)
      } catch (error) {
        console.log(error)
      }
    }
  },
  computed: {
    listObj() {
      return this.obj[this.addOrganData.organType] || {}
    },
    selectDevor() {
      return this.organizationData.filter(item => {
        if (
          this.addOrganData.organType === Number(levelMap.ORGAN) ||
          this.addOrganData.organType === Number(levelMap.PROVINCIAL)
        ) {
          return item.organLevel < this.addOrganData.organType
        }
        if (this.addOrganData.organType === 9) {
          return item.organLevel === Number(levelMap.ORGAN)
        }
      })
    },
    isQuickStatus() {
      if (!this.addOrganData.organId) {
        return false
      } else {
        const Quick = this.organizationData.filter(item => {
          return this.addOrganData.organId === item.id
        })
        if (Quick[0].quickStatus === 1) {
          return true
        }
      }
    },
    canEdit() {
      if (this.isEdit === 1) {
        return false
      } else {
        return true
      }
    }
  },
  mounted() {
    this.level = localStorage.getItem('level')
    this.judge = judgeWithLevel(localStorage.getItem('level'))
    this.areaData = areaData
    this.getorganization()
    this.getOrganTypeFee()
    this.getbank()
  }
}
</script>
<style scoped>
.userinfo {
  display: flex;
  justify-content: space-between;
}
.base-tit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin: 0;
}
</style>

