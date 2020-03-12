<template>
  <div  v-loading="loading">
    <div style="width:100%;margin:20px auto">
      <div class="flex align-center" style="margin: 5px 0">
        <div class="flex align-center">
          <span>预约类型：</span>
          <el-select v-model="appointType" multiple collapse-tags :clearable="false" placeholder="请选择预约类型" style="width:185px">
            <el-option
              v-for="item of appointTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="flex align-center" style="margin-left:10px">
          <span>预约结果：</span>
          <el-select v-model="appointResult" multiple collapse-tags :clearable="false" placeholder="请选择预约结果" style="width:185px">
            <el-option
              v-for="item of appointResultList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
      </div>
      <div class="flex align-center wrap" style="margin: 5px 0">
        <div class="flex align-center" style="width:60%">
          <span>申请时间：</span>
          <lkt-date-picker v-model="appointDt"/>
          <el-button type="primary" style="margin-left:5px" @click="query()">查询</el-button>
        </div>
        <div class="flex end" style="width:40%">
          <el-input v-model="keywords" placeholder="输入搜索：申请人/角色" style="width:400px"/>
        </div>
      </div>
      <lkt-table :data="flitered">
        <el-table-column type="expand">
          <div slot-scope="props" class="flex start">
            <el-form label-width="100px">
              <el-form-item label="预约课程：">{{props.row.course ? props.row.course.name : ''}}</el-form-item>
              <el-form-item label="预约实验：">{{props.row.program ? props.row.program.name : ''}}</el-form-item>
              <el-form-item label="指定教师：">{{props.row.teacher ? props.row.teacher.name : ''}}</el-form-item>
              <el-form-item label="参与人：">{{props.row.students.length > 0 ? props.row.students : props.row.clasz?  props.row.clasz.name + '-' + props.row.claszGroup.name : '无'}}</el-form-item>
              <el-form-item label="处理人：">{{props.row.operator ? props.row.operator.name : ''}}</el-form-item>
              <el-form-item label="处理时间：">{{props.row.handleDt ? props.row.handleDt : ''}}</el-form-item>
            </el-form>
          </div>
        </el-table-column>
        <el-table-column label="预约人" prop="applicant.name" width="80"/>
        <el-table-column label="角色" width="80" prop="applicant.role.name"/>
        <el-table-column label="申请时间" width="160" prop="createDt" sortable align="center"/>
        <el-table-column label="预约类型" width="100">
          <span slot-scope="{ row }">
            {{(row.type===1? '授课预约':'')+(row.type===2? '个人预约':'')}}
          </span>
        </el-table-column>
        <el-table-column label="预约课时">
          <div class="flex start" slot-scope="{row}" v-if="row.extend.lessons && row.extend.lessons.length>0">
            <div>第{{row.extend.lessons[0]}}节</div>
            <div v-if="row.extend.lessons.length>1"> - 第{{row.extend.lessons[row.extend.lessons.length-1]}}节</div>
          </div>
        </el-table-column>
        <el-table-column label="开始时间" width="160" prop="startDt" align="center"/>
        <el-table-column label="结束时间" width="160" prop="endDt" align="center"/>
        <el-table-column label="审核结果" fixed="right" width="100">
          <div slot-scope="{row}">
            <el-tag v-if="row.result === 0" type="warning">未审核</el-tag>
            <el-tag v-if="row.result === 1" type="success">已同意</el-tag>
            <el-tag v-if="row.result === 2" type="danger">已拒绝</el-tag>
            <el-tag v-if="row.result === 3" type="info">申请撤销</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" min-width="150">
          <div class="flex center little-space wrap" slot-scope="{ row }" >
            <el-button type="warning" size="mini" @click="()=>{ modal.dt = new Date(row.startDt);modal.visible = true;}">对比课表</el-button>
            <el-button type="primary" size="mini" :disabled="row.result!==0" @click="agreeAppoint(row)">同意</el-button>
            <el-button type="danger" size="mini" :disabled="row.result!==0" @click="disagreeAppoint(row)">拒绝</el-button>
          </div>
        </el-table-column>
      </lkt-table>
    </div>
    <kit-dialog-simple
      v-if="modal.dt"
      :no-footer="true"
      :modal="modal"
      width="80%">
      <div class="flex center">
        <courseList :read-only="true" :dt="modal.dt"/>
      </div>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted, createComponent } from '@vue/composition-api';
import {useSearch, useLoading, useConfirm} from 'web-toolkit/src/service';
import { Message } from 'element-ui';
import courseList from '../../components/courseList.vue';
import {AppointList, AppointOperate} from '@/dao/appointRecordDao';
export default createComponent({
  components: { courseList },
  setup() {
    const loading = ref(false);
    const appointRecords = ref<any>();
    const appointTypeList = ref<any>([
      {id: 1, name: '授课预约'},
      {id: 2, name: '个人预约'},
    ]);
    const appointType = ref<any>();
    const appointResultList = ref<any>([
      {id: 0, name: '未审核'},
      {id: 1, name: '已同意'},
      {id: 2, name: '已拒绝'},
      {id: 3, name: '申请撤销'},
    ]);
    const appointResult = ref<any>();
    const appointDt = ref<any>(null);
    const [keywords, flitered] = useSearch(appointRecords, {
      includeProps: ['applicant.name', 'applicant.role'],
    });
    const modal = ref<any>({
      visible: false,
      dt: null,
    });
    const query = async () => {
      appointRecords.value = await AppointList({
        typeJson: appointType.value && appointType.value.length > 0 ? JSON.stringify(appointType.value) : null,
        resultJson: appointResult.value && appointResult.value.length > 0 ? JSON.stringify(appointResult.value) : null,
        start: appointDt.value && appointDt.value[0] ? (appointDt.value[0] as Date).getTime() : null,
        end: appointDt.value && appointDt.value[1] ? (appointDt.value[1] as Date).getTime() : null,
      });
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
    loading, appointRecords, query, modal,
    agreeAppoint,
    disagreeAppoint: useConfirm('确认拒绝？', useLoading(loading, disagreeAppoint)),
    appointTypeList, appointType, appointResultList, appointResult, appointDt,
    keywords, flitered,
    };
  },
});
</script>
<style scoped lang="scss">

</style>
