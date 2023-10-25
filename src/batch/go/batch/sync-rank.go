package batch

import (
	"context"
	"encoding/json"
	"fmt"
	"go-batch/date"
	"log"
	"strings"
	"time"

	opensearch "github.com/opensearch-project/opensearch-go/v2"
	"github.com/redis/go-redis/v9"
)

type Response struct {
	Aggregations struct {
		PopularKeywords struct {
			Buckets []Rank `json:"buckets"`
		} `json:"popular_keywords"`
	} `json:"aggregations"`
}

type Bucket struct {
	Key      string `json:"key"`
	DocCount int    `json:"doc_count"`
}

type Rank struct {
	Bucket
	ChangeIndicator string `json:"changeIndicator"`
}

func findIndex(ranks []Rank, key string) int {
	for i, rank := range ranks {
		if rank.Key == key {
			return i
		}
	}
	return -1
}

func rankingChanges(currentRanking, previousRanking []Rank) []Rank {
	var result []Rank
	for currentIndex, currentItem := range currentRanking {
		previousIndex := findIndex(previousRanking, currentItem.Key)
		rankChange := previousIndex - currentIndex

		changeIndicator := "new"
		if previousIndex != -1 {
			if rankChange > 0 {
				changeIndicator = fmt.Sprintf("+%d", rankChange)
			} else if rankChange < 0 {
				changeIndicator = fmt.Sprintf("%d", rankChange)
			} else {
				changeIndicator = "─"
			}
		}

		result = append(result, Rank{
			Bucket: Bucket{
				Key:      currentItem.Key,
				DocCount: currentItem.DocCount,
			},
			ChangeIndicator: changeIndicator,
		})
	}
	return result
}

const (
	index      = "search_log" // Replace with your index
	queryField = "query"      // Replace with your query field
	size       = 10
)

func getSearchRank(client *opensearch.Client, logger *log.Logger, dateRange map[string]string) []Rank {
	query := map[string]interface{}{
		"size": 0,
		"query": map[string]interface{}{
			"range": map[string]interface{}{
				"timestamp": map[string]interface{}{
					"gte": dateRange["gte"],
					"lte": dateRange["lte"],
				},
			},
		},
		"aggs": map[string]interface{}{
			"popular_keywords": map[string]interface{}{
				"terms": map[string]interface{}{
					"field": fmt.Sprintf("%s.keyword", queryField),
					"size":  size, // Replace with your size
				},
			},
		},
	}

	var buf strings.Builder
	if err := json.NewEncoder(&buf).Encode(query); err != nil {
		logger.Fatalf("Error encoding query: %s", err)
	}

	res, err := client.Search(
		client.Search.WithContext(context.Background()),
		client.Search.WithIndex(index),
		client.Search.WithBody(strings.NewReader(buf.String())),
		client.Search.WithTrackTotalHits(true),
		client.Search.WithPretty(),
	)
	if err != nil {
		logger.Fatalf("Error getting response: %s", err)
	}
	defer res.Body.Close()

	var response Response
	decoder := json.NewDecoder(res.Body)
	err = decoder.Decode(&response)
	if err != nil {
		logger.Println(err)
	}

	buckets := response.Aggregations.PopularKeywords.Buckets

	return buckets
}

const REDIS_SEARCH_RANK_KEY = "search:rank"

func getRedisSearchRank(redis *redis.Client, ctx context.Context, logger *log.Logger) []Rank {
	result := redis.Get(ctx, REDIS_SEARCH_RANK_KEY).Val()

	var response []Rank
	decoder := json.NewDecoder(strings.NewReader(result))
	// decoder := json.NewDecoder(result)
	err := decoder.Decode(&response)
	if err != nil {
		logger.Println(err)
	}

	return response
}

func GenerateCurrentRanking(client *opensearch.Client, redis *redis.Client, logger *log.Logger, ctx context.Context) {
	dateRange := date.GetDateRange(time.Now())
	currentRanks := getSearchRank(client, logger, dateRange)
	previousRanks := getRedisSearchRank(redis, ctx, logger)
	orderedRanks := rankingChanges(currentRanks, previousRanks)

	jsonData, err := json.MarshalIndent(orderedRanks, "", "  ")
	if err != nil {
		logger.Println("Error marshalling data:", err)
		return
	}

	err = redis.Set(ctx, REDIS_SEARCH_RANK_KEY, string(jsonData), 0).Err()
	if err != nil {
		logger.Println("Error saving data to Redis:", err)
		return
	}
	// logger.Println("Data saved to Redis successfully")
}

func main() {
	// Example usage
	currentRanking := []Rank{
		{
			Bucket: Bucket{
				Key:      "A",
				DocCount: 5,
			},
		},
		{
			Bucket: Bucket{
				Key:      "A",
				DocCount: 5,
			},
		},
		{
			Bucket: Bucket{
				Key:      "A",
				DocCount: 5,
			},
		},
	}
	previousRanking := []Rank{
		{
			Bucket: Bucket{
				Key:      "B",
				DocCount: 9,
			},
		},
		{
			Bucket: Bucket{
				Key:      "A",
				DocCount: 7,
			},
		},
		{
			Bucket: Bucket{
				Key:      "C",
				DocCount: 5,
			},
		},
	}

	changes := rankingChanges(currentRanking, previousRanking)
	for _, change := range changes {
		fmt.Printf("Key: %s, DocCount: %d, ChangeIndicator: %s\n", change.Key, change.DocCount, change.ChangeIndicator)
	}
}
