type TokenInfo = {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  logoURI: string;
  chainId: number;
};

export type ChannelInfo = {
  channelId: string;
  from?: TokenInfo;
  to?: TokenInfo;
};

const DB: Record<string, unknown> = {};

function get<T>(key: string): Promise<T> {
  return Promise.resolve(DB[key] as T);
}

function set<T>(key: string, value: T) {
  DB[key] = value;

  return Promise.resolve();
}

export async function getChannelInfo(channelId: string) {
  return await get<ChannelInfo | undefined>(`channel_${channelId}`);
}

export async function setChannelInfo(val: ChannelInfo) {
  return await set<ChannelInfo>(`channel_${val.channelId}`, val);
}

setChannelInfo({
  channelId: 'fakeChannelID',
  // to: {
  //   address: '0x7a7197e820567a914371fbd98e9ac334e13e37a1',
  //   name: 'Artist Xchange Coin ',
  //   symbol: 'Artist',
  //   decimals: 18,
  //   chainId: 137,
  //   logoURI:
  //     'https://assets.coingecko.com/coins/images/22062/thumb/alethea-logo-transparent-colored.png?1642748848',
  // },
});
