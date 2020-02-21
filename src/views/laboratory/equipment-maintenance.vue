<template>
  <div v-loading="loading" class="equipment-maintenance">
    <el-button type="primary" style="margin-bottom:5px" @click="showForm()">添加</el-button>
    <el-tabs type="card">
      <el-tab-pane label="当前维保记录">
        <lkt-table :data="deviceMaintenanceRecord" style="width:100%">          
          <el-table-column prop="device.name" label="设备名称"/>
          <el-table-column prop="id" label="设备编号"/>
          <el-table-column prop="device.type.name" label="设备型号"/>
          <el-table-column prop="restorationDt" label="最近维保时间" width="120px"/>
          <el-table-column prop="type" label="维保类型"/>
          <el-table-column prop="treatment" label="维保内容" width="100px"/>
          <el-table-column prop="executor" label="维护人"/>
          <el-table-column prop="extend.executorPhone" label="联系方式" width="100px"/>
          <el-table-column prop="nextDt" label="距离下次维护时间" width="150px"/>
          <el-table-column label="当前状态">
            <div style="color:blue">正常</div>
          </el-table-column>
          <el-table-column label="操作">
            <el-button type="danger" size="mini" @click="remove()">删除</el-button>
          </el-table-column>
        </lkt-table>
      </el-tab-pane>
      <el-tab-pane label="历史记录">
        <el-form :inline="true">
          <el-form-item label="设备名称:" label-width="80px">
            <lkt-select :list="deviceNameList" value-key="name" v-model="deviceName" multiple :clearable="false" placeholder="请选择设备名称"/>
          </el-form-item>
          <el-form-item label="设备型号:" label-width="80px">
            <lkt-select :list="deviceTypeList" value-key="name" v-model="deviceType" multiple :clearable="false" placeholder="请选择设备型号"/>
          </el-form-item>
          <el-form-item label="维保类型:" label-width="80px">
            <lkt-select :list="maintainTypeList" value-key="type" v-model="maintainType" multiple :clearable="false" placeholder="请选择维保类型"/>
          </el-form-item>
          <el-form-item label="维护日期:" label-width="80px">
            <lkt-date-picker v-model="maintainDt"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">查询</el-button>
            <el-button style="margin-left: 10px">重置</el-button>
          </el-form-item>
        </el-form> 
        <lkt-table :data="deviceMaintenanceRecord" style="width:100%">
          <el-table-column prop="occurDt" label="时间"/>          
          <el-table-column prop="device.name" label="设备名称"/>
          <el-table-column prop="id" label="设备编号"/>
          <el-table-column prop="device.type.name" label="设备型号"/>
          <el-table-column prop="type" label="维保类型"/>
          <el-table-column prop="treatment" label="维保内容" width="100px"/>
          <el-table-column prop="executor" label="维护人"/>
          <el-table-column prop="extend.executorPhone" label="联系方式" width="100px"/>
          <el-table-column label="当前状态">
            <div style="color:blue">正常</div>
          </el-table-column>
          <el-table-column label="操作">
            <el-button type="danger" size="mini" @click="remove()">删除</el-button>
          </el-table-column>
        </lkt-table>
      </el-tab-pane>
    </el-tabs>
    <kit-dialog-simple
      :modal="modal"
      :confirm="update"
      width="700px">
        <div slot="title">添加设备维保记录</div>
        <el-form v-if="modal.maintainRecordInfo" ref="form" :model="modal.maintainRecordInfo" label-width="120px" label-position="left" style="width: 580px;margin: 0 auto">
          <el-form-item label="设备名称" prop="device.name" :rules="{ required: true, message: '请输入设备名称'}">
            <el-input v-model="modal.maintainRecordInfo.device.name"></el-input>
          </el-form-item>
          <el-form-item label="设备编号" prop="id" :rules="{ required: true, message: '请输入设备编号'}">
            <el-input v-model="modal.maintainRecordInfo.id"></el-input>
          </el-form-item>
          <el-form-item label="设备型号" prop="device.type.name" :rules="{ required: true, message: '请选择设备型号'}">
              <el-select v-model="modal.maintainRecordInfo.device.type.name"></el-select>
          </el-form-item>          
          <el-form-item label="保养时间" prop="restorationDt" :rules="{ required: true, message: '请选择保养时间'}">
              <el-date-picker v-model="modal.maintainRecordInfo.restorationDt" type="date"></el-date-picker>
          </el-form-item>
          <el-form-item label="保养内容" prop="treatment" :rules="{ required: true, message: '请输入保养内容'}">
              <el-input type="text" v-model="modal.maintainRecordInfo.treatment"></el-input>
          </el-form-item>
          <el-form-item label="维保类型" prop="type" :rules="{ required: true, message: '请选择维保类型'}">
              <el-input type="text" v-model="modal.maintainRecordInfo.type"></el-input>
          </el-form-item>
          <el-form-item label="维护人" prop="executor" :rules="{ required: true, message: '请输入维护人姓名'}">
              <el-input v-model="modal.maintainRecordInfo.executor"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="extend.executorPhone">
              <el-input v-model="modal.maintainRecordInfo.extend.executorPhone"></el-input>
          </el-form-item>
          <el-form-item label="当前状态" prop="status" :rules="{ required: true, message: '请选择当前状态'}">
              <el-input type="text" v-model="modal.maintainRecordInfo.status"></el-input>
          </el-form-item>
          <el-form-item label="下次保养时间" prop="nextDt" :rules="{ required: true, message: '请选择下次保养时间'}">
              <el-date-picker v-model="modal.maintainRecordInfo.nextDt" type="date"></el-date-picker>
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
export default {
  setup() {
    const loading = ref(false);
    const modal = ref<any>({
      visible: false,
      maintainRecordInfo: null,
    });
    const deviceMaintenanceRecord = ref<any>();
    const deviceTypeList = ref<any>();
    const deviceType = ref<any>();
    const deviceNameList = ref<any>();
    const deviceName = ref<any>();
    const maintainTypeList = ref<any>();
    const maintainType = ref<any>();
    const maintainDt = '';
    const remove = (row: any) => {
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
      const valid = true;
      if (valid) {
        const { id } = modal.value.maintainRecordInfo;
        modal.value.visible = false;
        Message.success('添加成功');
        await queryMaintainRecord();
      }
    }
    const queryMaintainRecord = async () => {
      deviceMaintenanceRecord.value = [
        {id: '38-36', device: {id: '001', name: '工控机', type: {id: '0', name: 'NLJT1'}}, type: '巡检', operator: '', executor: '小明', status: '正常', description: '', position: '', reason: '',
        occurDt: '2016-10-21', treatment: '', restorationDt: '2016-10-21', nextDt: 10, extend: {executorPhone: ''}, createDt: '2016-09-21'},
        {id: '38-37', device: {id: '002', name: '切削机', type: {id: '1', name: 'NLJT2'}}, type: '保养', operator: '', executor: '小明', status: '正常', description: '', position: '', reason: '',
        occurDt: '2016-10-21', treatment: '', restorationDt: '2016-10-22', nextDt: 12, extend: {executorPhone: ''}, createDt: '2016-09-21'},
        {id: '28-38', device: {id: '003', name: '磨光机', type: {id: '2', name: 'NLJT3'}}, type: '维修', operator: '', executor: '小明', status: '正常', description: '', position: '', reason: '',
        occurDt: '2016-10-21', treatment: '', restorationDt: '2016-10-23', nextDt: 10, extend: {executorPhone: ''}, createDt: '2016-09-21'},
        {id: '28-39', device: {id: '004', name: '切削机', type: {id: '3', name: 'NLJT4'}}, type: '巡检', operator: '', executor: '小明', status: '正常', description: '', position: '', reason: '',
        occurDt: '2016-10-21', treatment: '', restorationDt: '2016-10-24', nextDt: 7, extend: {executorPhone: ''}, createDt: '2016-09-21'},
        {id: '28-32', device: {id: '005', name: '切削机', type: {id: '4', name: 'NLJT5'}}, type: '维修', operator: '', executor: '小明', status: '正常', description: '', position: '', reason: '',
        occurDt: '2016-10-21', treatment: '', restorationDt: '2016-10-25', nextDt: 17, extend: {executorPhone: ''}, createDt: '2016-09-21'},
      ];
    };
    onMounted(useLoading(loading, async () => {
      await queryMaintainRecord();
      deviceTypeList.value = [
          {id: '0', name: 'NLJT1', img: '', extend: {ctrName: ''}},
          {id: '1', name: 'NLJT2', img: '', extend: {ctrName: ''}},
          {id: '2', name: 'NLJT3', img: '', extend: {ctrName: ''}},
          {id: '3', name: 'NLJT4', img: '', extend: {ctrName: ''}},
          {id: '4', name: 'NLJT5', img: '', extend: {ctrName: ''}},
      ];
      deviceNameList.value = [
        {id: '001', collector: '', name: '工控机', type: {id: '0', name: 'NLJT1', img: '', extend: {ctrName: ''}},
        createDt: '', extend: {ip: '192.168.0.101', buyDt: '2019-12-23', keeper: '', maintenTime: '', address: '浙江自动化学院实验室01', price: '', producer: '浙江金华机床厂',
        producerContact: '', producerTel: '18977538970'}},
        {id: '002', collector: '', name: '切削机', type: {id: '1', name: 'NLJT2', img: '', extend: {ctrName: ''}},
        createDt: '', extend: {ip: '192.168.0.102', buyDt: '2019-12-23', keeper: '', maintenTime: '', address: '浙江自动化学院实验室02', price: '', producer: '浙江金华机床厂',
        producerContact: '', producerTel: '18977538970'}},
        {id: '003', collector: '', name: '磨光机', type: {id: '2', name: 'NLJT3', img: '', extend: {ctrName: ''}},
        createDt: '', extend: {ip: '192.168.0.103', buyDt: '2019-12-23', keeper: '', maintenTime: '', address: '浙江自动化学院实验室03', price: '', producer: '浙江金华机床厂',
        producerContact: '', producerTel: '18977538970'}},
      ];
      maintainTypeList.value = [
        {id: '0', type: '巡检'},
        {id: '1', type: '保养'},
        {id: '2', type: '维修'},
      ];
    }));
    return{
      deviceMaintenanceRecord, deviceTypeList, deviceType, deviceNameList, deviceName, maintainTypeList, maintainType, maintainDt, loading, modal,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      update: useLoading(loading, update),
      showForm,
    };
  },
};
function initForm() {
  return {
    id: '',
    device: {name: '', type: {name: ''}},
    restorationDt: '', nextDt: '', treatment: '',
    type: '', status: '',
    executor: '',
    extend: {executorPhone: ''},
  };
}
</script>
<style scoped lang="scss">

</style>
