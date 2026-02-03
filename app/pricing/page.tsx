import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, X, Sparkles, Zap, Infinity, Gift } from 'lucide-react';
import { PayPalButton } from '@/components/PayPalButton';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Optimize your resume with AI-powered analysis. Pick the plan that fits your job search needs.
          </p>
        </div>

        {/* Pricing Cards - 4 Column Layout (Free + 3 Paid Tiers) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Tier 1: Free Audit */}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Free Audit</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">Curious users</p>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-sm text-gray-500">Free</span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">ATS Score Analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Keyword Gap Detection</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 line-through">Full AI Rewrite (Preview Only)</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 line-through">File Download (PDF/Docx)</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 line-through">Cover Letter</span>
                </li>
              </ul>
            </div>

            {/* CTA Button - Outline Style */}
            <button className="w-full px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold rounded-lg transition-colors bg-white">
              Get Started for Free
            </button>
          </div>

          {/* Tier 2: Starter */}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">Starter</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">Perfect for trying out our service</p>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">$3</span>
                  <span className="text-sm text-gray-500">One-time</span>
                </div>
                <p className="text-xs text-indigo-600 font-medium mt-1">5 Credits</p>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>5 Credits</strong> - Download or optimize 5 times</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">PDF & Docx Download</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">AI Optimization</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">ATS Score Check</span>
                </li>
              </ul>
            </div>

            {/* CTA Button - PayPal */}
            <div className="mt-auto">
              <PayPalButton amount={3} planName="Starter" />
            </div>
          </div>

          {/* Tier 3: Pro - MOST POPULAR (Elevated) */}
          <div className="bg-white rounded-xl border-2 border-purple-600 shadow-xl hover:shadow-2xl transition-all p-8 flex flex-col transform scale-105 relative lg:scale-105">
            {/* Most Popular Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                MOST POPULAR
              </span>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">Pro</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">Best value for serious job seekers</p>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">$9</span>
                  <span className="text-sm text-gray-500">One-time</span>
                </div>
                <p className="text-xs text-purple-600 font-medium mt-1">20 Credits</p>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>20 Credits</strong> - Download or optimize 20 times</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">PDF & Docx Download</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">AI Optimization</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">ATS Score Check</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Bulk Job Tailoring</span>
                </li>
              </ul>
            </div>

            {/* CTA Button - PayPal */}
            <div className="mt-auto">
              <PayPalButton amount={9} planName="Pro" />
            </div>
          </div>

          {/* Tier 4: Ultimate - BEST VALUE (Elevated) */}
          <div className="bg-white rounded-xl border-2 border-amber-500 shadow-xl hover:shadow-2xl transition-all p-8 flex flex-col transform scale-105 relative lg:scale-105">
            {/* Best Value Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                BEST VALUE
              </span>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-amber-600" />
                <h3 className="text-xl font-bold text-gray-900">Ultimate</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">Maximum credits for power users</p>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">$20</span>
                  <span className="text-sm text-gray-500">One-time</span>
                </div>
                <p className="text-xs text-amber-600 font-medium mt-1">60 Credits</p>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>60 Credits</strong> - Download or optimize 60 times</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">PDF & Docx Download</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">AI Optimization</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">ATS Score Check</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Bulk Job Tailoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Priority Support</span>
                </li>
              </ul>
            </div>

            {/* CTA Button - PayPal */}
            <div className="mt-auto">
              <PayPalButton amount={20} planName="Ultimate" />
            </div>
          </div>

        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            All plans include secure processing and instant results. No hidden fees.
          </p>
        </div>
      </div>
    </div>
  );
}
