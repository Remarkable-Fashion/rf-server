package batch

import (
	"context"
	"database/sql"
	"log"
	"strconv"
	"time"

	"github.com/redis/go-redis/v9"
)

const (
	COUNTS_CLOTHES_LIKES_STREAM = "likes.clothe.stream"
	// DEFAULT_COUNT               = 100
	CLOTHES_PREFIX = "likes:clothes:"
)

func SyncClothesLikeCount(db *sql.DB, redisClient *redis.Client, logger *log.Logger, ctx context.Context) {
	id := "0"

	for {
		// Read from stream
		xReadResp, err := redisClient.XRead(ctx, &redis.XReadArgs{
			Streams: []string{COUNTS_CLOTHES_LIKES_STREAM, id},
			Count:   DEFAULT_COUNT,
			Block:   1000 * time.Millisecond, // 1초 동안 대기
		}).Result()

		if err != nil && err.Error() != "redis: nil" {
			logger.Fatal("err :", err)
			return
		}

		if len(xReadResp) == 0 {
			return
		}

		messages := xReadResp[0].Messages
		clothesIds := make([]string, len(messages))
		for i, msg := range messages {
			clothesIds[i] = msg.Values["clothe_id"].(string)
		}

		if len(clothesIds) <= 0 {
			logger.Println("clothesIds가 없어 종료합니다.")
			return
		}

		clothesIdsWithPrefix := make([]string, len(messages))
		for i, msg := range messages {
			clothesIdsWithPrefix[i] = CLOTHES_PREFIX + msg.Values["clothe_id"].(string)
		}

		likeCounts, err := redisClient.MGet(ctx, clothesIdsWithPrefix...).Result()
		if err != nil {
			logger.Fatal(err)
			return
		}

		for index, clothesId := range clothesIds {
			clothesIdInt, _ := strconv.Atoi(clothesId)

			likeCountValue := likeCounts[index]

			if likeCountValue == nil {
				logger.Printf("No like count found for clothes ID: %v\n", clothesId)
				continue
			}

			var intValue int

			if stringValue, ok := likeCountValue.(string); ok {
				var err error
				intValue, err = strconv.Atoi(stringValue)
				if err != nil {
					logger.Printf("Error converting string to int: %v\n", err)
					return
				}
			} else {
				logger.Println("Value is not a string.")
				return
			}

			_, err = db.Exec("UPDATE clothes SET like_count = ? WHERE id = ?", intValue, clothesIdInt)
			if err != nil {
				logger.Fatal(err)
				return
			}
		}

		id = messages[len(messages)-1].ID
		if len(messages) < DEFAULT_COUNT {
			break
		}
	}

	// Trim the stream
	_, err := redisClient.XTrimMaxLen(ctx, COUNTS_CLOTHES_LIKES_STREAM, 0).Result()
	if err != nil {
		logger.Fatal(err)
		return
	}
}
