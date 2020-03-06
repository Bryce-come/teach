<template>
  <el-menu
    activeTextColor="#00d0FF"
    textColor="white"
    :unique-opened="true"
    :backgroundColor="bgColor"
    mode="vertical"
    :default-active="active"
    @select="routeTo">
    <template v-for="(item, index) of storePageMenu">
      <el-menu-item
        v-if="item && item.name && contains(item)"
        :key="index"
        :index="item.name">
        <i :class="'iconfont ' + item.icon"/>
        <span class="title">{{ item.title }}</span>
      </el-menu-item>
      <el-submenu
        v-if="item && !item.name && item.children && item.children.length > 0 && contains(item)"
        popper-class="my-el-menu-popper"
        :key="index"
        :index="item.title">
        <template slot="title">
          <i :class="'iconfont '+item.icon"/>
          <span class="title">{{ item.title }}</span>
        </template>
        <el-menu-item
          class="item"
          v-for="(child, i) of menuItemFilter(item.children)"
          :key="i"
          :index="child.name"
          v-text="child.cTitle"/>
      </el-submenu>
    </template>
  </el-menu>
</template>

<script lang="ts">
import { ref, onMounted, computed, watch } from '@vue/composition-api';
import {checkPrivilegeAuthDepartments, storePageMenu, storeUserInfo, storeCurrentRoute} from 'web-toolkit/src/case-main';
import {router} from '@/main';
export default {
  props: {
    bgColor: {
      type: String,
      default: 'center',
    },
  },
  setup() {
    const active = computed(() => {
      if (storeCurrentRoute.meta) {
        return (storeCurrentRoute.meta as any).parentName || storeCurrentRoute.name;
      } else if (storeCurrentRoute.name) {
        return storeCurrentRoute.name;
      }
      return undefined;
    });
    function menuItemFilter(itemChildren: any[]) {
      return itemChildren.filter((child) => contains(child));
    }
    function routeTo(name: string) {
      router.push({ name });
    }
    function contains(item: any) {
      if (!storeUserInfo.user) { return true; }
      return checkPrivilegeAuthDepartments(item);
    }
    return{
      storePageMenu, storeCurrentRoute,
      menuItemFilter,
      routeTo,
      contains,
      active,
    };
  },
};
</script>

<style scoped lang="scss">
  .el-menu {
    border-right: 0;
    height: 100%;
    i{
      margin-right: 10px;
    }
  }
</style>
