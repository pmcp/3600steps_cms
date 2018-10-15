<template>
<div class="container is-fluid ">
    <div class="columns">
      <div class="column scrollable ">

        <b-collapse class="card" :open="false">
          <div slot="trigger" slot-scope="props" class="card-header">
            <p class="card-header-title">
                Add Slide
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
                <b-field label="Nl">
                  <b-input type="textarea" v-model="newItem.nl"></b-input>
                </b-field>
              </div>
              <div>
                <b-field label="Fr">
                  <b-input type="textarea" v-model="newItem.fr"></b-input>
                </b-field>
              </div>
              <div>
                <b-field label="En">
                  <b-input type="textarea" v-model="newItem.en"></b-input>
                </b-field>
              </div>
              <div v-on:click="addItem(newItem)">
                Add Slide
              </div>
            </div>
          </div>
        </b-collapse>


       <b-collapse class="card" v-for="(item, index) in items" v-bind:key="'copy_' + index" :open="false">
          <div slot="trigger" slot-scope="props" class="card-header">
              <p class="card-header-title">
                {{item.nl}}
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
                <b-field label="Nl">
                  <b-input type="textarea" v-model="item.nl" @input="updateItem(item)"></b-input>
                </b-field>
              </div>
              <div>
                <b-field label="Fr">
                  <b-input type="textarea" v-model="item.fr" @input="updateItem(item)"></b-input>
                </b-field>
              </div>
              <div>
                <b-field label="En">
                  <b-input type="textarea" v-model="item.en" @input="updateItem(item)"></b-input>
                </b-field>
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
      items: db.ref("admin/slides"),
    };
  },
  components: {
  },
  methods: {
    updateItem: function(item) {
      console.log(item[".key"]);
      const copy = { ...item };
      delete copy[".key"];
      db.ref("admin/slides")
        .child(item[".key"])
        .set(copy);
    },
    addItem (item) {
      db.ref("admin/slides").push(item);
    },
    removeItem (item) {
      db.ref("admin/slides").child(item[".key"]).remove();
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
