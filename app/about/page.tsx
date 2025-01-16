import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">حول منشئ روبوتات تيليجرام</h1>
      <p className="mb-4">
        منشئ روبوتات تيليجرام هو منصة قوية تتيح لك إنشاء وإدارة روبوتات تيليجرام بسهولة. مع واجهة سهلة الاستخدام ودعم الذكاء الاصطناعي، يمكنك إنشاء روبوتات متطورة دون الحاجة إلى مهارات برمجة متقدمة.
      </p>
      <h2 className="text-2xl font-semibold mb-4">الميزات الرئيسية:</h2>
      <ul className="list-disc list-inside mb-4">
        <li>إنشاء روبوتات تيليجرام مخصصة</li>
        <li>دعم الذكاء الاصطناعي لتحسين تفاعلات الروبوت</li>
        <li>لوحة تحكم سهلة الاستخدام لإدارة الروبوتات</li>
        <li>إحصائيات مفصلة لأداء الروبوت</li>
        <li>إمكانية تخصيص رسائل الترحيب والردود</li>
        <li>دعم للغة العربية</li>
      </ul>
      <p className="mb-4">
        سواء كنت تريد إنشاء روبوت للدردشة، أو لتقديم خدمة العملاء، أو لأغراض تعليمية، فإن منصتنا توفر لك الأدوات اللازمة لتحقيق ذلك بسهولة وفعالية.
      </p>
      <Link href="/">
        <Button>العودة إلى الصفحة الرئيسية</Button>
      </Link>
    </div>
  )
}

