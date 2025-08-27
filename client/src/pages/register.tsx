// import { Link, useLocation } from "wouter";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { useToast } from "@/hooks/use-toast";
// import { apiRequest } from "@/lib/queryClient";

// const registerSchema = z.object({
//   firstName: z.string().min(1, "First name is required"),
//   lastName: z.string().min(1, "Last name is required"),
//   medicalLicenseId: z.string().min(1, "Medical license ID is required"),
//   specialization: z.string().optional(),
//   email: z.string().email("Invalid email address"),
//   username: z.string().min(3, "Username must be at least 3 characters"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// type RegisterForm = z.infer<typeof registerSchema>;

// export default function Register() {
//   const [, setLocation] = useLocation();
//   const { toast } = useToast();
//   const queryClient = useQueryClient();

//   const form = useForm<RegisterForm>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       medicalLicenseId: "",
//       specialization: "",
//       email: "",
//       username: "",
//       password: "",
//     },
//   });

//   const registerMutation = useMutation({
//     mutationFn: (data: RegisterForm) => apiRequest("POST", "/api/auth/register", data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
//       toast({
//         title: "Registration successful",
//         description: "Welcome to MedScript!",
//       });
//       setLocation("/");
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Registration failed",
//         description: error.message || "Registration failed",
//         variant: "destructive",
//       });
//     },
//   });

//   const onSubmit = (data: RegisterForm) => {
//     registerMutation.mutate(data);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-medical-blue to-blue-700 p-4">
//       <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
//         <div className="text-center mb-8">
//           <div className="w-16 h-16 bg-medical-blue rounded-full flex items-center justify-center mx-auto mb-4">
//             <i className="fas fa-user-md text-2xl text-white"></i>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Registration</h1>
//           <p className="text-gray-600">Create your MedScript account</p>
//         </div>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="register-form">
//             <FormField
//               control={form.control}
//               name="firstName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>First Name *</FormLabel>
//                   <FormControl>
//                     <Input {...field} data-testid="input-firstName" />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="lastName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Last Name *</FormLabel>
//                   <FormControl>
//                     <Input {...field} data-testid="input-lastName" />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="medicalLicenseId"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Medical License ID *</FormLabel>
//                   <FormControl>
//                     <Input {...field} data-testid="input-medicalLicenseId" />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="specialization"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Specialization</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger data-testid="select-specialization">
//                         <SelectValue placeholder="Select specialization" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="General Practitioner">General Practitioner</SelectItem>
//                       <SelectItem value="Cardiologist">Cardiologist</SelectItem>
//                       <SelectItem value="Neurologist">Neurologist</SelectItem>
//                       <SelectItem value="Orthopedist">Orthopedist</SelectItem>
//                       <SelectItem value="Other">Other</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem className="md:col-span-2">
//                   <FormLabel>Email Address *</FormLabel>
//                   <FormControl>
//                     <Input {...field} type="email" data-testid="input-email" />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="username"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Username *</FormLabel>
//                   <FormControl>
//                     <Input {...field} data-testid="input-username" />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password *</FormLabel>
//                   <FormControl>
//                     <Input {...field} type="password" data-testid="input-password" />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div className="md:col-span-2 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="flex-1"
//                 onClick={() => setLocation("/login")}
//                 data-testid="button-back-login"
//               >
//                 Back to Login
//               </Button>
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="flex-1"
//                 onClick={() => setLocation("/")}
//                 data-testid="button-back-home"
//               >
//                 Back to Home
//               </Button>
//               <Button
//                 type="submit"
//                 className="flex-1"
//                 disabled={registerMutation.isPending}
//                 data-testid="button-register"
//               >
//                 {registerMutation.isPending ? "Registering..." : "Register"}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// }




// import { Link, useLocation } from "wouter";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select, SelectContent, SelectItem, SelectTrigger, SelectValue
// } from "@/components/ui/select";
// import {
//   Form, FormControl, FormField, FormItem, FormLabel, FormMessage
// } from "@/components/ui/form";
// import { useToast } from "@/hooks/use-toast";
// import { apiRequest } from "@/lib/queryClient";
// import { User } from "lucide-react";
// import medicalBackground from "@/assets/medical-background.svg";

