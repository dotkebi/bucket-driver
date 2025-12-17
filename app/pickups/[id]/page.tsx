'use client';

import {useParams} from 'next/navigation';
import {useGetPickupDetail} from '@/src/api/generated/드라이버-수거-관리/드라이버-수거-관리';
import Link from 'next/link';

export default function PickupDetailPage() {
  const params = useParams();
  const pickupId = params.id as string;
  
  const { data: pickup, isLoading, error } = useGetPickupDetail(pickupId, {
    query: {
      enabled: !!pickupId,
    },
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ASSIGNED':
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  if (error || !pickup) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
          {error instanceof Error ? error.message : '수거 정보를 찾을 수 없습니다'}
        </div>
        <Link href="/pickups/assigned" className="text-blue-600 hover:underline">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">수거 상세 정보</h1>
          <p className="text-gray-600">수거 정보를 확인하세요</p>
        </div>
        <Link
          href="/pickups/assigned"
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          목록으로
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{pickup.customerName || '고객'}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(pickup.status || '')}`}>
              {pickup.status}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">수거 일시</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-900">{pickup.collectionDate}</span>
                  </div>
                  {pickup.timeSlot && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-900">{pickup.timeSlot} {pickup.specificTime ? `- ${pickup.specificTime}` : ''}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">주소</h3>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-gray-900">{pickup.address}</p>
                    {pickup.detailAddress && (
                      <p className="text-gray-600 text-sm mt-1">{pickup.detailAddress}</p>
                    )}
                    {pickup.roadAddress && (
                      <p className="text-gray-600 text-sm mt-1">{pickup.roadAddress}</p>
                    )}
                    {pickup.zipCode && (
                      <p className="text-gray-500 text-sm mt-1">우편번호: {pickup.zipCode}</p>
                    )}
                    {pickup.buildingName && (
                      <p className="text-gray-500 text-sm mt-1">건물명: {pickup.buildingName}</p>
                    )}
                  </div>
                </div>
              </div>

              {(pickup.accessNotes || pickup.entrancePassword) && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">출입정보</h3>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <div>
                      {pickup.accessNotes && (
                        <p className="text-gray-900">{pickup.accessNotes}</p>
                      )}
                      {pickup.entrancePassword && (
                        <p className="text-gray-600 text-sm mt-1">비밀번호: {pickup.entrancePassword}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {pickup.customerPhone && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">연락처</h3>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${pickup.customerPhone}`} className="text-blue-600 hover:text-blue-800">
                      {pickup.customerPhone}
                    </a>
                  </div>
                </div>
              )}

              {pickup.customerEmail && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">이메일</h3>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${pickup.customerEmail}`} className="text-blue-600 hover:text-blue-800">
                      {pickup.customerEmail}
                    </a>
                  </div>
                </div>
              )}

              {pickup.customerNotes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">고객 메모</h3>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <p className="text-gray-900 whitespace-pre-wrap">{pickup.customerNotes}</p>
                  </div>
                </div>
              )}

              {pickup.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">설명</h3>
                  <p className="text-gray-900">{pickup.description}</p>
                </div>
              )}

              {pickup.collectedWeight && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">수거 무게</h3>
                  <p className="text-gray-900 text-lg font-semibold">{pickup.collectedWeight.toFixed(1)} kg</p>
                </div>
              )}

              {pickup.expectedFee && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">예상 수수료</h3>
                  <p className="text-gray-900 text-lg font-semibold">₩{pickup.expectedFee.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          {pickup.photoUrls && pickup.photoUrls.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-4">수거 사진</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {pickup.photoUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`수거 사진 ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%" y="50%" text-anchor="middle" dy=".3em"%3E이미지 없음%3C/text%3E%3C/svg%3E';
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
            {pickup.status !== 'COMPLETED' && (
              <Link
                href={`/pickups/${pickup.id}/complete`}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
              >
                수거 완료 처리
              </Link>
            )}
            {pickup.status === 'COMPLETED' && (
              <Link
                href={`/pickups/${pickup.id}/fee`}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-center"
              >
                수수료 확인
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
