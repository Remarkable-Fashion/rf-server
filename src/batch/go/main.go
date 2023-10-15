// main.go
package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"github.com/robfig/cron"
)

const (
    CronSpec = "* */2 * * *" // 2시간 마다
    // CronSpec = "*/5 * * * * *" // 5초마다
)

func selectQuery(db *sql.DB) {

    
    // 트랜잭션 시작
    
    tx, err := db.Begin()
    if err != nil {
        log.Fatal("트랜잭션 시작 실패:", err)
    }
    defer tx.Rollback()
    
    userId := 2
    // 포스트 추가 쿼리
    var result sql.Result
    result, err = tx.Exec("INSERT INTO posts (user_id, description, is_public) VALUES (?, ?, ?)", userId, "dms 정지 방지 golang", false)
    if err != nil {
        log.Fatal("포스트 추가 쿼리 실패:", err)
    }

    postID, err := result.LastInsertId()
	if err != nil {
		log.Fatal("포스트 ID 가져오기 실패:", err)
	}
    // tx.ExecContext()
    // postID, err := result.

    // 옷 추가 쿼리
    _, err = tx.Exec("INSERT INTO clothes (post_id, category, name, price, deleted_at) VALUES (?, ?, ?, ?, ?)", postID, "Top", "dms 정지 방지 golang", 100, time.Now())
    if err != nil {
        log.Fatal("옷 추가 쿼리 실패:", err)
    }

    // 트랜잭션 커밋
    err = tx.Commit()
    if err != nil {
        log.Fatal("트랜잭션 커밋 실패:", err)
    }

    fmt.Println("쿼리 실행 완료")

}

func main() {
    pid := os.Getpid()
    fmt.Printf("현재 프로세스 ID(PID): %d\n", pid)

    err := godotenv.Load()
    if err != nil {
        fmt.Println("Error loading .env file")
        os.Exit(1)
    }

    dataSourceName := os.Getenv("DATABASE")

    // MySQL 데이터베이스 연결
    db, err := sql.Open("mysql", dataSourceName)
    if err != nil {
        log.Fatalf("Failed to connect to database: %v", err)
    }
    defer db.Close()

    // MySQL 데이터베이스 연결 테스트
    err = db.Ping()
    if err != nil {
        log.Fatalf("Database ping failed: %v", err)
    }

	c := cron.New()
    c.AddFunc("@every 2h", func(){
        selectQuery(db)
    })

    c.Start()
    sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)

	<-sigCh
	c.Stop()
}

func PrintData() {
    t := time.Now().Format("2006-01-02T15:04:05-07:00")
    // t := time.Now().Format("2023-07-31 15:12:35.324")
    fmt.Println(t)
    // Data++
}



	// 데이터 조회 예제
	// id := 1 // 대체하려는 값
	// query := "SELECT id, name, email FROM users WHERE id = ?"
    // // rows, err := db.Query("SELECT id, name, email FROM users WHERE id = 1")
    // rows, err := db.Query(query, id)
    // if err != nil {
    //     log.Fatalf("Failed to query data: %v", err)
    // }
    // defer rows.Close()

	// type User struct {
	// 	ID   int
	// 	Name string
	// 	Email string
	// }

    // for rows.Next() {
    //     // var id int
    //     // var name, email string
	// 	var user User
    //     if err := rows.Scan(&user.ID, &user.Name, &user.Email); err != nil {
    //         log.Fatalf("Scan failed: %v", err)
    //     }
    //     fmt.Printf("ID: %d, Name: %s, Email: %s\n", user.ID, user.Name, user.Email)
	// }