#!/bin/sh

# check if port variable is set or go with default
if [ -z ${PORT+x} ]; then echo "PORT variable not defined, leaving N8N to default port."; else export N8N_PORT="$PORT"; echo "N8N will start on '$PORT'"; fi

export DB_TYPE=$N8N_DB_TYPE
export DB_MYSQLDB_DATABASE=$N8N_DB_DATABASE
export DB_MYSQLDB_HOST=$N8N_DB_HOST
export DB_MYSQLDB_PORT=$N8N_DB_PORT
export DB_MYSQLDB_USER=$N8N_DB_USER
export DB_MYSQLDB_PASSWORD=$N8N_DB_PASSWORD

# kickstart nodemation
n8n