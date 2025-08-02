// import { Button } from 'antd';
import { SignedIn, SignedOut, SignIn, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import {Button} from "./ui/button"
import WalletConnectButton from './WalletConnectButton';
import React from 'react'
import {Link,useSearchParams} from "react-router-dom";
import { BriefcaseBusiness, PenBox } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";


const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();
  const {user}= useUser();

  useEffect(() => {
    if(search.get("sign-in")){
      setShowSignIn(true);
    }
  },[search]);
  const  handleOverlayClick=(e)=>{
    if(e.target === e.currentTarget){
      setShowSignIn(false);
      setSearch({});
    }
  }
  return (
<>
   <nav className='py-4 flex justify-between items-center'>
    <Link to ="/">
    <img src="/img.png" className='h-24 w-24'/>
    </Link>
    
    <div className="flex gap-8">
    <SignedOut>
    <Button variant="outline" onClick={() => setShowSignIn(true)}>Login</Button>
    </SignedOut>
    
      <SignedIn>
        {user?.unsafeMetadata?.role === "recruiter" && (
          <>
            <Link to='/Post-job'>
              <Button variant="destructive" className="rounded-full">
                <PenBox size={20} className="mr-2"/>
                Post a Job
              </Button>
            </Link>
            <WalletConnectButton />
          </>
        )}
      <UserButton appearance={{
        elements:{
          avatarBox:"w-10 h-10"
        },
      }}>
        <UserButton.MenuItems>
          <UserButton.Link
          label="My-Job"
          labelIcon={<BriefcaseBusiness size={15}/>}
          href="/My-jobs"
          />
          <UserButton.Link
          label="Saved Jobs"
          labelIcon={<BriefcaseBusiness size={15}/>}
          href="/Saved-jobs"
          />
        </UserButton.MenuItems>

      </UserButton>
      </SignedIn>
      <Link to='/Contact-us'><Button className='bg-[#f89655]'>Contact Us</Button></Link>
{/* <Button className='' olor="#FF5733"  >Contact Us <Link to='/Contact-us'></Link></Button> */}
      </div>
   </nav>
   {showSignIn && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
   onClick={handleOverlayClick}>
    <SignIn
    signUpForceRedirectUrl="/onboarding"
    fallbackRedirectUrl="/onboarding"
    />
    </div>}
   
   </>
  )
}

export default Header;
