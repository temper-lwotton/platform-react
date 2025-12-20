'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUser, updateUser } from '@/lib/users';
import { getCurrentUserId } from '@/lib/auth';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import { Icon } from '@/components/ui/Icon';
import Link from 'next/link';

export default function EditProfilePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const currentUserId = getCurrentUserId();
    const queryClient = useQueryClient();

    // Redirect if not own profile
    useEffect(() => {
        if (currentUserId && currentUserId !== id) {
            router.push(`/users/${id}`);
        }
    }, [currentUserId, id, router]);

    const { data: user, isLoading } = useQuery({
        queryKey: ['user', id],
        queryFn: () => getUser(id),
        enabled: !!id && currentUserId === id,
    });

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        bio: '',
        location: '',
        website: '',
        avatar: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                bio: user.bio || '',
                location: user.location || '',
                website: user.website || '',
                avatar: user.avatar || '',
            });
        }
    }, [user]);

    const updateMutation = useMutation({
        mutationFn: (data: Partial<typeof formData>) => updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', id] });
            router.push(`/users/${id}`);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    if (isLoading) {
        return (
            <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <p>Loading...</p>
            </main>
        );
    }

    if (!user || currentUserId !== id) {
        return (
            <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <p>Access denied. You can only edit your own profile.</p>
            </main>
        );
    }

    return (
        <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link href={`/users/${id}`}>
                    <Button variant="ghost" size="sm">
                        <Icon icon="arrowLeft" size={16} />
                        Back to Profile
                    </Button>
                </Link>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Edit Profile
            </h1>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
                Update your profile information
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label htmlFor="fullName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Full Name
                    </label>
                    <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                    />
                </div>

                <div>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Email
                    </label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                    />
                </div>

                <div>
                    <label htmlFor="bio" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontFamily: 'inherit',
                            fontSize: 'inherit',
                        }}
                    />
                </div>

                <div>
                    <label htmlFor="location" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Location
                    </label>
                    <Input
                        id="location"
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="City, Country"
                    />
                </div>

                <div>
                    <label htmlFor="website" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Website
                    </label>
                    <Input
                        id="website"
                        name="website"
                        type="url"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://yourwebsite.com"
                    />
                </div>

                <div>
                    <label htmlFor="avatar" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Avatar URL
                    </label>
                    <Input
                        id="avatar"
                        name="avatar"
                        type="url"
                        value={formData.avatar}
                        onChange={handleChange}
                        placeholder="https://example.com/avatar.jpg"
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <Link href={`/users/${id}`}>
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>

                {updateMutation.isError && (
                    <p style={{ color: 'red', marginTop: '1rem' }}>
                        Error updating profile. Please try again.
                    </p>
                )}
            </form>
        </main>
    );
}
