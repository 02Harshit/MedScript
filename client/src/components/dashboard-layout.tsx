// import { Link, useLocation } from "wouter";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { apiRequest } from "@/lib/queryClient";
// import { Stethoscope } from "lucide-react";

// interface DashboardLayoutProps {
//   children: React.ReactNode;
//   doctor: {
//     id: string;
//     firstName: string;
//     lastName: string;
//     specialization?: string;
//   };
// }

// export default function DashboardLayout({ children, doctor }: DashboardLayoutProps) {
//   const [location, setLocation] = useLocation();
//   const { toast } = useToast();
//   const queryClient = useQueryClient();

//   const logoutMutation = useMutation({
//     mutationFn: () => apiRequest("POST", "/api/auth/logout"),
//     onSuccess: () => {
//       queryClient.clear();
//       toast({
//         title: "Logged out",
//         description: "You have been successfully logged out",
//       });
//       setLocation("/");
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Logout failed",
//         description: error.message || "An error occurred",
//         variant: "destructive",
//       });
//     },
//   });

//   const navItems = [
//     { path: "/", icon: "fas fa-home", label: "Dashboard", testId: "nav-dashboard" },
//     { path: "/patients", icon: "fas fa-users", label: "Patients", testId: "nav-patients" },
//     { path: "/prescriptions/new", icon: "fas fa-prescription", label: "New Prescription", testId: "nav-new-prescription" },
//     { path: "/history", icon: "fas fa-history", label: "History", testId: "nav-history" },
//     { path: "/analytics", icon: "fas fa-chart-line", label: "Analytics", testId: "nav-analytics" },
//     { path: "/settings", icon: "fas fa-cog", label: "Settings", testId: "nav-settings" },
//   ];

//   return (
//     <div className="min-h-screen bg-surface-gray">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b border-gray-200">
//         <div className="flex items-center justify-between px-6 py-4">
//           <div className="flex items-center space-x-3">
//             {/* <div className="w-10 h-10 bg-medical-blue rounded-lg flex items-center justify-center">
//               <i className="fas fa-stethoscope text-white"></i>
//             </div> */}
//             <Stethoscope className="w-10 h-10 text-medical-blue" />
//             <div>
//               <h1 className="text-xl font-bold text-gray-900">MedScript</h1>
//               <p className="text-sm text-gray-600">
//                 Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization || 'MD'}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center space-x-4">
//             <Button variant="ghost" size="sm" className="p-2 text-gray-400 hover:text-gray-600">
//               <i className="fas fa-bell text-lg"></i>
//             </Button>
//             <div className="relative">
//               <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
//                 <div className="w-8 h-8 bg-gradient-to-br from-medical-blue to-blue-600 rounded-full flex items-center justify-center">
//                   <span className="text-white text-sm font-medium">
//                     {doctor.firstName[0]}{doctor.lastName[0]}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="flex">
//         {/* Sidebar */}
//         <nav className="w-64 bg-white shadow-sm h-screen sticky top-0">
//           <div className="p-6">
//             <div className="space-y-2">
//               {navItems.map((item) => (
//                 <Link key={item.path} href={item.path}>
//                   <Button
//                     variant="ghost"
//                     className={`w-full justify-start space-x-3 p-3 rounded-xl ${
//                       location === item.path
//                         ? "bg-medical-blue text-white"
//                         : "text-gray-600 hover:bg-gray-100"
//                     }`}
//                     data-testid={item.testId}
//                   >
//                     <i className={item.icon}></i>
//                     <span className="font-medium">{item.label}</span>
//                   </Button>
//                 </Link>
//               ))}
//             </div>

//             <div className="mt-8 pt-8 border-t border-gray-200">
//               <Button
//                 variant="ghost"
//                 className="w-full justify-start space-x-3 p-3 rounded-xl text-red-600 hover:bg-red-50"
//                 onClick={() => logoutMutation.mutate()}
//                 disabled={logoutMutation.isPending}
//                 data-testid="button-logout"
//               >
//                 <i className="fas fa-sign-out-alt"></i>
//                 <span className="font-medium">
//                   {logoutMutation.isPending ? "Signing Out..." : "Sign Out"}
//                 </span>
//               </Button>
//             </div>
//           </div>
//         </nav>

//         {/* Main Content */}
//         <main className="flex-1 p-6 bg-blue-200">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }


import { Link, useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Stethoscope } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  doctor: {
    id: string;
    firstName: string;
    lastName: string;
    specialization?: string;
  };
}
export default function DashboardLayout({ children, doctor }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();


  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout"),
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  const navItems = [
    { path: "/", icon: "fas fa-home", label: "Dashboard", testId: "nav-dashboard" },
    { path: "/patients", icon: "fas fa-users", label: "Patients", testId: "nav-patients" },
    { path: "/prescriptions/new", icon: "fas fa-prescription", label: "New Prescription", testId: "nav-new-prescription" },
    { path: "/history", icon: "fas fa-history", label: "History", testId: "nav-history" },
    { path: "/analytics", icon: "fas fa-chart-line", label: "Analytics", testId: "nav-analytics" },
    { path: "/settings", icon: "fas fa-cog", label: "Settings", testId: "nav-settings" },
  ];

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-8 py-5">
          <div className="flex items-center space-x-4">
            {/* Icon */}
            <Stethoscope className="w-10 h-10 text-blue-600" />
            <div>
              <h1 className="text-2xl font-extrabold text-blue-700">MedScript</h1>
              <p className="text-sm text-gray-500">
                Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization || "MD"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            {/* <Button variant="ghost" size="sm" className="p-2 text-gray-400 hover:text-blue-600">
              <i className="fas fa-bell text-lg"></i>
            </Button> */}
            <div className="flex items-center p-2 rounded-lg bg-blue-100">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {doctor.firstName[0]}{doctor.lastName[0]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-gray-50 shadow-md h-screen sticky top-0">
          <div className="p-6">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start space-x-3 p-3 rounded-xl transition-all
                      ${
                        location === item.path
                          ? "bg-blue-600 text-white shadow font-bold"
                          : "text-gray-700 hover:bg-blue-100"
                      }`}
                    data-testid={item.testId}
                  >
                    <i className={item.icon}></i>
                    <span className="font-medium">{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full justify-start space-x-3 p-3 rounded-xl text-red-600 font-semibold hover:bg-red-50 transition"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                data-testid="button-logout"
              >
                <i className="fas fa-sign-out-alt"></i>
                <span className="font-medium">
                  {logoutMutation.isPending ? "Signing Out..." : "Sign Out"}
                </span>
              </Button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-10 bg-blue-50 min-h-screen">
          <div className="max-w-screen-xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
