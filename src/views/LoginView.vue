<script setup lang="ts">
import { reactive } from "vue";
import { userLogin,getUserProfile } from '@/api/auth'
import { useMainStore } from "@/stores/main.ts";
import { useTokenStore } from "@/stores"
import { useRouter } from "vue-router"

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

const tokenStore = useTokenStore()
const router = useRouter();

const form = reactive({
  username: "",
  password: "",
  remember: true,
});

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
  }, 1000)
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
            <BaseButton to="/dashboard" color="info" outline label="Back" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
