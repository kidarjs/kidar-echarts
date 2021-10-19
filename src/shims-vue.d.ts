declare module "*.vue" {
  import Vue, { VueConstructor } from "vue";
  const component: VueConstructor<Vue> & { install(vue: VueConstructor) }
  export default component;
}
