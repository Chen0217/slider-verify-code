function createElement (tagName, className) {
  const elment = document.createElement(tagName)
  elment.className = className
  return elment
}

function addClass (tag, className) {
  tag.classList.add(className)
}

function removeClass (tag, className) {
  tag.classList.remove(className)
}

function sum (x, y) {
  return x + y
}

function square (x) {
  return x * x
}

let Slider = (dom, succ) => {
  // let self = this
  this.l = 42
  this.r = 10
  this.accuracy = 5
  this.canvasCtx = null
  this.blockCtx = null
  this.block = null
  this.block_x = undefined // container random position
  this.block_y = undefined
  this.L = this.l + this.r * 2 + 3 // block real lenght
  this.img = undefined
  this.originX = null
  this.originY = null
  this.isMouseDown = false
  this.trail = []
  this.width = dom.clientWidth
  this.height = dom.clientHeight
  let canvas = document.createElement('canvas')
  canvas.setAttribute('width', this.width)
  canvas.setAttribute('height', this.height)
  dom.appendChild(canvas)
  dom.style.position = 'relative'
  let block = canvas.cloneNode(true) // 滑块
  let sliderContainer = createElement('div', 'sliderContainer')
  sliderContainer.style.width = this.width + 'px'
  let sliderMask = createElement('div', 'sliderMask')
  let slider = createElement('div', 'slider')
  let sliderIcon = createElement('span', 'sliderIcon')
  let text = createElement('span', 'sliderText')
  let success = createElement('div', 'successTip')
  let successText = createElement('p', 'successText')
  let successIcon = createElement('div', 'successIcon')

  block.className = 'block'
  text.innerHTML = '向右滑动填充拼图'
  successText.innerHTML = '只用了1.2s，这速度简直完美'
  successText.style.width = this.width + 'px'

  dom.appendChild(canvas)
  dom.appendChild(block)
  dom.appendChild(success)
  success.appendChild(successIcon)
  success.appendChild(successText)
  dom.appendChild(sliderContainer)
  sliderContainer.appendChild(sliderMask)
  sliderContainer.appendChild(text)
  sliderMask.appendChild(slider)
  slider.appendChild(sliderIcon)

  success.style.width = this.width + 'px'
  success.style.height = this.height + 'px'
  success.style.zIndex = 10
  success.style.display = 'none'

  block.style.position = 'absolute'
  block.style.top = 0 + 'px'
  block.style.left = 0 + 'px'

  this.canvasCtx = canvas.getContext('2d')
  this.blockCtx = block.getContext('2d')

  let draw = (ctx, x, y, operation, f) => {
    const PI = Math.PI
    let {
      l,
      r
    } = this
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI)
    ctx.lineTo(x + l, y)
    ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI)
    ctx.lineTo(x + l, y + l)
    ctx.lineTo(x, y + l)
    ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true)
    ctx.lineTo(x, y)
    ctx.lineWidth = 2
    if (f) {
      ctx.fillStyle = 'rgba(255, 255, 255, 1)'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)'
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.shadowBlur = 5
    ctx.stroke()
    ctx[operation]()
    ctx.globalCompositeOperation = 'overlay'
  }

  const img = createImg(() => {
    this.block_x = getRandomNumberByRange(this.L + 10, this.width - (this.L + 10))
    this.block_y = getRandomNumberByRange(10 + this.r * 2, this.height - (this.L + 10))
    draw(this.canvasCtx, this.block_x, this.block_y, 'fill', 1)
    draw(this.blockCtx, this.block_x, this.block_y, 'clip', 0)
    this.canvasCtx.drawImage(img, 0, 0, this.width, this.height)
    this.blockCtx.drawImage(img, 0, 0, this.width, this.height)
    let {
      block_x: x,
      block_y: y,
      r,
      L
    } = this
    let _y = y - r * 2 - 1
    let ImageData = this.blockCtx.getImageData(x, _y, L, L)
    block.width = L
    this.blockCtx.putImageData(ImageData, 0, _y)
  })
  // this.img = img

  function createImg (onload) {
    const img = document.createElement('img')
    img.crossOrigin = 'Anonymous'
    img.onload = onload
    img.onerror = () => {
      img.src = getRandomImg()
    }
    img.src = getRandomImg()
    return img
  }

  function getRandomImg () {
    return require('./assets/image.jpg')
    // const len = this.imgs.length;
    // return 'https://picsum.photos/300/150/?image=' + getRandomNumberByRange(0, 1084)
  }

  function getRandomNumberByRange (start, end) {
    return Math.round(Math.random() * (end - start) + start)
  }

  let verify = () => {
    const arr = this.trail // drag y move distance
    const average = arr.reduce(sum) / arr.length // average
    const deviations = arr.map(x => x - average) // deviation array
    const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length) // standard deviation
    const left = parseInt(block.style.left)
    const accuracy = this.accuracy <= 1 ? 1 : this.accuracy > 10 ? 10 : this.accuracy
    return {
      spliced: Math.abs(left - this.block_x) <= accuracy,
      TuringTest: average !== stddev // equal => not person operate
    }
  }

  let time = 0
  let startTime = 0

  let mousemove = (e) => {
    if (!this.isMouseDown) return false
    const moveX = e.clientX - this.originX
    const moveY = e.clientY - this.originY
    if (moveX < 0 || moveX + 38 >= this.width) return false
    slider.style.left = moveX + 'px'
    let blockLeft = (this.width - 40 - 20) / (this.width - 40) * moveX
    block.style.left = blockLeft + 'px'

    addClass(sliderContainer, 'sliderContainer_active')
    sliderMask.style.width = moveX + 'px'
    this.trail.push(moveY)
  }

  let mouseup = (e) => {
    console.log('up')
    if (!this.isMouseDown) return false
    this.isMouseDown = false
    if (e.clientX === this.originX) return false
    removeClass(sliderContainer, 'sliderContainer_active')

    const {
      spliced,
      TuringTest
    } = verify()
    // console.log(spliced, TuringTest)
    if (spliced) {
      if (this.accuracy === -1) {
        addClass(sliderContainer, 'sliderContainer_success')
        console.log('success')
        time = ((Date.now() - startTime) / 1000).toFixed(1)
        success.style.display = 'block'
        if (time > 3) {
          successText.innerHTML = `用了${time}s，小乌龟要加油哦`
        } else {
          successText.innerHTML = `只用了${time}s，这速度简直惊人`
        }
        setTimeout(() => {
          succ()
          reset()
        }, 1000)
        return
      }
      if (TuringTest) {
        // succ
        addClass(sliderContainer, 'sliderContainer_success')
        console.log('success')
        time = ((Date.now() - startTime) / 1000).toFixed(1)
        success.style.display = 'block'
        if (time > 3) {
          successText.innerHTML = `用了${time}s，小乌龟要加油哦`
        } else {
          successText.innerHTML = `只用了${time}s，这速度简直惊人`
        }
        setTimeout(() => {
          succ()
          reset()
        }, 1000)
      } else {
        addClass(sliderContainer, 'sliderContainer_fail')
        console.log('again')
        // this.$emit('again')
      }
    } else {
      addClass(sliderContainer, 'sliderContainer_fail')
      console.log('fail')
      // this.$emit('fail')
      setTimeout(() => {
        reset()
      }, 1000)
    }
  }

  let reset = () => {
    document.removeEventListener('mousemove', mousemove)
    document.removeEventListener('mouseup', mouseup)
    sliderContainer.className = 'sliderContainer'
    slider.style.left = 0
    block.style.left = 0
    sliderMask.style.width = 0
    // canvas
    this.canvasCtx.clearRect(0, 0, this.width, this.height)
    this.blockCtx.clearRect(0, 0, this.width, this.height)
    block.width = this.width
    time = 0

    // generate img
    img.src = getRandomImg()
    console.log('reset')
    // this.$emit('fulfilled')
  }

  let sliderDown = (event) => {
    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseup)
    startTime = Date.now()
    this.originX = event.clientX
    this.originY = event.clientY
    this.isMouseDown = true
  }

  slider.addEventListener('mousedown', sliderDown)
}
export default Slider
