// import { useState } from "react";
// import { Link, useLocation } from "wouter";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useToast } from "@/hooks/use-toast";
// import { apiRequest } from "@/lib/queryClient";

// const loginSchema = z.object({
//   identifier: z.string().min(1, "Username or Medical License ID is required"),
//   password: z.string().min(1, "Password is required"),
//   rememberMe: z.boolean().default(false),
// });

// type LoginForm = z.infer<typeof loginSchema>;

// export default function Login() {
//   const [, setLocation] = useLocation();
//   const { toast } = useToast();
//   const queryClient = useQueryClient();

//   const form = useForm<LoginForm>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       identifier: "",
//       password: "",
//       rememberMe: false,
//     },
//   });

//   const loginMutation = useMutation({
//     mutationFn: (data: LoginForm) => apiRequest("POST", "/api/auth/login", data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
//       toast({
//         title: "Login successful",
//         description: "Welcome to MedScript!",
//       });
//       setLocation("/");
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Login failed",
//         description: error.message || "Invalid credentials",
//         variant: "destructive",
//       });
//     },
//   });

//   const onSubmit = (data: LoginForm) => {
//     loginMutation.mutate(data);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-blue to-blue-700 p-4">
//       <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
//         <div className="text-center mb-8">
//           <div className="w-16 h-16 bg-medical-blue rounded-full flex items-center justify-center mx-auto mb-4">
//             <i className="fas fa-stethoscope text-2xl text-white"></i>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">MedScript</h1>
//           <p className="text-gray-600">Doctor Prescription Management</p>
//         </div>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="login-form">
//             <FormField
//               control={form.control}
//               name="identifier"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Username or Medical License ID</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       placeholder="Enter username or license ID"
//                       data-testid="input-identifier"
//                     />
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
//                   <FormLabel>Password</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       type="password"
//                       placeholder="Enter your password"
//                       data-testid="input-password"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div className="flex items-center justify-between">
//               <FormField
//                 control={form.control}
//                 name="rememberMe"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                     <FormControl>
//                       <Checkbox
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                         data-testid="checkbox-remember"
//                       />
//                     </FormControl>
//                     <div className="space-y-1 leading-none">
//                       <FormLabel className="text-sm text-gray-600">
//                         Remember me
//                       </FormLabel>
//                     </div>
//                   </FormItem>
//                 )}
//               />
//               <Link href="#" className="text-sm text-medical-blue hover:text-blue-700">
//                 Forgot password?
//               </Link>
//             </div>

//             <Button
//               type="submit"
//               className="w-full"
//               disabled={loginMutation.isPending}
//               data-testid="button-login"
//             >
//               {loginMutation.isPending ? "Signing In..." : "Sign In"}
//             </Button>

//             <div className="text-center space-y-2">
//               <div>
//                 <span className="text-sm text-gray-600">Don't have an account? </span>
//                 <Link href="/register" className="text-sm text-medical-blue hover:text-blue-700 font-medium">
//                   Register here
//                 </Link>
//               </div>

//               <div>
//                 <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
//                   ← Back to Home
//                 </Link>
//               </div>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Stethoscope } from "lucide-react";
import medicalBackground from "@/assets/medical-background.svg";

const loginSchema = z.object({
  identifier: z.string().min(1, "Username or Medical License ID is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginForm) => apiRequest("POST", "/api/auth/login", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Login successful",
        description: "Welcome to MedScript!",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  const handleDemoLogin = () => {
    loginMutation.mutate({
      identifier: "demo_doctor",
      password: "demo123",
      rememberMe: false,
    })
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-medical-blue via-blue-100 to-blue-700 p-6 overflow-hidden">
      {/* Decorative background SVG pattern */}
      <div
        className="absolute inset-0 bg-center bg-cover opacity-10 pointer-events-none"
        style={{ backgroundImage: `url(${medicalBackground})` }}
        aria-hidden="true"
      ></div>

      {/* Sign-in card */}
      <div className="relative max-w-md w-full bg-white/80 rounded-3xl shadow-2xl backdrop-blur-xl p-10 sm:p-12 text-center z-10">
        {/* Logo + Heading */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-medical-blue rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 drop-shadow-sm">
            MedScript
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-2">
            Doctor Prescription Management
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="login-form">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-gray-800">
                    Username or Medical License ID
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter username or license ID"
                      className="bg-white/90 border-2 border-gray-200 focus:border-medical-blue focus:ring-medical-blue text-gray-900 placeholder-gray-400 rounded-xl py-3 px-4 transition-all"
                      data-testid="input-identifier"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-gray-800">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      className="bg-white/90 border-2 border-gray-200 focus:border-medical-blue focus:ring-medical-blue text-gray-900 placeholder-gray-400 rounded-xl py-3 px-4 transition-all"
                      data-testid="input-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-remember"
                        className="accent-medical-blue"
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-gray-600 select-none">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />
              <Link href="#" className="text-sm text-medical-blue hover:underline transition">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full py-3 px-4 text-lg rounded-xl bg-gradient-to-r from-medical-blue to-blue-600 hover:from-blue-700 hover:to-medical-blue shadow-md transition-all duration-150 font-semibold"
              disabled={loginMutation.isPending}
              data-testid="button-login"
            >
              {loginMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin w-4 h-4 border-t-2 border-b-2 border-white rounded-full"></span>
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>

            <Button
              type = "button"
              className="w-full py-3 px-4 text-lg rounded-xl border-2 border-dashed border-medical-blue bg-transparent text-medical-blue hover:bg-medical-blue hover:text-white transition-all font-semibold"
              onClick = {handleDemoLogin}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin w-4 h-4 border-t-2 border-b-2 border-white rounded-full"></span>
                  Signing In...
                </span>
              ) : (
                "Login as Demo User"
              )}
            </Button>

            <div className="text-center space-y-2 pt-4">
              <div>
                <span className="text-sm text-gray-600">Don't have an account? </span>
                <Link href="/register" className="text-sm text-medical-blue hover:underline font-medium">
                  Register here
                </Link>
              </div>
              <div>
                <Link href="/" className="text-sm text-gray-500 hover:underline flex items-center justify-center gap-1">
                  <span>&larr;</span> Back to Home
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
