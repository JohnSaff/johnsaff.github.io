function CardIndicators(props) {
  return (
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "white",
        color: "black",
        margin:5
      }}
      onClick={()=>{props.setActive(props.number)}}
    >
      {props.number+1}
    </div>
  );
}

export default CardIndicators;
