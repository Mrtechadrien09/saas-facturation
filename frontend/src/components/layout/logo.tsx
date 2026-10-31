import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <Image
        src="/logo.svg"
        alt="Logo Simplifact"
        width={180}
        height={52}
        priority
        className="h-10 w-auto"
      />
    </div>
  );
}
