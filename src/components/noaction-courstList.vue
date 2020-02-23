<template>
  <div v-loading="loading">
    <div class="flex center" style="margin: 5px 10px">
      <div class="flex align-center" style="margin-right: 10px">
        <lkt-date-picker v-model="oneDay"/>
        <el-button style="margin-left: 10px" type="primary" @click="list()">跳转日期</el-button>        
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
      <table id="tabs">
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
                 :style="{'background-color': lessonItem != ''? getColors(lessonItem,'rgb(142, 208, 214)'):'white'}"
                 >
                  <!-- <div v-if="lessonItem" slot="reference">{{lessonItem.name}}</div> -->
                  <div style="width:100%;height:100%">
                    <div>
                       {{lessonItem?lessonItem.course.name:''}}
                    </div>
                 </div>
             </td>
           </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted, createComponent } from '@vue/composition-api';
import { useSearch, useLoading, useConfirm } from 'web-toolkit/src/service';
import { Message } from 'element-ui';
import { ElForm } from 'element-ui/types/form';
import { isUndefined, deepClone } from 'web-toolkit/src/utils';
export default createComponent({
  name: 'noactionCourseList',
  props: { },
  // props 父组件传过来的东西  ctx 相当于子组件的this（cts.$emit()）
  setup(props: any, ctx: any) {
    // 已经处理后的课程排列，按照第几节课排列
    // 访问各种设置
    const loading = ref(false);
    const oneDay = ref();
    const isshow = ref(false);
    const color = ref();
    // 查询函数
    async function list() {}
    const lessons = ref<any>();
    function getColors(lessonOne: any, defaultColor: any) {
      const type = lessonOne.type;
      if (type === 0 || lessonOne === '') {
        return defaultColor;
        // rgb(142, 208, 214) 计划内课程
      } else if (type === 1 || type === 2) {
        const result = lessonOne.extend.appointRecord.result;
        if (result === 2) {
          // 已预约课程
          defaultColor = 'rgb(233, 233, 224)';
        } else if (result === 1) {
         // 新预约课程
          defaultColor = 'rgb(248, 244, 8)';
        }
        return defaultColor;
     }
    }
    const weeks = ref(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
    function digital2Chinese(num: any, identifier: any) {
      const character = ['零', '一', '二', '三', '四', '五', '六', '七'];
      return identifier === 'week' && (num === 0 || num === 7) ? '日' : character[num];
    }
    // 重新排列数据
    const newList = async () => {
      lessons.value = [
        {lesson: ['', '', '',
          {
            id: 1,
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
              appointRecord: {result: 1},
              lessons: [1, 2, 3],
              class: '自动化1801'},
          }, '', '', '']},
        {lesson: ['', '', '', '', '', '']},
        {lesson: ['', '', '', '', '', '']},
        {lesson: ['', '', '', '', '',
          {
            id: 2,
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
              lessons: [4],
              class: '自动化1801'},
          }, '']},
        {lesson: ['', '', '', '', '',
          {
            id: 3,
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
              appointRecord: {result: 2},
              lessons: [5],
              class: '自动化1801'},
          }, '']},
        {lesson: ['', '', '', '', '', '', '']},
        {lesson: ['',
          {
            id: 4,
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
              appointRecord: {result: 1},
              lessons: [7],
              class: '自动化1801'},
          }, '', '', '', '', '']},
      ];
    };
    const tabCell = async () => {
       var tab = document.getElementById('tabs');
       // @ts-ignore
       var rows = tab.rows;
       var rlen = rows.length;
       for (var i = 1; i < rlen; i++) {
         var cells = rows[i].cells; 
         for (var j = 1; j < cells.length; j++) {
             cells[j].onclick = function () {
                if (!isshow.value) {
                    color.value = this.style.backgroundColor;
                }
                isshow.value = !isshow.value;
                 if (isshow.value && color.value !== 'white') {
                     this.style.backgroundColor = 'darkorchid';
                 }
                 else this.style.backgroundColor = color.value;
             }
         }
       }
    }
    
    onMounted(useLoading(loading, async () => {
      await newList();
      await tabCell();
    }));

    return{
      loading,
      oneDay: new Date(),
      list: useLoading(loading, list),
      weeks,
      digital2Chinese,
      lessons,
      getColors,
      isshow,
      tabCell,
      color,
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
      class: '',
    },
    };
}
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
  .shadow{
    background-color: darkorchid;
    box-shadow: 0 0 15px rgb(15, 15, 15);
  }
</style>
