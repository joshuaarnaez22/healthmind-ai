import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse'],
};

export default nextConfig;

// Sentry disabled for now — uncomment when ready to configure DSN/org/project
// import { withSentryConfig } from '@sentry/nextjs';
// export default withSentryConfig(nextConfig, {
//   org: process.env.SENTRY_ORG,
//   project: process.env.SENTRY_PROJECT,
//   silent: true,
//   widenClientFileUpload: true,
//   disableLogger: true,
//   automaticVercelMonitors: true,
// });
