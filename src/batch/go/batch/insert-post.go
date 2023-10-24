package batch

import (
	"database/sql"
	"log"
	"time"
)

func InsertPostsForAwsCdc(db *sql.DB, logger *log.Logger) {

	// 트랜잭션 시작

	tx, err := db.Begin()
	if err != nil {
		logger.Fatal("트랜잭션 시작 실패:", err)
	}
	defer tx.Rollback()

	userId := 2
	description := "dms 정지 방지 golang"
	is_public := false
	// 포스트 추가 쿼리
	var result sql.Result
	result, err = tx.Exec("INSERT INTO posts (user_id, description, is_public) VALUES (?, ?, ?)", userId, description, is_public)
	if err != nil {
		logger.Fatal("포스트 추가 쿼리 실패:", err)
	}

	postID, err := result.LastInsertId()
	if err != nil {
		logger.Fatal("포스트 ID 가져오기 실패:", err)
	}

	// 옷 추가 쿼리
	_, err = tx.Exec("INSERT INTO clothes (post_id, category, name, price, deleted_at) VALUES (?, ?, ?, ?, ?)", postID, "Top", "dms 정지 방지 golang", 100, time.Now())
	if err != nil {
		logger.Fatal("옷 추가 쿼리 실패:", err)
	}

	// 트랜잭션 커밋
	err = tx.Commit()
	if err != nil {
		logger.Fatal("트랜잭션 커밋 실패:", err)
	}
	logger.Println("쿼리 실행 완료")
}
