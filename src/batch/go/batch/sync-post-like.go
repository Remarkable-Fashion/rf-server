package batch

import (
	"context"
	"database/sql"
	"log"
	"strconv"

	"github.com/redis/go-redis/v9"
)

const (
	COUNTS_POST_LIKES_STREAM = "likes.post.stream"
	DEFAULT_COUNT            = 100
	POST_PREFIX              = "likes:post:"
)

func SyncPostsLikeCount(db *sql.DB, redisClient *redis.Client, logger *log.Logger, ctx context.Context) {
	id := "0"

	for {
		// Read from stream
		xReadResp, err := redisClient.XRead(ctx, &redis.XReadArgs{
			Streams: []string{COUNTS_POST_LIKES_STREAM, id},
			Count:   DEFAULT_COUNT,
		}).Result()

		if err != nil {
			logger.Fatal(err)
			return
		}

		if len(xReadResp) == 0 {
			break
		}

		messages := xReadResp[0].Messages
		postIds := make([]string, len(messages))
		for i, msg := range messages {
			postIds[i] = msg.Values["post_id"].(string)
		}

		postIdsWithPrefix := make([]string, len(messages))
		for i, msg := range messages {
			postIdsWithPrefix[i] = POST_PREFIX + msg.Values["post_id"].(string)
		}

		likeCounts, err := redisClient.MGet(ctx, postIdsWithPrefix...).Result()
		if err != nil {
			logger.Fatal(err)
			return
		}

		for index, postId := range postIds {
			postIdInt, _ := strconv.Atoi(postId)

			likeCountValue := likeCounts[index]

			if likeCountValue == nil {
				logger.Printf("No like count found for post ID: %v\n", postId)
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

			_, err = db.Exec("UPDATE posts SET like_count = ? WHERE id = ?", intValue, postIdInt)
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
	_, err := redisClient.XTrimMaxLen(ctx, COUNTS_POST_LIKES_STREAM, 0).Result()
	if err != nil {
		logger.Fatal(err)
		return
	}
}
