import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

interface Props {
  faqItems?: Array<{ question: string; answer: string }>;
}

const ArticleFAQSection = ({ faqItems }: Props) => {
  if (!faqItems?.length) return null;

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <HelpCircle className="h-6 w-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((faq, idx) => (
          <AccordionItem key={idx} value={`faq-${idx}`}>
            <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default ArticleFAQSection;
