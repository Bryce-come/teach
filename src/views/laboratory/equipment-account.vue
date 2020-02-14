<template>
  <div v-loading="loading" class="equipment-account">
    <el-form class="flex" label-width="80px" label-position="left">
        <el-form-item label="设备型号:">
            <el-select v-model="Device.id" value-key="model" multiple clearable filterable placeholder="请选择设备型号">
                <el-option v-for="item of Device" :key="item.id" :label="item.model" :value="item"/>
            </el-select>
        </el-form-item>
        <el-form-item label="购入时间:" style="margin-left: 20px">
            <el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
             </el-date-picker>
        </el-form-item>
        <el-form-item style="margin-left: 60px">
            <el-button type="primary">查询</el-button>
            <el-button style="margin-left: 20px">重置</el-button>
        </el-form-item>
    </el-form>
    <el-form class="flex" label-width="30px" label-position="left">
        <el-form-item><el-button type="success" @click="addDialog = true">增加</el-button>
        <el-dialog title="录入设备相关信息" :visible.sync="addDialog">
            <el-form :model="form" class="flex" label-position="left" >
                <el-form-item label="设备型号">
                    <el-input v-model="form.model"></el-input>
                </el-form-item>
                <el-form-item label="存放地址" style="margin-left:20px">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="购入日期" style="margin-left:20px">
                    <el-input v-model="form.date"></el-input>
                </el-form-item>
            </el-form>
            <el-form :model="form" class="flex" label-position="left">
                <el-form-item label="联系方式">
                    <el-input v-model="form.contact"></el-input>
                </el-form-item>
                <el-form-item label="生产厂商" style="margin-left:20px">
                    <el-input v-model="form.manufacturer"></el-input>
                </el-form-item>
                <el-form-item label="厂商联系人" style="margin-left:20px">
                    <el-input v-model="form.manuLinkman"></el-input>
                </el-form-item>
            </el-form>
            <el-form :model="form" class="flex" label-position="left" >
                <el-form-item label="厂商联系方式">
                    <el-input v-model="form.manuContact"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialog = false">取 消</el-button>
                <el-button type="primary" @click="addDialog = false" style="margin-left:10px">提 交</el-button>
            </div>
        </el-dialog>        
        </el-form-item>
        <el-form-item><el-button type="info">导出</el-button></el-form-item>
    </el-form>
     <el-table
      :data="Device"
      style="width: 100%">
      <el-table-column type="expand">
      <template >
        <el-form class="flex" label-width="100px" label-position="left" inline>
          <el-form-item label="设备IP" style="margin-left:80px">
            <span>{{Device.ip}}</span>
          </el-form-item>
          <el-form-item label="厂商联系人" style="margin-left:80px">
            <span>{{Device.manuLinkman}}</span>
          </el-form-item>
          <el-form-item label="厂商联系方式" style="margin-left:80px">
            <span>{{Device.manuContact}}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column type="selection"/>
      <el-table-column prop="model" label="设备型号" width="100px"/>
      <el-table-column prop="address" label="存放地址"/>     
      <el-table-column prop="date" label="购入日期"/>
      <el-table-column prop="contact" label="联系方式"/>
      <el-table-column prop="manufacturer" label="生产厂商"/>
      <el-table-column label="操作">
          <el-button type="danger" size="mini" @click="slice">删除</el-button>
          <el-button type="warning" size="mini" style="margin-left:5px" @click="reviseDialog = true">修改</el-button>
          <el-dialog title="修改相关信息" :visible.sync="reviseDialog">
            <el-form :model="reviseForm" class="flex" label-position="left" >
                <el-form-item label="设备型号">
                    <el-input v-model="reviseForm.model"></el-input>
                </el-form-item>
                <el-form-item label="存放地址" style="margin-left:20px">
                    <el-input v-model="reviseForm.address"></el-input>
                </el-form-item>
                <el-form-item label="购入日期" style="margin-left:20px">
                    <el-input v-model="reviseForm.date"></el-input>
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
            <div slot="footer" class="dialog-footer">
                <el-button @click="reviseDialog = false">取 消</el-button>
                <el-button type="primary" @click="reviseDialog = false" style="margin-left:10px">提 交</el-button>
            </div>
          </el-dialog>            
      </el-table-column>
    </el-table>
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
      const value1 = '';
      const addDialog = false;
      const reviseDialog = false;
      const form = {
          model: " ",
          address: " ",
          date: " ",
          contact: " ",
          manufacturer: " ",
          manuLinkman: " ",
          manuContact: " ",
      };
      const reviseForm = {
        model: " ",
        address: " ",
        date: " ",
        contact: " ",
        manufacturer: " ",
        manuLinkman: " ",
        manuContact: " ",
      };
    //   const slice = () => {
    //       this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       this.$message({
    //         type: 'success',
    //         message: '删除成功!'
    //       });
    //     }).catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '已取消删除'
    //       });         
    //     });}      
      return{
         Device, value1, addDialog, reviseDialog, form, reviseForm
      };
    },
};
</script>
<style scoped lang="scss">
.el-form-item {
    margin-bottom: 10px;
  }
</style>
