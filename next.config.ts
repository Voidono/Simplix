import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

module.exports = {
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors
  },
};