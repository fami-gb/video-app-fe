"use client";

import { useVideos } from "@/hooks/useVideos";
import { VideoUploadForm } from "@/components/VideoUploadForm";
import { VideoList } from "@/components/VideoList";

export default function Home() {
  const { videos, uploading, uploadVideo, removeVideo } = useVideos();

  return (
    <main className="min-h-screen p-8 bg-gray-100 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-center">
        📺 Video Upload App
      </h1>

      <VideoUploadForm uploading={uploading} onUpload={uploadVideo} />
      <VideoList videos={videos} onDelete={removeVideo} />
    </main>
  );
}
