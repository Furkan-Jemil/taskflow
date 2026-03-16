import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
    const { login, loginWithGoogle, isLoading, error, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    // Redirect if already authenticated
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/workspaces')
        }
    }, [isAuthenticated, navigate])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await login(data)
        } catch (err) {
            // Error is handled in useAuth/authStore and displayed in UI
            console.error('Login error:', err)
        }
    }

    return (
        <div className="w-full max-w-md p-8 space-y-8 bg-card backdrop-blur-xl border border-border rounded-2xl shadow-2xl ring-1 ring-white/5 animate-in fade-in zoom-in-95 duration-500 relative">
            {/* Form Glow */}
            <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-2xl -z-10" />
            <div className="text-center relative">
                <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                    Welcome back
                </h2>
                <p className="text-muted-foreground text-sm font-medium mt-2">
                    Enter your credentials to access your workspaces
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                    <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md animate-fade-in">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Email
                    </label>
                    <Input
                        type="email"
                        placeholder="name@example.com"
                        {...register('email')}
                        error={errors.email?.message}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Password
                    </label>
                    <Input
                        type="password"
                        placeholder="••••••••"
                        {...register('password')}
                        error={errors.password?.message}
                    />
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading}>
                    Sign In
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground font-medium">
                        Or continue with
                    </span>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                className="w-full relative overflow-hidden group hover:border-primary/50 transition-colors"
                onClick={loginWithGoogle}
                disabled={isLoading}
            >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                Google
            </Button>



            <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link
                    to="/register"
                    className="font-semibold text-primary hover:underline transition-all"
                >
                    Create one for free
                </Link>
            </div>
        </div>
    )
}
