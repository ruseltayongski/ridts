import { defineStore } from "pinia";
import axios from "axios";

export const useMainStore = defineStore("main", {
  state: () => ({
    /* User */
    userId: "",
    userFirstname: "",
    userMiddlename: "",
    userLastname: "",
    userAvatar: null,

    /* Field focus with ctrl+k (to register only once) */
    isFieldFocusRegistered: false,

    /* Sample data (commonly used) */
    clients: [],
    history: [],
  }),
  actions: {
    setUser(payload) {
      this.userId = payload.id
      this.userFirstname = payload.firstname
      this.userMiddlename = payload.middlename
      this.userLastname = payload.lastname
      this.userAvatar = payload.avatar
    },
    fetch(sampleDataKey) {
      axios
        .get(`data-sources/${sampleDataKey}.json`)
        .then((r) => {
          console.log(r)
          if (r.data) {
            this[sampleDataKey] = r.data;
          }
          // if (r.data && r.data.data) {
          //   this[sampleDataKey] = r.data.data;
          // }
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
  },
});
