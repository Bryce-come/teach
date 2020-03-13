<template>
  <div v-loading='loading'>
    <div class="flex center">
      <course-list/>
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
    return{
      loading,
      keywords,
    };
  },
});
</script>
<style scoped lang="scss">

</style>
