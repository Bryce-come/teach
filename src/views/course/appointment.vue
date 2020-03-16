<template>
  <div v-loading="loading">
    <div class="flex center" style="margin-bottom:20px">
      <el-button :type="courseButton ? 'primary' : ''" style="width:150px" @click="showCourse()">查看课表</el-button>
      <el-button :type="appointButton ? 'primary' : ''" style="width:150px;margin-left:5px" @click="showAppoint()">
        预约申请历史
      </el-button>
    </div>
    <div v-if="courseButton" class="flex center">
      <courseList mode="readOnly"/>
    </div>
    <div v-if="appointButton">
      <div class="flex between appointButton">
        <el-form :inline="true" class="flex start wrap">
          <el-form-item>
            <el-button type="success" @click="showForm()">预约申请</el-button>
          </el-form-item>
          <el-form-item label="申请时间:" label-width="80px">
            <lkt-date-picker v-model="datetimeRange" :clearable="false"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="query()">查询</el-button>
          </el-form-item>
        </el-form>
        <el-input placeholder="输入搜索内容" style="width:420px"/>
      </div>
      <lkt-table
        :data="appointRecordList"
        style="width:100%">
        <el-table-column type="expand">
          <div slot-scope="{row}" class="flex start">
            <el-form label-width="100px" label-position="left" class="appointButton">
              <el-form-item label="课程名称：" v-if="row.course">{{row.course.name}}</el-form-item>
              <el-form-item label="实验名称：" v-if="row.program">{{row.program.name}}</el-form-item>
              <el-form-item label="负责教师：" v-if="row.teacher">{{row.teacher.name}}</el-form-item>
              <el-form-item label="参与人：" v-if="row.studentList && row.studentList.length>0">
                <el-tag
                  v-for="(item, index) in row.studentList"
                  :key="index"
                  style="margin-right: 5px"
                  size="mini">{{item.name}}</el-tag>
              </el-form-item>
              <el-form-item label="班级分组：" v-if="row.clasz || row.claszGroup">
                {{ (row.clasz?row.clasz.name:'')+(row.claszGroup?' '+row.claszGroup.name:'') }}
              </el-form-item>
              <el-form-item label="处理人：" v-if="row.operator">{{row.operator.name}}</el-form-item>
              <el-form-item label="处理时间：" v-if="row.handleDt">{{row.handleDt}}</el-form-item>
            </el-form>
          </div>
        </el-table-column>
        <el-table-column label="申请时间" width="160" prop="createDt" sortable/>
        <el-table-column
          label="预约类型" width="100"
          :formatter="(row)=>(row.type===1? '授课预约':'')+(row.type===2? '个人预约':'')"/>
        <el-table-column label="预约课时">
          <div class="flex start" slot-scope="{row}" v-if="row.extend.lessons && row.extend.lessons.length>0">
            <span>第{{row.extend.lessons[0]}}节</span>
            <span v-if="row.extend.lessons.length>1">{{' - 第'+row.extend.lessons[row.extend.lessons.length-1]}}节</span>
          </div>
        </el-table-column>
        <el-table-column label="开始时间" width="160" prop="startDt"/>
        <el-table-column label="结束时间" width="160" prop="endDt"/>
        <el-table-column label="审核结果" fixed="right" width="100">
          <div slot-scope="{row}">
            <el-tag v-if="row.result === 0" type="warning">未审核</el-tag>
            <el-tag v-else-if="row.result === 1" type="success">已同意</el-tag>
            <el-tag v-else-if="row.result === 2" type="danger">已拒绝</el-tag>
            <el-tag v-else-if="row.result === 3" type="info">已撤销</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <div class="flex center little-space" slot-scope="{row}">
            <el-button type="warning" size="mini" :disabled="row.result!==0" @click="showForm(row)">修改</el-button>
            <el-button type="danger" size="mini" :disabled="row.result!==0" @click="revokeAppoint(row)">撤销</el-button>
          </div>
        </el-table-column>
      </lkt-table>
    </div>
    <kit-dialog-simple
      width="450px"
      :modal="appointModal"
      :confirm="appointUpdate">
      <div slot="title">{{appointModal.appointInfo.id ? '修改预约信息' : '申请预约'}}</div>
      <el-form v-if="appointModal.appointInfo" ref="form" :model="appointModal.appointInfo" label-width="160px" label-position="left">
        <el-form-item label="预约类型：" prop="type" :rules="{ required: true, message: '请选择预约类型'}">
          <el-select v-model="appointModal.appointInfo.type">
            <el-option
              v-for="item of appointTypeList"
              v-if="item.id!==1 || !isStudent()"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择课程：" prop="course">
          <el-select filterable v-model="appointModal.appointInfo.course" value-key="id">
            <el-option
              v-for="item of courseList"
              :key="item.id"
              :label="item.name"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="选择实验：" prop="program">
          <el-select filterable v-model="appointModal.appointInfo.program" value-key="id">
            <el-option
              v-for="item of appointModal.appointInfo.course ? appointModal.appointInfo.course.programList : programList"
              :key="item.id"
              :label="item.name"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="选择指定教师：" prop="teacher" 
        :rules="{ required: true, message: '请选择教师'}">
          <el-select filterable v-model="appointModal.appointInfo.teacher" value-key="id">
            <el-option
              v-for="item of teacherList"
              :key="item.id"
              :label="item.name"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="选择操作台：" prop="stations"
                      :rules="appointModal.appointInfo.type === 2 ? { required: true, message: '请选择操作台'} : { required: false}">
          <el-select filterable v-model="appointModal.appointInfo.stations" multiple collapse-tags>
            <el-option
              v-for="item of stationList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="选择预约日期：" prop="appointDate" :rules="{ required: true, message: '请选择预约日期'}">
          <el-date-picker v-model="appointModal.appointInfo.appointDate" type="date"/>
        </el-form-item>
        <el-form-item label="选择开始课时：" prop="startLesson" :rules="{ required: true, message: '请选择开始课时'}">
          <el-select v-model="appointModal.appointInfo.startLesson" @change='setEndtimeValue()'>
            <el-option
              v-for="item in lessonMap.lessonNum"
              :key="item"
              :label="'第' + item + '节课'"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="选择结束课时：" prop="endLesson" :rules="{ required: true, message: '请选择结束课时'}">
          <el-select v-model="appointModal.appointInfo.endLesson">
            <el-option
              v-for="item in lessonMap.lessonNum"
              v-if="appointModal.appointInfo.startLesson?item>=appointModal.appointInfo.startLesson:true"
              :key="item"
              :label="'第' + item + '节课'"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="选择班级：" prop="extend.clasz" v-if="appointModal.appointInfo.type === 1">
          <el-select filterable v-model="appointModal.appointInfo.extend.clasz" @change="setGroupValue()">
            <el-option
              v-for="item of classList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="选择组别：" prop="extend.claszGroup" v-if="appointModal.appointInfo.type === 1">
          <el-select filterable v-model="appointModal.appointInfo.extend.claszGroup">
            <el-option
              v-for="item of appointModal.appointInfo.extend.clasz?(classList.filter(item1 => {return item1.id === appointModal.appointInfo.extend.clasz}))[0].groups:[]"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="选择其他参与人：" v-if="appointModal.appointInfo.type === 2" prop="students">
          <el-select filterable v-model="appointModal.appointInfo.students" multiple collapse-tags>
            <el-option
              v-for="item of otherStudentInClasz"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import {ref, onMounted, createComponent} from '@vue/composition-api';
