/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_ENV: process.env.NODE_ENV || 'development',
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8080',
                pathname: '/private/produtos/imagem/**',
            },
        ],
    },
};

export default nextConfig;
