<template>
  <div  v-loading="loading">
    <div class="flex center">
      <noaction-course-list></noaction-course-list>
    </div>
    <div style="width:95%; margin:10px auto">
      <lkt-table :data="appointRecords">
        <el-table-column fixed="left" width="100" label="预约人" prop="applicant.name" sortable ></el-table-column>
        <el-table-column label="角色" width="100" prop="applicant.role" sortable ></el-table-column>
        <el-table-column label="申请时间" width="100" prop="createDt" sortable ></el-table-column>
        <el-table-column label="类型" width="100">
          <span slot-scope="{ row }">
            {{(row.type===1? '授课预约':'')+(row.type===2? '个人预约':'')}}
          </span>
        </el-table-column>
        <el-table-column label="预约时间" width="120" prop="startDt" sortable ></el-table-column>
        <el-table-column label="课程" width="120" prop="course.name" sortable ></el-table-column>
        <el-table-column label="实验项目" width="120" prop="program.name" sortable ></el-table-column>    
        <el-table-column label="指定教师" width="100" prop="teacher.name" sortable></el-table-column>
        <el-table-column label="参与人" width="100" prop="students" sortable></el-table-column>
        <el-table-column label="审核结果" fixed="right" width="100" sortable>
          <div slot-scope="{row}">
            <el-tag v-if="row.result === 0" type="warning">未审核</el-tag>
            <el-tag v-if="row.result === 1" type="success">已同意</el-tag>
            <el-tag v-if="row.result === 2" type="danger">已拒绝</el-tag>
            <el-tag v-if="row.result === 3" type="info">申请撤销</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" sortable min-width="150">
          <div class="flex center little-space" slot-scope="{ row }" >
          <el-button type="primary" size="mini" :disabled="row.result === 0? false: true" @click="agreeAppoint(row)">同意</el-button>
          <el-button type="danger" size="mini" :disabled="row.result === 0? false: true" @click="disagreeAppoint(row)">拒绝</el-button>
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
import noactionCourseList from '../../components/noaction-courstList.vue';
import {AppointList, AppointOperate} from '@/dao/appointRecordDao';
export default createComponent({
  components: { noactionCourseList },
  setup() {
    const loading = ref(false);
    const appointRecords = ref<any>();
    const query = async () => {
      appointRecords.value = await AppointList({});
      console.log(appointRecords.value);
    };
    const agreeAppoint = async (row: any) => {
      await AppointOperate({
        id: row.id,
        result: 1,
      });
      Message.success('已同意申请');
      await query();
    };
    const disagreeAppoint = async (row: any) => {
      await AppointOperate({
        id: row.id,
        result: 2,
      });
      Message.success('已拒绝申请');
      await query();
    };
    onMounted(useLoading(loading, async () => {
      await query();
    }));
    return{
    loading, appointRecords, query,
    agreeAppoint,
    disagreeAppoint: useConfirm('确认拒绝？', useLoading(loading, disagreeAppoint)),
    };
  },
});
</script>
<style scoped lang="scss">

</style>