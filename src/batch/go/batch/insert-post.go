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

	postId := 149
	clothesId := 171

	// 포스트 추가 쿼리
	now := time.Now()
	_, err = tx.Exec("UPDATE posts SET deleted_at = ? WHERE id = ?", now, postId)
	if err != nil {
		logger.Fatal("포스트 추가 쿼리 실패:", err)
	}

	// 옷 추가 쿼리
	_, err = tx.Exec("UPDATE clothes SET deleted_at = ? WHERE id = ?", now, clothesId)
	if err != nil {
		logger.Fatal("옷 추가 쿼리 실패:", err)
	}

	// 트랜잭션 커밋
	err = tx.Commit()
	if err != nil {
		logger.Fatal("트랜잭션 커밋 실패:", err)
	}
}
