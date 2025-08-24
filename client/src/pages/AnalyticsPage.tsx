// src/pages/AnalyticsPage.tsx
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const patientData = [
  { month: "Jan", patients: 40, prescriptions: 24 },
  { month: "Feb", patients: 30, prescriptions: 18 },
  { month: "Mar", patients: 50, prescriptions: 32 },
  { month: "Apr", patients: 45, prescriptions: 28 },
  { month: "May", patients: 60, prescriptions: 35 },
  { month: "Jun", patients: 70, prescriptions: 40 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
      <p className="text-gray-600">Overview of patient visits and prescriptions.</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-gray-500 text-sm">Total Patients</h2>
            <p className="text-2xl font-bold text-gray-900">295</p>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-gray-500 text-sm">Prescriptions Issued</h2>
            <p className="text-2xl font-bold text-gray-900">177</p>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-gray-500 text-sm">Active Doctors</h2>
            <p className="text-2xl font-bold text-gray-900">12</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Patients per Month</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={patientData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="patients" fill="#1E40AF" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Prescriptions Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={patientData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="prescriptions" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
