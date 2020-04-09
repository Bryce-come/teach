<template>
  <div class="layout">
    <lkt-navbar class="header"/>
    <lkt-menu class="vertical-menu" bgColor="#02213F"/>
    <div class="main">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
        <el-breadcrumb-item v-for="(item, index) of path" :key="item.cname">
          <span v-if="!item.isLink" :class="index" class="bread-title">{{ item.cname }}</span>
          <span v-else-if="index === path.length - 1" class="bread-title bread-title--last">{{ item.cname }}</span>
          <router-link v-else class="bread-title bread-title--link" :to="item.route.path">{{ item.cname }}</router-link>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <router-view class="page--inner"/>
    </div>
<!--    <div class="page flex" :style="{ height: 'calc(100% - 60px)'}">-->
<!--      <lkt-menu class="vertical-menu" bgColor="#02213F"/>-->
<!--      <div class="main" :style="{ width: 'calc(100% - 200px)'}">-->
<!--        <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">-->
<!--          <el-breadcrumb-item v-for="(item, index) of path" :key="item.cname">-->
<!--            <span v-if="!item.isLink" :class="index" class="bread-title">{{ item.cname }}</span>-->
<!--            <span v-else-if="index === path.length - 1" class="bread-title bread-title&#45;&#45;last">{{ item.cname }}</span>-->
<!--            <router-link v-else class="bread-title bread-title&#45;&#45;link" :to="item.route.path">{{ item.cname }}</router-link>-->
<!--          </el-breadcrumb-item>-->
<!--        </el-breadcrumb>-->
<!--        <lkt-scrollbar class="page&#45;&#45;outer">-->
<!--          <router-view class="page&#45;&#45;inner"/>-->
<!--        </lkt-scrollbar>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>
<script lang="ts">
  import LktMenu from './Menu.vue';
import LktNavbar from './Navbar.vue';
import { ref, onMounted } from '@vue/composition-api';
import {router} from '@/main';
import {routes} from '@/router/routes';
import {storeUserInfo} from 'web-toolkit/src/case-main'
import {PRIVILEGE} from "@/types/privilege";
import {SettingGet} from "@/dao/settingDao";
import { MessageBox } from 'element-ui';

export default {
  components: { LktMenu, LktNavbar },
  setup() {
    const getRoute = (cname: string, searchedRoutes: any = routes): any => {
      for (const route of searchedRoutes) {
        if (route.meta && route.meta.CName === cname) {
          return route;
        }
        if (route.children) {
          const target = getRoute(cname, route.children);
          if (target) {
            return target;
          }
        }
      }
    };
    const resolveRouteMeta = (cname: string | void): PathItem[] => {
      if (!cname) {
        return [];
      }
      const route = getRoute(cname);
      return [...resolveRouteMeta(route ? route.meta.parentCName : undefined), {
        cname,
        isLink: !!(route && !route.children),
        route,
      }];
    };
    const path = ref<PathItem[]>(resolveRouteMeta(router.currentRoute.meta.CName));
    router.afterEach((to, from) => {
      path.value = resolveRouteMeta(to.meta.CName);
    });
    onMounted(async ()=>{
      if(storeUserInfo.user && storeUserInfo.user.role.privileges.indexOf(PRIVILEGE.systemSetting)>-1){
        const setting = await SettingGet();
        if(setting.terms && setting.terms[1]<new Date().getTime()){
          MessageBox.confirm('当前学年学期的配置已过期，请前往配置', '注意', {
            confirmButtonText: '前往配置',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            router.push({name: "systemOptionSetting", query:{tab:"1"}})
          }).catch(() => {});
        }
      }
    });
    return { path };
  },
};
interface PathItem {
  cname: string;
  isLink: boolean;
  route?: any;
}
</script>
<style lang="scss" scoped>
  .header{
    position: fixed;
    top: 0;
    width: 100vw;
    z-index: 2000;
  }
  .vertical-menu {
    /*margin-top: 60px;*/
    width: 200px;
    height: calc(100% - 60px);
    position: fixed;
    left: 0;
    top: 60px;
    bottom: 0;
    z-index: 1500;
    overflow-y: scroll;
    // 滚动条消失
    &::-webkit-scrollbar { width: 0 !important }
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
  }
  .main {
    margin: 60px 0 0 200px;
    padding: 10px;
    width: calc(100% - 200px);
    .bread{
      padding-top: 5px;
      padding-bottom: 10px;
      height: 30px;
      .bread-title {
        color: $normal-text;
        cursor: default;
      }
      .bread-title--link {
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
      .bread-title--last {
        color: $active;
      }
    }
    /*> .page--outer {*/
    /*  height: calc(100% - 30px);*/
    /*}*/
  }
  .layout {
    height: calc(100% - 60px);
    background-color: $background-main;
  }
  .page--inner > *:not(*[class^=el-]):not(*[class^=lkt-]) {
    min-width: 1040px;
  }
  html{
    height: 100%;
  }
</style>
