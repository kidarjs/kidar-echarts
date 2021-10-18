declare module "*.vue" {
  import Vue from "vue";
  const component: VueConstructor & { install(vue: Vue), plugins: Object | Array }
  export default component;
}
