import { NextRequest, NextResponse } from 'next/server';

import { setChannelInfo } from '@/db';
import { SetupRequest } from '@/net/http/gatewayComponent';
import { tokenVerify } from '@/utils/jwt';

export type HttpResponseShape<T> = {
  code: number;
  data: T;
  message?: string;
};

export async function POST(req: NextRequest) {
  try {
    const json: SetupRequest = await req.json();
    const { channelId, tokensInfo } = json;
    const { tokenIn, tokenOut } = tokensInfo;

    const bearerToken = req.headers.get('authorization');
    if (!bearerToken) {
      return NextResponse.json({
        code: 500,
        data: { error: 'token empty' },
        message: 'internal error',
      });
    }
    const token = bearerToken.split(' ')[1];
    console.log('info', json, bearerToken);

    try {
      await tokenVerify(token);
    } catch (error) {
      const respBody = {
        code: 6001,
        data: {
          success: 'token invalid',
        },
      };

      return NextResponse.json(respBody);
    }

    try {
      setChannelInfo({ channelId, from: tokenIn, to: tokenOut });
    } catch (error) {
      const respBody = {
        code: 6002,
        data: {
          success: 'db error',
        },
      };

      return NextResponse.json(respBody);
    }

    const respBody = {
      code: 200,
      data: {
        success: true,
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
