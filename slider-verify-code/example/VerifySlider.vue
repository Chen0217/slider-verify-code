<template lang="pug">
  div.VerifySlider
    div.bus
    div.content
      div.header
        div.left
          span 拖动下方滑块完成验证
        div.right
          img(src="./close.png" width="30" height="30" @click.prevent="$emit('close')")
      div.body
        div.SliderVerify(ref="sliderVerify")
</template>

<script>
import Slider from '../SliderVerify'
export default {
  name: 'VerifySlider',
  mounted () {
    Slider(this.$refs.sliderVerify, this.success)
  },
  methods: {
    success () {
      this.$emit('success')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
  .VerifySlider{
    .bus{
      width: 100%;
      height: 100%;
      position: fixed;
      z-index: 15;
      top: 0;
      left: 0;
      background-color:#000;
      opacity:0.4;
    }
    .content {
      width: 25rem;
      height: 25rem;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      border-radius: 4px;
      color: #202020;
      z-index: 20;
      .header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 15px;
        .left{
          span{
            font-weight: bolder;
          }
        }
        .right{
          img{
            cursor: pointer;
          }
        }
      }
      .body{
        .SliderVerify{
          margin: 0 auto;
          width: 24rem;
          height: 15rem;
        }
      }
    }
  }
</style>
<style>
  @import "../jsLibrary/SliderVerify.css";
</style>
