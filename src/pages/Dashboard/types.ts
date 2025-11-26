export type Container = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  status?: "active" | "warning" | "offline";
};
