<template>
  <el-tabs type="border-card" v-loading="loading" v-model="tabName">
    <el-tab-pane name="1" label="当前学期设定">
      <el-form label-width="120px">
        <el-form-item label="学年设置：">
          <el-input-number v-model="modal.year" controls-position="right" :min="2019" :max="new Date().getFullYear()" />
        </el-form-item>
        <el-form-item label="学期设置：">
          <el-input-number v-model="modal.term" controls-position="right" :min="1"/>
        </el-form-item>
        <el-form-item label="学期起止时间：">
          <el-date-picker v-model="modal.termsDt" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="update({
            year: modal.year,
            term: modal.term,
            terms: [modal.termsDt[0].getTime(), modal.termsDt[1].getTime()]
          },'setting-term')">保存设置</el-button>
        </el-form-item>
        <kit-err-channel id="setting-term" style="margin-top: 5px" />
      </el-form>
    </el-tab-pane>
    <el-tab-pane name="2" label="作息时间设定">
      <el-form ref="form2" label-width="180px" :model="modal">
        <el-form-item
          :rules="{ required: true, message: '请填写' }"
          label="一天课时节数：" prop="lessonNum" >
          <el-input-number v-model="modal.lessonNum" controls-position="right" :min="1" :max="25"/>
        </el-form-item>
        <el-form-item
          :prop="'lesson'+(i+1)"
          :rules="{ required: true, message: '请填写' }"
          v-for="(item, i) in modal.lessonNum"
          :key="i"
          :label="'第'+(i+1)+'节课时间：'">
          <el-time-picker
            format="HH:mm"
            is-range v-model="modal['lesson'+(i+1)]"
            start-placeholder="开始时间" end-placeholder="结束时间"
            placeholder="选择时间范围" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateTerms()">保存设置</el-button>
        </el-form-item>
        <kit-err-channel id="setting-terms" style="margin-top: 5px" />
      </el-form>
    </el-tab-pane>
    <el-tab-pane name="3" label="报警提醒开关">
      <el-form ref="form3" label-width="180px">
        <el-form-item label="设备报警提醒开关：">
          <el-switch v-model="modal.deviceAlarmOn"/>
        </el-form-item>
        <el-form-item label="实验室使用报警开关：">
          <el-switch v-model="modal.stationUsageAlarmOn"/>
        </el-form-item>
        <el-form-item label="维保到期提醒开关：">
          <el-switch v-model="modal.deviceMaintenAlarmOn"/>
<!--          <span>设备维保时间设定及到期提醒</span>-->
        </el-form-item>
        <el-form-item label="维保到期提前提醒时间：" v-if="modal.deviceMaintenAlarmOn">
          <el-input-number v-model="modal.deviceMaintenAlarmTimeLimit" controls-position="right" :min="0" />
          <span style="margin-left: 10px">天</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="update({
            deviceAlarmOn: modal.deviceAlarmOn,
            stationUsageAlarmOn: modal.stationUsageAlarmOn,
            deviceMaintenAlarmOn: modal.deviceMaintenAlarmOn,
            deviceMaintenAlarmTimeLimit: modal.deviceMaintenAlarmTimeLimit
          },'setting-alarm')">保存设置</el-button>
        </el-form-item>
        <kit-err-channel id="setting-alarm" style="margin-top: 5px" />
      </el-form>
    </el-tab-pane>
    <el-tab-pane name="4" label="网关通道开关">
      <el-form ref="form4" label-width="260px">
        <el-form-item label="LKT-MAN是否能控制CNC网络连通：">
          <el-switch v-model="modal.CNCLinkOn"/>
        </el-form-item>
        <el-form-item label="默认下课后关闭时间：" v-if="modal.CNCLinkOn">
          <el-input-number v-model="modal.CNCLinkTimeout" controls-position="right" :min="0" />
          <span style="margin-left: 10px">分钟</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="update({
            CNCLinkOn: modal.CNCLinkOn,
            CNCLinkTimeout: modal.CNCLinkTimeout
          },'setting-link')">保存设置</el-button>
        </el-form-item>
        <kit-err-channel id="setting-link" style="margin-top: 5px" />
      </el-form>
    </el-tab-pane>
    <el-tab-pane name="5" label="NVR访问配置">
      <el-form ref="form5" label-width="100px" style="width: 350px" :model="modal">
        <el-form-item label="IP：" prop="nvrIp" :rules="{ required: true, message: '请填写' }">
          <el-input v-model="modal.nvrIp"/>
        </el-form-item>
        <el-form-item label="端口：" prop="nvrPort" :rules="{ required: true, message: '请填写' }">
          <el-input-number v-model="modal.nvrPort" controls-position="right" :min="10" />
        </el-form-item>
        <el-form-item label="用户名：" prop="nvrUsername" :rules="{ required: true, message: '请填写' }">
          <el-input v-model="modal.nvrUsername"/>
        </el-form-item>
        <el-form-item label="密码：" prop="nvrPwd" :rules="{ required: true, message: '请填写' }">
          <el-input v-model="modal.nvrPwd" type="password"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateNVR({
            nvrIp: modal.nvrIp,
            nvrPort: modal.nvrPort,
            nvrUsername: modal.nvrUsername,
            nvrPwd: modal.nvrPwd,
          })">保存设置</el-button>
        </el-form-item>
        <kit-err-channel id="setting-nvr" style="margin-top: 5px" />
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts">
import { ref, onMounted } from '@vue/composition-api';
import { useLoading} from 'web-toolkit/src/service';
import { SettingGet, SettingSet } from '@/dao/settingDao';
import { Message } from 'element-ui';
import {ElForm} from 'element-ui/types/form';
import { pushMsgErr, submitErrChanel } from 'web-toolkit/src/case-main';
import {router} from '@/main';

