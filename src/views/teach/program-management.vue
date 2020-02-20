<template>
  <div v-loading="loading" class="program-management">
    <div style="margin: 10px 0" class="block_background">
      <div class="block_title flex between">上课班级信息</div>
      <el-form label-width="100px" style="margin-top:10px" :inline="true">
        <el-form-item label="上课时间:">
          <lkt-date-picker style="width:350px"></lkt-date-picker>
        </el-form-item>
        <el-form-item label="上课班级:">
          <lkt-select style="width:120px"/>
        </el-form-item>
        <el-form-item label="上课分组:">
          <lkt-select style="width:120px"/>
        </el-form-item>
        <el-form-item label="学生人数:">
          <el-input style="width:50px"></el-input>
          <span>人</span>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin: 10px 0" class="block_background">
      <div class="block_title flex between">NC程序审核</div>
        <div v-if="turn">
          <el-input style="margin-left:700px;margin-bottom:10px;width:400px" placeholder="输入程序名查询"></el-input>
          <lkt-table
            :data="ncProgramList"
            style="width:100%">
            <el-table-column label="提交时间" prop="createDt"/>
            <el-table-column label="提交人" prop="student"/>
            <el-table-column label="已等待时间"/>
            <el-table-column label="设备编号"/>
            <el-table-column label="程序名称" prop="file"/>
            <el-table-column label="处理状态" prop="result">       
              <el-button type="success" size="mini">通过审核</el-button>        
            </el-table-column>
            <el-table-column label="附件"/>
            <el-table-column label="操作">
              <el-button type="text" @click="turnToExamine()">审核查看</el-button>
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
            <el-col :span="6">
              <div style="margin-left:20px;font-weight:bold">NC程序代码</div>
              <el-input type="textarea" style="height:600px;width:90%"></el-input>
            </el-col>
            <el-col :span="18">
              <div style="font-weight:bold">提交历史记录</div>
              <el-table
                :data="ncProgramList"
                style="width:100%">
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
                <el-form-item label="修改意见:">
                  <el-input type="textarea" style="width:700px"></el-input>
                </el-form-item>
                <el-form-item style="display:flex;justify-between:center">
                  <el-button type="primary" @click="turn=true">通过审核同意加工</el-button>
                  <el-button type="danger" style="margin-left:20px" @click="turn=true">退回修改</el-button>
                </el-form-item>
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
export default {
  setup() {
    const loading = ref(false);
    const turn = ref(true);
    const ncProgramList = ref<any>();
    const query = async () => {
      ncProgramList.value = [
        {id: '0', courseRecord: '', station: '', file: '', student: '小明', operator: '', result: true, remark: '',
        handleDt: '', createDt: '', extend: {cncLink: true, fileContent: '',}},
        {id: '1', courseRecord: '', station: '', file: '', student: '小明', operator: '', result: false, remark: '',
        handleDt: '', createDt: '', extend: {cncLink: true, fileContent: '',}},
        {id: '2', courseRecord: '', station: '', file: '', student: '小明', operator: '', result: false, remark: '',
        handleDt: '', createDt: '', extend: {cncLink: true, fileContent: '',}},
        {id: '3', courseRecord: '', station: '', file: '', student: '小明', operator: '', result: true, remark: '',
        handleDt: '', createDt: '', extend: {cncLink: true, fileContent: '',}},
        {id: '4', courseRecord: '', station: '', file: '', student: '小明', operator: '', result: true, remark: '',
        handleDt: '', createDt: '', extend: {cncLink: true, fileContent: '',}},
      ];
    };
    const turnToExamine = async () => {
      turn.value = false;
    };
    onMounted(useLoading(loading, async () => {
        await query();
    }));
    return {
      loading, ncProgramList, query, turn,
      turnToExamine: useLoading(loading, turnToExamine),
    };
  }
}
</script>
<style scoped lang="scss">

</style>