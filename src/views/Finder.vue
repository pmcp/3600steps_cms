<template>
<div class="container is-fluid ">
    <div class="columns">
      <div class="column scrollable ">
        <finder-walks @clicked="openUsers" @updated="updateItem" @add="addItem" @remove="removeItem"></finder-walks>
      </div>
      <div class="column scrollable">
        <finder-users :walk="walk"  @clicked="openPictures" @updated="updateItem" @remove="removeItem" @toggleHide="setHide"></finder-users>
      </div>
      <div class="column scrollable is-half">
        <finder-pictures :user="user" :walk="walk" v-if="walk !== ''" @clicked="openPicture" @updated="updateItem"></finder-pictures>
      </div>
      <!-- <div class="column scrollable">
        <finder-picture :picture="picture"></finder-picture>
      </div> -->
    </div>
  </div>
</template>


<script>
import { db } from "@/firebase";
import FinderWalks from "../components/Finder.Walks.vue";
import FinderUsers from "../components/Finder.Users.vue";
import FinderPictures from "../components/Finder.Pictures.vue";
import FinderPicture from "../components/Finder.Picture.vue";

export default {
  name: "Finder",
  data: () => ({
    walk: '',
    user: '',
    picture: ''
  }),
  components: {
    FinderWalks,
    FinderUsers,
    FinderPictures,
    FinderPicture
  },
  methods: {
    openUsers (walk) {
      this.walk = walk;
    },
    openPictures (user) {
      this.user = user;
    },
    openPicture (picture) {
      this.picture = picture;
    },
    updateItem: function(item) {
      const copy = { ...item[0] };
      delete copy[".key"];
      db.ref("data/" + item[1])
        .child(item[0][".key"])
        .set(copy);
    },
    addItem (item) {
      db.ref("data/" + item[1]).push(item[0]);
    },

    setHide (item) {
      // Loop through all pictures of this user. Give them all value TRUE or FALSE for Key "Hide".
      const userKey = item[0][".key"];
      db
      .ref("data/images")
      .orderByChild("user")
      .equalTo(userKey)
      .once('value', snapshot => {
        const p = snapshot.val();
        for (var key in p) {
          if (p.hasOwnProperty(key)) {
            db.ref("data/images/"+key).child('hide').set(item[1])
          }
        }
      });     
    },
    removeItem (item) {
      if(item[1] === 'users') {
      // We are removing a user, so we have to remove all their pictures also.
      // First get all the images of this user
        db
        .ref("data/images")
        .orderByChild("user")
        .equalTo(item[0]['.key'])
        .once("value", snapshot => {
          const p = snapshot.val();
          for (var key in p) {
            if (p.hasOwnProperty(key)) {
              // Then remove every picture in storage
              // TODO: Delete image in storage and delete thumbs
              // And remove every picture in database
              db.ref("data/images").child(item[0][".key"]).remove();
            }
          }
          // Remove the user
           db.ref("data/users").child(item[0][".key"]).remove();
        }); 
      } else if (item[1] ===  'picture') {
          // TODO: If it is a picture we are deleting, we have to subtract the overal number of pictures the user took.
          // TODO: Delete image in storage and delete thumbs
          db.ref("data/images").child(item[0][".key"]).remove();
      } else {
        db.ref("data/" + item[1]).child(item[0][".key"]).remove();
      }
    },
  }
};
</script>

<style scoped lang="scss">
  .scrollable {
    height: 75vh;
    overflow: scroll;
  }
</style>