export default {
  setup() {
    const loading = ref(false);
    const tabName = ref<string>('1');
    const form2 = ref<ElForm|null>(null);
    const form5 = ref<ElForm|null>(null);
    const modal = ref<any>({
      termsDt: [null, null],
    });
    async function query() {
      const m = await SettingGet({});
      if (m.terms && m.terms.length === 2) {
        m.termsDt = [new Date(m.terms[0]), new Date(m.terms[1])];
      }
      for (let i = 1; i <= m.lessonNum; i++) {
        m['lesson' + i][0] = new Date(m['lesson' + i][0]);
        m['lesson' + i][1] = new Date(m['lesson' + i][1]);
      }
      modal.value = m;
    }
    // 直接传要修改的参数
    async function update(params: any, id: string) {
      submitErrChanel(id);
      await SettingSet(params);
      Message.success('设置成功');
    }
    async function updateNVR(params: any) {
      const valid = await (form5.value as ElForm).validate();
      if (!valid) {
        return ;
      }
      await update(params, 'setting-nvr');
    }
    async function updateTerms() {
      const valid = await (form2.value as ElForm).validate();
      if (!valid) {
        return ;
      }
      submitErrChanel('setting-terms');
      const params = { lessonNum: modal.value.lessonNum };
      let flagTime;
      for (let i = 1; i <= modal.value.lessonNum; i++) {
        modal.value['lesson' + i][0].setSeconds(0);
        modal.value['lesson' + i][1].setSeconds(0);
        (params as any)['lesson' + i] = [modal.value['lesson' + i][0].getTime(), modal.value['lesson' + i][1].getTime()];
        if (flagTime && modal.value['lesson' + i][0].getTime() < flagTime) {
          pushMsgErr('课时时间存在冲突');
          return ;
        }
        flagTime = modal.value['lesson' + i][1].getTime();
      }
      await update(params, 'setting-terms');
    }
    onMounted(useLoading(loading, async () => {
      if (router.currentRoute.query.tab) {
        tabName.value = router.currentRoute.query.tab as string;
      }
      await query();
    }));
    return{
      loading, modal, form2, form5, tabName,
      update: useLoading(loading, update),
      updateTerms: useLoading(loading, updateTerms),
      updateNVR: useLoading(loading, updateNVR),
    };
  },
};
</script>
<style scoped lang="scss">
.wrapper{
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 30px;
}
.wrapper-content{
  // width: 50%;
  margin-bottom: 20px;
}
</style>
