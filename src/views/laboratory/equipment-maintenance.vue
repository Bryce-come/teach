<template>
  <div v-loading="loading" class="equipment-maintenance">
    <el-button type="primary" style="margin-bottom:5px" @click="showForm()">添加</el-button>
    <el-tabs type="border-card">
      <el-tab-pane label="当前维保记录">
        <lkt-table :data="deviceMaintenanceRecord" style="width:100%">
          <el-table-column fixed="left" prop="device.name" label="设备名称"/>
          <el-table-column fixed="left" prop="device.id" label="设备编号"/>
          <el-table-column fixed="left" prop="device.deviceType.name" label="设备型号"/>
          <el-table-column prop="restorationDt" label="最近维保时间" width="120px">
            <div slot-scope="{ row }">
              <span v-if="row.restorationDt">{{new Date(row.restorationDt) | date }}</span>
            </div>
          </el-table-column>
          <el-table-column prop="type" label="维保类型">
             <div slot-scope="{ row }">
              {{row.type === 0 ?'巡检': '' || row.type === 1 ?'保养': '' || row.type === 2 ?'维修': ''}}
            </div>
          </el-table-column>
          <el-table-column prop="treatment" label="维保内容" width="100px"/>
          <el-table-column prop="executor" label="维护人"/>
          <el-table-column prop="extend.executorPhone" label="联系方式" width="100px"/>
          <el-table-column fixed="right" prop="nextDt" label="下次保养时间" width="150px">
            <div slot-scope="{ row }">
              <span v-if="row.nextDt">{{new Date(row.nextDt) | date }}</span>
            </div>
          </el-table-column>
          <el-table-column fixed="right" prop="status" label="当前状态">
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right" >
            <div slot-scope="{row}">
            <el-button type="danger" size="mini" @click="remove(row)">删除</el-button>
            </div>
          </el-table-column>
        </lkt-table>
      </el-tab-pane>
      <el-tab-pane label="历史记录">
        <el-form :inline="true">
          <el-form-item label="设备名称:" label-width="80px">
            <el-select v-model="deviceName" multiple :clearable="false" placeholder="请选择设备名称">
              <el-option
                v-for="item of deviceNameList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="维护人:" label-width="80px">
            <el-select v-model="executorName" filterable allow-create multiple :clearable="false" placeholder="请选择维护人">
              <el-option
                v-for="item of executorList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="维保类型:" label-width="80px">
            <el-select v-model="maintainType" multiple :clearable="false" placeholder="请选择维保类型">
              <el-option
                v-for="item of maintainTypeList"
                :key="item.id"
                :label="item.type"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="维护日期:" label-width="80px">
            <lkt-date-picker v-model="maintainDt"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryMaintainRecordHistory()">查询</el-button>
          </el-form-item>
        </el-form>
        <lkt-table :data="deviceMaintenanceHistoryRecord" style="width:100%">
          <el-table-column fixed="left" prop="device.name" label="设备名称"/>
          <el-table-column fixed="left" prop="device.id" label="设备编号"/>
          <el-table-column fixed="left" prop="device.deviceType.name" label="设备型号"/>
          <el-table-column prop="type" label="维保类型">
             <div slot-scope="{ row }">
              {{row.type === 0 ?'巡检': '' || row.type === 1 ?'保养': '' || row.type === 2 ?'维修': ''}}
            </div>
          </el-table-column>
          <el-table-column prop="treatment" label="维保内容" width="100px"/>
          <el-table-column prop="executor" label="维护人"/>
          <el-table-column prop="extend.executorPhone" label="联系方式" width="100px"/>
          <el-table-column prop="restorationDt" label="最近维保时间" width="120px">
            <div slot-scope="{ row }">
              <span v-if="row.restorationDt">{{new Date(row.restorationDt) | date }}</span>
            </div>
          </el-table-column>
          <el-table-column fixed="right" prop="nextDt" label="距离下次维护时间" width="150px">
            <div slot-scope="{ row }">
              <span v-if="row.nextDt">{{new Date(row.nextDt) | date }}</span>
            </div>
          </el-table-column>
          <el-table-column fixed="right" prop="status" label="当前状态">
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" >
            <div slot-scope="{row}">
            <el-button type="danger" size="mini" @click="remove(row)">删除</el-button>
            </div>
          </el-table-column>
        </lkt-table>
      </el-tab-pane>
    </el-tabs>
    <kit-dialog-simple
      :modal="modal"
      :confirm="update"
      width="600px">
        <div slot="title">添加设备维保记录</div>
        <el-form v-if="modal.maintainRecordInfo" ref="form" :model="modal.maintainRecordInfo" label-width="160px" label-position="left" style="width: 377px;margin: 0 auto">
          <el-form-item label="设备名称：" prop="device.name" :rules="{ required: true, message: '请输入设备名称'}">
            <el-select value-key="id" v-model="modal.maintainRecordInfo.device"  placeholder="请选择设备名称">
              <el-option
                v-for="item of deviceNameList"
                :key="item.id"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="保养时间：" prop="restorationDt" :rules="{ required: true, message: '请选择保养时间'}">
              <el-date-picker v-model="modal.maintainRecordInfo.restorationDt" type="date"></el-date-picker>
          </el-form-item>
          <el-form-item label="保养内容：" prop="treatment" :rules="{ required: true, message: '请输入保养内容'}">
              <el-input type="text" v-model="modal.maintainRecordInfo.treatment"></el-input>
          </el-form-item>
          <el-form-item label="维保类型：" prop="type" :rules="{ required: true, message: '请选择维保类型'}">
            <el-select v-model="modal.maintainRecordInfo.type" placeholder="请选择">
              <el-option
                v-for="item of maintainTypeList"
                :key="item.id"
                :label="item.type"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="维护人：" prop="executor" :rules="{ required: true, message: '请填入维护人'}">
              <el-select v-model="modal.maintainRecordInfo.executor" filterable allow-create placeholder="请选择">
               <el-option
                v-for="item of executorList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="联系方式：" prop="extend.executorPhone">
            <el-input v-model="modal.maintainRecordInfo.extend.executorPhone"/>
          </el-form-item>
          <el-form-item label="当前状态：" prop="status">
              <el-select v-model="modal.maintainRecordInfo.status"  placeholder="请选择">
               <el-option
                v-for="item of statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="下次保养时间：" prop="nextDt" v-if="modal.maintainRecordInfo.type===1">
            <el-date-picker v-model="modal.maintainRecordInfo.nextDt" type="date"/>
          </el-form-item>
        </el-form>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