// // ...schema, types, and logic remain unchanged
// const registerSchema = z.object({
//   firstName: z.string().min(1, "First name is required"),
//   lastName: z.string().min(1, "Last name is required"),
//   medicalLicenseId: z.string().min(1, "Medical license ID is required"),
//   specialization: z.string().optional(),
//   email: z.string().email("Invalid email address"),
//   username: z.string().min(3, "Username must be at least 3 characters"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// type RegisterForm = z.infer<typeof registerSchema>;

// export default function Register() {
//   // All hooks and logic remain the same
//   const [, setLocation] = useLocation();
//   const { toast } = useToast();
//   const queryClient = useQueryClient();

//   const form = useForm<RegisterForm>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       medicalLicenseId: "",
//       specialization: "",
//       email: "",
//       username: "",
//       password: "",
//     },
//   });

//   const registerMutation = useMutation({
//     mutationFn: (data: RegisterForm) => apiRequest("POST", "/api/auth/register", data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
//       toast({
//         title: "Registration successful",
//         description: "Welcome to MedScript!",
//       });
//       setLocation("/");
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Registration failed",
//         description: error.message || "Registration failed",
//         variant: "destructive",
//       });
//     },
//   });

//   const onSubmit = (data: RegisterForm) => {
//     registerMutation.mutate(data);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-medical-blue via-blue-100 to-blue-700 p-6 overflow-hidden">
//       {/* Decorative background SVG pattern */}
//       <div
//         className="absolute inset-0 bg-center bg-cover opacity-10 pointer-events-none"
//         style={{ backgroundImage: `url(${medicalBackground})` }}
//         aria-hidden="true"
//       ></div>
      
//       {/* Registration card */}
//       <div className="relative max-w-2xl w-full bg-white/80 rounded-3xl shadow-2xl backdrop-blur-xl p-10 sm:p-14 text-center z-10">
//         {/* Logo & Heading */}
//         <div className="mb-8 flex flex-col items-center">
//           <div className="w-16 h-16 bg-medical-blue rounded-full flex items-center justify-center mb-4 shadow-lg">
//             <User className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 drop-shadow-sm">
//             Doctor Registration
//           </h1>
//           <p className="text-base md:text-lg text-gray-600 mb-2">
//             Create your MedScript account
//           </p>
//         </div>

