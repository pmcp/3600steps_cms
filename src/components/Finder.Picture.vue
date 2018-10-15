<template>
  <div>
   
  </div>
</template>

<script>
import { db } from "@/firebase";
import moment from "moment";
export default {
  name: "FinderPicture",
  props: {
    picture: String
  },
  data: () => ({
    items: []
  }),
  filters: {
    moment: function(date) {
      return moment(date).format("MMMM Do YYYY, h:mm:ss a");
    }
  },
  watch: {
    picture: function(newValue) {
      let vm = this;
      if(newValue === '') {
        vm.$bindAsArray('items', db.ref("data/images").orderByChild('dateAdded'))
      } else {
        let vm = this;
        vm.$bindAsArray('items', db.ref("data/images").orderByChild('user')
          .equalTo(newValue))
      }
    }
  },
  methods: {
    getPicture(picture) {
      this.$emit('clicked', picture)
    },
    updateItem (item ,context) {
      this.$emit('updated', [item, context])
    }
  }
};
</script>


<style scoped lang="scss">

</style>
