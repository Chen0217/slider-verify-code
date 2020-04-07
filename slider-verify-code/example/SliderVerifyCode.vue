<template lang="pug">
  div.SliderVerifyCode
    button(@click.prevent="showVerify = true") 点击滑动验证
    p {{verifySlider ? '已验证' : '未验证'}}
    // 滑块验证弹窗
    verify-slider(v-if="showVerify" @close="showVerify = false" @success="verifySlider = true")
</template>

<script>
import VerifySlider from './VerifySlider'
export default {
  name: 'SliderVerifyCode',
  data () {
    return {
      verifySlider: false,
      showVerify: false
    }
  },
  components: {
    VerifySlider
  }
}
</script>

<style lang="scss" scoped>
  .SliderVerifyCode{
    margin-top: 400px;
    button{
      padding: 3px 10px;
      border: 1px solid #4798e9;
      background-color: #fff;
      outline: none;
      cursor: pointer;
      color: #4798e9;
    }
  }
</style>
