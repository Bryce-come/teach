<template>
  <div v-loading="loading">
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
                  <div style="color:#67C23A;width:6rem;">
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
                       {{lessonItem?lessonItem.name:''}}
                    </div>
                    <div>
                       {{lessonItem?lessonItem.name:''}}
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
      <!-- <lkt-dialog-simple
      :modal="newAppointFlag"
      >
      </lkt-dialog-simple> -->
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
    const newList = async () => {
      lessons.value = [
        {lesson:['', '', '', {name:'语文',type:1,extend:{lessonInt:3,appointRecord:{result:1}}}, '', '', '']},
        {lesson:['', '', '', '', '', '']},
        {lesson:['', '', '', '', '', '']},
        {lesson:['', '', '', '', '', {name:'数学',type:0,extend:{lessonInt:1}}, '']},
        {lesson:['', '', '', '', '', {name:'英语',type:1,extend:{lessonInt:1,appointRecord:{result:2}}}, '']},
        {lesson:['', '', '', '', '', '', '']},
        {lesson:['', {name:'数学',type:2,extend:{lessonInt:1,appointRecord:{result:1}}}, '', '', '', '', '']},
      ]
    };
    function flag(lessonOne: any) {

    }
   onMounted(useLoading(loading, async () => {
      await newList();
    }));
    return{
      loading,
      weeks,
      digital2Chinese,
      lessons,
      more_setting,
      getColors,
      flag,
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
          line-height: 2.5rem;
          font-weight: lighter;
          text-align: center;
          vertical-align: middle;
        }
        td {
          background-color:rgb(142, 208, 214) ;
          line-height: 2rem;
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