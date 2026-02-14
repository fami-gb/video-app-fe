import type { Video } from "@/types/video";

type Props = {
  video: Video;
  onDelete: (id: number) => void;
};

export function VideoCard({ video, onDelete }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow relative group">
      {/* 削除ボタン */}
      <button
        onClick={() => onDelete(video.ID)}
        className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-red-600 text-white p-2 rounded-full transition-colors duration-200"
        title="削除する"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>

      <h2 className="text-lg font-bold mb-2 pr-8 truncate">{video.title}</h2>
      <video
        src={video.url}
        controls
        className="w-full h-48 object-cover rounded bg-black"
      />
    </div>
  );
}
