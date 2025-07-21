import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="size-6 animate-spin mr-2" />
      Loading <span className="animate-pulse">...</span>
    </div>
  );
}