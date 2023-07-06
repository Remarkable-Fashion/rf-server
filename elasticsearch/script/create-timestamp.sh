curl -X PUT "localhost:9200/_ingest/pipeline/timestamp" -H 'Content-Type: application/json' -d'
{
    "description": "Creates a timestamp when a document is initially indexed",
    "processors": [
        {
            "set": {
                "field": "_source.timestamp",
                "value": "{{_ingest.timestamp}}"
            }
        }
    ]
}'
