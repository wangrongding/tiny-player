import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // 服务器特定选项，如主机、端口、https…
  server: {
    host: '0.0.0.0',
    port: 12345,
    open: false,
    hmr: true,
  },
  plugins: [vue()],
})
