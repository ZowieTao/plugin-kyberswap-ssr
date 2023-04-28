import { NextRequest, NextResponse } from 'next/server';

import { getChannelInfo } from '@/db';
import { LoginResponse } from '@/net/http/gatewayComponent';
import {
  authCode,
  validateChannelPermissions,
} from '@/services/client/__plugin';
import { AuthCodeRequestParams } from '@/services/client/pluginComponents';
import { tokenSign } from '@/utils/jwt';

export type HttpResponseShape<T> = {
  code: number;
  data: T;
  message?: string;
};

enum ChannelPermissions {
  None,
  ViewChannels,
  ManageChannels,
}

export const wait = (duration: number) => {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      resolve(null);
    }, duration);
  });
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AuthCodeRequestParams;
    const authCodeResponse = await authCode({
      code: body.code,
    });

    const { userId, address, channelId, serverId, starkKey } =
      authCodeResponse.data;

    const { data } = await validateChannelPermissions({
      channelId,
      userId,
      group: 'channel',
      permissions: `${
        ChannelPermissions.ViewChannels + ChannelPermissions.ManageChannels
      }`,
    });
    const allowed = Number(data.allowed);

    const token = await tokenSign(userId);
    const dbTokenInfo = await getChannelInfo(channelId);

    const respBody: LoginResponse = {
      code: 200,
      data: {
        userId,
        token,
        channelId,
        address,
        serverId,
        starkKey,
        allowed: allowed > ChannelPermissions.ViewChannels,
        channelInfo: dbTokenInfo,
      },
    };

    return NextResponse.json(respBody);
  } catch (error) {
    console.info(JSON.stringify(error));

    return NextResponse.json({
      code: 500,
      data: { error },
      message: 'internal error',
    });
  }
}
