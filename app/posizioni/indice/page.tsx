import { OpportunityDirectory, directoryMetadata } from "@/app/components/OpportunityDirectory";

export const metadata = directoryMetadata(1);
export default function Page() { return <OpportunityDirectory />; }
