import { LoginForm } from '@/components/ui/LoginForm';

export default function LoginPage() {
    return (
        <main className="login-page">
            <div className="login-container">
                <h1 className="login-title">Sign in to Spaces</h1>
                <p className="login-subtitle">Enter your credentials to continue</p>
                <LoginForm />
            </div>
        </main>
    );
}
