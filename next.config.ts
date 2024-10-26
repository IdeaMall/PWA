import setPWA from 'next-pwa';
// @ts-expect-error no official types
import withLess from 'next-with-less';

const { NODE_ENV, CI } = process.env,
  withPWA = setPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: NODE_ENV === 'development',
  });

export default withPWA(
  withLess({
    output: CI ? 'standalone' : undefined,
  }),
);
