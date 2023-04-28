import axios, { AxiosError, AxiosInstance } from 'axios';

import { showToast } from '@/components/dialogs/toast/toast';
import {
  BusinessInfo,
  Client,
  ComposedResponse,
  Param,
  SupportMethods,
} from '@/net/http/client';
import { error, info } from '@/utils/core/log';

const serverInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
  headers: {
    'oc-plugin-appid': process.env.NEXT_PUBLIC_PLUGIN_ID,
    'oc-plugin-secret': process.env.APP_SECRET,
  },
});

function replacePathParams(path: string, param: Param) {
  const restParam = { ...param };
  let parsedPath = path;

  Object.entries(param).forEach(([k, v]) => {
    if (parsedPath?.includes(`:${k}`)) {
      Reflect.deleteProperty(restParam, k);
    }
    parsedPath = parsedPath.replace(`:${k}`, encodeURIComponent(v));
  });

  return {
    parsedPath,
    restParam,
  };
}

function dealWithBusinessErrorInfo(errorCode: number, errorMessage: string) {
  if ([2000].includes(errorCode)) {
    showToast(errorMessage);
  }

  switch (errorCode) {
    // todo
    default:
      break;
  }
}

async function withTransformData<T = any>(
  url: string,
  pathParam?: Param,
  param?: Param,
  method = 'get',
): Promise<ComposedResponse<T>> {
  const { parsedPath, restParam } = replacePathParams(url, pathParam || {});

  let response = {} as ComposedResponse<T>;
  info('server side http <=', {
    url,
    param: JSON.stringify({
      pathParam,
      param,
    }),
  });

  try {
    switch (method) {
      case 'delete': {
        response = await serverInstance.delete(parsedPath, {
          data: { ...restParam, ...param },
        });
        break;
      }
      case 'get':
      case 'options':
      case 'head': {
        response = await serverInstance[method](parsedPath, {
          data: { ...restParam, ...param },
        });
        break;
      }

      case 'post':
      case 'put':
      case 'patch': {
        response = await serverInstance[method](parsedPath, {
          ...restParam,
          ...(param || {}),
        });
        break;
      }
      default:
        break;
    }
  } catch (err) {
    const errResponse = (err as AxiosError).response;

    if (errResponse?.data) {
      // deal with logic that with a none 2XX http status but with code
      const { code, message } = errResponse.data as BusinessInfo;
      response.code = code;
      response.message = message;
      dealWithBusinessErrorInfo(code, message);
    } else {
      // deal with logic with node success status, and without code,
      // maybe show alert info later
      error('server side http error =>', {
        url,
        err,
      });
      throw err;
    }

    error('server side http error =>', {
      url,
      err,
      errResponse,
    });
    throw err;
  }

  info('server side http =>', {
    url,
    response: JSON.stringify(response),
  });

  return response;
}

const ServerClient = {} as Client;

const supportMethods: SupportMethods[] = [
  'get',
  'head',
  'options',
  'delete',
  'post',
  'put',
  'patch',
];

supportMethods.forEach((method) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ServerClient[method] = (url: string, pathParam: Param, bodyParam: Param) => {
    return withTransformData(url, pathParam, bodyParam, method);
  };
});

export default ServerClient;
