import { Topic } from "@/types/topic";
import {
  Building,
  Calculator,
  Car,
  FileText,
  TrendingDown,
  Shuffle,
  Gift,
  LineChart,
  FileCheck2,
} from "lucide-react";

export const topicQuestions: Topic[] = [
  {
    id: "pph",
    label: "Pajak Penghasilan (PPh)",
    icon: FileText,
    color: "bg-red-500",
  },
  {
    id: "ppn",
    label: "Pajak Pertambahan Nilai (PPN)",
    icon: Calculator,
    color: "bg-blue-500",
  },
  {
    id: "pbb",
    label: "Pajak Bumi dan Bangunan (PBB)",
    icon: Building,
    color: "bg-green-500",
  },
  {
    id: "kendaraan",
    label: "Pajak Kendaraan",
    icon: Car,
    color: "bg-purple-500",
  },
  {
    id: "biaya",
    label: "Pengakuan Biaya & Beban Pajak",
    icon: FileText,
    color: "bg-yellow-500",
  },
  {
    id: "fasilitas",
    label: "Insentif & Fasilitas Pajak",
    icon: Gift,
    color: "bg-pink-500",
  },
  {
    id: "transferpricing",
    label: "Transfer Pricing",
    icon: Shuffle,
    color: "bg-orange-500",
  },
  {
    id: "pemanfaatanrugi",
    label: "Pemanfaatan Akumulasi Rugi",
    icon: TrendingDown,
    color: "bg-teal-500",
  },
  {
    id: "taxplanning",
    label: "Tax Planning Perusahaan",
    icon: LineChart,
    color: "bg-indigo-500",
  },
  {
    id: "pelaporan",
    label: "Pelaporan & Kepatuhan",
    icon: FileCheck2,
    color: "bg-sky-500",
  },
];