import { Message } from 'element-ui';
import { useConfirm, useLoading } from 'web-toolkit/src/service';
import {ElForm} from 'element-ui/types/form';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
import { DeviceList, DeviceTypeList, DeviceMaintenLatest, DeviceMaintenDel, DeviceMaintenAdd, DeviceMaintenList, DeviceMaintenListExecutor} from '@/dao/deviceDao';
export default {
  setup() {
    const loading = ref(false);
    const modal = ref<any>({
      visible: false,
      maintainRecordInfo: null,
    });
    const deviceMaintenanceRecord = ref<any>();
    const deviceMaintenanceHistoryRecord = ref<any>();
    const deviceTypeList = ref<any>([]);
    const executorList = ref<any>([]);
    const executorName = ref<any>();
    const deviceNameList = ref<any>();
    const deviceName = ref<any>();
    const maintainTypeList = ref<any>();
    const maintainType = ref<any>();
    const maintainDt = ref<any>(null);
    const statusList = ref<any>();
    const remove = async (row: any) => {
      await DeviceMaintenDel({id: row.id }),
      await queryMaintainRecord();
      await queryMaintainRecordHistory();
      Message.success('删除成功');
    };
    const form = ref<ElForm|null>(null);
    const showForm = async (data?: any) => {
      if (form.value) { (form.value as ElForm).clearValidate(); }
      if (data) {
        data = deepClone(data);
      } else {
        data = initForm();
      }
      modal.value.maintainRecordInfo = data;
      modal.value.visible = true;
    };
    async function update() {
      const valid = await (form.value as ElForm).validate();
      if (valid) {
        if (modal.value.maintainRecordInfo.restorationDt && modal.value.maintainRecordInfo.restorationDt instanceof Date) {
          modal.value.maintainRecordInfo.restorationDt = modal.value.maintainRecordInfo.restorationDt.getTime();
        }
        if (modal.value.maintainRecordInfo.nextDt && modal.value.maintainRecordInfo.nextDt instanceof Date) {
          modal.value.maintainRecordInfo.nextDt = modal.value.maintainRecordInfo.nextDt.getTime();
        }
        await DeviceMaintenAdd({
          deviceId: modal.value.maintainRecordInfo.device.id,
          type: modal.value.maintainRecordInfo.type,
          executor: modal.value.maintainRecordInfo.executor,
          status: modal.value.maintainRecordInfo.status ? modal.value.maintainRecordInfo.status : null,
          treatment: modal.value.maintainRecordInfo.treatment ? modal.value.maintainRecordInfo.treatment : null,
          restorationDt: modal.value.maintainRecordInfo.restorationDt,
          nextDt: modal.value.maintainRecordInfo.nextDt ? modal.value.maintainRecordInfo.nextDt : null,
          extendJson: modal.value.maintainRecordInfo.extend ? JSON.stringify(modal.value.maintainRecordInfo.extend) : null,
        });
        modal.value.visible = false;
        Message.success('添加成功');
        await queryMaintainRecord();
        await queryMaintainRecordHistory();
      }
    }
    const queryMaintainRecord = async () => {
      deviceMaintenanceRecord.value = await DeviceMaintenLatest();
    };
    const queryMaintainRecordHistory = async () => {
      deviceMaintenanceHistoryRecord.value = await DeviceMaintenList({
        devicesJson: deviceName.value && deviceName.value.length > 0 ? JSON.stringify(deviceName.value) : null,
        typesJson: maintainType.value && maintainType.value.length > 0 ? JSON.stringify(maintainType.value) : null,
        executorsJson: executorName.value && executorName.value.length > 0 ? JSON.stringify(executorName.value) : null,
        start: maintainDt.value && maintainDt.value[0] ? (maintainDt.value[0] as Date).getTime() : null,
        end: maintainDt.value && maintainDt.value[1] ? (maintainDt.value[1] as Date).getTime() : null,
      });
    };
    onMounted(useLoading(loading, async () => {
      await queryMaintainRecord();
      await queryMaintainRecordHistory();
      deviceTypeList.value = await DeviceTypeList();
      executorList.value = await DeviceMaintenListExecutor();
      deviceNameList.value = await DeviceList({
        types: null,
        start: null,
        end: null,
      });
      maintainTypeList.value = [
        {id: 0, type: '巡检'},
        {id: 1, type: '保养'},
        {id: 2, type: '维修'},
      ];
      statusList.value = [
        { value: '正常',
          label: '正常' },
        { value: '维护中',
          label: '维护中' },
        { value: '故障',
          label: '故障' },
        { value: '告警',
          label: '告警' },
        { value: '报废',
          label: '报废' },
      ];
    }));
    return{
      deviceMaintenanceRecord, deviceTypeList, executorName, deviceNameList, deviceName, maintainTypeList, maintainType, maintainDt, loading, modal,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      update: useLoading(loading, update),
      showForm,
      deviceMaintenanceHistoryRecord,
      form,
      executorList,
      statusList,
      queryMaintainRecordHistory: useLoading(loading, queryMaintainRecordHistory),
    };
  },
};
function initForm() {
  return {
    device: {
      name: '',
      referencedColumnName: '',
      deviceType: '' },
    restorationDt: '',
    nextDt: '',
    treatment: '',
    type: '',
    status: '',
    executor: '',
    extend: {executorPhone: ''},
  };
}
</script>
<style scoped lang="scss">

</style>
