<template>
  <div v-loading="loading" class="program-management">
    <div style="margin: 10px 0" class="block_background">
      <div class="block_title flex between">上课班级信息</div>
      <el-form label-width="100px" style="margin-top:10px" :inline="true">
        <el-form-item label="上课时间：">
          <span>{{ courseNow.date }}</span>
        </el-form-item>
        <el-form-item label="上课班级：">
          <span>{{ courseNow.className}}</span>
        </el-form-item>
        <el-form-item label="上课分组：">
          <span>{{courseNow.classGroupName}}</span>
        </el-form-item>
        <el-form-item label="学生人数：">
          {{4}}<span>人</span>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin: 10px 0" class="block_background">
      <div class="block_title flex between">NC程序审核</div>
        <div v-if="turn">
          <div style="display:flex;justify-content:flex-end">
            <el-input style="margin: 10px;width:400px" placeholder="输入程序名查询"></el-input>
          </div>
          <lkt-table
            :data="ncProgramList"
            style="width:100%">
            <el-table-column label="提交时间" prop="createDt"/>
            <el-table-column label="提交人" prop="student"/>
            <el-table-column label="已等待时间"/>
            <el-table-column label="设备编号"/>
            <el-table-column label="程序名称" prop="file"/>
            <el-table-column label="处理状态" prop="result">       
              <el-tag type="success" size="mini">通过审核</el-tag>        
            </el-table-column>
            <el-table-column label="附件"/>
            <el-table-column label="操作">
              <div class="flex center little-space wrap" slot-scope="{ row }">
                <el-button type="text" @click="turnToExamine();getDetail(row)">审核查看</el-button>
              </div>
              
            </el-table-column>
          </lkt-table>
        </div>
        <div v-else>
          <el-row>
            <div style="margin-left:20px;font-weight:bold">基本信息</div>
            <el-form :inline="true" label-width="120px">
              <el-form-item label="操作台编号:">操作台-01</el-form-item>
              <el-form-item label="操作学生:">张晓明 王小虎</el-form-item>
              <el-form-item label="提交时间">{{'2020/01/02'}}</el-form-item>
            </el-form>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div style="margin-left:20px;font-weight:bold">NC程序代码</div>
              <el-input type="textarea" :rows="19" style="width:96%;margin:10px 10px 0 10px"></el-input>
              <div class="flex start little-space" style="margin:5px">
                <el-button type="primary" @click="download()">下载程序</el-button>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="font-weight:bold">提交历史记录</div>
              <el-table
                :data="ncProgramList"
                style="width:98%">
                <el-table-column label="提交时间" prop="createDt"/>
                <el-table-column label="程序名称" prop="file"/>
                <el-table-column label="设备编号"/>                
                <el-table-column label="处理状态" prop="result">       
                  <el-button type="success" size="mini">通过审核</el-button>        
                </el-table-column>
                <el-table-column label="附件"/>
                <el-table-column label="操作">
                  <el-button type="text">查看程序</el-button>
                </el-table-column>
              </el-table>
              <el-form>
                <div>修改意见：</div>
                <el-input type="textarea" :rows="3" style="width:98%"></el-input>
                <div class="flex start little-space">
                  <el-button type="primary" @click="turn=true">通过审核同意加工</el-button>
                  <el-button type="danger" @click="turn=true">退回修改</el-button>
                </div>
              </el-form>
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
import { Message } from 'element-ui';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
import { NCExamList,NCExamDetail } from '../../dao/inClassDao'
import { CourseRecordInClass } from '../../dao/courseRecordDao'
import { ClassList } from '../../dao/userDao'
export default {
  setup() {
    const loading = ref(false);
    const turn = ref(true);
    const ncProgramList = ref<any>();
    const courseNow = ref<any>({
      date:'',
      className:'',
      classGroupName:'',
      classPpNum:''
    })
    const query = async () => {
      const pum ={recordId:courseNow.value.id}
      const result = await NCExamList(pum)
      
      ncProgramList.value = [
        {id: '0', courseRecord: '', station: '', file: '', student: '小明', operator: '', result: true, remark: '',
        handleDt: '', createDt: '', extend: {cncLink: true, fileContent: ''}},
        {id: '1', courseRecord: '', station: '', file: '', student: '小明', operator: '', result: false, remark: '',
        handleDt: '', createDt: '', extend: {cncLink: true, fileContent: ''}},
        {id: '2', courseRecord: '', station: '', file: '', student: '小明', operator: '', result: false, remark: '',
        handleDt: '', createDt: '', extend: {cncLink: true, fileContent: ''}},
        {id: '3', courseRecord: '', station: '', file: '', student: '小明', operator: '', result: true, remark: '',
        handleDt: '', createDt: '', extend: {cncLink: true, fileContent: ''}},
        {id: '4', courseRecord: '', station: '', file: '', student: '小明', operator: '', result: true, remark: '',
        handleDt: '', createDt: '', extend: {cncLink: true, fileContent: ''}},
      ];
    };
    const turnToExamine = async () => {
      turn.value = false;
    };
    const download = async () => {
      Message.success('下载成功');
    };
    const groupList=ref<any>({
      groupLista:[],
      groupListb:[],
      groupIdList:[],
      groupNmaeList:[]
    })
    async function getGroupList(){
        const result = await ClassList()
        for(let i=0;i<result.length;i++){
          groupList.value.groupLista[i]=[]
          groupList.value.groupListb[i]=[]
          for(let j=0;j<result[i].groups.length;j++){
            groupList.value.groupLista[i][j]=result[i].groups[j].id
            groupList.value.groupListb[i][j]=result[i].groups[j].name
          }
        }
        groupList.value.groupIdList=groupList.value.groupLista.reduce(function (a:any, b:any) { return a.concat(b)} );
        groupList.value.groupNmaeList=groupList.value.groupListb.reduce(function (a:any, b:any) { return a.concat(b)} );
    } 
    async function getClassNow(){
      const result = await CourseRecordInClass()
      if(result!==null){
        courseNow.value.date=result.startDt
        courseNow.value.className=result.clasz.name
        // courseNow.value.classGroupName=groupList.value.groupNmaeList[groupList.value.groupIdList.indexOf(result.extend.claszGroup)]
        courseNow.value.classGroupName=result.claszGroup.name
        courseNow.value.id=result.id
        console.log(result)
      }
      else{
        courseNow.value.date=''
        courseNow.value.className=''
        courseNow.value.classGroupName=''
        courseNow.value.classPpNum=''
      }
    }
    async function getDetail(row:any){
      const pum = {
        id:row.id
      }
      const result = await NCExamDetail(pum)
      console.log(row)
    }
    onMounted(useLoading(loading, async () => {
        await getGroupList()
        await getClassNow()
        await query();
    }));
    return {
      getClassNow,courseNow,getGroupList,groupList,
      loading, ncProgramList, query, turn,
      turnToExamine: useLoading(loading, turnToExamine),
      getDetail,
      download: useConfirm('确认下载？', useLoading(loading, download)),
    };
  },
};
</script>
<style scoped lang="scss">

</style>