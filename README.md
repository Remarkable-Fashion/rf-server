# RCloset 서버

## 사용 스택

ExpressJS, Typescript, Prisma

Mysql 8, Redis, ElasticSearch

Docker, Docker-Compose

Cloudflare DNS

EC2 Cloudfront S3 Opensearch RDS DMS ElastiCache

## 실행 방법

### 도커

```bash
$ docker-compose up --build -d
```

1. 도커 실행 후 mysql 테이블 생성을 위해 `npm run db:push` 입력.


~~2. seed 실행 `npm run seed`~~

### 접속 방법

1. localhost:3000 // http & https 사용

### 배치

`npm run batch`

1. post like count
2. clothes like count
3. search rank

## 실행 환경 분리

prod : docker compose up --build

dev : docker compose -f docker-compose-dev.yaml --env-file ./.env.dev up --build

* dotenv-cli를 사용한 환경변수 로드

```bash
$ dotenv -e .env ts-node <file> // prod
$ dotenv -e .env.dev ts-node <file> // dev
```

### 예시

```bash

dotenv -e .env.dev npm run db:migrate // 마이그레이션
// migrate 완료가 안되는 버그 발생.
dotenv -e .env.dev ts-node ./src/db/seeds/seed.ts // seed

```

# Dev test JWT 
* id: 1
 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg4MDA4MzQxLCJleHAiOjE3MTk1NDQzNDF9.gr5Ijgdyy_ptL29Y3CE60fZZGNJQbli_eOdrzEOHL_o"

* id: 2
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjg4MDMwMDk3LCJleHAiOjE3MTk1NjYwOTd9.O_M8bk_TmeUt-YFNahd2V3Zffz94sCPN4fk4L92J2oA"

* id: 3
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjg4MDMwMDk3LCJleHAiOjE3MTk1NjYwOTd9.4Xe4d3ZTNZ53AiERV_LpjgiNQ5E7KDUN06qL8znYDS8"

# ERD

![Mysql ERD](./prisma-erd.svg)

# Architecure Diagram

![AWS Architecture Diagram](https://github.com/Remarkable-Fashion/rf-server/assets/50390565/fe444a76-7828-4b30-9e84-6068644b5271)

