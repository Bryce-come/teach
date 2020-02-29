<template>
  <div v-loading="loading" class="homework">
    <div style="display:flex;justify-content:center">
      <el-button :type="reportButton? 'primary':''" style="width:200px" @click="showReport()">实验报告上传及结果查看</el-button>
      <el-button :type="templateButton? 'primary':''" style="width:200px;margin-left:5px" @click="showTemplate()">实验模板下载</el-button>
    </div>
    <div v-if="reportButton">
      <div style="margin-top:20px">
        <el-form class="flex between">
          <el-form-item label="课程名称" label-width="80px">
            <el-select v-model="courseList.keyinkey" placeholder="请选择">
              <el-option
                v-for="item in courseList.courseMixList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getReportList()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <lkt-table
        :data="experimentResultList"
        style="width:100%">
        <el-table-column label="提交时间" prop="createDt" sortable/>
        <el-table-column label="课程名称" prop="course"/>
        <el-table-column label="实验名称" prop="experiment_program.name"/>
        <el-table-column label="实验类型" prop="experiment_program.label"/>
        <el-table-column label="操作过程评分" prop="extend.score1"/>
        <el-table-column label="实验报告" prop=""/>
        <el-table-column label="实验报告评分" prop="extend.score2"/>
        <el-table-column label="总分">
          <div slot-scope="props">
            <span v-if="props.row.extend.score1 && props.row.extend.score2">
              {{props.row.extend.score1 + props.row.extend.score2}}
            </span>
          </div>
        </el-table-column>
        <el-table-column label="操作">
          <div slot-scope="props">
            <el-upload
              action=""
              :http-request="(option)=>upload(option)"
              :show-file-list="false">
              <el-button type="text" :style="props.row.extend.score1 && props.row.extend.score2?'color:grey':''" @click="setPorps(props)">提交报告</el-button>
              <!-- <el-button type="primary" icon="el-icon-upload2">上传实验摸板</el-button> -->
            </el-upload>
            <!-- <el-button type="text" :style="props.row.extend.score1 && props.row.extend.score2?'color:grey':''" @click="upReport(props)">提交报告</el-button> -->
          </div>
        </el-table-column>
      </lkt-table>
    </div>
    <div v-if="templateButton">
      <div style="margin: 20px 0" class="block_background">
        <div class="block_title flex start">实验报告模板下载</div>
        <lkt-table
          :data="experimentReportTemplateList"
          style="width:100%">
          <el-table-column label="上传时间" prop="createDt" sortable width="500px"/>
          <el-table-column label="实验报告模板名称" prop="name" width="500px"/>
          <el-table-column label="操作">
            <div slot-scope="{row}">
              <el-button type="text" @click="download(row)">下载</el-button>
            </div>
          </el-table-column>
        </lkt-table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {ref, Ref, onMounted} from '@vue/composition-api';
import {useConfirm, useLoading} from 'web-toolkit/src/service';
import {Message} from 'element-ui';
import {ElForm} from 'element-ui/types/form';
import {deepClone, formatDate} from 'web-toolkit/src/utils';
import { ReportList,ReportTemplateList,ReportScore,ReportSubmit} from '../../dao/reportDao';
import { CourseList } from '../../dao/courseProgramDao';
import { DownLoadPrivate } from '../../dao/commonDao';
export default {
  setup() {
    const loading = ref(false);
    const reportButton = ref(true);
    const templateButton = ref(false);
    const experimentResultList = ref<any>();
    const experimentReportTemplateList = ref<any>();
    const courseList = ref<any>({
      courseIdList: [],
      courseAllList: [],
      courseNameList: [],
      courseMixList: [],
      keyinkey: '',
    });
    async function getCourseList() {
      courseList.value.courseAllList = await CourseList({containPrograms: true});
      courseList.value.courseIdList = [];
      courseList.value.courseNameList = [];
      courseList.value.courseMixList = [];
      for (let i = 0; i < courseList.value.courseAllList.length; i++) {
        courseList.value.courseIdList[i] = courseList.value.courseAllList[i].id;
        courseList.value.courseNameList[i] = courseList.value.courseAllList[i].name;
        courseList.value.courseMixList[i] = {id: courseList.value.courseIdList[i], name: courseList.value.courseNameList[i]};
      }
    }
    async function getReportList() {
      const pum = {
        courseId: courseList.value.keyinkey,
      };
      const result = await ReportList(pum);
      experimentResultList.value = result;
    }
    const propsWord = ref<any>({

    })
    function setPorps(row:any){
      propsWord.value=row
    }
    async function upload(option: any) {
      const result = {
        courseId:propsWord.value.row.id,
        programId:1,
        file:option.file
      }
      await ReportSubmit(result)
      await getReportList()
    }
    async function getTempList(){
      const result = await ReportTemplateList();
      experimentReportTemplateList.value=result;
    }
    async function download(row:any){
      const result = {
        path: row.path,
        filename: row.name,
      };
      await DownLoadPrivate(result.path, result.filename);
    }
    const showReport = async () => {
      reportButton.value = true;
      templateButton.value = false;
    };
    const showTemplate = async () => {
      reportButton.value = false;
      templateButton.value = true;
    };
    onMounted(useLoading(loading, async () => {
      await getCourseList();
      await getTempList();
      // await query();
    }));
    return {
      loading, experimentResultList,propsWord,setPorps,getTempList,
      reportButton, templateButton,getReportList,
      showReport: useLoading(loading, showReport),
      showTemplate: useLoading(loading, showTemplate),
      experimentReportTemplateList,courseList,getCourseList,
      upload: useLoading(loading, upload),
      download: useConfirm('确认下载？', useLoading(loading, download)),
    };
  },
};
</script>
<style lang="scss">

</style>