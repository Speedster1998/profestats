import { useNavigate } from "react-router-dom";

const BackButton = ({ to = -1 }) => {
  const navigate = useNavigate();

  return (
    <button
      className="btn p-0 m-0 border-0 bg-transparent text-white"
      onClick={() => navigate(to)}
    >
      <i className="bi bi-chevron-left fs-1"></i>
    </button>
  );
};

export default BackButton
