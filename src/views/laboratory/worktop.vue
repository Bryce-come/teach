<template>
  <div v-loading="loading" class="worktop">
    <el-row :gutter="10" type="flex" justify="space-between">
      <el-col :span="5">
        <el-input placeholder="输入关键字搜索" v-model="filterText" clearable style="margin-bottom:5px"/>
        <div class='flex end' style="margin-bottom:5px">
          <el-button type="success" size="small" style="margin-left:5px" @click="showForm()">添加</el-button>
          <el-button type="danger" size="small" style="margin-left:5px" @click="del()">删除</el-button>
        </div>
        <div class="block-card">
          <div class="title" style="font-size: 1rem">
            <span>操作台列表</span>
          </div>
          <div class="content flex column center" >
            <el-button
              v-for="d of stationList" :key="d.id"
              :type="stationId===d.id?'primary':''"
              size="medium"
              style="width: 80%;min-width: 120px;margin-bottom: 5px"
              @click="query(d.id)">{{ d.name }}</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="19">
        <div class="block-card">
          <div class="title flex between" style="font-size: 1.1em">
            <div>{{expStation.name +' > 关联设备信息'}}</div>
            <el-button type="success" size="mini" @click="showDeviceForm()">添加</el-button>
          </div>
          <div class="content">
            <el-table
              :data="expStation.deviceList"
              style="width:100%">
              <el-table-column prop="id" label="设备编号"/>
              <el-table-column prop="name" label="设备名称"/>
              <el-table-column prop="deviceType.name" label="设备型号"/>
              <el-table-column prop="extend.ip" label="设备IP"/>
              <el-table-column prop="collector.id" label="网关编号"/>
<!--              <el-table-column prop="collector.extend.outerIp" label="网关外IP"/>-->
              <el-table-column prop="collector.extend.innerIp" label="网关内IP"/>
              <el-table-column label="操作" width="100px">
                <div slot-scope="{row}">
                  <el-button type="danger" size="mini" @click="remove(row)">删除</el-button>
                </div>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="block-card">
          <div class="title flex between" style="font-size: 1.1em">
            <div>{{expStation.name + ' > PC信息'}}</div>
            <el-button type="success" size="mini" @click="showPCForm()">添加</el-button>
          </div>
          <div class="content">
            <el-table
              :data="expStation.extend.PCs"
              style="width:100%">
              <el-table-column prop="PCNo" label="PC编号"/>
              <el-table-column prop="PCIP" label="PC IP"/>
              <el-table-column prop="belongDevice" label="所属设备编号"/>
              <el-table-column label="操作" width="100px">
                <div class="flex center little-space wrap" slot-scope="{ row }">
                  <el-button type="danger" size="mini" @click="remove(row)">删除</el-button>
                </div>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="block-card">
          <div class="title flex between" style="font-size: 1.1em">
            <div>{{expStation.name + ' > 摄像头信息'}}</div>
            <el-button type="success" size="mini" @click="showCameraForm()">添加</el-button>
          </div>
          <div class="content">
            <el-table
              :data="expStation.extend.cameras"
              style="width:100%">
              <el-table-column prop="name" label="摄像头名称"/>
              <el-table-column prop="channelId" label="摄像头通道号"/>
              <el-table-column label="操作" width="100px">
                <div class="flex center little-space wrap" slot-scope="{ row }">
                  <el-button type="danger" size="mini" @click="remove(row)">删除</el-button>
                </div>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
    <kit-dialog-simple
      id="station"
      @submit.native.prevent
      :modal="modal"
      :confirm="update"
      width="500px">
      <div slot="title">添加操作台</div>
      <el-form v-if="modal.workTopInfo" ref="form" :model="modal.workTopInfo" label-width="120px" label-position="left"
               style="width: 300px;margin: 0 auto">
        <el-form-item label="操作台名称：" prop="name" :rules="{ required: true, message: '请输入操作台名称'}">
          <el-input v-model="modal.workTopInfo.name" clearable/>
        </el-form-item>
      </el-form>
    </kit-dialog-simple>
    <kit-dialog-simple
      id="station-device"
      :modal="addDeviceModal"
      :confirm="deviceUpdate"
      width="500px">
      <div slot="title">添加关联设备</div>
      <el-form v-if="addDeviceModal.deviceInfo" ref="form1" :model="addDeviceModal.deviceInfo" label-width="110px" label-position="left" style="width: 90%;margin: 0 auto">
        <el-form-item label="设备名称：" prop="device" :rules="{ required: true, message: '请选择设备'}">
          <el-select value-key="id" v-model="addDeviceModal.deviceInfo.device" placeholder="请选择设备名称" clearable>
            <el-option
              v-for="item of deviceNameList"
              :key="item.id"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="网关编号：" prop="collector.id"  :rules="{ required: true,pattern: /^[A-Z0-9]{15}$/g, message: '请填入信息(15位大写字母和数字)'}">
          <el-input v-model="addDeviceModal.deviceInfo.collector.id" maxlength="15" clearable/>
        </el-form-item>
        <el-form-item label="设备IP：" prop="device.extend.ip" :rules="{ required: true, message: '请填入信息'}">
          <el-input v-model="addDeviceModal.deviceInfo.device.extend.ip" clearable style="width: 220px"/>
        </el-form-item>
