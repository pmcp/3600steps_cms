<template>
  <div class="container is-fluid ">
    <div class="columns">
      <div class="column scrollable ">
        <div v-for="(item, index) in items" v-bind:key="'colour_' + index">
          <label>Id:</label>
          <input v-model="item.id" @input="updateItem(item)" placeholder="" class="u-full-width" type="text">     
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { db } from "@/firebase";

export default {
  name: "Copy",
  data: () => ({
    newItem: {}
  }),
  firebase: function() {
    return {
      items: db.ref("admin/colours"),
    };
  },
  components: {
  },
  methods: {
    updateItem: function(item) {
      console.log(item[".key"]);
      const copy = { ...item };
      delete copy[".key"];
      db.ref("admin/copy")
        .child(item[".key"])
        .set(copy);
    },
    addItem (item) {
      db.ref("admin/copy").push(item);
    },
    removeItem (item) {
      db.ref("admin/copy").child(item[".key"]).remove();
    }
  },
    
  
};
</script>

<style scoped lang="scss">
  .scrollable {
    height: 75vh;
    overflow: scroll;
  }
</style>
