import { test, expect } from '@playwright/test';
import { BaseAPI } from '@core/api/BaseAPI';
import { ENV } from '@utils/Env';

test.describe('API CRUD Operations', () => {
  let api: BaseAPI;

  test.beforeEach(async ({ request }) => {
    api = new BaseAPI(request, ENV.API_URL);
  });

  test('GET - Fetch all posts', async () => {
    const response = await api.get('/posts');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.length).toBeGreaterThan(0);
  });

  test('POST - Create a new post', async () => {
    const payload = {
      title: 'foo',
      body: 'bar',
      userId: 1,
    };
    const response = await api.post('/posts', payload);
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.title).toBe(payload.title);
  });

  test('PUT - Update a post', async () => {
    const payload = {
      id: 1,
      title: 'updated title',
      body: 'updated body',
      userId: 1,
    };
    const response = await api.put('/posts/1', payload);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.title).toBe(payload.title);
  });

  test('DELETE - Remove a post', async () => {
    const response = await api.delete('/posts/1');
    expect(response.status()).toBe(200);
  });
});
