#!/bin/bash

# Initialize an empty JSON object
echo "{" > ./src/playerData/allPlayers.json

# Loop through each player_*.json file
for file in ./src/playerData/player_*.json; do
  # Extract the player name from the filename
  player_name=$(basename "$file" .json | sed 's/player_//')
  
  # Read the content of the JSON file
  player_data=$(cat "$file")
  
  # Append the player data to the allPlayers.json file
  echo "\"$player_name\": $player_data," >> ./src/playerData/allPlayers.json
done

# Remove the last comma and close the JSON object
sed -i '' -e '$ s/,$//' ./src/playerData/allPlayers.json
echo "}" >> ./src/playerData/allPlayers.json
