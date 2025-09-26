# Mask API

REST API that masks strings keeping the last 4 characters visible with Redis caching and MongoDB persistence.

## Features

- String masking with last 4 characters visible
- Redis caching for improved performance
- MongoDB persistence for input/output history
- Docker Compose setup with all services
- API documentation with Swagger

## Installation

```bash
npm install
```

## Running

### With Docker Compose (Recommended)
```bash
# Start all services in development mode (with hot reload)
docker-compose up

# Run in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f mask-api
```

### With Node.js (requires MongoDB and Redis running)
```bash
# Set environment variables
export MONGODB_URI=mongodb://localhost:27017/maskapi
export REDIS_URL=redis://localhost:6379

# Development
npm run start:dev

# Production
npm run build
npm run start
```

## Development

The Docker Compose setup uses volume mounting for development:
- Code changes are reflected immediately (hot reload)
- No need to rebuild images during development
- `node_modules` is cached in a separate volume for performance

## Tests

```bash
npm test
```

## API

The API will be available at `http://localhost:3000`

### Important URLs
- **API Base:** `http://localhost:3000`
- **Swagger Documentation:** `http://localhost:3000/api`
- **Health Check:** `http://localhost:3000/mask/history` (GET)

### Endpoints

#### Mask String
**POST** `/mask`

**Body:**
```json
{
  "input": "455636460793561"
}
```

**Response:**
```json
{
  "result": "###########5616"
}
```

#### Get History
**GET** `/mask/history`

**Response:**
```json
[
  {
    "_id": "...",
    "input": "455636460793561",
    "output": "###########5616",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Error Handling

The API returns appropriate HTTP status codes:

- **400 Bad Request**: Invalid input (empty, null, or wrong type)
- **503 Service Unavailable**: Database or cache connection issues
- **500 Internal Server Error**: Unexpected errors

**Error Response Format:**
```json
{
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/mask",
  "method": "POST",
  "message": ["Invalid input: Input cannot be null or undefined"]
}
```

## API Documentation

### Swagger UI
Interactive API documentation is available at:
- **URL:** `http://localhost:3000/api`
- **Description:** Web interface to test endpoints
- **Format:** OpenAPI 3.0

### Postman Collection
Postman collection and environment files are available in the `/postman` folder:
- **Collection:** `postman/Mask-API.postman_collection.json`
- **Environment:** `postman/Mask-API.postman_environment.json`

#### Import to Postman:
1. Open Postman
2. Click "Import" button
3. Select both JSON files from the `postman/` folder
4. Set the environment to "Mask API Environment"

## Examples

- `"455636460793561"` → `"###########5616"`
- `"64607935616"` → `"#######5616"`
- `"1"` → `"1"`
- `"Skippy"` → `"##ippy"`
- `"Nanananananananananananananana Batman!"` → `"###################################man!"`