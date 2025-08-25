import { NextRequest, NextResponse } from 'next/server'

// 支持的语言列表
const locales = ['en', 'zh', 'es', 'fr', 'ru', 'hi', 'ko']
const defaultLocale = 'en'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // 检查路径是否已经包含语言前缀
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // 如果是根路径，重定向到默认语言（保留查询参数）
  if (pathname === '/') {
    const url = new URL(`/${defaultLocale}`, request.url)
    // 保留原始查询参数
    url.search = request.nextUrl.search
    return NextResponse.redirect(url)
  }

  // 如果路径缺少语言前缀且不是静态资源，重定向到默认语言
  if (pathnameIsMissingLocale && !pathname.includes('.')) {
    const url = new URL(`/${defaultLocale}${pathname}`, request.url)
    url.search = request.nextUrl.search
    return NextResponse.redirect(url)
  }

  // 对于已经有语言前缀的路径，正常处理
  return NextResponse.next()
}

export const config = {
  // 匹配除了API路由、静态文件等之外的所有路径
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (assets in public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|LOGO\\.png|manifest\\.json|sitemap\\.xml).*)',
  ],
}