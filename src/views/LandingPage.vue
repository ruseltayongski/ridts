<script setup lang="ts">
  import { reactive, onMounted, ref } from "vue"
  import { userLogin,getUserProfile } from '@/api/auth'
  import { useMainStore } from "@/stores/main.ts"
  import { useTokenStore } from "@/stores"
  import { useRouter } from "vue-router"

  import { loadScript } from "vue-plugin-load-script";

  import { mdiMagnifyExpand } from "@mdi/js";
  import SectionFullScreen from "@/components/SectionFullScreen.vue";
  import CardBox from "@/components/CardBox.vue";
  import FormCheckRadio from "@/components/FormCheckRadio.vue";
  import FormField from "@/components/FormField.vue";
  import FormControl from "@/components/FormControl.vue";
  import BaseButton from "@/components/BaseButton.vue";
  import BaseButtons from "@/components/BaseButtons.vue";
  import LayoutGuest from "@/layouts/LayoutGuest.vue";
  import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";

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
    }, 1000)
  }

  const handleLoginPage = () => {
    router.push({
        path: "/login",
    });
  }

  const open_track_baby = ref(false)
  const handleTrackBaby = () => {
    open_track_baby.value = open_track_baby.value ? false : true
  }
</script>

<template>
    <html>
        <body>
            <!--====== PRELOADER PART START ======-->
            <div class="preloader">
                <div class="loader">
                    <div class="ytp-spinner">
                        <div class="ytp-spinner-container">
                            <div class="ytp-spinner-rotator">
                                <div class="ytp-spinner-left">
                                    <div class="ytp-spinner-circle"></div>
                                </div>
                                <div class="ytp-spinner-right">
                                    <div class="ytp-spinner-circle"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--====== PRELOADER PART ENDS ======-->

            <!--====== HEADER PART START ======-->
            <section class="header_area">
                <!-- <div class="navbar-area bg-white invisible lg:visible"> -->
                <div class="navbar-area bg-white">
                    <div class="container relative">
                        <div class="row items-center">
                            <div class="w-full">
                                <nav class="flex items-center justify-between py-4 navbar navbar-expand-lg">
                                    <a class="navbar-brand mr-5" href="index.html" style="display: flex;">
                                        <img :src="doh_logo" alt="Logo" style="width: 50px;">
                                        <b style="margin-left: 10px;margin-top: 15px;">RITS</b>
                                    </a>
                                    <button class="block navbar-toggler focus:outline-none lg:hidden" 
                                        type="button" 
                                        data-toggle="collapse" 
                                        data-target="#navbarOne" 
                                        aria-controls="navbarOne" 
                                        aria-expanded="false" 
                                        aria-label="Toggle navigation">
                                        <span class="toggler-icon"></span>
                                        <span class="toggler-icon"></span>
                                        <span class="toggler-icon"></span>
                                    </button>
                                    <div id="navbarOne" class="absolute left-0 z-20 hidden w-full px-5 py-3 duration-300 bg-white lg:w-auto collapse navbar-collapse lg:block top-full mt-full lg:static lg:bg-transparent shadow lg:shadow-none">
                                    <!-- <div id="navbarOne">     -->
                                        <ul id="nav" class="items-center content-start mr-auto lg:justify-end navbar-nav lg:flex">
                                            <li class="nav-item ml-5 lg:ml-11">
                                                <a class="page-scroll active visible" href="#home">Home</a>
                                            </li>
                                            <li class="nav-item ml-5 lg:ml-11">
                                                <a class="page-scroll visible" href="#about">About</a>
                                            </li>
                                            <!-- <li class="nav-item ml-5 lg:ml-11">
                                                <a class="page-scroll" href="#work">Track</a>
                                            </li> -->
                                            <li class="nav-item ml-5 lg:ml-11">
                                                <a class="page-scroll visible" href="#services">Services</a>
                                            </li>
                                            <li class="nav-item ml-5 lg:ml-11">
                                                <a class="page-scroll visible" href="#contact">Contact</a>
                                            </li>
                                        </ul>
                                    </div> 
                                </nav> 
                            </div>
                        </div> 
                    </div> 
                </div>

                <div id="home" class="header_hero bg-gray relative z-10 overflow-hidden lg:flex items-center">
                    <div class="hero_shape shape_1">
                        <img :src="shape_1" alt="shape">
                    </div><!-- hero shape -->
                    <div class="hero_shape shape_2">
                        <img :src="shape_2" alt="shape">
                    </div><!-- hero shape -->
                    <div class="hero_shape shape_3">
                        <img :src="shape_3" alt="shape">
                    </div><!-- hero shape -->
                    <div class="hero_shape shape_4">
                        <img :src="shape_4" alt="shape">
                    </div><!-- hero shape -->
                    <div class="hero_shape shape_6">
                        <img :src="shape_1" alt="shape">
                    </div><!-- hero shape -->
                    <div class="hero_shape shape_7">
                        <img :src="shape_4" alt="shape">
                    </div><!-- hero shape -->
                    <div class="hero_shape shape_8">
                        <img :src="shape_3" alt="shape">
                    </div><!-- hero shape -->
                    <div class="hero_shape shape_9">
                        <img :src="shape_2" alt="shape">
                    </div><!-- hero shape -->
                    <div class="hero_shape shape_10">
                        <img :src="shape_4" alt="shape">
                    </div><!-- hero shape -->
                    <div class="hero_shape shape_11">
                        <img :src="shape_1" alt="shape">
                    </div><!-- hero shape -->
                    <div class="hero_shape shape_12">
                        <img :src="shape_2" alt="shape">
                    </div><!-- hero shape -->

                    <div class="container">
                        <div class="row">
                            <div class="w-full lg:w-1/2">
                                <div class="header_hero_content pt-150 lg:pt-0">
                                    <h2 class="hero_title text-2xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-extrabold">Routine Immunization Tracking System <span class="text-theme-color">RITS</span></h2>
                                    <p class="mt-8 lg:mr-8">This system is envisioned to act as an online registry for all children undergoing immnunization for routine vaccine. At the sametime, it will serve as the tracking for defaulter on specific antigen wherein the health workers and parents will be notified as of their schedule of immunization.</p>
                                    <p class="mt-8 lg:mr-8">The system development is requested as part of the completion requirements for DAP-MMC 29 Program. However, if found effective it will be utilized as one of the programs/system the DOH is implementing in partnership with LGU's.</p>
                                    <div class="hero_btn mt-10 lg:text-left max-md:text-center">
                                        <a class="main-btn" href="#" @click="handleLoginPage">Get Started</a>
                                        <!-- <a class="main-btn md:mx-8 page-scroll" href="#work">Track Baby</a> -->
                                        <!-- <CardBox is-form @submit.prevent="submit">
                                            <FormField>
                                            <input v-model="form.username" type="text" placeholder="Username" class="w-full rounded-md py-4 px-6 border border-solid border-body-color"/>
                                            </FormField>

                                            <FormField class="mt-5">
                                            <input v-model="form.password" type="password" placeholder="Password" class="w-full rounded-md py-4 px-6 border border-solid border-body-color">
                                            </FormField>

                                            <button type="submit" class="main-btn mt-5">Login</button>
                                        </CardBox> -->
                                    </div>
                                </div> <!-- header hero content -->
                            </div>
                        </div> <!-- row -->
                    </div> <!-- container -->
                    <div class="header_shape hidden lg:block"></div>
                    <div class="header_image flex items-center">
                        <div class="image 2xl:pl-25">
                            <!-- <img src="assets/images/header-image.svg" alt="Header Image"> -->
                            <img :src="baby_low" alt="Header Image">
                        </div>
                    </div> <!-- header image -->
                </div> <!-- header hero -->
            </section>
            <!--====== HEADER PART ENDS ======-->

            <section id="work" class="work_area bg-gray pt-20 pb-20">
                <div class="container">
                    <div class="row justify-center">
                        <div class="lg:w-3/4 w-full">
                            <div class="section_title text-center pb-6">
                                <h5 class="sub_title">Track</h5>
                                <h4 class="main_title">Find your Baby</h4>
                            </div> <!-- section title -->
                            <div class="w-full">
                                <div class="single_form mt-8">
                                    <FormControl :icon="mdiMagnifyExpand" placeholder="Track your baby here..." required/>
                                    <!-- <input name="name" id="name" type="text" placeholder="Search your baby here" class="w-full rounded-md py-4 px-6 border border-solid border-body-color"> -->
                                </div>
                            </div>
                            <div class="text-center">
                                <button type="button" class="main-btn mt-8" href="#" @click="handleTrackBaby">Track</button>
                            </div>
                        </div>
                    </div> <!-- row -->
                </div>
                <LayoutAuthenticated v-if="open_track_baby">
                    <SectionMain>
                        <CardBox class="mb-6" has-table>
                            <TableSearchBaby checkable />
                        </CardBox>
                    </SectionMain>
                </LayoutAuthenticated>
            </section>
            
            <!--====== SERVICES PART START ======-->
            <section class="services_area pt-120" id="about">
                <div class="container">
                    <div class="row justify-center">
                        <div class="w-full lg:w-1/2">
                            <div class="section_title text-center pb-6">
                                <h5 class="sub_title">About</h5>
                                <h4 class="main_title">Work Process</h4>
                            </div> <!-- section title -->
                        </div>
                    </div> <!-- row -->
                    <div class="row justify-center">
                        <div class="w-full sm:w-10/12 md:w-6/12 lg:w-4/12">
                            <div class="single_services text-center mt-8 mx-3">
                                <div class="services_icon">
                                    <i class="lni lni-write"></i>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="94" height="92" viewBox="0 0 94 92">
                                        <path class="services_shape" id="Polygon_12" data-name="Polygon 12" d="M42.212,2.315a11,11,0,0,1,9.576,0l28.138,13.6a11,11,0,0,1,5.938,7.465L92.83,54.018A11,11,0,0,1,90.717,63.3L71.22,87.842A11,11,0,0,1,62.607,92H31.393a11,11,0,0,1-8.613-4.158L3.283,63.3A11,11,0,0,1,1.17,54.018L8.136,23.383a11,11,0,0,1,5.938-7.465Z" />
                                    </svg>
                                </div>
                                <div class="services_content mt-5">
                                    <h3 class="services_title text-black font-semibold text-xl md:text-3xl">Create Client</h3>
                                    <p class="mt-4">Lorem ipsum dolor sit amet, consetetur sadi aliquyam erat, sed diam voluptua. At vero eos accusam et justo duo dolores </p>
                                </div>
                            </div> <!-- single services -->
                        </div>
                        <div class="w-full sm:w-10/12 md:w-6/12 lg:w-4/12">
                            <div class="single_services text-center mt-8 mx-3">
                                <div class="services_icon">
                                    <i class="lni lni-bulb"></i>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="94" height="92" viewBox="0 0 94 92">
                                        <path class="services_shape" id="Polygon_12" data-name="Polygon 12" d="M42.212,2.315a11,11,0,0,1,9.576,0l28.138,13.6a11,11,0,0,1,5.938,7.465L92.83,54.018A11,11,0,0,1,90.717,63.3L71.22,87.842A11,11,0,0,1,62.607,92H31.393a11,11,0,0,1-8.613-4.158L3.283,63.3A11,11,0,0,1,1.17,54.018L8.136,23.383a11,11,0,0,1,5.938-7.465Z" />
                                    </svg>
                                </div>
                                <div class="services_content mt-5">
                                    <h3 class="services_title text-black font-semibold text-xl md:text-3xl">Vaccinate Client</h3>
                                    <p class="mt-4">Lorem ipsum dolor sit amet, consetetur sadi aliquyam erat, sed diam voluptua. At vero eos accusam et justo duo dolores </p>
                                </div>
                            </div> <!-- single services -->
                        </div>
                        <div class="w-full sm:w-10/12 md:w-6/12 lg:w-4/12">
                            <div class="single_services text-center mt-8 mx-3">
                                <div class="services_icon">
                                    <i class="lni lni-checkmark-circle"></i>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="94" height="92" viewBox="0 0 94 92">
                                        <path class="services_shape" id="Polygon_12" data-name="Polygon 12" d="M42.212,2.315a11,11,0,0,1,9.576,0l28.138,13.6a11,11,0,0,1,5.938,7.465L92.83,54.018A11,11,0,0,1,90.717,63.3L71.22,87.842A11,11,0,0,1,62.607,92H31.393a11,11,0,0,1-8.613-4.158L3.283,63.3A11,11,0,0,1,1.17,54.018L8.136,23.383a11,11,0,0,1,5.938-7.465Z" />
                                    </svg>
                                </div>
                                <div class="services_content mt-5">
                                    <h3 class="services_title text-black font-semibold text-xl md:text-3xl">Text Client</h3>
                                    <p class="mt-4">Lorem ipsum dolor sit amet, consetetur sadi aliquyam erat, sed diam voluptua. At vero eos accusam et justo duo dolores </p>
                                </div>
                            </div> <!-- single services -->
                        </div>
                    </div> <!-- row -->
                </div> <!-- container -->
            </section>
            <!--====== SERVICES PART ENDS ======-->

            <!--====== ABOUT PART START ======-->
            <section id="why" class="about_area pt-120 relative">
                <div class="about_image flex items-end justify-end">
                    <div class="image lg:pr-13">
                        <img :src="about" alt="about">
                    </div>
                </div> <!-- about image -->
                <div class="container">
                    <div class="row justify-end">
                        <div class="w-full lg:w-1/2">
                            <div class="about_content mx-4 pt-11 lg:pt-15 lg:pb-15">
                                <div class="section_title pb-9">
                                    <h5 class="sub_title">Our Vision</h5>
                                    <h4 class="main_title">This is Our Goal Achievement</h4>
                                </div> <!-- section title -->
                                <p>Nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua. At vero eos et accusam et justo duo dolores et rebum. Stet clita kasd gubergren, no sea takimata sanctus. </p>
                                <ul class="about_list pt-3">
                                    <li class="flex mt-5">
                                        <div class="about_check">
                                            <i class="lni lni-checkmark-circle"></i>
                                        </div>
                                        <div class="about_list_content pl-5 pr-2">
                                            <p>Vero eos et accusam et justo duo dolores et rebum. Stet clita kasd gubergrenv</p>
                                        </div>
                                    </li>
                                    <li class="flex mt-5">
                                        <div class="about_check">
                                            <i class="lni lni-checkmark-circle"></i>
                                        </div>
                                        <div class="about_list_content pl-5 pr-2">
                                            <p>At vero eos et accusam et justo duo dolores et rebum. Stet clita kasd gubergrenv</p>
                                        </div>
                                    </li>
                                    <li class="flex mt-5">
                                        <div class="about_check">
                                            <i class="lni lni-checkmark-circle"></i>
                                        </div>
                                        <div class="about_list_content pl-5 pr-2">
                                            <p>Dvero eos et accusam et justo duo dolores et rebum. Stet clita kasd gubergrenv</p>
                                        </div>
                                    </li>
                                </ul>
                            </div> <!-- about content -->
                        </div>
                    </div> <!-- row -->
                </div> <!-- container -->
            </section>
            <!--====== ABOUT PART ENDS ======-->

            <!--====== SERVICES PART START ======-->
            <section id="services" class="services_area pt-120 pb-120">
                <div class="container">
                    <div class="row justify-center">
                        <div class="w-full lg:w-1/2">
                            <div class="section_title text-center pb-6">
                                <h5 class="sub_title">What We Do</h5>
                                <h4 class="main_title">Our Services</h4>
                            </div> <!-- section title -->
                        </div>
                    </div> <!-- row -->
                    <div class="row justify-center">
                        <div class="w-full sm:w-10/12 md:w-6/12 lg:w-4/12">
                            <div class="single_services text-center mt-8 mx-3">
                                <div class="services_icon">
                                    <i class="lni lni-layout"></i>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="94" height="92" viewBox="0 0 94 92">
                                        <path class="services_shape" id="Polygon_12" data-name="Polygon 12" d="M42.212,2.315a11,11,0,0,1,9.576,0l28.138,13.6a11,11,0,0,1,5.938,7.465L92.83,54.018A11,11,0,0,1,90.717,63.3L71.22,87.842A11,11,0,0,1,62.607,92H31.393a11,11,0,0,1-8.613-4.158L3.283,63.3A11,11,0,0,1,1.17,54.018L8.136,23.383a11,11,0,0,1,5.938-7.465Z" />
                                    </svg>
                                </div>
                                <div class="services_content mt-5 xl:mt-10">
                                    <h3 class="services_title text-black font-semibold text-xl md:text-2xl lg:text-xl xl:text-3xl">Web Design</h3>
                                    <p class="mt-4">Lorem ipsum dolor sit amet, consetetur sadi aliquyam erat, sed diam voluptua. At vero eos accusam et justo duo dolores </p>
                                </div>
                            </div> <!-- single services -->
                        </div>

                        <div class="w-full sm:w-10/12 md:w-6/12 lg:w-4/12">
                            <div class="single_services text-center mt-8 mx-3">
                                <div class="services_icon">
                                    <i class="lni lni-bullhorn"></i>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="94" height="92" viewBox="0 0 94 92">
                                        <path class="services_shape" id="Polygon_12" data-name="Polygon 12" d="M42.212,2.315a11,11,0,0,1,9.576,0l28.138,13.6a11,11,0,0,1,5.938,7.465L92.83,54.018A11,11,0,0,1,90.717,63.3L71.22,87.842A11,11,0,0,1,62.607,92H31.393a11,11,0,0,1-8.613-4.158L3.283,63.3A11,11,0,0,1,1.17,54.018L8.136,23.383a11,11,0,0,1,5.938-7.465Z" />
                                    </svg>
                                </div>
                                <div class="services_content mt-5 xl:mt-10">
                                    <h3 class="services_title text-black font-semibold text-xl md:text-2xl lg:text-xl xl:text-3xl">Digital Marketing</h3>
                                    <p class="mt-4">Lorem ipsum dolor sit amet, consetetur sadi aliquyam erat, sed diam voluptua. At vero eos accusam et justo duo dolores </p>
                                </div>
                            </div> <!-- single services -->
                        </div>

                        <div class="w-full sm:w-10/12 md:w-6/12 lg:w-4/12">
                            <div class="single_services text-center mt-8 mx-3">
                                <div class="services_icon">
                                    <i class="lni lni-mobile"></i>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="94" height="92" viewBox="0 0 94 92">
                                        <path class="services_shape" id="Polygon_12" data-name="Polygon 12" d="M42.212,2.315a11,11,0,0,1,9.576,0l28.138,13.6a11,11,0,0,1,5.938,7.465L92.83,54.018A11,11,0,0,1,90.717,63.3L71.22,87.842A11,11,0,0,1,62.607,92H31.393a11,11,0,0,1-8.613-4.158L3.283,63.3A11,11,0,0,1,1.17,54.018L8.136,23.383a11,11,0,0,1,5.938-7.465Z" />
                                    </svg>
                                </div>
                                <div class="services_content mt-5 xl:mt-10">
                                    <h3 class="services_title text-black font-semibold text-xl md:text-2xl lg:text-xl xl:text-3xl">Mobile Apps</h3>
                                    <p class="mt-4">Lorem ipsum dolor sit amet, consetetur sadi aliquyam erat, sed diam voluptua. At vero eos accusam et justo duo dolores </p>
                                </div>
                            </div> <!-- single services -->
                        </div>

                        <div class="w-full sm:w-10/12 md:w-6/12 lg:w-4/12">
                            <div class="single_services text-center mt-8 mx-3">
                                <div class="services_icon">
                                    <i class="lni lni-seo"></i>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="94" height="92" viewBox="0 0 94 92">
                                        <path class="services_shape" id="Polygon_12" data-name="Polygon 12" d="M42.212,2.315a11,11,0,0,1,9.576,0l28.138,13.6a11,11,0,0,1,5.938,7.465L92.83,54.018A11,11,0,0,1,90.717,63.3L71.22,87.842A11,11,0,0,1,62.607,92H31.393a11,11,0,0,1-8.613-4.158L3.283,63.3A11,11,0,0,1,1.17,54.018L8.136,23.383a11,11,0,0,1,5.938-7.465Z" />
                                    </svg>
                                </div>
                                <div class="services_content mt-5 xl:mt-10">
                                    <h3 class="services_title text-black font-semibold text-xl md:text-2xl lg:text-xl xl:text-3xl">SEO Consultancy</h3>
                                    <p class="mt-4">Lorem ipsum dolor sit amet, consetetur sadi aliquyam erat, sed diam voluptua. At vero eos accusam et justo duo dolores </p>
                                </div>
                            </div> <!-- single services -->
                        </div>

                        <div class="w-full sm:w-10/12 md:w-6/12 lg:w-4/12">
                            <div class="single_services text-center mt-8 mx-3">
                                <div class="services_icon">
                                    <i class="lni lni-layers"></i>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="94" height="92" viewBox="0 0 94 92">
                                        <path class="services_shape" id="Polygon_12" data-name="Polygon 12" d="M42.212,2.315a11,11,0,0,1,9.576,0l28.138,13.6a11,11,0,0,1,5.938,7.465L92.83,54.018A11,11,0,0,1,90.717,63.3L71.22,87.842A11,11,0,0,1,62.607,92H31.393a11,11,0,0,1-8.613-4.158L3.283,63.3A11,11,0,0,1,1.17,54.018L8.136,23.383a11,11,0,0,1,5.938-7.465Z" />
                                    </svg>
                                </div>
                                <div class="services_content mt-5 xl:mt-10">
                                    <h3 class="services_title text-black font-semibold text-xl md:text-2xl lg:text-xl xl:text-3xl">Graphic Design</h3>
                                    <p class="mt-4">Lorem ipsum dolor sit amet, consetetur sadi aliquyam erat, sed diam voluptua. At vero eos accusam et justo duo dolores </p>
                                </div>
                            </div> <!-- single services -->
                        </div>

                        <div class="w-full sm:w-10/12 md:w-6/12 lg:w-4/12">
                            <div class="single_services text-center mt-8 mx-3">
                                <div class="services_icon">
                                    <i class="lni lni-briefcase"></i>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="94" height="92" viewBox="0 0 94 92">
                                        <path class="services_shape" id="Polygon_12" data-name="Polygon 12" d="M42.212,2.315a11,11,0,0,1,9.576,0l28.138,13.6a11,11,0,0,1,5.938,7.465L92.83,54.018A11,11,0,0,1,90.717,63.3L71.22,87.842A11,11,0,0,1,62.607,92H31.393a11,11,0,0,1-8.613-4.158L3.283,63.3A11,11,0,0,1,1.17,54.018L8.136,23.383a11,11,0,0,1,5.938-7.465Z" />
                                    </svg>
                                </div>
                                <div class="services_content mt-5 xl:mt-10">
                                    <h3 class="services_title text-black font-semibold text-xl md:text-2xl lg:text-xl xl:text-3xl">Business Consultancy</h3>
                                    <p class="mt-4">Lorem ipsum dolor sit amet, consetetur sadi aliquyam erat, sed diam voluptua. At vero eos accusam et justo duo dolores </p>
                                </div>
                            </div> <!-- single services -->
                        </div>
                    </div> <!-- row -->
                </div> <!-- container -->
            </section>

            <!--====== CONTACT PART START ======-->

            <section id="contact" class="contact_area relative pt-18 pb-120">
                <div class="contact_image flex items-center justify-end">
                    <div class="image lg:pr-13">
                        <img :src="contact" alt="about">
                    </div>
                </div> <!-- about image -->
                
                <div class="container">
                    <div class="row justify-end">
                        <div class="w-full lg:w-1/2">
                            <div class="contact_wrapper mt-11">
                                <div class="section_title pb-4">
                                    <h5 class="sub_title">Contact</h5>
                                    <h4 class="main_title">Get In Touch</h4>
                                    <p>Lorem ipsum dolor sitrg amet, consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna.</p>
                                </div> <!-- section title -->
                                
                                <div class="contact_form">
                                    <form id="contact-form" action="" method="POST">
                                        <div class="row">
                                            <div class="w-full md:w-1/2">
                                                <div class="mx-3">
                                                    <div class="single_form mt-8">
                                                        <input name="name" id="name" type="text" placeholder="Name" class="w-full rounded-md py-4 px-6 border border-solid border-body-color">
                                                    </div> <!-- single form -->
                                                </div>
                                            </div>
                                            <div class="w-full md:w-1/2">
                                                <div class="mx-3">
                                                    <div class="single_form mt-8">
                                                        <input name="email" id="email" type="email" placeholder="Email" class="w-full rounded-md py-4 px-6 border border-solid border-body-color">
                                                    </div> <!-- single form -->
                                                </div>
                                            </div>
                                            <div class="w-full">
                                                <div class="mx-3">
                                                    <div class="single_form mt-8">
                                                        <textarea name="message" id="message" placeholder="Message" rows="5" class="w-full rounded-md py-4 px-6 border border-solid border-body-color resize-none"></textarea>
                                                    </div> <!-- single form -->
                                                </div>
                                            </div>
                                            <p class="form-message mx-3"></p>
                                            <div class="w-full">
                                                <div class="mx-3">
                                                    <div class="single_form mt-8">
                                                        <button type="submit" class="main-btn contact-btn">Submit</button>
                                                    </div> <!-- single form -->
                                                </div>
                                            </div>
                                        </div> <!-- row -->
                                    </form>
                                </div> <!-- contact form -->
                            </div> <!-- contact wrapper -->
                        </div>
                    </div> <!-- row -->
                </div> <!-- container -->
            </section>

            <!--====== CONTACT PART ENDS ======-->

            <!--====== FOOTER PART START ======-->

            <footer id="footer" class="footer_area bg-black relative z-10">
                <div class="shape absolute left-0 top-0 opacity-5 h-full overflow-hidden w-1/3">
                    <img :src="footer_shape_left" alt="">
                </div>
                <div class="shape absolute right-0 top-0 opacity-5 h-full overflow-hidden w-1/3">
                    <img :src="footer_shape_right" alt="">
                </div>
                <div class="container">
                    <div class="footer_widget pt-18 pb-120">
                        <div class="row justify-center">
                            <div class="w-full md:w-1/2 lg:w-3/12">
                                <div class="footer_about mt-13 mx-3">
                                    <div class="footer_logo">
                                        <a href="#" style="display: flex;">
                                            <img :src="doh_logo" alt="" style="width: 50px;">
                                            <b style="margin-left: 10px;margin-top: 15px;color: white;">RITS</b>
                                        </a>
                                    </div>
                                    <div class="footer_content mt-8">
                                        <p class="text-white">Lorem ipsum dolor sitco nsetetu nonumy eirmod tempor invidunt ut labore et dolore magna uyam erat, sed diam.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="w-full md:w-1/2 lg:w-5/12">
                                <div class="footer_link_wrapper flex flex-wrap mx-3">
                                    <div class="footer_link w-1/2 md:pl-13 mt-13">
                                        <h2 class="footer_title text-xl font-semibold text-white">Quick Links</h2>
                                        <ul class="link pt-4">
                                            <li><a href="#" class="text-white mt-4 hover:text-theme-color">Company</a></li>
                                            <li><a href="#" class="text-white mt-4 hover:text-theme-color">Privacy Policy</a></li>
                                            <li><a href="#" class="text-white mt-4 hover:text-theme-color">About</a></li>
                                        </ul>
                                    </div> 
                                    <div class="footer_link w-1/2 md:pl-13 mt-13">
                                        <h2 class="footer_title text-xl font-semibold text-white">Resources</h2>
                                        <ul class="link pt-4">
                                            <li><a href="#" class="text-white mt-4 hover:text-theme-color">Support</a></li>
                                            <li><a href="#" class="text-white mt-4 hover:text-theme-color">Contact</a></li>
                                            <li><a href="#" class="text-white mt-4 hover:text-theme-color">Terms</a></li>
                                        </ul>
                                    </div> 
                                </div> 
                            </div>
                            <!-- <div class="w-full md:w-2/3 lg:w-4/12">
                                <div class="footer_subscribe mt-13 mx-3">
                                    <h2 class="footer_title text-xl font-semibold text-white">Newsletter</h2>
                                    <div class="subscribe_form text-right mt-9 relative">
                                        <form action="#">
                                            <input type="text" placeholder="Enter email" class="w-full py-5 px-6 bg-white text-black rounded-full border-none">
                                            <button class="main-btn subscribe-btn">Subscribe</button>
                                        </form>
                                    </div>
                                </div> 
                            </div> -->
                        </div> 
                    </div> 
                    <div class="footer_copyright pt-3 pb-6 border-t-2 border-solid border-white border-opacity-10 sm:flex justify-between">
                        <div class="footer_social pt-4 mx-3 text-center">
                            <ul class="social flex justify-center sm:justify-start">
                                <li class="mr-3"><a href="https://facebook.com/uideckHQ"><i class="lni lni-facebook-filled"></i></a></li>
                                <li class="mr-3"><a href="https://twitter.com/uideckHQ"><i class="lni lni-twitter-filled"></i></a></li>
                                <li class="mr-3"><a href="https://instagram.com/uideckHQ"><i class="lni lni-instagram-original"></i></a></li>
                                <li class="mr-3"><a href="#"><i class="lni lni-linkedin-original"></i></a></li>
                            </ul>
                        </div> 
                        <div class="footer_copyright_content pt-4 text-center">
                            <p class="text-white">Designed and Developed by <a href="#" rel="nofollow" class="text-white hover:text-theme-color">DOH CVCHD ICTU</a></p>
                        </div> 
                    </div> 
                </div> 
            </footer>
            <a href="#" class="scroll-top"><i class="lni lni-chevron-up"></i></a>
        </body>
    </html>
    
</template>

<style scoped>
    @import '@/assets/login/assets/css/animate.css';
    /* @import '@/assets/login/assets/css/tiny-slider.css'; */
    @import '@/assets/login/assets/fonts/lineicons/font-css/LineIcons.css';
    @import '@/assets/login/assets/css/tailwindcss.css';
    #navbarSupportedContent1 {
        background-color: red !important;
    }
</style>