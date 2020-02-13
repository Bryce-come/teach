<template>
  <div v-loading='loading'>
    <div class="flex end">
        <el-input class="search-bar" clearable v-model="keywords" placeholder="请输入搜索课程" style="width: 40%"/>
    </div>
    <div class="flex center" style="margin: 5px 10px">
        <div class="flex align-center" style="margin-right: 10px">
             <el-select v-model="oneTerm" placeholder="请选择学期">
               <el-option 
                 v-for="item in terms"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value"
               ></el-option>
             </el-select>
        </div>
        <div class="flex align-center" style="margin: 0 10px ">
            <span style="margin-right: 10px">第</span>
            <el-input-number v-model="weeks" controls-position="right" :min="1"/>
            <span style="margin-left: 10px">周</span>    
            <el-button style="margin-left: 10px" type="primary" @click="list()">查询</el-button>        
        </div>
    </div>
    <div class="flex center">
      <course-list></course-list>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted, createComponent } from '@vue/composition-api';
import { useLoading, useSearch } from 'web-toolkit/src/service';
import courseList from './course-component/courseList.vue';
export default createComponent({
  components: { courseList },
  setup() {
    const loading = ref(false);
    const keywords = ref([]);
    const oneTerm = ref();
    // 学期选择列表
    const terms = ref({});
    const weeks = ref(1);
    // 查询函数
    async function list() {};
    return{
      loading,
      keywords,
      oneTerm,
      terms,
      weeks,
      list: useLoading(loading, list),
    };
  },
});
</script>
<style scoped lang="scss">

</style>