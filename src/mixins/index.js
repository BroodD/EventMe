import store from "@/store"

export var scroll = {
  data() {
    return {
      scroll: store.getters.get('scroll'),
      distance: [0, 100]
    };
  },
  computed: {
    scrollState () {
      return store.getters.get('scroll')
    },
    pageNum () {
      return store.getters.get('pageNum')
    },
  },
  methods: {
    onScroll(e) {
      var contentHeight  = document.documentElement.offsetHeight, // all height
          heightToScroll = window.innerHeight / 4, // 1/n window height
          scrollTop      = document.documentElement.scrollTop + window.innerHeight; // current scroll


      this.scroll = document.documentElement.scrollTop;

      if ( 
        // scrollTop >= contentHeight &&
        scrollTop >= contentHeight - heightToScroll &&
        scrollTop > this.scrollState &&
        this.loading == false
      ) {
        var scroll = Math.max(scrollTop + heightToScroll, contentHeight);
      
        if (this.cards.length)
          this.reload({ scroll });
      }
    }
  },
  mounted () {
    console.log('mounted', store.getters.get('scroll'), this.pageNum)
    this.$vuetify.goTo(this.scroll, { duration: 0 })
  },
  beforeDestroy () {
    this.scroll += document.querySelector('.v-toolbar__content').offsetHeight || 0;
    store.commit('set', { v: 'scroll', val: this.scroll });
  }
};
