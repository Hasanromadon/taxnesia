import { LucideProps } from "lucide-react";

export interface Topic {
  id: string;
  label: string;
  icon: React.FC<LucideProps>;
  color: string;
}
