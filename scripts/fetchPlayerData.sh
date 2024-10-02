#!/bin/bash

# Read player IDs from playerList.json using Python
player_ids=$(python3 -c "import json; print(' '.join(map(str, json.load(open('playerData/playerList.json'))['players'])))")

# Loop through each player ID and fetch the JSON data
for player_id in $player_ids; do
  url="https://api.iplayacl.com/api/v1/yearly-player-stats/$player_id?bucketID=10"
  output_file=".src/playerData/player_$player_id.json"
  curl -s $url -o $output_file
done
