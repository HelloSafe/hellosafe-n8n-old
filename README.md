# Hellosafe n8n

A collection of n8n nodes and the n8n server

## Prerequisites

You need the following installed on your development machine:

* [git](https://git-scm.com/downloads)
* Node.js and npm. Minimum version Node 16. You can find instructions on how to install both using nvm (Node Version Manager) for Linux, Mac, and WSL [here](https://github.com/nvm-sh/nvm). For Windows users, refer to Microsoft's guide to [Install NodeJS on Windows](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows).
* Install n8n with:
	```
	npm install n8n -g
	```
* Docker
* Recommended: follow n8n's guide to [set up your development environment](https://docs.n8n.io/integrations/creating-nodes/build/node-development-environment/).


## Usage
1. docker compose up -d
2. npm install
3. npm run build <-- run at least once to copy the icons
4. npm run dev
4. go to http://localhost:8118, try ExampleNode, adjust nodes/ExampleNode/..., refresh the page etc.


## To improve
1. changing .env.local / .env require to restart docker container to take effect