// Definisikan tipe untuk bagian konten
export interface Part {
  text: string;
}

export interface Message {
  role: "user" | "model";
  fileUrl?: string; // ← only used for image preview
  parts: { text: string }[];
  answer?: string;
  examples?: string[];
  regulations?: string[];
  references?: { uri: string }[];
}
