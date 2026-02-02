import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, X, Sparkles, Zap, Infinity, Gift } from 'lucide-react';

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

        {/* Pricing Cards - 4 Column Layout */}
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

          {/* Tier 2: Single Shot */}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">Single Shot</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">Perfect for a specific application</p>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">$3</span>
                  <span className="text-sm text-gray-500">One-time</span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1 AI Optimization</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">PDF & Docx Download</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">ATS Score Check</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 line-through">Bulk Job Tailoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 line-through">Cover Letter Generation</span>
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <button className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors">
              Optimize One ($3)
            </button>
          </div>

          {/* Tier 3: Job Hunter - MOST POPULAR (Elevated) */}
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
                <h3 className="text-xl font-bold text-gray-900">Job Hunter</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">For the serious job seeker</p>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">$10</span>
                  <span className="text-sm text-gray-500">One-time</span>
                </div>
                <p className="text-xs text-purple-600 font-medium mt-1">$1 per resume!</p>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>10</strong> AI Optimizations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">PDF & Docx Download</span>
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
                  <span className="text-gray-700">Cover Letter Generation</span>
                </li>
              </ul>
            </div>

            {/* CTA Button - Primary */}
            <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl">
              Get Bundle ($10)
            </button>
          </div>

          {/* Tier 3: Unlimited Pro */}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Infinity className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">Unlimited Pro</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">Apply without limits</p>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">$20</span>
                  <span className="text-sm text-gray-500">For 2 Weeks</span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Unlimited</strong> AI Optimizations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">PDF & Docx Download</span>
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
                  <span className="text-gray-700">Cover Letter Generation</span>
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <button className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md">
              Go Unlimited ($20)
            </button>
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
