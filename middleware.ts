import { auth } from "@/auth";

/**
 * 인증 가드 미들웨어.
 *
 * - 미인증 사용자가 보호된 경로(/, /pickups, /allowance ...)에 접근하면
 *   로그인 페이지(/login)로 보낸다.
 * - 이미 로그인한 사용자가 /login 에 접근하면 대시보드(/)로 보낸다.
 *
 * 공개 경로: /login, /api/auth/*, /health, 정적 에셋(matcher에서 제외).
 */

const PUBLIC_PATHS = ["/login"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // NextAuth 콜백 및 헬스체크는 통과
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/health")) {
    return;
  }

  const isPublicPath = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  // 로그인 상태에서 로그인 페이지 접근 → 대시보드로
  if (isLoggedIn && isPublicPath) {
    return Response.redirect(new URL("/", req.nextUrl));
  }

  // 미인증 상태에서 보호된 페이지 접근 → 로그인으로
  if (!isLoggedIn && !isPublicPath) {
    const loginUrl = new URL("/login", req.nextUrl);
    // 로그인 후 원래 가려던 곳으로 돌아갈 수 있도록 전달
    if (pathname !== "/") {
      loginUrl.searchParams.set("callbackUrl", `${pathname}${req.nextUrl.search}`);
    }
    return Response.redirect(loginUrl);
  }

  return;
});

export const config = {
  // _next 내부 자원, 정적 파일(확장자 있는 요청)은 미들웨어 제외
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
