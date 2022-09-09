import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth == null) {
    return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
  }
  const authTokenSplit = auth.split(' ');
  if (authTokenSplit.length < 1) {
    return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
  }
  const rawToken = authTokenSplit[1];
  if (rawToken == null) {
    return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
  }
  const base64Split = rawToken.split('.');
  if (base64Split.length < 1) {
    return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
  }
  const base64Url = base64Split[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payloadinit = atob(base64);
  const jwt = JSON.parse(payloadinit) as AzureAdJwt;
  if (jwt?.aud == null || jwt?.iss == null) {
    return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
  }
  const validAudiencesSpaceSeperatedString = process.env.TEMPUS_VALID_AUDIENCES;
  if (validAudiencesSpaceSeperatedString == null) {
    return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
  }
  const validAudiencesArray = validAudiencesSpaceSeperatedString.split(' ');
  if (
    validAudiencesArray?.length != null &&
    !(validAudiencesArray.length > 0)
  ) {
    return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
  }
  if (!validAudiencesArray.includes(jwt.aud)) {
    return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
  }
  const validIssuersSpaceSeperatedString = process.env.TEMPUS_VALID_ISSUERS;
  if (validIssuersSpaceSeperatedString == null) {
    return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
  }
  const validIssuersArray = validIssuersSpaceSeperatedString.split(' ');
  if (validIssuersArray?.length != null && !(validIssuersArray.length > 0)) {
    return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
  }
  if (!validIssuersArray.includes(jwt.iss)) {
    return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/randomNumber'],
};

export interface AzureAdJwt {
  aud: string;
  iss: string;
  iat: number;
  nbf: number;
  exp: number;
  acct: number;
  aio: string;
  azp: string;
  azpacr: string;
  email: string;
  family_name: string;
  given_name: string;
  ipaddr: string;
  name: string;
  oid: string;
  preferred_username: string;
  rh: string;
  scp: string;
  sub: string;
  tid: string;
  uti: string;
  ver: string;
}
