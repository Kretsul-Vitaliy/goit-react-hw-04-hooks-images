import { LoaderWrap } from "./Loader.styled";
import { Rings } from "react-loader-spinner";
const Loader = () => {
  return (
    <LoaderWrap>
      <Rings color="#00BFFF" height={150} width={150} />
    </LoaderWrap>
  );
};

export default Loader;
