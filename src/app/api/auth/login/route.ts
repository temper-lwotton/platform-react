import { NextRequest, NextResponse } from 'next/server';

interface LoginRequest {
    email: string;
    password: string;
}

export async function POST(request: NextRequest) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

    let body: LoginRequest;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
        );
    }

    if (!body.email || !body.password) {
        return NextResponse.json(
            { error: 'Email and password are required' },
            { status: 400 }
        );
    }

    // Updated endpoint to match Symfony API
    const url = `${apiBaseUrl}/api/auth/user/login`;

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: body.email,
                password: body.password,
            }),
        });

        if (!res.ok) {
            const text = await res.text();
            let errorMessage = 'Authentication failed';

            try {
                const errorData = JSON.parse(text);
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch {
                if (text) errorMessage = text;
            }

            return NextResponse.json(
                { error: errorMessage },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('[Auth] Fetch error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Login failed' },
            { status: 500 }
        );
    }
}
