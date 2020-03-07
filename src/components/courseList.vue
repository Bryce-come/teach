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
                class="content" v-for="(itemb,ii) in originList.lessonsList[i].lesson"
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
                  <el-form-item label="参与学生：" v-if="readModel.oneLesson">
                    <span>{{ readModel.oneLesson.students  }}</span>
                  </el-form-item>
                  <el-form-item label="实验名称：" v-if="readModel.oneLesson.course">
                    <div v-for="(item,i) in readModel.oneLesson.course.programList" :key='i'>
                      <span>{{ item }}</span>
                    </div>
                  </el-form-item>
                  <el-form-item label="上课时间：" v-if="readModel.oneLesson.extend">
                    <span>{{  readModel.oneLesson.extend.lessons.length+'课时' }}</span>
                  </el-form-item>
                  <el-form-item label="操作台：" v-if="readModel.oneLesson">
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
      <el-form  v-if="showModal.oneLesson" ref="form" :model="showModal.oneLesson" label-width="120px" label-position="left" class="flex column between" style="width: 400px;margin: 0 auto">
        <el-form-item label="预约类型：" prop="type" :rules="{ required: true, message: '请输入课程名称', trigger: 'none' }">
          <el-select v-model="showModal.oneLesson.type" style="width:300px" :clearable="false" placeholder="请选择预约类型">
            <el-option
                v-for="item of courseAppointTypeList"
                :key="item.id"
                :label="item.type"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程名称：" prop="course.name" :rules="{ required: true, message: '请输入课程名称', trigger: 'none' }">
          <el-input style="width:300px" v-model="showModal.oneLesson.course.name"/>
        </el-form-item>
        <el-form-item label="授课教师：" prop="teacher.name">
          <el-input style="width:300px" v-model="showModal.oneLesson.teacher.name"/>
        </el-form-item>
        <el-form-item label="上课班级：" prop="extend.stations">
          <el-input style="width:300px" v-model="showModal.oneLesson.extend.clasz"/>
        </el-form-item>
        <el-form-item label="实验项目：" prop="course.programList">
          <el-input style="width:300px" v-model="showModal.oneLesson.course.programList"/>
        </el-form-item>
        <el-form-item label="课时：" prop="extend.lessons">
          <el-input style="width:300px" v-model="showModal.oneLesson.extend.lessons"/>
        </el-form-item>
        <el-form-item label="实验台：" prop="extend.stations">
          <el-input style="width:300px" v-model="showModal.oneLesson.extend.stations"/>
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
import { getWeekDaysRange } from 'web-toolkit/src/utils/date';
import { CourseRecordList } from '../dao/courseRecordDao';
import { SettingGet } from '../dao/settingDao';
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
    });
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
    const moreSetting = ref({
      lessonNum: 7,
    });
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
    const showLesson = async (lessonItem?: any) => {
      if (form.value) { (form.value as ElForm).clearValidate(); }
      if (lessonItem) {
        lessonItem = deepClone(lessonItem);
      } else {
        lessonItem = initForm();
      }
      showModal.value.oneLesson = lessonItem;
      showModal.value.visible = true;
    };
    async function update() {
      const valid = true;
      if (valid) {
       const { course, teacher, type, stations, students, extend } = showModal.value.customer;
       showModal.value.visible = false;
       Message.success(`${isUndefined(course) ? '添加' : '修改'}成功`);
       await newList();
      }
    }
    const delectLesson = async (lessonItem: any) => {
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
        weekSection.value.weekInFo[i]=result[i].getMonth()+1+'/'+result[i].getDate()
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
      await getCourseCount();
      await setWeekSection(new Date());
      courseAppointTypeList.value = [
        {id: '0', type: '正常课程'},
        {id: '1', type: '授课预约'},
        {id: '2', type: '个人预约'},
      ];
    }));
    return{
      getOriginCourseRecordList, originList, clearDiv,
      setWeekSection, goLastWeek, goNextWeek, weekSection,
      loading, cheakIt,
      oneDay, courseCount,
      list: useLoading(loading, list),
      weeks,showColor,noShowColor,
      digital2Chinese,
      lessons,
      moreSetting,
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
    height: 2.5rem;
    line-height: 3.5rem;
    text-align: center;
    width: 148px;
    left: 1px;
    top: 1px;
    height: 48px;
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
