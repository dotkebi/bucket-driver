'use client';

import {useParams} from 'next/navigation';
import {useGetFeeEstimate} from '@/src/api/generated/드라이버-수거-관리/드라이버-수거-관리';
import Link from 'next/link';

export default function PickupFeePage() {
  const params = useParams();
  const pickupId = params.id as string;
  
  const { data: fee, isLoading, error } = useGetFeeEstimate(pickupId, {
    query: {
      enabled: !!pickupId,
    },
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !fee) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
          {error instanceof Error ? error.message : '수수료 정보를 찾을 수 없습니다'}
        </div>
        <Link href={`/pickups/${pickupId}`} className="text-blue-600 hover:underline">
          상세보기로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">수수료 확인</h1>
          <p className="text-gray-600">수거 완료에 대한 수수료 내역입니다</p>
        </div>
        <Link
          href={`/pickups/${pickupId}`}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          상세보기
        </Link>
      </div>

      <div className="grid gap-6">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">기본 수당</p>
            <p className="text-2xl font-bold text-gray-900">₩{fee.baseAllowance.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">무게별 수당</p>
            <p className="text-2xl font-bold text-gray-900">₩{fee.weightBasedFee.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">인센티브</p>
            <p className="text-2xl font-bold text-green-600">₩{fee.incentiveAmount.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
            <p className="text-sm text-blue-100 mb-2">총 수당</p>
            <p className="text-3xl font-bold">₩{fee.totalFee.toLocaleString()}</p>
          </div>
        </div>

        {/* Detail Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">수수료 내역</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">기본 수당</p>
                    <p className="text-sm text-gray-500">고정 기본 수당</p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-900">₩{fee.baseAllowance.toLocaleString()}</p>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">무게별 수당</p>
                    <p className="text-sm text-gray-500">수거한 무게에 따른 수당</p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-900">₩{fee.weightBasedFee.toLocaleString()}</p>
              </div>

              {fee.incentiveDetails && fee.incentiveDetails.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 py-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">인센티브</p>
                    </div>
                  </div>
                  {fee.incentiveDetails.map((incentive, index) => (
                    <div key={index} className="ml-13 flex justify-between items-center py-2 pl-4 border-l-2 border-green-200">
                      <div>
                        <p className="font-medium text-gray-900">{incentive.type}</p>
                        {incentive.description && (
                          <p className="text-sm text-gray-500">{incentive.description}</p>
                        )}
                      </div>
                      <p className="text-lg font-semibold text-green-600">₩{incentive.amount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}

              {(!fee.incentiveDetails || fee.incentiveDetails.length === 0) && fee.incentiveAmount > 0 && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">인센티브</p>
                      <p className="text-sm text-gray-500">추가 인센티브</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-green-600">₩{fee.incentiveAmount.toLocaleString()}</p>
                </div>
              )}

              <div className="flex justify-between items-center py-4 pt-6 border-t-2 border-gray-200">
                <p className="text-xl font-bold text-gray-900">총 수당</p>
                <p className="text-2xl font-bold text-blue-600">₩{fee.totalFee.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            href={`/pickups/${pickupId}`}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
          >
            상세보기
          </Link>
          <Link
            href="/allowance"
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
          >
            전체 수당 조회
          </Link>
        </div>
      </div>
    </div>
  );
}
