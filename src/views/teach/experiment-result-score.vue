<template>
  <div v-loading="loading" class="experiment-result-score">
    <div style="margin: 10px 0" class="block_background">
      <div class="block_title flex between">上课班级信息</div>
      <el-form label-width="100px" style="margin-top:10px" :inline="true">
        <el-form-item label="课程名称:">
          <el-select v-model="searchInfo.courseId" @change="setProgramList(searchInfo.courseId)">
              <el-option v-for="clas in courseList.courseAllList" :key="clas.id" :label="clas.name" :value="clas.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="实验名称:">
          <el-select v-model="searchInfo.programId">
              <el-option v-for="prog in courseList.programList" :key="prog.id" :label="prog.name" :value="prog.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="上课时间:">
          <lkt-date-picker style="width:350px" type="daterange" v-model="searchInfo.inDt"></lkt-date-picker>
        </el-form-item>
        <el-form-item label="上课班级:">
          <el-select v-model="searchInfo.claszId" @change="setGroupList(searchInfo.claszId)">
              <el-option v-for="clas in claszList.claszAllList" :key="clas.id" :label="clas.name" :value="clas.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="上课分组:">
          <el-select v-model="searchInfo.groupId">
              <el-option v-for="clas in claszList.groupList" :key="clas.id" :label="clas.name" :value="clas.id" />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left:20px">
          <el-button type="primary" @click="searchFList()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin: 10px 0" class="block_background">
      <div class="block_title flex between">成绩评定</div>
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap">
        <div style="margin:10px">
          <el-button :type="allScored?'primary':''" @click="showAllScored()">全部</el-button>
          <el-button :type="hasScored?'primary':''" style="margin-left:5px" @click="showHasScored()">已评分</el-button>
          <el-button :type="noScored?'primary':''" style="margin-left:5px" @click="showNoScored()">未评分</el-button>
        </div>
        <el-input class="search-bar"  v-model="keywords" placeholder="输入学生搜索" style="width:400px;margin:10px" clearable></el-input>
      </div>
      <lkt-table
        :data="filtered"
        style="width:100%">
        <el-table-column label="学生" prop="student.name"/>
        <el-table-column label="提交时间" prop="createDt"/>
        <el-table-column label="状态">
          <div slot-scope="props">
            <div v-if="props.row.extend.score1 && props.row.extend.score2" style="color:green">已评分</div>
            <div v-else style="color:red">未评分</div>
          </div>
        </el-table-column>
        <el-table-column label="实验过程">
          <el-button type="text" @click="$router.push({name:'monitorDetail'})">查看</el-button>
        </el-table-column>
        <el-table-column label="操作评分" prop="extend.score1"/>
        <el-table-column label="实验报告">
          <div slot-scope="{row}">
            <el-button type="text" @click="downFile(row)">{{row.attachment[0].split("/")[row.attachment[0].split("/").length-1]}}</el-button>
          </div>
        </el-table-column>
        <el-table-column label="报告评分" prop="extend.score2"/>
        <el-table-column label="总分">
          <div slot-scope="props">{{props.row.extend.score1 + props.row.extend.score2}}</div>
        </el-table-column>
        <el-table-column label="操作">
          <div slot-scope="{row}">
            <el-button type="text" @click="showScoreForm(row)">评分</el-button>
          </div>
        </el-table-column>
      </lkt-table>
    </div>
    <kit-dialog-simple
      :modal="scoreModal"
      :confirm="scoreUpdate"
      width="400px">
      <div slot="title">实验评分</div>
      <el-form v-if="scoreModal.scoreInfo" ref="form" :model="scoreModal.scoreInfo" label-width="100px" label-position="left" style="margin: 0 10px">
        <el-form-item label="操作评分:" prop="extend.score1">
          <el-input v-model="scoreModal.scoreInfo.extend.score1"></el-input>
        </el-form-item>
        <el-form-item label="报告评分:" prop="extend.score2">
          <el-input v-model="scoreModal.scoreInfo.extend.score2"></el-input>
        </el-form-item>
      </el-form>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
