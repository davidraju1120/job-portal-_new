import { getSavedjobs } from '@/api/apiJobs'
import Jobcard from '@/components/Job-card'
import useFetch from '@/hooks/use-fetch'
import { useUser } from '@clerk/clerk-react'
import { BadgeRussianRuble } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { BarLoader } from 'react-spinners'

const Savedjobs = () => {
  const [saved, setSaved] = useState([]);
  const {isLoaded} = useUser();
  const {
    loading: loadingSavedJobs,
    data: Savedjobs,
    fn: fnSavedjobs,
  } = useFetch(getSavedJobs,{
    alreadySaved: saved,
  });

  useEffect(() => {
    if (isLoaded) fnSavedjobs().then(data => saved(data || []));
  }, [isLoaded]);
  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className='mb-4' width={"100%"} color='#f89655' />
  }
  return (
    <div>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>Saved Jobs</h1>

      {loadingSavedJobs === false && (
        <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Savedjobs?.length ? (
            Savedjobs.map((saved) => {
              return (<Jobcard key={saved.id} Job={saved?.Job}
                savedInit={true}
                onJobSaved={fnSavedjobs}
              />
              );
            })
          ) : (
            <div>No  Saved Jobs Found 👀</div>
          )}
        </div>
      )}
      </div>
      );
};

      export default Savedjobs;
