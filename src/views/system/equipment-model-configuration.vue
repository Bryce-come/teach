<template>
  <div v-loading="loading" class="equipment-model-configuration">
    <el-input v-model="filterText" placeholder="输入关键字搜索" style="margin-left:700px;margin-bottom:10px;width:400px"></el-input>
    <lkt-table
      :data="deviceTypeList"
      style="width:100%">
      <el-table-column prop="name" label="设备型号"/>
      <el-table-column label="设备图片">
        <img src="img">
      </el-table-column>
      <el-table-column prop="extend.ctrName" label="设备控制器名称"/>
      <el-table-column label="操作">
        <el-button type="warning" size="mini" @click="showForm()">修改</el-button>
      </el-table-column>
    </lkt-table>
    <kit-dialog-simple
      :modal="modal"
      :confirm="update"
      width="700px">
        <div slot="title">修改设备型号配置</div>
        <el-form v-if="modal.deviceTypeInfo" ref="form" :model="modal.deviceTypeInfo" label-width="140px" label-position="left" style="width: 650px;margin: 0 auto">
          <el-form-item label="设备型号" prop="name" :rules="{ required: true, message: '请输入设备型号'}">
              <el-input v-model="modal.deviceTypeInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="设备控制器名称" prop="extend.ctrName" :rules="{ required: true, message: '请输入设备控制器名称'}">
              <el-input v-model="modal.deviceTypeInfo.extend.ctrName"></el-input>
          </el-form-item>
          <el-form-item label="设备图片" prop="img" :rules="{ required: true, message: '请上传设备图片'}">
              <el-input v-model="modal.deviceTypeInfo.img"></el-input>
          </el-form-item>
        </el-form>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
import {ElForm} from 'element-ui/types/form';
import { useLoading, useConfirm } from 'web-toolkit/src/service';
import { Message } from 'element-ui';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
export default {
  setup() {
    const loading = ref(false);
    const filterText = ref<string|null>(null);
    const deviceTypeList = ref<any>();
    const modal = ref<any>({
      visible: false,
      deviceTypeInfo: null,
    });
    const form = ref<ElForm|null>(null);
    const showForm = async (data?: any) => {
      if (form.value) { (form.value as ElForm).clearValidate(); }
      if (data) {
        data = deepClone(data);

      } else {
        data = initForm();
      }
      modal.value.deviceTypeInfo = data;
      modal.value.visible = true;
    };
    async function update() {
      const valid = true;
      if (valid) {
        const { id, name, img, extend: {ctrName}} = modal.value.deviceTypeInfo;
        modal.value.visible = false;
        Message.success('修改成功');
        await query();
      }
    }
    const query = async () => {
      deviceTypeList.value = [
        {id: 0, name: 'xx', img: '../../assets/u1630.png', extend: {ctrName: 'xx'}},
        {id: 1, name: 'xx', img: '../../assets/u1630.png', extend: {ctrName: 'xx'}},
        {id: 2, name: 'xx', img: '../../assets/u1630.png', extend: {ctrName: 'xx'}},
        {id: 3, name: 'xx', img: '../../assets/u1630.png', extend: {ctrName: 'xx'}},
        {id: 4, name: 'xx', img: '../../assets/u1630.png', extend: {ctrName: 'xx'}},
      ];
    };
    onMounted(useLoading(loading, async () => {
      await query();
    }));
    return{
      loading, filterText, deviceTypeList, modal, form, showForm, query,
      update: useLoading(loading, update),
    };
  },
};
function initForm() {
  return {
    name: '', img: '',
    extend: {ctrName: ''},
  };
}
</script>
<style scoped lang="scss">

</style>