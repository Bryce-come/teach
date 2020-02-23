<template>
  <div v-loading="loading" class="course-management">
    <div style="display:flex;justify-content:space-between;flex-wrap:wrap">
      <div style="margin-bottom:10px">
        <el-button type="primary">导入</el-button>
        <el-button type="success" style="margin-left:10px" @click="showCourseForm()">添加</el-button>
      </div>
      <el-input placeholder="在结果中搜索：课程代码/课程名称/任课老师" style="margin-bottom:10px;width:400px" clearable/>
    </div>
    <lkt-table
      :data="courseList"
      style="width:100%">
      <el-table-column prop="code" label="课程代码"/>
      <el-table-column prop="name" label="课程名称"/>
      <el-table-column prop="teacher" label="任课老师"/>
      <el-table-column prop="extend.scoreRatio[0]" label="操作评分占比"/>
      <el-table-column prop="extend.scoreRatio[1]" label="报告评分占比"/>
      <el-table-column label="实验项目">
        <el-button type="text" size="mini" @click="showExperimentForm()">查看详情</el-button>
      </el-table-column>
      <el-table-column label="操作">
        <div class="flex center little-space wrap" slot-scope="{row}">
          <el-button type="warning" size="mini" @click="showCourseForm(row)">修改</el-button>
          <el-button type="danger" size="mini" @click="courseRemove(row)">删除</el-button>
        </div>
      </el-table-column>
    </lkt-table>
    <kit-dialog-simple
      :modal="courseModal"
      :confirm="courseUpdate"
      width="700px">
        <div slot="title">{{courseModal.courseInfo && courseModal.courseInfo.id ? '修改' : '录入'}}课程信息</div>
        <el-form v-if="courseModal.courseInfo" ref="form" :model="courseModal.courseInfo" label-width="130px" label-position="left" style="width: 580px;margin: 0 auto">
          <el-form-item label="课程代码：" prop="code" :rules="{ required: true, message: '请输入课程代码'}">
              <el-input v-model="courseModal.courseInfo.code"></el-input>
          </el-form-item>
          <el-form-item label="课程名称：" prop="name" :rules="{ required: true, message: '请输入课程名称'}">
              <el-input v-model="courseModal.courseInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="任课教师：" prop="teacher" :rules="{ required: true, message: '请输入任课教师'}">
              <el-input v-model="courseModal.courseInfo.teacher"></el-input>
          </el-form-item>
          <el-form-item label="实验项目：" prop="experiment" :rules="{ required: true, message: '请选择实验项目'}">
              <lkt-select v-model="courseModal.courseInfo.experiment" multiple></lkt-select>
          </el-form-item>
          <el-form-item label="操作评分占比：" prop="extend.scoreRatio[0]" :rules="{ required: true, message: '请输入操作评分占比'}">
              <el-input v-model="courseModal.courseInfo.extend.scoreRatio[0]"></el-input>
          </el-form-item>
          <el-form-item label="报告评分占比：" prop="extend.scoreRatio[1]" :rules="{ required: true, message: '请输入报告评分占比'}">
              <el-input v-model="courseModal.courseInfo.extend.scoreRatio[1]"></el-input>
          </el-form-item>
        </el-form>
    </kit-dialog-simple>
    <kit-dialog-simple
      :modal="experimentModal"
      :confirm="experimentUpdate"
      width="1000px">
      <div slot="title">实验项目详情</div>
      <el-form class="flex end">
        <el-form-item>
          <el-input placeholder="输入关键字搜索" style="width:300px"></el-input>
        </el-form-item>
      </el-form>
      <lkt-table
        :data="experimentList"
        style="width:100%">
        <el-table-column label="实验名称" prop="name"/>
        <el-table-column label="实验目的" prop="purpose"/>
        <el-table-column label="实验原理" prop="principle"/>
        <el-table-column label="实验步骤" prop="steps"/>
        <el-table-column label="实验结果" prop="results"/>
        <el-table-column label="关联操作台" prop="stations"/>
        <el-table-column label="附件" prop="attachment"/>
        <el-table-column label="操作">
          <el-button type="danger" size="mini" @click="experimentRemove()">删除</el-button>
        </el-table-column>
      </lkt-table>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
