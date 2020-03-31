<template>
  <div v-loading="loading">
    <div class="flex align-center center">
      <div style="margin-right: 20px">
        <span style="display: inline-block;margin: 0 5px;border-radius: 10px;width: 10px;height: 10px;background-color: rgb(142, 208, 214)"/>
        <span>计划内课程</span>
        <span style="display: inline-block;margin: 0 5px;border-radius: 10px;width: 10px;height: 10px;background-color: rgb(244,213,71)"/>
        <span>授课预约</span>
        <span style="display: inline-block;margin: 0 5px;border-radius: 10px;width: 10px;height: 10px;background-color: rgb(197,150,196)"/>
        <span>个人预约</span>
      </div>
      <el-date-picker v-model="oneDay" type="date" placeholder="选择日期"/>
      <el-button style="margin-left: 10px" type="success" @click="list()">跳转日期</el-button>
      <el-button style="margin-left: 10px" type="primary" icon="el-icon-arrow-left" @click="()=>{clearDiv();goLastWeek()}">
        上一周
      </el-button>
      <el-button style="margin-left: 10px" type="primary" @click="()=>{clearDiv();goNextWeek()}">下一周<i class="el-icon-arrow-right el-icon--right"/></el-button>
    </div>
    <div style="margin: 7px;" class="some">
      <div class="flex" style="width:inherit">
        <div class="course-list-title" v-for="(weekNum, weekIndex) in weeks.length+1" :key="weekIndex">
          {{weekIndex===0?'时间':weekSection.weekInFo[weekIndex-1] + ' 周' + digital2Chinese(weekIndex-1, 'week')}}
        </div>
      </div>
      <div class="flex" style="width:inherit">
        <div class="flex column">
          <div class="titleb" v-for="i in courseCount.count" :key="i">
            {{`第 ${i} 节课`}}
          </div>
        </div>
        <div class="flex column tabDiv" v-for="(item,i) in originList.lessonsList" :key="i">
          <template
            v-for="(itemb,ii) in originList.lessonsList[i].lesson">
            <div
              :key="ii" :id="i+'-'+ii"
              v-if="!itemb"
              @click='()=> {
                if(mode===""){
                  showLesson(null,i,ii);
                } else if(mode==="timeRange"){
                  choose(i, ii, null);
                }
              }'
              @mousemove="showColor($event)"
              @mouseleave="noShowColor($event)"
              class="course-list-content"
              :style="{'background-color': 'white',
                'cursor': mode==='readOnly'?'default':'pointer'
              }">
            </div>
            <el-popover
              :key="ii"
              placement="top-start"
              width="50"
              v-else-if="mode===''">
              <div style="color:#67C23A;width:6rem;" @click="readLesson(itemb)">
                <i class="el-icon-reading"/>
                <span style="margin-left:5px;cursor: pointer;">查看</span>
              </div>
              <div
                v-if="storeUserInfo.user.role.privileges.indexOf(PRIVILEGE.courseRecordMng)>=0 || (itemb.teacher && itemb.teacher.id===storeUserInfo.user.id)"
                style="color:#67a1ff;width:6rem;" @click='showLesson(itemb)'>
                <i class="el-icon-edit"/>
                <span style="margin-left:5px;cursor: pointer;">修改</span>
              </div>
              <div
                v-if="storeUserInfo.user.role.privileges.indexOf(PRIVILEGE.courseRecordMng)>=0 || (itemb.teacher && itemb.teacher.id===storeUserInfo.user.id)"
                style="color:#F56C6C;width:6rem;" @click="deleteLesson(itemb)">
                <i class="el-icon-delete"/>
                <span style="margin-left:5px;cursor: pointer;">删除</span>
              </div>
              <div
                slot="reference"
                :id="i+'-'+ii"
                class="course-list-content flex center column"
                :style="{'background-color': itemb !== ''? (itemb.type===0?
                  'rgb(142, 208, 214)':(itemb.type===1?
                  'rgb(244,213,71)':(itemb.type===2?
                  'rgb(197,150,196)':'white'))):'white',
                  'cursor': mode==='readOnly'?'default':'pointer',
                  'height': divHeight*itemb.extend.lessons.length+'px'
                }">
                <div style="line-height:26px" v-if="itemb.course">
                  {{itemb.course?itemb.course.name:''}}
                </div>
                <div style="line-height:26px" v-if="itemb.teacher">
                  {{itemb.teacher.name}}
                </div>
                <div style="line-height:26px">
                  {{itemb.type !== null ? new Date(itemb.startDt).getHours() + ':' + new Date(itemb.startDt).getMinutes() +'-'+ new Date(itemb.endDt).getHours() + ':' + new Date(itemb.endDt).getMinutes():''}}
                </div>
              </div>
            </el-popover>
            <div
              :key="ii"
              :id="i+'-'+ii"
              v-else
              @click='()=> {
                if(mode==="timeRange"){
                  choose(i, ii, itemb);
                }
              }'
              class="course-list-content flex center column"
              :style="{'background-color': itemb !== ''? (itemb.type===0?
                  'rgb(142, 208, 214)':(itemb.type===1?
                  'rgb(244,213,71)':(itemb.type===2?
                  'rgb(197,150,196)':'white'))):'white',
                  'cursor': mode==='readOnly'?'default':'pointer',
                  'height': divHeight*itemb.extend.lessons.length+'px'
                }">
              <div style="line-height:26px" v-if="itemb.course">
                {{itemb.course?itemb.course.name:''}}
              </div>
              <div style="line-height:26px" v-if="itemb.teacher">
                {{itemb.teacher.name}}
              </div>
              <div style="line-height:26px">
                {{itemb.type !== null ? new Date(itemb.startDt).getHours() + ':' + new Date(itemb.startDt).getMinutes() +'-'+ new Date(itemb.endDt).getHours() + ':' + new Date(itemb.endDt).getMinutes():''}}
              </div>
            </div>
          </template>
