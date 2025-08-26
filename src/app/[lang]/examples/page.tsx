import ExamplesPage from '@/components/ExamplesPage'

interface ExamplesPageRouteProps {
  params: Promise<{
    lang: string
  }>
}

export default async function ExamplesPageRoute({ params }: ExamplesPageRouteProps) {
  const { lang } = await params
  return <ExamplesPage lang={lang} />
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