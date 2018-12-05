<template>
  <div class="container is-fluid">
    <div class="columns">
      <!-- <div class="column scrollable">
        <b-field label="Simple">
          <b-select placeholder="Select a name">
            <option
              v-for="u in users"
              :value="selectedUser"
              :key="u.id"
            >{{ u.user.first }} {{ u.user.last }} - {{ u.walk | getWalkName }}</option>
          </b-select>
        </b-field>
      </div>-->
      <!-- <button @click="loopImages">All Images</button> -->
      <div class="column scrollable">
        <finder-walks
          @clicked="openUsers"
          @updated="updateItem"
          @add="addItem"
          @remove="removeItem"
        ></finder-walks>
      </div>
      <div class="column scrollable">
        <finder-users
          :walk="walk"
          @addPictures="addPictures"
          @clicked="openPictures"
          @updated="updateItem"
          @remove="removeItem"
          @toggleHide="setHide"
        ></finder-users>
      </div>
      <div class="column scrollable is-half">
        <finder-pictures
          :user="user"
          :walk="walk"
          v-if="walk !== ''"
          @clicked="openPicture"
          @updated="updateItem"
          @remove="removeItem"
        ></finder-pictures>
      </div>
      <!-- <div class="column scrollable">
        <finder-picture :picture="picture"></finder-picture>
      </div>-->
    </div>
  </div>
</template>


<script>
import { db } from "@/firebase";
import FinderWalks from "../components/Finder.Walks.vue";
import FinderUsers from "../components/Finder.Users.vue";
import FinderPictures from "../components/Finder.Pictures.vue";
import FinderPicture from "../components/Finder.Picture.vue";

import uploadcare from "uploadcare-widget";

function getSeconds() {
  let date = new Date();
  let seconds = date.getTime();
  return seconds;
}