//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7"
//             data-testid="register-form"
//           >
            // {/* First Name / Last Name */}
            // <FormField
            //   control={form.control}
            //   name="firstName"
            //   render={({ field }) => (
            //     <FormItem>
            //       <FormLabel className="text-md text-gray-800">First Name *</FormLabel>
            //       <FormControl>
            //         <Input
            //           {...field}
            //           placeholder="First Name"
            //           className="bg-white/90 border-2 border-gray-200 focus:border-medical-blue focus:ring-medical-blue text-gray-900 placeholder-gray-400 rounded-xl py-3 px-4 transition"
            //           data-testid="input-firstName"
            //         />
            //       </FormControl>
            //       <FormMessage />
            //     </FormItem>
            //   )}
            // />
            // <FormField
            //   control={form.control}
            //   name="lastName"
            //   render={({ field }) => (
            //     <FormItem>
            //       <FormLabel className="text-md text-gray-800">Last Name *</FormLabel>
            //       <FormControl>
            //         <Input
            //           {...field}
            //           placeholder="Last Name"
            //           className="bg-white/90 border-2 border-gray-200 focus:border-medical-blue focus:ring-medical-blue text-gray-900 placeholder-gray-400 rounded-xl py-3 px-4 transition"
            //           data-testid="input-lastName"
            //         />
            //       </FormControl>
            //       <FormMessage />
            //     </FormItem>
            //   )}
            // />
            // {/* Medical License ID / Specialization */}
            // <FormField
            //   control={form.control}
            //   name="medicalLicenseId"
            //   render={({ field }) => (
            //     <FormItem>
            //       <FormLabel className="text-md text-gray-800">Medical License ID *</FormLabel>
            //       <FormControl>
            //         <Input
            //           {...field}
            //           placeholder="Medical License ID"
            //           className="bg-white/90 border-2 border-gray-200 focus:border-medical-blue focus:ring-medical-blue text-gray-900 placeholder-gray-400 rounded-xl py-3 px-4 transition"
            //           data-testid="input-medicalLicenseId"
            //         />
            //       </FormControl>
            //       <FormMessage />
            //     </FormItem>
            //   )}
            // />
            // <FormField
            //   control={form.control}
            //   name="specialization"
            //   render={({ field }) => (
            //     <FormItem>
            //       <FormLabel className="text-md text-gray-800">Specialization</FormLabel>
            //       <Select onValueChange={field.onChange} defaultValue={field.value}>
            //         <FormControl>
            //           <SelectTrigger className="bg-white/90 border-2 border-gray-200 focus:border-medical-blue focus:ring-medical-blue rounded-xl py-3 px-4 transition" data-testid="select-specialization">
            //             <SelectValue placeholder="Select specialization" />
            //           </SelectTrigger>
            //         </FormControl>
            //         <SelectContent>
            //           <SelectItem value="General Practitioner">General Practitioner</SelectItem>
            //           <SelectItem value="Cardiologist">Cardiologist</SelectItem>
            //           <SelectItem value="Neurologist">Neurologist</SelectItem>
            //           <SelectItem value="Orthopedist">Orthopedist</SelectItem>
            //           <SelectItem value="Other">Other</SelectItem>
            //         </SelectContent>
            //       </Select>
            //       <FormMessage />
            //     </FormItem>
            //   )}
            // />
            // {/* Email Address */}
            // <FormField
            //   control={form.control}
            //   name="email"
            //   render={({ field }) => (
            //     <FormItem className="md:col-span-2">
            //       <FormLabel className="text-md text-gray-800">Email Address *</FormLabel>
            //       <FormControl>
            //         <Input
            //           {...field}
            //           type="email"
            //           placeholder="Email Address"
            //           className="bg-white/90 border-2 border-gray-200 focus:border-medical-blue focus:ring-medical-blue text-gray-900 placeholder-gray-400 rounded-xl py-3 px-4 transition"
            //           data-testid="input-email"
            //         />
            //       </FormControl>
            //       <FormMessage />
            //     </FormItem>
            //   )}
            // />
            // {/* Username / Password */}
            // <FormField
            //   control={form.control}
            //   name="username"
            //   render={({ field }) => (
            //     <FormItem>
            //       <FormLabel className="text-md text-gray-800">Username *</FormLabel>
            //       <FormControl>
            //         <Input
            //           {...field}
            //           placeholder="Username"
            //           className="bg-white/90 border-2 border-gray-200 focus:border-medical-blue focus:ring-medical-blue text-gray-900 placeholder-gray-400 rounded-xl py-3 px-4 transition"
            //           data-testid="input-username"
            //         />
            //       </FormControl>
            //       <FormMessage />
            //     </FormItem>
            //   )}
            // />
