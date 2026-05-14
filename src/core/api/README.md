# API Core Module

## Responsibility
The API module wraps Playwright's `APIRequestContext` to simplify RESTful service testing. It provides standardized methods for CRUD operations and automatically logs request/response details for better debugging.

## Methods
- `get(endpoint, headers)`: Perform a GET request.
- `post(endpoint, data, headers)`: Perform a POST request.
- `put(endpoint, data, headers)`: Perform a PUT request.
- `delete(endpoint, headers)`: Perform a DELETE request.

## Usage
```typescript
import { BaseAPI } from '@core/api/BaseAPI';

const api = new BaseAPI(request, 'https://api.example.com');
const response = await api.get('/users/1');
expect(response.ok()).toBeTruthy();
```
