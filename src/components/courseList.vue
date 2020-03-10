<template>
  <div v-loading="loading">
    <div class="flex center" style="margin: 5px 10px">
      <div class="flex align-center" style="margin-right: 10px">
        <el-date-picker v-model="oneDay" type="date" placeholder="选择日期"></el-date-picker>
        <el-button style="margin-left: 10px" type="primary" @click="list()">跳转日期</el-button>  
        <el-button style="margin-left: 10px" type="primary"  icon="el-icon-arrow-left" @click="clearDiv();goLastWeek()">上一周</el-button>
        <el-button style="margin-left: 10px" type="primary" @click="clearDiv();goNextWeek()">下一周<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </div>
    </div>

    <div style="margin: 7px;">
      <div class="flex center">
        <div style="margin: 10px">
          <span style="display: inline-block;margin: 0 5px;border-radius: 10px;width: 10px;height: 10px;background-color: rgb(142, 208, 214)"></span>
          <span>计划内课程</span>
          <span style="display: inline-block;margin: 0 5px;border-radius: 10px;width: 10px;height: 10px;background-color: rgb(244,213,71)"></span>
          <span>授课预约</span>
          <span style="display: inline-block;margin: 0 5px;border-radius: 10px;width: 10px;height: 10px;background-color: rgb(197,150,196)"></span>
          <span>个人预约</span>
        </div>
      </div>
      <div class="flex center">
        <div>
          <div class="flex" style="width:inherit">
            <div class="title" v-for="(weekNum, weekIndex) in weeks.length+1" :key="weekIndex">
                {{weekIndex===0?'时间':weekSection.weekInFo[weekIndex-1] + ' ' + '周' + digital2Chinese(weekIndex-1, 'week')}}
            </div>
          </div>
          <div class="flex" style="width:inherit">
            <div class="flex column">
              <div class="titleb" v-for="i in courseCount.count" :key="i">
                {{`第 ${i} 节课`}}
              </div>
            </div>
            <div class="flex column tabDiv" v-for="(item,i) in originList.lessonsList" :key="i">
              <div
                class="content" @click="setSomething(i,ii);" v-for="(itemb,ii) in originList.lessonsList[i].lesson"
                :style="{'background-color': itemb != ''? (itemb.type===0?
                'rgb(142, 208, 214)':(itemb.type===1?
                'rgb(244,213,71)':(itemb.type===2?
                'rgb(197,150,196)':'white'))):'white'}" :key="ii" style="cursor: pointer;" >
                  <div v-if="!itemb" >
                    <div class='order' @click='showLesson()' @mousemove="showColor($event)" @mouseleave="noShowColor($event)">
                      <!-- <el-button size='mini' @click='showLesson()'>预约</el-button> -->
                    </div>
                  </div>  
                    <el-popover
                      placement="top-start"
                      width="50"
                      v-if="itemb.course"
                      >
                      <div style="color:#67C23A;width:6rem;" @click="readLesson(itemb)">
                        <i class="el-icon-reading"/>
                        <span  style="margin-left:5px;cursor: pointer;">查看</span>
                      </div>
                      <div style="color:#67a1ff;width:6rem;" @click='showLesson(itemb)'>
                        <i class="el-icon-edit"/>
                        <span  style="margin-left:5px;cursor: pointer;">修改</span>
                      </div>
                      <div style="color:#F56C6C;width:6rem;" @click="delectLesson(itemb)">
                        <i class="el-icon-delete"/>
                        <span  style="margin-left:5px;cursor: pointer;">删除</span>
                      </div>
                      <!-- <div style="color:#E6A23C;width:6rem;" @click="delayLesson(lessonItem)">
                        <i class="el-icon-takeaway-box"></i>
                        <span  style="margin-left:5px">延长课时</span>
                      </div> -->
                      <div style="width:100%;height:100%;" slot="reference" class="flex center column">
                        <!-- <div>
                          {{itemb.course?
                          (itemb.type===0?itemb.course.name + new Date(itemb.startDt).getHours() + ':' + new Date(itemb.startDt).getMinutes() + itemb.endDt:''):
                          ''}}
                        </div> -->
                        <div style="line-height:32px">
                          {{itemb.course?itemb.course.name:''}}
                        </div>
                        <div style="line-height:32px">
                          {{itemb.type===0?itemb.teacher.name:(itemb.type===0?itemb.teacher.name:'')}}
                        </div>
                        <div style="line-height:32px">
                          {{itemb.type != null ? new Date(itemb.startDt).getHours() + ':' + new Date(itemb.startDt).getMinutes() +'-'+
                          new Date(itemb.endDt).getHours() + ':' + new Date(itemb.endDt).getMinutes():''}}
                        </div>
                      </div>
                    </el-popover>
                            
                </div>
            </div>
          </div>
        </div> 
      </div>
    </div>
    
    <div class="class-table">
      <el-dialog
      :visible.sync="readModel.visible"
      :modal="readModel.oneLesson"
      title="课程信息查看"
      >
           <div class="flex center column">
               <el-form label-width="110px" label-position="left">
                  <el-form-item label="课程名称：" v-if="readModel.oneLesson.course">
                    <span>{{readModel.oneLesson.course.name}}</span>
                  </el-form-item>
                  <el-form-item label="授课教师：" v-if="readModel.oneLesson.teacher">
                    <span>{{ readModel.oneLesson.teacher.name }}</span>
                  </el-form-item>
                  <el-form-item label="上课班级：" v-if="readModel.oneLesson">
                    <span>{{ readModel.oneLesson.clasz.name  }}</span>
                  </el-form-item>
                  <!-- <el-form-item label="上课小组：" v-if="readModel.oneLesson">
                    <span>{{ readModel.oneLesson.claszGroup.name }}</span>
                  </el-form-item> -->
                  <el-form-item label="实验名称：" v-if="readModel.oneLesson.course">
                    <!-- <div v-for="(item,i) in readModel.oneLesson.program.name" :key='i'> -->
                      <span>{{ readModel.oneLesson.program.name }}</span>
                    <!-- </div> -->
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
      </el-dialog>
    <kit-dialog-simple
      :modal="showModal"
      :confirm="update"
      width="500px">
      <div slot='title'>{{showModal.oneLesson.id?'修改':'预约'}}课程</div>
      <el-form  v-if="showModal.oneLesson" ref="form" :model="showModal.oneLesson" label-width="160px" label-position="left">
        <el-form-item label="排课类型：" prop="type" :rules="{ required: true, message: '请输入课程名称', }">
          <!-- trigger: 'none' -->
          
                <!-- v-if="(item.id!==1&&item.id!==2) || !isStudent()" -->
          <el-select v-model="showModal.oneLesson.type" >
            <el-option
                v-for="item of courseAppointTypeList"
                :key="item.id"
                :label="item.type"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择课程：" prop="course.name" 
          :rules="showModal.oneLesson.type&&showModal.oneLesson.type!=1&&showModal.oneLesson.type!=2 ? { required: true, message: '请选择课程'} : { required: false}">
          <el-select filterable v-model="showModal.oneLesson.course" value-key="id">
          <el-option
              v-for="item of courseList"
              :key="item.id"
              :label="item.name"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="选择实验：" prop="program.name" v-if="showModal.oneLesson.type&&showModal.oneLesson.type!=0">
          <el-select filterable v-model="showModal.oneLesson.program" value-key="id">
            <el-option
              v-for="item of showModal.oneLesson.course ? showModal.oneLesson.course.programList : programList"
              :key="item.id"
              :label="item.name"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="选择教师：" prop="teacher.name" 
          :rules="showModal.oneLesson.type&&showModal.oneLesson.type!=1&&showModal.oneLesson.type!=2 ? { required: true, message: '请选择教师'} : { required: false}">
          <el-select filterable v-model="showModal.oneLesson.teacher.name" value-key="id">
            <el-option
              v-for="item of teacherList"
              :key="item.id"
              :label="item.name"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="上课班级：" prop="extend.clasz" 
          :rules="showModal.oneLesson.type&&showModal.oneLesson.type!=1&&showModal.oneLesson.type!=2? { required: true, message: '请选择班级'} : { required: false}"
          v-if="showModal.oneLesson.type&&showModal.oneLesson.type!=2">
          <el-select filterable v-model="showModal.oneLesson.extend.clasz">
            <el-option
              v-for="item of classList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="选择组别：" prop="extend.claszGroup" 
         v-if="showModal.oneLesson.type&&showModal.oneLesson.type!=2&&showModal.oneLesson.type!=0">
          <el-select filterable v-model="showModal.oneLesson.extend.claszGroup">
            <el-option
              v-for="item of showModal.oneLesson.extend.clasz?(classList.filter(item1 => {return item1.id === showModal.oneLesson.extend.clasz}))[0].groups:[]"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="选择操作台：" prop="stations"
          :rules="showModal.oneLesson.type&&showModal.oneLesson.type!=0&&showModal.oneLesson.type!=1 ? { required: true, message: '请选择操作台'} : { required: false}"
          v-if="showModal.oneLesson.type&&showModal.oneLesson.type!=0">
          <el-select filterable v-model="showModal.oneLesson.stations" multiple collapse-tags>
            <el-option
              v-for="item of stationList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="课时：" prop="extend.lessons">
          <el-input v-model="showModal.oneLesson.extend.lessons"/>
        </el-form-item> -->
        <el-form-item label="选择预约日期：" prop="appointDate" :rules="{ required: true, message: '请选择预约日期'}">
          <el-date-picker v-model="showModal.oneLesson.appointDate" type="date"/>
        </el-form-item>
        <el-form-item label="选择开始课时：" prop="startLesson" :rules="{ required: true, message: '请选择开始课时'}">
          <el-select v-model="showModal.oneLesson.startLesson" id='setStarta'>
            <el-option id='setStart'
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
        <el-form-item label="选择其他参与人：" 
          v-if="showModal.oneLesson.type&&showModal.oneLesson.type != 1&&showModal.oneLesson.type != 0" prop="students">
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
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted, createComponent } from '@vue/composition-api';
import { useSearch, useLoading, useConfirm } from 'web-toolkit/src/service';
import { Message } from 'element-ui';
import { ElForm } from 'element-ui/types/form';
import { isUndefined, deepClone } from 'web-toolkit/src/utils';
import {storeUserInfo} from 'web-toolkit/src/case-main';
import { getWeekDaysRange } from 'web-toolkit/src/utils/date';
import { CourseRecordList } from '../dao/courseRecordDao';
import { SettingGet } from '../dao/settingDao';
import {CourseList, ProgramList} from '@/dao/courseProgramDao';
import {TeacherList, StudentList, ClassList} from '@/dao/userDao';
import {StationList} from '@/dao/stationDao';
import {Department} from '@/types/privilege';
import {CourseRecordAdd,CourseRecordUpdate,CourseRecordDel} from '@/dao/courseRecordDao'
export default createComponent({
  name: 'courseList',
  props: { },
  // props 父组件传过来的东西  ctx 相当于子组件的this（cts.$emit()）
  setup(props: any, ctx: any) {
    // 已经处理后的课程排列，按照第几节课排列
    // 访问各种设置
    const loading = ref(false);
    // 学期选择列表
    const terms = ref({});
    const oneDay = ref<any>();
    const isshow = ref(false);
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
      weekInFo:[],
      weekWithYeat:[],
    });
    function isStudent(): boolean {
      return (storeUserInfo.user as any).role.department.id === Department.Student;
    }
    // 查看标志a
    const readModel = ref<any>(
      {
        visible: false,
        oneLesson: '',
      });
    const showModal = ref<any>(
      {
        visible: false,
        oneLesson: '',
        type: 'add',
      });
    const form = ref<ElForm|null>(null);
    // 查询函数
    async function list() {
      if(oneDay.value===undefined||oneDay.value===null){
        alert('请选择日期')
      }
      else{
        clearDiv();
        await setWeekSection(new Date(oneDay.value))
      }
    }
    const lessons = ref<any>();
    const originList = ref<any>({
      lessonsList: [
        {lesson: [1,2,3,4,5,6,7,8,9,10,11,12,]},
        {lesson: [13,14,15,16,17,18,19,20,21,22,23,24,]},
        {lesson: [25,26,27,28,29,30,31,32,33,34,35,36,]},
        {lesson: [37,38,39,40,41,42,43,44,45,46,47,48,]},
        {lesson: [49,50,51,52,53,54,55,56,57,58,59,60,]},
        {lesson: [61,62,63,64,65,66,67,68,69,70,71,72,]},
        {lesson: [73,74,75,76,77,78,79,80,81,82,83,84,]},
      ],
    });
    const weeks = ref(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
    function digital2Chinese(num: any, identifier: any) {
      const character = ['一', '二', '三', '四', '五', '六'];
      return identifier === 'week' && num === 6 ? '日' : character[num];
    }
    function showColor(row:any){
      const result = row.srcElement
      result.style.backgroundColor='Gainsboro'
    }
    function noShowColor(row:any){
      const result = row.srcElement
      result.style.backgroundColor='white'
    }
    const newList = async () => {

    };
    const readLesson = async (lessonItem: any) => {
        readModel.value.visible = true;
        readModel.value.oneLesson = lessonItem;
    };
    const showLesson = async (data?: any) => {
      if (form.value) {
        (form.value as ElForm).clearValidate();
      }
      if (data) {
        data = deepClone(data);
        showModal.value.type = 'update';
        // 转化 startLesson endLesson, appointDate
        if (data.startDt) { data.appointDate = new Date(data.startDt); }
        if (data.extend.lessons && data.extend.lessons.length > 0) {
          data.startLesson = data.extend.lessons[0];
          data.endLesson = data.extend.lessons[data.extend.lessons.length - 1];
        }
        // extend: lessons:[], clasz-班级, claszGroup-分组
      } else {
        // data = initForm();
        data={
          course: {
            name: '',
            programList: undefined,
          },
          teacher: {
            name: '',
          },
          type: undefined,
          stations: undefined,
          students: '',
          startLesson:showModal.value.oneLesson.startLesson,
          appointDate:showModal.value.oneLesson.appointDate,
          extend: {
            lessonInt: undefined,
            appointRecord: {
              result: undefined,
              },
            lessons: undefined,
            clasz: '',
          },
        };
        showModal.value.type = 'add';
      }
      showModal.value.oneLesson  = data;
      showModal.value.visible = true;
    };
    async function update() {
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
        if (showModal.value.oneLesson.clasz) {
          showModal.value.oneLesson.extend.clasz = showModal.value.oneLesson.clasz.id;
        }
        if (showModal.value.oneLesson.claszGroup) {
          showModal.value.oneLesson.extend.claszGroup = showModal.value.oneLesson.claszGroup.id;
        }
        const params = {
          id: showModal.value.oneLesson.id,
          type: showModal.value.oneLesson.type,
          courseId: showModal.value.oneLesson.course ? showModal.value.oneLesson.course.id : null,
          programId: showModal.value.oneLesson.program ? showModal.value.oneLesson.program.id : null,
          teacherId: showModal.value.oneLesson.teacher ? showModal.value.oneLesson.teacher.id : null,
          studentJson: showModal.value.oneLesson.students && showModal.value.oneLesson.students.length > 0 ? JSON.stringify(showModal.value.oneLesson.students) : null,
          stationJson: showModal.value.oneLesson.stations && showModal.value.oneLesson.stations.length > 0 ? JSON.stringify(showModal.value.oneLesson.stations) : null,
          start: transformDate(showModal.value.oneLesson.appointDate, lesson1[0]),
          end: transformDate(showModal.value.oneLesson.appointDate, lesson2[1]),
          extendJson: JSON.stringify(showModal.value.oneLesson.extend),
        };
        if (showModal.value.type === 'add') {
          await CourseRecordAdd(params);
          await setWeekSection(new Date(weekSection.value.weekStart));
        } else {
          await CourseRecordUpdate(params);
          await setWeekSection(new Date(weekSection.value.weekStart));
        }
        Message.success(`${showModal.value.type === 'add' ? '已申请预约' : '已修改预约'}`);
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
    const delectLesson = async (lessonItem: any) => {
      const result = {id: lessonItem.id}
      await CourseRecordDel(result)
      await setWeekSection(new Date(weekSection.value.weekStart));
      Message.success('删除成功');
    };
    const delayLesson = async (lessonItem: any) => {
      Message.success('成功延长一小时');
    };
    async function cheakIt(row: any) {
      // const sum = <HTMLElement>document.getElementsByClassName('textCell')[row]
      // sum.style.height=100+'px'
      // console.log(row)
    }
    async function getOriginCourseRecordList(row: any) {
      const result = await CourseRecordList({start: row.value.weekStart, end: row.value.weekEnd + 86400000});
      function setThisDay(row: any) {
        if (row === 0) {
          return 7;
        } else {
          return row;
        }
      }
      if( result.length!=0){
        for(let i=0;i<result.length;i++){
          originList.value.lessonsList[setThisDay(new Date(result[i].startDt).getDay())-1].lesson.splice(result[i].extend.lessons[0]-1,1,result[i])
          const str =<HTMLElement>document.getElementsByClassName('tabDiv')[setThisDay(new Date(result[i].startDt).getDay())-1].childNodes[result[i].extend.lessons[0]-1];
          str.style.height=50*result[i].extend.lessons.length+'px'
          // str.style.lineHeight=3.5*result[i].extend.lessons.length+'rem'
          console.log(result[i])
          for(let j=0;j<result[i].extend.lessons.length-1;j++){
            const str =<HTMLElement>document.getElementsByClassName('tabDiv')[setThisDay(new Date(result[i].startDt).getDay())-1].childNodes[result[i].extend.lessons[0]+j];
            str.style.display='none'
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
    async function setSomething(this:any,rowa:any,rowb:any){
      showModal.value.oneLesson.appointDate=weekSection.value.weekWithYeat[rowa]
      showModal.value.oneLesson.startLesson=rowb+1
    }
    async function clearDiv(){
      for(let i=0;i<7;i++){
        for(let j=0;j<courseCount.value.count.length;j++){
          const str =<HTMLElement>document.getElementsByClassName('tabDiv')[i].childNodes[j];
          str.style.display='inline'
          str.style.height=50+'px'
          str.style.lineHeight=3.5+'rem'
        }
      }
    }
    async function setWeekSection(row:any){
      originList.value.lessonsList=[
        {lesson: []},{lesson: []},{lesson: []},{lesson: []},
        {lesson: []},{lesson: []},{lesson: []},
      ]
      for(let i=0;i<courseCount.value.count.length;i++){
        originList.value.lessonsList[0].lesson.push('');
        originList.value.lessonsList[1].lesson.push('');
        originList.value.lessonsList[2].lesson.push('');
        originList.value.lessonsList[3].lesson.push('');
        originList.value.lessonsList[4].lesson.push('');
        originList.value.lessonsList[5].lesson.push('');
        originList.value.lessonsList[6].lesson.push('');
      }
      const result = getWeekDaysRange(row)
      for(let i=0;i<result.length;i++){
        weekSection.value.weekInFo[i]=result[i].getMonth()+1+'-'+result[i].getDate()
        weekSection.value.weekWithYeat[i]=result[i].getFullYear()+'-'+(1+result[i].getMonth())+'-'+result[i].getDate()
      }
      weekSection.value.weekStart = result[0].getTime()
      weekSection.value.weekEnd = result[6].getTime()
      getOriginCourseRecordList(weekSection)
    }
    async function getCourseCount(){
      const result = await SettingGet({onlyLesson:true})
      
      for(let i=0;i<result.lessonNum;i++){
        courseCount.value.count.push(i+1)
      }

    }
    onMounted(useLoading(loading, async () => {
      await Promise.all([
        await getCourseCount(),
        await setWeekSection(new Date()),
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
      courseAppointTypeList.value = [
        {id: 0, type: '正常课程'},
        {id: 1, type: '授课预约'},
        {id: 2, type: '个人预约'},
      ];
    }));
    return{
      getOriginCourseRecordList, originList, clearDiv,
      setWeekSection, goLastWeek, goNextWeek, weekSection,
      loading, cheakIt, courseList, programList, stationList,
      teacherList, otherStudentInClasz, classList,
      lessonMap,storeUserInfo,isStudent,
      oneDay, courseCount,setSomething,
      list: useLoading(loading, list),
      weeks,showColor,noShowColor,
      digital2Chinese,
      lessons,
      readLesson,
      readModel,
      form,
      showModal,
      showLesson,
      update,
      delectLesson: useConfirm('确认删除？', useLoading(loading, delectLesson)),
      delayLesson: useConfirm('确认延长一课时？', useLoading(loading, delayLesson)),
      isshow,
      color,
      tableX,
      tableY,
      courseAppointTypeList,
    };
  },
});
function initForm(): any {
  return {
    course: {
      name: '',
      programList: undefined,
    },
    teacher: {
      name: '',
    },
    type: undefined,
    stations: undefined,
    students: '',
    extend: {
      lessonInt: undefined,
      appointRecord: {
        result: undefined,
        },
      lessons: undefined,
      clasz: '',
    },
  };
}
</script>
<style scoped lang="scss">
  .order {
    position: relative;
    height: 2.5rem;
    line-height: 3.5rem;
    text-align: center;
    width: 147px;
    left: 1px;
    top: 1px;
    height: 47px;
    // vertical-align: middle;

  }
  .order .el-button{
    display: none;
    color: #000;
  }
  .order:hover .el-button{
    display: inline-block;
  }
  .title{
    color: black;
    border: 1px solid black;
    width: 150px;
    height: 40px;
    // background-color: rgb(214,236,250);
    text-align: center;
    line-height:2.5rem;
  }
  .titleb{
    color: black;
    border: 1px solid black;
    width: 150px;
    height: 50px;
    text-align: center;
    line-height:3.5rem;
  }
  .content{
    border: 1px solid black;
    width: 150px;
    height: 50px;
    text-align: center;
    // line-height:3.5rem;
  }
</style>
