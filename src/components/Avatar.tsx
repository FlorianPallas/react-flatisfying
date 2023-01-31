export default function Avatar({ name, size }: { name: string; size: number }) {
  return (
    <img
      src={`https://api.dicebear.com/5.x/initials/svg?seed=${name}&size=${size}&radius=50`}
      alt={`Avatar of ${name}`}
      height={size}
      width={size}
    />
  );
}
