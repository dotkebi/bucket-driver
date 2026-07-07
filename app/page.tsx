'use client';

import Link from 'next/link';
import {
  useGetAssignedPickups,
  useGetPickupsByStatus
} from '@/src/api/generated/드라이버-수거-관리/드라이버-수거-관리';
import type { DriverPickupItem } from '@/src/api/models';
import { normalizeList } from '@/src/api/normalize-list';

export default function Home() {
  const { data: assignedData } = useGetAssignedPickups();
  const { data: completedData } = useGetPickupsByStatus('COMPLETED');

  const assignedPickups = normalizeList<DriverPickupItem>(assignedData);
  const completedPickups = normalizeList<DriverPickupItem>(completedData);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">대시보드</h1>
        <p className="text-gray-600">드라이버 관리 시스템에 오신 것을 환영합니다</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">배정된 수거</h3>
          <p className="text-3xl font-bold text-gray-900">{assignedPickups.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">완료된 수거</h3>
          <p className="text-3xl font-bold text-gray-900">{completedPickups.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">수당 조회</h3>
          <Link href="/allowance" className="text-blue-600 hover:text-blue-800 font-medium">
            조회하기 →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/pickups/assigned" className="group block p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">배정받은 수거신청</h2>
          </div>
          <p className="text-gray-600">오늘 수거해야 할 목록을 확인하세요</p>
        </Link>

        <Link href="/pickups/completed" className="group block p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">처리한 수거신청</h2>
          </div>
          <p className="text-gray-600">완료한 수거 내역을 확인하세요</p>
        </Link>

        <Link href="/allowance" className="group block p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all md:col-span-2">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">수당 조회</h2>
          </div>
          <p className="text-gray-600">수당 내역을 확인하세요</p>
        </Link>
      </div>
    </div>
  );
}
