import { TokenInfo } from '@/constants';
import { ChannelInfo } from '@/db';

export type HttpResponseShape<T> = {
  code: number;
  data: T;
  message?: string;
};

export type LoginRequest = {
  code: string;
};

export type LoginResponse = HttpResponseShape<{
  userId: string;
  token: string;
  channelId: string;
  address: string;
  serverId: string;
  starkKey: string;
  allowed: boolean;
  channelInfo: ChannelInfo | undefined;
}>;

export type SetupRequest = {
  channelId: string;
  tokensInfo: {
    tokenIn?: TokenInfo;
    tokenOut?: TokenInfo;
  };
};

export type SetupResponse = HttpResponseShape<{
  success: boolean;
}>;
