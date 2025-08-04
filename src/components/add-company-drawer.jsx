import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
import { Button } from './ui/button';
import { Input } from './ui/input';
import useFetch from '@/hooks/use-fetch';
import { addNewCompany } from '@/api/apiCompanies';
import { BarLoader } from 'react-spinners';
import { useEffect } from 'react';
const schema = z.object({
    name: z.string().min(1, {message: "Company name is required"}),
    logo: z
    .any()
    .refine(
      (file) =>
        file[0] && 
      (file[0].type === "image/png" || 
        file[0].type === "image/jpeg"),{
          message: "Only Images are allowed"
        }
      
    ),

});
import { useState } from 'react';
const AddCompanyDrawer = ({fetchCompanies}) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: zodResolver(schema)
    });

    const {
        loading: loadingAddCompany,
        error: errorAddCompany,
        data: dataAddCompany,
        fn: fnAddCompany,
        } = useFetch(addNewCompany);
 const [successMsg, setSuccessMsg] = useState("");
 const onSubmit = async (data) => {
   setSuccessMsg("");
   const result = await fnAddCompany({
     ...data,
     logo: data.logo[0],
   });
   if (result && result.length > 0) {
     setSuccessMsg("Company added successfully!");
     fetchCompanies();
     // Optionally clear form fields here if needed
   }
 };

 useEffect(() => {
   if (dataAddCompany?.length > 0) {
     setSuccessMsg("Company added successfully!");
     fetchCompanies();
   }
 }, [dataAddCompany]);

  return (
    <Drawer>
    <DrawerTrigger>
        <Button type="button" size="sm" variant="secondary"> Add Company</Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Add a New Company</DrawerTitle>

      </DrawerHeader>
      <form className='flex gap-2 p-4 pb-0'>
        <Input placeholder="Company name" {...register("name")}/>
        <Input 
        type="file"
        accept="image/*"
        className="file:text-gray-500"
         {...register("logo")}/>

         <Button
         type="button"
         onClick={handleSubmit(onSubmit)}
         variant="destructive"
         className="w-40"
         disabled={loadingAddCompany}
         >{loadingAddCompany ? "Adding..." : "Add"}</Button>
      </form>
      {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
      {errors.logo && <p className='text-red-500'>{errors.logo.message}</p>}
      {errorAddCompany && (
        <p className='text-red-500'>Error: {errorAddCompany.message || "Could not add company. Check logo type, network, or permissions."}</p>
      )}
      {successMsg && <p className='text-green-600'>{successMsg}</p>}
      {loadingAddCompany && <BarLoader width={"100%"} color='#f89655'/> }
      <DrawerFooter>
        
        <DrawerClose asChild>
          <Button variant="secondary" type="button">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
  )
}

export default AddCompanyDrawer;
