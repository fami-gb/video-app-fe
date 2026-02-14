import { useState, useEffect, useCallback } from "react";
import type { Video } from "@/types/video";
import * as api from "@/lib/api-client";

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [uploading, setUploading] = useState(false);

  const loadVideos = useCallback(async () => {
    try {
      const data = await api.fetchVideos();
      setVideos(data);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    }
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  /** 動画をアップロードする（署名付きURL取得 → クラウドへPUT → DB保存） */
  const uploadVideo = useCallback(
    async (file: File, title: string) => {
      setUploading(true);
      try {
        const { uploadUrl, key } = await api.getUploadUrl(file.name);
        await api.uploadFileToCloud(uploadUrl, file);
        await api.saveVideo(title, key);
        alert("アップロード完了");
        await loadVideos();
      } catch (error) {
        console.error(error);
        alert("エラーが発生しました。");
      } finally {
        setUploading(false);
      }
    },
    [loadVideos]
  );

  /** 動画を削除する */
  const removeVideo = useCallback(async (id: number) => {
    if (! confirm("本当にこの動画を削除しますか？\n(クラウド上の動画ファイルも削除されます)")) {
      return;
    }
    try {
      await api.deleteVideo(id);
      setVideos((prev) => prev.filter((v) => v.ID !== id));
    } catch (error) {
      console.error(error);
      alert("削除中にエラーが発生しました。");
    }
  }, []);

  return { videos, uploading, uploadVideo, removeVideo };
}
