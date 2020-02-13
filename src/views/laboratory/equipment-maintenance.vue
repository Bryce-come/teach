<template>
  <div v-loading="loading" class="equipment-maintenance">
    <el-tabs type="card">
      <el-tab-pane label="当前维保记录">
        <el-table :data="Device" style="width:100%">
          <el-table-column type="selection"/>
          <el-table-column prop="name" label="设备名称"/>
          <el-table-column prop="number" label="设备编号"/>
          <el-table-column prop="model" label="设备型号"/>
          <el-table-column prop="currentMaintain" label="最近维保时间" width="120px"/>
          <el-table-column prop="maintainType" label="维保类型"/>
          <el-table-column prop="maintain" label="维保内容" width="180px"/>
          <el-table-column prop="maintainMan" label="维护人"/>
          <el-table-column prop="contact" label="联系方式"/>
          <el-table-column prop="nextTime" label="距离下次维护时间" width="150px"/>
          <el-table-column label="当前状态"/>
        </el-table></el-tab-pane>
      <el-tab-pane label="历史记录">record</el-tab-pane>
    </el-tabs>
    
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
export default {
  setup() {
    const Device = [{
          id: '001',    
          model: 'NLJT001',
          address: '浙江自动化学院实验室-01',
          date: '2019-05-02',
          contact: '111111111',
          manufacturer: '浙江金华机床厂',
          ip: '192.168.0.101',
          manuLinkman: '张晓明',
          manuContact: '12345678',          
      }, {
          id: '002',
          model: 'NLJT002',
          address: '浙江自动化学院实验室-02',
          date: '2019-05-02',
          contact: '111111111',
          manufacturer: '浙江金华机床厂',
          ip: '192.168.0.102',
          manuLinkman: '张晓明',
          manuContact: '12345678',
      }, {
          id: '003',
          model: 'NLJT003',
          address: '浙江自动化学院实验室-03',
          date: '2019-05-02',
          contact: '111111111',
          manufacturer: '浙江金华机床厂',
          ip: '192.168.0.103',
          manuLinkman: '张晓明',
          manuContact: '12345678',        
      }, {
          id: '004',
          model: 'NLJT004',
          address: '浙江自动化学院实验室-04',
          date: '2019-05-02',
          contact: '111111111',
          manufacturer: '浙江金华机床厂',
          ip: '192.168.0.104',
          manuLinkman: '张晓明',
          manuContact: '12345678',
      }, {
          id: '005',
          model: 'NLJT005',
          address: '浙江自动化学院实验室-05',
          date: '2019-05-02',
          contact: '111111111',
          manufacturer: '浙江金华机床厂',
          ip: '192.168.0.105',
          manuLinkman: '张晓明',
          manuContact: '12345678',
      }];
    return{
      Device,
    };
  },
};
</script>
<style scoped lang="scss">

</style>
