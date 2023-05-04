import { jwtVerify, SignJWT } from 'jose';

const Issuer = 'Opencord Plugin Kyberswap';
const Secret = new TextEncoder().encode(process.env.JWT_KEY);

export async function tokenSign(userId: string) {
  const alg = 'HS256';

  const token = await new SignJWT({})
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(Issuer)
    .setAudience(userId)
    .setExpirationTime('30d')
    .sign(Secret);

  return token;
}

export async function tokenVerify(token: string) {
  const result = await jwtVerify(token, Secret);

  return result;
}
