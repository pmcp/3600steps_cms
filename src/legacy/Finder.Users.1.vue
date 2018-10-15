<template>
<div>

  {{users}}
  </div>
</template>

<script>

import { db } from '@/firebase';
export default {
  name: 'FinderWalk',
  props: {
    users: Object
  },
  data: () => ({    
    activeTab: 0,
  }),
  firebase: function() {
    return {
      pictures: db.ref('data/images'),
      // users: db.ref('data/users')
    };
  },
  computed: {
    // items: function () {
    //   let vm = this;
    //   return db.ref('data/users').orderByChild('walk').equalTo(vm.walk)
    // }
  },
  methods: {
    getWalk: function(walk) {
      let vm = this;
      vm.walk = walk;
       vm.$firebaseRefs.users
        .orderByChild('walk')
        .equalTo(walk)
        .once('value', snapshot => {
          vm.users = snapshot.val();
        });
    },

    updateItem (item) {
      db.ref('data/walk').set(item);
    },


    getAllPictures: function(walk) {
      let vm = this;
      // Get all the images
      vm.$firebaseRefs.pictures
        .orderByChild('walk')
        .equalTo(walk)
        .limitToLast(36)
        .once('value', snapshot => {
          vm.picturesSubset = snapshot.val();
        });
    },
    getPictures: function(user) {
      let vm = this;
      vm.$firebaseRefs.pictures
        .orderByChild('user')
        .equalTo(user)
        .limitToLast(36)
        .once('value', snapshot => {
          vm.picturesSubset = snapshot.val();
        });
    },
    getMetaWalk: function(walk) {
      let vm = this;
      vm.$firebaseRefs.walks
        .child(walk)
        .once('value', snapshot => {
          vm.metaWalk = snapshot.val();
        });
    },
    // updateItem: function(item, context) {
    //   let key = item['.key'];
    //   let newItem = JSON.parse(JSON.stringify(item));
    //   delete newItem['.key'];
    //   this.$firebaseRefs[context].child(key).update(newItem);
    // },
  },
}
</script>


<style scoped lang="scss">

</style>
