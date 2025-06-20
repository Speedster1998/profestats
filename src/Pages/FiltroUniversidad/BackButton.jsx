import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="btn p-0 m-0 border-0 bg-transparent text-white"
      onClick={() => navigate(-1)}
    >
      <i className="bi bi-chevron-left fs-1"></i>
    </button>
  );
};

export default BackButton
