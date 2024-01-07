# LangChain-POC

This is a proof of concept for dynamically load LLM models, sources, and vectorStores for LangChain with a web user interface.

## Structure

The project is divided into three parts: LangChain handler, web interface and a api server.

### LangChain handler

The LangChain handler is a nodejs packages that is responsible for dynamically loading / unloading sources and agents and executing them. It is the key component of the project.

### Web interface

The web interface is a Next.js application that is responsible for providing a user interface for the LangChain handler. It is also responsible for providing a way to upload sources or settings.

### API server

The API server is a nodejs application that is responsible for providing a way for the web interface to communicate with the LangChain handler. It is also responsible for interacting with the LangChain handler and database.

## Development

- [ ] LangChain Packages
  - [x] Handler for LLM models
  - [x] Handler for Databases
  - [x] Handler for Documents
  - [ ] Handler for VectorStores
  - [ ] Handler for TextSplitters
  - [ ] Handler for Memory (Chat History)
  - [ ] Builder for Runnable / RunnableChain
- [ ] Web Interface
  - [ ] TBD
- [ ] API Server
  - [ ] TBD

## Installation

A docker-compose file will be provided to run the project. It will start the LangChain handler, web interface and api server, as well as a database using postgresql. The docker-compose file will be customizable to allow for different configurations.
