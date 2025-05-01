'use client';

import { motion, useInView } from 'framer-motion';
import {
  Bell,
  CheckCircle,
  ChevronDown,
  CreditCard,
  DollarSign,
  MapPin,
  Shield,
  Star,
  User,
  Wrench,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { AuthNav } from '@/components/auth-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const zoomIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

const features = [
  {
    icon: <Bell className="h-6 w-6" />,
    title: 'Real-time Notifications',
    description: 'Get instant updates on your repair status',
  },
  {
    icon: <Star className="h-6 w-6" />,
    title: 'Technician Ratings',
    description: 'Choose the best technicians based on ratings',
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: 'Secure Payments',
    description: 'Multiple secure payment options available',
  },
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: 'Custom Coupons',
    description: 'Special discounts for loyal customers',
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: 'Order Tracking',
    description: 'Track your repair status in real-time',
  },
  {
    icon: <User className="h-6 w-6" />,
    title: 'Technician Profiles',
    description: 'Detailed profiles with skills and experience',
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Customer',
    content:
      'PerbaikiinAja fixed my laptop in just 2 hours! The technician was professional and explained everything clearly. Highly recommended!',
    rating: 5,
    image: '/testimonials/1.png',
  },
  {
    name: 'Michael Chen',
    role: 'Customer',
    content:
      "I've used this service multiple times for different repairs. Always reliable and affordable. The app makes it so easy to track progress.",
    rating: 5,
    image: '/testimonials/2.png',
  },
  {
    name: 'Aisha Patel',
    role: 'Customer',
    content:
      'Great experience with my phone repair. The technician came to my home and fixed it on the spot. Will definitely use again!',
    rating: 4,
    image: '/testimonials/3.png',
  },
];

const technicians = [
  {
    name: 'David Wilson',
    specialty: 'Electronics Repair',
    rating: 4.9,
    jobs: 243,
    image: '/technicians/1.png',
  },
  {
    name: 'Maria Rodriguez',
    specialty: 'Appliance Repair',
    rating: 4.8,
    jobs: 187,
    image: '/technicians/2.png',
  },
  {
    name: 'James Lee',
    specialty: 'Computer Repair',
    rating: 4.7,
    jobs: 156,
    image: '/technicians/3.png',
  },
];

const faqs = [
  {
    question: 'How does PerbaikiinAja work?',
    answer:
      'Simply submit a repair request through our platform, choose a technician based on ratings and specialties, and track the repair process in real-time. Once the repair is complete, you can pay securely through our platform and leave a review.',
  },
  {
    question: 'What types of items can I get repaired?',
    answer:
      "Our platform supports repairs for electronics, appliances, computers, mobile phones, furniture, and many other household and office items. If you're unsure, you can always submit a request and our technicians will let you know if they can help.",
  },
  {
    question: 'How are the technicians verified?',
    answer:
      'All technicians on our platform undergo a thorough verification process, including background checks, skill assessments, and credential verification. We also monitor ratings and reviews to ensure high-quality service.',
  },
  {
    question: "What if I'm not satisfied with the repair?",
    answer:
      "Customer satisfaction is our priority. If you're not satisfied with a repair, you can report the issue within 7 days, and we'll work with the technician to resolve it or arrange for another technician to fix the problem.",
  },
  {
    question: 'How are the repair costs calculated?',
    answer:
      "Repair costs are determined by the technician based on the complexity of the repair, parts required, and time needed. You'll receive an estimate before the repair begins, and you can choose to accept or decline it.",
  },
];

const pricingExamples = [
  {
    service: 'Smartphone Screen Replacement',
    priceRange: '$50 - $200',
    description: 'Depends on device model and screen type',
  },
  {
    service: 'Laptop Repair',
    priceRange: '$80 - $300',
    description: 'Hardware issues, software problems, data recovery',
  },
  {
    service: 'Appliance Repair',
    priceRange: '$100 - $400',
    description: 'Refrigerators, washing machines, dishwashers, etc.',
  },
];

