function Placeholder({ source, message }) {
  return (
    <div className="mt-5 w-25 center-div">
      <img src={source} className="w-100" alt="placeholder" />
      <h3 className="text-center">{message}</h3>
    </div>
  );
}

export default Placeholder;