import {Message} from 'element-ui';
import courseList from '../../components/courseList.vue';
import {AppointListMine, AppointAdd, AppointUpdate, AppointOperate} from '@/dao/appointRecordDao';
import {CourseList, ProgramList} from '@/dao/courseProgramDao';
import {TeacherList, StudentList, ClassList} from '@/dao/userDao';
import {StationList} from '@/dao/stationDao';
import {SettingGet} from '@/dao/settingDao';
import {storeUserInfo} from 'web-toolkit/src/case-main';
import {useLoading, useConfirm} from 'web-toolkit/src/service';
import {ElForm} from 'element-ui/types/form';
import {deepClone} from 'web-toolkit/src/utils';
import {Department} from '@/types/privilege';

export default createComponent({
  components: {courseList},
  setup() {
    const loading = ref(false);
    const courseButton = ref(false);
    const appointButton = ref(true);
    const appointRecordList = ref<any>([]);
    const datetimeRange = ref<any[]>( [new Date(Date.now() - 3 * 24 * 3600000), new Date()]);
    const appointTypeList = ref<any>([
      {id: 1, name: '授课预约'},
      {id: 2, name: '个人预约'},
    ]);
    const courseList = ref<any>([]);
    const programList = ref<any>([]);
    const teacherList = ref<any>([]);
    const otherStudentInClasz = ref<any>();
    const stationList = ref<any>([]);
    const classList = ref<any>([]);
    const lessonMap = ref<any>([]);
    const appointModal = ref<any>({
      visible: false,
      appointInfo: {},
      type: 'add',
    });
    const form = ref<ElForm | null>(null);

    const showForm = async (data?: any) => {
      if (form.value) {
        (form.value as ElForm).clearValidate();
      }
      if (data) {
        data = deepClone(data);
        appointModal.value.type = 'update';
        // 转化 startLesson endLesson, appointDate
        if (data.startDt) { data.appointDate = new Date(data.startDt); }
        if (data.extend.lessons && data.extend.lessons.length > 0) {
          data.startLesson = data.extend.lessons[0];
          data.endLesson = data.extend.lessons[data.extend.lessons.length - 1];
        }
        // extend: lessons:[], clasz-班级, claszGroup-分组
      } else {
        data = initAppointForm();
        appointModal.value.type = 'add';
      }
      appointModal.value.appointInfo = data;
      appointModal.value.visible = true;
    };
    function setEndtimeValue() {
      appointModal.value.appointInfo.endLesson = undefined;
    }
    function setGroupValue() {
      appointModal.value.appointInfo.extend.claszGroup = undefined;
    }
    async function appointUpdate() {
      const valid = await (form.value as ElForm).validate();
      if (valid) {
        // 时间格式转化
        const lesson1 = lessonMap.value['lesson' + appointModal.value.appointInfo.startLesson];
        const lesson2 = lessonMap.value['lesson' + appointModal.value.appointInfo.endLesson];
        // extend: lessons:[], clasz-班级, claszGroup-分组
        appointModal.value.appointInfo.extend.lessons = [];
        for (let i = appointModal.value.appointInfo.startLesson; i <= appointModal.value.appointInfo.endLesson; i++) {
          appointModal.value.appointInfo.extend.lessons.push(i);
        }
        if (appointModal.value.appointInfo.extend.clasz) {
          appointModal.value.appointInfo.extend.clasz = appointModal.value.appointInfo.extend.clasz;
        }
        if (appointModal.value.appointInfo.claszGroup) {
          appointModal.value.appointInfo.extend.claszGroup = appointModal.value.appointInfo.extend.claszGroup;
        }
        const params = {
          id: appointModal.value.appointInfo.id,
          type: appointModal.value.appointInfo.type,
          courseId: appointModal.value.appointInfo.course ? appointModal.value.appointInfo.course.id : null,
          programId: appointModal.value.appointInfo.program ? appointModal.value.appointInfo.program.id : null,
          teacherId: appointModal.value.appointInfo.teacher ? appointModal.value.appointInfo.teacher.id : null,
          studentJson: appointModal.value.appointInfo.students && appointModal.value.appointInfo.students.length > 0 ? JSON.stringify(appointModal.value.appointInfo.students) : null,
          stationJson: appointModal.value.appointInfo.stations && appointModal.value.appointInfo.stations.length > 0 ? JSON.stringify(appointModal.value.appointInfo.stations) : null,
          start: transformDate(appointModal.value.appointInfo.appointDate, lesson1[0]),
          end: transformDate(appointModal.value.appointInfo.appointDate, lesson2[1]),
          extendJson: JSON.stringify(appointModal.value.appointInfo.extend),
        };
        if (appointModal.value.type === 'add') {
          await AppointAdd(params);
        } else {
          await AppointUpdate(params);
        }
        Message.success(`${appointModal.value.type === 'add' ? '已申请预约' : '已修改预约'}`);
        appointModal.value.visible = false;
        datetimeRange.value = [new Date(Date.now() - 3 * 24 * 3600000), new Date()];
        await query();
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
    function isStudent(): boolean {
      return (storeUserInfo.user as any).role.department.id === Department.Student;
    }
    const query = async () => {
      appointRecordList.value = await AppointListMine({
        start: datetimeRange.value[0].getTime(),
        end: datetimeRange.value[1].getTime(),
      });
    };
    const revokeAppoint = async (row: any) => {
      await AppointOperate({
        id: row.id,
        result: 3,
      });
      Message.success('已撤销预约申请');
      await query();
    };
    onMounted(useLoading(loading, async () => {
      await Promise.all([
        query(),
        courseList.value = await CourseList({
          containPrograms: true,
        }),
        programList.value = await ProgramList(),
        teacherList.value = await TeacherList(),
        stationList.value = await StationList({
          simple: true,
        }),
        classList.value = await ClassList(),
        lessonMap.value = await SettingGet({
          onlyLesson: true,
        }),
      ]);
      if (isStudent() && (storeUserInfo.user as any).extend.clasz) {
        const claszId = (storeUserInfo.user as any).extend.clasz;
        otherStudentInClasz.value = await StudentList({
          classId: claszId,
          forSelect: true,
        });
        otherStudentInClasz.value = otherStudentInClasz.value.filter((user: any) => user.id !== (storeUserInfo.user as any).id);
      }
    }));
    return {
      loading, courseButton, appointButton, showCourse, showAppoint,
      appointRecordList, datetimeRange, setEndtimeValue, setGroupValue,
      query: useLoading(loading, query),
      revokeAppoint: useConfirm('确认撤销预约申请？', useLoading(loading, revokeAppoint)),
      form, appointModal, showForm,
      appointUpdate: useLoading(loading, appointUpdate),
      storeUserInfo,
      appointTypeList, courseList, programList, stationList,
      teacherList, otherStudentInClasz, classList,
      lessonMap,
      isStudent,
    };
  },
});

// 时分秒赋值
function transformDate(template: Date, timestamp: number): number {
  const dt = new Date(timestamp);
  dt.setFullYear(template.getFullYear());
  dt.setDate(template.getDate());
  dt.setMonth(template.getMonth());
  dt.setMilliseconds(0);
  return dt.getTime();
}

function initAppointForm() {
  return {
    extend: {},
  };
}
</script>
<style scoped lang="scss">
  .appointButton .el-form-item{
    margin-bottom: 5px;
  }
</style>
