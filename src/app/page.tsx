import { auth } from "@/auth";

const App = async () => {
  const session = await auth();
  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="bg-blue-500 text-white p-10 rounded-lg space-y-4">
        <div className="flex items-center justify-center gap-4 ">
        <h1>{session?.user?.name}</h1>
        <div className="h-10 w-10 rounded-full overflow-hidden">
          <img className="" src={session?.user?.image} alt="" />
        </div>
        </div>
        <p>{session?.user?.email}</p>
        
      </div>
    </div>
  );
};

export default App;
