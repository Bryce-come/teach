<template>
  <div>
    <div class="flex center">
      <course-list/>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, onMounted, createComponent } from '@vue/composition-api';
import courseList from '../../components/courseList.vue';
export default createComponent({
  components: { courseList },
  setup() {
    return{};
  },
});
</script>
<style scoped lang="scss">

</style>
