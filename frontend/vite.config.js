import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // npm run dev(5173)에서도 /api 요청이 백엔드로 가게 한다. 브라우저 입장에서는 같은 주소라 CORS 설정이 필요 없다.
    // 기본 대상은 PC에서 직접 띄운 백엔드(./gradlew bootRun, 8080)다.
    // 백엔드를 Docker로 띄운 상태라면 nginx(8081)를 가리키게 API_PROXY_TARGET=http://localhost:8081 로 실행하면 된다.
    proxy: {
      '/api': process.env.API_PROXY_TARGET || 'http://localhost:8080',
    },
  },
})
