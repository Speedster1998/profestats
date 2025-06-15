import '../Boton/Boton.css';

const Boton = ({ texto, tipo = 'button', onClick, width = '440px', height = '65px' }) => {
  const style = {
    width,
    height,
  };

  return (
    <button type={tipo} className="btn-primary" onClick={onClick} style={style}>
      {texto}
    </button>
  );
};

export default Boton;
