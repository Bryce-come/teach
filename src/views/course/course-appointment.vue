<template>
  <div  v-loading="loading">
    <div class="flex center">
      <course-list></course-list>
    </div>
    <div style="width:95%; margin:10px auto">
      <lkt-table :data="appointRecords">
        <el-table-column label="预约人" prop="applicant.name" sortable ></el-table-column>
        <el-table-column label="角色" prop="applicant.role" sortable ></el-table-column>
        <el-table-column label="申请时间" prop="createDt" sortable ></el-table-column>
        <el-table-column label="类型" sortable >
          <span slot-scope="{ row }">
            {{(row.type===1? '授课预约':'')+(row.type===2? '个人预约':'')}}
          </span>
        </el-table-column>
        <el-table-column label="预约时间" prop="start" sortable ></el-table-column>
        <el-table-column label="课程" prop="course.name" sortable ></el-table-column>
        <el-table-column label="实验项目" prop="course.programList" sortable ></el-table-column>    
        <el-table-column label="指定教师" prop="teacher.name" sortable></el-table-column>
        <el-table-column label="参与人" prop="students" sortable></el-table-column>
        <el-table-column label="操作" align="center" sortable min-width="150">
          <div class="flex center little-space" slot-scope="{ row }" >
          <el-button type="primary" size="mini" @click="agree(row)">同意</el-button>
          <el-button type="danger" size="mini" @click="remove(row)">拒绝</el-button>
        </div>
        </el-table-column>   
      </lkt-table>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted, createComponent } from '@vue/composition-api';
import {useSearch, useLoading, useConfirm} from 'web-toolkit/src/service';
import { Message } from 'element-ui';
import courseList from '../../components/courseList.vue';
export default createComponent({
  components: { courseList },
  setup() {
    const loading = ref(false);
    const appointRecords = ref<any>();
    const query = async () => {
      appointRecords.value = [{
        id: 1,
        applicant: {
          name: '王涵',
          role: '教师',
        },
        createDt: '2020-01-02',
        type: 1,
        start: '2020-01-02',
        course: {
          name: '自动化课程',
          programList: ['切刀挂刀操作'],
        },
        teacher: {
          name: '王涵',
        },
        stationList: '',
      },
      {
        id: 2,
        applicant: {
          name: 'mmei涵',
          role: '教师',
        },
        createDt: '2020-01-02',
        type: 1,
        start: '2020-01-02',
        course: {
          name: '自动化课程',
          programList: ['切刀挂刀操作'],
        },
        teacher: {
          name: '王涵',
        },
        students: '',
      }];
    };
    const agree = async (row: any) => {
      Message.success('已同意');
    };
    const remove = async (row: any) => {
      Message.success('删除成功');
    };
    onMounted(useLoading(loading, async () => {
      await query();
    }));
    return{
    appointRecords,
    loading,
    query,
    agree,
    remove: useConfirm('确认删除？', useLoading(loading, remove)),
    };
  },
});
</script>
<style scoped lang="scss">

</style>