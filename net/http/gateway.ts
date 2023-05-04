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

/**
 * @description "Setup"
 * @param req
 */
export function setup(req: components.SetupRequest) {
  return client.post<components.SetupResponse>('/api/setup', req);
}