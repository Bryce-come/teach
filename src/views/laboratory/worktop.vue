<template>
  <div v-loading="loading" class="worktop">
    <el-row :gutter="40" type="flex" justify="space-between">
      <el-col :span="6">
        <el-input placeholder="输入关键字搜索" v-model="filterText" style="margin-bottom:5px"></el-input>
        <div class='flex end' style="margin-bottom:5px">
          <el-button type="success" size="small" style="margin-left:5px" @click="showForm()">添加</el-button>
          <el-button type="danger" size="small" style="margin-left:5px" @click="del()">删除</el-button>
        </div>
        <el-row>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>操作台列表</span>
            </div>
            <div v-for="d of stationList" :key="d.id" style="padding: 5px; text-align: left;">
              <el-button class="device-button" size="medium" @click="query(d.id)">{{ d.name }}</el-button>
            </div>
          </el-card>
        </el-row>
      </el-col>
      <el-col :span="18" style="box-shadow:0 2px 12px 0 rgba(0, 0, 0, .12);margin-right：100px" >
        <el-form v-model="expStationList">
          <el-form-item :label="expStationList.name +' > 关联设备信息'" style='margin-top:10px'>
            <div class="flex end">
            <el-button type="primary" size="mini" @click="showDeviceForm()">添加</el-button>
            </div>
            <el-table
            :data="expStationList.deviceList"
            style="width:100%">
            <el-table-column prop="id" label="设备编号"/>
            <el-table-column prop="name" label="设备名称"/>
            <el-table-column prop="deviceType.name" label="设备型号"/>
            <el-table-column prop="collector.no" label="设备IP">
              <span slot-scope="{ row }" v-if="row.collector">
                {{row.collector.no}}
              </span>
            </el-table-column>
            <el-table-column prop="collector.mac" label="LKT-MAN编号" width="120px">
              <span slot-scope="{ row }" v-if="row.collector">
                {{row.collector.mac}}
              </span>              
            </el-table-column>
            <el-table-column prop="collector.off" label="网关状态">
              <div slot-scope="{ row }" v-if="row.collector">
                <span v-if="row.collector.off">开启</span>
                <span v-else>关闭</span>
              </div>
            </el-table-column>
            <el-table-column label="操作" width="160px">
              <div class="flex center little-space wrap" slot-scope="{row}">
                <el-button type="danger" size="mini" @click="remove(row)">删除</el-button>
              </div>              
            </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item :label="expStationList.name + ' > PC信息'">
            <div class="flex end">
            <el-button type="primary" size="mini" @click="showPCForm()">添加</el-button>
            </div>
            <el-table
            :data="expStationList.extend.PCs"
            style="width:100%">
            <el-table-column prop="PCNo" label="PC编号"/>
            <el-table-column prop="PCIP" label="PC的IP"/>
            <el-table-column prop="belongDevice" label="所属设备编号"/>
            <el-table-column label="操作" width="160px">
              <div class="flex center little-space wrap" slot-scope="{ row }">
                <el-button type="danger" size="mini" @click="remove(row)">删除</el-button>
              </div>   
            </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item :label="expStationList.name + ' > 摄像头信息'">
            <div class="flex end">
            <el-button type="primary" size="mini" @click="showCamareForm()">添加</el-button>
            </div>
            <el-table
            :data="expStationList.extend.cameras"
            style="width:100%">
            <el-table-column prop="name" label="摄像头名称"/>
            <el-table-column prop="ip" label="摄像头IP"/>
            <el-table-column label="操作" width="160px">
              <div class="flex center little-space wrap" slot-scope="{ row }">
                <el-button type="danger" size="mini" @click="remove(row)">删除</el-button>
              </div>   
            </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <kit-dialog-simple
      :modal="modal"
      :confirm="update"
      width="500px">
        <div slot="title">添加操作台</div>
        <el-form v-if="modal.workTopInfo" ref="form" :model="modal.workTopInfo" label-width="120px" label-position="left" style="width: 300px;margin: 0 auto">
          <el-form-item label="试验台名称：" prop="name" :rules="{ required: true, message: '请输入操作台名称'}">
              <el-input v-model="modal.workTopInfo.name"></el-input>
          </el-form-item>
          <!-- <el-form-item label="关联设备" prop="devices" :rules="{ required: true, message: '请输入关联设备数量'}">
              <el-input v-model="modal.workTopInfo.devices"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="关联PC数量：" prop="extend.PCs.remark" :rules="{ required: true, message: '请输入关联PC数量'}">
              <el-input v-model="modal.workTopInfo.extend.PCs.remark"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="密码" prop="pwd" :rules="{ required: true, message: '请输入密码'}">
              <el-input v-model="addModal.teacherInfo.pwd"></el-input>
          </el-form-item>
          <el-form-item label="邮箱地址" prop="address" :rules="{ required: true, message: '请输入邮箱地址'}">
              <el-input v-model="addModal.teacherInfo.address"></el-input>
          </el-form-item> -->
        </el-form>
    </kit-dialog-simple>
    <kit-dialog-simple
      :modal="addDeviceModal"
      :confirm="deciceUpdate"
      width="500px">
        <div slot="title">添加关联设备</div>
        <el-form v-if="addDeviceModal.deviceInfo" ref="form1" :model="addDeviceModal.deviceInfo" label-width="120px" label-position="left" style="width: 300px;margin: 0 auto">
          <el-form-item label="设备名称：" prop="device.name" :rules="{ required: true, message: '请选择设备'}">
            <el-select value-key="id" v-model="addDeviceModal.deviceInfo.device"  placeholder="请选择设备名称">
              <el-option
                v-for="item of deviceNameList"
                :key="item.id"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>  
          </el-form-item>
          <el-form-item label="LKT-MAN编号：" prop="collector.no" :rules="{ required: true, message: '请填入信息'}" >
            <el-input v-model="addDeviceModal.deviceInfo.collector.no"></el-input>
          </el-form-item>
        </el-form>
    </kit-dialog-simple>
    <kit-dialog-simple
      :modal="addPCModal"
      :confirm="PCUpdate"
      width="500px">
        <div slot="title">添加PC信息</div>
        <el-form v-if="addPCModal.PCInfo" ref="form2" :model="addPCModal.PCInfo" label-width="120px" label-position="left" style="width: 300px;margin: 0 auto">
          <el-form-item label="PC编号：" prop="PCNo" :rules="{ required: true, message: '请输入PC编号'}">
            <el-input v-model="addPCModal.PCInfo.PCNo"></el-input>
          </el-form-item>
          <el-form-item label="PC的IP:" prop="PCIP" :rules="{ required: true, message: '请输入PC编号'}">
            <el-input v-model="addPCModal.PCInfo.PCIP"></el-input>
          </el-form-item>
          <el-form-item label="所属设备编号:" prop="belongDevice" :rules="{ required: true, message: '请输入所属设备编号'}">
            <el-select v-model="addPCModal.PCInfo.belongDevice" placeholder="请选择设备编号">
            <el-option
              v-for="item of devicesList"
              :key="item.id"
              :label="item.id"
              :value="item.id">
            </el-option>
            </el-select>
          </el-form-item>
        </el-form>
    </kit-dialog-simple>
    <kit-dialog-simple
      :modal="addCameraModal"
      :confirm="infoUpdate"
      width="500px">
        <div slot="title">添加摄像头信息</div>
        <el-form v-if="addCameraModal.cameraInfo" ref="form3" :model="addCameraModal.cameraInfo" label-width="120px" label-position="left" style="width: 300px;margin: 0 auto">
          <el-form-item label="摄像头名称：" prop="name" :rules="{ required: true, message: '请输入摄像头名称'}">
            <el-input v-model="addCameraModal.cameraInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="摄像头IP：" prop="ip" :rules="{ required: true, message: '请输入摄像头IP'}">
            <el-input v-model="addCameraModal.cameraInfo.ip"></el-input>
          </el-form-item>
        </el-form>
    </kit-dialog-simple>
      <kit-dialog-simple
      :modal="stationModel"
      :confirm="confirmStation"
      width="400px">
        <div class="flex center" v-if="stationModel.stationInfo">
          <span>{{'确认删除'+ stationModel.stationInfo.name}}</span>
        </div>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, onMounted, watch} from '@vue/composition-api';
