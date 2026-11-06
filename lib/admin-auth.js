import {createHmac,timingSafeEqual} from 'node:crypto';
import {cookies} from 'next/headers';

export const ADMIN_COOKIE='northline_admin_session';
const lifetime=60*60*24*7;

function secret(){return process.env.ADMIN_SESSION_SECRET||''}
function sign(payload){return createHmac('sha256',secret()).update(payload).digest('base64url')}

export function adminAuthConfigured(){return Boolean(process.env.ADMIN_PASSWORD&&secret().length>=32)}

export function passwordMatches(candidate){
  const expected=process.env.ADMIN_PASSWORD||'';
  const actual=String(candidate||'');
  if(!expected)return false;
  const actualBytes=Buffer.from(actual);
  const expectedBytes=Buffer.from(expected);
  return actualBytes.length===expectedBytes.length&&timingSafeEqual(actualBytes,expectedBytes);
}

export function createAdminSession(){
  const payload=String(Date.now()+lifetime*1000);
  return {value:`${payload}.${sign(payload)}`,maxAge:lifetime};
}

export async function isAdminRequest(){
  if(!adminAuthConfigured())return false;
  const jar=await cookies();
  const token=jar.get(ADMIN_COOKIE)?.value||'';
  const [expires,signature,...rest]=token.split('.');
  if(!expires||!signature||rest.length||Number(expires)<Date.now())return false;
  const expected=sign(expires);
  const actualBuffer=Buffer.from(signature);
  const expectedBuffer=Buffer.from(expected);
  return actualBuffer.length===expectedBuffer.length&&timingSafeEqual(actualBuffer,expectedBuffer);
}
