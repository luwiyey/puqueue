
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bot, Calendar, Ticket, ArrowRight } from 'lucide-react';

export default function LandingPage() {

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <Image src="/pulogo.png" alt="Panpacific University Logo" width={28} height={28} />
            <span className="text-xl font-bold font-headline">Panpacific University</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
                <Link href="/get-started">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="relative h-[60vh] w-full md:h-[75vh]">
          <Image
            src="/iskol.png"
            alt="Panpacific University Campus"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
          <div className="container relative mx-auto flex h-full flex-col items-center justify-center px-4 text-center text-white md:px-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
              Smart Support for Panpacific University
            </h1>
            <p className="mx-auto mt-4 max-w-[700px] text-lg text-white/80 md:text-xl">
              Get instant help with our AI assistant, book appointments with ease, and track your support tickets all in one place.
            </p>
            <div className="mt-8 flex gap-4">
              <Button size="lg" asChild>
                <Link href="/get-started">
                  Login & Get Started
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
               <Button size="lg" variant="secondary" asChild>
                <Link href="/guest-login">
                  Continue as Guest
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="why-puqueue" className="container mx-auto py-12 md:py-24 lg:py-32">
          <div className="mx-auto grid max-w-5xl items-center justify-center gap-4 text-center">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Why Panpacific University Queue?</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Our platform is designed to streamline university services, saving you time and reducing stress.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-muted py-12 md:py-24 lg:py-32">
            <div className="container mx-auto grid items-center gap-6 px-4 md:grid-cols-2 md:px-6 lg:gap-12">
                <div className="space-y-4">
                    <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-semibold">Instant Support</div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Chat with Your AI Assistant</h2>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                        No more waiting. Get immediate answers to your questions about enrollment, academics, and campus life from our intelligent AI chatbot, trained on university documents.
                    </p>
                    <Button asChild>
                        <Link href="/chatbot">Try the Chatbot <ArrowRight className="ml-2" /></Link>
                    </Button>
                </div>
                <Image
                    src="/gantomunamam.png"
                    alt="AI Assistant feature"
                    width={600}
                    height={400}
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                />
            </div>
        </section>
        
        <section className="py-12 md:py-24 lg:py-32">
            <div className="container mx-auto grid items-center gap-6 px-4 md:grid-cols-2 md:px-6 lg:gap-12">
                <Image
                    src="/gantomunamam.png"
                    alt="Appointment booking feature"
                    width={600}
                    height={400}
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                />
                <div className="space-y-4">
                    <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-semibold">Organized Scheduling</div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Book Appointments Seamlessly</h2>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                       Need to meet with an advisor or department staff? Find available slots and book your appointment in just a few clicks. No more phone calls or email chains.
                    </p>
                    <Button asChild>
                        <Link href="/appointments">Book Now <ArrowRight className="ml-2" /></Link>
                    </Button>
                </div>
            </div>
        </section>

        <section className="bg-muted py-12 md:py-24 lg:py-32">
            <div className="container mx-auto grid items-center gap-6 px-4 md:grid-cols-2 md:px-6 lg:gap-12">
                <div className="space-y-4">
                    <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-semibold">Unified Tracking</div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Track Tickets in One Place</h2>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                        Submit requests, track their status in real-time, and view your entire support history from a single, organized dashboard. No more lost emails or wondering about the status of your request.
                    </p>
                    <Button asChild>
                        <Link href="/tickets">View Your Tickets <ArrowRight className="ml-2" /></Link>
                    </Button>
                </div>
                 <Image
                    src="/gantomunamam.png"
                    alt="Ticket tracking feature"
                    width={600}
                    height={400}
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                />
            </div>
        </section>

      </main>

       <footer className="border-t bg-background/80 backdrop-blur-sm p-6 md:py-12 w-full">
            <div className="container mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm text-center">
                <div className="grid gap-1">
                    <h3 className="font-semibold">Panpacific University</h3>
                    <Link href="/about" prefetch={false}>About Us</Link>
                    <Link href="/contact" prefetch={false}>Contact</Link>
                </div>
                <div className="grid gap-1">
                    <h3 className="font-semibold">Services</h3>
                    <Link href="/get-started" prefetch={false}>AI Assistant</Link>
                    <Link href="/get-started" prefetch={false}>Appointments</Link>
                    <Link href="/get-started" prefetch={false}>Ticket System</Link>
                </div>
                 <div className="grid gap-1">
                    <h3 className="font-semibold">Legal</h3>
                    <Link href="/privacy" prefetch={false}>Privacy Policy</Link>
                    <Link href="/terms" prefetch={false}>Terms of Service</Link>
                </div>
            </div>
        </footer>
    </div>
  );
}
