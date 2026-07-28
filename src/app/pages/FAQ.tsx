import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { faqContent } from '../content/faq-content';
import { Link } from "react-router-dom";

export function FAQ() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center relative min-h-screen w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-[#f1f1f1] to-white w-full flex flex-col items-center pt-[28px] md:pt-[56px] pb-[40px] md:pb-[80px]">
        <Header />
        
        <div className="mt-[40px] md:mt-[80px] text-center px-4">
          <h1 className="font-['Anybody',_sans-serif] text-[#191919] tracking-[-1.2px] md:tracking-[-1.563px] hyphens-none" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 800, fontSize: '32px' }}>
            {faqContent.hero.title}
          </h1>
          <p className="font-['Anybody',_sans-serif] text-[#191919] mt-4 max-w-2xl mx-auto" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 600, fontSize: '16px' }}>
            {faqContent.hero.subtitle}
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="w-full px-[20px] md:px-[40px] lg:px-[80px] py-[50px] md:py-[80px] lg:py-[100px] max-w-[1200px] mx-auto">
        {faqContent.categories.map((category, catIndex) => (
          <div key={catIndex} className="mb-10 md:mb-16">
            <h2 className="font-['Anybody',_sans-serif] text-[#191919] mb-6 tracking-[-0.8px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 800, fontSize: '24px' }}>
              {category.name}
            </h2>
            
            <Accordion type="single" collapsible className="space-y-3 md:space-y-4">
              {category.questions.map((faq, faqIndex) => (
                <AccordionItem 
                  key={`${catIndex}-${faqIndex}`}
                  value={`${catIndex}-${faqIndex}`}
                  className="bg-[#f1f1f1] rounded-[12px] md:rounded-[16px] px-4 md:px-6 border-none"
                >
                  <AccordionTrigger className="font-['Anybody',_sans-serif] text-[#191919] text-left hover:no-underline py-4 md:py-6" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700, fontSize: '16px' }}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-['Anybody',_sans-serif] text-[#191919] pb-4 md:pb-6 leading-relaxed" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500, fontSize: '14px' }}>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}

        {/* Still have questions */}
        <div className="mt-12 md:mt-20 bg-[#191919] text-white p-8 md:p-12 rounded-[20px] md:rounded-[32px] text-center">
          <h2 className="font-['Anybody',_sans-serif] mb-4 tracking-[-0.8px] md:tracking-[-1px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 800, fontSize: '24px' }}>
            {faqContent.stillHaveQuestions.title}
          </h2>
          <p className="font-['Anybody',_sans-serif] mb-6 md:mb-8 max-w-2xl mx-auto" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500, fontSize: '14px' }}>
            {faqContent.stillHaveQuestions.text}
          </p>
          <Link 
            to={faqContent.stillHaveQuestions.buttonLink}
            className="inline-block bg-white text-black px-8 md:px-12 py-3 md:py-4 rounded-[32px] font-['Roboto_Mono',_sans-serif] uppercase text-[12px] md:text-[14px] tracking-wider hover:bg-gray-100 transition-colors"
          >
            {faqContent.stillHaveQuestions.buttonText}
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black w-full">
        <Footer />
      </div>
    </div>
  );
}