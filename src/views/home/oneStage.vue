<template>
  <div class="qrCodeCon">
    <div class="inner">
      <img src="../../assets/img/qrcode_inner_bg.png" alt>
      <div class="info">
        <div class="block">
          <img :src="codeUrl" alt class="codeImg">
          <p class="code">推荐码:{{referphone}}</p>
        </div>
        <p class="text">{{username}}邀请你加入</p>
      </div>
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
  mounted(){
    // this.getInviteInfo();
  },
  methods: {
    async getInviteInfo() {
      try {
        const res = await post({
          url: 'invite/invite'
        })
        this.referphone = res.data.inviteCode
        this.username = res.data.inviteName
      } catch (err) {
        console.log(err)
      }
    }
  },
  async mounted() {
    await this.getInviteInfo()
    let registerPage = process.env.VUE_APP_REGISTER_URL
    let text = `${registerPage}?userPhone=${this.referphone}&username=${this.username}`
    this.codeUrl = await qrCode.build(text)
  }
}
</script>

<style lang="css" scoped>
.qrCodeCon {
  /* position: relative; */
  background: url('../../assets/img/qrBg.jpg') center no-repeat;
  background-size: cover;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.inner {
  width: 800px;
  height: auto;
  position: relative;
}
.inner img {
  width: 800px;
  height: auto;
}
.info {
  position: absolute;
  width: 160px;
  overflow-x: hidden;
  right: 144px;
  bottom: 106px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.info img {
  width: 120px;
  height: 120px;
}

.info .block {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 10px;
  background-color: #fff;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #2d86c7;
}
p.text {
  width: 100%;
  padding: 4px;
  box-sizing: border-box;
  border-radius: 1000px;
  text-align: center;
  margin-top: 15px;
  color: #090020;
  background-color: #fff;
  font-size: 14px;
}
</style>
