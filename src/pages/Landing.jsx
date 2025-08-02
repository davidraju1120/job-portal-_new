import { Accordion, AccordionTrigger, AccordionContent, AccordionItem  } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel,CarouselContent, CarouselItem } from '@/components/ui/carousel';

import React from 'react'
import { Link } from 'react-router-dom'; 

import companies from '../data/companies.json';
import faq from '../data/faq.json';
import Autoplay from 'embla-carousel-autoplay';

const LandingPage = () => {
  return (
   <main className='flex flex-col gap-10 sm:gap-20 py-10 sm:py-20'>
    <section className='text-center'>
      <h1 className='flex flex-col items-center justify-center gradient-title text-4xl font-extrabold sm:text-6xl lg:text-8xl tracking-tighter py-4'>  Get Your Dream Job{" "}
        <span className='flex-items-center gap-1 sm:gap-2'> at  {" "}<img src="./img.png" alt="CareerCraft Logo"  className='h-14 sm:h-52 lg:h-62 inline-block'/></span>
      </h1>
      <p className='text-gray-300 sm:mt-4 text-xs sm:text-xl'>
        Explore thousands of job listing or find the perfect candidate
      </p>
    </section>
    <div className='flex gap-6 justify-center'>
      <Link to="/job">
      <Button variant="blue" size="xl">Find Jobs</Button>
      </Link>
      <Link to="/Post-job">
      <Button size ="xl" variant="destructive">Post a Job</Button>
      </Link>
      
    </div>
    <Carousel
    plugins={[Autoplay({ delay:2000, stopOnInteraction:true})]}
               className="w-full py-10">
      <CarouselContent className="flex gap-5 sm:gap-20 items-center" >
      {companies.map(({name, id, path}) => {
        return (<CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
          <img src={path} alt={name}
          className='h-9 sm:h-14 object-contain' />
        </CarouselItem>
        );
      })}  
      </CarouselContent>
      </Carousel>
      {/* <img src='./1.png' alt="" className='w-full' /> */}
      <img src='./6.png' alt="" className='w-full max-w-screen-xl mx-auto h-auto object-cover rounded-lg shadow-lg' />
     
    {/* {Banner} */}
    <section className='grid grid-cols-1 md:grid-cols-2 gap-4'>
    <Card>
  <CardHeader>
    <CardTitle>Job Seekers</CardTitle>
    <CardDescription>Search and apply for jobs, track application, and more.</CardDescription>
  </CardHeader>
  
 
</Card>
<Card>
  <CardHeader>
    <CardTitle>For Employers</CardTitle>
    <CardDescription>Post jobs, manage application, and find the best candidates.</CardDescription>
  </CardHeader>
  <CardContent>
    <p></p>
  </CardContent>
 
</Card>
      {/* {Card} */}
    </section>
    <Accordion type="single" collapsible>
      {faq.map((faq, index) => {
        return (
      <AccordionItem key = {index} value={`item-${index+1}`}>
      <AccordionTrigger>{faq.question}</AccordionTrigger>
      <AccordionContent>
{faq.answer}
      </AccordionContent>
    </AccordionItem>);
      })}
  
</Accordion>
    {/* {Accordion} */}
   </main>
  )
}

export default LandingPage;
