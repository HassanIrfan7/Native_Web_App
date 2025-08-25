import React from 'react';
import { Shield, Eye, Lock, Users, FileText, AlertCircle } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  const sections = [
    {
      icon: Eye,
      title: 'Information We Collect',
      content: [
        'Account information (username, email, profile details)',
        'Content you upload (videos, photos, comments, ratings)',
        'Usage data (viewing history, interactions, preferences)',
        'Device information (IP address, browser type, operating system)',
        'Cookies and similar tracking technologies'
      ]
    },
    {
      icon: Users,
      title: 'How We Use Your Information',
      content: [
        'Provide and improve our services',
        'Personalize your experience and content recommendations',
        'Communicate with you about your account and our services',
        'Ensure platform security and prevent fraud',
        'Comply with legal obligations and enforce our terms'
      ]
    },
    {
      icon: Shield,
      title: 'Information Sharing',
      content: [
        'We do not sell your personal information to third parties',
        'Content you make public is visible to other users',
        'We may share data with service providers who help operate our platform',
        'Legal compliance may require disclosure to authorities',
        'Business transfers may involve data transfer to new owners'
      ]
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: [
        'Industry-standard encryption for data transmission and storage',
        'Regular security audits and vulnerability assessments',
        'Access controls and authentication measures',
        'Secure cloud infrastructure powered by Microsoft Azure',
        'Incident response procedures for potential breaches'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 w-16 h-16 mx-auto mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <p className="text-gray-700 mb-4">
            At AzureStream, we are committed to protecting your privacy and ensuring transparency about how we handle your personal information. This Privacy Policy explains what information we collect, how we use it, and your rights regarding your data.
          </p>
          <p className="text-gray-700">
            By using our platform, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
          </p>
        </div>

        {/* Main Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Your Rights */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-green-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Access & Portability</h3>
              <p className="text-gray-700 text-sm mb-4">
                You can request a copy of your personal data and download your content at any time.
              </p>
              
              <h3 className="font-semibold text-gray-900 mb-2">Correction & Updates</h3>
              <p className="text-gray-700 text-sm">
                You can update your account information and correct inaccuracies through your profile settings.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Deletion</h3>
              <p className="text-gray-700 text-sm mb-4">
                You can delete your account and request removal of your personal data, subject to legal requirements.
              </p>
              
              <h3 className="font-semibold text-gray-900 mb-2">Opt-out</h3>
              <p className="text-gray-700 text-sm">
                You can opt out of certain data processing activities and marketing communications.
              </p>
            </div>
          </div>
        </div>

        {/* Cookies */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
          <p className="text-gray-700 mb-4">
            We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-1">Cookie Types</h3>
                <p className="text-sm text-blue-800">
                  Essential cookies for platform functionality, analytics cookies for usage insights, and preference cookies for personalization.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* International Transfers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
          <p className="text-gray-700 mb-4">
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during international transfers.
          </p>
          <p className="text-gray-700">
            We comply with applicable data protection laws, including GDPR for European users and CCPA for California residents.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-900 text-white rounded-lg p-8 mt-8">
          <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
          <p className="text-gray-300 mb-6">
            If you have questions about this Privacy Policy or how we handle your data, please contact our privacy team.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-300">privacy@azurestream.com</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Mail</h3>
              <p className="text-gray-300">
                Privacy Officer<br />
                AzureStream Inc.<br />
                123 Tech Street<br />
                San Francisco, CA 94105
              </p>
            </div>
          </div>
        </div>

        {/* Updates */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 mt-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-900 mb-1">Policy Updates</h3>
              <p className="text-sm text-yellow-800">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;