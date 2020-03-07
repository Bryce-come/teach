<template>
  <div>
    <div class="flex">
      <div class="title" v-for="i in titles" :key="i"></div>
    </div>
    <div class="flex">
      <div class="flex column">
        <div class="title" v-for="i in titleLeft" :key="i"></div>
      </div>
      <div class="flex column" v-for="i in content" :key="i">
        <div
          class="content"
          v-for="ii in titleLeft"
          v-if="ii!==2"
          :style="{height: ii===1?'40px':'20px'}"
          :key="ii" >{{i+'-'+ ii}}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {ref, Ref, onMounted, createComponent} from '@vue/composition-api';
export default {
  setup() {
    const titles = ref<any>([]);
    const titleLeft = ref<any>([]);
    const content = ref<any>([]);
    onMounted(() => {
      for (let i = 0; i < 8; i++) { titles.value.push(i); }
      for (let i = 0; i < 7; i++) { content.value.push(i); }
      for (let i = 0; i < 12; i++) { titleLeft.value.push(i); }
    });
    return{
      titles, titleLeft, content,
    };
  },
};
</script>
<style lang="scss" scoped>
  .title{
    border: 1px solid black;
    width: 100px;
    height: 20px;
    background-color: #00aaee;
  }
  .content{
    border: 1px solid black;
    width: 100px;
    height: 20px;
    text-align: center;
  }
</style>
