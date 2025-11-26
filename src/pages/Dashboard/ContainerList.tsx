import type { Container } from "./types";
import { GoContainer } from "react-icons/go";

type ContainerListProps = {
  containers: Container[];
  onContainerClick: (container: Container) => void;
};

export default function ContainerList({
  containers,
  onContainerClick,
}: ContainerListProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "#10b981";
      case "warning":
        return "#f59e0b";
      case "offline":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "active":
        return "Actief";
      case "warning":
        return "Waarschuwing";
      case "offline":
        return "Offline";
      default:
        return "Onbekend";
    }
  };

  return (
    <div className="container-list">
      <h2 className="container-list__title">Containers</h2>
      <div className="container-list__grid">
        {containers.map((container) => (
          <button
            key={container.id}
            className="container-card"
            onClick={() => onContainerClick(container)}
          >
            <div className="container-card__header">
              <span className="container-card__icon">
                <GoContainer />
              </span>
              <span
                className="container-card__status"
                style={{ backgroundColor: getStatusColor(container.status) }}
              />
            </div>
            <h3 className="container-card__name">{container.name}</h3>
            <p className="container-card__status-text">
              {getStatusLabel(container.status)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