import {ElForm} from 'element-ui/types/form';
import { useLoading, useConfirm, useSearch } from 'web-toolkit/src/service';
import { Message } from 'element-ui';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
import { ReportList, ReportTemplateList, ReportScore} from '../../dao/reportDao';
import { DownLoadPrivate } from '../../dao/commonDao';
import { CourseRecordList } from '../../dao/courseRecordDao';
import { CourseList } from '../../dao/courseProgramDao';
import { ProgramList } from '@/dao/courseProgramDao';
import { ClassList } from '@/dao/userDao';
export default {
  setup() {
    const loading = ref(false);
    const experimentReportList = ref<any>();
    const allScored = ref(true);
    const hasScored = ref(false);
    const noScored = ref(false);
    const [keywords, filtered] = useSearch(experimentReportList, {
      includeProps: ['student.name'],
    });
    
    const scoreModal = ref<any>({
      visible: false,
      scoreInfo: null,
    });
    const searchInfo =ref<any>({
      courseId:'',
      programId:'',
      claszId:'',
      groupId:'',
      // inDt:[],
      start:'',
      end:''
    })
    const form = ref<ElForm | null>(null);
    const showScoreForm = async (data?: any) => {
      if (form.value) { (form.value as ElForm).clearValidate(); }
      if (data) {
        data = deepClone(data);

      } else {
        data = initForm();
      }
      scoreModal.value.scoreInfo = data;
      scoreModal.value.visible = true;
    };
    async function scoreUpdate() {
      scoreModal.value.visible = false;
      const result = {
        id: scoreModal.value.scoreInfo.id,
        score1: scoreModal.value.scoreInfo.extend.score1,
        score2: scoreModal.value.scoreInfo.extend.score2,
      };
      await ReportScore(result);
      Message.success('评分成功');
      await query();
    }
    async function downFile(row: any) {
      const result = {
        path: row.attachment[0],
        filename: row.attachment[0].split('/')[row.attachment[0].split('/').length - 1],
      };
      await DownLoadPrivate(result.path, result.filename);
    }
    const courseList = ref<any>({
      courseIdList: [],
      courseAllList: [],
      programList: [],
    });
    async function getCourseList() {
      courseList.value.courseAllList = await CourseList({containPrograms: true});
      courseList.value.courseIdList = [];
      for (let i = 0; i < courseList.value.courseAllList.length; i++) {
        courseList.value.courseIdList[i] = courseList.value.courseAllList[i].id;
      }
    }
    async function setProgramList(row: any) {
      searchInfo.value.programId = '';
      courseList.value.programList = [
        {id: '', name: ''},
      ];
      for (let i = 0; i < courseList.value.courseAllList[courseList.value.courseIdList.indexOf(row)].programList.length; i++) {
        courseList.value.programList[i] = {id: courseList.value.courseAllList[courseList.value.courseIdList.indexOf(row)].programList[i].id,
        name: courseList.value.courseAllList[courseList.value.courseIdList.indexOf(row)].programList[i].name};
      }
    }
    const claszList = ref<any>({
      claszIdList: [],
      claszAllList: [],
      groupList: [],
    });
    async function getClazList() {
      claszList.value.claszAllList = await ClassList();
      claszList.value.claszIdList = [];
      for (let i = 0; i < claszList.value.claszAllList.length; i++) {
        claszList.value.claszIdList[i] = claszList.value.claszAllList[i].id;
      }
    }
    async function setGroupList(row: any) {
      searchInfo.value.groupId = '';
      claszList.value.groupList = [
        {id: '', name: ''},
      ];
      for (let i = 0; i < claszList.value.claszAllList[claszList.value.claszIdList.indexOf(row)].groups.length; i++) {
        claszList.value.groupList[i] = {id: claszList.value.claszAllList[claszList.value.claszIdList.indexOf(row)].groups[i].id,
        name: claszList.value.claszAllList[claszList.value.claszIdList.indexOf(row)].groups[i].name};
      }
    }
    async function searchFList(){
      if(searchInfo.value.inDt!=undefined){
        const resulta = new Date(searchInfo.value.inDt[0])
        const resultb = new Date(searchInfo.value.inDt[1])
        searchInfo.value.start = Number(resulta)/1000
        searchInfo.value.end = Number(resultb)/1000
      }
      else if(searchInfo.value.inDt===undefined){
        searchInfo.value.start=null
        searchInfo.value.end=null
      }
      if(searchInfo.value.courseId===''){
        searchInfo.value.courseId=null
      }
      if(searchInfo.value.programId===''){
        searchInfo.value.programId=null
      }
      if(searchInfo.value.claszId===''){
        searchInfo.value.claszId=null
      }
      if(searchInfo.value.groupId===''){
        searchInfo.value.groupId=null
      }
      const pum={
        courseId:searchInfo.value.courseId,
        programId:searchInfo.value.programId,
        claszId:searchInfo.value.claszId,
        groupId:searchInfo.value.groupId,
        start:searchInfo.value.start,
        end:searchInfo.value.end
      }
      experimentReportList.value = await ReportList(pum)
    }
    async function getReportList() {
      const pum = {};
      const result = await ReportList(pum);
      return result;
    }
    const query = async () => {
      const result = await getReportList();
      experimentReportList.value = result;
    };
    const showAllScored = async () => {
      allScored.value = true;
      hasScored.value = false;
      noScored.value = false;
    };
    const showHasScored = async () => {
      allScored.value = false;
      hasScored.value = true;
      noScored.value = false;
    };
    const showNoScored = async () => {
      allScored.value = false;
      hasScored.value = false;
      noScored.value = true;
    };
    onMounted(useLoading(loading, async () => {
      await query();
      await getCourseList();
      await getClazList();
    }));
    return {
      loading, experimentReportList, query, scoreModal, showScoreForm,getReportList,searchInfo,claszList,keywords,
      scoreUpdate: useLoading(loading, scoreUpdate),setProgramList,searchFList,getClazList,setGroupList,filtered,
      allScored, hasScored, noScored,downFile,courseList,
      showAllScored: useLoading(loading, showAllScored),
      showHasScored: useLoading(loading, showHasScored),
      showNoScored: useLoading(loading, showNoScored),
    };
  },
};
function initForm() {
  return {
    extend: {score1: 0, score2: 0},
  };
}
</script>
<style scoped lang="scss">

</style>