"use client"

import type React from "react"

import {useState} from "react"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {useAuth} from "@/contexts/AuthContext";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const router = useRouter()
    const {registerUser} = useAuth()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setFormData((prev) => ({...prev, [name]: value}))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.password !== "" && formData.password === formData.confirmPassword) {
            const result = registerUser(
                formData.first_name,
                formData.last_name,
                formData.email,
                formData.password,
            )
            result.then((data) => {
                console.log(data)
                if (data.ok) {
                    toast.success("Your account has been registered successfully!")
                    router.push("/auth/login")
                } else toast.error("Failed to register")
            })

        }
        console.log("Register attempt with:", formData)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="mx-auto w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>Enter your information to create an account</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 flex justify-between">
                            <div>
                                <Label htmlFor="first_name" className='mb-2'>First Name</Label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    placeholder="John"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="last_name" className='mb-2'>Last Name</Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    placeholder="Doe"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">

                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 pt-5">
                        <Button type="submit" className="w-full">
                            Create account
                        </Button>
                        <div className="text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="text-primary hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

