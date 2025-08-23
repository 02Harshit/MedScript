// import { useQuery } from "@tanstack/react-query";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Link } from "wouter";

// export default function Dashboard() {
//   const { data: stats, isLoading } = useQuery({
//     queryKey: ["/api/dashboard/stats"],
//   });

//   const { data: patients } = useQuery({
//     queryKey: ["/api/patients"],
//   });

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue"></div>
//       </div>
//     );
//   }

//   const recentPatients = (patients as any[])?.slice(0, 3) || [];

//   return (
//     <div>
//       <div className="mb-8">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Hello, Doctor</h2>
//         <p className="text-gray-600">Here's your practice overview for today</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">Today's Patients</p>
//                 <p className="text-2xl font-bold text-gray-900" data-testid="stat-todayPatients">
//                   {(stats as any)?.todayPatients || 0}
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
//                 <i className="fas fa-users text-blue-600"></i>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">Prescriptions</p>
//                 <p className="text-2xl font-bold text-gray-900" data-testid="stat-prescriptions">
//                   {(stats as any)?.prescriptions || 0}
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
//                 <i className="fas fa-prescription text-success-green"></i>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">Pending Reviews</p>
//                 <p className="text-2xl font-bold text-gray-900" data-testid="stat-pendingReviews">
//                   {(stats as any)?.pendingReviews || 0}
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
//                 <i className="fas fa-clock text-warning-amber"></i>
//               </div>
//             </div>
//           </CardContent>
//         </Card> */}

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">Total Patients</p>
//                 <p className="text-2xl font-bold text-gray-900" data-testid="stat-totalPatients">
//                   {(stats as any)?.totalPatients || 0}
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
//                 <i className="fas fa-user-friends text-purple-600"></i>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardContent className="p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Patients</h3>
//             <div className="space-y-4">
//               {recentPatients.length > 0 ? (
//                 recentPatients.map((patient: any) => (
//                   <div key={patient.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors" data-testid={`patient-${patient.id}`}>
//                     <div className="flex items-center space-x-3">
//                       <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//                         <span className="text-white text-sm font-medium">
//                           {patient.firstName[0]}{patient.lastName[0]}
//                         </span>
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</p>
//                         <p className="text-sm text-gray-500">{patient.phone}</p>
//                       </div>
//                     </div>
//                     <span className="text-sm text-gray-400">
//                       {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : 'N/A'}
//                     </span>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-500 text-center py-4">No patients yet</p>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <Link href="/patients">
//                 <Button
//                   variant="outline"
//                   className="w-full p-4 h-auto flex-col border-2 border-dashed border-gray-200 hover:border-medical-blue hover:bg-blue-50"
//                   data-testid="action-add-patient"
//                 >
//                   <i className="fas fa-user-plus text-2xl text-medical-blue mb-2"></i>
//                   <p className="font-medium text-gray-900">Add Patient</p>
//                 </Button>
//               </Link>

//               <Link href="/prescriptions/new">
//                 <Button
//                   variant="outline"
//                   className="w-full p-4 h-auto flex-col border-2 border-dashed border-gray-200 hover:border-success-green hover:bg-green-50"
//                   data-testid="action-new-prescription"
//                 >
//                   <i className="fas fa-prescription text-2xl text-success-green mb-2"></i>
//                   <p className="font-medium text-gray-900">New Prescription</p>
//                 </Button>
//               </Link>

//               <Button
//                 variant="outline"
//                 className="p-4 h-auto flex-col border-2 border-dashed border-gray-200 hover:border-warning-amber hover:bg-amber-50"
//                 data-testid="action-search-records"
//               >
//                 <i className="fas fa-search text-2xl text-warning-amber mb-2"></i>
//                 <p className="font-medium text-gray-900">Search Records</p>
//               </Button>

//               <Button
//                 variant="outline"
//                 className="p-4 h-auto flex-col border-2 border-dashed border-gray-200 hover:border-purple-500 hover:bg-purple-50"
//                 data-testid="action-view-reports"
//               >
//                 <i className="fas fa-chart-bar text-2xl text-purple-500 mb-2"></i>
//                 <p className="font-medium text-gray-900">View Reports</p>
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

// Lucide icons
import { Users, FileText, UserPlus, Search, BarChart2 } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: patients } = useQuery({
    queryKey: ["/api/patients"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue"></div>
      </div>
    );
  }

  const recentPatients = (patients as any[])?.slice(0, 3) || [];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Hello, Doctor</h2>
        <p className="text-gray-600">Here's your practice overview for today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Today's Patients</p>
                <p
                  className="text-2xl font-extrabold text-gray-900"
                  data-testid="stat-todayPatients"
                >
                  {(stats as any)?.todayPatients || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Prescriptions</p>
                <p
                  className="text-2xl font-extrabold text-gray-900"
                  data-testid="stat-prescriptions"
                >
                  {(stats as any)?.prescriptions || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-success-green" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Total Patients</p>
                <p
                  className="text-2xl font-extrabold text-gray-900"
                  data-testid="stat-totalPatients"
                >
                  {(stats as any)?.totalPatients || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Patients</h3>
            <div className="space-y-4">
              {recentPatients.length > 0 ? (
                recentPatients.map((patient: any) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    data-testid={`patient-${patient.id}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {patient.firstName[0]}
                          {patient.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{patient.phone}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">
                      {patient.createdAt
                        ? new Date(patient.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No patients yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/patients">
                <Button
                  variant="outline"
                  className="w-full p-4 h-auto flex-col border-2 border-dashed border-gray-200 hover:border-medical-blue hover:bg-blue-50"
                  data-testid="action-add-patient"
                >
                  <UserPlus className="h-6 w-6 text-medical-blue mb-2" />
                  <p className="font-medium text-gray-900">Add Patient</p>
                </Button>
              </Link>

              <Link href="/prescriptions/new">
                <Button
                  variant="outline"
                  className="w-full p-4 h-auto flex-col border-2 border-dashed border-gray-200 hover:border-success-green hover:bg-green-50"
                  data-testid="action-new-prescription"
                >
                  <FileText className="h-6 w-6 text-success-green mb-2" />
                  <p className="font-medium text-gray-900">New Prescription</p>
                </Button>
              </Link>

              <Button
                variant="outline"
                className="p-4 h-auto flex-col border-2 border-dashed border-gray-200 hover:border-warning-amber hover:bg-amber-50"
                data-testid="action-search-records"
              >
                <Search className="h-6 w-6 text-warning-amber mb-2" />
                <p className="font-medium text-gray-900">Search Records</p>
              </Button>

              <Button
                variant="outline"
                className="p-4 h-auto flex-col border-2 border-dashed border-gray-200 hover:border-purple-500 hover:bg-purple-50"
                data-testid="action-view-reports"
              >
                <BarChart2 className="h-6 w-6 text-purple-500 mb-2" />
                <p className="font-medium text-gray-900">View Reports</p>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
