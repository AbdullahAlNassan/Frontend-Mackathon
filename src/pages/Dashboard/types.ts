export type BackendDevice = {
  deviceId: string;
  online: boolean;
  lastSeen: string | null;
  alert: {
    level: "ok" | "warning" | "critical";
    reasons: string[];
    updatedAt: string | null;
  };
};

export type Container = {
  id: string; // deviceId
  name: string;
  lat: number;
  lng: number;
  status?: "active" | "warning" | "offline";
};
