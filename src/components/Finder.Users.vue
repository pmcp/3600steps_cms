<template>
  <div>
    <div v-on:click="getPictures('')">All pictures</div>
    <b-collapse
      class="card"
      v-for="(item, index) in items"
      v-bind:key="'users_' + index"
      :open="false"
    >
      <div slot="trigger" slot-scope="props" class="card-header">
        <p class="card-header-title">{{item.user.first}} - {{item.pictures}}</p>
        <a cass="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"></b-icon>
        </a>
      </div>
      <div class="card-content">
        <div class="content">
          <div v-on:click="addPictures(item)">Add Pictures</div>
          <div v-on:click="getPictures(item['.key'])">Show Pictures</div>
          <div>
            <label>First:</label>
            <input
              v-model="item.user.first"
              @input="updateItem(item, 'users')"
              placeholder
              class="u-full-width"
              type="text"
            >
          </div>
          <div>
            <label>Last:</label>
            <input
              v-model="item.user.last"
              @input="updateItem(item, 'users')"
              placeholder
              class="u-full-width"
              type="text"
            >
          </div>
          <div>
            <b-switch v-model="item.hide" @input="toggleHide(item, 'users')">Hide user in overview</b-switch>
          </div>
          <div v-on:click="removeItem(item, 'users')">Delete User</div>
          <div v-on:click="setUrl(item)">Set Url</div>
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import { db } from "@/firebase";
import uploadcare from "uploadcare-widget";

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
      if (newValue === "") {
        return;
      } else {
        let vm = this;
        vm.$bindAsArray(
          "items",
          db
            .ref("data/users")
            .orderByChild("walk")
            .equalTo(newValue)
        );
      }
    }
  },
  methods: {
    setUrl(user) {
      db.ref("data/images")
        .orderByChild("user")
        .equalTo(user[".key"])
        .once("value", snapshot => {
          const p = snapshot.val();
          console.log(p);

          for (var key in p) {
            const theKey = key;
            if (p.hasOwnProperty(theKey)) {
              console.log('the key', theKey);
              if (p[key].url !== undefined) {
                let file = uploadcare.fileFrom("url", p[theKey].url, {
                  publicKey: "0d8c0c56c0314b2df8b7",
                  imagesOnly: true
                });
                file.done(function(fileInfo) {
                  console.log("succes", theKey);
                  db.ref("data/images/" + theKey)
                    .child("image")
                    .set(fileInfo, function(error) {
                      if (error) {
                        console.log('writing went wrong', error)
                      } else {
                        console.log('writing succeeded', key)
                      }
                    });
                });

                file.fail(function(error, fileInfo) {
                  console.log("failed!", error, fileInfo);
                });
                file.progress(function(uploadInfo) {
                  console.log("progress", uploadInfo);
                });
              }
            }
          }
        });
    },
    addPictures(args) {
      this.$emit("addPictures", args);
    },
    getPictures(user) {
      this.$emit("clicked", user);
    },
    updateItem(item, context) {
      this.$emit("updated", [item, context]);
    },
    toggleHide(item, context) {
      this.$emit("updated", [item, context]);
      this.$emit("toggleHide", [item, item.hide]);
    },
    removeItem(item, context) {
      this.$emit("remove", [item, context]);
    }
  }
};
</script>


<style scoped lang="scss">
</style>