<!--        <el-form-item label="网关外IP：" prop="collector.extend.outerIp" :rules="{ required: true, message: '请填入信息'}">-->
<!--          <el-input v-model="addDeviceModal.deviceInfo.collector.extend.outerIp" clearable/>-->
<!--        </el-form-item>-->
        <el-form-item label="网关内IP：" prop="collector.extend.innerIp" :rules="{ required: true, message: '请填入信息'}">
          <el-input v-model="addDeviceModal.deviceInfo.collector.extend.innerIp" clearable style="width: 220px"/>
          <kit-tip content="设备网关内部IP，需要和设备/PC在同一网段" />
        </el-form-item>
      </el-form>
    </kit-dialog-simple>
    <kit-dialog-simple
      id="station-pc"
      :modal="addPCModal"
      :confirm="PCUpdate"
      width="500px">
      <div slot="title">添加PC信息</div>
      <el-form v-if="addPCModal.PCInfo" ref="form2" :model="addPCModal.PCInfo" label-width="120px" label-position="left"
               style="width: 300px;margin: 0 auto">
        <el-form-item label="PC编号：" prop="PCNo" :rules="{ required: true, message: '请输入PC编号'}">
          <el-input v-model="addPCModal.PCInfo.PCNo"/>
        </el-form-item>
        <el-form-item label="PC的IP:" prop="PCIP" :rules="{ required: true, message: '请输入PC编号'}">
          <el-input v-model="addPCModal.PCInfo.PCIP"/>
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
      id="station-camera"
      :modal="addCameraModal"
      :confirm="infoUpdate"
      width="500px">
      <div slot="title">添加摄像头信息</div>
      <el-form v-if="addCameraModal.cameraInfo" ref="form3" :model="addCameraModal.cameraInfo" label-width="140px"
               label-position="left" style="width: 300px;margin: 0 auto">
        <el-form-item label="摄像头名称：" prop="name" :rules="{ required: true, message: '请输入摄像头名称'}">
          <el-input v-model="addCameraModal.cameraInfo.name"/>
        </el-form-item>
        <el-form-item label="摄像头通道号：" prop="channelId" :rules="{ required: true, message: '请输入摄像头IP'}">
          <el-input-number v-model="addCameraModal.cameraInfo.channelId" :min="0"/>
        </el-form-item>
      </el-form>
    </kit-dialog-simple>
    <kit-dialog-simple
      id="station-del"
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
import {ref, onMounted, watch} from '@vue/composition-api';
import {useLoading, useConfirm, useSearch} from 'web-toolkit/src/service';
import {ElTree} from 'element-ui/types/tree';
import {ElForm} from 'element-ui/types/form';
import {Message} from 'element-ui';
import {deepClone} from 'web-toolkit/src/utils';
import {
  StationList,
  StationInfo,
  StationAdd,
  StationUpdate,
  StationDel,
  StationAddComponent,
  StationDelComponent,
} from '@/dao/stationDao';
import {DeviceList} from '@/dao/deviceDao';

