import ExamplesPage from '@/components/ExamplesPage'

interface ExamplesPageRouteProps {
  params: {
    lang: string
  }
}

export default function ExamplesPageRoute({ params }: ExamplesPageRouteProps) {
  return <ExamplesPage lang={params.lang} />
}

export async function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'zh' },
    { lang: 'es' },
    { lang: 'fr' },
    { lang: 'ru' },
    { lang: 'hi' },
    { lang: 'ko' }
  ]
}