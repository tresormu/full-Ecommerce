import { useState } from "react";
import Layout from "../layouts/layout";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp, Package, RotateCcw, CreditCard, User } from "lucide-react";
import { Link } from "react-router-dom";

interface FAQItem { q: string; a: string; }
interface FAQSection { icon: React.ReactNode; label: string; items: FAQItem[]; }

export default function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggle = (key: string) => setOpenIndex(openIndex === key ? null : key);

  const sections: FAQSection[] = [
    {
      icon: <Package className="w-5 h-5" />,
      label: t('faq.ordersShipping'),
      items: [
        { q: t('faq.q1'), a: t('faq.a1') },
        { q: t('faq.q2'), a: t('faq.a2') },
        { q: t('faq.q3'), a: t('faq.a3') },
        { q: t('faq.q9'), a: t('faq.a9') },
      ],
    },
    {
      icon: <RotateCcw className="w-5 h-5" />,
      label: t('faq.returnsRefunds'),
      items: [
        { q: t('faq.q4'), a: t('faq.a4') },
        { q: t('faq.q5'), a: t('faq.a5') },
        { q: t('faq.q6'), a: t('faq.a6') },
      ],
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      label: t('faq.payment'),
      items: [
        { q: t('faq.q7'), a: t('faq.a7') },
        { q: t('faq.q8'), a: t('faq.a8') },
      ],
    },
    {
      icon: <User className="w-5 h-5" />,
      label: t('faq.account'),
      items: [
        { q: t('faq.q10'), a: t('faq.a10') },
      ],
    },
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="bg-blue-600 text-white text-center py-14">
        <h1 className="text-3xl font-bold">{t('faq.title')}</h1>
        <p className="text-blue-100 mt-2 max-w-xl mx-auto">{t('faq.subtitle')}</p>
      </div>

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-14 space-y-10">
          {sections.map((section, si) => (
            <div key={si} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Section Header */}
              <div className="flex items-center gap-3 px-6 py-4 bg-blue-600 text-white">
                {section.icon}
                <h2 className="font-bold text-lg">{section.label}</h2>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-100">
                {section.items.map((item, ii) => {
                  const key = `${si}-${ii}`;
                  const isOpen = openIndex === key;
                  return (
                    <div key={ii}>
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-800 pr-4">{item.q}</span>
                        {isOpen
                          ? <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-5 text-gray-600 leading-relaxed text-sm border-t border-gray-100 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="bg-blue-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-xl font-bold mb-2">{t('faq.stillHaveQuestions')}</h3>
            <p className="text-blue-100 mb-6">{t('faq.contactUs')}</p>
            <Link
              to="/ContactUs"
              className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              {t('faq.contactButton')}
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
