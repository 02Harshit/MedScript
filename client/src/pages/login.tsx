import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-blue to-blue-700 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-medical-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-stethoscope text-2xl text-white"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MedScript</h1>
          <p className="text-gray-600">Doctor Prescription Management</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="login-form">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Medical License ID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter username or license ID"
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
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
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-remember"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm text-gray-600">
                        Remember me
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <Link href="#" className="text-sm text-medical-blue hover:text-blue-700">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
              data-testid="button-login"
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
            </Button>

            <div className="text-center">
              <span className="text-sm text-gray-600">Don't have an account? </span>
              <Link href="/register" className="text-sm text-medical-blue hover:text-blue-700 font-medium">
                Register here
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
