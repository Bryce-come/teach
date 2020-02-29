<template>
  <div v-loading="loading" class="program-management">
    <div style="margin: 10px 0" class="block_background">
      <div class="block_title flex between">上课班级信息</div>
      <el-form label-width="100px" style="margin-top:10px" :inline="true">
        <el-form-item label="上课时间：">
          <span>{{ courseNow.startdate + ' - ' + courseNow.enddate}}</span>
        </el-form-item>
        <el-form-item label="上课班级：">
          <span>{{ courseNow.className}}</span>
        </el-form-item>
        <el-form-item label="上课分组：">
          <span>{{courseNow.classGroupName}}</span>
        </el-form-item>
        <el-form-item label="学生人数：">
          {{courseNow.studentCount}}<span>人</span>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin: 10px 0" class="block_background">
      <div class="block_title flex between">NC程序审核</div>
        <div v-if="turn">
          <div style="display:flex;justify-content:flex-end">
            <el-input class="search-bar" style="margin: 10px;width:400px" v-model="keywords" placeholder="输入程序名查询"></el-input>
          </div>
          <lkt-table
            :data="filtered"
            style="width:100%">
            <el-table-column label="提交时间" prop="createDt"/>
            <el-table-column label="提交人" prop="student.name"/>
            <el-table-column label="操作台名称" prop="station.name"/>
            <el-table-column label="程序名称">
              <template slot-scope="{ row }">
                <el-link type="primary" @click="downFile(row)">{{row.file.split("/")[row.file.split("/").length-1]}}</el-link>
              </template>
            </el-table-column>
            <el-table-column label="处理状态">
              <template slot-scope="{ row }">
                <el-tag v-if="row.result === true" type="success">通过审核</el-tag>
                <el-tag v-if="row.result === false" type="danger">未通过审核</el-tag>
                <el-tag v-if="row.result === undefined" type="warning">未审核</el-tag>
              </template>
              <el-button type="success" size="mini">通过审核</el-button>
            </el-table-column>
            <el-table-column label="操作">
              <div class="flex center little-space wrap" slot-scope="{ row }">
                <el-button type="text" @click="turnToExamine();cheakDetail(row)">审核查看</el-button>
              </div>

            </el-table-column>
          </lkt-table>
        </div>
        <div v-else>
          <el-row>
            <div style="margin-left:20px;font-weight:bold">基本信息</div>
            <el-form :inline="true" label-width="120px">
              <el-form-item label="操作台名称:">{{EtInfo.stationName}}</el-form-item>
              <el-form-item label="操作学生:">{{EtInfo.workStudent}}</el-form-item>
              <el-form-item label="提交时间">{{EtInfo.update}}</el-form-item>
            </el-form>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div style="margin-left:20px;font-weight:bold">NC程序代码</div>
              <el-input type="textarea" :rows="16" style="width:96%;margin:10px 10px 0 10px" v-model="EtInfo.contentWord"></el-input>
              <div class="flex start little-space" style="margin-left:10px">
                <el-button type="primary" @click="downFile(EtInfo.data)">下载程序</el-button>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="font-weight:bold">提交历史记录</div>
              <el-table
                :data="ncProgramList"
                style="width:98%"
                max-height="350">
                <el-table-column label="提交时间" prop="createDt"/>
                <el-table-column label="程序名称" prop="file">
                  <template slot-scope="{ row }">
                    {{row.file.split("/")[row.file.split("/").length-1]}}
                  </template>
                </el-table-column>
                <el-table-column label="操作台名称" prop="station.name"/>
                <el-table-column label="处理状态">
                  <template slot-scope="{ row }">
                    <el-tag v-if="row.result === true" type="success">通过审核</el-tag>
                    <el-tag v-if="row.result === false" type="danger">未通过审核</el-tag>
                    <el-tag v-if="row.result === undefined" type="warning">未审核</el-tag>
                  </template>
                  <el-button type="success" size="mini">通过审核</el-button>
                </el-table-column>
                <el-table-column label="操作">
                  <div class="flex center little-space wrap" slot-scope="{ row }">
                  <el-button class="btn" type="text" @click="cheakDetail(row)">查看程序</el-button>
                  </div>
                </el-table-column>
              </el-table>
              <div style="margin-top:20px">
                <div>修改意见：</div>
                <el-input type="textarea" :rows="4" style="width:98%" v-model="reviewInfo.remark"></el-input>
                <div class="flex start little-space">
                  <el-button type="primary" @click="agreeUp()">通过审核同意加工</el-button>
                  <el-button type="danger" style="margin-left:20px" @click="disAgreeUp()">退回修改</el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
