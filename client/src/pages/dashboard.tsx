import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Users, FileText, UserPlus, Search, BarChart2 } from "lucide-react";

// Color variables (override in tailwind.config.js for branding):
const COLORS = {
  medBlue: "text-blue-600",
  medBg: "bg-blue-50",
  green: "text-green-600",
  greenBg: "bg-green-50",
  purple: "text-purple-600",
  purpleBg: "bg-purple-50",
  amber: "text-amber-500",
  amberBg: "bg-amber-50",
  gradient: "bg-gradient-to-br from-blue-500 to-purple-600",
};

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });
  const { data: patients } = useQuery({
    queryKey: ["/api/patients"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const recentPatients = (patients as any[])?.slice(0, 3) || [];

  return (
    <div className="pt-2">
      {/* Greeting */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-blue-900 mb-1">
          Hello, Doctor
        </h2>
        <p className="text-gray-500 text-lg">Here's your practice overview for today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Card className="shadow-lg border-0 bg-white/90 rounded-2xl hover:shadow-xl transition duration-200">
          <CardContent className="p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-gray-500 mb-1">Today's Patients</p>
                <p className="text-4xl font-bold text-blue-700" data-testid="stat-todayPatients">
                  {(stats as any)?.todayPatients || 0}
                </p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center shadow">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-white/90 rounded-2xl hover:shadow-xl transition duration-200">
          <CardContent className="p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-gray-500 mb-1">Today's Prescriptions</p>
                <p className="text-4xl font-bold text-green-600" data-testid="stat-prescriptions">
                  {(stats as any)?.prescriptions || 0}
                </p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center shadow">
                <FileText className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-white/90 rounded-2xl hover:shadow-xl transition duration-200">
          <CardContent className="p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-gray-500 mb-1">Total Patients</p>
                <p className="text-4xl font-bold text-purple-700" data-testid="stat-totalPatients">
                  {(stats as any)?.totalPatients || 0}
                </p>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center shadow">
                <Users className="w-7 h-7 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Patients */}
        <Card className="shadow-lg border-0 bg-white/95 rounded-2xl hover:shadow-xl transition">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-6">Recent Patients</h3>
            <div className="space-y-5">
              {recentPatients.length > 0 ? (
                recentPatients.map((patient: any) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 transition-colors"
                    data-testid={`patient-${patient.id}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`${COLORS.gradient} w-12 h-12 rounded-full flex items-center justify-center shadow`}>
                        <span className="text-white text-lg font-semibold">
                          {patient.firstName[0]}{patient.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{patient.phone}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400 font-medium">
                      {patient.createdAt
                        ? new Date(patient.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8 text-lg">No patients yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg border-0 bg-white/95 rounded-2xl hover:shadow-xl transition">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-6">
              <Link href="/patients">
                <Button
                  variant="outline"
                  className="w-full flex flex-col items-center p-5 h-auto border-2 border-dashed border-blue-100 hover:border-blue-600 hover:bg-blue-50 shadow transition"
                  data-testid="action-add-patient"
                >
                  <UserPlus className="w-7 h-7 text-blue-600 mb-2" />
                  <span className="text-base font-semibold text-blue-900">Add Patient</span>
                </Button>
              </Link>
              <Link href="/prescriptions/new">
                <Button
                  variant="outline"
                  className="w-full flex flex-col items-center p-5 h-auto border-2 border-dashed border-green-100 hover:border-green-600 hover:bg-green-50 shadow transition"
                  data-testid="action-new-prescription"
                >
                  <FileText className="w-7 h-7 text-green-600 mb-2" />
                  <span className="text-base font-semibold text-green-900">New Prescription</span>
                </Button>
              </Link>
              <Link href="/patients">
                <Button
                  variant="outline"
                  className="w-full flex flex-col items-center p-5 h-auto border-2 border-dashed border-amber-100 hover:border-amber-500 hover:bg-amber-50 shadow transition"
                  data-testid="action-search-records"
                >
                  <Search className="w-7 h-7 text-amber-500 mb-2" />
                  <span className="text-base font-semibold text-amber-900">Search Records</span>
                </Button>
              </Link>
              <Link href="/analytics">
                <Button
                  variant="outline"
                  className="w-full flex flex-col items-center p-5 h-auto border-2 border-dashed border-purple-100 hover:border-purple-600 hover:bg-purple-50 shadow transition"
                  data-testid="action-view-reports"
                >
                  <BarChart2 className="w-7 h-7 text-purple-600 mb-2" />
                  <span className="text-base font-semibold text-purple-900">View Analytics</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