import {ElForm} from 'element-ui/types/form';
import { useLoading, useConfirm, useSearch } from 'web-toolkit/src/service';
import { Message } from 'element-ui';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
export default {
  setup() {
    const loading = ref(false);
    const courseList = ref<any>();
    const experimentList = ref<any>();
    const courseRemove = async (row: any) => {
      Message.success('删除成功');
    };
    const experimentRemove = async (row: any) => {
      Message.success('删除成功');
    };
    const form = ref<ElForm|null>(null);
    const courseModal = ref<any>({
      visible: false,
      courseInfo: null,
    });
    const experimentModal = ref<any>({
      visible: false,
      experimentInfo: null,
    });
    const showCourseForm = async (data?: any) => {
      if (form.value) { (form.value as ElForm).clearValidate(); }
      if (data) {
        data = deepClone(data);

      } else {
        data = initCourseForm();
      }
      courseModal.value.courseInfo = data;
      courseModal.value.visible = true;
    };
    const showExperimentForm = () => {
      experimentModal.value.visible = true;
    };
    async function experimentUpdate() {
      experimentModal.value.visible = false;
      Message.success('添加成功');
      await queryCourse();
    }
    async function courseUpdate() {
      const valid = true;
      if (valid) {
        const { id, code, name, teacher, experiment, extend: {scoreRatio: []} } = courseModal.value.courseInfo;
        courseModal.value.visible = false;
        Message.success(`${isUndefined(id) ? '添加' : '修改'}成功`);
        await queryCourse();
      }
    }
    const queryCourse = async () => {
      courseList.value = [
          {id: 0, code: '1000231', name: 'xx', teacher: 'xx', extend: {examType: '', resultType: '', scoreRatio: ['60%', '40%']}, createDt: ''},
          {id: 1, code: '1000232', name: 'xx', teacher: 'xx', extend: {examType: '', resultType: '', scoreRatio: ['60%', '40%']}, createDt: ''},
          {id: 2, code: '1000233', name: 'xx', teacher: 'xx', extend: {examType: '', resultType: '', scoreRatio: ['60%', '40%']}, createDt: ''},
          {id: 3, code: '1000234', name: 'xx', teacher: 'xx', extend: {examType: '', resultType: '', scoreRatio: ['60%', '40%']}, createDt: ''},
          {id: 4, code: '1000235', name: 'xx', teacher: 'xx', extend: {examType: '', resultType: '', scoreRatio: ['60%', '40%']}, createDt: ''},
      ];
      experimentList.value = [
        {id: 0, code: '', name: 'xx', purpose: 'xx', principle: 'xxxxx', steps: '', results: 'xx', label: '', extend: {}, stations: [], attachment: [], createDt: ''},
        {id: 1, code: '', name: 'xx', purpose: 'xx', principle: 'xxxxx', steps: '', results: 'xx', label: '', extend: {}, stations: [], attachment: [], createDt: ''},
        {id: 2, code: '', name: 'xx', purpose: 'xx', principle: 'xxxxx', steps: '', results: 'xx', label: '', extend: {}, stations: [], attachment: [], createDt: ''},
        {id: 3, code: '', name: 'xx', purpose: 'xx', principle: 'xxxxx', steps: '', results: 'xx', label: '', extend: {}, stations: [], attachment: [], createDt: ''},
        {id: 4, code: '', name: 'xx', purpose: 'xx', principle: 'xxxxx', steps: '', results: 'xx', label: '', extend: {}, stations: [], attachment: [], createDt: ''},
      ];
    };
    onMounted(useLoading(loading, async () => {
        await queryCourse();
    }));
    return{
        loading, courseList, queryCourse,
        courseRemove: useConfirm('确认删除？', useLoading(loading, courseRemove)),
        courseModal, showCourseForm,
        courseUpdate: useLoading(loading, courseUpdate),
        experimentList, experimentModal, showExperimentForm,
        experimentUpdate: useLoading(loading, experimentUpdate),
        experimentRemove: useConfirm('确认删除？', useLoading(loading, experimentRemove)),
    };
  },
};
function initCourseForm() {
    return {
        name: '', code: '', teacher: '', experiment: '',
        extend: {scoreRatio: []},
    };
}
</script>
<style scoped lang="scss">

</style>
