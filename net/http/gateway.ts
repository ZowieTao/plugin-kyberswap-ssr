import client from './client';
import * as components from './gatewayComponent';

export * from './gatewayComponent';

/**
 * @description "Load balancer health check endpoint"
 */
export function index() {
  return client.get<null>('/');
}

/**
 * @description "Login"
 * @param req
 */
export function login(req: components.LoginRequest) {
  return client.post<components.LoginResponse>('/api/login', req);
}
