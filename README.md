# kany (칸칸)

시간 단위로 빌리는 공유 공간(합주실·스터디룸·촬영 미팅룸·세미나실) 예약 사이트.

```
frontend/   React 19 + Vite 8 (화면)
backend/    Spring Boot 4 + Java 21 + JPA + Flyway (API)
nginx/      정적 파일 서빙 + /api 를 backend 로 전달
docker-compose.yml   mysql + backend + nginx
```

## 주소와 포트

| 무엇 | 주소 | 언제 열리나 |
|---|---|---|
| 사이트 (Docker 전체) | http://localhost:8081 | `docker compose up` |
| 관리자 화면 | http://localhost:8081/#admin | 위와 같음 |
| 화면 개발 서버 | http://localhost:5173 | `npm run dev` |
| 백엔드 API | http://localhost:8080/api | `./gradlew bootRun` (개발 모드만) |
| MySQL | 127.0.0.1:3308 | `docker compose up` |

Docker로 띄우면 백엔드는 밖으로 포트를 열지 않고 nginx(8081)를 거쳐서만 접근된다.
8080은 개발 모드의 백엔드(`bootRun`)가 쓰도록 비워 둔다. 야구 티켓 프로젝트(80/3307)와 같은 PC에서 함께 켜도 겹치지 않는 번호다.

## 처음 한 번

```bash
cp .env.example .env
```

`.env`에 `DB_PASSWORD`, `DB_ROOT_PASSWORD`, `JWT_SECRET`(32자 이상, `openssl rand -hex 32`), `ADMIN_PASSWORD`를 채운다.
`.env`는 git에 올라가지 않는다. 비밀번호가 든 파일이라 저장소(public)에 올리면 안 된다.

## 실행 1) Docker로 전체

```bash
docker compose up -d --build
```

코드를 고친 뒤에는 `--build`를 다시 해야 반영된다. nginx 이미지에 빌드된 화면이 들어 있어서다.

## 실행 2) 개발 모드 (코드 수정이 바로 보임)

터미널 3개가 필요하다. DB만 Docker로 띄우고 백엔드·화면은 PC에서 직접 실행한다.

```bash
docker compose up -d mysql
```

```bash
cd backend
export DB_PASSWORD=... JWT_SECRET=... ADMIN_PASSWORD=...
./gradlew bootRun
```

```bash
cd frontend
npm install
npm run dev
```

화면 개발 서버가 `/api` 요청을 `localhost:8080`(백엔드)으로 넘겨준다.
백엔드를 Docker로 띄운 상태라면 `API_PROXY_TARGET=http://localhost:8081 npm run dev`로 nginx를 가리키게 한다.

## 계정

- 관리자: 이메일 `ADMIN_EMAIL`(기본 `admin@kany.local`), 비밀번호 `.env`의 `ADMIN_PASSWORD`. 서버가 처음 뜰 때 만들어진다.
- 일반 회원: 사이트에서 회원가입.

## 검사

```bash
cd frontend && npm run lint && npm run build
```
