curl -X POST "localhost:9200/search_log/_search" -H 'Content-Type: application/json' -d'
{
  "size": 1,
  "_source": ["timestamp"],
  "sort": [
    {
      "timestamp": {
        "order": "desc"
      }
    }
  ]
}
'
