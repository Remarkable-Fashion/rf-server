curl -X PUT "localhost:9200/_bulk?pipeline=timestamp" -H 'Content-Type: application/json' -d'
{"index":{"_index":"search_log", "_id":"1"}}
{"query":"삼성전자"}
{"index":{"_index":"search_log", "_id":"2"}}
{"query":"삼성전자"}
{"index":{"_index":"search_log", "_id":"3"}}
{"query":"삼성전자"}
{"index":{"_index":"search_log", "_id":"4"}}
{"query":"네이버"}
{"index":{"_index":"search_log", "_id":"5"}}
{"query":"네이버"}
{"index":{"_index":"search_log", "_id":"6"}}
{"query":"카카오"}
{"index":{"_index":"search_log", "_id":"7"}}
{"query":"두나무"}
'
