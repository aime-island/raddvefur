import cubejs, { CubejsApi } from '@cubejs-client/core';
import { getConfig } from '../config-helper';

export default class Stats {
  private cubejsApi: CubejsApi;

  constructor() {
    this.cubejsApi = cubejs(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NzIyODA2NDYsImV4cCI6MTU3MjM2NzA0Nn0.OCzuUgVeE6Srd3WOsiZRy0d4JL2s_SRcHTaoNBJxSo0',
      {
        apiUrl: 'http://127.0.0.1:4000/cubejs-api/v1',
      }
    );
  }

  getGender = async () => {};
}
