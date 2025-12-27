// PrivacyPolicy.jsx
import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Database, Users, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import './LegalDocs.css';

const PrivacyPolicy = () => {
  const lastUpdated = "December 1, 2023";

  const dataCategories = [
    { name: 'Personal Information', examples: 'Name, email, phone, address' },
    { name: 'Business Information', examples: 'Business registration, tax ID, licenses' },
    { name: 'Financial Data', examples: 'Payment information, transaction history' },
    { name: 'Agricultural Data', examples: 'Crop information, farming practices, yield data' },
    { name: 'Traceability Data', examples: 'Product origin, handling, transportation details' },
    { name: 'Technical Data', examples: 'IP address, device information, usage patterns' }
  ];

  const purposes = [
    'Provide and improve our Platform services',
    'Facilitate transactions between Producers and Purchasers',
    'Maintain accurate traceability records',
    'Ensure Platform security and prevent fraud',
    'Comply with legal obligations',
    'Communicate important updates and notifications',
    'Personalize user experience',
    'Conduct research and analytics'
  ];

  return (
    <div className="legal-doc-container bg-gradient-to-b from-gray-50 to-white min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 p-3 rounded-xl">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
                <p className="text-gray-600 mt-1">Last Updated: {lastUpdated}</p>
              </div>
            </div>
            <div className="hidden md:block">
              <Lock className="h-12 w-12 text-gray-300" />
            </div>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <Eye className="h-5 w-5 text-blue-400 mr-3" />
              <p className="text-blue-700">
                <strong>Transparency Commitment:</strong> At FarmChainX, we believe in transparency not just 
                in agriculture but also in how we handle your personal information. This Privacy Policy explains 
                our data practices in clear, understandable language.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Quick Overview */}
          <div className="mb-10 p-6 bg-gray-50 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center mb-2">
                  <Database className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="font-medium">Data We Collect</h3>
                </div>
                <p className="text-sm text-gray-600">Information necessary for Platform operation and traceability</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center mb-2">
                  <Users className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="font-medium">How We Use It</h3>
                </div>
                <p className="text-sm text-gray-600">To provide services, ensure security, and improve your experience</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center mb-2">
                  <Globe className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="font-medium">Your Rights</h3>
                </div>
                <p className="text-sm text-gray-600">Access, correct, delete, or restrict use of your personal data</p>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="mb-10 p-6 bg-gray-50 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Table of Contents</h2>
            <ol className="list-decimal pl-5 space-y-2 text-primary-600">
              <li><a href="#introduction" className="hover:text-primary-700">Introduction</a></li>
              <li><a href="#data-collection" className="hover:text-primary-700">Information We Collect</a></li>
              <li><a href="#data-use" className="hover:text-primary-700">How We Use Your Information</a></li>
              <li><a href="#data-sharing" className="hover:text-primary-700">Information Sharing</a></li>
              <li><a href="#data-protection" className="hover:text-primary-700">Data Security</a></li>
              <li><a href="#data-retention" className="hover:text-primary-700">Data Retention</a></li>
              <li><a href="#user-rights" className="hover:text-primary-700">Your Rights & Choices</a></li>
              <li><a href="#international" className="hover:text-primary-700">International Transfers</a></li>
              <li><a href="#children" className="hover:text-primary-700">Children's Privacy</a></li>
              <li><a href="#changes" className="hover:text-primary-700">Changes to Policy</a></li>
              <li><a href="#contact" className="hover:text-primary-700">Contact Us</a></li>
            </ol>
          </div>

          {/* Policy Sections */}
          <div className="space-y-10">
            <section id="introduction">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
                Introduction
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>
                  FarmChainX Technologies Inc. ("we," "our," or "us") is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                  when you use our agricultural traceability and marketplace platform.
                </p>
                <p className="mt-4">
                  Please read this Privacy Policy carefully. By accessing or using FarmChainX, you agree to 
                  the collection and use of information in accordance with this policy. If you do not agree 
                  with the terms, please do not access the Platform.
                </p>
              </div>
            </section>

            <section id="data-collection">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
                Information We Collect
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">2.1 Information You Provide</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {dataCategories.map((category, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{category.examples}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Usage Data:</strong> Pages visited, time spent, features used</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                <li><strong>Location Data:</strong> Approximate location based on IP address</li>
                <li><strong>Cookies and Tracking:</strong> We use cookies as described in our Cookie Policy</li>
              </ul>
            </section>

            <section id="data-use">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
                How We Use Your Information
              </h2>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p className="text-blue-700">
                  We process your personal information based on legitimate business interests, contractual 
                  necessity, legal obligations, and with your consent when required.
                </p>
              </div>

              <div className="space-y-4">
                {purposes.map((purpose, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-primary-100 text-primary-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-1 flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{purpose}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Legal Basis for Processing</h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li><strong>Contractual:</strong> To provide the services you requested</li>
                  <li><strong>Legitimate Interests:</strong> To improve and secure our Platform</li>
                  <li><strong>Legal Obligation:</strong> To comply with applicable laws</li>
                  <li><strong>Consent:</strong> For marketing communications and certain data processing</li>
                </ul>
              </div>
            </section>

            <section id="data-sharing">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
                Information Sharing & Disclosure
              </h2>
              
              <div className="prose prose-lg max-w-none text-gray-700">
                <p><strong>4.1 With Other Users</strong></p>
                <p className="mt-2">
                  Certain information is shared with other Platform users to facilitate transactions:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Producers see Purchaser's delivery information for order fulfillment</li>
                  <li>Purchasers see Producer's business information and product details</li>
                  <li>Traceability data is visible to all parties in the supply chain</li>
                </ul>

                <p className="mt-6"><strong>4.2 With Service Providers</strong></p>
                <p className="mt-2">We share information with trusted third-party providers for:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Payment processing (Stripe, PayPal)</li>
                  <li>Cloud hosting and infrastructure (AWS, Google Cloud)</li>
                  <li>Blockchain services for traceability recording</li>
                  <li>Customer support and analytics</li>
                </ul>

                <p className="mt-6"><strong>4.3 Legal Requirements</strong></p>
                <p className="mt-2">
                  We may disclose information if required by law, court order, or government request, 
                  or to protect our rights, property, or safety.
                </p>
              </div>
            </section>

            <section id="data-protection">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">5</span>
                Data Security
              </h2>
              
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>
                  We implement comprehensive security measures to protect your information:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li><strong>Encryption:</strong> All data transmitted is encrypted using TLS 1.2+</li>
                  <li><strong>Access Controls:</strong> Role-based access and multi-factor authentication</li>
                  <li><strong>Blockchain Security:</strong> Traceability data secured through distributed ledger technology</li>
                  <li><strong>Regular Audits:</strong> Security assessments and penetration testing</li>
                  <li><strong>Employee Training:</strong> Strict confidentiality agreements and security training</li>
                </ul>
                
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">
                    <strong>Important:</strong> While we implement industry-standard security measures, 
                    no method of transmission over the Internet or electronic storage is 100% secure. 
                    We cannot guarantee absolute security.
                  </p>
                </div>
              </div>
            </section>

            <section id="data-retention">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">6</span>
                Data Retention
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Data Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Retention Period</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Account Information</td>
                      <td className="px-4 py-3 text-sm text-gray-700">7 years after account closure</td>
                      <td className="px-4 py-3 text-sm text-gray-600">For legal and tax compliance</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Transaction Data</td>
                      <td className="px-4 py-3 text-sm text-gray-700">10 years</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Financial record keeping</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Traceability Data</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Permanent</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Immutable blockchain record</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Marketing Data</td>
                      <td className="px-4 py-3 text-sm text-gray-700">2 years after last interaction</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Subject to consent renewal</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="user-rights">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">7</span>
                Your Rights & Choices
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Subject Rights</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">✓</div>
                      <span className="text-gray-700">Right to access your personal data</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">✓</div>
                      <span className="text-gray-700">Right to correct inaccurate data</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">✓</div>
                      <span className="text-gray-700">Right to delete your data (with limitations)</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">✓</div>
                      <span className="text-gray-700">Right to data portability</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">✓</div>
                      <span className="text-gray-700">Right to object to processing</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Choices</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">⚙️</div>
                      <span className="text-gray-700">Update preferences in account settings</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">📧</div>
                      <span className="text-gray-700">Opt-out of marketing communications</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">🍪</div>
                      <span className="text-gray-700">Manage cookie preferences</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">👁️</div>
                      <span className="text-gray-700">Request data processing report</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-6 bg-primary-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Exercising Your Rights</h4>
                <p className="text-gray-700">
                  To exercise any of these rights, please contact our Data Protection Officer at 
                  <a href="mailto:privacy@farmchainx.com" className="text-primary-600 hover:text-primary-700 ml-1">
                    privacy@farmchainx.com
                  </a>. We will respond within 30 days.
                </p>
              </div>
            </section>

            <section id="international">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">8</span>
                International Data Transfers
              </h2>
              
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>
                  Your information may be transferred to and processed in countries other than your own. 
                  We ensure appropriate safeguards are in place:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Standard Contractual Clauses for EU/UK data transfers</li>
                  <li>Adequacy decisions for approved countries</li>
                  <li>Data processing agreements with all service providers</li>
                  <li>Regular transfer impact assessments</li>
                </ul>
              </div>
            </section>

            <section id="children">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">9</span>
                Children's Privacy
              </h2>
              
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>
                  FarmChainX is not intended for children under 18 years of age. We do not knowingly 
                  collect personal information from children. If you believe a child has provided us 
                  with personal information, please contact us immediately.
                </p>
              </div>
            </section>

            <section id="changes">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">10</span>
                Changes to This Privacy Policy
              </h2>
              
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>
                  We may update this Privacy Policy periodically. We will notify you of significant 
                  changes by:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Posting the new Privacy Policy on this page</li>
                  <li>Sending email notification to registered users</li>
                  <li>Displaying a notice on the Platform before changes take effect</li>
                </ul>
                <p className="mt-4">
                  Continued use of the Platform after changes constitutes acceptance of the updated policy.
                </p>
              </div>
            </section>

            <section id="contact">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">11</span>
                Contact Us
              </h2>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  If you have questions about this Privacy Policy or our data practices, please contact:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 text-primary-600">📧</div>
                    <div>
                      <p className="font-medium">General Inquiries</p>
                      <a href="mailto:privacy@farmchainx.com" className="text-primary-600 hover:text-primary-700">
                        privacy@farmchainx.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 text-primary-600">👨‍⚖️</div>
                    <div>
                      <p className="font-medium">Data Protection Officer</p>
                      <a href="mailto:dpo@farmchainx.com" className="text-primary-600 hover:text-primary-700">
                        dpo@farmchainx.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 text-primary-600">📞</div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href="tel:+91 9686322533" className="text-primary-600 hover:text-primary-700">
                        +91 9686322533
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 text-primary-600">📍</div>
                    <div>
                      <p className="font-medium">Mailing Address</p>
                      <p className="text-gray-700">FarmChainX Technologies Inc.<br/>28-1170/1,T Nagar, Chennai, </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p>FarmChainX Technologies Inc. | Data Protection Registration: ZA123456</p>
                <p className="mt-1">ICO Registration Number: Z123456X</p>
              </div>
              <div className="text-right">
                <p>Document ID: PP-2023-001</p>
                <p className="mt-1">Effective Date: {lastUpdated}</p>
              </div>
            </div>
            <p className="mt-4">
              For India residents: Please see our <a href="#" className="text-primary-600 hover:text-primary-700">CCPA Supplement</a>.
              For Forigen residents: Please see our <a href="#" className="text-primary-600 hover:text-primary-700">GDPR Compliance Statement</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;