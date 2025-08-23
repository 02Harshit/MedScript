import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue to-blue-700 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
        {/* Logo + Heading */}
        <div className="mb-10">
          <div className="w-20 h-20 bg-medical-blue rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <i className="fas fa-stethoscope text-3xl text-white"></i>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Welcome to MedScript</h1>
          <p className="text-lg text-gray-600">
            AI-powered prescription and patient management system for modern doctors.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <i className="fas fa-prescription-bottle-alt text-medical-blue text-3xl mb-4"></i>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Prescriptions</h3>
              <p className="text-sm text-gray-600">
                Generate accurate, AI-assisted prescriptions with ease.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <i className="fas fa-users text-success-green text-3xl mb-4"></i>
              <h3 className="font-semibold text-gray-900 mb-2">Patient Management</h3>
              <p className="text-sm text-gray-600">
                Keep all patient details, history, and records in one place.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <i className="fas fa-chart-line text-purple-600 text-3xl mb-4"></i>
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
            <Button size="lg" className="px-8 py-6 text-lg">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg border-2 border-medical-blue text-medical-blue hover:bg-blue-50"
            >
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
