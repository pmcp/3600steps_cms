<template>
  <div>
    <b-collapse
      class="card"
      v-for="(item, index) in items"
      v-bind:key="'pictures_' + index"
      :open="false"
    >
      <div slot="trigger" slot-scope="props" class="card-header">
        <p class="card-header-title">
          {{ item['.key']}}
          <img v-if="item.image" :src="item.image.uuid | getResized" style="max-width:100px">
          <img v-else :src="item.url" style="max-width:100px">
          <!-- {{item.dateAdded  | moment}} -->
        </p>
        <a cass="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"></b-icon>
        </a>
      </div>
      <div class="card-content">
        <div class="content">
          <!-- <buttonv v-on:click="getPicture(item['.key'])">Show Meta</button> -->
          <a v-if="item.image" :href="'https://ucarecdn.com/'+item.image.uuid+'/'" target="_blank">Open op ander tabblad</a>
          <button v-on:click="removeItem(item, 'image')">Delete Picture</button>
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import { db } from "@/firebase";
import moment from "moment";

import uploadcare from "uploadcare-widget";

function getSeconds() {
  let date = new Date();
  let seconds = date.getTime();
  return seconds;
}

export default {
  name: "FinderPictures",
  props: {
    user: String,
    walk: String
  },
  data: () => ({
    items: []
  }),
  filters: {
    moment: function(date) {
      return moment(date).format("MMMM Do YYYY, h:mm:ss a");
    },
    getResized: function(id) {
      
      return "https://ucarecdn.com/" + id + "/-/resize/100x/";
    }
  },
  watch: {
    user: function(newValue) {
      let vm = this;
      console.log(newValue);
      if (newValue === "") {
        // If the users is '', then we just want all the pictures of the walk.
        console.log("??", vm.walk);
        vm.$bindAsArray(
          "items",
          db.ref("data/images").orderByChild("walk")
        ).equalTo(vm.walk);
      } else {
        let vm = this;
        vm.$bindAsArray(
          "items",
          db
            .ref("data/images")
            .orderByChild("user")
            .equalTo(newValue)
        );

      }
    }
  },
  methods: {
    getPicture(picture) {
      this.$emit("clicked", picture);
    },
    updateItem(item, context) {
      this.$emit("updated", [item, context]);
    },
    removeItem(item, context) {
      this.$emit("remove", [item, context]);
    }
  }
};
</script>


<style scoped lang="scss">
</style>

