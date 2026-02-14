"use client";

import { useState, FormEvent } from "react";

type Props = {
  uploading: boolean;
  onUpload: (file: File, title: string) => Promise<void>;
};

export function VideoUploadForm({ uploading, onUpload }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !title) return alert("ファイルとタイトルを選択をしてください。");

    await onUpload(file, title);
    setTitle("");
    setFile(null);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mb-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            タイトル
          </label>
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
          <label className="block text-sm font-medium text-gray-700">
            動画ファイル
          </label>
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
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {uploading ? "アップロード中..." : "アップロードする"}
        </button>
      </form>
    </div>
  );
}
