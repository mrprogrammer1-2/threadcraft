import Form from "next/form";
import SearchBtn from "./SearchBtn";
import { Search } from "lucide-react";

export default function SearchBar({
  action,
  userId,
  defaultSearch,
}: {
  action: string;
  userId?: string;
  defaultSearch?: string;
}) {
  return (
    <Form action={action} className="flex gap-2 items-center">
      {userId && <input type="hidden" name="userId" value={userId} />}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
        <input
          name="search"
          type="text"
          defaultValue={defaultSearch ?? ""}
          placeholder="Search..."
          className="w-full bg-surface border border-border pl-9 pr-4 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-sienna/60 transition-colors"
        />
      </div>
      <SearchBtn />
    </Form>
  );
}
