'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { login, LoginCredentials } from '@/lib/auth';
import { useRouter } from 'next/navigation';

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

            <div className="form-field">
                <label htmlFor="email" className="form-label">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    disabled={isLoading}
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                        },
                    })}
                />
                {errors.email && (
                    <span className="form-error">{errors.email.message}</span>
                )}
            </div>

            <div className="form-field">
                <label htmlFor="password" className="form-label">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    className="form-input"
                    placeholder="Enter your password"
                    disabled={isLoading}
                    {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                        },
                    })}
                />
                {errors.password && (
                    <span className="form-error">{errors.password.message}</span>
                )}
            </div>

            <button
                type="submit"
                className="form-button"
                disabled={isLoading}
            >
                {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
        </form>
    );
}
