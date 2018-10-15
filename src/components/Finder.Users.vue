<template>
  <div>
    <div v-on:click="getPictures('')">
        All pictures
    </div>
    <b-collapse class="card" v-for="(item, index) in items" v-bind:key="'users_' + index" :open="false">
      <div slot="trigger" slot-scope="props" class="card-header">
          <p class="card-header-title">
            {{item.user.first}} - {{item.pictures}}
          </p>
          <a cass="card-header-icon">
            <b-icon
                :icon="props.open ? 'menu-down' : 'menu-up'">
            </b-icon>
          </a>
      </div>
      <div class="card-content">
        <div class="content">
          <div v-on:click="getPictures(item['.key'])">
            Show Pictures
          </div>
          <div>
            <label>First:</label>
            <input v-model="item.user.first" @input="updateItem(item, 'users')" placeholder="" class="u-full-width" type="text">
          </div>
          <div>
            <label>Last:</label>
            <input v-model="item.user.last" @input="updateItem(item, 'users')" placeholder="" class="u-full-width" type="text">
          </div>
          <div>
              <b-switch v-model="item.hide" @input="toggleHide(item, 'users')">Hide user in overview</b-switch>
          </div>
          <div v-on:click="removeItem(item, 'users')">
              Delete User
            </div>
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import { db } from "@/firebase";
export default {
  name: "FinderUsers",
  props: {
    walk: String
  },
  data: () => ({
    items: []
  }),
  watch: {
    walk: function(newValue) {
      if(newValue === '') {
        return;
      } else {
        let vm = this;
        vm.$bindAsArray('items', db.ref("data/users").orderByChild('walk')
          .equalTo(newValue))
      }
    }
  },
  methods: {
    getPictures(user) {
      this.$emit('clicked', user)
    },
    updateItem (item ,context) {
      this.$emit('updated', [item, context])
    },
    toggleHide (item ,context) {
      this.$emit('updated', [item, context])
      this.$emit('toggleHide', [item, item.hide])
    },    
    removeItem (item ,context) {
      this.$emit('remove', [item, context])
    }
  }
};
</script>


<style scoped lang="scss">
</style>
