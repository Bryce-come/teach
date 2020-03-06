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
          <el-form-item>
            <el-button type="success" @click="showAppointForm()">预约实验室</el-button>
          </el-form-item>
          <el-form-item label="申请时间:" label-width="80px">
            <lkt-date-picker v-model="appointDt.datetimeRange"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryAppointRecordList()">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="输入搜索：" style="width:420px"></el-input>
          </el-form-item>
        </el-form>
        <lkt-table
          :data="appointRecordList"
          style="width:100%">
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
          <el-table-column label="预约人" prop="applicant.name" width="80"></el-table-column>
          <el-table-column label="角色" width="80" prop="applicant.role.name"></el-table-column>
          <el-table-column label="申请时间" width="160" prop="createDt" sortable align="center"></el-table-column>
          <el-table-column label="预约类型" width="100">
            <span slot-scope="{ row }">
              {{(row.type===1? '授课预约':'')+(row.type===2? '个人预约':'')}}
            </span>
          </el-table-column>
          <el-table-column label="预约课时">
            <div class="flex start" slot-scope="{row}">
              <div v-for="(item, i) in row.extend.lessons" :key="i">
                {{item + ','}}
              </div>
            </div>
          </el-table-column>
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
              <el-button type="warning" size="mini" :disabled="row.result === 0? false: true" @click="showAppointForm(row)">修改</el-button>
              <el-button type="danger" size="mini" :disabled="row.result === 0? false: true" @click="revokeAppoint(row)">撤销</el-button>
            </div>
          </el-table-column>
        </lkt-table>
      </div>
      <kit-dialog-simple
        :modal="appointModal"
        :confirm="appointUpdate">
        <div slot="title">{{appointModal.appointInfo && appointModal.appointInfo.id ? '修改预约信息' : '申请预约'}}</div>
         <el-form v-if="storeUserInfo.user && storeUserInfo.user.role.id === 2 && appointModal.appointInfo" ref="form" :model="appointModal.appointInfo" label-width="130px" label-position="left" style="width: 580px;margin: 0 auto">
            <el-form-item label="预约类型：" prop="type" :rules="{ required: true, message: '请选择预约类型'}">
              <el-select v-model="appointModal.appointInfo.type">
                <el-option
                  v-for="item of appointTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择课程：" prop="course">
              <el-select v-model="appointModal.appointInfo.course" value-key="id">
                <el-option
                  v-for="item of courseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择实验：" prop="program">
              <el-select v-model="appointModal.appointInfo.program" value-key="id">
                <el-option
                  v-for="item of appointModal.appointInfo.course.id ? appointModal.appointInfo.course.programList : programList"
                  :key="item.id"
                  :label="item.name"
                  :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择指定教师：" prop="teacher.id">
              <el-select v-model="appointModal.appointInfo.teacher.id">
                <el-option
                  v-for="item of teacherList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择操作台：" prop="stations" :rules="appointModal.appointInfo.type === 2 ? { required: true, message: '请选择操作台'} : { required: false}">
              <el-select v-model="appointModal.appointInfo.stations" multiple collapse-tags>
                <el-option
                  v-for="item of stationList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择开始时间：" prop="startDt">
              <el-date-picker v-model="appointModal.appointInfo.startDt" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item label="选择结束时间：" prop="endDt">
              <el-date-picker v-model="appointModal.appointInfo.endDt" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item label="选择课时：" prop="extend.lessons" :rules="{ required: true, message: '请选择预约课时'}">
              <el-select v-model="appointModal.appointInfo.extend.lessons" multiple collapse-tags>
                <el-option
                  v-for="item in lessonList.lessonNum"
                  :key="item"
                  :label="'第' + item + '节课'"
                  :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择班级：" prop="extend.clasz" v-if="appointModal.appointInfo.type === 1">
              <el-select v-model="appointModal.appointInfo.extend.clasz" value-key="id">
                <el-option
                  v-for="item of classList"
                  :key="item.id"
                  :label="item.name"
                  :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择组别：" prop="extend.claszGroup" v-if="appointModal.appointInfo.type === 1">
              <el-select v-model="appointModal.appointInfo.extend.claszGroup" value-key="id">
                <el-option
                  v-for="item of appointModal.appointInfo.extend.clasz ? appointModal.appointInfo.extend.clasz.groups : []"
                  :key="item.id"
                  :label="item.name"
                  :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-form v-if="storeUserInfo.user && storeUserInfo.user.role.id === 3 && appointModal.appointInfo" ref="form" :model="appointModal.appointInfo" label-width="130px" label-position="left" style="width: 580px;margin: 0 auto">
            <el-form-item label="预约类型：" prop="type" :rules="{ required: true, message: '请选择预约类型'}">
              <el-select v-model="appointModal.appointInfo.type">
                <el-option
                  v-for="item of studentAppointType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择课程：" prop="course">
              <el-select v-model="appointModal.appointInfo.course" value-key="id">
                <el-option
                  v-for="item of courseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择实验：" prop="program">
              <el-select v-model="appointModal.appointInfo.program" value-key="id">
                <el-option
                  v-for="item of appointModal.appointInfo.course.id ? appointModal.appointInfo.course.programList : programList"
                  :key="item.id"
                  :label="item.name"
                  :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择其他参与人：" prop="students">
              <el-select v-model="appointModal.appointInfo.students" multiple collapse-tags>
                <el-option
                  v-for="item of otherStudentInClasz"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择操作台：" prop="stations" :rules="{ required: true, message: '请选择操作台'}">
              <el-select v-model="appointModal.appointInfo.stations" multiple collapse-tags>
                <el-option
                  v-for="item of stationList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择开始时间：" prop="startDt" :rules="{ required: true, message: '请选择开始时间'}">
              <el-date-picker v-model="appointModal.appointInfo.startDt" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item label="选择结束时间：" prop="endDt" :rules="{ required: true, message: '请选择结束时间'}">
              <el-date-picker v-model="appointModal.appointInfo.endDt" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item label="选择课时：" prop="extend.lessons" :rules="{ required: true, message: '请选择预约课时'}">
              <el-select v-model="appointModal.appointInfo.extend.lessons" multiple collapse-tags>
                <el-option
                  v-for="item in lessonList.lessonNum"
                  :key="item"
                  :label="'第' + item + '节课'"
                  :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
      </kit-dialog-simple>
    </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted, createComponent } from '@vue/composition-api';
