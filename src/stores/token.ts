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

const useMuncityStore = defineStore({
  id: "muncity_id",
  state: () => ({
    value: S.getAuthMuncity(),
  }),
  getters: {
    // doubleCount: (state) => state.value,
  },
  actions: {
    dispatch(value: string) {
      this.value = value;
      S.setAuthMuncity(value);
    }
  },
});

const useMuncityDescriptionStore = defineStore({
  id: "muncity_description",
  state: () => ({
    value: S.getAuthMuncityDescription(),
  }),
  getters: {
    // doubleCount: (state) => state.value,
  },
  actions: {
    dispatch(value: string) {
      this.value = value;
      S.setAuthMuncityDescription(value);
    }
  },
});

export { 
  useTokenStore,
  useUseridStore,
  useMuncityStore,
  useMuncityDescriptionStore
}
