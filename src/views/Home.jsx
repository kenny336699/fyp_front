import { useEffect } from "react";
import AddButton from "../components/AddButton";
import CreateProject from "../components/CreateProject";
import OrganizationForm from "../components/OrganizationForm";
import Hero from "../components/Hero";
import Projects from "../components/Projects";
import { loadProjects, refundExpiredProjects } from "../services/blockchain";
import { useGlobalState } from "../store";

const Home = () => {
  const [projects] = useGlobalState("projects");

  useEffect(async () => {
    await loadProjects();
    // const getrefunded = await refundExpiredProjects();
    // console.log(getrefunded);
  }, []);
  return (
    <>
      <Hero />
      <Projects projects={projects} />
      <CreateProject />
      <OrganizationForm />
    </>
  );
};

export default Home;
