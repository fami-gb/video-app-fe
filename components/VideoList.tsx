import type { Video } from "@/types/video";
import { VideoCard } from "@/components/VideoCard";

type Props = {
  videos: Video[];
  onDelete: (id: number) => void;
};

export function VideoList({ videos, onDelete }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoCard key={video.ID} video={video} onDelete={onDelete} />
      ))}
    </div>
  );
}
