<template>
  <div class="equipment-account">
    <el-form>
        <el-form-item label="设备型号:" label-width="80px">
            <el-select v-model="value1" multiple clearable filterable placeholder="请选择设备型号">
                <el-option v-for="item of deviceaccountList" :key="item.type.id" :label="item.type.name" :value="item.type.id"/>
            </el-select>
        </el-form-item>
        <el-form-item label="购入时间:" label-width="80px">
            <el-date-picker v-model="value2" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
             </el-date-picker>
             <el-button type="primary" style="margin-left: 20px">查询</el-button>
            <el-button style="margin-left: 20px">重置</el-button>
        </el-form-item>
        <el-form-item>
            <el-button type="success" @click="showForm()">增加</el-button>
            <el-button type="info" style="margin-left: 20px">导出</el-button>
        </el-form-item>
    </el-form>    
     <lkt-table
      :data="deviceaccountList"
      style="width: 100%">
      <el-table-column type="expand">
      <template slot-scope="props">
        <el-form class="flex" label-width="100px" label-position="left" inline>
          <el-form-item label="设备IP" style="margin-left:80px">
            <span>{{props.row.extend.ip}}</span>
          </el-form-item>
          <el-form-item label="厂商联系人" style="margin-left:80px">
            <span>{{props.row.extend.producerContact}}</span>
          </el-form-item>
          <el-form-item label="厂商联系方式" style="margin-left:80px">
            <span>{{props.row.extend.producerTel}}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
      <el-table-column prop="type.name" label="设备型号" width="100px"/>
      <el-table-column prop="extend.address" label="存放地址"/>     
      <el-table-column prop="extend.buyDt" label="购入日期"/>
      <el-table-column prop="extend.producerTel" label="联系方式"/>
      <el-table-column prop="extend.producer" label="生产厂商"/>
      <el-table-column label="操作">
          <el-button type="danger" size="mini" @click="remove()">删除</el-button>
          <el-button type="warning" size="mini" style="margin-left:5px" @click="showForm()">修改</el-button>           
      </el-table-column>
    </lkt-table>
    <kit-dialog-simple title="录入设备相关信息" :modal="modal" :confirm="update">
            <el-form :model="form" class="flex" label-position="left">
                <el-form-item label="设备型号">
                    <el-select v-model="form.model" placeholder="请选择设备型号"></el-select>
                </el-form-item>
                <el-form-item label="存放地址" style="margin-left:20px">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="购入日期" style="margin-left:20px">
                    <el-date-picker v-model="form.date" type="date" placeholder="请选择购入日期"></el-date-picker>
                </el-form-item>
            </el-form>
            <el-form :model="form" class="flex" label-position="left">
                <el-form-item label="联系方式">
                    <el-input v-model="form.contact" placeholder="请输入联系方式"></el-input>
                </el-form-item>
                <el-form-item label="生产厂商" style="margin-left:20px">
                    <el-input v-model="form.manufacturer" placeholder="请输入生产厂商"></el-input>
                </el-form-item>
                <el-form-item label="厂商联系人" style="margin-left:20px">
                    <el-input v-model="form.manuLinkman" placeholder="请输入厂商联系人"></el-input>
                </el-form-item>
            </el-form>
            <el-form :model="form" class="flex" label-position="left" >
                <el-form-item label="厂商联系方式">
                    <el-input v-model="form.manuContact" placeholder="请输入厂商联系方式"></el-input>
                </el-form-item>
            </el-form>
    </kit-dialog-simple>
    <kit-dialog-simple title="修改相关信息" :modal="modal">
            <el-form :model="reviseForm" class="flex" label-position="left" >
                <el-form-item label="设备型号">
                    <el-select v-model="reviseForm.model"></el-select>
                </el-form-item>
                <el-form-item label="存放地址" style="margin-left:20px">
                    <el-input v-model="reviseForm.address"></el-input>
                </el-form-item>
                <el-form-item label="购入日期" style="margin-left:20px">
                    <el-date-picker v-model="reviseForm.date" type="date"></el-date-picker>
                </el-form-item>
            </el-form>
            <el-form :model="reviseForm" class="flex" label-position="left">
                <el-form-item label="联系方式">
                    <el-input v-model="reviseForm.contact"></el-input>
                </el-form-item>
                <el-form-item label="生产厂商" style="margin-left:20px">
                    <el-input v-model="reviseForm.manufacturer"></el-input>
                </el-form-item>
                <el-form-item label="厂商联系人" style="margin-left:20px">
                    <el-input v-model="reviseForm.manuLinkman"></el-input>
                </el-form-item>
            </el-form>
            <el-form :model="reviseForm" class="flex" label-position="left" >
                <el-form-item label="厂商联系方式">
                    <el-input v-model="reviseForm.manuContact"></el-input>
                </el-form-item>
            </el-form>
    </kit-dialog-simple> 
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
import { useConfirm, useLoading } from 'web-toolkit/src/service';
import { Message } from 'element-ui';
export default {
  setup() {
      const loading = ref(false);
      const deviceaccountList = ref<any>();
      const value1 = {};
      const value2 = '';
      const form = {
          model: '',
          address: '',
          date: '',
          contact: '',
          manufacturer: '',
          manuLinkman: '',
          manuContact: '',
      };
      const reviseForm = {
          model: '',
          address: '',
          date: '',
          contact: '',
          manufacturer: '',
          manuLinkman: '',
          manuContact: '',
      };
      const query = async () => {
          deviceaccountList.value = [
          {id: '001', collector: '', name: 'xx机', type: {id: '0', name: 'NLJT1', img: '', extend: {ctrName: ''}},
          createDt: '', extend: {ip: '192.168.0.101', buyDt: '2019-12-23', keeper: '王小明', maintenTime: '', address: '浙江自动化学院实验室01', price: '', producer: '浙江金华机床厂',
          producerContact: '', producerTel: '18977538970'}},
          {id: '002', collector: '', name: 'xx机', type: {id: '1', name: 'NLJT2', img: '', extend: {ctrName: ''}},
          createDt: '', extend: {ip: '192.168.0.102', buyDt: '2019-12-23', keeper: '王小明', maintenTime: '', address: '浙江自动化学院实验室02', price: '', producer: '浙江金华机床厂',
          producerContact: '', producerTel: '18977538970'}},
          {id: '003', collector: '', name: 'xx机', type: {id: '2', name: 'NLJT3', img: '', extend: {ctrName: ''}},
          createDt: '', extend: {ip: '192.168.0.103', buyDt: '2019-12-23', keeper: '王小明', maintenTime: '', address: '浙江自动化学院实验室03', price: '', producer: '浙江金华机床厂',
          producerContact: '', producerTel: '18977538970'}},
          {id: '004', collector: '', name: 'xx机', type: {id: '3', name: 'NLJT4', img: '', extend: {ctrName: ''}},
          createDt: '', extend: {ip: '192.168.0.104', buyDt: '2019-12-23', keeper: '王小明', maintenTime: '', address: '浙江自动化学院实验室04', price: '', producer: '浙江金华机床厂',
          producerContact: '', producerTel: '18977538970'}},
          {id: '005', collector: '', name: 'xx机', type: {id: '4', name: 'NLJT5', img: '', extend: {ctrName: ''}},
          createDt: '', extend: {ip: '192.168.0.105', buyDt: '2019-12-23', keeper: '王小明', maintenTime: '', address: '浙江自动化学院实验室05', price: '', producer: '浙江金华机床厂',
          producerContact: '', producerTel: '18977538970'}}
          ];
      };
      const remove = () => {
          Message.success('删除成功');
      };
      const modal = ref<any>({
          visible: false,
    });
      const showForm = () => {
          modal.value.visible = true;
      };
      async function update() {
          modal.value.visible = false;
      };
      onMounted(useLoading(loading, async () => {
      await query();
    }));
      return{
         deviceaccountList, value1, value2, form, reviseForm, modal, showForm,
         remove: useConfirm('确认删除？', useLoading(loading, remove)),
         update: useLoading(loading, update),         
      };
    },
};
</script>
<style scoped lang="scss">
.el-form-item {
    margin-bottom: 10px;
  }
</style>