export default {
  name: "Finder",
  data: () => ({
    walk: "",
    user: "",
    picture: ""
  }),
  components: {
    FinderWalks,
    FinderUsers,
    FinderPictures,
    FinderPicture
  },
  firebase: function() {
    return {
      users: db.ref("data/users")
    };
  },
  filters: {
    getWalkName: function(u) {
      let name;
      const ref = db.ref("data/walks/" + u);
      ref.once("value").then(snapshot => {
        console.log(snapshot.val().id);
        name = snapshot.val().id;
        return name;
      });
      return name;
    }
  },
  methods: {
    saveFileToFirebase(userKey, walk, fileInfo, dateAdded) {
      let userPicturesRef = db.ref("data/users").child(userKey + "/pictures");
      userPicturesRef.transaction(function(pictures) {
        return pictures + 1;
      });
      let userTakenTimeRef = db
        .ref("data/users")
        .child(userKey + "/lastPicture");
      userTakenTimeRef.transaction(function() {
        return dateAdded;
      });

      db.ref("data/images")
        .push({
          image: fileInfo,
          dateAdded: dateAdded,
          user: userKey,
          walk: walk
        })
        .then(result => {
          console.log(result);
        });
    },
    loopImages() {
      db.ref("data/images").once("value", snapshot => {
        const p = snapshot.val();

        for (var key in p) {
          const theKey = key;
          if (p.hasOwnProperty(theKey)) {
            if (p[theKey].url !== undefined && p[theKey].image === undefined) {
              console.log(key, theKey);
              let file = uploadcare.fileFrom("url", p[theKey].url, {
                publicKey: "0d8c0c56c0314b2df8b7",
                imagesOnly: true
              });
              file.done(function(fileInfo) {
                console.log("succes", fileInfo);
                db.ref("data/images/" + theKey)
                  .child("image")
                  .set(fileInfo, function(error) {
                    if (error) {
                      console.log("writing went wrong", error);
                    } else {
                      console.log("writing succeeded", theKey);
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

    addPictures(user) {
      const userKey = user[".key"];
      const walk = user.walk;
      let vm = this;
      uploadcare
        .openDialog(null, {
          imagesOnly: true,
          publicKey: "0d8c0c56c0314b2df8b7",
          multiple: true
        })
        .done(files => {
          var groupPromise = files.promise();
          groupPromise.done(function(fileGroupInfo) {
            const arrayOfFiles = files.files();
            console.log(arrayOfFiles);

            for (let i = 0, len = arrayOfFiles.length; i < len; i++) {
              let file = arrayOfFiles[i];

              file.done(fileInfo => {
                console.log("per file", fileInfo);
                vm.saveFileToFirebase(userKey, walk, fileInfo, getSeconds());
              });
            }
          });

          groupPromise.fail(function(error, fileGroupInfo) {
            console.log(error, fileGroupInfo);
          });
          groupPromise.progress(function(uploadInfo) {
            console.log(uploadInfo);
          });
        });
    },
    // checkImages () {
    //   db
    //   .ref("data/images")
    //   .once('value', snapshot => {
    //     const p = snapshot.val();
    //     for (var key in p) {
    //       if (p.hasOwnProperty(key)) {
    //       // db.ref("data/images/"+key).child('meta').remove()
    //       // Also put this in the queue for Vision
    //       if(p[key].vision === undefined) {
    //          db.ref('functions/vision').push({
    //           dateAdded: getSeconds(),
    //           user: p[key].user,
    //           walk: p[key].walk,
    //           fileName: p[key].filePath,
    //           mime: 'image/png',
    //           key: key
    //         });
    //       }
    //       if(p[key].small === undefined && p[key].filePath !== undefined) {
    //         console.log(p[key].filePath)
    //         db.ref('functions/resize').push({
    //           fileName: p[key].filePath,
    //           url: p[key].url,
    //           mime: 'image/png',
    //           resizes: {
    //             'small': {
    //               'name': 'small',
    //               'size': '25%'
    //             }
    //           },
    //           key: key
    //         });
    //       }
    //       }
    //     }
    //   });
    // },
    openUsers(walk) {
      this.walk = walk;
    },
    openPictures(user) {
      this.user = user;
    },
    openPicture(picture) {
      this.picture = picture;
    },
    updateItem: function(item) {
      const copy = { ...item[0] };
      delete copy[".key"];
      db.ref("data/" + item[1])
        .child(item[0][".key"])
        .set(copy);
    },
    addItem(item) {
      db.ref("data/" + item[1]).push(item[0]);
    },

    setHide(item) {
      // Loop through all pictures of this user. Give them all value TRUE or FALSE for Key "Hide".
      const userKey = item[0][".key"];
      db.ref("data/images")
        .orderByChild("user")
        .equalTo(userKey)
        .once("value", snapshot => {
          const p = snapshot.val();
          for (var key in p) {
            if (p.hasOwnProperty(key)) {
              db.ref("data/images/" + key)
                .child("hide")
                .set(item[1]);
            }
          }
        });
    },
    removeItem(item) {
      if (item[1] === "users") {
        // We are removing a user, so we have to remove all their pictures also.
        // First get all the images of this user
        db.ref("data/images")
          .orderByChild("user")
          .equalTo(item[0][".key"])
          .once("value", snapshot => {
            const p = snapshot.val();
            for (var key in p) {
              if (p.hasOwnProperty(key)) {
                // Then remove every picture in storage
                // TODO: Delete image in storage and delete thumbs
                // And remove every picture in database
                db.ref("data/images")
                  .child(item[0][".key"])
                  .remove();
              }
            }
            // Remove the user
            db.ref("data/users")
              .child(item[0][".key"])
              .remove();
          });
      } else if (item[1] === "image") {
        // TODO: If it is a picture we are deleting, we have to subtract the overal number of pictures the user took.
        // TODO: Delete image in storage and delete thumbs
        db.ref("data/images")
          .child(item[0][".key"])
          .remove();
      } else {
        db.ref("data/" + item[1])
          .child(item[0][".key"])
          .remove();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.scrollable {
  height: 75vh;
  overflow: scroll;
}
</style>
