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
