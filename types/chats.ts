// Definisikan tipe untuk bagian konten
export interface Part {
  text: string;
}

export interface Message {
  role: "user" | "model";
  parts: { text: string }[];
  answer?: string;
  examples?: string[];
  regulations?: string[];
  references?: { uri: string }[];
}
