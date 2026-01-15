"use client";

import { useState, FormEvent, useEffect } from "react";

type Video = {
  ID: number;
  title: string;
  url: string;
};

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL || "";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch(API_URL + "/videos");
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !title) return alert("ファイルとタイトルを選択をしてください。");

    setLoading(true);
    try {
      const urlRes = await fetch(API_URL + "/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name }),
      });

      if (!urlRes.ok) throw new Error("動画保存処理に失敗しました。");
      const { uploadUrl, key } = await urlRes.json();

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
      });

      if (!uploadRes.ok) throw new Error("クラウド保存処理に失敗しました。");

      const saveRes = await fetch(API_URL + "/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, video_key: key }),
      });

      if (!saveRes.ok) throw new Error("データベース保存処理に失敗しました。");

      alert("アップロード完了");
      setTitle("");
      setFile(null);
      fetchVideos();

    } catch (error) {
      console.error(error);
      alert("エラーが発生しました。")
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("本当にこの動画を削除しますか？\n(クラウド上の動画ファイルも削除されます)")) {
      return;
    }

    try {
      const res = await fetch(API_URL + `/videos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("削除に失敗しました。");

      setVideos((prev) => prev.filter((video) => video.ID !== id));
    } catch (error) {
      console.error(error);
      alert("削除中にエラーが発生しました。");
    }
  };

  return (
      <main className="min-h-screen p-8 bg-gray-100 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-center">📺 Video Upload App</h1>

      {/* アップロードフォーム */}
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mb-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">タイトル</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="動画のタイトル"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">動画ファイル</label>
            <input
              type="file"
              accept="video/*"
              className="mt-1 block w-full text-sm text-gray-500"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? "アップロード中..." : "アップロードする"}
          </button>
        </form>
      </div>

      {/* 動画一覧表示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          // relative をつけて、中の絶対配置(absolute)の基準にする
          <div key={video.ID} className="bg-white p-4 rounded-lg shadow relative group">
            
            {/* --- ここから削除ボタン --- */}
            <button
              onClick={() => handleDelete(video.ID)}
              className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-red-600 text-white p-2 rounded-full transition-colors duration-200"
              title="削除する"
            >
              {/* ゴミ箱のSVGアイコン */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            {/* --- ここまで削除ボタン --- */}

            <h2 className="text-lg font-bold mb-2 pr-8 truncate">{video.title}</h2>
            <video
              src={video.url}
              controls
              className="w-full h-48 object-cover rounded bg-black"
            />
          </div>
        ))}
      </div>
    </main>
  );
}
