import "./spinner.css";

export default function Spinner() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
      <span className="loader"></span>
    </div>
  );
}