//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-md text-gray-800">Password *</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       type="password"
//                       placeholder="Password"
//                       className="bg-white/90 border-2 border-gray-200 focus:border-medical-blue focus:ring-medical-blue text-gray-900 placeholder-gray-400 rounded-xl py-3 px-4 transition"
//                       data-testid="input-password"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             {/* Action Buttons */}
//             <div className="md:col-span-2 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 pt-2">
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="flex-1 rounded-xl"
//                 onClick={() => setLocation("/login")}
//                 data-testid="button-back-login"
//               >
//                 Back to Login
//               </Button>
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="flex-1 rounded-xl"
//                 onClick={() => setLocation("/")}
//                 data-testid="button-back-home"
//               >
//                 Back to Home
//               </Button>
//               <Button
//                 type="submit"
//                 className="flex-1 rounded-xl bg-gradient-to-r from-medical-blue to-blue-600 hover:from-blue-700 hover:to-medical-blue shadow-md transition-all font-semibold text-lg py-3"
//                 disabled={registerMutation.isPending}
//                 data-testid="button-register"
//               >
//                 {registerMutation.isPending ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <span className="animate-spin w-4 h-4 border-t-2 border-b-2 border-white rounded-full"></span>
//                     Registering...
//                   </span>
//                 ) : (
//                   "Register"
//                 )}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { User, Eye, EyeOff } from "lucide-react";
import medicalBackground from "@/assets/medical-background.svg";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    medicalLicenseId: z.string().min(1, "Medical license ID is required"),
    specialization: z.string().optional(),
    email: z.string().email("Invalid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"), // added
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Local state for password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      medicalLicenseId: "",
      specialization: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterForm) => apiRequest("POST", "/api/auth/register", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Registration successful",
        description: "Welcome to MedScript!",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Registration failed",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-medical-blue via-blue-100 to-blue-700 p-6 overflow-hidden">
      {/* Decorative background SVG pattern */}
      <div
        className="absolute inset-0 bg-center bg-cover opacity-10 pointer-events-none"
        style={{ backgroundImage: `url(${medicalBackground})` }}
        aria-hidden="true"
      ></div>

      {/* Registration card */}
      <div className="relative max-w-2xl w-full bg-white/80 rounded-3xl shadow-2xl backdrop-blur-xl p-6 sm:p-8 text-center z-10">
        {/* Logo & Heading */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-medical-blue rounded-full flex items-center justify-center mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 drop-shadow-sm">
            Doctor Registration
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-2">
            Create your MedScript account
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7"
            data-testid="register-form"
          >
            {/* All previous fields remain unchanged */}
            {/* First Name / Last Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md text-gray-800">First Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="First Name"
                      className="bg-white/90 border-2 border-gray-200 focus:border-medical-blue focus:ring-medical-blue text-gray-900 placeholder-gray-400 rounded-xl py-3 px-4 transition"
                      data-testid="input-firstName"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md text-gray-800">Last Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Last Name"
                      className="bg-white/90 border-2 border-gray-200 focus:border-medical-blue focus:ring-medical-blue text-gray-900 placeholder-gray-400 rounded-xl py-3 px-4 transition"
                      data-testid="input-lastName"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Medical License ID / Specialization */}
            <FormField
              control={form.control}
              name="medicalLicenseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md text-gray-800">Medical License ID *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Medical License ID"
                      className="bg-white/90 border-2 border-gray-200 focus:border-medical-blue focus:ring-medical-blue text-gray-900 placeholder-gray-400 rounded-xl py-3 px-4 transition"
                      data-testid="input-medicalLicenseId"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md text-gray-800">Specialization</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/90 border-2 border-gray-200 focus:border-medical-blue focus:ring-medical-blue rounded-xl py-3 px-4 transition" data-testid="select-specialization">
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="General Practitioner">General Practitioner</SelectItem>
                      <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                      <SelectItem value="Neurologist">Neurologist</SelectItem>
                      <SelectItem value="Orthopedist">Orthopedist</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email Address */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-md text-gray-800">Email Address *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Email Address"
                      className="bg-white/90 border-2 border-gray-200 focus:border-medical-blue focus:ring-medical-blue text-gray-900 placeholder-gray-400 rounded-xl py-3 px-4 transition"
                      data-testid="input-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md text-gray-800">Username *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Username"
                      className="bg-white/90 border-2 border-gray-200 focus:border-medical-blue focus:ring-medical-blue text-gray-900 placeholder-gray-400 rounded-xl py-3 px-4 transition"
                      data-testid="input-username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password with eye toggle */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md text-gray-800">Password *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="bg-white/90 border-2 border-gray-200 focus:border-medical-blue focus:ring-medical-blue text-gray-900 placeholder-gray-400 rounded-xl py-3 pl-4 pr-10 transition"
                        data-testid="input-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-medical-blue transition"
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password with eye toggle */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md text-gray-800">Confirm Password *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="bg-white/90 border-2 border-gray-200 focus:border-medical-blue focus:ring-medical-blue text-gray-900 placeholder-gray-400 rounded-xl py-3 pl-4 pr-10xxxxxxx transition"
                        data-testid="input-confirmPassword"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-medical-blue transition"
                        tabIndex={-1}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons remain unchanged */}
            <div className="md:col-span-2 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 hover:shadow-sm transition"
                onClick={() => setLocation("/login")}
                data-testid="button-back-login"
              >
                Back to Login
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 hover:shadow-sm transition"
                onClick={() => setLocation("/")}
                data-testid="button-back-home"
              >
                Back to Home
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-xl bg-gradient-to-r from-medical-blue to-blue-600 hover:from-blue-700 hover:to-medical-blue shadow-md transition-all font-semibold text-lg py-3"
                disabled={registerMutation.isPending}
                data-testid="button-register"
              >
                {registerMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin w-4 h-4 border-t-2 border-b-2 border-white rounded-full"></span>
                    Registering...
                  </span>
                ) : (
                  "Register"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
