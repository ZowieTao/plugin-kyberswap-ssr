import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

import { showToast } from '@/components/dialogs/toast/toast';
import { error, info } from '@/utils/core/log';

import { applyAuthTokenInterceptor } from './interceptors/token';

export type Param = {
  [k: string]: any;
};

export type BusinessInfo = {
  code: number;
  message: string;
  title: string;
  ok: string;
};

export type ComposedResponse<T> = AxiosResponse<T> & BusinessInfo;

export type SupportMethods =
  | 'get'
  | 'head'
  | 'options'
  | 'delete'
  | 'post'
  | 'put'
  | 'patch';

const supportMethods: SupportMethods[] = [
  'get',
  'head',
  'options',
  'delete',
  'post',
  'put',
  'patch',
];

export type ClientFuncWithPathParam = <T = any, R = ComposedResponse<T>>(
  url: string,
  pathParam?: Param,
  param?: Param,
) => Promise<R>;

export type Client = {
  get: ClientFuncWithPathParam;
  head: ClientFuncWithPathParam;
  options: ClientFuncWithPathParam;
  delete: ClientFuncWithPathParam;
  post: ClientFuncWithPathParam;
  put: ClientFuncWithPathParam;
  patch: ClientFuncWithPathParam;
};

const instance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
});

applyAuthTokenInterceptor(instance);

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
  info(' http <=', {
    url,
    param: JSON.stringify({
      pathParam,
      param,
    }),
  });

  try {
    switch (method) {
      case 'delete': {
        response = await instance.delete(parsedPath, {
          data: { ...restParam, ...param },
        });
        break;
      }
      case 'get':
      case 'options':
      case 'head': {
        response = await instance[method](parsedPath, {
          data: { ...restParam, ...param },
        });
        break;
      }

      case 'post':
      case 'put':
      case 'patch': {
        response = await instance[method](parsedPath, {
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
      error(' http error =>', {
        url,
        err,
      });
      throw err;
    }

    error(' http error =>', {
      url,
      err,
      errResponse,
    });
    throw err;
  }

  info(' http =>', {
    url,
    response: JSON.stringify(response),
  });

  return response;
}

const client = {} as Client;

supportMethods.forEach((method) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  client[method] = (url: string, pathParam: Param, bodyParam: Param) => {
    return withTransformData(url, pathParam, bodyParam, method);
  };
});

export default client;
