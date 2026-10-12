# 빌드 컨텍스트: 저장소 루트 (docker-compose.yml 참고). nginx/default.conf 와 frontend/ 를 둘 다 복사해야 해서
# 이 파일이 있는 nginx/ 가 아니라 루트를 컨텍스트로 쓴다.
# 1단계(frontend-build): Node로 React를 빌드한다. 2단계: 빌드 결과(정적 파일)만 nginx에 담는다.
FROM node:24-alpine AS frontend-build
WORKDIR /app

# package.json을 먼저 복사해야 소스만 바뀔 때 npm ci 레이어가 캐시된다.
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# .dockerignore가 node_modules 등을 걸러준다.
COPY frontend/ .
RUN npm run build

FROM nginx:1.29-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /app/dist /usr/share/nginx/html

EXPOSE 80
