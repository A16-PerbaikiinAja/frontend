'use client';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  Lock,
  Mail,
  MapPin,
  Package,
  Phone,
  Save,
  Star,
  User as UserIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/auth-provider';
import { NormalUser, Technician, User } from '@/types/auth';

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    promotions: true,
    reviews: true,
    newsletter: false,
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        loadProfile();
      }
    }
  }, [user, authLoading, router]);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileChange = (field: keyof Technician | keyof NormalUser, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handlePasswordChange = (field: keyof typeof passwordForm, value: string) => {
    setPasswordForm({ ...passwordForm, [field]: value });
    if (passwordErrors[field]) {
      setPasswordErrors({ ...passwordErrors, [field]: '' });
    }
  };

  const validatePasswordForm = () => {
    const errors: Record<string, string> = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/profile`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        method: 'PUT',
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
      toast.success('Profile updated', {
        description: 'Your profile has been successfully updated.',
      });
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error('Failed to update profile', {
        description: 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/profile`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        method: 'PUT',
        body: JSON.stringify({
          password: passwordForm.newPassword,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
      toast.success('Password updated', {
        description: 'Your password has been successfully changed.',
      });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      console.error('Failed to update password:', err);
      toast.error('Failed to update password', {
        description: 'Please check your current password and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-4 w-1/4" />
            </CardFooter>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center gap-3">
        <UserIcon className="text-primary h-6 w-6" />
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
            <span className="sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
            <span className="sm:hidden">Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-4 w-1/4" />
                </CardFooter>
              </Card>
            </div>
          ) : error ? (
            <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center">
                  <AlertCircle className="mb-2 h-10 w-10 text-red-500" />
                  <h3 className="mb-1 text-lg font-medium">Error Loading Profile</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{error}</p>
                  <Button onClick={loadProfile}>Try Again</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden">
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    {profile?.role !== 'ADMIN' ? (
                      <CardDescription>Update your personal information</CardDescription>
                    ) : (
                      <CardDescription>Admins have no extra profile fields</CardDescription>
                    )}
                  </CardHeader>
                  {profile?.role !== 'ADMIN' && (
                    <CardContent className="space-y-4">
                      <div className="flex flex-col items-center justify-center sm:flex-row sm:items-start sm:justify-start sm:gap-6">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src="/placeholder.svg" alt={profile?.fullName || ''} />
                          <AvatarFallback>{profile?.fullName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="mt-4 flex flex-col items-center sm:mt-0 sm:items-start">
                          <h3 className="text-lg font-medium">{profile?.fullName}</h3>
                          <p className="text-muted-foreground text-sm">{profile?.email}</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Change Avatar
                          </Button>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="flex items-center gap-2">
                            <UserIcon className="h-3.5 w-3.5" />
                            Full Name
                          </Label>
                          <Input
                            id="fullName"
                            value={profile?.fullName || ''}
                            onChange={(e) => handleProfileChange('fullName', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5" />
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            value={profile?.email || ''}
                            onChange={(e) => handleProfileChange('email', e.target.value)}
                            disabled
                          />
                          <p className="text-muted-foreground text-xs">
                            Your email address cannot be changed
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5" />
                            Phone Number
                          </Label>
                          <Input
                            id="phoneNumber"
                            value={profile?.phoneNumber || ''}
                            onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address" className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5" />
                            Address
                          </Label>
                          <Textarea
                            id="address"
                            value={profile?.address || ''}
                            onChange={(e) => handleProfileChange('address', e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                    </CardContent>
                  )}
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleSaveProfile} disabled={isSubmitting} className="gap-2">
                      <Save className="h-4 w-4" />
                      <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              {profile?.role === 'TECHNICIAN' && (
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Technician Statistics</CardTitle>
                      <CardDescription>Your activity on PerbaikiinAja</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                        <div className="flex flex-col items-center rounded-lg border p-4">
                          <Package className="text-primary mb-2 h-8 w-8" />
                          <span className="text-2xl font-bold">{profile?.experience || 0}</span>
                          <span className="text-muted-foreground text-sm">Experience</span>
                        </div>
                        <div className="flex flex-col items-center rounded-lg border p-4">
                          <CheckCircle className="mb-2 h-8 w-8 text-green-500" />
                          <span className="text-2xl font-bold">
                            {profile?.totalJobsCompleted || 0}
                          </span>
                          <span className="text-muted-foreground text-sm">Completed Orders</span>
                        </div>
                        <div className="flex flex-col items-center rounded-lg border p-4">
                          <Star className="mb-2 h-8 w-8 text-yellow-500" />
                          <span className="text-2xl font-bold">{profile?.totalEarnings || 0}</span>
                          <span className="text-muted-foreground text-sm">Earnings</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5" />
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    />
                    {passwordErrors.currentPassword && (
                      <p className="text-destructive text-sm">{passwordErrors.currentPassword}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5" />
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-destructive text-sm">{passwordErrors.newPassword}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5" />
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-destructive text-sm">{passwordErrors.confirmPassword}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleChangePassword} disabled={isSubmitting} className="gap-2">
                    <Save className="h-4 w-4" />
                    <span>{isSubmitting ? 'Updating...' : 'Update Password'}</span>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
