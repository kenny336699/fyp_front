import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { backProject } from "../services/blockchain";
import { useGlobalState, setGlobalState } from "../store";

const BackProject = ({ project }) => {
  const [backModal] = useGlobalState("backModal");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount) return;

    await backProject(project?.id, amount, email);
    toast.success("Project backed successfully, will reflect in 30sec.");
    setGlobalState("backModal", "scale-0");
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex
    items-center justify-center bg-black bg-opacity-50
    transform transition-transform duration-300 ${backModal}`}
    >
      <div
        className="bg-white shadow-xl shadow-black
        rounded-xl w-11/12 md:w-2/5 h-7/12 p-6"
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-semibold">{project?.title}</p>
            <button
              onClick={() => setGlobalState("backModal", "scale-0")}
              type="button"
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>

          <div
            className="flex justify-between items-center
          bg-gray-300 rounded-xl mt-5"
          >
            <input
              className="block w-full bg-transparent
            border-0 text-sm text-slate-500 focus:outline-none
            focus:ring-0"
              type="number"
              step={0.001}
              min={0.001}
              name="amount"
              placeholder="Amount (ETH)"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
              required
            />
          </div>
          <div
            className="flex justify-between items-center
          bg-gray-300 rounded-xl mt-5"
          >
            <input
              className="block w-full bg-transparent
            border-0 text-sm text-slate-500 focus:outline-none
            focus:ring-0"
              type="text"
              name="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
          <button
            type="submit"
            className="inline-block px-6 py-2.5 bg-yellow-300
            text-white font-medium text-md leading-tight
            rounded-full shadow-md hover:bg-green-700 mt-5"
          >
            Donate
          </button>
        </form>
      </div>
    </div>
  );
};

export default BackProject;
