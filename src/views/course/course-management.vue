<template>
  <div v-loading="loading" class="course-management">
    <div style="display:flex;justify-content:space-between;flex-wrap:wrap">
      <div style="margin-bottom:10px">
        <el-button type="success" style="margin-left:10px" @click="showCourseForm()">添加</el-button>
      </div>
      <el-input class="search bar" v-model="keywords" placeholder="在结果中搜索：课程代码/课程名称/任课老师" style="margin-bottom:10px;width:400px" clearable/>
    </div>
    <lkt-table
      :data="filtered"
      style="width:100%">
      <el-table-column prop="code" label="课程代码"/>
      <el-table-column prop="name" label="课程名称"/>
      <el-table-column prop="teacher.name" label="任课老师"/>
      <el-table-column prop="extend.scoreRatio[0]" label="操作评分占比"/>
      <el-table-column prop="extend.scoreRatio[1]" label="报告评分占比"/>
      <el-table-column label="实验项目">
        <div slot-scope="{row}">
          <el-button type="text" size="mini" @click="showExperimentForm(row)">查看详情</el-button>
        </div>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <div class="flex center little-space wrap" slot-scope="{row}">
          <el-button type="warning" size="mini" @click="showCourseForm(row)" 
            v-if="storeUserInfo.user.role.privileges.indexOf('courseMng')>=0?true: 
              (storeUserInfo.user.role.privileges.indexOf('courseUpdate')>=0?row.teacher.id===storeUserInfo.user.id:false)">修改</el-button>
          <el-button type="danger" size="mini" @click="courseRemove(row)" 
            v-if="storeUserInfo.user.role.privileges.indexOf('courseMng')>=0?true: 
              (storeUserInfo.user.role.privileges.indexOf('courseUpdate')>=0?row.teacher.id===storeUserInfo.user.id:false)">删除</el-button>
        </div>
      </el-table-column>
    </lkt-table>
    <kit-dialog-simple
      id="course"
      :modal="courseModal"
      :confirm="courseUpdate"
      width="700px">
      <div slot="title">{{courseModal.courseInfo && courseModal.courseInfo.id ? '修改' : '录入'}}课程信息</div>
      <el-form v-if="courseModal.courseInfo" ref="form" :model="courseModal.courseInfo" label-width="130px" label-position="left" style="width: 580px;margin: 0 auto">
        <el-form-item label="课程代码：" prop="code" :rules="{ required: true, message: '请输入课程代码'}">
          <el-input v-model="courseModal.courseInfo.code"/>
        </el-form-item>
        <el-form-item label="课程名称：" prop="name" :rules="{ required: true, message: '请输入课程名称'}">
          <el-input v-model="courseModal.courseInfo.name"/>
        </el-form-item>
        <el-form-item label="任课教师：" prop="teacher.id" :rules="{ required: true, message: '请选择任课教师'}">
          <!-- <el-input v-model="courseModal.courseInfo.teacher.id" maxlength='11' clearable/> -->
          <el-select v-model="courseModal.courseInfo.teacher.id" :disabled="storeUserInfo.user.role.privileges.indexOf('courseMng')>=0?false: 
              (storeUserInfo.user.role.privileges.indexOf('courseUpdate')>=0?true:false)">
            <el-option
              v-for="item of teacherList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实验项目：" prop="program" :rules="{ required: true, message: '请选择实验项目'}">
          <el-select v-model="courseModal.courseInfo.program" multiple>
            <el-option
              v-for="item of experimentList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作评分占比：" prop="extend.scoreRatio[0]" :rules="{ required: true, validator:validator}">
          <el-input-number :min="0" :max="100" v-model="courseModal.courseInfo.extend.scoreRatio[0]"/>
        </el-form-item>
        <el-form-item label="报告评分占比：" prop="extend.scoreRatio[1]" :rules="{ required: true, validator:validator}">
          <el-input-number :min="0" :max="100" v-model="courseModal.courseInfo.extend.scoreRatio[1]"/>
        </el-form-item>
      </el-form>
    </kit-dialog-simple>
    <kit-dialog-simple
      id="experiment"
      :modal="experimentModal"
      :confirm="experimentUpdate"
      width="1000px">
      <div slot="title">实验项目详情</div>
      <el-form class="flex end">
        <el-form-item>
          <el-input v-model="keywords2" placeholder="在结果中搜索：实验名称/实验编号" style="width:300px"/>
        </el-form-item>
      </el-form>
      <lkt-table
        :data="filtered2"
        style="width:100%">
        <el-table-column label="实验名称" prop="name"/>
        <el-table-column label="实验编号" prop="code"/>
        <el-table-column label="实验类型" prop="label"/>
        <el-table-column label="附件" prop="attachment">
          <div slot-scope="{row}">
            <div v-for="(item,i) in row.attachment" :key="i">
              {{item.split('/')[item.split('/').length-1]}}
            </div>
          </div>
        </el-table-column>
        <el-table-column label="操作">
          <div slot-scope="{row}">
            <el-button type="danger" size="mini" @click="experimentRemove(row)">删除</el-button>
          </div>
        </el-table-column>
      </lkt-table>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import {ref, Ref, onMounted} from '@vue/composition-api';
import {ElForm} from 'element-ui/types/form';
import {useLoading, useConfirm, useSearch} from 'web-toolkit/src/service';
import {Message} from 'element-ui';
import {storeUserInfo} from 'web-toolkit/src/case-main';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
import {CourseList, CourseAdd, CourseUpdate, CourseDel, ProgramList, UnbindProgram} from '@/dao/courseProgramDao';
import {TeacherList} from '@/dao/userDao';

