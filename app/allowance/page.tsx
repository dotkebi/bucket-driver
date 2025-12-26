'use client';

// import {useCallback, useEffect, useState} from 'react';
// import {useGetAllowance, useGetThisMonthAllowance} from '@/src/api/generated/드라이버-수거-관리/드라이버-수거-관리';
// import type {DriverAllowance} from '@/src/api/models';

export default function AllowancePage() {
  // TODO: API 엔드포인트 구현 후 활성화
  // const [allowance, setAllowance] = useState<DriverAllowance | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  // const [startDate, setStartDate] = useState('');
  // const [endDate, setEndDate] = useState('');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">수당 조회</h1>
        <p className="text-gray-600">수당 내역을 확인하세요</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
              준비 중인 기능입니다
            </h3>
            <p className="text-yellow-800">
              수당 조회 API가 아직 구현되지 않았습니다.<br />
              백엔드 API 엔드포인트 구현 후 이 페이지가 활성화됩니다.
            </p>
            <div className="mt-4 text-sm text-yellow-700">
              <p className="font-medium">필요한 API 엔드포인트:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><code className="bg-yellow-100 px-2 py-0.5 rounded">GET /api/driver/allowance/this-month</code></li>
                <li><code className="bg-yellow-100 px-2 py-0.5 rounded">GET /api/driver/allowance?startDate=&endDate=</code></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 원본 코드 (API 구현 후 복원)
/*
export default function AllowancePage() {
  const [allowance, setAllowance] = useState<DriverAllowance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const setDefaultDates = useCallback(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }, []);

  const { refetch: fetchThisMonthAllowance } = useGetThisMonthAllowance(undefined, {
    query: { enabled: false },
  });

  const { refetch: fetchAllowance } = useGetAllowance(
    { startDate, endDate },
    { query: { enabled: false } }
  );

  const loadThisMonthAllowance = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await fetchThisMonthAllowance();
      setAllowance(data as DriverAllowance);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '수당 정보를 불러오는데 실패했습니다';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [fetchThisMonthAllowance]);

  const loadAllowance = async () => {
    if (!startDate || !endDate) {
      setError('시작일과 종료일을 입력해주세요');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data } = await fetchAllowance();
      setAllowance(data as DriverAllowance);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '수당 정보를 불러오는데 실패했습니다';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThisMonthAllowance();
    setDefaultDates();
  }, [loadThisMonthAllowance, setDefaultDates]);

  if (loading && !allowance) {
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">수당 조회</h1>
        <p className="text-gray-600">수당 내역을 확인하세요</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">시작일</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">종료일</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={loadAllowance}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            조회
          </button>
        </div>
      </div>

      {allowance && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-2">총 수거 건수</p>
              <p className="text-3xl font-bold text-gray-900">{allowance.totalPickups}건</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-2">총 수거 무게</p>
              <p className="text-3xl font-bold text-gray-900">{allowance.totalWeight.toFixed(1)}kg</p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white col-span-2">
              <p className="text-sm text-blue-100 mb-2">총 수당</p>
              <p className="text-3xl font-bold">₩{allowance.totalAllowance.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">수당 내역</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      수거 ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      수거일
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      무게 (kg)
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      수당
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allowance.details.map((detail) => (
                    <tr key={detail.pickupId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {detail.pickupId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {detail.collectionDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {detail.collectedWeight.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                        ₩{detail.allowance.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
*/
