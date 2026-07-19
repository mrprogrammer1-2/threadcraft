import Image from "next/image";

export function RenderObject({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="space-y-2">
      {Object.entries(data).map(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          return (
            <div key={key} className="pl-2 border-l">
              <p className="font-medium capitalize">{key}</p>
              <RenderObject data={value} />
            </div>
          );
        }

        // Detect images
        if (
          typeof value === "string" &&
          (value.includes("cloudinary") || value.startsWith("http"))
        ) {
          return (
            <div key={key} className="space-y-1">
              <p className="text-xs text-muted-foreground capitalize">{key}</p>

              <Image
                src={value}
                alt={key}
                width={120}
                height={120}
                className="rounded-md border"
              />
            </div>
          );
        }

        return (
          <p key={key}>
            <span className="text-muted-foreground capitalize">{key}: </span>
            {String(value)}
          </p>
        );
      })}
    </div>
  );
}
