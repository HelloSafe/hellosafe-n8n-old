# HelloSafe n8n-heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/HelloSafe/hellosafe-n8n/tree/main)

## n8n - Free and open fair-code licensed node based Workflow Automation Tool.

This is a [Heroku](https://heroku.com/)-focused container implementation of [n8n](https://n8n.io/).

Use the **Deploy to Heroku** button above to launch n8n on Heroku. When deploying, make sure to check all configuration options and adjust them to your needs. It's especially important to set `N8N_ENCRYPTION_KEY` to a random secure value. 

Refer to the [Heroku n8n tutorial](https://docs.n8n.io/hosting/server-setups/heroku/) for more information.

If you have questions after trying the tutorials, check out the [forums](https://community.n8n.io/).

## Variable to setup
DB_TYPE=$N8N_DB_TYPE
DB_POSTGRESDB_HOST=$N8N_DB_HOST
DB_POSTGRESDB_PORT=$N8N_DB_PORT
DB_POSTGRESDB_DATABASE=$N8N_DB_DATABASE
DB_POSTGRESDB_USER=$N8N_DB_USER
DB_POSTGRESDB_PASSWORD=$N8N_DB_PASSWORD