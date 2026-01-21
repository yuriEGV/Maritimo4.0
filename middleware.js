export default function middleware(req) {
    const origin = req.headers.get("origin") || "*";

    // Handle preflight requests
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, x-tenant-id",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Max-Age": "86400",
            },
        });
    }

    // For other requests, the headers will be set in vercel.json or server.js
}

export const config = {
    matcher: "/api/:path*",
};
