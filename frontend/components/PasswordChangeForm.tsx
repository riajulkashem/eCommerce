import React, { useState } from 'react';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { protectedPostFetch } from "@/lib/utils";
import {PasswordFormSkeleton} from "@/components/Skeletons/PasswordChangeFormSkeleton";
import {PasswordForm} from "@/lib/types";
import showToastErrors from "@/components/ToastErrors";


const PasswordChangeForm: React.FC = () => {
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<Partial<Record<keyof PasswordForm, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (passwordErrors[name as keyof PasswordForm]) {
      setPasswordErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof PasswordForm];
        return newErrors;
      });
    }
  };

  const validatePasswordForm = (): boolean => {
    const newErrors: Partial<Record<keyof PasswordForm, string>> = {};

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    setIsLoading(true);
    try {
      const response = await protectedPostFetch(
        'http://127.0.0.1:8000/api/v1/auth/password-change/',
        {
          old_password: passwordForm.currentPassword,
          new_password: passwordForm.newPassword,
        }
      );

      if (response.ok) {
        toast.success("Password changed", {
          description: "Your password has been successfully changed.",
        });
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        console.log(response);
        const errorData = await response.json();
        showToastErrors(errorData);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error instanceof Error ? error.message : "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handlePasswordSubmit}>
      {isLoading ? (
        <PasswordFormSkeleton />
      ) : (
        <>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password to keep your account secure.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 mt-10">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
                disabled={isLoading}
              />
              {passwordErrors.currentPassword && (
                <p className="text-sm text-destructive">{passwordErrors.currentPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
                disabled={isLoading}
              />
              {passwordErrors.newPassword && (
                <p className="text-sm text-destructive">{passwordErrors.newPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
                disabled={isLoading}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-destructive">{passwordErrors.confirmPassword}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="mt-5">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Changing..." : "Change Password"}
            </Button>
          </CardFooter>
        </>
      )}
    </form>
  );
};

export default PasswordChangeForm;