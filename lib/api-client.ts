import type { Video } from "@/types/video";

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL || "";

/** 動画一覧を取得する */
export async function fetchVideos(): Promise<Video[]> {
  const res = await fetch(`${API_URL}/videos`);
  if (!res.ok) throw new Error("動画一覧の取得に失敗しました。");
  return res.json();
}

/** 署名付きアップロードURLを取得する */
export async function getUploadUrl(
  filename: string
): Promise<{ uploadUrl: string; key: string }> {
  const res = await fetch(`${API_URL}/upload-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename }),
  });
  if (!res.ok) throw new Error("動画保存処理に失敗しました。");
  return res.json();
}

/** ファイルをクラウドへ直接アップロードする */
export async function uploadFileToCloud(
  uploadUrl: string,
  file: File
): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
  });
  if (!res.ok) throw new Error("クラウド保存処理に失敗しました。");
}

/** 動画メタデータをDBに保存する */
export async function saveVideo(title: string, videoKey: string): Promise<void> {
  const res = await fetch(`${API_URL}/videos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, video_key: videoKey }),
  });
  if (!res.ok) throw new Error("データベース保存処理に失敗しました。");
}

/** 動画を削除する */
export async function deleteVideo(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/videos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("削除に失敗しました。");
}
