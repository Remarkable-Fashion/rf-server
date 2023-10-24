// main.go
package main

import (
	"context"
	"database/sql"
	"log"
	"net/url"
	"os"
	"os/signal"
	"syscall"

	myp "go-batch/batch"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"

	// "github.com/opensearch-project/opensearch-go/v2"

	opensearch "github.com/opensearch-project/opensearch-go/v2"
	"github.com/redis/go-redis/v9"
	"github.com/robfig/cron"
)

func main() {
	logger := log.New(os.Stdout, "CRON: ", log.LstdFlags)
	pid := os.Getpid()
	logger.Printf("현재 프로세스 ID(PID): %d\n", pid)

	err := godotenv.Load("/home/ubuntu/rf-server/src/batch/go/.env")
	if err != nil {
		logger.Println("Error loading .env file")
		os.Exit(1)
	}

	dataSourceName := os.Getenv("DATABASE")
	redisURL := os.Getenv("REDIS_URL")
	elkURL := os.Getenv("ELK_DB")

	// MySQL 데이터베이스 연결
	db, err := sql.Open("mysql", dataSourceName)
	if err != nil {
		logger.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// MySQL 데이터베이스 연결 테스트
	err = db.Ping()
	if err != nil {
		logger.Fatalf("Database ping failed: %v", err)
	}
	logger.Println("mysql : connected")

	redisurll, err := url.Parse(redisURL)
	if err != nil {
		logger.Fatalf("failed to parse: %v", err)
	}

	// Redis 연결
	redis := redis.NewClient(&redis.Options{
		Addr:     redisurll.Host,
		Password: "",
		DB:       0,
	})

	// Redis 연결 테스트
	ctx := context.Background()
	pong, err := redis.Ping(ctx).Result()
	if err != nil {
		logger.Fatalf("Redis ping failed: %v", err)
	}
	logger.Println("redis :", pong)

	// ES 연결
	esClient, err := opensearch.NewClient(opensearch.Config{
		Addresses: []string{elkURL},
	})
	if err != nil {
		logger.Fatalf("Opensearch failed: %v", err)
	}
	logger.Println("Opensearch connected")

	// 크론 실행
	c := cron.New()
	go createCron(c, "@every 2h", func(logger *log.Logger) {
		myp.InsertPostsForAwsCdc(db, logger)
	}, logger)

	go createCron(c, "@every 5m", func(logger *log.Logger) {
		// dateRange := date.GetDateRange(time.Now())
		myp.GenerateCurrentRanking(esClient, redis, logger, ctx)
	}, logger)

	c.Start()
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)

	<-sigCh
	c.Stop()
}

func createCron(c *cron.Cron, cronSpec string, cb func(*log.Logger), logger *log.Logger) {
	err := c.AddFunc(cronSpec, func() {
		cb(logger)
	})
	if err != nil {
		logger.Println("Failed to create cron job:", err)
	}
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
