'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Mail, Shield } from 'lucide-react';

const settingsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword || data.confirmPassword) {
    if (!data.currentPassword || data.currentPassword.length < 6) {
      return false;
    }
    if (!data.newPassword || data.newPassword.length < 6) {
      return false;
    }
    if (data.newPassword !== data.confirmPassword) {
      return false;
    }
  }
  return true;
}, {
  message: "Password requirements not met",
  path: ["newPassword"],
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true);

    try {
      const updateData: any = {
        name: data.name,
        email: data.email,
      };

      if (data.newPassword && data.currentPassword) {
        updateData.currentPassword = data.currentPassword;
        updateData.newPassword = data.newPassword;
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      
      // Reset password fields
      reset({
        ...data,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const userInitials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.email?.[0].toUpperCase() || 'U';

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Overview
          </CardTitle>
          <CardDescription>
            Your current profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image || undefined} alt={user.name || ''} />
              <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{user.name || 'User'}</h3>
                <Badge variant={user.role === 'ADMIN' ? 'destructive' : user.role === 'AGENT' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {user.email}
              </div>
              {user.role === 'ADMIN' && (
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <Shield className="h-4 w-4" />
                  Administrator privileges
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Update your personal information and password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Personal Information</h4>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Password Change */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Change Password</h4>
                <p className="text-sm text-muted-foreground">
                  Leave blank if you don't want to change your password
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...register('currentPassword')}
                    placeholder="Enter current password"
                  />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...register('newPassword')}
                      placeholder="Enter new password"
                    />
                    {newPassword && newPassword.length < 6 && (
                      <p className="text-sm text-muted-foreground">
                        Password must be at least 6 characters
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register('confirmPassword')}
                      placeholder="Confirm new password"
                    />
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-sm text-destructive">
                        Passwords do not match
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading || !isDirty}
                className="w-full md:w-auto"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}