import {ElForm} from 'element-ui/types/form';
import { useLoading, useConfirm, useSearch } from 'web-toolkit/src/service';
import { Message, Row } from 'element-ui';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
import { NCExamList, NCExamDetail, NCExamOperate } from '../../dao/inClassDao';
import { CourseRecordInClass } from '../../dao/courseRecordDao';
import { ClassList } from '../../dao/userDao';
import { DownLoadPrivate } from '../../dao/commonDao';
export default {
  setup() {
    const loading = ref(false);
    const turn = ref(true);
    const ncProgramList = ref<any>();
    const [keywords, filtered] = useSearch(ncProgramList, {
      includeProps: ['file'],
    });
    const courseNow = ref<any>({
      startdate: '',
      enddate:'',
      className: '',
      classGroupName: '',
      classPpNum: '',
      studentCount: '',
    });
    const query = async () => {
      const pum = {recordId: courseNow.value.id};
      const result = await NCExamList(pum);
      ncProgramList.value = result;
    };
    const turnToExamine = async () => {
      turn.value = false;
    };
    async function downFile(row: any) {
      const result = {
        path: row.file,
        filename: row.file.split('/')[row.file.split('/').length - 1],
      };
      await DownLoadPrivate(result.path, result.filename);
    }
    async function getClassNow() {
      const result = await CourseRecordInClass();
      if (result !== null) {
        courseNow.value.startdate = result.startDt;
        courseNow.value.enddate = result.endDt;
        courseNow.value.className = result.clasz.name;
        courseNow.value.classGroupName = result.claszGroup.name;
        courseNow.value.id = result.id;
        courseNow.value.studentCount = result.studentList.length;
      } else {
        courseNow.value.startdate = '当前无课';
        courseNow.value.enddate = '当前无课';
        courseNow.value.className = '当前无课';
        courseNow.value.classGroupName = '当前无课';
        courseNow.value.classPpNum = '当前无课';
      }
    }
    const cheakNow=ref<any>({
      id:''
    })
    function tableRowClassName(){
    }
    const EtInfo = ref<any>({
      stationName: '',
      workStudent: '',
      update: '',
      contentWord: '',
      data: '',
    });
    const reviewInfo = ref<any>({
      id: '',
      result: '',
      remark: '',
    });
    async function cheakDetail(row: any) {
      cheakNow.value.id=row.id
      const pum = {
        id: row.id,
      };
      const result = await NCExamDetail(pum);
      EtInfo.value.stationName = row.station.name;
      EtInfo.value.workStudent = row.student.name;
      EtInfo.value.update = row.createDt;
      EtInfo.value.contentWord = result.extend.fileContent;
      EtInfo.value.data = row;
      reviewInfo.value.id = result.id;
      reviewInfo.value.remark = result.remark;
    }
    async function agreeUp() {
      if(EtInfo.value.data.result===undefined){
        const result = {
        id: reviewInfo.value.id,
        result: 2,
      };
      await NCExamOperate(result);
      await query();
      }
      else{
        Message.error('已经过审核')
      }
      turn.value = true;
    }
    async function disAgreeUp() {
      if(EtInfo.value.data.result===undefined){
      const result = {
        id: reviewInfo.value.id,
        remark: reviewInfo.value.remark,
        result: 0,
      };
      await NCExamOperate(result);
      await query();
      }
      else{
        Message.error('已经过审核')
      }
      turn.value = true;
    }
    onMounted(useLoading(loading, async () => {
        await getClassNow();
        await query();
    }));
    return {
      getClassNow, courseNow, downFile, cheakDetail, EtInfo, reviewInfo,
      loading, ncProgramList, query, turn, filtered, keywords,tableRowClassName,
      turnToExamine: useLoading(loading, turnToExamine),
      agreeUp: useConfirm('确认通过？', useLoading(loading, agreeUp)),
      disAgreeUp: useConfirm('确认退回？', useLoading(loading, disAgreeUp)),
    };
  },
};
</script>
<style scoped lang="scss">
  .el-table .warning-row {
    background: red;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
