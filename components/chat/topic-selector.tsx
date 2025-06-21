import { topicQuestions } from "@/constants/topics";

interface TopicSelectorProps {
  onSelect: (topic: string) => void;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center text-center mt-6">
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Selamat datang di Asisten Pajak Digital
        </h2>
        <p className="text-sm text-gray-600">
          Silakan pilih topik yang tersedia atau ketik pertanyaan Anda terkait
          perpajakan seperti PPh, PPN, PBB, dan lainnya.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {topicQuestions.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onSelect(topic.label)}
            className={`flex items-center justify-start gap-3 rounded-lg px-4 py-3 text-sm shadow transition hover:scale-[1.02] hover:shadow-md focus:outline-none ${topic.color} text-white`}
          >
            <topic.icon className="w-4 h-4" />
            {topic.label}
          </button>
        ))}
      </div>
    </div>
  );
};
