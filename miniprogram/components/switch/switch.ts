let commmonSwitch = getApp<IAppOption>();
Component({
  properties: {
    conf: {
      type: Object,
      value: {
        height: 0,
        width: 0,
        spotHeight:0,
        spotColor:"#D8D8D8",
        color: '',
        checked: true,
        disabled: false,
        radius: true,
      },
      observer: function(newVal, oldVal) {
        if (typeof(newVal.spotHeight) == 'number' && newVal.spotHeight > 0) {
          oldVal.spotHeight = newVal.spotHeight
        } 
        if (typeof(newVal.height) == 'number' && newVal.height > 0) {
          oldVal.height = newVal.height
          if (typeof(newVal.width) == 'number' && newVal.width > newVal.height) {
            oldVal.width = newVal.width
          } else {
            oldVal.width = oldVal.height + 20
          }
        }
        if (typeof(newVal.color) == 'string' && newVal.color.length > 0) {
          oldVal.color = commmonSwitch.globalData.themeColor
        }
        if (typeof(newVal.spotColor) == 'string' && newVal.spotColor.length > 0) {
          oldVal.spotColor = newVal.spotColor
        }
        if (newVal.checked) {
          oldVal.checked = true
        } else {
          oldVal.checked = false
        }
        if (newVal.disabled) {
          oldVal.disabled = true
        } else {
          oldVal.disabled = false
        }
        if (newVal.noRadius) {
          oldVal.noRadius = true
        } else {
          oldVal.noRadius = false
        }
        this.setData(oldVal)
      }
    },
  },
  data: {
    height: 0,
    width: 0,
    spotHeight:0,
    spotColor:'#D8D8D8',
    color: '',
    checked: true,
    disabled: false,
    noRadius: false,
  },
  methods: {
    doSwitch: function() {
      if (!this.data.disabled) {
        var value:any = {}
        value.checked = !this.data.checked
        this.triggerEvent('doSwitch', value)
        this.setData({
          checked: !this.data.checked
        })
      }
    }
  },
})