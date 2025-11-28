'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { login, LoginCredentials } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@/components/ui/primitives';

interface LoginFormProps {
    onSuccess?: () => void;
    redirectTo?: string;
}

export function LoginForm({ onSuccess, redirectTo = '/spaces' }: LoginFormProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginCredentials>();

    const onSubmit = async (data: LoginCredentials) => {
        setError(null);
        setIsLoading(true);

        try {
            await login(data);
            if (onSuccess) {
                onSuccess();
            } else {
                router.push(redirectTo);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            {error && <div className="form-error-box">{error}</div>}

            <Input
                id="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
                disabled={isLoading}
                error={errors.email?.message}
                fullWidth
                {...register('email', {
                    required: 'Email is required',
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                    },
                })}
            />

            <Input
                id="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                disabled={isLoading}
                error={errors.password?.message}
                fullWidth
                {...register('password', {
                    required: 'Password is required',
                    minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                    },
                })}
            />

            <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
            >
                Sign in
            </Button>
        </form>
    );
}
