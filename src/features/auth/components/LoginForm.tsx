import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
    const { login, isLoading, error, isAuthenticated } = useAuth()
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
        <div className="w-full max-w-md p-8 space-y-8 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl ring-1 ring-white/5 animate-in fade-in zoom-in-95 duration-500 relative">
            {/* Form Glow */}
            <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-2xl -z-10" />
            <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-2 shadow-inner">
                    <LogIn size={28} />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white">Welcome back</h1>
                <p className="text-slate-400 text-sm font-medium">
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
