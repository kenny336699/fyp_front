import { TbBusinessplan } from "react-icons/tb";
import { Link } from "react-router-dom";
import { connectWallet, isWallectConnected } from "../services/blockchain";
import { truncate, useGlobalState, setGlobalState } from "../store";
import GlobalStateKeys from "../constants";

const Header = () => {
  const [Origaniztion] = useGlobalState(GlobalStateKeys.Origaniztion);
  const [connectedAccount] = useGlobalState("connectedAccount");
  const copyToClipboard = (text) => {
    console.log("copyToClipboard", text);
    navigator.clipboard.writeText(text);
  };
  return (
    <header
      className="flex justify-between items-center
        p-5 bg-white shadow-lg fixed top-0 left-0 right-0"
    >
      <Link
        to="/"
        className="flex justify-start items-center
      text-xl text-black space-x-1"
      >
        <span>Crowdfunding</span>
      </Link>

      <div className="flex space-x-2 justify-center">
        {Origaniztion == null ? (
          <button
            type="button"
            className="inline-block px-6 py-2.5 bg-yellow-300
            text-white font-medium text-xs leading-tight uppercase
            rounded-full shadow-md hover:bg-green-700"
            onClick={() => {
              if (connectedAccount) {
                setGlobalState(
                  GlobalStateKeys.OrganizationLoginModel,
                  "scale-100"
                );
              } else {
                alert("Please connect wallet.");
              }
            }}
          >
            Organization Login
          </button>
        ) : (
          <button
            type="button"
            className="inline-block px-6 py-2.5 bg-yellow-300
            text-white font-medium text-xs leading-tight uppercase
            rounded-full shadow-md hover:bg-green-700"
            onClick={() => {
              setGlobalState(GlobalStateKeys.Origaniztion, null);
            }}
          >
            Logout
          </button>
        )}
        {connectedAccount ? (
          <button
            type="button"
            className="inline-block px-6 py-2.5 bg-yellow-300
            text-white font-medium text-xs leading-tight uppercase
            rounded-full shadow-md hover:bg-green-700"
            onClick={() => {
              copyToClipboard(connectedAccount);
            }}
          >
            {truncate(connectedAccount, 4, 4, 11)}
          </button>
        ) : (
          <button
            type="button"
            className="inline-block px-6 py-2.5 bg-yellow-300
            text-white font-medium text-xs leading-tight uppercase
            rounded-full shadow-md hover:bg-green-700"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
