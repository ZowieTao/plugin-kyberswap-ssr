import { createHash } from 'crypto';

export function getHash(contentStr: string) {
  const hash = createHash('sha256');
  if (!hash) {
    return contentStr;
  }
  hash.update(contentStr);

  return hash.digest('hex');
}
