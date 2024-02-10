import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="absolute top-10 mx-auto ">
     <Loader className="animate-spin text-blue-600 " size={30}/>
    </div>
  );
}
