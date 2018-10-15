<template>
<div class="container is-fluid ">
    <div class="columns">
      <div class="column scrollable ">

        <b-collapse class="card" :open="false">
          <div slot="trigger" slot-scope="props" class="card-header">
            <p class="card-header-title">
                Add Copy
            </p>
            <a cass="card-header-icon">
              <b-icon
                  :icon="props.open ? 'menu-down' : 'menu-up'">
              </b-icon>
            </a>
          </div>
          <div class="card-content">
            <div class="content">
              <div>
                <label>Id:</label>
                <input v-model="newItem.id"  placeholder="" class="u-full-width" type="text">
              </div>
              <div>
                <label>Nl:</label>
                <input v-model="newItem.nl"  placeholder="" class="u-full-width" type="text">
              </div>
              <div>
                <label>Fr:</label>
                <input v-model="newItem.fr"  placeholder="" class="u-full-width" type="text">
              </div>
              <div>
                <label>En:</label>
                <input v-model="newItem.en"  placeholder="" class="u-full-width" type="text">
              </div>
              <div v-on:click="addItem(newItem)">
                Add Copy
              </div>
            </div>
          </div>
        </b-collapse>


       <b-collapse class="card" v-for="(item, index) in items" v-bind:key="'copy_' + index" :open="false">
          <div slot="trigger" slot-scope="props" class="card-header">
              <p class="card-header-title">
                {{item.id}}
              </p>
              <a cass="card-header-icon">
                <b-icon
                    :icon="props.open ? 'menu-down' : 'menu-up'">
                </b-icon>
              </a>
          </div>
          <div class="card-content">
            <div class="content">
              <div>
                <label>Id:</label>
                <input v-model="item.id" @input="updateItem(item)" placeholder="" class="u-full-width" type="text">
              </div>
              <div>
                <label>Nl:</label>
                <input v-model="item.nl" @input="updateItem(item)" placeholder="" class="u-full-width" type="text">
              </div>
              <div>
                <label>Fr:</label>
                <input v-model="item.fr" @input="updateItem(item)" placeholder="" class="u-full-width" type="text">
              </div>
              <div>
                <label>En:</label>
                <input v-model="item.en" @input="updateItem(item)" placeholder="" class="u-full-width" type="text">
              </div>
              <div v-on:click="removeItem(item, 'users')">
                  Delete Copy
              </div>
            </div>
          </div>
        </b-collapse>
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
      items: db.ref("admin/copy"),
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
