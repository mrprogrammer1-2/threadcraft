"use client";

import { CldUploadWidget } from "next-cloudinary";

type Props = {
  onUpload: (url: string) => void;
};

export default function UploadProductImage({ onUpload }: Props) {
  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
      onSuccess={(result: any) => {
        const url = result.info.secure_url;
        onUpload(url);
      }}
    >
      {({ open }) => {
        return (
          <button
            type="button"
            onClick={() => open()}
            className="px-4 py-2 border rounded-md text-(--cream)"
          >
            Upload Image
          </button>
        );
      }}
    </CldUploadWidget>
  );
}
