import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
    const { register: registerUser, isLoading, error, isAuthenticated } = useAuth()
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
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    })

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            await registerUser(data)
        } catch (err) {
            // Error is handled in useAuth/authStore and displayed in UI
            console.error('Registration error:', err)
        }
    }

    return (
        <div className="w-full max-w-md p-8 space-y-8 bg-card border rounded-xl shadow-lg ring-1 ring-black/[0.05] animate-fade-in">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-2">
                    <UserPlus size={24} />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
                <p className="text-muted-foreground text-sm">
                    Join TaskFlow and start managing your projects efficiently
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                    <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md animate-fade-in">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                        Full Name
                    </label>
                    <Input
                        type="text"
                        placeholder="John Doe"
                        {...register('name')}
                        error={errors.name?.message}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
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
                    <label className="text-sm font-medium leading-none">
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
                    Create Account
                </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                    to="/login"
                    className="font-semibold text-primary hover:underline transition-all"
                >
                    Sign in here
                </Link>
            </div>
        </div>
    )
}
