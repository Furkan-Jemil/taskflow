import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, User, Mail, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/features/auth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function Settings() {
    const { updateProfile, isLoading } = useAuth()
    const [activeTab, setActiveTab] = useState('general')

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: '',
            email: '',
        },
    })

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            await updateProfile(data)
            alert('Profile updated successfully!')
        } catch (error) {
            // Error handled by hook
        }
    }

    return (
        <div className="container mx-auto py-10 px-4 md:px-6 animate-fade-in">
            <div className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar Navigation */}
                <div className="space-y-1">
                    {[
                        { id: 'general', icon: SettingsIcon, label: 'General' },
                        { id: 'notifications', icon: Bell, label: 'Notifications' },
                        { id: 'security', icon: Shield, label: 'Security' },
                        { id: 'appearance', icon: Palette, label: 'Appearance' },
                        { id: 'language', icon: Globe, label: 'Language' },
                    ].map((tab) => (
                        <Button
                            key={tab.id}
                            variant="ghost"
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full justify-start gap-3 transition-all ${activeTab === tab.id
                                ? 'bg-white text-[#1F2937] font-bold shadow-sm border border-slate-200'
                                : 'text-muted-foreground hover:bg-muted'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </Button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="md:col-span-2 space-y-6">
                    {activeTab === 'general' ? (
                        <div className="p-8 bg-card border rounded-2xl shadow-sm space-y-8 text-foreground">
                            <div>
                                <h3 className="text-xl font-bold mb-1">General Settings</h3>
                                <p className="text-sm text-muted-foreground">Update your personal information and contact details.</p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <User size={14} className="text-muted-foreground" />
                                            Full Name
                                        </label>
                                        <Input
                                            {...register('name')}
                                            error={errors.name?.message}
                                            placeholder="Demo User"
                                            className="placeholder:text-slate-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <Mail size={14} className="text-muted-foreground" />
                                            Email Address
                                        </label>
                                        <Input
                                            {...register('email')}
                                            error={errors.email?.message}
                                            placeholder="demo@example.com"
                                            className="placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t flex justify-end">
                                    <Button type="submit" isLoading={isLoading} className="gap-2">
                                        <Save size={16} />
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="p-12 bg-muted/30 border-2 border-dashed rounded-2xl text-center">
                            <h3 className="text-lg font-bold mb-2 capitalize">{activeTab} Settings</h3>
                            <p className="text-sm text-[#9CA3AF] italic">
                                This section is currently under development.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
