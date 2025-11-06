import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { HandbookSearch } from "@/components/help/handbook-search"
import faqData from "@/lib/faq-data.json";

  export default function HelpPage() {
    return (
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Help Center</h1>
          <p className="text-muted-foreground">
            Find answers to common questions and search the student handbook.
          </p>
        </header>

        <HandbookSearch />

        <div>
            <h2 className="text-2xl font-bold font-headline mb-4">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq) => (
                     <AccordionItem value={`item-${faq.id}`} key={faq.id}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent>
                         {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      </div>
    )
  }
  