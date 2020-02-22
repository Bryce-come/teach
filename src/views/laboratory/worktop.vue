<template>
  <div v-loading="loading" class="worktop">
    <el-row :gutter="40" type="flex" justify="space-between">
      <el-col :span="6">
        <el-input placeholder="输入关键字搜索" v-model="filterText" style="margin-bottom:5px"></el-input>
        <el-row style="display:flex;justify-content:space-between;margin-bottom:5px">
          <el-button type="primary" size="small">导入</el-button>
          <el-button type="success" size="small" style="margin-left:5px" @click="showForm()">添加</el-button>
          <el-button type="info" size="small" style="margin-left:5px">导出</el-button>
        </el-row>
        <el-tree 
        class="filter-tree" 
        :data="list" 
        :props="props" 
        default-expand-all 
        :filter-node-method="filterNode" 
        ref="tree">
        </el-tree>
      </el-col>
      <el-col :span="18" style="box-shadow:0 2px 12px 0 rgba(0, 0, 0, .12);margin-right：100px">
        <el-form>
          <el-form-item label="操作台01 > 关联设备信息">
            <div style="display:flex;justify-content:flex-end;margin-top:5px">
              <el-button type="primary" size="mini">添加</el-button>
            </div>
            <el-table
            :data="expStationList"
            style="width:100%">
            <el-table-column prop="" label="设备编号"/>
            <el-table-column prop="" label="设备名称"/>
            <el-table-column prop="" label="设备型号"/>
            <el-table-column prop="" label="设备IP"/>
            <el-table-column prop="" label="LKT-MAN编号" width="120px"/>
            <el-table-column prop="" label="网关状态"/>
            <el-table-column label="操作" width="160px">
              <div class="flex center little-space wrap" slot-scope="{row}">
                <el-button type="warning" size="mini">修改</el-button>
                <el-button type="danger" size="mini" @click="remove(row)">删除</el-button>
              </div>              
            </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="操作台01 > PC信息">
            <el-button type="primary" size="mini" style="margin-left:640px">添加</el-button>
            <el-table
            :data="expStationList"
            style="width:100%">
            <el-table-column prop="" label="PC编号"/>
            <el-table-column prop="" label="所属设备编号"/>
            <el-table-column prop="" label="网口1名称"/>
            <el-table-column prop="" label="网口1地址"/>
            <el-table-column prop="" label="网口2名称"/>
            <el-table-column prop="" label="网口2地址"/>
            <el-table-column label="操作" width="160px">
              <div class="flex center little-space wrap" slot-scope="{ row }">
                <el-button type="warning" size="mini">修改</el-button>
                <el-button type="danger" size="mini" @click="remove(row)">删除</el-button>
              </div>   
            </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="操作台01 > 摄像头信息">
            <el-button type="primary" size="mini" style="margin-left:620px">添加</el-button>
            <el-table
            :data="expStationList"
            style="width:100%">
            <el-table-column prop="" label="摄像头名称"/>
            <el-table-column prop="" label="摄像头IP"/>
            <el-table-column prop="" label="所属设备编号"/>
            <el-table-column prop="" label="摄像位置"/>
            <el-table-column label="操作" width="160px">
              <div class="flex center little-space wrap" slot-scope="{ row }">
                <el-button type="warning" size="mini">修改</el-button>
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
      width="700px">
        <div slot="title">添加操作台</div>
        <el-form v-if="modal.workTopInfo" ref="form" :model="modal.workTopInfo" label-width="120px" label-position="left" style="width: 580px;margin: 0 auto">
          <el-form-item label="试验台名称" prop="name" :rules="{ required: true, message: '请输入操作台名称'}">
              <el-input v-model="modal.workTopInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="关联设备数量" prop="devices" :rules="{ required: true, message: '请输入关联设备数量'}">
              <el-input v-model="modal.workTopInfo.devices"></el-input>
          </el-form-item>
          <el-form-item label="关联PC数量" prop="extend.PCs.remark" :rules="{ required: true, message: '请输入关联PC数量'}">
              <el-input v-model="modal.workTopInfo.extend.PCs.remark"></el-input>
          </el-form-item>
          <!-- <el-form-item label="密码" prop="pwd" :rules="{ required: true, message: '请输入密码'}">
              <el-input v-model="addModal.teacherInfo.pwd"></el-input>
          </el-form-item>
          <el-form-item label="邮箱地址" prop="address" :rules="{ required: true, message: '请输入邮箱地址'}">
              <el-input v-model="addModal.teacherInfo.address"></el-input>
          </el-form-item> -->
        </el-form>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, onMounted, watch} from '@vue/composition-api';
import { useLoading, useConfirm } from 'web-toolkit/src/service';
import {ElTree} from 'element-ui/types/tree';
import {ElForm} from 'element-ui/types/form';
import { Message } from 'element-ui';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
export default {
  setup() {
    const loading = ref(false);
    const tree = ref<ElTree<any, any>|null>(null);
    const form = ref<ElForm|null>(null);
    const filterText = ref<string|null>(null);
    const list = ref<any>();
    const expStationList = ref<any>();
    const props = ref({
      children: 'children',
      label: 'name',
    });
    const modal = ref<any>({
      visible: false,
      workTopInfo: null,
    });
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
      const valid = true;
      if (valid) {
        const { id, name, devices, extend: {PCs: [{remark}]} } = modal.value.workTopInfo;
        modal.value.visible = false;
        Message.success(`${isUndefined(id) ? '添加' : '修改'}成功`);
        await query();
      }
    }
    const remove = async (row: any) => {
      Message.success('删除成功');
    };
    watch(filterText, () => {
      if (tree.value) { (tree.value as ElTree<any, any>).filter(filterText.value); }
    });
    const query = async () => {
      expStationList.value = [
        {id: '1', name: '操作台1', devices: '', extend: {PCs: [{PCIp: '', PCNo: '', remark: '', belongDevice: ''}]},
        remark: '', cameras: [{ip: '', name: '', remark: ''}], createDt: ''},
      ];
    };
    const filterNode = async (value: any, data: any) => {
      if (!value) {return true; }
      return data.label.indexOf(value) !== -1;
    };
    onMounted(useLoading(loading, async () => {
      await query();
      list.value = [{
        id: 0, name: '操作台列表',
        children: [
          {id: 1, name: '操作台01'},
          {id: 2, name: '操作台02'},
          {id: 3, name: '操作台03'},
          {id: 4, name: '操作台04'},
          {id: 5, name: '操作台05'},
        ],
      }];
    }));
    return{
      loading, expStationList, list, tree, props, filterText, filterNode,
      query, modal, form, showForm,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      update: useLoading(loading, update),
    };
  },
};
function initForm() {
  return {
    name: '', devices: '',
    extend: {PCs: [{remark: ''}]},
  };
}
</script>
<style scoped lang="scss">

</style>
