"use client";
// import { BlueCreateWalletButton } from "./smartWalletButton";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { CONTRACT_ADDRESS, PINATA_JWT } from "./constants";
import abi from "./contract/abi.json";
import {
  IDKitWidget,
  VerificationLevel,
  ISuccessResult,
} from "@worldcoin/idkit";
export default function Home() {
  const { address } = useAccount();
  const [worldCoinVerified, setWorldCoinVerified] = useState(false);
  const [isAccount, setIsAccount] = useState();

  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();

  const [newUser, setNewUser] = useState({
    username: "",
    fullname: "",
    bio: "",
    imagecid: "",
    bannercid: "",
  });

  const { data: isAccountData, error: isAccountError } = useReadContract({
    abi,
    address: CONTRACT_ADDRESS,
    functionName: "doesAccountExist",
    args: [address],
  });

  useEffect(() => {
    if (isAccountData !== undefined) {
      console.log("isAccountData:", isAccountData);
      if (isAccountData == true) {
        redirect("/feeds");
      } else {
        setIsAccount(false);
        console.log("Account does not exist");
      }
    }
  }, [isAccountData, isAccountError, address]);

  const {
    data: createUserData,
    error: createUserError,
    isPending: createUserIsPending,
    writeContract: createUserWriteContract,
  } = useWriteContract();

  const createUser = async (cid) => {
    try {
      console.log("createUser function called");

      createUserWriteContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "createUser",
        args: [newUser.username, newUser.fullname, newUser.bio, cid, "null"],
      });

      console.log("createUser function called 2");
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  useEffect(() => {
    console.log("createUserData:", createUserData);
    console.log("createUserError:", createUserError);
    if (createUserData !== undefined) {
      toast.success("User created successfully");
      if (window !== "undefined") {
        location.reload();
      }
    } else if (createUserError !== null) {
      toast.error("Error creating user");
    }
  }, [createUserData, createUserError]);

  function changeHandler(e) {
    setPreview(URL.createObjectURL(e.target.files[0]));
    setSelectedFile(e.target.files[0]);
  }

  const handleSubmission = async () => {
    try {
      console.log(selectedFile);
      const formData = new FormData();
      formData.append("file", selectedFile);
      const metadata = JSON.stringify({
        name: "File name",
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${PINATA_JWT}`,
          },
          body: formData,
        }
      );
      const resData = await res.json();
      console.log("image response", resData.IpfsHash);
      return resData.IpfsHash;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const onSuccess = (res) => {
    setWorldCoinVerified(true);
    toast.success("Successfully Verified By World Coin");
    // window.location.href = "/feeds";
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
    console.log(res);
  };

  return (
    <>
      <div className="flex jus justify-center h-[100vh] width-[100vw] align-middle  lg:hidden">
        <h1 className=" m-auto p-6 text-center">
          Currently, Wizz UI works only with large screen devices.
        </h1>
      </div>
      <div className="hidden  h-[80%] sm:hidden md:hidden lg:flex">
        <div className="w-full h-[100vh] flex-[0.7]  flex flex-col justify-center  align-middle p-32">
          <div className="flex justify-between w-full ">
            <div className="m-4">
              <div className="text-white text-3xl font-bold">
                Create your account | Login
              </div>
              <div className="text-white">get started with wizz</div>
            </div>
            <div>
              <div className="w-48">
                <div className="space-y-6  py-4 bottom-0 flex flex-col ">
                  {!worldCoinVerified ? (
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
                          class="flex w-72 translate-x-[-6rem] items-center text-center gap-x-4 transition-all bg-white border border-gray-200 text-gray-900 h-[50px] px-6 rounded-xl"
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
                  ) : (
                    <ConnectButton />
                  )}
                </div>
              </div>
            </div>
          </div>
          {address && isAccount == false ? (
            <>
              <div className="flex md:flex-row flex-col">
                <input
                  type="text"
                  onChange={(e) =>
                    setNewUser({ ...newUser, fullname: e.target.value })
                  }
                  className="appearance-none block w-full bg-[#34374D]  text-white rounded-xl py-4 px-4 m-4 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Display Name"
                />
                <input
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  type="text"
                  className="appearance-none block w-full bg-[#34374D]  text-white rounded-xl py-4 px-4 m-4 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Username"
                />
              </div>
              <div className="flex">
                <input
                  onChange={(e) =>
                    setNewUser({ ...newUser, bio: e.target.value })
                  }
                  className="appearance-none block w-full bg-[#34374D]  text-white rounded-xl py-4 px-4 m-4 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write a crazy bio"
                />
              </div>
              <div className="flex md:flex-row flex-col">
                <input
                  type="file"
                  onChange={changeHandler}
                  className="appearance-none block w-full bg-[#34374D]  text-white rounded-xl py-4 px-4 m-4 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Choose Profile Image"
                />
              </div>
              <div className="w-[30%] m-4">
                <div className="space-y-6 py-4 bottom-0 flex flex-col ">
                  <button
                    onClick={async () => {
                      try {
                        const cid = await handleSubmission();
                        console.log("CID", cid);
                        await createUser(cid);
                      } catch (error) {
                        console.error("Error during submission:", error);
                      }
                    }}
                    className="bg-[#7501E9] py-3  w-[90%] text text-white border-none  rounded-xl"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="flex-[0.5] h-[100vh] ">
          <div className="  bg-[url(https://w0.peakpx.com/wallpaper/914/142/HD-wallpaper-cool-blue-purple-abstract-dark-glow-loveurhunny-pink.jpg)] top-[6rem] right-[16rem] flex flex-col justify-between h-[100vh] bg-cover pl-20">
            <div className="h-36 w-36 mt-60">
              {address &&
              preview &&
              preview !== null &&
              preview !== "" &&
              preview !== "null" &&
              preview !== undefined ? (
                <img
                  className="rounded-full h-36 w-36 object-cover"
                  src={preview}
                />
              ) : (
                <></>
              )}
            </div>
            <div className="text-white pb-20">
              <div className="font-medium text-lg text-opacity-60">
                Welcome to
              </div>
              <div className="font-bold text-2xl text-opacity-90">Wizz</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