export default function Home() {
  const [hasScrolled, setHasScrolled] = useState(false);

  const howItWorksRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const techniciansRef = useRef(null);
  const pricingRef = useRef(null);
  const faqRef = useRef(null);
  const newsletterRef = useRef(null);

  const howItWorksInView = useInView(howItWorksRef, { once: true, amount: 0.3 });
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.3 });
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.3 });
  const techniciansInView = useInView(techniciansRef, { once: true, amount: 0.3 });
  const pricingInView = useInView(pricingRef, { once: true, amount: 0.3 });
  const faqInView = useInView(faqRef, { once: true, amount: 0.3 });
  const newsletterInView = useInView(newsletterRef, { once: true, amount: 0.3 });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header
        className={`bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur transition-all duration-200 ${hasScrolled ? 'shadow-sm' : ''}`}>
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="w-28 md:w-40">
            <Image
              src="/logo-light.png"
              width={500}
              height={500}
              alt="Logo"
              className="dark:hidden"
            />
            <Image
              src="/logo-dark.png"
              width={500}
              height={500}
              alt="Logo"
              className="hidden dark:inline"
            />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="hover:text-primary text-sm font-medium transition-colors">
              Features
            </Link>
            <Link
              href="#testimonials"
              className="hover:text-primary text-sm font-medium transition-colors">
              Testimonials
            </Link>
            <Link
              href="#technicians"
              className="hover:text-primary text-sm font-medium transition-colors">
              Technicians
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <AuthNav />
            <Button variant="ghost" size="icon" className="md:hidden">
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full overflow-hidden py-12 md:py-24 lg:py-32 xl:py-40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial="hidden"
                animate="visible"
                variants={fadeIn}>
                <div className="space-y-2">
                  <motion.h1
                    className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}>
                    Your Repair Service Platform
                  </motion.h1>
                  <motion.p
                    className="text-muted-foreground max-w-[600px] md:text-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}>
                    Connect with skilled technicians to repair your items quickly and efficiently.
                  </motion.p>
                </div>
                <motion.div
                  className="flex flex-col gap-2 min-[400px]:flex-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}>
                  <Link href="/register">
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mx-auto lg:order-last">
                <Image
                  src="/hero.png"
                  width={550}
                  height={550}
                  alt="Hero Image"
                  className="mx-auto aspect-square max-w-md overflow-hidden rounded-xl object-cover sm:w-full"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          ref={howItWorksRef}
          className="bg-muted/50 w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              animate={howItWorksInView ? 'visible' : 'hidden'}
              variants={fadeIn}>
              <div className="space-y-2">
                <Badge variant="outline" className="px-3 py-1">
                  Simple Process
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
                <p className="text-muted-foreground max-w-[900px] md:text-xl">
                  Our platform connects users with skilled technicians for all your repair needs.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-3"
              initial="hidden"
              animate={howItWorksInView ? 'visible' : 'hidden'}
              variants={staggerContainer}>
              <motion.div
                className="bg-card flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md"
                variants={itemFadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                <div className="bg-primary text-primary-foreground flex h-16 w-16 items-center justify-center rounded-full">
                  <User className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">For Users</h3>
                <p className="text-muted-foreground text-center">
                  Submit repair requests, track progress, and rate technicians.
                </p>
              </motion.div>
              <motion.div
                className="bg-card flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md"
                variants={itemFadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                <div className="bg-primary text-primary-foreground flex h-16 w-16 items-center justify-center rounded-full">
                  <Wrench className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">For Technicians</h3>
                <p className="text-muted-foreground text-center">
                  Accept repair jobs, provide estimates, and build your reputation.
                </p>
              </motion.div>
              <motion.div
                className="bg-card flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md"
                variants={itemFadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                <div className="bg-primary text-primary-foreground flex h-16 w-16 items-center justify-center rounded-full">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">For Admins</h3>
                <p className="text-muted-foreground text-center">
                  Manage technicians, coupons, and ensure platform quality.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Highlights */}
        <section id="features" ref={featuresRef} className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              animate={featuresInView ? 'visible' : 'hidden'}
              variants={fadeIn}>
              <div className="space-y-2">
                <Badge variant="outline" className="px-3 py-1">
                  What We Offer
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Features Highlights
                </h2>
                <p className="text-muted-foreground max-w-[900px] md:text-xl">
                  Everything you need for a seamless repair experience.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              animate={featuresInView ? 'visible' : 'hidden'}
              variants={staggerContainer}>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-card flex flex-col items-center space-y-2 rounded-lg border p-4 text-center shadow-sm"
                  variants={zoomIn}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                  <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section
          id="testimonials"
          ref={testimonialsRef}
          className="bg-muted/50 w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              animate={testimonialsInView ? 'visible' : 'hidden'}
              variants={fadeIn}>
              <div className="space-y-2">
                <Badge variant="outline" className="px-3 py-1">
                  Customer Stories
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  What Our Customers Say
                </h2>
                <p className="text-muted-foreground max-w-[900px] md:text-xl">
                  Don't just take our word for it. Here's what our users have to say.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto max-w-5xl py-12"
              initial="hidden"
              animate={testimonialsInView ? 'visible' : 'hidden'}
              variants={fadeIn}>
              <Carousel className="w-full">
                <CarouselContent>
                  {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <Card className="h-full">
                        <CardHeader>
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={testimonial.image} alt={testimonial.name} />
                              <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                              <CardDescription>{testimonial.role}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-sm">{testimonial.content}</p>
                        </CardContent>
                        <CardFooter>
                          <div className="flex text-yellow-500">
                            {Array(testimonial.rating)
                              .fill(0)
                              .map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-current" />
                              ))}
                          </div>
                        </CardFooter>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="mt-4 flex justify-center gap-2">
                  <CarouselPrevious className="relative" />
                  <CarouselNext className="relative" />
                </div>
              </Carousel>
            </motion.div>
          </div>
        </section>

        {/* Technician Showcase */}
        <section id="technicians" ref={techniciansRef} className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              animate={techniciansInView ? 'visible' : 'hidden'}
              variants={fadeIn}>
              <div className="space-y-2">
                <Badge variant="outline" className="px-3 py-1">
                  Expert Team
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Meet Our Top Technicians
                </h2>
                <p className="text-muted-foreground max-w-[900px] md:text-xl">
                  Skilled professionals ready to solve your repair needs.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3"
              initial="hidden"
              animate={techniciansInView ? 'visible' : 'hidden'}
              variants={staggerContainer}>
              {technicians.map((technician, index) => (
                <motion.div
                  key={index}
                  className="bg-card flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm"
                  variants={itemFadeIn}
                  whileHover={{
                    y: -5,
                    boxShadow:
                      '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  }}>
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={technician.image} alt={technician.name} />
                    <AvatarFallback>{technician.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{technician.name}</h3>
                    <p className="text-muted-foreground text-sm">{technician.specialty}</p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">{technician.rating}</span>
                    <span className="text-muted-foreground text-xs">({technician.jobs} jobs)</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </motion.div>
              ))}
            </motion.div>
            <div className="flex justify-center">
              <Link href="/technicians">
                <Button variant="outline">View All Technicians</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing / Cost Transparency */}
        <section
          id="pricing"
          ref={pricingRef}
          className="bg-muted/50 w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              animate={pricingInView ? 'visible' : 'hidden'}
              variants={fadeIn}>
              <div className="space-y-2">
                <Badge variant="outline" className="px-3 py-1">
                  Transparent Pricing
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Cost Transparency
                </h2>
                <p className="text-muted-foreground max-w-[900px] md:text-xl">
                  No hidden fees. Get clear estimates before repairs begin.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3"
              initial="hidden"
              animate={pricingInView ? 'visible' : 'hidden'}
              variants={staggerContainer}>
              {pricingExamples.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-card flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm"
                  variants={itemFadeIn}>
                  <h3 className="text-xl font-bold">{item.service}</h3>
                  <div className="text-primary text-3xl font-bold">{item.priceRange}</div>
                  <p className="text-muted-foreground text-center text-sm">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              className="bg-card mx-auto max-w-3xl rounded-lg border p-6 shadow-sm"
              initial="hidden"
              animate={pricingInView ? 'visible' : 'hidden'}
              variants={fadeIn}
              transition={{ delay: 0.4 }}>
              <div className="flex flex-col items-center space-y-4 text-center">
                <h3 className="text-xl font-bold">How Pricing Works</h3>
                <p className="text-muted-foreground">
                  Our technicians provide transparent estimates based on the complexity of the
                  repair, parts required, and time needed. You'll always know the cost before any
                  work begins, and can approve or decline the estimate.
                </p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">No hidden fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Upfront estimates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Secure payment options</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" ref={faqRef} className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              animate={faqInView ? 'visible' : 'hidden'}
              variants={fadeIn}>
              <div className="space-y-2">
                <Badge variant="outline" className="px-3 py-1">
                  Common Questions
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground max-w-[900px] md:text-xl">
                  Find answers to common questions about our service.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto max-w-3xl py-12"
              initial="hidden"
              animate={faqInView ? 'visible' : 'hidden'}
              variants={fadeIn}>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section
          id="newsletter"
          ref={newsletterRef}
          className="bg-muted/50 w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              className="bg-card mx-auto max-w-3xl rounded-lg border p-8 shadow-sm"
              initial="hidden"
              animate={newsletterInView ? 'visible' : 'hidden'}
              variants={fadeIn}>
              <div className="flex flex-col items-center space-y-4 text-center">
                <h2 className="text-2xl font-bold">Stay Updated</h2>
                <p className="text-muted-foreground">
                  Subscribe to our newsletter for the latest updates, promotions, and repair tips.
                </p>
                <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
                  <Input type="email" placeholder="Enter your email" className="flex-1" />
                  <Button>Subscribe</Button>
                </div>
                <p className="text-muted-foreground text-xs">
                  By subscribing, you agree to our{' '}
                  <Link href="/terms" className="underline underline-offset-2">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="underline underline-offset-2">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <motion.footer
        className="w-full border-t py-6 md:py-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}>
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/icon-light.png"
              width={500}
              height={500}
              alt="Logo"
              className="h-5 w-5 dark:hidden"
            />
            <Image
              src="/icon-dark.png"
              width={500}
              height={500}
              alt="Logo"
              className="hidden h-5 w-5 dark:inline"
            />
            <p className="text-sm font-medium">
              © {new Date().getFullYear()} PerbaikiinAja. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/terms"
              className="text-muted-foreground text-sm underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-muted-foreground text-sm underline-offset-4 hover:underline">
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground text-sm underline-offset-4 hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
