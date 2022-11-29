import { defineStore } from "pinia";
import { S } from "@/utils";

const useTokenStore = defineStore({
  id: "token",
  state: () => ({
    value: S.getAuthToken(),
  }),
  getters: {
    // doubleCount: (state) => state.value,
  },
  actions: {
    dispatch(value: string) {
      this.value = value;
      S.setAuthToken(value);
    },
  },
});

export default useTokenStore;
