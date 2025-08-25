'use client';

interface PrivacyPolicyProps {
  title: string;
  subtitle: string;
  noDataTitle: string;
  description: string;
  localText: string;
  noUploadText: string;
  noStorageText: string;
  secureText: string;
  dataTitle: string;
  dataDesc: string;
  dataClient: string;
  dataNoUpload: string;
  dataNoCollect: string;
  dataLocal: string;
  analyticsTitle: string;
  analyticsDesc: string;
  analyticsGA: string;
  analyticsClarity: string;
  analyticsIP: string;
  rightsTitle: string;
  rightsDesc: string;
  rightsNoData: string;
  rightsControl: string;
  rightsNoAccount: string;
  rightsClear: string;
  className?: string;
}

export default function PrivacyPolicy({ 
  title, 
  subtitle,
  noDataTitle,
  description,
  localText,
  noUploadText,
  noStorageText,
  secureText,
  dataTitle,
  dataDesc,
  dataClient,
  dataNoUpload,
  dataNoCollect,
  dataLocal,
  analyticsTitle,
  analyticsDesc,
  analyticsGA,
  analyticsClarity,
  analyticsIP,
  rightsTitle,
  rightsDesc,
  rightsNoData,
  rightsControl,
  rightsNoAccount,
  rightsClear,
  className = '' 
}: PrivacyPolicyProps) {
  return (
    <section id="privacy" className={`py-16 bg-white ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </div>

        {/* Privacy Content */}
        <div className="bg-green-50 rounded-xl p-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900 mb-3">
                {noDataTitle}
              </h3>
              <div className="text-green-800 space-y-4">
                <p>
                  {description}
                </p>
                
                {/* Privacy Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"></path>
                    </svg>
                    <span className="text-green-800 text-sm">{localText}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"></path>
                    </svg>
                    <span className="text-green-800 text-sm">{noUploadText}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"></path>
                    </svg>
                    <span className="text-green-800 text-sm">{noStorageText}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"></path>
                    </svg>
                    <span className="text-green-800 text-sm">{secureText}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Privacy Information */}
        <div className="mt-8 prose prose-gray max-w-none">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">{dataTitle}</h3>
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-gray-700 mb-4">
              {dataDesc}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>{dataClient.split(':')[0]}:</strong> {dataClient.split(':')[1]}</li>
              <li><strong>{dataNoUpload.split(':')[0]}:</strong> {dataNoUpload.split(':')[1]}</li>
              <li><strong>{dataNoCollect.split(':')[0]}:</strong> {dataNoCollect.split(':')[1]}</li>
              <li><strong>{dataLocal.split(':')[0]}:</strong> {dataLocal.split(':')[1]}</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-4">{analyticsTitle}</h3>
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-gray-700 mb-4">
              {analyticsDesc}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>{analyticsGA.split(':')[0]}:</strong> {analyticsGA.split(':')[1]}</li>
              <li><strong>{analyticsClarity.split(':')[0]}:</strong> {analyticsClarity.split(':')[1]}</li>
              <li><strong>{analyticsIP.split(':')[0]}:</strong> {analyticsIP.split(':')[1]}</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-4">{rightsTitle}</h3>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              {rightsDesc}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>{rightsNoData}</li>
              <li>{rightsControl}</li>
              <li>{rightsNoAccount}</li>
              <li>{rightsClear}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}