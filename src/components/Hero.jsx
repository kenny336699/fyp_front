import { setGlobalState, useGlobalState } from "../store";
import GlobalStateKeys from "../constants";

const Hero = () => {
  const [stats] = useGlobalState("stats");
  const [Origaniztion] = useGlobalState(GlobalStateKeys.Origaniztion);
  return (
    <div className="text-center bg-white text-gray-800 py-24 px-6">
      <h1
        className="text-5xl md:text-6xl xl:text-7xl font-bold
      tracking-tight mb-12"
      >
        <span className="capitalize">Blockchain crowdfunding</span>
        <br />
      </h1>

      {Origaniztion && (
        <div className="flex justify-center items-center space-x-2">
          <button
            type="button"
            className="inline-block px-6 py-2.5 bg-yellow-300
        text-white font-medium text-xs leading-tight uppercase
        rounded-full shadow-md hover:bg-green-700"
            onClick={() => setGlobalState("createModal", "scale-100")}
          >
            Add Project
          </button>
        </div>
      )}
    </div>
  );
};

export default Hero;
