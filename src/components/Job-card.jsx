import { useUser } from '@clerk/clerk-react';
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { HeartIcon, MapIcon, MapPinIcon, Trash2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "./ui/button";
import useFetch from '@/hooks/use-fetch';
import { deleteJob,saveJob} from '@/api/apiJobs'
import { useState } from 'react';
import { useEffect } from 'react'; 
import { BarLoader } from 'react-spinners';
import { undefined } from 'zod';



const Jobcard = ({
    Job, 
    isMyJob = false,
    savedInit = false,
    onJobSaved = () => {},
}) => {
    const[saved, setSaved] = useState(savedInit);
    const {user} = useUser();

    
    const{
        fn: fnSavedjobs,
        data:Savedjobs,
        loading:loadingSavedJob,
    } = useFetch(saveJob,{
        alreadySaved: saved,
    });

    
    const handleSaveJob = async() =>{
        await fnSavedjobs({
            user_id:user.id,
            job_id:Job.id,

    });
    // onJobSaved();
    const updatedSavedJobs = await Savedjobs(user.token);
    setSaved(updatedSavedJobs.some(job => job.id === Job.id));

    };
    const {loading:loadingDeleteJob, fn:fnDeleteJob} = useFetch(deleteJob, 
        {
            job_id: Job.id,
        }
    );
    const handleDeleteJob = async () => {
        await fnDeleteJob()
        onJobSaved();
      };
    useEffect(() => {
        if(Savedjobs !== undefined) setSaved(Savedjobs?.length >0);
    }, [Savedjobs])
    return(
        <Card className="flex flex-col">
            {loadingDeleteJob && (
                <BarLoader className='mt-4' width={"100%"} color='#f89655'/>
            )}
            <CardHeader className='flex'>
                <CardTitle className="flex justify-between font-bold">{Job.title}
                    {isMyJob && (
                        <Trash2Icon
                        fill="red"
                        size={24}
                        className='text-red-300 cursor-pointer'
                        onClick={handleDeleteJob}
                        />
                    )}
                </CardTitle>
                
            </CardHeader>
            <CardContent className="flex flex-col gap-4 flex-1">
            <div className='flex justify-between'>
                {Job.company && <img src = {Job.company.logo_url} className='h-6'/>}
               <div className='flex gap-2 items-center'> <MapPinIcon size={15} /> {Job.location}
            </div>
            </div>
            <br/>
            {Job.description.substring(0,Job.description.indexOf("."))}
            </CardContent>
            <CardFooter className='flex gap-2'>
                <Link to ={`/Job/${Job.id}` } className='flex-1'>
                <Button variant="secondary" className='w-full'>More Details</Button>
                </Link>
                {!isMyJob && (
                    <Button variant ="outline"
                    className='w-15'
                    onClick={handleSaveJob}
                    disabled={loadingSavedJob}>

                        {saved ? (
                            <HeartIcon  size={20} stroke ="red" fill='red'/>
                        ):(
                            
                        <HeartIcon size={20} />
                        )}
                    </Button>  
                )}
              
                
            </CardFooter>
        </Card>
    )


}

export default Jobcard;
