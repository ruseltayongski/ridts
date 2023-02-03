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
    }
  },
});

const useUseridStore = defineStore({
  id: "userid",
  state: () => ({
    value: S.getAuthUserid(),
  }),
  getters: {
    // doubleCount: (state) => state.value,
  },
  actions: {
    dispatch(value: string) {
      this.value = value;
      S.setAuthUserid(value);
    }
  },
});

export { 
  useTokenStore,
  useUseridStore
}
