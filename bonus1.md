# Bonus 1 — Country Currency & Exchange API

## Description

Fetch country data, compute estimated GDP, cache in MySQL, and generate a summary image.

## Endpoints

- `POST /countries/refresh` — fetch & cache countries, generate image
- `GET /countries` — list all countries (filters & sort)
- `GET /countries/:name` — get a single country
- `DELETE /countries/:name` — delete a country
- `GET /countries/image` — serve summary image
- `GET /status` — total countries and last refresh timestamp

## Database Setup

```sql
CREATE DATABASE countriesdb;

USE countriesdb;

CREATE TABLE countries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  capital VARCHAR(255),
  region VARCHAR(255),
  population BIGINT NOT NULL,
  currency_code VARCHAR(10) NOT NULL,
  exchange_rate DOUBLE,
  estimated_gdp DOUBLE,
  flag_url VARCHAR(500),
  last_refreshed_at DATETIME
);
```

## Environment Variables

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=countriesdb
```

## Installation

```bash
npm install
npm install canvas
```

> Note: Install system dependencies for `canvas` (cairo, pango, jpeg, etc.)

## Usage

1. Refresh country data:

```
POST /countries/refresh
```

2. Get countries, filters, sorting:

```
GET /countries?region=Africa&currency=NGN&sort=gdp_desc
```

3. Get single country:

```
GET /countries/Nigeria
```

4. Delete a country:

```
DELETE /countries/Nigeria
```

5. Get summary image:

```
GET /countries/image
```

6. Check API status:

```
GET /status
```

[Back to main README](README.md)
