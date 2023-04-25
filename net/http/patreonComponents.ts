// Code generated by goctl. DO NOT EDIT.

export interface LoginRequest {
	code: string
}

export interface LoginResponse {
	userId: string
	channelId: string
	token: string
	setup: boolean
	manageable: boolean
	spaceProfile?: SpaceProfile
	connected: boolean
	membershipLevels?: Array<MembershipLevel>
	outdatedMembershipLevels?: Array<MembershipLevel>
	eligible: boolean
	minted: boolean
	corrMembershipLevel?: MembershipLevel
}

export interface SpaceProfile {
	avatar: string
	name: string
	intro: string
	patreonURL: string
}

export interface MembershipLevel {
	id: string
	image: string
	name: string
	intro: string
	roles?: Array<Role> 
}

export interface Role {
	id: string
	name: string
	color: string
	selected?: boolean
}

export interface ValidateOAuth2TokenRequest {
	code: string
}

export interface GetHomepageResponse {
	userId: string
	channelId: string
	setup: boolean
	manageable: boolean
	spaceProfile?: SpaceProfile
	connected: boolean
	membershipLevels?: Array<MembershipLevel>
	outdatedMembershipLevels?: Array<MembershipLevel>
	eligible: boolean
	minted: boolean
	corrMembershipLevel?: MembershipLevel
}

export interface ModifySpaceProfileRequest {
	avatar?: string
	name?: string
	intro?: string
}

export interface RefreshMembershipLevelsResponse {
	membershipLevels: Array<MembershipLevel>
	outdatedMembershipLevels: Array<MembershipLevel>
}

export interface RemoveOutdatedMembershipLevelsRequest {
}

export interface RemoveOutdatedMembershipLevelsRequestParams {
	levelId: string
}

export interface ModifyMembershipLevelRequest {
	avatar?: string
	name?: string
	intro?: string
}

export interface ModifyMembershipLevelRequestParams {
	levelId: string
}

export interface AssignedRolesForMembershipLevelRequest {
	roleIds: Array<string>
}

export interface AssignedRolesForMembershipLevelRequestParams {
	levelId: string
}

export interface GetAvailableRolesForMembershipLevelRequest {
}

export interface GetAvailableRolesForMembershipLevelRequestParams {
	levelId: string
}

export interface GetAvailableRolesForMembershipLevelResponse {
	roles: Array<Role>
}

export interface CreateUploadsRequest {
	payloads: Array<UploadPayloadRequest>
}

export interface UploadPayloadRequest {
	index: number
	type: number // 1: avatar, 2: nft
	contentType: string
	contentLength: number
}

export interface CreateUploadsResponse {
	objects: Array<UploadPresignedObject>
}

export interface UploadPresignedObject {
	index: number
	type: number
	urls: string
	headers: Array<UploadSignedHeader>
	expiredAt: number
}

export interface UploadSignedHeader {
	key: string
	value: string
}

export interface GetNFTMetadataRequest {
}

export interface GetNFTMetadataRequestParams {
	tokenId: string
}

export interface GetNFTMetadataResponse {
	name: string
	description: string
	image: string
	attributes: Array<Attribute>
	patreon: Patreon
}

export interface Attribute {
	trait_type: string
	value: string
}

export interface Patreon {
	creator: PatreonCreator
	levels: { [key: string]: any }
}

export interface PatreonCreator {
	name: string
	description: string
	image: string
	id: string
}

export interface RefreshUserTiersRequest {
}

export interface RefreshUserTiersRequestParams {
	userId: string // @me
}

export interface RefreshUserTiersResponse {
	userId: string
	channelId: string
	setup: boolean
	manageable: boolean
	spaceProfile?: SpaceProfile
	connected: boolean
	membershipLevels?: Array<MembershipLevel>
	outdatedMembershipLevels?: Array<MembershipLevel>
	eligible: boolean
	minted: boolean
	corrMembershipLevel?: MembershipLevel
}
