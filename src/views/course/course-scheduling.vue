<template>
  <div v-loading='loading'>
    <div class="flex end">
        <el-input class="search-bar" clearable v-model="keywords" placeholder="请输入搜索课程" style="width: 40%"/>
    </div>
    <div class="flex center" style="margin: 5px 10px">
        <div class="flex align-center" style="margin-right: 10px">
         <span>请输入要查询的日期：</span>
         <lkt-date-picker v-model="oneDay" type="datetime" format="yyyy-MM-dd HH:mm" :clearable="false"/>
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
import courseList from '../../components/courseList.vue';
export default createComponent({
  components: { courseList },
  setup() {
    const loading = ref(false);
    const keywords = ref([]);
    const oneTerm = ref();
    // 学期选择列表
    const terms = ref({});
    const oneDay = ref();
    // 查询函数
    async function list() {};
    return{
      loading,
      keywords,
      oneDay: new Date,
      list: useLoading(loading, list),
    };
  },
});
</script>
<style scoped lang="scss">

</style>