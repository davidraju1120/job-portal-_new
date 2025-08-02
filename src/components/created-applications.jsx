import { getApplications } from '@/api/apiApplication';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import React from 'react'
import { useEffect } from 'react';
import { BarLoader } from 'react-spinners';
import ApplicationsCard from './application-card';



const CreatedApplications = () => {
    const{user} = useUser()
    const{
        loading: loadingApplications,
        data: applications,
        fn: fnApplications,
    } = useFetch(getApplications, {
        user_id: user.id,
        });

        useEffect(() => {
            fnApplications();

        }, []);
        if(loadingApplications){
            return <BarLoader className='mb-4' width={"100%"} color='#89655'/>
        }
  return (

    <div className='flex flex-col gap-2'>
     {applications?.map((application) =>
      {
        return (<ApplicationsCard key={application.id} application={application} isCandidate/>
      );
    })}
    </div>
  )
}

export default CreatedApplications;
