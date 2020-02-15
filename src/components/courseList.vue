<template>
  <div v-loading="loading">
    <div class="flex center" style="margin: 5px 10px">
      <div class="flex align-center" style="margin-right: 10px">
        <span>请输入要查询的日期：</span>
        <lkt-date-picker v-model="oneDay" type="datetime" format="yyyy-MM-dd HH:mm" :clearable="false"/>
        <el-button style="margin-left: 10px" type="primary" @click="list()">查询</el-button>        
      </div>
    </div>
    <div class="class-table">
      <div class="flex center">
        <div style="margin: 10px">
          <span style="display: inline-block;margin: 0 5px;border-radius: 10px;width: 10px;height: 10px;background-color: rgb(142, 208, 214)"></span>
          <span>计划内课程</span>
          <span style="display: inline-block;margin: 0 5px;border-radius: 10px;width: 10px;height: 10px;background-color: rgb(233, 233, 224)"></span>
          <span>已预约课程</span>
          <span style="display: inline-block;margin: 0 5px;border-radius: 10px;width: 10px;height: 10px;background-color: rgb(248, 244, 8)"></span>
          <span>新预约课程</span>
        </div>
      </div>
      <div class="flex end" style="margin-right: 10%;margin-bottom:10px">
          <el-button-group>
            <el-button type="primary" size="small" icon="el-icon-arrow-left">上一周</el-button>
            <el-button type="primary" size="small">下一周<i class="el-icon-arrow-right el-icon--right"></i></el-button>
          </el-button-group>
        </div>
      <table>
        <thead>
          <tr>
            <th>时间</th>
            <th v-for="(weekNum, weekIndex) in weeks.length" :key="weekIndex">
            {{'周' + digital2Chinese(weekIndex, 'week')}}
            </th>
          </tr>
        </thead>
        <tbody>
           <tr v-for="(item,i) in lessons" :key="i">
             <th>
               <div>第<span>{{i+1}}</span>节课</div>
             </th>
             <td v-for="(lessonItem, j) in item.lesson" :key="j" 
                 :rowspan="lessonItem != ''? lessonItem.extend.lessonInt:''"
                 :style="{'background-color': lessonItem != ''? getColors(lessonItem,'rgb(142, 208, 214)'):'white'}">
                  <!-- <div v-if="lessonItem" slot="reference">{{lessonItem.name}}</div> -->
                <el-popover
                  placement="top-start"
                  width="50"
                  >
                  <div style="color:#67C23A;width:6rem;" @click="readLesson(lessonItem)">
                    <i class="el-icon-reading"></i>
                    <span  style="margin-left:5px">查看</span>
                  </div>
                  <div style="color:#67a1ff;width:6rem;">
                    <i class="el-icon-edit"></i>
                    <span  style="margin-left:5px">修改</span>
                  </div>
                  <div style="color:#F56C6C;width:6rem;">
                    <i class="el-icon-delete"></i>
                    <span  style="margin-left:5px">删除</span>
                  </div>
                  <div style="color:#E6A23C;width:6rem;">
                    <i class="el-icon-takeaway-box"></i>
                    <span  style="margin-left:5px">延长课时</span>
                  </div>
                  <div style="width:100%;height:100%" slot="reference">
                    <div>
                       {{lessonItem?lessonItem.course.name:''}}
                    </div>
                    </div>
                  </el-popover>
               <div v-if="!lessonItem">
                 <div class='order'><el-button size='mini'>预约</el-button></div>
               </div>
             </td>
           </tr>
        </tbody>
      </table>
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
    </div>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted, createComponent} from '@vue/composition-api';
