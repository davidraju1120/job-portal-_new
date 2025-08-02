import { getCompanies } from '@/api/apiCompanies';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from "@/components/ui/textarea";
import { State } from 'country-state-city';
import { Input } from "@/components/ui/input";
// import { title } from '@uiw/react-md-editor';
import React from 'react'
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { BarLoader } from 'react-spinners';
import {  Navigate, useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { Button } from '@/components/ui/button';
import { addNewJob } from '@/api/apiJobs';
import AddCompanyDrawer from '@/components/add-company-drawer';
import { useState } from 'react';
import { sendPayment } from '@/lib/wallet';
import { logJobPostOnChain } from '@/lib/onchain';


const schema = z.object({
  title: z.string().min(1, {message: "Title is required"}),
  description : z.string().min(1, {message: "Description is required"}),
  location: z.string().min(1, {message: "select a Location"}),
  company_id: z.string().min(1, {message: "Title is required"}),
  requirements: z.string().min(1, {message: "Requirements is required"}),
  salary: z.string().min(1, {message: "Salary/Budget is required"}),
});


const ADMIN_ADDRESS = '0x05C822b58c485B0c4905a98e13d7574352a2631c';
const JOB_POST_PRICE_ETH = '0.01'; // price in ETH for posting a job

const Postjob = () => {
  const {isLoaded, user} = useUser();
  const navigate = useNavigate();
  const [walletPaid, setWalletPaid] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [txHash, setTxHash] = useState('');

  const {register, control, handleSubmit, formState:{errors}} = useForm({
    defaultValues: {
      location:"",
      company_id: "",
      requirements:"",
    },
    resolver: zodResolver(schema),

  });
  
  const {
    fn: fnCompanies,
    data: companies,
    loading: loadingCompanies,
  } = useFetch(getCompanies);
  useEffect(() => {
    if(isLoaded) fnCompanies();
  }, [isLoaded]); 
 useEffect(() => {
  if(isLoaded) fnCompanies();
   }, [isLoaded]);
  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data:  dataCreateJob,
    fn: fnCreateJob
  } = useFetch(addNewJob);

  const onSubmit = async (data) => {
    if (!walletPaid) {
      setPaymentError('Please complete payment with MetaMask before posting.');
      return;
    }
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
    // Optional: log on-chain
    try {
      const txHash = await logJobPostOnChain({ recruiter: user.unsafeMetadata?.wallet || user.id, jobTitle: data.title });
      alert('Job post logged on-chain! Tx: ' + txHash);
    } catch (e) {
      // Best effort, do not block
      console.warn('On-chain log failed:', e);
    }
  };


  const handlePay = async () => {
    setPaying(true);
    setPaymentError('');
    try {
      const tx = await sendPayment({ to: ADMIN_ADDRESS, valueEth: JOB_POST_PRICE_ETH });
      setTxHash(tx);
      setWalletPaid(true);
    } catch (e) {
      setPaymentError(e.message);
    }
    setPaying(false);
  };
  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/Job");
  }, [loadingCreateJob]);

  if(!isLoaded || loadingCompanies){
    return  <BarLoader className='mb-4' width={"100%"} color='#f89655'/>
  }
  if(user?.unsafeMetadata?.role !== "recruiter"){
    return <Navigate to ='/Job'/>
  }
  
  return (
    <div>
      <h1 className='gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8'>
        Post a Job
      </h1>
      {/* Blockchain payment section */}
      <div className="p-4 bg-blue-950/80 rounded-lg mb-4 text-white">
        <div className="mb-2 font-bold">Blockchain Payment Required</div>
        <div>To post a job, please pay <span className="text-orange-300 font-bold">{JOB_POST_PRICE_ETH} Sepolia ETH</span> to admin wallet:</div>
        <div className="break-all text-blue-300">{ADMIN_ADDRESS}</div>
        {walletPaid ? (
          <div className="mt-2 text-green-300">Payment complete! You can now post your job.</div>
        ) : (
          <button
            type="button"
            className="bg-orange-600 text-white px-4 py-2 mt-3 rounded hover:bg-orange-700 disabled:opacity-50"
            onClick={handlePay}
            disabled={paying}
          >
            {paying ? 'Processing Payment...' : `Pay with MetaMask`}
          </button>
        )}
        {txHash && (
          <div className="mt-2 text-xs">Tx Hash: <a className="underline" href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a></div>
        )}
        {paymentError && <div className="mt-2 text-red-300">{paymentError}</div>}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 p-4 pb-0'>
          <Input placeholder="Job Title" {...register("title")}/>
          {errors.title && <p className='text-red-500'>{errors.title.message}</p>}
          <Input placeholder="Salary / Budget (e.g. $1000/month)" {...register("salary")}/>
          {errors.salary && <p className='text-red-500'>{errors.salary.message}</p>}
        
      <Textarea placeholder='Job Description' {...register("description")}/>
      {errors.description && (
        <p className='text-red-500'> {errors.description.message}</p>
      )}
      <div className="flex gap-4 items-center">
      <Controller
      name="location"
      control={control}
      render={({field}) => (
        <Select 
      value={field.value} 
      onValueChange={field.onChange}
      >
  <SelectTrigger>
    <SelectValue placeholder="Filter By Location" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup >{State.getStatesOfCountry("IN").map((
      {name})=>{
        return(
          <SelectItem key={name} value ={name}>{name}</SelectItem>
        );
      })}</SelectGroup>
  
    
  </SelectContent>
</Select>
      ) } />
      <Controller
      name="company_id"
      control={control}
      render={({field}) => (
        <Select
          value={field.value}
          onValueChange={field.onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Company">
              {field.value?companies?.find((com) => com.id === Number(field.value))
              ?.name 
              : "Company"}
               
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map(({ name, id }) => {
                return (
                  <SelectItem key={name} value={id}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select> 
      )} />
      
      <AddCompanyDrawer fetchCompanies={fnCompanies}/>


        {/* add comapny */}
        </div>
        {errors.location && (
          <p className='text-red-500'>{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className='text-red-500'>{errors.company_id.message}</p>
        )}
        <Controller
      name="requirements"
      control={control}
      render={({field}) => (
        <MDEditor value={field.value} onChange={field.onChange} data-color-mode="dark"/>
        // <MDEditor value={field.value} onChange={field.onChange} />
  )}
      />
      {errors.requirements && (
          <p className='text-red-500'>{errors.company_id.message}</p>
        )}
        {errorCreateJob?.message && (
          <p className='text-red-500'>{errorCreateJob?.message}</p>
        )}
        {loadingCreateJob && <BarLoader width={"100%"} color='#f89655'/> }
        <Button type = "submit" variant="blue" size="lg" className='mt-2'> Submit</Button>
        </form>
    </div>
  )
}

export default  Postjob;