import { useLoading, useConfirm, useSearch} from 'web-toolkit/src/service';
import {ElTree} from 'element-ui/types/tree';
import {ElForm} from 'element-ui/types/form';
import { Message } from 'element-ui';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
import { StationList, StationInfo, StationAdd, StationUpdate, StationDel, StationAddComponent, StationDelComponent } from '@/dao/stationDao';
import { DeviceList } from '@/dao/deviceDao';
export default {
  setup() {
    const loading = ref(false);
    const tree = ref<ElTree<any, any>|null>(null);
    const form = ref<ElForm|null>(null);
    const form1 = ref<ElForm|null>(null);
    const form2 = ref<ElForm|null>(null);
    const form3 = ref<ElForm|null>(null);
    const list = ref<any>();
    const [filterText, stationList] = useSearch(list, {
      includeProps: ['name'],
    });
    const stationId = ref<any>(null);
    const stationModel = ref<any>(
      {
        visible: false,
        stationInfo: null,
      }
    );
    const expStationList = ref<any>();
    const deviceNameList = ref<any>();
    const devicesList = ref<any>([]);
    const props = ref({
      children: 'children',
      label: 'name',
    });
    const modal = ref<any>({
      visible: false,
      workTopInfo: null,
    });
    // 添加操作台
    const showForm = async (data?: any) => {
      if (form.value) { (form.value as ElForm).clearValidate(); }
      if (data) {
        data = deepClone(data);
      } else {
        data = initForm();
      }
      modal.value.workTopInfo = data;
      modal.value.visible = true;
    };
    async function update() {
      const valid =  await (form.value as ElForm).validate();
      if (valid) {
        await StationAdd ({
          name: modal.value.workTopInfo.name,
        });
        modal.value.visible = false;
        Message.success('添加成功');
        await queryStation();
      }
    }
    const del = async () => {
      stationModel.value.stationInfo = expStationList.value;
      stationModel.value.visible = true;
      console.log(stationModel.value.stationInfo);
      }
    
    const confirmStation = async () => {
      await StationDel({
        id: stationModel.value.stationInfo.id,
      });
      await queryStation();
      await query();
      stationModel.value.visible = false;
    };
    //
    const addDeviceModal = ref<any>({
      visible: false,
      deviceInfo: null,
    });
    const showDeviceForm = async (data?: any) => {
      if (form1.value) { (form1.value as ElForm).clearValidate(); }
      if (data) {
        data = deepClone(data);
      } else {
        data = initDeviceForm();
      }
      addDeviceModal.value.deviceInfo = data;
      addDeviceModal.value.visible = true;
    };
    const addPCModal = ref<any>({
      visible: false,
      PCInfo: null,
    });
    const showPCForm = async (data?: any) => {
      if (form2.value) { (form2.value as ElForm).clearValidate(); }
      if (data) {
        data = deepClone(data);
      } else {
        data = initPCForm();
      }
      addPCModal.value.PCInfo = data;
      addPCModal.value.visible = true;
    };
    const addCameraModal = ref<any>({
      visible: false,
      cameraInfo: null,
    });
    const showCamareForm = async (data?: any) => {
      if (form3.value) { (form3.value as ElForm).clearValidate(); }
      if (data) {
        data = deepClone(data);
      } else {
        data = initPCForm();
      }
      addCameraModal.value.cameraInfo = data;
      addCameraModal.value.visible = true;
    };
    const addComponent = async () => {
       await StationAddComponent({
          id: stationId.value,
          deviceId: addDeviceModal.value.deviceInfo.device.id ? addDeviceModal.value.deviceInfo.device.id : null,
          adapterId: addDeviceModal.value.deviceInfo.collector.no ? addDeviceModal.value.deviceInfo.collector.no : null,
          pcJson: addPCModal.value.PCInfo ? JSON.stringify(addPCModal.value.PCInfo) : null,
          cameraJson: addCameraModal.value.cameraInfo ? JSON.stringify(addCameraModal.value.cameraInfo) : null,
          deviceIP: null,
        });
    };
    const deciceUpdate = async () => {
       const valid1 =  await (form1.value as ElForm).validate();
       if (valid1) {
        console.log(addDeviceModal.value.deviceInfo.device.id);
        await StationAddComponent({
          id: stationId.value,
          deviceId: addDeviceModal.value.deviceInfo.device.id ? addDeviceModal.value.deviceInfo.device.id : null,
          adapterId: addDeviceModal.value.deviceInfo.collector.no ? addDeviceModal.value.deviceInfo.collector.no : null});
        addDeviceModal.value.visible = false;
        await query(stationId.value);
        console.log(expStationList.value);
        Message.success('设备添加成功');
       }
    };
    const PCUpdate = async () => {
       const valid2 =  await (form2.value as ElForm).validate();
       if (valid2) {
        await StationAddComponent({
          id: stationId.value,
          pcJson: addPCModal.value.PCInfo ? JSON.stringify(addPCModal.value.PCInfo) : null});
        addPCModal.value.visible = false;
        await query(stationId.value);
        Message.success('PC添加成功');
       }
    };
    const infoUpdate = async () => {
      const valid3 =  await (form3.value as ElForm).validate();
      if (valid3) {
        await StationAddComponent({
        id: stationId.value,
        cameraJson: addCameraModal.value.cameraInfo ? JSON.stringify(addCameraModal.value.cameraInfo) : null});
        addCameraModal.value.visible = false;
        await query(stationId.value);
        Message.success('摄像头添加成功');
      }
    };
    const remove = async (row: any) => {
      await StationDelComponent({
        id: stationId.value,
        deviceId: row.id ? row.id : null,
        PCIP: row.PCIP ? row.PCIP : null,
        cameraIP: row.ip ? row.ip : null,
      });
      await query(stationId.value);
      Message.success('删除成功');
      console.log(stationId.value);
    };
    const query = async (id?: any) => {
      if (id) {
        stationId.value = id;
        } else {
          if (list.value) {
            stationId.value = list.value[0].id;
          }
      }
      if (stationId.value !== null) {
        expStationList.value = await StationInfo({
          id: stationId.value,
        });
        devicesList.value = expStationList.value.deviceList;
        console.log(expStationList.value);
      }
    };
    const queryStation = async () => {
      list.value = await StationList({
        simple: true,
      });
      console.log(list.value);
    };
    onMounted(useLoading(loading, async () => {
      deviceNameList.value = await DeviceList({
        types: null,
        start: null,
        end: null,
      });
      await queryStation();
      await query();
    }));
    return{
      loading, expStationList, list, tree, props, filterText, stationList,
      query, modal, form, showForm,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      update: useLoading(loading, update),
      queryStation: useLoading(loading, queryStation),
      stationId,
      showDeviceForm, showPCForm, showCamareForm,
      addDeviceModal, addPCModal, addCameraModal,
      form1, form2, form3, deviceNameList, infoUpdate,
      addComponent, deciceUpdate,  PCUpdate,
      del: useLoading(loading, del),
      stationModel, confirmStation, devicesList,
    };
  },
};
function initForm() {
  return {
    id: '', name: '', devices: [], deviceList: [], off: '',
    extend: {PCs: [], remark: '', cameras: []},
  };
}
function initDeviceForm() {
  return {
    device: {
    id: '',
    name: '',
    type: '',
    deviceType: ''},
    collector: {
      no: '',
      mac: '',
      off: '',
    },
  };
}
function initPCForm() {
  return {
    PCIP: '',
    PCNo: '',
    belongDevice: '',
    remark: '',
  };
}
function initCameraForm() {
  return {
    name: '',
    channelId: '',
    remark: ''};
}
</script>
<style scoped lang="scss">

</style>
