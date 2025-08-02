import { Accordion, AccordionTrigger, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import faq from '../data/faq.json';
import { GithubIcon, Icon, LinkedinIcon, MailIcon, XIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactUs = () => {
 
    const [result, setResult] = React.useState(""); //1
    const onSubmit = async (event) => {
      event.preventDefault();
      setResult("Sending....");
      const formData = new FormData(event.target);
  
      formData.append("access_key", "926b01ce-2d31-46eb-8a60-b6414a44885a");
  
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
  
      const data = await response.json();
  
      if (data.success) {
        setResult("Form Submitted Successfully");
        event.target.reset();
      } else {
        console.log("Error", data);
        setResult(data.message);
      }
    };
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
      {/* Contact Header Section */}
      <section className="text-center">
        <h1 className="text-4xl font-extrabold sm:text-6xl lg:text-8xl tracking-tighter py-4">
          Contact Us
        </h1>
        <p className="text-gray-300 sm:mt-4 text-xs sm:text-xl">
          We'd love to hear from you! Reach out with any questions or feedback.
        </p>
      </section>

      {/* Contact Information Section */}
       <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* <section className=' items-center'> */}
        <Card >
          <CardHeader>
            <CardTitle >Socials</CardTitle>
            
          </CardHeader>
         
          <CardContent className='pt-5'>
          <div className='flex items-center font-bold pt-5'>
            <MailIcon className='mr-2'></MailIcon><Link to='https://x.com/HammadW_'><p>Contact.hammadk@gmail.com</p>
            </Link>
            </div>
          </CardContent>
          <CardContent>
          <div className='flex items-center font-bold pt-5'>
           
            <XIcon className='mr-2'></XIcon><Link to='https://x.com/HammadW_'><p>HammadW_</p>
            </Link>
            </div>
          </CardContent>
          <CardContent>
          <div className='flex items-center font-bold pt-5'>
            <LinkedinIcon className='mr-2'></LinkedinIcon><Link to='https://www.linkedin.com/in/hammad-w/'><p>Hammad-w</p></Link>
            </div>
          </CardContent>
          <CardContent> 
          <div className='flex items-center font-bold pt-5'>
            <GithubIcon className='mr-2'></GithubIcon><Link to='https://github.com/Hammad-W'><p>Hammad-W</p></Link>
            </div>
          </CardContent>

{/* hey */}


          
        </Card>
        <Card>
    {/* <CardHeader>Contact Form Section  here</CardHeader> border-gray-300 */} 
      <CardContent>
      <section1 className="text-center">
        <h2 className="text-2xl font-bold py-4">Send Us a Message</h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 max-w-lg mx-auto">
          <input
            type="text"  
            placeholder="Your Name"
            className="p-3 border text-gray-900 rounded-lg"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="p-3 border text-gray-900 rounded-lg"
          />
          <textarea 
          name='message'
            placeholder="Your Message"
            className="p-3 border  text-gray-900 rounded-lg h-32"
          />
          <Button type ='submit'size="lg" variant="blue">Submit</Button>
        </form>
        <span>
           {result} 
        </span>
      </section1>
      </CardContent>
      </Card>
   
      </section>


{/* 
      const Contact = () => {
    const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "b57e2651-c94f-48d3-ba97-ca3ee7c973cd");

    const response = await fetch("https://api.web3forms.com/submit", {
  //     method: "POST",
  //     body: formData */}
  {/* //   });

  //   const data = await response.json();

  //   if (data.success) { */}
  {/* //     setResult("Form Submitted Successfully"); */}
  {/* //     event.target.reset();
  //   } else { */}
  {/* //     console.log("Error", data); */}
  {/* //     setResult(data.message);
  //   }
  // };
//   return (
//     <div className='contact'>
//         <div className="contact-col">
//            <h3>
//             Send us a message <img src={msg_icon} alt="" />
//            </h3>
//            <p>Whether you have a question, need more information, or just want to say hello, we're here to help. Please fill out the form below, and one of our team members will get back to you as soon as possible. Your feedback and inquiries are important to us!</p>
//            <ul>
//             <li><img src={mail_icon} alt="" /> Contact@edumax@mail.com </li>
//             <li><img src={phone_icon} alt="" />
// +123 456 674 </li>
//             <li> */}
                {/* <img src={location_icon} alt="" />
77 Massachuestts Ave, Cambridge <br/>
MS 02139, United States
            </li>
           </ul>
        </div>
      <div className='contact-col'>
        <form onSubmit={onSubmit}>
            <label>Your Name</label>
            <input type='text' name="name" placeholder='Enter Your Name' required/>
            <label> Phone Number</label>
            <input type="tel" name="phone" placeholder='Enter Your Mobile number' required />
            <label>Write Your Message</label>
            <textarea name="message" rows="6" placeholder='Enter Your Message'></textarea>
            <button type='submit' className='btn dark-btn'>Submit Now <img src={white_arrow} alt="" /></button>

        </form>
        <span>
           {result} 
        </span>
      </div>
    </div> */}

      {/* FAQ Section */}
      <section className="mt-10">
        <h2 className="text-3xl font-bold text-center py-4">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible>
          {faq.map((faqItem, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger>{faqItem.question}</AccordionTrigger>
              <AccordionContent>{faqItem.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  );
};



export default ContactUs;
