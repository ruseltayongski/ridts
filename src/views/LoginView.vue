<script setup lang="ts">
  import { reactive, onMounted } from "vue";
  import { userLogin,getUserProfile } from '@/api/auth'
  import { useMainStore } from "@/stores/main.ts";
  import { useTokenStore } from "@/stores"
  import { useRouter } from "vue-router"

  import { loadScript } from "vue-plugin-load-script";

  import { mdiAccount, mdiAsterisk } from "@mdi/js";
  import SectionFullScreen from "@/components/SectionFullScreen.vue";
  import CardBox from "@/components/CardBox.vue";
  import FormCheckRadio from "@/components/FormCheckRadio.vue";
  import FormField from "@/components/FormField.vue";
  import FormControl from "@/components/FormControl.vue";
  import BaseButton from "@/components/BaseButton.vue";
  import BaseButtons from "@/components/BaseButtons.vue";
  import LayoutGuest from "@/layouts/LayoutGuest.vue";

  import { notify } from "notiwind"

  import doh_logo from "@/assets/login/assets/images/doh.png"
  import shape_1 from "@/assets/login/assets/images/shape/shape-1.svg"
  import shape_2 from "@/assets/login/assets/images/shape/shape-2.svg"
  import shape_3 from "@/assets/login/assets/images/shape/shape-3.svg"
  import shape_4 from "@/assets/login/assets/images/shape/shape-4.svg"
  import baby_low from "@/assets/login/assets/images/baby_low.png"
  import about from "@/assets/login/assets/images/about.svg"
  import contact from "@/assets/login/assets/images/contact.svg"
  import footer_shape_left from "@/assets/login/assets/images/footer-shape-left.png"
  import footer_shape_right from "@/assets/login/assets/images/footer-shape-right.png"

  onMounted(() => {
    (async () => {
    //   await loadScript('/src/assets/login/assets/js/tiny-slider.js')
    //       .then(() => {
    //           console.log("loaded: tiny-slider")
    //       })
    //       .catch(() => {
    //           console.log("not loaded (tiny-slider)");
    //       });
      await loadScript('/src/assets/login/assets/js/wow.min.js')
          .then(() => {
              console.log("loaded: wow")
          })
          .catch(() => {
              console.log("not loaded (wow)");
          });
      await loadScript('/src/assets/login/assets/js/main.js')
          .then(() => {
              console.log("loaded: main")
          })
          .catch(() => {
              console.log("not loaded (main)");
          });
    })();
  })

  const tokenStore = useTokenStore()
  const router = useRouter();

  const form = reactive({
    username: "",
    password: "",
    remember: true,
  })

  const submit = async () => {
    if (!form.username && !form.password) {
      toastError("Please enter your username and password!")
      return;
    } else if(!form.username) {
      toastError("Please enter your username")
      return;
    } else if(!form.password) {
      toastError("Please enter your password")
      return;
    }
    try {
      const response = await userLogin({
          username: form.username,
          password: form.password
      })
      /**
      * invalid credential
      * */
      if(response.message) {
        console.log(response.message)
        toastError(response.message)
        return;
      }

      notify({
        group: "foo",
        title: "Success",
        text: "Successfully Login!"
      }, 4000)

      let token = response.access_token
      tokenStore.dispatch(token)

      useMainStore().setUser({
        firstname: "",
        lastname: "",
        avatar:
          "https://avatars.dicebear.com/api/avataaars/example.svg?options[top][]=shortHair&options[accessoriesChance]=93",
      });

      router.push({
        path: "/dashboard",
      });
    } catch (err) {
      console.log(err)
    }
  };

  const toastError = (message: String) => {
    notify({
      group: "error",
      title: "Error",
      text: message
    }, 2000)
  }
</script>

<template>
    <LayoutGuest>
        <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
        <CardBox :class="cardClass" is-form @submit.prevent="submit">
            <FormField label="Login" help="Please enter your login">
            <FormControl
                v-model="form.username"
                :icon="mdiAccount"
                name="login"
                autocomplete="username"
            />
            </FormField>

            <FormField label="Password" help="Please enter your password">
            <FormControl
                v-model="form.password"
                :icon="mdiAsterisk"
                type="password"
                name="password"
                autocomplete="current-password"
            />
            </FormField>

            <FormCheckRadio
            v-model="form.remember"
            name="remember"
            label="Remember"
            :input-value="true"
            />

            <template #footer>
            <BaseButtons>
                <BaseButton type="submit" color="info" label="Login" />
                <BaseButton to="/" color="info" outline label="Back" />
            </BaseButtons>
            </template>
        </CardBox>
        </SectionFullScreen>
  </LayoutGuest>
</template>