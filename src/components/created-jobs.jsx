import { getMyJobs } from '@/api/apiJobs';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import React from 'react'
import { useEffect } from 'react';
import { BarLoader } from 'react-spinners';
import Jobcard from './Job-card';


const CreatedJobs = () => {
    const {user} = useUser();

    const {
        loading: loadingCreatedJobs,
        data: createdJobs,
        fn: fnCreatedJobs,
    } = useFetch(getMyJobs, {
        recruiter_id : user.id,
    });

    useEffect(() => {
        fnCreatedJobs();
    }, []);
    // if(loadingCreatedJobs){
    //     return <BarLoader className='mb-4' width={"100%"} color='#89655'/>
    // }
  return (
    <div>
    {loadingCreatedJobs ? (
        <BarLoader className='mb-4' width={"100%"} color='#89655'/>
    ) : (
      <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {createdJobs?.length ? (
          createdJobs.map((Job) => {
            return ( 
            <Jobcard 
            key ={Job.id} 
            Job={Job}
            savedInit = {Job?.saved?.length >0}
           onJobSaved={fnCreatedJobs}
            isMyJob
            />
          );
          })
        ):( 
        <div>No Jobs Found 😢</div>
        )}
         </div>
    )}
    </div>
  );

};

export default CreatedJobs;
