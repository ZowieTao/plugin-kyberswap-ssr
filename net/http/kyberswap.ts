import client from './client';
import * as components from './kyberswapComponents';

export * from './kyberswapComponents';

/**
 * @description "Load balancer health check endpoint"
 */
export function healthcheck() {
  return client.get<null>('/');
}

/**
 * @description "Login"
 * @param req
 */
export function login(req: components.LoginRequest) {
  return client.post<components.LoginResponse>('/v1/login', req);
}

/**
 * @description "Modify preset token pair"
 * @param req
 */
export function modifyPresetTokenPair(
  req: components.ModifyPresetTokenPairRequest,
) {
  return client.put<null>('/v1/preset', req);
}

/**
 * @description "Delete preset token pair"
 */
export function deletePresetTokenPair() {
  return client.delete<null>('/v1/preset');
}