import { Message } from 'element-ui';
import noactionCourseList from '../../components/noaction-courstList.vue';
import { AppointListMine, AppointAdd, AppointUpdate, AppointOperate} from '@/dao/appointRecordDao';
import { CourseList, ProgramList} from '@/dao/courseProgramDao';
import { TeacherList, StudentList, ClassList} from '@/dao/userDao';
import { StationList} from '@/dao/stationDao';
import { SettingGet} from '@/dao/settingDao';
import {storeUserInfo} from 'web-toolkit/src/case-main';
import { useLoading, useConfirm } from 'web-toolkit/src/service';
import {ElForm} from 'element-ui/types/form';
import { deepClone } from 'web-toolkit/src/utils';
export default createComponent({
  components: {noactionCourseList},
  setup() {
    const loading = ref(false);
    const courseButton = ref(false);
    const appointButton = ref(true);
    const appointRecordList = ref<any>([]);
    const appointDt = ref({
      datetimeRange: [new Date(Date.now() - 3 * 24 * 3600000), new Date()],
    });
    const appointTypeList = ref<any>([
      {id: 1, name: '授课预约'},
      {id: 2, name: '个人预约'},
    ]);
    const studentAppointType = ref<any>([
      {id: 2, name: '个人预约'},
    ]);
    const courseList = ref<any>([]);
    const programList = ref<any>([]);
    const teacherList = ref<any>([]);
    const studentList = ref<any>([]);
    const otherStudentInClasz = ref<any>();
    const stationList = ref<any>([]);
    const classList = ref<any>([]);
    const lessonList = ref<any>();
    const appointModal = ref<any>({
      visible: false,
      appointInfo: null,
      type: 'add',
    });
    const form = ref<ElForm | null>(null);
    const showAppointForm = async (data?: any) => {
      if (form.value) { (form.value as ElForm).clearValidate(); }
      console.log(data);
      if (data) {
        data = deepClone(data);
        appointModal.value.type = 'update';
      } else {
        data = initAppointForm();
        appointModal.value.type = 'add';
      }
      // console.log(appointModal.value.type);
      appointModal.value.appointInfo = data;
      appointModal.value.visible = true;
    };
    async function appointUpdate() {
      const valid = await (form.value as ElForm).validate();
      console.log(valid);
      if (valid) {
        // 时间格式转化
        if (appointModal.value.appointInfo.startDt && appointModal.value.appointInfo.startDt instanceof Date) {
          appointModal.value.appointInfo.startDt = appointModal.value.appointInfo.startDt.getTime();
        }
        if (appointModal.value.appointInfo.endDt && appointModal.value.appointInfo.endDt instanceof Date) {
          appointModal.value.appointInfo.endDt = appointModal.value.appointInfo.endDt.getTime();
        }
        if (appointModal.value.type === 'add') {
          await AppointAdd({
            type: appointModal.value.appointInfo.type,
            courseId: appointModal.value.appointInfo.course.id ? appointModal.value.appointInfo.course.id : null,
            programId: appointModal.value.appointInfo.program.id ? appointModal.value.appointInfo.program.id : null,
            teacherId: appointModal.value.appointInfo.teacher.id ? appointModal.value.appointInfo.teacher.id : null,
            studentJson: JSON.stringify(appointModal.value.appointInfo.students ? appointModal.value.appointInfo.students : null),
            stationJson: JSON.stringify(appointModal.value.appointInfo.stations ? appointModal.value.appointInfo.stations : null),
            start: appointModal.value.appointInfo.startDt ? appointModal.value.appointInfo.startDt : null,
            end: appointModal.value.appointInfo.endDt ? appointModal.value.appointInfo.endDt : null,
            extendJson: JSON.stringify(appointModal.value.appointInfo.extend),
          });
        } else {
          await AppointUpdate({
            id: appointModal.value.appointInfo.id,
            type: appointModal.value.appointInfo.type,
            courseId: appointModal.value.appointInfo.course.id ? appointModal.value.appointInfo.course.id : null,
            programId: appointModal.value.appointInfo.program.id ? appointModal.value.appointInfo.program.id : null,
            teacherId: appointModal.value.appointInfo.teacher.id ? appointModal.value.appointInfo.teacher.id : null,
            studentJson: JSON.stringify(appointModal.value.appointInfo.students ? appointModal.value.appointInfo.students : null),
            stationJson: JSON.stringify(appointModal.value.appointInfo.stations ? appointModal.value.appointInfo.stations : null),
            start: appointModal.value.appointInfo.startDt ? appointModal.value.appointInfo.startDt : null,
            end: appointModal.value.appointInfo.endDt ? appointModal.value.appointInfo.endDt : null,
            extendJson: JSON.stringify(appointModal.value.appointInfo.extend),
          });
        }
        appointModal.value.visible = false;
        Message.success(`${appointModal.value.type === 'add' ? '已申请预约' : '已修改预约'}`);
        await queryAppointRecordList();
      }
    }
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
      courseList.value = await CourseList({
          containPrograms: true,
        });
      console.log(courseList.value);
      programList.value = await ProgramList();
      console.log(programList.value);
      teacherList.value = await TeacherList();
      console.log(teacherList.value);
      studentList.value = await StudentList({});
      console.log(studentList.value);
      stationList.value = await StationList({
        simple: true,
      });
      classList.value = await ClassList();
      console.log(classList.value);
      lessonList.value = await SettingGet({
        onlyLesson: true,
      });
      // console.log(lessonList.value);
      // console.log(storeUserInfo.user);
      if (storeUserInfo.user) {
        const claszId = storeUserInfo.user.extend.clasz;
        const studentInClasz = studentList.value.filter(function(item: any) {
          return item.extend.clasz === claszId;
        });
        const userId = storeUserInfo.user.id;
        otherStudentInClasz.value = studentInClasz.filter(function(item: any) {
          return item.id !== userId;
        });
        console.log(storeUserInfo.user);
      }
    }));
    return {
      loading, courseButton, appointButton, showCourse, showAppoint,
      appointRecordList, appointDt, queryAppointRecordList,
      revokeAppoint: useConfirm('确认撤销预约申请？', useLoading(loading, revokeAppoint)),
      form, appointModal, showAppointForm,
      appointUpdate: useLoading(loading, appointUpdate),
      storeUserInfo,
      appointTypeList, studentAppointType, courseList, programList, stationList,
      teacherList, studentList, otherStudentInClasz, classList, lessonList,
    };
  },
});
function initAppointForm() {
  return {
    id: '', type: '', course: {id: ''}, program: {id: ''}, teacher: {id: ''}, students: [], stations: [],
    extend: {clasz: {}, claszGroup: {}},
  };
}
</script>
<style scoped lang="scss">

</style>
