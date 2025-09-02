# Riot Take-Home Technical Challenge

## Table of Contents

  - [Context](#context)
  - [Technologies used](#technologies-used)
  - [Project architecture](#project-architecture)
  - [Installation \& Running the project](#installation--running-the-project)
    - [1. Clone the repository](#1-clone-the-repository)
    - [2. Install dependencies](#2-install-dependencies)
    - [3. Set up environment variables](#3-set-up-environment-variables)
    - [4. Run the project in development mode](#4-run-the-project-in-development-mode)
    - [5. Run tests](#5-run-tests)
- [API Endpoints - Quick summary](#api-endpoints---quick-summary)
  - [Encryption/Decryption](#encryptiondecryption)
  - [Signing/Verification](#signingverification)
    - [Access swagger documentation](#access-swagger-documentation)
  - [Stay in touch](#stay-in-touch)

## Context

This project is an implementation of the **Riot Take-Home Technical Challenge**.  
It is an **HTTP API** built with **NestJS** that handles four main cryptographic operations:

| Operation        | Description                                                                                                    |
| ---------------- | -------------------------------------------------------------------------------------------------------------- |
| **Encryption**   | Encrypts the properties of a JSON object (depth 1)                                                             |
| **Decryption**   | Decrypts an encrypted JSON object, leaving unencrypted properties unchanged                                    |
| **Signing**      | Generates a unique **HMAC** signature based on the JSON payload (property order does not affect the signature) |
| **Verification** | Verifies that a signature matches a JSON payload, returning 204 if valid, 400 if invalid                       |

To make the code **modular and easily extensible**, I personally chose to implement the **Strategy Pattern** for the encryption and signing algorithms. This allows **swapping algorithms easily** without changing the endpoint logic.

## Technologies used

| Technology     | Purpose                                            |
| -------------- | -------------------------------------------------- |
| **NestJS**     | Node.js framework used to structure the API        |
| **TypeScript** | Main language to leverage strong typing            |
| **Jest**       | Unit testing framework                             |
| **Swagger**    | Interactive API documentation                      |
| **Insomnia**   | API client for testing and debugging HTTP requests |

## Project architecture

The project is organized to ensure **modularity, readability, and easy extensibility**.  
Here is a brief overview of the main folders:

| Folder             | Purpose                                                              |
| ------------------ | -------------------------------------------------------------------- |
| `src/dto`          | Handles validation and typing of incoming requests                   |
| `src/encryption`   | Module dedicated to encryption and decryption logic                  |
| `src/signature`    | Module dedicated to signing and verification logic                   |
| `src/helpers`      | Constants and utility functions                                      |
| `src/*/strategies` | Implements the **Strategy Pattern** for flexible algorithm selection |

## Installation & Running the Project

### [Node.js](https://nodejs.org/en) should be installed on your machine before proceeding

Follow these steps to get the project up and running locally:

### 1. Clone the repository

```bash
git clone git@github.com:RovaEncoder/riot-take-home-test.git
```

Then, go in the project directory

```bash
cd riot-take-home-test
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a .env.dev file by copying the example file:

```bash
cp .env.example .env.dev
```

Then, open .env.dev and add your HMAC key (ex: secret) (🚨**Require for signature**)

### 4. Run the project in development mode

```bash
npm run start:dev
```

### 5. Run tests

```bash
npm run test
```
Everything is ready! Test the API using Swagger by following the final step.

## API endpoints - Quick summary

### Encryption/Decryption

- **POST /encrypt** – Encodes the **values** of top-level (depth 1) JSON keys using Base64
- **POST /decrypt** – Decodes Base64-encoded **values** of top-level JSON keys

### Signing/Verification

- **POST /sign** - Generates HMAC signature (property order insensitive)
- **POST /verify** - Verifies signature (returns 204 if valid, 400 if invalid)

### Access swagger documentation

The API will be available at [http://localhost:3000/api/docs](http://localhost:3000/api/docs#), you can test it 😉

### Stay in touch

- Author - [Christ Abessolo](https://www.christrova.com)
