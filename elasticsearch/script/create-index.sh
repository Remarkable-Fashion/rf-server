curl -X PUT "localhost:9200/search_log" -H 'Content-Type: application/json' -d'
{
    "settings": {
        "index": {
            "analysis": {
                "tokenizer": {
                    "nori_user_dict": {
                        "type": "nori_tokenizer",
                        "decompound_mode": "mixed",
                        "discard_punctuation": "false"
                    }
                },
                "filter": {
                    "my_pos_f": {
                        "type": "nori_part_of_speech",
                        "stoptags": [
                            "E",
                            "IC",
                            "J",
                            "MAG",
                            "MAJ",
                            "MM",
                            "SP",
                            "SSC",
                            "SSO",
                            "SC",
                            "SE",
                            "XPN",
                            "XSA",
                            "XSN",
                            "XSV",
                            "UNA",
                            "NA",
                            "VSV"
                        ]
                    }
                },
                "analyzer": {
                    "my_analyzer": {
                        "type": "custom",
                        "tokenizer": "nori_user_dict",
                        "filter": "my_pos_f"
                    }
                }
            }
        }
    },
    "mappings": {
        "properties": {
            "query": {
                "type": "keyword"
            },
            "value": {
                "type": "integer"
            }
        }
    }
}'
