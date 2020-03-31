<template>
  <div v-loading="loading" class="equipment-model-configuration">
    <lkt-table
      :data="deviceTypeList"
      style="width:100%">
      <el-table-column prop="name" label="设备型号名称"/>
      <el-table-column label="设备图片" width="220">
        <div slot-scope="{row}">
          <img :src="img(row.img)" alt="">
        </div>
      </el-table-column>
      <el-table-column prop="extend.ctrName" label="控制器名称"/>
      <el-table-column prop="extend.systemType" label="数控系统型号"/>
      <el-table-column prop="extend.systemProducer" label="数控系统厂商"/>
      <el-table-column prop="extend.systemVersion" label="数控系统版本"/>
      <el-table-column label="操作" min-width="80px">
        <div slot-scope="{row}">
          <el-button type="success" @click="showForm(row)">修改</el-button>
          <el-upload
            style="margin-top: 10px"
            action=""
            :http-request="(option)=>upload(option, row)"
            :show-file-list="false"
          >
            <el-button type="primary" icon="el-icon-upload2">更改图片</el-button>
          </el-upload>
        </div>
      </el-table-column>
    </lkt-table>
    <kit-dialog-simple
      id="device-type"
      :modal="modal"
      :confirm="update"
      width="700px">
        <div slot="title">修改设备型号</div>
        <el-form v-if="modal.deviceTypeInfo" ref="form" :model="modal.deviceTypeInfo" label-width="140px" label-position="left" style="width: 650px;margin: 0 auto">
          <el-form-item label="设备型号名称：" prop="name" :rules="{ required: true, message: '请输入设备型号'}">
            <el-input v-model="modal.deviceTypeInfo.name"/>
          </el-form-item>
          <el-form-item label="设备控制器名称：" prop="extend.ctrName">
            <el-input v-model="modal.deviceTypeInfo.extend.ctrName"/>
          </el-form-item>
          <el-form-item label="数控系统型号：" prop="extend.systemType" >
            <el-input v-model="modal.deviceTypeInfo.extend.systemType"/>
          </el-form-item>
          <el-form-item label="数控系统厂商：" prop="extend.systemProducer">
            <el-input v-model="modal.deviceTypeInfo.extend.systemProducer"/>
          </el-form-item>
          <el-form-item label="数控系统版本：" prop="extend.systemVersion">
            <el-input v-model="modal.deviceTypeInfo.extend.systemVersion"/>
          </el-form-item>
        </el-form>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, onMounted } from '@vue/composition-api';
import {ElForm} from 'element-ui/types/form';
import { useLoading} from 'web-toolkit/src/service';
import { Message } from 'element-ui';
import {deepClone} from 'web-toolkit/src/utils';
import {ImageLink} from '@/dao/commonDao.ts';
import {DeviceTypeList, DeviceTypeUpdate, DeviceTypeUploadImg} from '@/dao/deviceDao';
export default {
  setup() {
    const loading = ref(false);
    const deviceTypeList = ref<any>();
    const modal = ref<any>({
      visible: false,
      deviceTypeInfo: null,
    });
    const form = ref<ElForm|null>(null);
    const showForm = async (data: any) => {
      if (form.value) { (form.value as ElForm).clearValidate(); }
      data = deepClone(data);
      modal.value.deviceTypeInfo = data;
      modal.value.visible = true;
    };
    async function update() {
      const valid = await (form.value as ElForm).validate();
      if (valid) {
        await DeviceTypeUpdate({
          id: modal.value.deviceTypeInfo.id,
          name: modal.value.deviceTypeInfo.name,
          extendJson: JSON.stringify(modal.value.deviceTypeInfo.extend),
        });
        modal.value.visible = false;
        Message.success('修改成功');
        await query();
      }
    }
    function img(path: any) {
      if (path) {
        return ImageLink(path);
      }
    }
    const query = async () => {
      deviceTypeList.value = await DeviceTypeList();
    };
    async function upload(option: any, row: any) {
      await DeviceTypeUploadImg({
        id: row.id,
        image: option.file,
      });
      Message.success('上传成功');
      await query();
    }
    onMounted(useLoading(loading, async () => {
      await query();
    }));
    return{
      loading, deviceTypeList, modal, form, showForm, query,
      update: useLoading(loading, update),
      img,
      upload: useLoading(loading, upload),
    };
  },
};
</script>
<style scoped lang="scss">
  img{
    height: 10rem;
  }
</style>