export default {
  setup() {
    const loading = ref(false);
    const tree = ref<ElTree<any, any> | null>(null);
    const form = ref<ElForm | null>(null);
    const form1 = ref<ElForm | null>(null);
    const form2 = ref<ElForm | null>(null);
    const form3 = ref<ElForm | null>(null);
    const list = ref<any>([]);
    const [filterText, stationList] = useSearch(list, {
      includeProps: ['name'],
    });
    const stationId = ref<any>(null);
    const stationModel = ref<any>(
      {
        visible: false,
        stationInfo: null,
      },
    );
    const expStation = ref<any>({extend: {}});
    const deviceNameList = ref<any>([]);
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
      if (form.value) {
        (form.value as ElForm).clearValidate();
      }
      if (data) {
        data = deepClone(data);
      } else {
        data = initForm();
      }
      modal.value.workTopInfo = data;
      modal.value.visible = true;
    };

    async function update() {
      const valid = await (form.value as ElForm).validate();
      if (valid) {
        await StationAdd({
          name: modal.value.workTopInfo.name,
        });
        modal.value.visible = false;
        Message.success('添加成功');
        await queryStation();
      }
    }

    const del = async () => {
      stationModel.value.stationInfo = expStation.value;
      stationModel.value.visible = true;
    };

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
      if (form1.value) {
        (form1.value as ElForm).clearValidate();
      }
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
      if (form2.value) {
        (form2.value as ElForm).clearValidate();
      }
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
    const showCameraForm = async (data?: any) => {
      if (form3.value) {
        (form3.value as ElForm).clearValidate();
      }
      if (data) {
        data = deepClone(data);
      } else {
        data = initPCForm();
      }
      addCameraModal.value.cameraInfo = data;
      addCameraModal.value.visible = true;
    };
    const deviceUpdate = async () => {
      const valid1 = await (form1.value as ElForm).validate();
      if (valid1) {
        await StationAddComponent({
          id: stationId.value,
          deviceId: addDeviceModal.value.deviceInfo.device.id ,
          adapterId: addDeviceModal.value.deviceInfo.collector.id,
          deviceIP: addDeviceModal.value.deviceInfo.device.extend.ip,
          // adapterOuterIP: addDeviceModal.value.deviceInfo.collector.extend.outerIp,
          adapterInnerIP: addDeviceModal.value.deviceInfo.collector.extend.innerIp,
        });
        addDeviceModal.value.visible = false;
        await query(stationId.value);
        Message.success('设备添加成功');
      }
    };
    const PCUpdate = async () => {
      const valid2 = await (form2.value as ElForm).validate();
      if (valid2) {
        await StationAddComponent({
          id: stationId.value,
          pcJson: addPCModal.value.PCInfo ? JSON.stringify(addPCModal.value.PCInfo) : null,
        });
        addPCModal.value.visible = false;
        await query(stationId.value);
        Message.success('PC添加成功');
      }
    };
    const infoUpdate = async () => {
      const valid3 = await (form3.value as ElForm).validate();
      if (valid3) {
        await StationAddComponent({
          id: stationId.value,
          cameraJson: addCameraModal.value.cameraInfo ? JSON.stringify(addCameraModal.value.cameraInfo) : null,
        });
        await query(stationId.value);
        addCameraModal.value.visible = false;
        Message.success('摄像头添加成功');
      }
    };
    const remove = async (row: any) => {
      await StationDelComponent({
        id: stationId.value,
        deviceId: row.id,
        PCIP: row.PCIP,
        cameraId: row.channelId,
      });
      await query(stationId.value);
      Message.success('删除成功');
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
        expStation.value = await StationInfo({
          id: stationId.value,
        });
        devicesList.value = expStation.value.deviceList;
      }
    };
    const queryStation = async () => {
      list.value = await StationList({
        simple: true,
      });
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
    return {
      loading, expStation, list, tree, props, filterText, stationList,
      query: useLoading(loading, query),
      modal, form, showForm,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      update: useLoading(loading, update),
      queryStation: useLoading(loading, queryStation),
      stationId,
      showDeviceForm, showPCForm, showCameraForm,
      addDeviceModal, addPCModal, addCameraModal,
      form1, form2, form3, deviceNameList,
      infoUpdate: useLoading(loading, infoUpdate),
      deviceUpdate: useLoading(loading, deviceUpdate),
      PCUpdate: useLoading(loading, PCUpdate),
      del: useLoading(loading, del),
      stationModel,
      confirmStation: useLoading(loading, confirmStation),
      devicesList,
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
      extend: {},
    },
    collector: {
      extend: {},
    },
  };
}

function initPCForm() {
  return {
    remark: '',
  };
}

</script>
<style scoped lang="scss">

</style>