import {useSearch, useLoading, useConfirm} from 'web-toolkit/src/service';
export default createComponent({
  name: 'courseList',
  props:{ },
  // props 父组件传过来的东西  ctx 相当于子组件的this（cts.$emit()）
  setup(props: any, ctx: any) {
    // 已经处理后的课程排列，按照第几节课排列
    // 访问各种设置
    const loading = ref(false);
    // 学期选择列表
    const terms = ref({});
    const oneDay = ref();
    // 查看标志
    const readModel = ref<any>(
      {
        visible: false,
        oneLesson: '',
      }); 
    // 查询函数
    async function list() {};
    const more_setting = ref({
      lessonNum: 7,
    });
    const lessons = ref<any>();
    function getColors(lessonOne: any, defaultColor: any) {
      const type = lessonOne.type;
      if(type === 0 || lessonOne ==='') {
        return defaultColor;
        // rgb(142, 208, 214) 计划内课程
      }
      else if(type == 1 || type == 2) {
        const result = lessonOne.extend.appointRecord.result;
        if(result === 2) {
          // 已预约课程
          defaultColor = 'rgb(233, 233, 224)';
        }
        else if(result === 1) {
         // 新预约课程
          defaultColor = 'rgb(248, 244, 8)';
        }
        return defaultColor;
     }
    };
    const weeks = ref(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
    function digital2Chinese(num: any, identifier: any) {
      const character = ['零', '一', '二', '三', '四', '五', '六', '七'];
      return identifier === 'week' && (num === 0 || num === 7) ? '日' : character[num];
    } 
    //重新排列数据
    const newList = async () => {
      lessons.value = [
        {lesson: ['', '', '', 
          {
            course: { 
              name: '自动化课程1',
              programList: ['切刀挂刀操作'] },
            teacher: {
              name: '玛丽'},
            type: 1,
            stations: ['操作台1'],
            students: '马丽',
            extend: {
              lessonInt: 3,
              appointRecord: {result:1},
              lessons:[1,2,3],
              class:'自动化1801'}
          }, '', '', '']},
        {lesson:['', '', '', '', '', '']},
        {lesson:['', '', '', '', '', '']},
        {lesson:['', '', '', '', '', 
          {
            course: { 
              name: '自动化课程2',
              programList: ['切刀挂刀操作'] },
            teacher: {
              name: '玛丽'},
            type: 0,
            stations: ['操作台1'],
            students: '马丽',
            extend: {
              lessonInt: 1,
              lessons:[4],
              class:'自动化1801'}
          }, '']},
        {lesson:['', '', '', '', '',
          {
            course: { 
              name: '自动化课程3',
              programList: ['切刀挂刀操作'] },
            teacher: {
              name: '玛丽'},
            type: 1,
            stations: ['操作台1'],
            students: '马丽',
            extend: {
              lessonInt: 1,
              appointRecord: {result:2},
              lessons:[5],
              class:'自动化1801'}
          }, '']},
        {lesson:['', '', '', '', '', '', '']},
        {lesson:['', 
          {
            course: { 
              name: '自动化课程4',
              programList: ['切刀挂刀操作'] },
            teacher: {
              name: '玛丽'},
            type: 2,
            stations: ['操作台1'],
            students: '马丽',
            extend: {
              lessonInt: 1,
              appointRecord: {result:1},
              lessons:[7],
              class:'自动化1801'}
          }, '', '', '', '', '']},
      ]
    };
    const readLesson = async(lessonItem: any) => {
        readModel.value.visible = true;
        readModel.value.oneLesson = lessonItem;
    };
   onMounted(useLoading(loading, async () => {
      await newList();
    }));
    return{
      loading,
      oneDay: new Date,
      list: useLoading(loading, list),
      weeks,
      digital2Chinese,
      lessons,
      more_setting,
      getColors,
      readLesson,
      readModel,
    };
  },
});
</script>
<style scoped lang="scss">
  .class-table {
    margin: 7px;
    table {
      background-color: rgb(32, 38, 97);
      table-layout:fixed;
      margin: auto;
      width: 80%;
      thead {
        background-color:#67a1ff  ;
        th {
          color: #fff;
          line-height: 2.5rem;
          font-weight: normal;
        }
      }
    }
    tbody{
      tr {
        th {
          color: #fff;
          background-color:#67a1ff ;
          line-height: 3.5rem;
          font-weight: lighter;
          text-align: center;
          vertical-align: middle;
        }
        td {
          // background-color:rgb(142, 208, 214) ;
          line-height: 3.5rem;
          font-weight: lighter;
          text-align: center;
          vertical-align: middle;         
          .order {
            height: 2.5rem;
            width: 5rem;
            text-align: center;
            vertical-align: middle;
          }
          .order .el-button{
            display: none;
          }
          .order:hover .el-button{
            display: inline-block;
          }
        }
      }
    }
  }
</style>