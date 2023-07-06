curl -X GET "localhost:9200/search_log/_search" -H 'Content-Type: application/json' -d'
{
  "size": 0,
  "aggs": {
    "popular_keywords": {
      "terms": {
        "field": "query",
        "size": 5
      }
    }
  }
}
'
