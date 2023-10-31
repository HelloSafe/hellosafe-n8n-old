#!/bin/sh

# check if port variable is set or go with default
if [ -z ${PORT+x} ]; then echo "PORT variable not defined, leaving N8N to default port."; else export N8N_PORT="$PORT"; echo "N8N will start on '$PORT'"; fi

echo "database host: $N8N_DB_HOST post: $N8N_DB_PORT database: $N8N_DB_DATABASE"

export DB_TYPE=postgresdb
export DB_POSTGRESDB_HOST=$N8N_DB_HOST
export DB_POSTGRESDB_PORT=$N8N_DB_PORT
export DB_POSTGRESDB_DATABASE=$N8N_DB_DATABASE
export DB_POSTGRESDB_USER=$N8N_DB_USER
export DB_POSTGRESDB_PASSWORD=$N8N_DB_PASSWORD

# Save executions ending in errors
export EXECUTIONS_DATA_SAVE_ON_ERROR=all

# Save successful executions
export EXECUTIONS_DATA_SAVE_ON_SUCCESS=all

# Don't save node progress for each execution
export EXECUTIONS_DATA_SAVE_ON_PROGRESS=false

# Don't save manually launched executions
export EXECUTIONS_DATA_SAVE_MANUAL_EXECUTIONS=false

# Activate automatic data pruning
export EXECUTIONS_DATA_PRUNE=true

# Number of hours after execution that n8n deletes data
export EXECUTIONS_DATA_MAX_AGE=168

# Number of executions to store
export EXECUTIONS_DATA_PRUNE_MAX_COUNT=50000

# check if env mode is dev or prod if prod then set the following
if [ "$NODE_ENV" == "production" ]; then
  export DB_POSTGRESDB_SSL_CA=/home/node/rds-ca-2019-root.pem
  export DB_POSTGRESDB_SSL_REJECT_UNAUTHORIZED=false
fi

echo "export database configuration completed"
# kickstart nodemation
n8n