<!--          <div-->
<!--            class="course-list-content"-->
<!--            v-for="(itemb,ii) in originList.lessonsList[i].lesson"-->
<!--            :style="{'background-color': itemb !== ''? (itemb.type===0?-->
<!--                'rgb(142, 208, 214)':(itemb.type===1?-->
<!--                'rgb(244,213,71)':(itemb.type===2?-->
<!--                'rgb(197,150,196)':'white'))):'white',-->
<!--                'cursor': readOnly?'default':'pointer'-->
<!--                }" :key="ii">-->
<!--            <div v-if="!itemb" class='course-list-order' @click='showLesson(null,i,ii)' @mousemove="showColor($event)" @mouseleave="noShowColor($event)">-->
<!--            </div>-->
<!--            <el-popover-->
<!--              placement="top-start"-->
<!--              width="50"-->
<!--              v-else-if="!readOnly">-->
<!--              <div style="color:#67C23A;width:6rem;" @click="readLesson(itemb)">-->
<!--                <i class="el-icon-reading"/>-->
<!--                <span style="margin-left:5px;cursor: pointer;">查看</span>-->
<!--              </div>-->
<!--              <div-->
<!--                v-if="storeUserInfo.user.role.privileges.indexOf(PRIVILEGE.courseRecordMng)>=0 || (itemb.teacher && itemb.teacher.id===storeUserInfo.user.id)"-->
<!--                style="color:#67a1ff;width:6rem;" @click='showLesson(itemb)'>-->
<!--                <i class="el-icon-edit"/>-->
<!--                <span style="margin-left:5px;cursor: pointer;">修改</span>-->
<!--              </div>-->
<!--              <div-->
<!--                v-if="storeUserInfo.user.role.privileges.indexOf(PRIVILEGE.courseRecordMng)>=0 || (itemb.teacher && itemb.teacher.id===storeUserInfo.user.id)"-->
<!--                style="color:#F56C6C;width:6rem;" @click="deleteLesson(itemb)">-->
<!--                <i class="el-icon-delete"/>-->
<!--                <span style="margin-left:5px;cursor: pointer;">删除</span>-->
<!--              </div>-->
<!--              <div style="width:100%;height:100%;" slot="reference" class="flex center column">-->
<!--                <div style="line-height:26px" v-if="itemb.course">-->
<!--                  {{itemb.course?itemb.course.name:''}}-->
<!--                </div>-->
<!--                <div style="line-height:26px" v-if="itemb.teacher">-->
<!--                  {{itemb.teacher.name}}-->
<!--                </div>-->
<!--                <div style="line-height:26px">-->
<!--                  {{itemb.type !== null ? new Date(itemb.startDt).getHours() + ':' + new Date(itemb.startDt).getMinutes() +'-'+ new Date(itemb.endDt).getHours() + ':' + new Date(itemb.endDt).getMinutes():''}}-->
<!--                </div>-->
<!--              </div>-->
<!--            </el-popover>-->
<!--            <div v-else style="width:100%;height:100%;" slot="reference" class="flex center column">-->
<!--              <div style="line-height:26px" v-if="itemb.course">-->
<!--                {{itemb.course?itemb.course.name:''}}-->
<!--              </div>-->
<!--              <div style="line-height:26px" v-if="itemb.teacher">-->
<!--                {{itemb.teacher.name}}-->
<!--              </div>-->
<!--              <div style="line-height:26px">-->
<!--                {{itemb.type !== null ? new Date(itemb.startDt).getHours() + ':' + new Date(itemb.startDt).getMinutes() +'-'+ new Date(itemb.endDt).getHours() + ':' + new Date(itemb.endDt).getMinutes():''}}-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
        </div>
      </div>
    </div>
    <kit-dialog-simple
      :no-footer="true"
      :modal="readModel"
      width="500px">
      <div slot='title'>课程信息查看</div>
      <div class="flex center column">
        <el-form label-width="110px" label-position="left" >
          <el-form-item label="课程名称：" v-if="readModel.oneLesson.course">
            <span>{{readModel.oneLesson.course.name}}</span>
          </el-form-item>
          <el-form-item label="授课教师：" v-if="readModel.oneLesson.teacher">
            <span>{{ readModel.oneLesson.teacher.name }}</span>
          </el-form-item>
          <el-form-item label="上课班级：" v-if="readModel.oneLesson.clasz">
            <span>{{ readModel.oneLesson.clasz.name  }}</span>
          </el-form-item>
          <el-form-item label="实验名称：" v-if="readModel.oneLesson.program">
            <span>{{ readModel.oneLesson.program.name }}</span>
          </el-form-item>
          <el-form-item label="上课时间：" v-if="readModel.oneLesson.extend">
            <span>{{  readModel.oneLesson.extend.lessons.length+'课时' }}</span>
          </el-form-item>
          <el-form-item label="操作台：" v-if="readModel.oneLesson.stations">
            <div v-for="(item,i) in readModel.oneLesson.stations" :key='i'>
              <span>{{ item }}</span>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </kit-dialog-simple>
    <kit-dialog-simple
      id="course-list"
      v-if="mode!=='readOnly'"
      :modal="showModal"
      :confirm="update"
      width="500px">
      <div slot='title'>{{showModal.oneLesson.id?'修改':'增加'}}课程记录</div>
      <el-form v-if="showModal.oneLesson" ref="form" :model="showModal.oneLesson" label-width="160px" label-position="left">
        <el-form-item label="排课类型：" prop="type" :rules="{ required: true, message: '请输入课程名称', }">
          <el-select v-model="showModal.oneLesson.type">
            <el-option
              v-for="item of courseAppointTypeList"
              :key="item.id"
              :label="item.type"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择课程日期：" prop="appointDate" :rules="{ required: true, message: '请选择课程日期'}">
          <el-date-picker v-model="showModal.oneLesson.appointDate" type="date"/>
        </el-form-item>
        <el-form-item label="选择开始课时：" prop="startLesson" :rules="{ required: true, message: '请选择开始课时'}">
          <el-select v-model="showModal.oneLesson.startLesson" id='setStarta' @change='setEndtimeValue()'>
            <el-option
              id='setStart'
              v-for="item in lessonMap.lessonNum"
              :key="item"
              :label="'第' + item + '节课'"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="选择结束课时：" prop="endLesson" :rules="{ required: true, message: '请选择结束课时'}">
          <el-select v-model="showModal.oneLesson.endLesson">
            <el-option
              v-for="item in lessonMap.lessonNum"
              v-if="showModal.oneLesson.startLesson?item>=showModal.oneLesson.startLesson:true"
              :key="item"
              :label="'第' + item + '节课'"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="选择课程：" prop="course.name"
          :rules="showModal.oneLesson.type!==1&&showModal.oneLesson.type!==2 ? { required: true, message: '请选择课程'} : { required: false}">
          <el-select
            filterable v-model="showModal.oneLesson.course" value-key="id"
            @change='setTeacherValue()'>
            <el-option
              v-for="item of courseList"
              :key="item.id"
              :label="item.name"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="选择教师：" prop="teacher.name"
          :rules="showModal.oneLesson.type!==2 ? { required: true, message: '请选择教师'} : { required: false}">
          <el-select filterable v-model="showModal.oneLesson.teacher" value-key="id">
            <el-option
              v-for="item of teacherList"
              :key="item.id"
              :label="item.name"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="选择实验：" prop="program.name">
          <el-select filterable v-model="showModal.oneLesson.program" value-key="id">
            <el-option
              v-for="item of showModal.oneLesson.course ? showModal.oneLesson.course.programList : programList"
              :key="item.id"
              :label="item.name"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="上课班级：" prop="extend.clasz"
          :rules="showModal.oneLesson.type!==1&&showModal.oneLesson.type!==2? { required: true, message: '请选择班级'} : { required: false}"
          v-if="showModal.oneLesson.type!==2">
          <el-select filterable v-model="showModal.oneLesson.extend.clasz" @change="setGroupValue()">
            <el-option
              v-for="item of classList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="选择组别：" prop="extend.claszGroup"
          v-if="showModal.oneLesson.type!==2&&showModal.oneLesson.type!==0">
          <el-select filterable v-model="showModal.oneLesson.extend.claszGroup">
            <el-option
              v-for="item of showModal.oneLesson.extend.clasz?classList.filter(item1 => {return item1.id === showModal.oneLesson.extend.clasz})[0].groups:[]"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="选择操作台：" prop="stations"
          :rules="showModal.oneLesson.type!==0&&showModal.oneLesson.type!==1 ? { required: true, message: '请选择操作台'} : { required: false}"
          v-if="showModal.oneLesson.type!==0">
          <el-select filterable v-model="showModal.oneLesson.stations" multiple collapse-tags>
            <el-option
              v-for="item of stationList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="选择参与人：" :rules="{ required: true, message: '请选择参与人'}"
          v-if="showModal.oneLesson.type&&showModal.oneLesson.type !== 1&&showModal.oneLesson.type !== 0"
          prop="students">
          <el-select filterable v-model="showModal.oneLesson.students" multiple collapse-tags>
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
import {createComponent, onMounted, ref, watch} from '@vue/composition-api';
import {useConfirm, useLoading} from 'web-toolkit/src/service';
import {Message} from 'element-ui';
import {ElForm} from 'element-ui/types/form';
import {deepClone, isNil } from 'web-toolkit/src/utils';
import {storeUserInfo} from 'web-toolkit/src/case-main';
import {getWeekDaysRange, clearHMS} from 'web-toolkit/src/utils/date';
import {CourseRecordList} from '@/dao/courseRecordDao';
import {SettingGet} from '@/dao/settingDao';
import {CourseList, ProgramList} from '@/dao/courseProgramDao';
import {ClassList, StudentList, TeacherList} from '@/dao/userDao';
import {StationList} from '@/dao/stationDao';
import {Department, PRIVILEGE} from '@/types/privilege';
import {CourseRecordAdd, CourseRecordDel, CourseRecordUpdate} from '@/dao/courseRecordDao';

