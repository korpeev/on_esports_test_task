import "./style.css";

export const Spinner = () => {
  return (
    <div className={"fade-in spinner-container"}>
      <span>Overlay is running...</span>
      <span className="spin" />
    </div>
  );
};
