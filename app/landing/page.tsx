import Link from "next/link";

export const metadata = {
  title: "Bucket Driver",
  description: "버킷 수거 기사 시스템",
};

interface LandingPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function LandingPage({ searchParams }: LandingPageProps) {
  const { callbackUrl } = await searchParams;
  const loginHref = callbackUrl
    ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/login";

  const features = [
    {
      icon: "assignment",
      title: "배정 수거 확인",
      desc: "오늘 배정받은 수거 목록을 한눈에 확인하세요",
    },
    {
      icon: "scale",
      title: "무게 측정 · 완료 처리",
      desc: "현장에서 무게를 측정하고 사진과 함께 완료 처리합니다",
    },
    {
      icon: "account_balance_wallet",
      title: "수당 조회",
      desc: "기본 수당과 인센티브를 포함한 수당 내역을 확인하세요",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10">
        {/* 헤더 */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <span className="text-lg font-bold">B</span>
            </div>
            <div>
              <p className="text-lg font-bold leading-none">BUCKET</p>
              <p className="text-xs text-indigo-100">드라이버 시스템</p>
            </div>
          </div>
          <Link
            href={loginHref}
            className="rounded-full bg-white/15 px-5 py-2 text-sm font-semibold transition-colors hover:bg-white/25"
          >
            로그인
          </Link>
        </header>

        {/* 히어로 */}
        <main className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            버킷 기사님,
            <br />
            오늘도 안전한 수거 되세요
          </h1>
          <p className="mt-4 max-w-md text-sm text-indigo-100 sm:text-base">
            배정받은 수거를 확인하고, 현장에서 무게를 측정해 완료 처리하고,
            <br className="hidden sm:block" />
            수당까지 한 곳에서 관리하세요.
          </p>
          <Link
            href={loginHref}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-base font-semibold text-indigo-600 shadow-lg transition-all hover:shadow-xl"
          >
            <span className="material-icons-outlined text-xl">login</span>
            기사 계정으로 시작하기
          </Link>

          {/* 기능 카드 */}
          <div className="mt-12 grid w-full gap-4 sm:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl bg-white/10 p-5 text-left backdrop-blur-sm"
              >
                <span className="material-icons-outlined mb-3 text-2xl">
                  {f.icon}
                </span>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-indigo-100">{f.desc}</p>
              </div>
            ))}
          </div>
        </main>

        <footer className="pt-10 text-center text-xs text-indigo-200">
          © {new Date().getFullYear()} BUCKET. 기사 전용 시스템입니다.
        </footer>
      </div>
    </div>
  );
}
