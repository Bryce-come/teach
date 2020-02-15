<template>
  <div v-loading="loading" class="equipment-maintenance">
    <el-button type="primary" style="margin-bottom:5px" @click="showForm()">添加</el-button>
    <el-tabs type="card">
      <el-tab-pane label="当前维保记录">
        <lkt-table :data="device_maintenance_record" style="width:100%">          
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
        </lkt-table></el-tab-pane>
      <el-tab-pane label="历史记录">
        <el-form :inline="true">
        <el-form-item label="设备名称:" label-width="80px">
            <el-select v-model="value1"  multiple clearable filterable placeholder="请选择设备名称">
                <el-option v-for="item of device_maintenance_record" :key="item.device.id" :label="item.device.name" :value="item.device.id"/>
            </el-select>
        </el-form-item>
        <el-form-item label="设备型号:" label-width="80px">
            <el-select v-model="value2" multiple clearable filterable placeholder="请选择设备型号">
                <el-option v-for="item of device_maintenance_record" :key="item.device.type.id" :label="item.device.type.name" :value="item.device.type.id"/>
            </el-select>
        </el-form-item>
        <el-form-item label="维保类型:" label-width="80px">
            <el-select v-model="value3" multiple clearable filterable placeholder="请选择维保类型">
                <el-option v-for="item of device_maintenance_record" :key="item.id" :label="item.type" :value="item.id"/>
            </el-select>
        </el-form-item>
        <el-form-item label="维护日期:" label-width="80px">
            <el-date-picker v-model="value4" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
             </el-date-picker>
             <el-button type="primary" style="margin-left: 500px">查询</el-button>
            <el-button style="margin-left: 20px">重置</el-button>
        </el-form-item>
        </el-form> 
        <lkt-table :date="device_maintenance_record">
          <el-table-column label="时间" prop="occurDt"/>
          <el-table-column label="设备名称" prop="device.name"/>
          <el-table-column label="设备编号" prop="id"/>
          <el-table-column label="设备型号" prop="device.type.name"/>
          <el-table-column label="维保类型" prop="type"/>
          <el-table-column label="维保内容" prop="treatment"/>
          <el-table-column label="维护人" prop="executor"/>
          <el-table-column label="联系方式" prop="extend.executorPhone"/>
          <el-table-column label="当前状态" prop="status"/>
          <el-table-column label="操作">
            <el-button type="danger" size="mini">删除</el-button> 
          </el-table-column>
        </lkt-table>
      </el-tab-pane>
    </el-tabs>
    <kit-dialog-simple title="新增设备维修记录" :modal="modal">
      <el-form :model="maintainForm" class="flex" label-position="left" >
                <el-form-item label="设备名称">
                    <el-input v-model="maintainForm.name" placeholder="请输入设备名称"></el-input>
                </el-form-item>
                <el-form-item label="设备编号" style="margin-left:20px">
                    <el-input v-model="maintainForm.number" placeholder="请输入设备编号"></el-input>
                </el-form-item>
                <el-form-item label="设备型号" style="margin-left:20px">
                    <el-select v-model="models" placeholder="请选择设备型号">
                      <el-option v-for="item in maintainForm.model" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-form :model="maintainForm" class="flex" label-position="left">
                <el-form-item label="最近维保时间">
                    <el-date-picker v-model="restorationDt" type="date" placeholder="请选择时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="维修类型" style="margin-left:20px">
                    <el-select v-model="maintainTypes" placeholder="请选择维修类型">
                      <el-option v-for="item in maintainForm.maintainType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="维修内容" style="margin-left:20px">
                    <el-input v-model="maintainForm.maintain" placeholder="请输入维修内容"></el-input>
                </el-form-item>
            </el-form>
            <el-form :model="maintainForm" class="flex" label-position="left" >
                <el-form-item label="维护人">
                    <el-input v-model="maintainForm.maintainMan" placeholder="请输入维护人姓名"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" style="margin-left:20px">
                    <el-input v-model="maintainForm.contact" placeholder="请输入维护人联系方式"></el-input>
                </el-form-item>
                <el-form-item label="当前状态" style="margin-left:20px">
                    <el-select v-model="status" placeholder="请选择当前状态">
                      <el-option v-for="item in maintainForm.status" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-form :model="maintainForm" class="flex" label-position="left">
              <el-form-item label="下次维保时间">
                <el-date-picker v-model="nextDt" type="date" placeholder="请选择下次维修时间"></el-date-picker>
              </el-form-item>
            </el-form>         
    </kit-dialog-simple>    
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
import { Message } from 'element-ui';
import { useConfirm, useLoading } from 'web-toolkit/src/service';
export default {
  setup() {
    const loading = ref(false);
    const modal = ref<any>({
      visible: false,
    });
    const device_maintenance_record = ref<any>();
    const remove = () => {
      Message.success('删除成功');
    };
    const maintainForm = {
      name: '',
      number: '',
      model: [{
        value: '1',
        label: 'NLJT001',
      }, {
        value: '2',
        label: 'NLJT002',
      },{
        value: '3',
        label: 'NLJT003',
      },{
        value: '4',
        label: 'NLJT004',
      },{
        value: '5',
        label: 'NLJT005',
      }],
      currentMaintain: '',
      maintainType: [{
        value: '0',
        label: '巡检',
      }, {
        value: '1',
        label: '保养',
      }, {
        value: '2',
        label: '维修',
      }],
      maintain: '',
      maintainMan: '',
      contact: '',
      nextTime: '',
      status: [{
        vlaue: '0',
        label: '正常',
      }, {
        value: '1',
        label: '维护中',
      }, {
        value: '2',
        label: '故障',
      }, {
        value: '3',
        label: '告警',
      }, {
        value: '4',
        label: '报废',
      }],
    };
    const models = '';
    const value1 = '';
    const value2 = '';
    const value3 = '';
    const value4 = '';
    const showForm = () => {
      modal.value.visible = true;
    };
    const querymaintainRecord = async () => {
      device_maintenance_record.value = [
        {id: '38-36', device: {id: "001", name: 'xx机', type: {id: "0", name: 'NLJT1'}}, type: "巡检", operator: '', executor: '', status: '正常', description: '', position: '', reason: '',
        occurDt: '2016-10-21', treatment: '', restorationDt: '2016-10-21', nextDt: 10, extend: {executorPhone: ''}, createDt: '2016-09-21'},
        {id: '38-36', device: {id: "001", name: 'xx机', type: {id: "1", name: 'NLJT2'}}, type: "0", operator: '', executor: '', status: '正常', description: '', position: '', reason: '',
        occurDt: '2016-10-21', treatment: '', restorationDt: '2016-10-22', nextDt: 12, extend: {executorPhone: ''}, createDt: '2016-09-21'},
        {id: '28-36', device: {id: "001", name: 'xx机', type: {id: "2", name: 'NLJT3'}}, type: "0", operator: '', executor: '', status: '正常', description: '', position: '', reason: '',
        occurDt: '2016-10-21', treatment: '', restorationDt: '2016-10-23', nextDt: 10, extend: {executorPhone: ''}, createDt: '2016-09-21'},
        {id: '28-36', device: {id: "001", name: 'xx机', type: {id: "3", name: 'NLJT4'}}, type: "0", operator: '', executor: '', status: '正常', description: '', position: '', reason: '',
        occurDt: '2016-10-21', treatment: '', restorationDt: '2016-10-24', nextDt: 7, extend: {executorPhone: ''}, createDt: '2016-09-21'},
        {id: '28-36', device: {id: "001", name: 'xx机', type: {id: "4", name: 'NLJT5'}}, type: '0', operator: '', executor: '', status: '正常', description: '', position: '', reason: '',
        occurDt: '2016-10-21', treatment: '', restorationDt: '2016-10-25', nextDt: 17, extend: {executorPhone: ''}, createDt: '2016-09-21'},
      ]
    };
    onMounted(useLoading(loading, async () => {
      await querymaintainRecord();
    }));      
    return{
      device_maintenance_record, value1, value2, value3, value4, loading, modal, maintainForm, 
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      showForm,
    };
  },
};
</script>
<style scoped lang="scss">

</style>
