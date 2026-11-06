import {NextResponse} from 'next/server';
import {ADMIN_COOKIE,adminAuthConfigured,createAdminSession,passwordMatches} from '../../../../lib/admin-auth';

export async function POST(request){
  if(!adminAuthConfigured())return NextResponse.json({error:'Admin login is not configured. Add ADMIN_PASSWORD and a 32-character ADMIN_SESSION_SECRET.'},{status:503});
  const body=await request.json().catch(()=>({}));
  if(!passwordMatches(body.password))return NextResponse.json({error:'That password did not match.'},{status:401});
  const session=createAdminSession();
  const response=NextResponse.json({ok:true});
  response.cookies.set(ADMIN_COOKIE,session.value,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:session.maxAge});
  return response;
}
