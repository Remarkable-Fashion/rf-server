# GOLANG을 사용한 크론잡

## 사용 이유
기존 pm2를 사용한 node 스크립트 크론잡 하나 당 평균 20mb을 사용하는 반면 
go는 5mb로 75% 감소를 했다.

## 사용 방법

go run ./main.go

go build

### 백그라운드 실행 
nohub go run main.go

실행하면 프로세스 id 알려주고
nohub.output에 로그 작성된다.

## pm2 실행

pm2에서 build한 것을 실행 할수 있다.

pm2 start batch --name batch

## pid 메모리 확인

ps -p 29202 -o %mem