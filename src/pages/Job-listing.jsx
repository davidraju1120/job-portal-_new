import { getjobs } from '@/api/apiJobs'
import { getCompanies } from '@/api/apiCompanies';
import Jobcard from '@/components/Job-card'
import { recommendJobs } from '@/lib/ai-utils'
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import JobCard from '@/components/Job-card'
import useFetch from '@/hooks/use-fetch'
import { useUser } from "@clerk/clerk-react";
// import supabaseClient from '@/utils/superbase
import { useSession } from '@clerk/clerk-react'
import { Button } from "@/components/ui/button";

import React from 'react'
import { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners'
import { State } from 'country-state-city';
import { Value } from '@radix-ui/react-select';

const Joblisting = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
const { isLoaded, user } = useUser();
const{
  fn: fnJobs,
  data: Jobs,
 loading: loadingJobs,

} =  useFetch(getjobs, {
  location,
  company_id,
  searchQuery,
});
  
const { fn: fnCompanies, data:companies} = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);
    useEffect(() => {
      if (isLoaded) fnJobs();
    }, [isLoaded,location,
      company_id,
      searchQuery]);
      const handleSearch=(e)=>{
        e.preventDefault();
        let formData = new FormData(e.target);
        const query = formData.get("search-query");
        if(query) setSearchQuery(query);

      };
      const clearFilters=()=> {
        setSearchQuery("");
        setCompany_id("");
        setLocation("");
      };

    if(!isLoaded){
      return< BarLoader className='mb-4' width={"100%"} color='#f89655'/>
    }
  return(
    <div>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text text-center pb-8'>
        Latest jobs
      </h1>
      <form onSubmit={handleSearch}  className='h-14 flex w-full gap-2 items-center mb-3'>
        <Input type="text" placeholder="Search Jobs By Title.."
        name="search-query"
        className="h-full flex-1 px-4 text-md"/>
        <Input type="text" placeholder="Filter by Skills/Tags (comma separated)"
        value={skillFilter}
        onChange={e => setSkillFilter(e.target.value)}
        className="h-full flex-1 px-4 text-md" />
        <Button type ="submit" className='h-full sm:w-28' variant="blue">Search</Button>
      </form>

      <div className='flex flex-col sm:flex-row gap-2 '>
      <Select value={location} onValueChange={(value)=> setLocation(value)}>
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
    {/* <SelectItem value="light">Light</SelectItem> */}
    
  </SelectContent>
</Select>

<Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Company" />
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
        <Button
          className="sm:w-1/2"
          variant="destructive"
          onClick={clearFilters}
        >
          Clear Filters 
          </Button>
      </div>
      {loadingJobs && ( 
      < BarLoader className='mb-4' width={"100%"} color='#f89655'/>
    )}
    {/* Smart job suggestions */}
    {isLoaded && user?.unsafeMetadata?.skills && Jobs?.length > 0 && (
      <div className="my-8">
        <h2 className="text-2xl font-bold text-blue-300 mb-2">Jobs Suggested For You (AI)</h2>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {recommendJobs(Jobs, user.unsafeMetadata.skills).slice(0, 3).map((Job) => (
            <Jobcard key={Job.id} Job={Job} savedInit={Job?.saved?.length > 0} />
          ))}
        </div>
      </div>
    )}
    {loadingJobs === false && (
      <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {Jobs?.length ? (
          Jobs.filter(job => {
            if (!skillFilter.trim()) return true;
            const jobSkills = (job.requirements || '').toLowerCase();
            return skillFilter.toLowerCase().split(',').some(skill => jobSkills.includes(skill.trim()));
          }).map((Job) => {
            return <Jobcard key ={Job.id} Job={Job}
            savedInit={Job?.saved?.length >0}/>;
          })
        ):( <div>No Jobs Found 😢</div>)}
         </div>
    )}

      
    </div>
  
  );
};

export default Joblisting;
