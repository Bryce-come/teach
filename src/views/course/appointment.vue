<template>
    <div v-loading="loading" class="appointment">
      <div class="flex center" style="margin-bottom:20px">
        <el-button :type="courseButton ? 'primary' : ''" style="width:150px" @click="showCourse()">查看课表</el-button>
        <el-button :type="appointButton ? 'primary' : ''" style="width:150px;margin-left:5px" @click="showAppoint()">申请记录</el-button>
      </div>
      <div v-if="courseButton" class="flex center">
        <noaction-course-list></noaction-course-list>
      </div>
      <div v-if="appointButton">
        <el-form :inline="true" class="flex start wrap">
          <el-form-item label="申请时间:" label-width="80px">
            <lkt-date-picker v-model="appointDt.datetimeRange"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryAppointRecordList()">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success">预约实验室</el-button>
          </el-form-item>
        </el-form>
        <!-- <el-form class="flex end">
            <el-input placeholder="输入搜索：" style="width:450px;margin:10px"></el-input>
        </el-form> -->
        <lkt-table
          :data="appointRecordList"
          style="width:100%">
          <el-table-column type="expand">
          <div slot-scope="props" class="flex start">
            <el-form label-width="100px">
              <el-form-item label="预约课程：">{{props.row.course}}</el-form-item>
              <el-form-item label="预约实验：">{{props.row.program.name}}</el-form-item>
              <el-form-item label="指定教师：">{{props.row.teacher.name}}</el-form-item>
              <el-form-item label="参与人：">{{props.row.students.length > 0 ? props.row.students : props.row.clasz?  props.row.clasz.name + '-' + props.row.claszGroup.name : '无'}}</el-form-item>
              <el-form-item label="处理人：">{{props.row.operator.name}}</el-form-item>
              <el-form-item label="处理时间：">{{props.row.handleDt}}</el-form-item>
            </el-form>
          </div>
        </el-table-column>
        <el-table-column label="预约人" prop="applicant.name" width="80"></el-table-column>
        <el-table-column label="角色" width="80" prop="applicant.role"></el-table-column>
        <el-table-column label="申请时间" width="160" prop="createDt" sortable align="center"></el-table-column>
        <el-table-column label="预约类型" width="100">
          <span slot-scope="{ row }">
            {{(row.type===1? '授课预约':'')+(row.type===2? '个人预约':'')}}
          </span>
        </el-table-column>
        <el-table-column label="预约课时" prop=""></el-table-column>
        <el-table-column label="开始时间" width="160" prop="startDt" align="center"></el-table-column>
        <el-table-column label="结束时间" width="160" prop="endDt" align="center"></el-table-column>
        <el-table-column label="审核结果" fixed="right" width="100">
          <div slot-scope="{row}">
            <el-tag v-if="row.result === 0" type="warning">未审核</el-tag>
            <el-tag v-if="row.result === 1" type="success">已同意</el-tag>
            <el-tag v-if="row.result === 2" type="danger">已拒绝</el-tag>
            <el-tag v-if="row.result === 3" type="info">申请撤销</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" min-width="150">
          <div class="flex center little-space" slot-scope="{row}">
            <el-button type="warning" size="mini" :disabled="row.result === 0? false: true">修改</el-button>
            <el-button type="danger" size="mini" :disabled="row.result === 0? false: true" @click="revokeAppoint(row)">撤销</el-button>
          </div>
        </el-table-column>
        </lkt-table>
      </div>
    </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted, createComponent } from '@vue/composition-api';
import { Message } from 'element-ui';
import noactionCourseList from '../../components/noaction-courstList.vue';
import { AppointListMine, AppointAdd, AppointUpdate, AppointOperate} from '@/dao/appointRecordDao';
import { useLoading, useConfirm } from 'web-toolkit/src/service';
export default createComponent({
  components: {noactionCourseList},
  setup() {
    const loading = ref(false);
    const courseButton = ref(true);
    const appointButton = ref(false);
    const appointRecordList = ref<any>([]);
    const appointDt = ref({
      datetimeRange: [new Date(Date.now() - 3 * 24 * 3600000), new Date()],
    });
    const showCourse = async () => {
      courseButton.value = true;
      appointButton.value = false;
    };
    const showAppoint = async () => {
      courseButton.value = false;
      appointButton.value = true;
    };
    const queryAppointRecordList = async () => {
      appointRecordList.value = await AppointListMine({
        start: appointDt.value.datetimeRange && appointDt.value.datetimeRange[0] && appointDt.value.datetimeRange[0].getTime(),
        end: appointDt.value.datetimeRange && appointDt.value.datetimeRange[1] && appointDt.value.datetimeRange[1].getTime(),
      });
      console.log(appointRecordList.value);
    };
    const revokeAppoint = async (row: any) => {
      await AppointOperate({
        id: row.id,
        result: 3,
      });
      Message.success('已撤销预约申请');
      await queryAppointRecordList();
    };
    onMounted(useLoading(loading, async () => {
      await queryAppointRecordList();
    }));
    return {
      loading, courseButton, appointButton, showCourse, showAppoint,
      appointRecordList, appointDt, queryAppointRecordList,
      revokeAppoint: useConfirm('确认撤销预约申请？', useLoading(loading, revokeAppoint)),
    };
  }
});
</script>
<style scoped lang="scss">

</style>