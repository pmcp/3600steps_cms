<template>
  <div>
    <b-collapse class="card" :open="false">
      <div slot="trigger" slot-scope="props" class="card-header">
        <p class="card-header-title">
            Add walk
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
            <label>Area:</label>
            <input v-model="newItem.area" placeholder="" class="u-full-width" type="text">
          </div>
          <div>
            <label>id:</label>
            <input v-model="newItem.id" placeholder="" class="u-full-width" type="text">
          </div>
          <div>
              <b-switch v-model="newItem.hide">Hide walk in overview</b-switch>
          </div>
          <div v-on:click="addItem(newItem, 'walks')">
            Add Walk
          </div>
        </div>
      </div>
    </b-collapse>
    <b-collapse class="card" v-for="(item, index) in items" v-bind:key="'walks_' + index" :open="false">
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
            <div v-on:click="getUsers(item['.key'])">
              Open Walk
            </div>
            <div>
              <label>Area:</label>
              <input v-model="item.area" @input="updateItem(item, 'walks')" placeholder="" class="u-full-width" type="text">
            </div>
            <div>
              <label>id:</label>
              <input v-model="item.id" @input="updateItem(item, 'walks')" placeholder="" class="u-full-width" type="text">
            </div>
            <div>
                <b-switch v-model="item.hide" @input="updateItem(item, 'walks')">Hide walk in overview</b-switch>
            </div>
            <div v-on:click="removeItem(item, 'walks')">
              Delete walk
            </div>
          </div>
        </div>
    </b-collapse>
  </div>
</template>

<script>
import { db } from "@/firebase";
export default {
  name: "FinderWalks",
  props: {
    walk: String
  },
  data: () => ({
    newItem: {}
  }),
  firebase: function() {
    return {
      items: db.ref("data/walks")
    };
  },
  computed: {},
  methods: {
    getUsers (walk) {
      this.$emit('clicked', walk)
    },
    updateItem (item ,context) {
      this.$emit('updated', [item, context])
    },
    addItem (item ,context) {
      this.$emit('add', [item, context])
    },
    removeItem (item ,context) {
      this.$emit('remove', [item, context])
    }
  }
};
</script>


<style scoped lang="scss">
</style>
