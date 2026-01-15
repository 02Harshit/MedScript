// import { Link } from "wouter";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-medical-blue to-blue-700 flex items-center justify-center p-6">
//       <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
//         {/* Logo + Heading */}
//         <div className="mb-10">
//           <div className="w-20 h-20 bg-medical-blue rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
//             <i className="fas fa-stethoscope text-3xl text-white"></i>
//           </div>
//           <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Welcome to MedScript</h1>
//           <p className="text-lg text-gray-600">
//             AI-powered prescription and patient management system for modern doctors.
//           </p>
//         </div>

//         {/* Features Section */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//           <Card>
//             <CardContent className="p-6">
//               <i className="fas fa-prescription-bottle-alt text-medical-blue text-3xl mb-4"></i>
//               <h3 className="font-semibold text-gray-900 mb-2">Smart Prescriptions</h3>
//               <p className="text-sm text-gray-600">
//                 Generate accurate, AI-assisted prescriptions with ease.
//               </p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-6">
//               <i className="fas fa-users text-success-green text-3xl mb-4"></i>
//               <h3 className="font-semibold text-gray-900 mb-2">Patient Management</h3>
//               <p className="text-sm text-gray-600">
//                 Keep all patient details, history, and records in one place.
//               </p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-6">
//               <i className="fas fa-chart-line text-purple-600 text-3xl mb-4"></i>
//               <h3 className="font-semibold text-gray-900 mb-2">Insights & History</h3>
//               <p className="text-sm text-gray-600">
//                 Review past prescriptions and track patient progress.
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* CTA Buttons */}
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
//           <Link href="/login">
//             <Button size="lg" className="px-8 py-6 text-lg">
//               Sign In
//             </Button>
//           </Link>
//           <Link href="/register">
//             <Button
//               size="lg"
//               variant="outline"
//               className="px-8 py-6 text-lg border-2 border-medical-blue text-medical-blue hover:bg-blue-50"
//             >
//               Create Account
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }


// New updated landing page with improved styling
// import { Link } from "wouter";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// // Import a modern icon set
// import { Stethoscope, Users, LineChart } from "lucide-react"; 

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-medical-blue/40 via-blue-100 to-blue-700 flex items-center justify-center p-6">
//       <div className="max-w-4xl w-full bg-white/80 rounded-3xl shadow-2xl backdrop-blur-lg p-12 text-center">
//         {/* Logo + Heading */}
//         <div className="mb-10 flex flex-col items-center">
//           <div className="w-20 h-20 bg-medical-blue rounded-full flex items-center justify-center mb-6 shadow-xl animate-pulse">
//             <Stethoscope className="w-12 h-12 text-white"/>
//           </div>
//           <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
//             Welcome to MedScript
//           </h1>
//           <p className="text-lg md:text-xl text-gray-600 mb-6">
//             AI-powered prescription and patient management system for modern doctors.
//           </p>
//         </div>
//         {/* Features Section */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
//           <Card className="transition duration-300 hover:scale-105 hover:shadow-lg ring-1 ring-medical-blue">
//             <CardContent className="p-6">
//               <LineChart className="text-medical-blue w-10 h-10 mb-4"/>
//               <h3 className="font-semibold text-gray-900 mb-2">Smart Prescriptions</h3>
//               <p className="text-sm text-gray-600">
//                 Generate accurate, AI-assisted prescriptions with ease.
//               </p>
//             </CardContent>
//           </Card>
//           <Card className="transition duration-300 hover:scale-105 hover:shadow-lg ring-1 ring-success-green">
//             <CardContent className="p-6">
//               <Users className="text-success-green w-10 h-10 mb-4"/>
//               <h3 className="font-semibold text-gray-900 mb-2">Patient Management</h3>
//               <p className="text-sm text-gray-600">
//                 Keep all patient details, history, and records in one place.
//               </p>
//             </CardContent>
//           </Card>
//           <Card className="transition duration-300 hover:scale-105 hover:shadow-lg ring-1 ring-purple-600">
//             <CardContent className="p-6">
//               <LineChart className="text-purple-600 w-10 h-10 mb-4"/>
//               <h3 className="font-semibold text-gray-900 mb-2">Insights & History</h3>
//               <p className="text-sm text-gray-600">
//                 Review past prescriptions and track patient progress.
//               </p>
//             </CardContent>
//           </Card>
//         </div>
//         {/* CTA Buttons */}
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
//           <Link href="/login">
//             <Button size="lg" className="px-8 py-6 text-lg shadow-md hover:shadow-lg transition">
//               Sign In
//             </Button>
//           </Link>
//           <Link href="/register">
//             <Button
//               size="lg"
//               variant="outline"
//               className="px-8 py-6 text-lg border-2 border-medical-blue text-medical-blue hover:bg-medical-blue hover:text-white hover:border-medical-blue transition"
//             >
//               Create Account
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }


import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, Users, LineChart } from "lucide-react";
import medicalBackground from "@/assets/medical-background.svg";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-10 relative overflow-hidden
      bg-gradient-to-br from-medical-blue to-blue-700"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-center bg-cover opacity-50 pointer-events-none"
        style={{ backgroundImage: `url(${medicalBackground})` }}
        aria-hidden="true"
      ></div>

      {/* Main card */}
      <div className="relative max-w-5xl w-full bg-white/90 rounded-3xl shadow-2xl backdrop-blur-lg p-20 text-center z-10">
        {/* Logo + Heading */}
        <div className="mb-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-medical-blue rounded-full flex items-center justify-center mb-6 shadow-xl animate-pulse">
            <Stethoscope className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Welcome to MedScript
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6">
            Voice-driven prescription and patient management system for modern doctors.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="transition duration-300 hover:scale-105 hover:shadow-lg ring-1 ring-medical-blue">
            <CardContent className="p-6">
              <LineChart className="text-medical-blue w-10 h-10 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Smart Prescriptions</h3>
              <p className="text-sm text-gray-600">
                Generate accurate, voice-assisted prescriptions with ease.
              </p>
            </CardContent>
          </Card>
          <Card className="transition duration-300 hover:scale-105 hover:shadow-lg ring-1 ring-success-green">
            <CardContent className="p-6">
              <Users className="text-success-green w-10 h-10 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Patient Management</h3>
              <p className="text-sm text-gray-600">
                Keep all patient details, history, and records in one place.
              </p>
            </CardContent>
          </Card>
          <Card className="transition duration-300 hover:scale-105 hover:shadow-lg ring-1 ring-purple-600">
            <CardContent className="p-6">
              <LineChart className="text-purple-600 w-10 h-10 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Insights & History</h3>
              <p className="text-sm text-gray-600">
                Review past prescriptions and track patient progress.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/login">
            <Button size="lg" className="px-8 py-6 text-lg shadow-md hover:shadow-lg transition">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg border-2 border-medical-blue text-medical-blue hover:bg-medical-blue hover:text-white hover:border-medical-blue transition"
            >
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
