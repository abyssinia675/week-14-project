export default function StatusMessage({ message, type = "info" }) {
  if (!message) {
    return null;
  }

  return <p className={`status status-${type}`}>{message}</p>;
}
