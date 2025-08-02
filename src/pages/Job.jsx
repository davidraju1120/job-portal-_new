import { getSingleJob, updateHiringStatus } from '@/api/apiJobs';
import AIMatchScore from '@/components/ai-match-score';
import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { useParams } from 'react-router-dom';
import useFetch from '@/hooks/use-fetch';
import { useEffect } from 'react';
import { BarLoader } from 'react-spinners';
import { colors } from '@clerk/themes/dist/clerk-js/src/ui/foundations/colors';
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon, User } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ApplyJobDrawer from '@/components/apply-job';
import ApplicationsCard from '@/components/application-card';
// import ApplicationsCard from '@/components/applications-card.js';
// import { application } from 'express';


const JobPage = () => {
  const { isLoaded, user } = useUser();
  const { id } = useParams();
  const {
    loading: loadingJob,
    data: Job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  const { loading: loadingHiringStatus , fn: fnHiringStatus
} = useFetch(
  updateHiringStatus,
  {
    job_id: id,
  }
);

const handleStatusChange = (value) => {
  const isOpen = value === "Open";
  fnHiringStatus(isOpen).then(() => fnJob());
};

useEffect(() => {
  if (isLoaded) fnJob();

}, [isLoaded]);
if (!isLoaded || loadingJob) {
  return <BarLoader className='mb-4' width={"100%"} color="#f89655" />
}

return (
  <div className='flex flex-col gap-8 mt-5'>
    <div className='flex flex-col-reverse gap-6 md:flex-row justify-between items-center'>
      <h1 className='gradient-title font-extrabold pb-3 text-4xl sm:text-6xl'>
        {Job?.title}
      </h1>
      <img src={Job?.company?.logo_url} className='h-12' alt={Job?.title} />
    </div>
    <div className='flex justify-between'>
      <div className='flex gap-2'>
        <MapPinIcon />
        {Job?.location}
      </div>
      <div className='flex gap-2'>
        <Briefcase /> {Job?.applications?.length} Applicants
      </div>
      <div className='flex gap-2'>
        {Job?.isOpen ? (<><DoorOpen /> Open</> ): ( <> <DoorClosed /> Closed</>)}
      </div>
    </div>
    {Job?.recruiter_id === user?.id && (
      <Select
      onValueChange={handleStatusChange}
    >
{/* {loadingHiringStatus && <BarLoader width={"100%"} color='#f89655'/>} */}
    {/*  hiring status */}
    
      
       
        <SelectTrigger className={`w-full ${Job?.isOpen ? "bg-green-950" : "bg-red-950"}`}>
  <SelectValue placeholder={"Hiring Status " + (Job?.isOpen ? "(Open)" : "(Closed)")} />
</SelectTrigger>
        <SelectContent>


          <SelectItem  value="Open">
            Open
          </SelectItem>
          <SelectItem value= "Closed">
            Closed
          </SelectItem>



        </SelectContent>
      </Select>
    )}


    <h2 className='text-2xl sm:text-3xl font-bold'> About The Job</h2>
      <p className='sm:text-lg'>{Job?.description}</p>
      <h2 className='text-2xl sm:text-3xl font-bold'>
        What We Are Looking For
          </h2>
    <MDEditor.Markdown source={Job?.requirements} className='bg-transparent sm:text-lg' />
    {/* render applications */}

{/* AI match score for candidates */}
{Job?.recruiter_id !== user?.id && (
  <>
    <AIMatchScore user={user} job={Job} />
    <ApplyJobDrawer 
      Job={Job}
      user={user}
      fetchJob={fnJob}
      applied={Job?.applications?.find((ap) => ap.candidate_id === user.id)}
    />
  </>
)}
{loadingHiringStatus && <BarLoader width={"100%"} color='#f89655'/>}
{
  Job?.applications?.length > 0 && Job.recruiter_id ===user?.id && (
    <div className='flex flex-col gap-2'>
      <h2  className='text-2xl sm:text-3xl font-bold'> Applications
      </h2>
      {Job?.applications.map((application) =>
      {
        return<ApplicationsCard key={application.id} application={application}/>
      })
      }
    </div>
  )
}
  </div>



);
};
export default JobPage;
