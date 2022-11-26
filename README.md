## 실행 방법

### 도커

```bash
$ docker-compose up --build -d
```

1. 도커 실행 후 mysql 테이블 생성을 위해 `npm run db:push` 입력.

> ~~`.env`의 `DATABASE_URL`를 localhost로 사용해야함.~~

2. seed 실행 `npm run seed`

### 접속 방법

1. localhost:3000 // http & https 사용
2. <배포서버ip>.nip.io // https 사용