export default createComponent({
  name: 'courseList',
  props: {
    // readOnly, timeRange
    mode: {
      type: String,
      default: '',
    },
    dt: {
      type: Date,
      default: () => null,
    },
    // timeRange时返回的时间
    range: {
      type: Array,
      default: () => [null, null],
    },
  },
  // props 父组件传过来的东西  ctx 相当于子组件的this（cts.$emit()）
  setup(props: any, ctx: any) {
    const loading = ref(false);
    const oneDay = ref<any>();
    const color = ref();
    const courseList = ref<any>([]);
    const programList = ref<any>([]);
    const teacherList = ref<any>([]);
    const otherStudentInClasz = ref<any>();
    const stationList = ref<any>([]);
    const classList = ref<any>([]);
    const lessonMap = ref<any>([]);
    const tableX = ref(-1);
    const tableY = ref(-1);
    const courseAppointTypeList = ref<any>();
    const courseCount = ref<any>({
      count: [],
    });
    const weekSection = ref<any>({
      weekStart: '',
      weekEnd: '',
      weekInFo: [],
      weekWithYeat: [],
    });
    // 课程内容框的高度
    const divHeight = ref<number>(45);
    const divChoose = ref<any>();
    watch(() => props.dt, async () => {
      if (!props.dt) { return ; }
      oneDay.value = props.dt;
      await list();
    });

    function isStudent(): boolean {
      return (storeUserInfo.user as any).role.department.id === Department.Student;
    }
    // 查看标志a
    const readModel = ref<any>({
      visible: false,
      oneLesson: '',
    });
    const showModal = ref<any>({
      visible: false,
      oneLesson: '',
      type: 'add',
    });
    const form = ref<ElForm | null>(null);
    // 查询函数
    async function list() {
      if (isNil(oneDay.value)) {
        alert('请选择日期');
      } else {
        clearDiv();
        await setWeekSection(new Date(oneDay.value));
      }
    }
    function setTeacherValue() {
      showModal.value.oneLesson.teacher = (courseList.value.filter((item1: any) => {
        return item1 === showModal.value.oneLesson.course;
      }))[0].teacher;
    }
    const lessons = ref<any>();
    const originList = ref<any>({
      lessonsList: [],
    });
    const weeks = ref(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
    function digital2Chinese(num: any, identifier: any) {
      const character = ['一', '二', '三', '四', '五', '六'];
      return identifier === 'week' && num === 6 ? '日' : character[num];
    }

    function showColor(row: any) {
      if (props.mode === 'readOnly') { return ; }
      const result = row.target;
      result.style.backgroundColor = 'Gainsboro';
    }
    function noShowColor(row: any) {
      if (props.mode === 'readOnly') { return ; }
      const result = row.target;
      result.style.backgroundColor = 'white';
    }
    function choose(x: any, y: any, item: any) {
      const id = x + '-' + y;
      if (divChoose.value) {
        const div = document.getElementById(divChoose.value) as HTMLElement;
        div.style.borderWidth = '1px';
        div.style.borderColor = 'black';
      }
      const div = document.getElementById(id) as HTMLElement;
      div.style.borderWidth = '3px';
      div.style.borderColor = '#ff0200';
      divChoose.value = id;
      if (item) {
        props.range.splice(0, 1, new Date(item.startDt));
        props.range.splice(1, 1, new Date(item.endDt));
      } else {
        const dt = weekSection.value.weekWithYeat[x];
        const dt1 = new Date();
        const dt2 = new Date();
        dt1.setTime(dt.getTime());
        dt2.setTime(dt.getTime());
        const t1 = new Date(lessonMap.value['lesson' + (y + 1)][0]);
        const t2 = new Date(lessonMap.value['lesson' + (y + 1)][1]);
        clearHMS(dt1); clearHMS(dt2);
        dt1.setHours(t1.getHours());
        dt2.setHours(t2.getHours());
        dt1.setMinutes(t1.getMinutes());
        dt2.setMinutes(t2.getMinutes());
        props.range.splice(0, 1, dt1);
        props.range.splice(1, 1, dt2);
      }
    }

    const readLesson = async (lessonItem: any) => {
      readModel.value.visible = true;
      readModel.value.oneLesson = lessonItem;
    };
    const showLesson = async (data?: any, rowa?: any, rowb?: any) => {
      if (props.mode === 'readOnly') { return ; }
      // 无新增权限
      if (!data && (storeUserInfo.user as any).role.privileges.indexOf(PRIVILEGE.courseRecordMng) < 0) { return; }
      if (form.value) {
        (form.value as ElForm).clearValidate();
      }
      if (data) {
        data = deepClone(data);
        showModal.value.type = 'update';
        // 转化 startLesson endLesson, appointDate
        if (data.startDt) {
          data.appointDate = new Date(data.startDt);
        }
        if (data.extend.lessons && data.extend.lessons.length > 0) {
          data.startLesson = data.extend.lessons[0];
          data.endLesson = data.extend.lessons[data.extend.lessons.length - 1];
        }
        // extend: lessons:[], clasz-班级, claszGroup-分组
        if (data.course) {
          data.course.programList = courseList.value.filter((item1: any) => item1.id === data.course.id)[0].programList;
        }
        if (!data.course) {
          data.course = {
            name: '',
            programList: undefined,
            id: null,
          };
        }
        if (!data.teacher) {
          data.teacher = {
            name: '',
            id: null,
          };
        }
      } else {
        // data = initForm();
        data = {
          course: {
            name: '',
            programList: undefined,
            id: null,
          },
          teacher: {
            name: '',
            id: null,
          },
          type: 0,
          stations: undefined,
          students: [],
          startLesson: rowb + 1,
          appointDate: weekSection.value.weekWithYeat[rowa],
          // startLesson: 1,
          program: {
            name: '',
            id: null,
          },
          extend: {
            lessonInt: undefined,
            appointRecord: {
              result: undefined,
            },
            lessons: undefined,
            clasz: null,
          },
        };
        showModal.value.type = 'add';
      }
      showModal.value.oneLesson = data;
      showModal.value.visible = true;
    };
    function setEndtimeValue() {
      showModal.value.oneLesson.endLesson = undefined;
    }
    function setGroupValue() {
      showModal.value.oneLesson.extend.claszGroup = undefined;
    }
    async function update() {
      if (props.mode === 'readOnly') { return ; }
      const valid = await (form.value as ElForm).validate();
      if (valid) {
        // 时间格式转化
        const lesson1 = lessonMap.value['lesson' + showModal.value.oneLesson.startLesson];
        const lesson2 = lessonMap.value['lesson' + showModal.value.oneLesson.endLesson];
        // extend: lessons:[], clasz-班级, claszGroup-分组
        showModal.value.oneLesson.extend.lessons = [];
        for (let i = showModal.value.oneLesson.startLesson; i <= showModal.value.oneLesson.endLesson; i++) {
          showModal.value.oneLesson.extend.lessons.push(i);
        }
        if (showModal.value.oneLesson.extend.clasz) {
          showModal.value.oneLesson.extend.clasz = showModal.value.oneLesson.extend.clasz;
        }
        if (showModal.value.oneLesson.extend.clasz) {
          showModal.value.oneLesson.extend.claszGroup = showModal.value.oneLesson.extend.claszGroup;
        }
        const params = {
          id: showModal.value.oneLesson.id,
          type: showModal.value.oneLesson.type,
          courseId: showModal.value.oneLesson.course ? showModal.value.oneLesson.course.id : null,
          programId: showModal.value.oneLesson.program ? showModal.value.oneLesson.program.id : null,
          teacherId: showModal.value.oneLesson.teacher ? showModal.value.oneLesson.teacher.id : null,
          studentJson: showModal.value.oneLesson.type === 2 && showModal.value.oneLesson.students && showModal.value.oneLesson.students.length > 0 ? JSON.stringify(showModal.value.oneLesson.students) : null,
          stationJson: showModal.value.oneLesson.type !== 0 && showModal.value.oneLesson.stations && showModal.value.oneLesson.stations.length > 0 ? JSON.stringify(showModal.value.oneLesson.stations) : null,
          start: transformDate(showModal.value.oneLesson.appointDate, lesson1[0]),
          end: transformDate(showModal.value.oneLesson.appointDate, lesson2[1]),
          extendJson: JSON.stringify(showModal.value.oneLesson.extend),
        };
        if (showModal.value.type === 'add') {
          await CourseRecordAdd(params);
          await setWeekSection(new Date(weekSection.value.weekStart));
        } else {
          if (showModal.value.oneLesson.startLesson === showModal.value.oneLesson.endLesson) {
            clearDiv();
          }
          await CourseRecordUpdate(params);
          await setWeekSection(new Date(weekSection.value.weekStart));
        }
        Message.success(`${showModal.value.type === 'add' ? '已增加课程记录' : '已修改课程记录'}`);
        showModal.value.visible = false;
        // showModal.value = [new Date(Date.now() - 3 * 24 * 3600000), new Date()];
      }
    }
    function transformDate(template: Date, timestamp: number): number {
      const dt = new Date(timestamp);
      dt.setFullYear(template.getFullYear());
      dt.setDate(template.getDate());
      dt.setMonth(template.getMonth());
      dt.setMilliseconds(0);
      return dt.getTime();
    }
    const deleteLesson = async (lessonItem: any) => {
      if (props.mode === 'readOnly') { return ; }
      const result = {id: lessonItem.id};
      await CourseRecordDel(result);
      clearDiv();
      await setWeekSection(new Date(weekSection.value.weekStart));
      Message.success('删除成功');
    };
    async function getOriginCourseRecordList(row: any) {
      const result = await CourseRecordList({start: row.value.weekStart, end: row.value.weekEnd + 86400000});
      function setThisDay(row: any) {
        if (row === 0) {
          return 7;
        } else {
          return row;
        }
      }
      if (result.length > 0) {
        for (const d of result) {
          // 课时矩阵
          originList.value.lessonsList[setThisDay(new Date(d.startDt).getDay()) - 1].lesson.splice(d.extend.lessons[0] - 1, 1, d);
        }
        // for (let i = 0; i < result.length; i++) {
        //   // 课时矩阵
        //   originList.value.lessonsList[setThisDay(new Date(result[i].startDt).getDay()) - 1].lesson.splice(result[i].extend.lessons[0] - 1, 1, result[i]);
        // }
        for (const d of result) {
          // if(document.getElementsByClassName('tabDiv').length===0) continue;
          // const str = document.getElementsByClassName('tabDiv')[setThisDay(new Date(result[i].startDt).getDay()) - 1].childNodes[result[i].extend.lessons[0] - 1] as HTMLElement;
          // 有课程时的高度
          // const str = document.getElementById((setThisDay(new Date(result[i].startDt).getDay())-1)+"-"+(result[i].extend.lessons[0] - 1)) as HTMLElement;
          // str.style.height = divHeight.value * result[i].extend.lessons.length + 'px';
          // 挤掉的div 隐藏
          for (let j = 0; j < d.extend.lessons.length - 1; j++) {
            // const str = document.getElementsByClassName('tabDiv')[setThisDay(new Date(result[i].startDt).getDay()) - 1].childNodes[result[i].extend.lessons[0] + j] as HTMLElement;
            const str1 = document.getElementById((setThisDay(new Date(d.startDt).getDay()) - 1) + '-' + (d.extend.lessons[0] + j)) as HTMLElement;
            str1.style.display = 'none';
          }
        }
      }
    }
    async function goLastWeek() {
      await setWeekSection(new Date(weekSection.value.weekStart - 86400000));
    }
    async function goNextWeek() {
      await setWeekSection(new Date(weekSection.value.weekEnd + 86400000));
    }
    function clearDiv() {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < courseCount.value.count.length; j++) {
          const str = document.getElementsByClassName('tabDiv')[i].childNodes[j] as HTMLElement;
          str.style.display = 'inline';
          //
          str.style.height = divHeight.value + 'px';
          str.style.lineHeight = 3.5 + 'rem';
        }
      }
    }
    async function setWeekSection(row: any) {
      if (!originList) { return ; }
      originList.value.lessonsList = [
        {lesson: []}, {lesson: []}, {lesson: []}, {lesson: []},
        {lesson: []}, {lesson: []}, {lesson: []},
      ];
      for (const d of courseCount.value.count) {
        originList.value.lessonsList[0].lesson.push('');
        originList.value.lessonsList[1].lesson.push('');
        originList.value.lessonsList[2].lesson.push('');
        originList.value.lessonsList[3].lesson.push('');
        originList.value.lessonsList[4].lesson.push('');
        originList.value.lessonsList[5].lesson.push('');
        originList.value.lessonsList[6].lesson.push('');
      }
      const result = getWeekDaysRange(row);
      for (let i = 0; i < result.length; i++) {
        weekSection.value.weekInFo[i] = result[i].getMonth() + 1 + '-' + result[i].getDate();
        weekSection.value.weekWithYeat[i] = result[i];
      }
      weekSection.value.weekStart = result[0].getTime();
      weekSection.value.weekEnd = result[6].getTime();
      await getOriginCourseRecordList(weekSection);
    }
    async function getCourseCount() {
      lessonMap.value = await SettingGet({onlyLesson: true});
      for (let i = 0; i < lessonMap.value.lessonNum; i++) {
        courseCount.value.count.push(i + 1);
      }
    }
    onMounted(useLoading(loading, async () => {
      await getCourseCount();
      await setWeekSection(props.dt ? props.dt : new Date());
      await Promise.all([
        courseList.value = await CourseList({
          containPrograms: true,
        }),
        programList.value = await ProgramList(),
        teacherList.value = await TeacherList(),
        stationList.value = await StationList({
          simple: true,
        }),
        classList.value = await ClassList(),
        otherStudentInClasz.value = await StudentList({
          forSelect: true,
        }),
      ]);
      courseAppointTypeList.value = [
        {id: 0, type: '正常课程'},
        {id: 1, type: '授课预约'},
        {id: 2, type: '个人预约'},
      ];
    }));
    return {
      originList, clearDiv,
      goLastWeek: useLoading(loading, goLastWeek),
      goNextWeek: useLoading(loading, goNextWeek),
      weekSection, setGroupValue,
      loading, courseList, programList, stationList,
      teacherList, otherStudentInClasz, classList,
      lessonMap, storeUserInfo, PRIVILEGE, isStudent,
      oneDay, courseCount, setEndtimeValue,
      list: useLoading(loading, list),
      weeks, showColor, noShowColor,
      digital2Chinese, setTeacherValue,
      lessons,
      readLesson,
      readModel,
      form,
      showModal,
      showLesson,
      update,
      deleteLesson: useConfirm('确认删除？', useLoading(loading, deleteLesson)),
      color,
      tableX,
      tableY,
      courseAppointTypeList, divHeight, choose,
    };
  },
});
</script>
<style scoped lang="scss">
  .course-list-order {
    position: relative;
    height: calc(100% - 2px);
    line-height: 3.5rem;
    text-align: center;
    width: calc(100% - 2px);
    left: 1px;
    top: 1px;
    .el-button {
      display: none;
      color: #000;
    }
    &:hover .el-button {
      display: inline-block;
    }
  }

  .course-list-title {
    color: black;
    border: 1px solid black;
    width: 110px;
    height: 40px;
    background-color: rgb(226, 243, 250);
    text-align: center;
    line-height: 2.5rem;
  }

  .titleb {
    color: black;
    border: 1px solid black;
    background-color: rgb(226, 243, 250);
    width: 110px;
    height: 45px;
    text-align: center;
    line-height: 3.5rem;
  }

  .course-list-content {
    border: 1px solid black;
    height: 45px;
    width: 110px;
    text-align: center;
  }

  .some {
    width: 100%;
  }
</style>
