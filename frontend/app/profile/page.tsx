"use client"

import type React from "react"
import {useState, useEffect} from "react"
import {useSearchParams} from "next/navigation"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {ArrowLeft} from "lucide-react"
import NavBar from "@/components/NavBar";
import ProfileUpdateForm from "@/components/ProfileUpdateForm";
import PasswordChangeForm from "@/components/PasswordChangeForm";

export default function ProfilePage() {
    const searchParams = useSearchParams()
    const tabParam = searchParams.get("tab")

    // Set active tab based on URL parameter
    const [activeTab, setActiveTab] = useState("profile")

    useEffect(() => {
        if (tabParam === "password") {
            setActiveTab("password")
        } else {
            setActiveTab("profile")
        }
    }, [tabParam])


    return (
        <>
            <NavBar/>
            <div className="container max-w-4xl p-4 py-6 md:p-8 mx-auto">
                <div className="mb-6">
                    <Button variant="ghost" asChild className="mb-2">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4"/>
                            Back to Home
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
                    <p className="text-muted-foreground">Manage your account settings and preferences.</p>
                </div>

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
            </div>
        </>
    )
}

