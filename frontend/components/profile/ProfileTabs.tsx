import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import { useSearchParams } from "next/navigation";
import {useEffect, useState } from "react";
import {Card} from "@/components/ui/card";
import ProfileUpdateForm from "@/components/ProfileUpdateForm";
import PasswordChangeForm from "@/components/PasswordChangeForm";

export const ProfileTabs: React.FC = () => {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (tabParam === "password") {
      setActiveTab("password");
    } else {
      setActiveTab("profile");
    }
  }, [tabParam]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Card>
          <ProfileUpdateForm />
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <PasswordChangeForm />
        </Card>
      </TabsContent>
    </Tabs>
  );
};