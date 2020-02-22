<template>
  <div v-loading="loading" class="experiment-result-score">
    <div style="margin: 10px 0" class="block_background">
      <div class="block_title flex between">上课班级信息</div>
      <el-form label-width="100px" style="margin-top:10px" :inline="true">
        <el-form-item label="课程名称:">
          <lkt-select/>
        </el-form-item>
        <el-form-item label="实验名称:">
          <lkt-select/>
        </el-form-item>
        <el-form-item label="上课时间:">
          <lkt-date-picker style="width:350px"></lkt-date-picker>
        </el-form-item>
        <el-form-item label="上课班级:">
          <lkt-select/>
        </el-form-item>
        <el-form-item label="上课分组:">
          <lkt-select/>
        </el-form-item>
        <el-form-item label="学生人数:">
          <el-input style="width:50px"></el-input>
          <span>人</span>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin: 10px 0" class="block_background">
      <div class="block_title flex between">成绩评定</div>
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap">
        <div style="margin:10px">
          <el-button type="primary">全部</el-button>
          <el-button type="primary" style="margin-left:5px">已评分</el-button>
          <el-button type="primary" style="margin-left:5px">未评分</el-button>
        </div>
        <el-input placeholder="输入操作台/学生搜索" style="width:400px;margin:10px"></el-input>
      </div>
      <lkt-table
        :data="experimentReportList"
        style="width:100%">
        <el-table-column label="学生" prop="student"/>
        <el-table-column label="提交时间" prop="createDt"/>
        <el-table-column label="操作台"/>
        <el-table-column label="状态">
          <span style="color:green">已评分</span>
        </el-table-column>
        <el-table-column label="实验过程">
          <el-button type="text">查看</el-button>
        </el-table-column>
        <el-table-column label="操作评分" prop="extend.score1"/>
        <el-table-column label="实验报告">
          <el-button type="text">1.doc</el-button>
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
export default {
  setup() {
    const loading = ref(false);
    const experimentReportList = ref<any>();
    const scoreModal = ref<any>({
      visible: false,
      scoreInfo: null,
    });
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
      Message.success('评分成功');
      await query();
    }
    const query = async () => {
      experimentReportList.value = [
        {id: '0', course: '', program: '', student: '', content: '', attachment: '', scoreSum: '', comment: '',
        note: '', teacher: '', createDt: '', handleDt: '', extend: {score1: 60, score2: 24, ratio1: 60, ratio2: 40}},
      ];
    };
    onMounted(useLoading(loading, async () => {
      await query();
    }));
    return {
      loading, experimentReportList, query, scoreModal, showScoreForm,
      scoreUpdate: useLoading(loading, scoreUpdate),
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