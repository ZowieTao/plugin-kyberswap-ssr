import { delay } from '@/utils/core/base';

import { ComposedResponse } from './client';
import * as components from './patreonComponents';
import { MembershipLevel } from './patreonComponents';

export * from './patreonComponents';

const data: components.LoginResponse = {
  userId: '1541990704841543680',
  channelId: '1645253388832645120',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHg0NGU5MTExYWMxMjU2ZjY5YjljYzM5ZTExNTk4ZDlhYjk1NzUyNjE3IiwiY2hhbm5lbElkIjoxNjQ1MjUzMzg4ODMyNjQ1MTIwLCJleHAiOjE2ODM2ODk0MTYsImlhdCI6MTY4MTA5NzQxNiwic2VydmVySWQiOjE1NTU4NjE2NTcxNTU0OTc5ODQsInVzZXJJZCI6MTU0MTk5MDcwNDg0MTU0MzY4MH0.Tg5JmwiUvbH1Mso1qcTVEn61HBWO93brzRTL7bwHC90',
  setup: true,
  manageable: true,
  spaceProfile: {
    avatar:
      '/avatars/1681095600000/9179d87f0610e9bbb1e5d06e625ca4db597db3c7/0e6ea8ef-9add-49af-b4c6-39171cc5a5a6.jpg',
    name: 'Zowie',
    intro: '',
    patreonURL: 'https://www.patreon.com/user?u=90647981',
  },
  connected: true,
  membershipLevels: [
    {
      id: '19',
      image:
        '/avatars/1681095600000/69ca45ba8ebe5b5dd0863df79714d0e8421a37df/c463932d-a619-445f-a8b2-3a34a596e7f2.jpg',
      name: 'adRemover ',
      intro: '<p style="">remove ad </p>',
      roles: [],
    },
    {
      id: '20',
      image:
        '/avatars/1681095600000/a2151a72bf06a665162c05546789a4cc7b490bfc/ad66a776-aa95-42f2-bd4d-3f7868298e91.png',
      name: 'instantMessager',
      intro:
        '<p style=""><span style="color:rgb(77, 81, 86);"><mark style="background-color:rgb(255, 255, 255);">instant messaging with author</mark></span></p>',
      roles: [],
    },
  ],
  eligible: false,
  minted: false,
  corrMembershipLevel: {
    id: '',
    image: '',
    name: '',
    intro: '',
    roles: undefined,
  },
};

/**
 * @description "Login"
 * @param req
 */

export function login(
  req: components.LoginRequest,
): Promise<ComposedResponse<components.LoginResponse>> {
  return new Promise((resolve) => {
    console.log('!!! login', req);
    delay(1000).then(() => {
      resolve({
        data,
      } as ComposedResponse<components.LoginResponse>);
    });
  });
}

/**
 * @description "Validating Receipt of the OAuth Token"
 * @param req
 */
export function validateOAuth2Token(
  req: components.ValidateOAuth2TokenRequest,
): Promise<ComposedResponse<null>> {
  return new Promise((resolve) => {
    console.log('!!! validateOAuth2Token', req);
    delay(1000).then(() => {
      resolve({
        data: null as unknown,
      } as ComposedResponse<null>);
    });
  });
}

/**
 * @description "Get homepage content"
 */
export function getHomepage(): Promise<
  ComposedResponse<components.GetHomepageResponse>
> {
  return new Promise((resolve) => {
    console.log('!!! validateOAuth2Token');
    delay(1000).then(() => {
      resolve({
        data: {
          setup: true,
          manageable: true,
          spaceProfile: {},
          connected: true,
          membershipLevels: [] as MembershipLevel[],
          outdatedMembershipLevels: [] as MembershipLevel[],
          eligible: true,
          minted: true,
          corrMembershipLevel: {
            id: 'string',
            image: 'string',
            name: 'string',
            intro: 'string',
            roles: [] as components.Role[],
          },
        } as components.GetHomepageResponse,
      } as ComposedResponse<components.GetHomepageResponse>);
    });
  });
}

/**
 * @description "Modify space profile"
 * @param req
 */
export function modifySpaceProfile(
  req: components.ModifySpaceProfileRequest,
): Promise<ComposedResponse<null>> {
  return new Promise((resolve) => {
    console.log('!!! validateOAuth2Token', req);
    delay(1000).then(() => {
      resolve({
        data: null as unknown,
      } as ComposedResponse<null>);
    });
  });
}

export function createObjectUploads(
  req: components.CreateUploadsRequest,
): Promise<ComposedResponse<components.CreateUploadsResponse>> {
  return new Promise((resolve) => {
    console.log('!!! validateOAuth2Token', req);
    delay(1000).then(() => {
      resolve({
        data: null as unknown,
      } as ComposedResponse<components.CreateUploadsResponse>);
    });
  });
}
