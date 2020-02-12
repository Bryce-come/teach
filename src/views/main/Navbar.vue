<template>
  <div class="header theme flex between">
    <div class="brand flex column align-center" style="color: white">
      <img :src="loginLogo" style="height: 23px; margin: 3px 0" />
      <span>{{loginTitle2}}</span>
<!--      <div class="flex column align-center" style="color: white">-->
<!--        <span>{{loginTitle1}}</span>-->
<!--      </div>-->
    </div>
    <div class="header-menu-wrapper flex center">
    </div>
    <lkt-header-side class="header-side"/>
  </div>
</template>
<script lang="ts">
import LktHeaderSide from './header-side.vue';
import LktMenu from './Menu.vue';
import {loginTitle1, loginTitle2, loginLogo} from '@/config';
export default {
    components: {
      LktHeaderSide, LktMenu,
    },
    setup() {
      return{
        loginTitle2, loginTitle1, loginLogo,
      };
    },
};
</script>
<style scoped lang="scss">
  .brand{
    height: 60px;
    width: 200px;
    color: $header-title-font;
    font-weight: 600;
    cursor: default;
    background-color: $header-title;
    &.vertical {
      border-color: transparent;
    }
  }
  .header {
    background-color: $background-main;
    min-width: 800px;
    height: 60px;
    &.horizontal > * {
      background-color: $header-title;
      border: none;
    }
    .header-menu-wrapper{
      border-bottom: 1px solid $grey-4;
      width: calc(100vw - 200px - 30vw);
      background-color: white;
    }
    .header-side{
      width: 30vw;
      border-bottom: 1px solid $grey-4;
      background-color: white;
    }
  }
</style>
