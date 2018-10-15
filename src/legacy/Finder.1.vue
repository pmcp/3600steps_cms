<template>
<div class="container is-fluid ">
        <div class="columns">
            <div class="column is-narrow">
                 <div v-for="(item, index) in walks" v-bind:key="index+'_walks'" v-on:click="selectWalk(item['.key'])" class="pointer hover">
                    {{item.id}}
                </div>
            </div>
            <div class="column auto">
    
              <section v-if="walk !== null">
             

                      <div class="block">
        
                <div>
            <label>Area:</label>
            <input v-model="walk.area" @input="updateItem(walk)" placeholder="" class="u-full-width" type="text">
        </div>

                <div>
            <label>id:</label>
            <input v-model="walk.id" @input="updateItem(walk)" placeholder="" class="u-full-width" type="text">
        </div>


                    <b-switch v-model="walk.live" @input="updateItem(walks[walk])">Show walk in overview</b-switch>
                </div>

                 <finder-walk :users="selectedUsers" :pictures="pictures"></finder-walk>
            </section>


                <!-- <div class="columns">
                     <div class="column is-narrow">
                        <div v-for="(item, index) in usersSubset" v-bind:key="index+'_users'" v-on:click="getPictures(index)" class="pointer hover">
                            {{item.user.first}} {{item.user.last}}
                        </div>
                    </div>
                     <div class="column is-half" >
                        <div class="columns is-multiline">
                            <div class="column is-2" v-for="(item, index) in picturesSubset" v-bind:key="index+'_images'" v-on:click="setMeta(item.meta, item.url)">
                                    {{item.dateAdded | moment}}
                                    <img :src="item.url" alt="" class="pointer picture">

                            </div>
                        </div>
                    </div>
                     <div class="column">
                        <div v-if="meta != null">
                            <a :href="url">{{url}}</a>
                            <br/>
                            <div v-for="(item, index) in meta.vision" v-bind:key="index+'_vision'">
                                <p>{{item}}</p>
                            </div>
                            <div v-for="(item, index) in meta.meta" v-bind:key="index+'_meta'">
                                <p>{{item}}</p>
                            </div>
                        </div>
                    </div>
                </div> -->
            </div>
        </div>
    </div>
</template>


<script>
import { db } from "@/firebase";
import moment from "moment";
import FinderWalk from "../components/Finder.Walk.vue";
export default {
  name: "Finder",
  data: () => ({
    walk: null,
    activeTab: 0,
    selectedUsers: null
  }),
  components: {
    FinderWalk
  },

  filters: {
    moment: function(date) {
      return moment(date).format("MMMM Do YYYY, h:mm:ss a");
    }
  },

  firebase: function() {
    return {
      admin: db.ref("admin"),
      walks: db.ref("data/walks"),
      pictures: db.ref("data/images"),
      users: db.ref("data/users")
    };
  },
  methods: {
    selectWalk: function(walk) {
      let vm = this;
      vm.walk = walk;

      // Get All The Users
      vm.getUsers(walk);
    },

    updateItem: function(item) {
      const copy = { ...item };
      delete copy[".key"];
      db.ref("data/walks")
        .child(item[".key"])
        .set(copy);
    },

    getUsers: function(walk) {
      let vm = this;
      vm.$firebaseRefs.users
        .orderByChild("walk")
        .equalTo(walk)
        // .limitToLast(36)
        .once("value", snapshot => {
          console.log(snapshot);
          vm.selectedUsers = snapshot.val();
        });
    }
  }
};
</script>
