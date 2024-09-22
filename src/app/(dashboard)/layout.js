"use client";
import { useState, useEffect } from "react";
import "./dashboard_layout.css";

import { Sidebar, RightSidebar, CreatePost } from "@/components";
import Link from "next/link";

import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ADDRESS } from "../constants";
import abi from "../contract/abi.json";
import {
  IDKitWidget,
  VerificationLevel,
  ISuccessResult,
} from "@worldcoin/idkit";
import { toast } from "react-toastify";

export default function UserInfoLayout({ children }) {
  const { address } = useAccount();
  const [isAccount, setIsAccount] = useState();
  const [isLoading, setLoading] = useState(true);
  const [isClicked, setClicked] = useState(false);
  const [isSidebar, setSidebar] = useState(false);
  const [userProfile, setUserProfile] = useState({
    owner: "",
    name: "",
    username: "",
    bio: "",
    image_cid: "",
    banner_cid: "",
    profile_id: "",
    following: [],
    followers: [],
  });

  // To check if the account has a profile
  const { data: isAccountData, error: isAccountError } = useReadContract({
    abi,
    address: CONTRACT_ADDRESS,
    functionName: "doesAccountExist",
    args: [address],
  });

  useEffect(() => {
    if (isAccountData !== undefined) {
      setLoading(false);
      if (isAccountData == true) {
        setIsAccount(true);
        console.log("Account exist");
      } else {
        setIsAccount(false);
        console.log("Account does not exist");
      }
    }
  }, [isAccountData, isAccountError, address]);

  const { data: profileResource, error: isError } = useReadContract({
    abi,
    address: CONTRACT_ADDRESS,
    functionName: "getUserProfileByAddress",
    args: [address],
  });

  useEffect(() => {
    if (profileResource !== undefined) {
      console.log("ProfileResource:", profileResource);
      setUserProfile({
        owner: profileResource.userAddress,
        name: profileResource.name,
        username: profileResource.username,
        bio: profileResource.bio,
        image_cid: profileResource.imageCID,
        banner_cid: profileResource.bannerCID,
        profile_id: profileResource.userNumber,
        following: profileResource.following,
        followers: profileResource.followers,
      });
      setLoading(false);
    }
  }, [profileResource, isError]);

  useEffect(() => {
    if (address == undefined || address == "") {
      setLoading(false);
    }
  }, [address]);

  const onSuccess = () => {
    toast.success("Successfully logged in using world coin");
    window.location.href = "/success";
  };
  const handleVerify = async (proof) => {
    const res = await fetch("/api/verify", {
      // route to your backend will depend on implementation
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(proof),
    });
    if (!res.ok) {
      throw new Error("Verification failed."); // IDKit will display the error message to the user in the modal
    }
  };

  return (
    <>
      <div>
        {userProfile.owner == "" ? (
          <>
            {isLoading == true ? (
              <div className="flex jus justify-center h-[100vh] width-[100vw] align-middle ">
                <h1 className=" m-auto p-6 text-center colwhite">Loading...</h1>
              </div>
            ) : (
              <>
                <div className="flex jus flex-col  justify-center h-[100vh] width-[100vw] align-middle ">
                  <div className="flex items-center gap-4 flex-col   justify-center align-middle ">
                    <h3 className=" m-auto p-6 text-center">
                      Create an account or log in to continue to Wizz.
                    </h3>
                    <Link
                      className="bg-[#7501E9] py-3 w-72 text-center text text-white border-none m-auto rounded-xl "
                      href="/"
                    >
                      Register | Login
                    </Link>

                    <IDKitWidget
                      app_id="app_staging_0a024eb570eaba23ee83642d4f601c77" // obtained from the Developer Portal
                      action="login" // obtained from the Developer Portal
                      onSuccess={onSuccess} // callback when the modal is closed
                      handleVerify={handleVerify} // callback when the proof is received
                      verification_level={VerificationLevel.Device}
                    >
                      {({ open }) => (
                        <button
                          onClick={open}
                          class="flex w-72 items-center text-center gap-x-4 transition-all bg-white border border-gray-200 text-gray-900 h-[50px] px-6 rounded-xl"
                        >
                          <svg
                            width="21"
                            height="21"
                            viewBox="0 0 512 512"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_499_80323)">
                              <path
                                d="M491.846 156.358C478.938 125.854 460.489 98.5154 436.987 75.013C413.485 51.5105 386.085 33.0617 355.642 20.1536C324.041 6.75847 290.553 0 255.97 0C221.447 0 187.898 6.75847 156.297 20.1536C125.793 33.0617 98.4545 51.5105 74.9521 75.013C51.4496 98.5154 33.0008 125.915 20.0928 156.358C6.75847 187.898 0 221.447 0 255.97C0 290.493 6.75847 324.041 20.1536 355.642C33.0617 386.146 51.5105 413.485 75.013 436.987C98.5154 460.489 125.915 478.938 156.358 491.846C187.959 505.181 221.447 512 256.03 512C290.553 512 324.102 505.242 355.703 491.846C386.207 478.938 413.545 460.489 437.048 436.987C460.55 413.485 478.999 386.085 491.907 355.642C505.242 324.041 512.061 290.553 512.061 255.97C512 221.447 505.181 187.898 491.846 156.358ZM170.971 231.919C181.626 191.003 218.889 160.742 263.154 160.742H440.884C452.331 182.844 459.637 206.895 462.499 231.919H170.971ZM462.499 280.02C459.637 305.045 452.27 329.095 440.884 351.197H263.154C218.95 351.197 181.687 320.936 170.971 280.02H462.499ZM108.988 108.988C148.26 69.7158 200.44 48.1008 255.97 48.1008C311.499 48.1008 363.679 69.7158 402.951 108.988C404.169 110.206 405.326 111.423 406.483 112.641H263.154C224.856 112.641 188.872 127.559 161.777 154.653C140.467 175.964 126.706 202.815 121.774 231.98H49.5012C54.7984 185.523 75.4392 142.537 108.988 108.988ZM255.97 463.899C200.44 463.899 148.26 442.284 108.988 403.012C75.4392 369.463 54.7984 326.477 49.5012 280.081H121.774C126.645 309.246 140.467 336.097 161.777 357.408C188.872 384.502 224.856 399.42 263.154 399.42H406.543C405.387 400.637 404.169 401.855 403.012 403.073C363.74 442.223 311.499 463.899 255.97 463.899Z"
                                fill="currentColor"
                              ></path>
                            </g>
                            <defs>
                              <clipPath id="clip0_499_80323">
                                <rect
                                  width="512"
                                  height="512"
                                  fill="white"
                                ></rect>
                              </clipPath>
                            </defs>
                          </svg>
                          <span class="text-base  leading-normal font-sora font-semibold">
                            Continue with Worldcoin
                          </span>
                        </button>
                      )}
                    </IDKitWidget>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <div
            className={`w-full h-full flex bg-[#14161b] lg:justify-between pt-4 md:pt-0  min-h-screen ${
              isClicked == 1 || isClicked == 2 ? "bg-[#212121]  opacity-80" : ""
            }`}
          >
            {!isSidebar ? (
              <div className="md:hidden absolute left-4 top-4 ">
                <button onClick={() => setSidebar(true)}>
                  <svg
                    width="26"
                    height="22"
                    viewBox="0 0 26 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.625 0H25.375V2.75H0.625V0ZM0.625 9.625H17.125V12.375H0.625V9.625ZM0.625 19.25H25.375V22H0.625V19.25Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </div>
            ) : null}

            <div className="lg:w-[24%] md:w-[35%] hidden  md:block bg-[#14161b] ">
              <Sidebar setClicked={setClicked} userProfile={userProfile} />
            </div>
            <div className="lg:w-[55%] md:w-[65%] w-full  h-full flex flex-col  items-center  align-middle bg-[#14161b]">
              {isClicked == 1 ? (
                <CreatePost setClicked={setClicked} userProfile={userProfile} />
              ) : null}

              {isSidebar ? (
                <div className=" block md:hidden w-full">
                  {" "}
                  <Sidebar
                    setClicked={setClicked}
                    setSidebar={setSidebar}
                    isSidebar={isSidebar}
                    userProfile={userProfile}
                  />{" "}
                </div>
              ) : null}
              {children}
            </div>

            <div className="w-[30%] lg:flex hidden bg-[#14161b] mr-4 0">
              <div className="fixed w-[30%] right-2">
                <RightSidebar userProfile={userProfile} />
              </div>{" "}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
