import dynamic from 'next/dynamic'

// 使用 dynamic import 来避免 SSR 水合错误
const HomePage = dynamic(() => import('@/components/HomePage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Image Pixelator...</p>
      </div>
    </div>
  )
})

export default function Home({ params }: { params: { lang: string } }) {
  return <HomePage lang={params.lang} />
}