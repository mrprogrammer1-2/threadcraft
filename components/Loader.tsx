import { Spinner } from "@/components/ui/spinner";

export default function loading() {
  return (
    <div className="min-h-dvh flex items-center justify-center">
      <Spinner className="size-14 text-sky-400" />
    </div>
  );
}
