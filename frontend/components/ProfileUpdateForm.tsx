import React, { useEffect, useState } from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/utilities/types";
import { toast } from "sonner";
import { protectedPutFetch } from "@/utilities/fetchUtils";
import { getToken } from "@/utilities/cookie-utils";
import {ProfileFormSkeleton} from "@/components/Skeletons/ProfileUpdateFormSkeleton";
import showToastErrors from "@/components/ToastErrors";

const normalizeValue = (value: string | null | undefined): string => value ?? '';

const ProfileUpdateForm: React.FC = () => {
  const [profileForm, setProfileForm] = useState<UserProfile>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [profileErrors, setProfileErrors] = useState<Partial<Record<keyof UserProfile, string>>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const accessToken = getToken("access");
        const response = await fetch('http://127.0.0.1:8000/api/v1/user/profile/', {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          credentials: 'same-origin',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfileForm({
          first_name: normalizeValue(data.first_name),
          last_name: normalizeValue(data.last_name),
          email: normalizeValue(data.email),
          phone: normalizeValue(data.phone),
          address: normalizeValue(data.address)
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validateProfileForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserProfile, string>> = {};
    if (!profileForm.first_name.trim()) newErrors.first_name = "First name is required";
    if (!profileForm.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!profileForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      newErrors.email = "Email is invalid";
    }
    if (profileForm.phone && !/^\+?[0-9\s\-()]+$/.test(profileForm.phone)) {
      newErrors.phone = "Phone number is invalid";
    }
    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    try {
      const response = await protectedPutFetch(
        'http://127.0.0.1:8000/api/v1/user/profile/',
        profileForm
      );
      console.log(response);
      if (response.ok) {
        toast.success("Profile updated successfully");
      } else {
        const errorData = await response.json();
        showToastErrors(errorData);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <form onSubmit={handleProfileSubmit}>
      {isLoading ? (
        <ProfileFormSkeleton />
      ) : (
        <>
          <CardHeader className='mb-5'>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={profileForm.first_name}
                  onChange={handleProfileChange}
                  required
                />
                {profileErrors.first_name && (
                  <p className="text-sm text-destructive">{profileErrors.first_name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={profileForm.last_name}
                  onChange={handleProfileChange}
                  required
                />
                {profileErrors.last_name && (
                  <p className="text-sm text-destructive">{profileErrors.last_name}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                />
                {profileErrors.phone && (
                  <p className="text-sm text-destructive">{profileErrors.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  required
                />
                {profileErrors.email && (
                  <p className="text-sm text-destructive">{profileErrors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={profileForm.address}
                onChange={handleProfileChange}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="mt-5">
            <Button type="submit" disabled={isLoading}>
              Save Changes
            </Button>
          </CardFooter>
        </>
      )}
    </form>
  );
};

export default ProfileUpdateForm;