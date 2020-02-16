<template>
  <div v-loading="loading" class="worktop">
    <el-row :gutter="40" type="flex" justify="space-between">
      <el-col :span="6">
        <el-input placeholder="输入关键字搜索" v-model="filterText" style="margin-bottom:5px"></el-input>
        <el-row style="margin-left:60px;margin-bottom:5px">
          <el-button type="primary" size="small">导入</el-button>
          <el-button type="success" size="small" style="margin-left:5px">添加</el-button>
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
            <el-button type="primary" size="mini" style="margin-left:600px">添加</el-button>
            <lkt-table
            :data="expStationList"
            style="width:100%">
            <el-table-column prop="" label="设备编号"/>
            <el-table-column prop="" label="设备名称"/>
            <el-table-column prop="" label="设备型号"/>
            <el-table-column prop="" label="设备IP"/>
            <el-table-column prop="" label="LKT-MAN编号" width="120px"/>
            <el-table-column prop="" label="网关状态"/>
            <el-table-column label="操作" width="160px">
              <el-button type="warning" size="mini">修改</el-button>
              <el-button type="danger" size="mini" style="margin-left:5px">删除</el-button>
            </el-table-column>
            </lkt-table>
          </el-form-item>
          <el-form-item label="操作台01 > PC信息">
            <el-button type="primary" size="mini" style="margin-left:640px">添加</el-button>
            <lkt-table
            :data="expStationList"
            style="width:100%">
            <el-table-column prop="" label="PC编号"/>
            <el-table-column prop="" label="所属设备编号"/>
            <el-table-column prop="" label="网口1名称"/>
            <el-table-column prop="" label="网口1地址"/>
            <el-table-column prop="" label="网口2名称"/>
            <el-table-column prop="" label="网口2地址"/>
            <el-table-column label="操作" width="160px">
              <el-button type="warning" size="mini">修改</el-button>
              <el-button type="danger" size="mini" style="margin-left:5px">删除</el-button>
            </el-table-column>
            </lkt-table>
          </el-form-item>
          <el-form-item label="操作台01 > 摄像头信息">
            <el-button type="primary" size="mini" style="margin-left:620px">添加</el-button>
            <lkt-table
            :data="expStationList"
            style="width:100%">
            <el-table-column prop="" label="摄像头名称"/>
            <el-table-column prop="" label="摄像头IP"/>
            <el-table-column prop="" label="所属设备编号"/>
            <el-table-column prop="" label="摄像位置"/>
            <el-table-column label="操作" width="160px">
              <el-button type="warning" size="mini">修改</el-button>
              <el-button type="danger" size="mini" style="margin-left:5px">删除</el-button>
            </el-table-column>
            </lkt-table>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { ref, onMounted, watch} from '@vue/composition-api';
import { useLoading } from 'web-toolkit/src/service';
import {ElTree} from 'element-ui/types/tree';
import {ElForm} from 'element-ui/types/form';
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
    const modal = ref({
      visible: false,
    });
    watch(filterText, () => {
      if (tree.value) { (tree.value as ElTree<any, any>).filter(filterText.value); }
    });
    const query = async () => {
      expStationList.value = [
        {id: '1', name: '操作台1', devices: '', extend: {PCs: [{PCIp: '', PCNo: '', remark: '', belongDevice: ''}]},
        remark: '', cameras: [{ip: '', name: '', remark: ''}], createDt: ''},
        {id: '2', name: '操作台2', devices: '', extend: {PCs: [{PCIp: '', PCNo: '', remark: '', belongDevice: ''}]},
        remark: '', cameras: [{ip: '', name: '', remark: ''}], createDt: ''},
        {id: '3', name: '操作台3', devices: '', extend: {PCs: [{PCIp: '', PCNo: '', remark: '', belongDevice: ''}]},
        remark: '', cameras: [{ip: '', name: '', remark: ''}], createDt: ''},
        {id: '4', name: '操作台4', devices: '', extend: {PCs: [{PCIp: '', PCNo: '', remark: '', belongDevice: ''}]},
        remark: '', cameras: [{ip: '', name: '', remark: ''}], createDt: ''},
        {id: '5', name: '操作台5', devices: '', extend: {PCs: [{PCIp: '', PCNo: '', remark: '', belongDevice: ''}]},
        remark: '', cameras: [{ip: '', name: '', remark: ''}], createDt: ''},
      ];
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
      loading, expStationList, list, tree, props, filterText,
      query,
    };
  },
};
</script>
<style scoped lang="scss">

</style>
