// helpers

function shuffle(a) {
  var j, x, i
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    x = a[i]
    a[i] = a[j]
    a[j] = x
  }
}

function iRandomRange(n1, n2) {
  return Math.floor(Math.random() * (n2 - n1 + 1)) + n1
}

function addIdiot(list, name, num) {
  for (var i = 0; i < num; i++) {
    list.push({ name: name })
  }
}

function generateIdiots() {
  let _idiots = []
  addIdiot(_idiots, 'ferid', 14)
  addIdiot(_idiots, 'guren', 14)
  addIdiot(_idiots, 'yuu', 7)
  let _id = 0
  for (_idiot of _idiots) {
    _idiot.id = _id++
  }
  shuffle(_idiots)
  return _idiots
}

// components

Vue.component('idiot-button', {
  props: {
    idiot: {
      type: Object,
      required: true
    },
    up: {
      type: Boolean,
      default: false
    }
  },
  template: `
  <button class="idiot-button" @click="hit">
    <img src="img/hole_back.png">
    <transition
      enter-active-class="magictime slideDownReturn"
      leave-active-class="magictime slideDown"
    >
      <img v-show="up" :src="imgSrc">
    </transition>
    <img src="img/hole_front.png">
  </button>
  `,
  data() {
    return {
      imgSrc: 'img/' + this.idiot.name + '.png'
    }
  },
  methods: {
    hit() {
      const top = this.$el.getBoundingClientRect().top
      const left = this.$el.getBoundingClientRect().left
      this.$emit('hammer', { top: top, left: left })
      if (this.up) {
        this.$emit('hit', this.idiot)
        this.idiot.up = false
        clearTimeout(this.idiot.timeout)
      }
    }
  }
})

// app

var game = new Vue({
  el: '#game',
  data: {
    state: 'intro', // states: intro, game, end
    timer: 0,
    score: 0,
    ferid: 0,
    guren: 0,
    yuu: 0,
    mika: {
      up: true,
      timer: null,
      css: {
        top: '0',
        left: '0',
        display: 'none'
      }
    },
    idiots: generateIdiots(),
    timerInterval: null,
    mobileHeight: { height: String(window.innerHeight * 0.9) + 'px' }
  },
  methods: {
    startGame() {
      this.mika.css.display = 'none'
      this.score = 0
      this.ferid = 0
      this.guren = 0
      this.yuu = 0
      this.timer = 1000
      this.state = 'game'
      this.timerInterval = setInterval(this.updateTimer, 10)
      setTimeout(this.idiotArrival, iRandomRange(500, 1000))
    },
    idiotArrival() {
      if (this.state == 'game' && this.timer > 20) {
        var someIdiot = this.idiots[iRandomRange(0, this.idiots.length - 1)]
        someIdiot.up = true
        someIdiot.timeout = setTimeout(() => {
          someIdiot.up = false
        }, 1300)
        setTimeout(this.idiotArrival, iRandomRange(500, 1000))
      }
    },
    endGame() {
      this.state = 'end'
      this.timer = 0
      for (let idiot of this.idiots) {
        idiot.up = false
      }
    },
    updateTimer() {
      if (this.timer == 0) {
        clearInterval(this.timerInterval)
        this.endGame()
      } else {
        this.timer--
      }
    },
    hammerUp(hammer) {
      this.mika.css.top = hammer.top + 'px'
      this.mika.css.left = hammer.left + 'px'
      this.mika.up = true
      this.mika.css.display = 'block'
      clearTimeout(this.mika.timer)
      setTimeout(this.hammerDown, 100)
    },
    hammerDown() {
      this.mika.up = false
      this.mika.timer = setTimeout(this.hideMika, 300)
    },
    hideMika() {
      this.mika.css.display = 'none'
    },
    processHit(idiot) {
      this.score++
      this[idiot.name]++
    },
    updateMobileHeight() {
      this.mobileHeight = { height: String(window.innerHeight * 0.9) + 'px' }
    }
  },
  computed: {
    timeDisplay() {
      var _string = String('000' + this.timer).slice(-3)
      return _string[0] + ':' + _string.slice(1)
    }
  },
  mounted() {
    window.onresize = this.updateMobileHeight
  }
})
