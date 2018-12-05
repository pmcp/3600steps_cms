<template>
  <div class="container is-fluid">
    <div class="columns">
      <div class="column scrollable">
        <h1>Slideshow order</h1>
        <div>
          <ul>
            <li
              v-for="(i, index) in items"
              v-bind:key="'slideshow_' + index"
              v-on:click="openImages(i)"
            >{{i.time}}</li>
          </ul>
        </div>
      </div>
      <div class="column scrollable">
        <ul>
          <li
            v-for="(i, index) in images"
            v-bind:key="'slideshow_' + index"
          ><a :href="i.image.cdnUrl" target="_blank"><img :src="i.image.uuid | getResized"></a></li>
        </ul>

      
      </div>
    </div>
  </div>
</template>


<script>
import { db } from "@/firebase";

export default {
  name: "Slideshow",
  data: () => ({
    images: {}
  }),
  filters: {
    getResized: function(id) {
      return "https://ucarecdn.com/" + id + "/-/resize/100x/";
    }
  },
  firebase: function() {
    return {
      items: db.ref("admin/slideshow").limitToLast(10)
    };
  },
  components: {},
  methods: {
    openImages(item) {
      this.images = item.images;
    }
  }
};
</script>

<style scoped lang="scss">
.scrollable {
  height: 75vh;
  overflow: scroll;
}
</style>
