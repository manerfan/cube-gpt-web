import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['zh', 'en'],
  defaultLocale: 'zh'
});

// this tells the middleware to run only on requests to our app pages
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};