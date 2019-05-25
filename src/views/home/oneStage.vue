<!--
Description
@authors Your Name (you@example.org)
@date    2018-10-22 15:32:58
@version 1.0.0
-->
<template>
  <div class="qrCodeCon">
    <div class="qrCodeBox">
      <p>{{username}}邀请你加入三众</p>
      <div class="qrDiv">
        <img :src="codeUrl" alt>
      </div>
      <p class="remmondCode">推荐码:{{referphone}}</p>
    </div>
  </div>
</template>

<script>
import { qrCode } from '../../core'
import { post } from '../../store/requestFacade.js'
export default {
  name: 'one-stage-home',
  data() {
    return {
      codeUrl: '',
      referphone: '',
      username: ''
    }
  },
  methods: {
    async getInviteInfo() {
      try {
        const res = await post({
          url: 'invite/invite'
        })
        this.referphone = res.data.inviteCode
        this.username = res.data.inviteName
        // console.log(res)
      } catch (err) {
        console.log(err)
      }
    }
  },
  async mounted() {
    // console.log(window.location.host)
    await this.getInviteInfo()
    let registerPage = process.env.VUE_APP_REGISTER_URL
    let text = `${registerPage}?userPhone=${this.referphone}&username=${this.username}`
    // console.log('invite:', text)
    this.codeUrl = await qrCode.build(text)
    // console.log(this.codeUrl)
  }
}
</script>

<style lang="css" scoped>
.qrCodeCon {
  position: relative;
  width: 1800px;
  height: 840px;
  background: url('../../assets/img/qrBg.jpg') center no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
}
.qrCodeBox {
  position: absolute;
  top: 260px;
  right: 516px;
  width: 216px;
  height: 295rem;
}
.qrCodeBox > p {
  width: 220px;
  height: 30px;
  line-height: 30px;
  border-radius: 15px;
  background-color: #5628af;
  font-size: 12px;
  color: white;
  text-align: center;
  padding: 6px 0;
  margin: 0 auto;
  padding: 0;
}
.qrDiv {
  width: 196px;
  height: 196px;
  background-color: white;
  margin: 42px auto 0;
  border-radius: 10px;
  padding: 14px 0;
  box-sizing: border-box;
}
.qrDiv > img {
  display: block;
  margin: 0 auto;
  width: 168px;
  height: 168px;
}
p.remmondCode {
  width: 216px;
  height: 35px;
  line-height: 35px;
  color: #5f30bc;
  font-size: 16px;
  background-color: #fff;
  border-radius: 16px;
  margin: 22px 0 0 0;
}
</style>
