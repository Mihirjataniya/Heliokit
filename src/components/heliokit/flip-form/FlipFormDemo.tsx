import { useState } from "react"
import { FlipForm, FlipFormBack, FlipFormButton, FlipFormField, FlipFormForm, FlipFormFront, FlipFormHeader, FlipFormLink, useFlipForm } from "./FlipForm"

const FlipFormDemo = () => {
    const [form, setForm] = useState({ email: "", password: "", name: "" })

    const update = (e: any) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSignIn = () => {
        console.log("Sign in:", { email: form.email, password: form.password })
    }

    const handleSignUp = () => {
        console.log("Sign up:", form)
    }

    return (
        <FlipForm>
            <FlipFormFront>
                <FlipFormForm>
                    <FlipFormHeader variant="cyan">Welcome Back</FlipFormHeader>
                    <div className="space-y-6">
                        <FlipFormField
                            label="Email Address"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={update}
                            placeholder="Enter your email"
                            variant="cyan"
                        />
                        <FlipFormField
                            label="Password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={update}
                            placeholder="Enter your password"
                            variant="cyan"
                        />
                        <FlipFormButton variant="cyan">Sign In</FlipFormButton>
                    </div>
                    <div className="mt-8 text-center">
                        <p className="text-slate-400">
                            New to the system?{" "}
                            {/* ✅ SUPER SIMPLE - just add flipTo prop! */}
                            <FlipFormLink flipTo="back" variant="cyan">
                                Create Account
                            </FlipFormLink>
                        </p>
                    </div>
                </FlipFormForm>
            </FlipFormFront>

            <FlipFormBack>
                <FlipFormForm>
                    <FlipFormHeader variant="purple" icon={<div className="w-8 h-8 border-2 border-white rounded-lg rotate-45"></div>}>
                        Join the Network
                    </FlipFormHeader>
                    <div className="space-y-5">
                        <FlipFormField
                            label="Full Name"
                            name="name"
                            value={form.name}
                            onChange={update}
                            placeholder="Enter your full name"
                            variant="purple"
                        />
                        <FlipFormField
                            label="Email Address"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={update}
                            placeholder="Enter your email"
                            variant="purple"
                        />
                        <FlipFormField
                            label="Password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={update}
                            placeholder="Create a password"
                            variant="purple"
                        />
                        <FlipFormButton variant="purple">Sign Up</FlipFormButton>
                    </div>
                    <div className="mt-6 text-center">
                        <p className="text-slate-400">
                            Already connected?{" "}
                            {/* ✅ SUPER SIMPLE - just add flipTo prop! */}
                            <FlipFormLink flipTo="front" variant="purple">
                                Sign In
                            </FlipFormLink>
                        </p>
                    </div>
                </FlipFormForm>
            </FlipFormBack>
        </FlipForm>
    )
}


export default FlipFormDemo