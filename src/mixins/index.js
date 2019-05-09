export var scroll = {
  data() {
    return {
      scroll: this.$store.getters.get('scrollHome')
      // scroll: 0
    };
  },
  computed: {
    scrollState () {
      return this.$store.getters.get('scrollHome')
    }
  },
  methods: {
    // onScroll(e) {
    //   var contentHeight  = document.documentElement.offsetHeight, // all height
    //       heightToScroll = window.innerHeight, // two window height
    //       scrollTop      = document.documentElement.scrollTop + window.innerHeight; // current scroll

    //   console.log(contentHeight, scrollTop, contentHeight - scrollTop, this.scrollState, this.scroll)
    //   // if (
    //   //   scrollTop > this.scrollState &&
    //   //   scrollTop > contentHeight - heightToScroll && 
    //   //   !this.loading
    //   // ) {
    //   if (
    //     scrollTop > this.scroll &&
    //     contentHeight - scrollTop < 100 && 
    //     !this.loading
    //   ) {
    //     console.log('reload', this.scroll);

    //     // this.scroll = scrollTop + heightToScroll;
    //     this.scroll = scrollTop;

    //     // this.$store.commit('setScrollAndPageNum', { scroll: this.scroll, pageNum: this.pageNum });
    //     this.reload({ scroll: this.scroll });
    //   }
    // }
    onScroll(e) {
      var contentHeight  = document.documentElement.offsetHeight, // all height
          heightToScroll = window.innerHeight / 4, // 1/n window height
          scrollTop      = document.documentElement.scrollTop + window.innerHeight; // current scroll


      // console.log(contentHeight, scrollTop)
      this.scroll = document.documentElement.scrollTop;

      if ( 
        scrollTop >= contentHeight - heightToScroll &&
        scrollTop > this.scrollState &&
        this.loading == false
      ) {
        var scroll = Math.max(scrollTop + heightToScroll, contentHeight);
        // var scroll = scrollTop + heightToScroll > contentHeight ? contentHeight : scrollTop + heightToScroll;
        this.reload({ scroll });
      }

      // if (
      //   scrollTop > this.scroll &&
      //   scrollTop >= contentHeight - heightToScroll && 
      //   !this.loading
      // ) {
      //   // console.log('reload', this.scroll);

      //   this.scroll = scrollTop + heightToScroll;

      //   this.reload({ scroll: scrollTop });
      //   // console.log(contentHeight, scrollTop, heightToScroll, this.scrollState, this.scroll)
      // }
    }
  }
};

// source https://www.geodatasource.com/developers/javascript
export var distance = {
  methods: {
    distan(lat1, lon1, lat2, lon2) {
      if (lat1 == lat2 && lon1 == lon2) {
        return 0;
      } else {
        var radlat1 = (Math.PI * lat1) / 180;
        var radlat2 = (Math.PI * lat2) / 180;
        var theta = lon1 - lon2;
        var radtheta = (Math.PI * theta) / 180;
        var dist =
          Math.sin(radlat1) * Math.sin(radlat2) +
          Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
          dist = 1;
        }
        dist = Math.acos(dist);
        dist = (dist * 180) / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
        dist = dist.toFixed(2) + "km";
        return dist;
      }
    }
  }
};
