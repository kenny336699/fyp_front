import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { createProject } from "../services/blockchain";
import { useGlobalState, setGlobalState } from "../store";
import GlobalStateKeys from "../constants";
import { registerOrganization } from "../services/api";
import axios from "axios";

const OrganizationForm = () => {
  const [origaniztionLoginModel] = useGlobalState(
    GlobalStateKeys.OrganizationLoginModel
  );
  const [origaniztion] = useGlobalState(GlobalStateKeys.Origaniztion);
  const [connectedAccount] = useGlobalState("connectedAccount");
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (connectedAccount) {
      if (isSignUp) {
        try {
          const userData = {
            username,
            password,
            name,
            contactName,
            contactEmail,
            website,
            address,
            phone,
            walletAddress,
          };
          console.log("userData", userData);
          const response = await axios.post(
            "http://localhost:10888/api/v1/organization/register",
            userData
          );
          console.log("Registration successful:", response.data);
          if (response.data.success) {
            toast.success("Registration successful");
            onClose();
          }
        } catch (error) {
          console.log("error", error);
        }
      } else {
        const userData = {
          username,
          password,
        };
        const response = await axios.post(
          "http://localhost:10888/api/v1/organization/login",
          userData
        );
        console.log("login successful:", response.data);
        if (response.data.success) {
          setGlobalState(GlobalStateKeys.Origaniztion, response.data.data[0]);
          console.log("origaniztion", origaniztion);
          toast.success("login successful");
          onClose();
        }
      }
    }
  };

  const onClose = () => {
    setGlobalState(GlobalStateKeys.OrganizationLoginModel, "scale-0");
    setIsSignUp(false);
    resetForm();
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setName("");
    setContract("");
    setWebsite("");
    setEmail("");
    setAddress("");
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex
    items-center justify-center bg-black bg-opacity-50
    transform transition-transform duration-300 ${origaniztionLoginModel}`}
    >
      <div
        className={
          isSignUp
            ? `bg-white shadow-xl shadow-black  rounded-xl  w-11/12 md:w-3/5  p-6  md:overflow-auto 
          md:h-2/3`
            : `bg-white shadow-xl shadow-black  rounded-xl  w-11/12 md:w-3/5  p-6  md:overflow-auto 
          `
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-semibold">
              {isSignUp ? "Organization Sign up" : "Organization Login"}
            </p>
            <button
              onClick={onClose}
              type="button"
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>
          <p className="ml-1">Username</p>
          <div
            className="flex justify-between items-center
          bg-gray-300 rounded-xl "
          >
            <input
              className="block w-full bg-transparent
            border-0 text-sm text-slate-500 focus:outline-none
            focus:ring-0"
              type="text"
              name="username"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
            />
          </div>
          <p className="ml-1">Password</p>
          <div
            className="flex justify-between items-center
          bg-gray-300 rounded-xl "
          >
            <input
              className="block w-full bg-transparent
            border-0 text-sm text-slate-500 focus:outline-none
            focus:ring-0"
              type="text"
              name="Password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>
          {isSignUp && (
            <>
              <p className="ml-1">Organization Name</p>
              <div
                className="flex justify-between items-center
          bg-gray-300 rounded-xl "
              >
                <input
                  className="block w-full bg-transparent
            border-0 text-sm text-slate-500 focus:outline-none
            focus:ring-0"
                  type="text"
                  name="Name"
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                />
              </div>
              <p className="ml-1">Contact Name</p>
              <div
                className="flex justify-between items-center
          bg-gray-300 rounded-xl "
              >
                <input
                  className="block w-full bg-transparent
            border-0 text-sm text-slate-500 focus:outline-none
            focus:ring-0"
                  type="text"
                  name="Contact Name"
                  placeholder="Contact Name"
                  onChange={(e) => setContactName(e.target.value)}
                  value={contactName}
                  required
                />
              </div>
              <p className="ml-1">Email</p>
              <div
                className="flex justify-between items-center
          bg-gray-300 rounded-xl "
              >
                <input
                  className="block w-full bg-transparent
            border-0 text-sm text-slate-500 focus:outline-none
            focus:ring-0"
                  type="text"
                  name="email"
                  placeholder="email"
                  onChange={(e) => setContactEmail(e.target.value)}
                  value={contactEmail}
                  required
                />
              </div>
              <p className="ml-1">Website</p>
              <div
                className="flex justify-between items-center
          bg-gray-300 rounded-xl "
              >
                <input
                  className="block w-full bg-transparent
            border-0 text-sm text-slate-500 focus:outline-none
            focus:ring-0"
                  type="text"
                  name="Contract"
                  placeholder="Contract"
                  onChange={(e) => setWebsite(e.target.value)}
                  value={website}
                  required
                />
              </div>
              <p className="ml-1">address</p>
              <div
                className="flex justify-between items-center
          bg-gray-300 rounded-xl "
              >
                <input
                  className="block w-full bg-transparent
            border-0 text-sm text-slate-500 focus:outline-none
            focus:ring-0"
                  type="text"
                  name="address"
                  placeholder="address"
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                  required
                />
              </div>
              <p className="ml-1">Phone</p>
              <div
                className="flex justify-between items-center
          bg-gray-300 rounded-xl "
              >
                <input
                  className="block w-full bg-transparent
            border-0 text-sm text-slate-500 focus:outline-none
            focus:ring-0"
                  type="text"
                  name="Phone"
                  placeholder="website"
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  required
                />
              </div>
              <p className="ml-1">Wallet Address</p>
              <div
                className="flex justify-between items-center
          bg-gray-300 rounded-xl "
              >
                <input
                  className="block w-full bg-transparent
            border-0 text-sm text-slate-500 focus:outline-none
            focus:ring-0"
                  type="text"
                  name="Wallet Address"
                  placeholder="Wallet Address"
                  onChange={(e) => setWalletAddress(e.target.value)}
                  value={connectedAccount}
                  required
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="inline-block mt-2 px-6 py-2.5 bg-yellow-300
            text-white font-medium text-md leading-tight
            rounded-full shadow-md hover:bg-green-700 "
          >
            {!isSignUp ? "Login" : "Sign up"}
          </button>
          {!isSignUp && (
            <>
              <p>
                No account?{" "}
                <a
                  onClick={() => {
                    setIsSignUp(true);
                  }}
                >
                  Sign up Now
                </a>
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default OrganizationForm;
