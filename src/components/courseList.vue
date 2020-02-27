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
      <table id='tabs'>
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
                <el-popover
                  placement="top-start"
                  width="50"
                  >
                  <div style="color:#67C23A;width:6rem;" @click="readLesson(lessonItem)">
                    <i class="el-icon-reading"/>
                    <span  style="margin-left:5px">查看</span>
                  </div>
                  <div style="color:#67a1ff;width:6rem;" @click='showLesson(lessonItem)'>
                    <i class="el-icon-edit"/>
                    <span  style="margin-left:5px">修改</span>
                  </div>
                  <div style="color:#F56C6C;width:6rem;" @click="delectLesson(lessonItem)">
                    <i class="el-icon-delete"/>
                    <span  style="margin-left:5px">删除</span>
                  </div>
                  <!-- <div style="color:#E6A23C;width:6rem;" @click="delayLesson(lessonItem)">
                    <i class="el-icon-takeaway-box"></i>
                    <span  style="margin-left:5px">延长课时</span>
                  </div> -->
                  <div style="width:100%;height:100%" slot="reference" >
                    <div>
                       {{lessonItem?lessonItem.course.name:''}}
                    </div>
                    </div>
                  </el-popover>
               <div v-if="!lessonItem">
                 <div class='order'><el-button size='mini' @click='showLesson()'>预约</el-button></div>
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
    const oneDay = ref();
    const isshow = ref(false);
    const color = ref();
    const tableX = ref(-1);
    const tableY = ref(-1);
    const courseAppointTypeList = ref<any>();
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
    async function list() {}
    const moreSetting = ref({
      lessonNum: 7,
    });
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
    const readLesson = async (lessonItem: any) => {
        readModel.value.visible = true;
        readModel.value.oneLesson = lessonItem;
    };
    const tabCell = async () => {
       const tab = document.getElementById('tabs');
       // @ts-ignore
       const rows = tab.rows;
       const rlen = rows.length;
       for (let i = 1; i < rlen; i++) {
         const cells = rows[i].cells;
         for (let j = 1; j < cells.length; j++) {
             cells[j].onclick = function() {
                if (!isshow.value) {
                    color.value = this.style.backgroundColor;
                    tableX.value = i;
                    tableY.value = j;
                    console.log(color.value);
                }
                isshow.value = !isshow.value;
                if (tableX.value === i &&  tableY.value ===j){
                    if (isshow.value) {
                        this.style.backgroundColor = 'darkorchid';
                    } else { this.style.backgroundColor = color.value; }
                }
                else {
                  alert('请在上一处再次点击');
                  isshow.value = true;
                };
             }
         }
       }
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
    onMounted(useLoading(loading, async () => {
      await newList();
      await tabCell();
      courseAppointTypeList.value = [
        {id: '0', type: '正常课程'},
        {id: '1', type: '授课预约'},
        {id: '2', type: '个人预约'},
      ];
    }));

    return{
      loading,
      oneDay: new Date(),
      list: useLoading(loading, list),
      weeks,
      digital2Chinese,
      lessons,
      moreSetting,
      getColors,
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
      tabCell,
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
            line-height: 2.5rem;
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
