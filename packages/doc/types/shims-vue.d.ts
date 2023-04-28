/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />

declare module '*.vue' {
  import { defineComponent } from 'vue'

  const Component: ReturnType<typeof defineComponent>
  export default Component
}

// declare module "*.vue" {
//   import type { DefineComponent } from "vue";
//   // // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
//   const component: DefineComponent<{}, {}, any>;
//   export default component;
// }

// declare module '*.js'
// declare module '*.ts'
// declare module '*.ts' {
//   export { Test } from '@/page/testing/type.ts'
// }
