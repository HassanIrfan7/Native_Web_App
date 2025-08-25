import React from 'react';
import { FileText, AlertTriangle, Scale, Shield } from 'lucide-react';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 w-16 h-16 mx-auto mb-6">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Please read these terms carefully before using our platform.
            </p>
            <p className="text-sm opacity-75">
              Last updated: December 2024
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
          <p className="text-gray-700 mb-4">
            These Terms of Service ("Terms") govern your use of AzureStream's website and services. By accessing or using our platform, you agree to be bound by these Terms and our Privacy Policy.
          </p>
          <p className="text-gray-700">
            If you disagree with any part of these terms, then you may not access the service.
          </p>
        </div>

        {/* Account Terms */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Account Terms</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Account Creation</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>You must provide accurate and complete information when creating an account</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>You are responsible for maintaining the security of your account credentials</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>You must be at least 13 years old to create an account</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>One person or legal entity may maintain only one account</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Creator Accounts</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Creator accounts are invitation-only and subject to approval</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Creators must comply with content guidelines and quality standards</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Creator privileges may be revoked for violations of these terms</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Content Guidelines */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-green-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Content Guidelines</h2>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Acceptable Content</h3>
              <p className="text-gray-700 mb-3">
                We encourage creative, original, and engaging content that adds value to our community. Content should be:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Original or properly licensed</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Appropriate for the specified age rating</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Respectful of others' rights and dignity</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Compliant with applicable laws and regulations</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-900 mb-2">Prohibited Content</h3>
                  <p className="text-sm text-red-800 mb-2">The following types of content are strictly prohibited:</p>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• Illegal, harmful, or dangerous content</li>
                    <li>• Harassment, bullying, or hate speech</li>
                    <li>• Spam, misleading, or deceptive content</li>
                    <li>• Content that infringes intellectual property rights</li>
                    <li>• Adult content not properly age-gated</li>
                    <li>• Content promoting violence or illegal activities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Conduct */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User Conduct</h2>
          <p className="text-gray-700 mb-4">
            By using our platform, you agree to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-green-700">✓ Do</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Respect other users and their content</li>
                <li>• Provide constructive feedback and comments</li>
                <li>• Report inappropriate content or behavior</li>
                <li>• Follow community guidelines</li>
                <li>• Respect intellectual property rights</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-red-700">✗ Don't</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Harass, bully, or threaten other users</li>
                <li>• Share false or misleading information</li>
                <li>• Attempt to hack or compromise the platform</li>
                <li>• Create multiple accounts to circumvent restrictions</li>
                <li>• Engage in spam or commercial solicitation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Scale className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Intellectual Property</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Your Content</h3>
              <p className="text-gray-700 text-sm">
                You retain ownership of content you upload, but grant us a license to use, display, and distribute it on our platform. You represent that you have the right to share all content you upload.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Our Platform</h3>
              <p className="text-gray-700 text-sm">
                The AzureStream platform, including its design, features, and underlying technology, is protected by intellectual property laws. You may not copy, modify, or reverse engineer our platform.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">DMCA Compliance</h3>
              <p className="text-gray-700 text-sm">
                We respond to valid DMCA takedown notices. If you believe your copyright has been infringed, please contact us with the required information.
              </p>
            </div>
          </div>
        </div>

        {/* Termination */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
          <p className="text-gray-700 mb-4">
            We may terminate or suspend your account and access to the service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
          </p>
          <p className="text-gray-700">
            You may terminate your account at any time by contacting us. Upon termination, your right to use the service will cease immediately.
          </p>
        </div>

        {/* Disclaimers */}
        <div className="bg-gray-900 text-white rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Disclaimers and Limitations</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              <strong className="text-white">Service Availability:</strong> We strive to maintain high availability but cannot guarantee uninterrupted service.
            </p>
            <p>
              <strong className="text-white">Content Accuracy:</strong> We do not verify the accuracy of user-generated content and are not responsible for its quality or reliability.
            </p>
            <p>
              <strong className="text-white">Third-Party Links:</strong> Our platform may contain links to third-party websites. We are not responsible for their content or practices.
            </p>
            <p>
              <strong className="text-white">Limitation of Liability:</strong> To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-3">Questions About These Terms?</h2>
          <p className="text-blue-800 mb-3">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="text-blue-800">
            <p><strong>Email:</strong> legal@azurestream.com</p>
            <p><strong>Address:</strong> 123 Tech Street, San Francisco, CA 94105</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;