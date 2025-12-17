"use client";
/* eslint-disable @next/next/no-img-element */

import {useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {useCompletePickup} from '@/src/api/generated/드라이버-수거-관리/드라이버-수거-관리';
import {useQueryClient} from '@tanstack/react-query';
import Link from 'next/link';

export default function CompletePickupPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const pickupId = params.id as string;
  
  const [weight, setWeight] = useState('');
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [photoInput, setPhotoInput] = useState('');
  const [uploading, setUploading] = useState(false);

  const { mutate: completePickup, isPending: submitting, error } = useCompletePickup({
    mutation: {
      onSuccess: () => {
        // 관련 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: ['/api/driver/pickups'] });
        queryClient.invalidateQueries({ queryKey: [`/api/driver/pickups/${pickupId}`] });
        router.push(`/pickups/${pickupId}`);
      },
      onError: (err) => {
        console.error('Complete pickup error:', err);
      },
    },
  });

  const addPhotoUrl = () => {
    if (photoInput.trim()) {
      setPhotoUrls([...photoUrls, photoInput.trim()]);
      setPhotoInput('');
    }
  };

  const removePhotoUrl = (index: number) => {
    setPhotoUrls(photoUrls.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // For now, we'll use FileReader to convert to base64 or URL
    // In production, you'd upload to a file server first
    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Create a data URL for preview (in production, upload to server first)
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            newUrls.push(reader.result as string);
            if (newUrls.length === files.length) {
              setPhotoUrls([...photoUrls, ...newUrls]);
              setUploading(false);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      return;
    }

    completePickup({
      pickupId,
      data: {
        weight: weightNum,
        photoUrls: photoUrls.length > 0 ? photoUrls : [],
      },
    });
  };

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
      ? error
      : error
      ? '수거 완료 처리에 실패했습니다'
      : null;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">수거 완료 처리</h1>
          <p className="text-gray-600">수거한 무게와 사진을 등록하세요</p>
        </div>
        <Link
          href={`/pickups/${pickupId}`}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          상세보기
        </Link>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
              수거 무게 (kg) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="weight"
                step="0.1"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 15.5"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">kg</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">수거한 폐기물의 무게를 입력하세요</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              수거 사진
            </label>
            
            {/* File Upload */}
            <div className="mb-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF (최대 10MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            {/* URL Input */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">또는 URL로 추가:</p>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={photoInput}
                  onChange={(e) => setPhotoInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/photo.jpg"
                  disabled={uploading}
                />
                <button
                  type="button"
                  onClick={addPhotoUrl}
                  disabled={uploading || !photoInput.trim()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  추가
                </button>
              </div>
            </div>

            {/* Photo Preview */}
            {photoUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photoUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`수거 사진 ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%" y="50%" text-anchor="middle" dy=".3em"%3E이미지 없음%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removePhotoUrl(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {uploading && (
              <div className="mt-2 text-sm text-blue-600">사진 업로드 중...</div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={submitting || !weight}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? '처리 중...' : '완료 처리'}
            </button>
            <Link
              href={`/pickups/${pickupId}`}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
