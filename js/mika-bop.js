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
    list.push({ name: name, earlyDown: false })
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
  <button class="idiot-button" :style="idiotStyle" @click="hit">
    <p>{{ idiot.name }}</p>
  </button>
  `,
  methods: {
    hit() {
      if (this.up) {
        this.$emit('hit', this.idiot)
        this.idiot.earlyDown = true
      }
    }
  },
  computed: {
    idiotStyle() {
      return {
        backgroundColor: this.up ? 'blue' : 'red'
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
      css: {
        position: 'fixed',
        top: '0',
        left: '0',
        display: 'none'
      }
    },
    idiots: generateIdiots(),
    timerInterval: null
  },
  methods: {
    startGame() {
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
        setTimeout(() => {
          if (!someIdiot.earlyDown) {
            someIdiot.up = false
          }
        }, 1000)
        setTimeout(this.idiotArrival, iRandomRange(500, 1000))
      }
    },
    endGame() {
      this.state = 'end'
      this.timer = 0
    },
    updateTimer() {
      if (this.timer == 0) {
        clearInterval(this.timerInterval)
        this.endGame()
      } else {
        this.timer--
      }
    },
    processHit(idiot) {
      this.score++
      this[idiot.name]++
      idiot.up = false
    }
  },
  computed: {
    timeDisplay() {
      var _string = String('000' + this.timer).slice(-3)
      return _string[0] + ':' + _string.slice(1)
    }
  }
})
