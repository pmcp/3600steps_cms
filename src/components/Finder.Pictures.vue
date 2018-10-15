<template>
  <div>
      
    <b-collapse class="card" v-for="(item, index) in items" v-bind:key="'pictures_' + index" :open="false">
      <div slot="trigger" slot-scope="props" class="card-header">
        
          <p class="card-header-title">
            <img :src="item.url" style="max-width:100px">
            <!-- {{item.dateAdded  | moment}} -->
          </p>
          <a cass="card-header-icon">
            <b-icon
                :icon="props.open ? 'menu-down' : 'menu-up'">
            </b-icon>
          </a>
      </div>
      <div class="card-content">
        <div class="content">
          <div v-on:click="getPicture(item['.key'])">
            Show Meta
          </div>
         
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import { db } from "@/firebase";
import moment from "moment";
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
    }
  },
  watch: {
    user: function(newValue) {
      let vm = this;
      if(newValue === '') {
        // If the users is '', then we just want all the pictures of the walk.

        vm.$bindAsArray('items', db.ref("data/images").orderByChild('walk')).equalTo(vm.walk);
      } else {
        let vm = this;
        vm.$bindAsArray('items', db.ref("data/images").orderByChild('user')
          .equalTo(newValue))
      }
    }
  },
  methods: {
    getPicture(picture) {
      this.$emit('clicked', picture)
    },
    updateItem (item ,context) {
      this.$emit('updated', [item, context])
    }
  }
};
</script>


<style scoped lang="scss">

</style>
