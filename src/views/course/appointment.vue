<template>
    <div v-loading="loading" class="appointment">
      <div class="flex center" style="margin-bottom:20px">
        <el-button :type="courseButton ? 'primary' : ''" @click="showCourse()">查看课表</el-button>
        <el-button :type="appointButton ? 'primary' : ''" style="margin-left:5px" @click="showAppoint()">申请记录</el-button>
      </div>
      <div v-if="courseButton" class="flex center">
        <noaction-course-list></noaction-course-list>
      </div>
      <div v-if="appointButton">
        <el-button type="primary">预约</el-button>
        <el-form :inline="true" class="flex start wrap">
          <el-form-item label="预约类型:" label-width="80px">
            <el-select multiple collapse-tags :clearable="false" placeholder="请选择预约类型" style="width:200px"></el-select>
          </el-form-item>
          <el-form-item label="预约结果:" label-width="80px">
            <el-select multiple collapse-tags :clearable="false" placeholder="请选择预约结果" style="width:195px"></el-select>
          </el-form-item>
          <el-form-item label="申请时间:" label-width="80px">
            <lkt-date-picker></lkt-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <el-form class="flex end">
          <el-input placeholder="输入搜索：" style="width:400px"></el-input>
        </el-form>
      </div>
    </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted, createComponent } from '@vue/composition-api';
import noactionCourseList from '../../components/noaction-courstList.vue';
export default createComponent({
  components: {noactionCourseList},
  setup() {
    const loading = ref(false);
    const courseButton = ref(true);
    const appointButton = ref(false);
    const showCourse = async () => {
      courseButton.value = true;
      appointButton.value = false;
    };
    const showAppoint = async () => {
      courseButton.value = false;
      appointButton.value = true;
    };
    return {
      loading, courseButton, appointButton, showCourse, showAppoint,
    };
  }
});
</script>
<style scoped lang="scss">

</style>