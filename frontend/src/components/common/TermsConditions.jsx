// TermsConditions.jsx
import React from 'react';
import { ArrowLeft, Shield, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './LegalDocs.css';

const TermsConditions = () => {
  const lastUpdated = "December 1, 2023";

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
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
                <p className="text-gray-600 mt-1">Last Updated: {lastUpdated}</p>
              </div>
            </div>
            <div className="hidden md:block">
              <Shield className="h-12 w-12 text-gray-300" />
            </div>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3" />
              <p className="text-yellow-700">
                <strong>Important:</strong> Please read these Terms carefully before using FarmChainX services. 
                By accessing or using our platform, you agree to be bound by these Terms.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Table of Contents */}
          <div className="mb-10 p-6 bg-gray-50 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Table of Contents</h2>
            <ol className="list-decimal pl-5 space-y-2 text-primary-600">
              <li><a href="#acceptance" className="hover:text-primary-700">Acceptance of Terms</a></li>
              <li><a href="#definitions" className="hover:text-primary-700">Definitions</a></li>
              <li><a href="#accounts" className="hover:text-primary-700">User Accounts</a></li>
              <li><a href="#marketplace" className="hover:text-primary-700">Marketplace Terms</a></li>
              <li><a href="#traceability" className="hover:text-primary-700">Traceability Services</a></li>
              <li><a href="#transactions" className="hover:text-primary-700">Transactions & Payments</a></li>
              <li><a href="#intellectual" className="hover:text-primary-700">Intellectual Property</a></li>
              <li><a href="#liability" className="hover:text-primary-700">Limitation of Liability</a></li>
              <li><a href="#termination" className="hover:text-primary-700">Termination</a></li>
              <li><a href="#governing" className="hover:text-primary-700">Governing Law</a></li>
              <li><a href="#changes" className="hover:text-primary-700">Changes to Terms</a></li>
            </ol>
          </div>

          {/* Terms Sections */}
          <div className="space-y-10">
            <section id="acceptance">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
                Acceptance of Terms
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>
                  By accessing and using FarmChainX ("Platform"), you accept and agree to be bound by these 
                  Terms and Conditions ("Terms"). If you do not agree to these Terms, you may not access or 
                  use the Platform. These Terms constitute a legally binding agreement between you and 
                  FarmChainX Technologies Inc.
                </p>
                <p className="mt-4">
                  The Platform provides an AI-driven agricultural traceability system and marketplace 
                  connecting farmers ("Producers") with buyers ("Purchasers") for agricultural products.
                </p>
              </div>
            </section>

            <section id="definitions">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
                Definitions
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>"Platform"</strong> refers to FarmChainX website, mobile applications, and associated services</li>
                  <li><strong>"Producer"</strong> means registered farmers, growers, or agricultural producers using the Platform to sell products</li>
                  <li><strong>"Purchaser"</strong> means registered buyers, retailers, or distributors purchasing products through the Platform</li>
                  <li><strong>"Product"</strong> means agricultural goods listed on the Platform</li>
                  <li><strong>"Traceability Data"</strong> refers to blockchain-recorded information about product origin, handling, and transport</li>
                  <li><strong>("Content")</strong> includes all information, data, text, images, and materials uploaded to the Platform</li>
                </ul>
              </div>
            </section>

            <section id="accounts">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
                User Accounts & Registration
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p><strong>3.1 Eligibility</strong></p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>You must be at least 18 years old to register</li>
                  <li>Producers must provide valid agricultural business registration details</li>
                  <li>Purchasers must provide valid business identification</li>
                  <li>You warrant that all information provided is accurate and complete</li>
                </ul>

                <p className="mt-6"><strong>3.2 Account Security</strong></p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>You are responsible for maintaining account confidentiality</li>
                  <li>You must notify us immediately of any unauthorized access</li>
                  <li>FarmChainX reserves the right to disable accounts for security concerns</li>
                </ul>
              </div>
            </section>

            <section id="marketplace">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
                Marketplace Terms
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p><strong>4.1 Product Listings</strong></p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Producers must provide accurate product descriptions, quantities, and pricing</li>
                  <li>All products must comply with applicable agricultural and food safety regulations</li>
                  <li>Producers warrant they have legal rights to sell listed products</li>
                  <li>Misrepresentation of products may result in account suspension</li>
                </ul>

                <p className="mt-6"><strong>4.2 Transaction Process</strong></p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Purchasers may place orders through the Platform</li>
                  <li>Producers have 24 hours to accept or reject orders</li>
                  <li>Accepted orders constitute binding agreements between Producer and Purchaser</li>
                  <li>FarmChainX acts as an intermediary and is not a party to transactions</li>
                </ul>
              </div>
            </section>

            <section id="traceability">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">5</span>
                Traceability Services
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p><strong>5.1 Data Accuracy</strong></p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Producers are responsible for accurate traceability data input</li>
                  <li>Traceability data is recorded on blockchain for immutability</li>
                  <li>FarmChainX verifies but does not guarantee data accuracy</li>
                  <li>Users may access traceability data for transparency purposes</li>
                </ul>

                <p className="mt-6"><strong>5.2 Blockchain Recording</strong></p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>All traceability data is recorded on distributed ledger technology</li>
                  <li>Once recorded, data cannot be altered or deleted</li>
                  <li>Users grant FarmChainX license to record and display traceability data</li>
                </ul>
              </div>
            </section>

            <section id="transactions">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">6</span>
                Transactions & Payments
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p><strong>6.1 Payment Processing</strong></p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>FarmChainX facilitates payment processing through secure third-party providers</li>
                  <li>Platform fee of 3% applies to all successful transactions</li>
                  <li>Payments are held in escrow until delivery confirmation</li>
                  <li>Refunds processed according to our Refund Policy</li>
                </ul>

                <p className="mt-6"><strong>6.2 Dispute Resolution</strong></p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Users must attempt to resolve disputes directly first</li>
                  <li>FarmChainX may mediate disputes at its discretion</li>
                  <li>Platform decisions on disputes are final</li>
                </ul>
              </div>
            </section>

            <section id="intellectual">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">7</span>
                Intellectual Property
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>FarmChainX retains all rights, title, and interest in:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>The Platform and its underlying technology</li>
                  <li>All software, algorithms, and AI models</li>
                  <li>FarmChainX trademarks, logos, and branding</li>
                  <li>Aggregated and anonymized platform data</li>
                </ul>
                <p className="mt-4">Users retain ownership of their uploaded content but grant FarmChainX license to use it for Platform operations.</p>
              </div>
            </section>

            <section id="liability">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">8</span>
                Limitation of Liability
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                  <p className="text-red-700">
                    <strong>Disclaimer:</strong> FarmChainX provides the Platform "as is" without warranties of any kind. 
                    We are not liable for:
                  </p>
                </div>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Product quality, safety, or compliance</li>
                  <li>Transactions between users</li>
                  <li>Interruptions or Platform unavailability</li>
                  <li>Indirect, incidental, or consequential damages</li>
                  <li>Maximum liability limited to platform fees paid in last 6 months</li>
                </ul>
              </div>
            </section>

            <section id="termination">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">9</span>
                Termination
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>Either party may terminate these Terms:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>FarmChainX may suspend or terminate accounts for Terms violations</li>
                  <li>Users may terminate by deleting their account</li>
                  <li>Termination does not affect obligations incurred prior to termination</li>
                  <li>Surviving sections include: Intellectual Property, Liability, Governing Law</li>
                </ul>
              </div>
            </section>

            <section id="governing">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">10</span>
                Governing Law & Dispute Resolution
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <ul className="list-disc pl-6 space-y-2">
                  <li>These Terms are governed by the laws of the State of California</li>
                  <li>Disputes shall be resolved through binding arbitration in San Francisco, CA</li>
                  <li>Class action waivers apply</li>
                  <li>Users may opt-out of arbitration within 30 days of account creation</li>
                </ul>
              </div>
            </section>

            <section id="changes">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">11</span>
                Changes to Terms
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>
                  FarmChainX reserves the right to modify these Terms at any time. We will:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Notify users of material changes via email or Platform notification</li>
                  <li>Post updated Terms with new effective date</li>
                  <li>Provide 30-day notice for significant changes</li>
                  <li>Continued use after changes constitutes acceptance</li>
                </ul>
              </div>
            </section>
          </div>

          {/* Acceptance Section */}
          <div className="mt-12 p-6 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">Acceptance Confirmation</h3>
                <p className="text-green-700 mt-2">
                  By using FarmChainX, you acknowledge that you have read, understood, and agree to be bound 
                  by these Terms and Conditions. If you have any questions, please contact our legal team at 
                  <a href="mailto:legal@farmchainx.com" className="text-primary-600 hover:text-primary-700 ml-1">
                    legal@farmchainx.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>FarmChainX Technologies Inc. | 28-1170/1, T Nagar, Chennai | +91 9686322533</p>
            <p className="mt-2">Document ID: TOS-2023-001 | Effective Date: {lastUpdated}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;