export default {
  setup() {
    const loading = ref(false);
    const courseList = ref<any>([]);
    const [keywords, filtered] = useSearch(courseList, {
      includeProps: ['code', 'name', 'teacher.name'],
    });
    const teacherList = ref<any>();
    const experimentList = ref<any>([]);
    const expOfCourseList = ref<any>([]);
    const courseID = ref<any>();
    const [keywords2, filtered2] = useSearch(expOfCourseList, {
      includeProps: ['name', 'code'],
    });
    const courseRemove = async (row: any) => {
      await CourseDel({
        id: row.id,
      });
      Message.success('删除成功');
      courseList.value = await CourseList({
        containPrograms: true,
      });
    };
    const form = ref<ElForm | null>(null);
    const courseModal = ref<any>({
      visible: false,
      courseInfo: {name: '', teacher: {name: ''}, program: [], extend: {scoreRatio: []}},
      type: 'add',
    });
    const experimentModal = ref<any>({
      visible: false,
      experimentInfo: null,
    });
    function userRole(ror: any){
      
    };
    const userInfo = ref<any>({});
    const showCourseForm = async (data?: any) => {
      userInfo.value = storeUserInfo;
      if (form.value) {
        (form.value as ElForm).clearValidate();
      }
      if (data) {
        data = deepClone(data);
        courseModal.value.type = 'update';
        data.program = data.programList.map((m: any) => m.id);
        courseModal.value.courseInfo = data;
      } else {
        data = initCourseForm();
        courseModal.value.type = 'add';
        courseModal.value.courseInfo = data;
        courseModal.value.courseInfo.teacher.id = userInfo.value.user.role.privileges.indexOf('courseMng')>=0?null:
          (userInfo.value.user.role.privileges.indexOf('courseUpdate')>=0?userInfo.value.user.id:null);
      }
      courseModal.value.visible = true;
    };
    const showExperimentForm = async (data?: any) => {
      if (data) {
        expOfCourseList.value = data.programList;
        courseID.value = data.id;
      }
      experimentModal.value.visible = true;
      courseList.value = await CourseList({
        containPrograms: true,
      });
    };
    const experimentRemove = async (row: any) => {
      await UnbindProgram({
        courseId: courseID.value,
        programId: row.id,
      });
      Message.success('删除成功');
      courseList.value = await CourseList({
        containPrograms: true,
      });
      const updateExpList = courseList.value.filter(function(item: any) {
        return item.id === courseID.value;
      });
      expOfCourseList.value = updateExpList[0].programList;
    };

    async function experimentUpdate() {
      courseList.value = await CourseList({
        containPrograms: true,
      });
      experimentModal.value.visible = false;
    }

    function validator(rule: any, value: string, callback: Function) {
      if (value && (courseModal.value.courseInfo.extend.scoreRatio[1] + courseModal.value.courseInfo.extend.scoreRatio[0] !== 100)) {
        callback(new Error('分数比相加需为100'));
      } else if (!value) {
        callback(new Error('请输入占比'));
      } else {
        callback();
      }
    }

    async function courseUpdate() {
      const valid = await (form.value as ElForm).validate();
      if (valid) {
        if (courseModal.value.type === 'add') {
          await CourseAdd({
            // *code, *name, *teacherId, extendJson, programJson
            // id: courseModal.value.courseInfo.id,
            code: courseModal.value.courseInfo.code,
            name: courseModal.value.courseInfo.name,
            teacherId: courseModal.value.courseInfo.teacher.id,
            extendJson: JSON.stringify(courseModal.value.courseInfo.extend),
            programJson: JSON.stringify(courseModal.value.courseInfo.program),
          });
        } else {
          await CourseUpdate({
            id: courseModal.value.courseInfo.id,
            code: courseModal.value.courseInfo.code,
            name: courseModal.value.courseInfo.name,
            teacherId: courseModal.value.courseInfo.teacher.id,
            extendJson: JSON.stringify(courseModal.value.courseInfo.extend),
            programJson: JSON.stringify(courseModal.value.courseInfo.program),
          });
        }
        courseModal.value.visible = false;
        Message.success(`${courseModal.value.type === 'add' ? '添加' : '修改'}成功`);
        courseList.value = await CourseList({
          containPrograms: true,
        });
      }
    }

    onMounted(useLoading(loading, async () => {
      teacherList.value = await TeacherList();
      experimentList.value = await ProgramList();
      courseList.value = await CourseList({
        containPrograms: true,
      });
    }));
    return {
      loading, courseList, form, keywords, filtered, teacherList,
      courseRemove: useConfirm('确认删除？', useLoading(loading, courseRemove)),
      courseModal, showCourseForm, experimentList,
      courseUpdate: useLoading(loading, courseUpdate),
      experimentModal, showExperimentForm, expOfCourseList,
      keywords2, filtered2, courseID, validator, storeUserInfo,
      experimentUpdate: useLoading(loading, experimentUpdate),
      experimentRemove: useConfirm('确认删除？', useLoading(loading, experimentRemove)),
    };
  },
};

function initCourseForm() {
  return {
    name: '', code: '', teacher: {id: '', name: ''}, program: [],
    extend: {scoreRatio: []},
  };
}
</script>
<style scoped lang="scss">

</style>
