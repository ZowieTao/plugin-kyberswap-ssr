import client from "./client"
import * as components from "./pluginComponents"
export * from "./pluginComponents"

/**
 * @description "Load Balancer Health Check"
 */
export function index() {
	return client.get<null>("/")
}

/**
 * @description "Auth plugin's code"
 * @param params
 */
export function authCode(params: components.AuthCodeRequestParams) {
	return client.get<components.AuthCodeResponse>("/v1/users/auth", params)
}

/**
 * @description "Validate user's server-level permissions"
 * @param params
 */
export function validateServerPermissions(params: components.ValidateServerPermissionsRequestParams) {
	return client.get<components.ValidateServerPermissionsResponse>("/v1/servers/:serverId/permissions/validate", params)
}

/**
 * @description "Get server member's information"
 * @param params
 */
export function getServerMember(params: components.GetServerMemberRequestParams) {
	return client.get<components.GetServerMemberResponse>("/v1/servers/:serverId/members/:userId", params)
}

/**
 * @description "Get list of roles in a server"
 * @param params
 */
export function getServerRoles(params: components.GetServerRolesRequestParams) {
	return client.get<Array<components.Role>>("/v1/servers/:serverId/roles", params)
}

/**
 * @description "Get guard's supported networks"
 * @param params
 */
export function getServerGuardNetworks(params: components.GetServerGuardNetworksRequestParams) {
	return client.get<Array<components.GuardNetwork>>("/v1/servers/:serverId/guards/networks", params)
}

/**
 * @description "Invoke a gating for user"
 * @param params
 * @param req
 */
export function createServerGuardInvocation(params: components.CreateServerGuardInvocationRequestParams, req: components.CreateServerGuardInvocationRequest) {
	return client.post<null>("/v1/servers/:serverId/guards/invocations", params, req)
}

/**
 * @description "Get guards set by applications"
 * @param params
 */
export function getServerAppGuard(params: components.GetServerAppGuardRequestParams) {
	return client.get<Array<components.AppGuard>>("/v1/servers/:serverId/guards/:roleId/apps", params)
}

/**
 * @description "Add guard's conditions"
 * @param params
 * @param req
 */
export function createServerAppGuard(params: components.CreateServerAppGuardRequestParams, req: components.CreateServerAppGuardRequest) {
	return client.post<Array<components.AppGuard>>("/v1/servers/:serverId/guards/:roleId/apps", params, req)
}

/**
 * @description "Delete guard condition"
 * @param params
 */
export function deleteServerAppGuard(params: components.DeleteServerAppGuardRequestParams) {
	return client.delete<null>("/v1/servers/:serverId/guards/:roleId/apps/:id", params)
}

/**
 * @description "Validate user's channel-level permissions"
 * @param params
 */
export function validateChannelPermissions(params: components.ValidateChannelPermissionsRequestParams) {
	return client.get<components.ValidateChannelPermissionsResponse>("/v1/channels/:channelId/permissions/validate", params)
}

/**
 * @description "Send notification"
 * @param req
 */
export function notify(req: components.NotifyRequest) {
	return client.post<null>("/v1/notify", req)
}
