
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, HelpCircle, MessageSquareHeart } from "lucide-react";
import Link from "next/link";
import parentFaqData from "@/lib/parent-faq-data.json";

export function ParentGuardianResources() {
    return (
        <Card className="bg-muted/30">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Parent & Guardian Hub</CardTitle>
                <CardDescription>
                    Quick resources to help you support your child's university journey.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-primary" />
                        Frequently Asked Questions
                    </h3>
                    <Accordion type="single" collapsible className="w-full">
                        {parentFaqData.map((faq) => (
                            <AccordionItem value={`item-${faq.id}`} key={faq.id}>
                                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                                <AccordionContent>{faq.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                     <Link href="/tickets/new?department=Finance&subject=Tuition+Fee+Inquiry" passHref>
                        <Button variant="outline" className="w-full h-full justify-start p-4 items-start">
                            <div className="flex gap-3">
                                <Coins className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                                <div className="text-left">
                                    <p className="font-semibold">Ask about Payments</p>
                                    <p className="text-xs text-muted-foreground">Contact the Finance department.</p>
                                </div>
                            </div>
                        </Button>
                    </Link>
                    <Link href="/feedback" passHref>
                         <Button variant="outline" className="w-full h-full justify-start p-4 items-start">
                            <div className="flex gap-3">
                                <MessageSquareHeart className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                                <div className="text-left">
                                    <p className="font-semibold">Give Feedback</p>
                                    <p className="text-xs text-muted-foreground">Share your experience with us.</p>
                                </div>
                            </div>
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
